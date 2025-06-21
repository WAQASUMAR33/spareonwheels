import prisma from '../../util/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { make, image } = data;

    if (!make || !image) {
      return NextResponse.json(
        { error: 'Make and image fields are required' },
        { status: 400 }
      );
    }

    // Create a new Make record in the database
    const newMake = await prisma.make.create({
      data: {
        make,
        image,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newMake, { status: 201 });
  } catch (error) {
    console.error('Error creating Make record:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allMakes = await prisma.make.findMany();
    return NextResponse.json(allMakes, { status: 200 });
  } catch (error) {
    console.error('Error fetching Make records:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
