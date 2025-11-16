import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all donations with user information
    const donations = await db.donation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            bloodGroup: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ donations });
  } catch (error) {
    console.error('All donations fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}