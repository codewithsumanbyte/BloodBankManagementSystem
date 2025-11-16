import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Initialize inventory with default values
    const bloodGroups = [
      'A_POSITIVE', 'A_NEGATIVE', 
      'B_POSITIVE', 'B_NEGATIVE', 
      'AB_POSITIVE', 'AB_NEGATIVE', 
      'O_POSITIVE', 'O_NEGATIVE'
    ];

    const results = [];
    
    for (const bloodGroup of bloodGroups) {
      // Check if inventory item already exists
      const existing = await db.inventory.findUnique({
        where: { bloodGroup }
      });

      if (!existing) {
        // Create new inventory item with default quantity
        const inventory = await db.inventory.create({
          data: {
            bloodGroup,
            quantity: Math.floor(Math.random() * 50) + 10 // Random quantity between 10-60
          }
        });
        results.push(inventory);
      } else {
        results.push(existing);
      }
    }

    return NextResponse.json(
      { 
        message: 'Inventory initialized successfully', 
        inventory: results 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Inventory initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}