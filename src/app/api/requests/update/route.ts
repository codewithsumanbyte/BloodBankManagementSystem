import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { requestId, status, notes } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'FULFILLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the current request
    const currentRequest = await db.request.findUnique({
      where: { id: requestId },
      include: {
        requester: true
      }
    });

    if (!currentRequest) {
      return NextResponse.json(
        { error: 'Blood request not found' },
        { status: 404 }
      );
    }

    // Update request status
    const updatedRequest = await db.request.update({
      where: { id: requestId },
      data: {
        status,
        notes: notes || currentRequest.notes
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    // If request is approved and fulfilled, update inventory
    if (status === 'FULFILLED' && currentRequest.status !== 'FULFILLED') {
      const bloodGroup = currentRequest.bloodGroup;
      const units = currentRequest.units;
      
      // Find inventory record for this blood group
      const inventory = await db.inventory.findUnique({
        where: { bloodGroup }
      });

      if (inventory && inventory.quantity >= units) {
        // Update inventory by reducing the quantity
        await db.inventory.update({
          where: { bloodGroup },
          data: {
            quantity: {
              decrement: units
            }
          }
        });
      } else {
        // If not enough inventory, revert the status
        await db.request.update({
          where: { id: requestId },
          data: {
            status: currentRequest.status
          }
        });
        
        return NextResponse.json(
          { 
            error: 'Insufficient blood units in inventory' 
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        message: 'Blood request status updated successfully', 
        request: updatedRequest 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blood request update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}