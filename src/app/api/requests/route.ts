import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { requesterId, bloodGroup, units, reason, notes } = await request.json();

    if (!requesterId || !bloodGroup || !units) {
      return NextResponse.json(
        { error: 'Requester ID, blood group, and units are required' },
        { status: 400 }
      );
    }

    // Check if user exists and is a recipient
    const user = await db.user.findUnique({
      where: { id: requesterId }
    });

    if (!user || user.role !== 'RECIPIENT') {
      return NextResponse.json(
        { error: 'Only recipients can create blood requests' },
        { status: 403 }
      );
    }

    // Check if units is a positive number
    if (units <= 0) {
      return NextResponse.json(
        { error: 'Units must be a positive number' },
        { status: 400 }
      );
    }

    // Create blood request
    const bloodRequest = await db.request.create({
      data: {
        requesterId,
        bloodGroup,
        units,
        reason: reason || null,
        notes: notes || null,
        status: 'PENDING'
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

    return NextResponse.json(
      { message: 'Blood request created successfully', request: bloodRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Blood request creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requesterId = searchParams.get('requesterId');

    if (!requesterId) {
      return NextResponse.json(
        { error: 'Requester ID is required' },
        { status: 400 }
      );
    }

    // Get user's blood requests
    const requests = await db.request.findMany({
      where: { requesterId },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Blood requests fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}