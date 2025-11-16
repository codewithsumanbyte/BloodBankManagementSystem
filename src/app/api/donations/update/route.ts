import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { donationId, status, notes } = await request.json();

    if (!donationId || !status) {
      return NextResponse.json(
        { error: 'Donation ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the current donation
    const currentDonation = await db.donation.findUnique({
      where: { id: donationId },
      include: {
        user: true
      }
    });

    if (!currentDonation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Update donation status
    const updatedDonation = await db.donation.update({
      where: { id: donationId },
      data: {
        status,
        notes: notes || currentDonation.notes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            bloodGroup: true
          }
        }
      }
    });

    // If donation is completed, update inventory
    if (status === 'COMPLETED' && currentDonation.user.bloodGroup) {
      const bloodGroup = currentDonation.user.bloodGroup;
      
      // Find or create inventory record for this blood group
      const inventory = await db.inventory.upsert({
        where: { bloodGroup },
        update: {
          quantity: {
            increment: 1
          }
        },
        create: {
          bloodGroup,
          quantity: 1
        }
      });
    }

    return NextResponse.json(
      { 
        message: 'Donation status updated successfully', 
        donation: updatedDonation 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Donation update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}