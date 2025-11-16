import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Donations API received body:', body);
    
    const { date, notes, userId } = body;

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'User ID and date are required' },
        { status: 400 }
      );
    }

    // Check if user exists and is a donor
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'DONOR') {
      return NextResponse.json(
        { error: 'Only donors can create donation appointments' },
        { status: 403 }
      );
    }

    console.log('Creating donation for user:', user);

    // Create donation appointment
    const donation = await db.donation.create({
      data: {
        userId,
        date: new Date(date),
        notes: notes || null,
        status: 'PENDING'
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

    console.log('Donation created successfully:', donation);

    return NextResponse.json(
      { message: 'Donation appointment created successfully', donation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Donation creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's donations
    const donations = await db.donation.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            bloodGroup: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ donations });
  } catch (error) {
    console.error('Donations fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}