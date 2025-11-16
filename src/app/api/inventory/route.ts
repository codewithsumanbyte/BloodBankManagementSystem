import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all inventory items
    const inventory = await db.inventory.findMany({
      orderBy: {
        bloodGroup: 'asc'
      }
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bloodGroup, quantity } = await request.json();

    if (!bloodGroup || quantity === undefined) {
      return NextResponse.json(
        { error: 'Blood group and quantity are required' },
        { status: 400 }
      );
    }

    // Check if quantity is a positive number
    if (quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    // Update or create inventory record
    const inventory = await db.inventory.upsert({
      where: { bloodGroup },
      update: {
        quantity
      },
      create: {
        bloodGroup,
        quantity
      }
    });

    return NextResponse.json(
      { 
        message: 'Inventory updated successfully', 
        inventory 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Inventory update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}