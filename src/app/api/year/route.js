import prisma from '../../util/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { year } = data;


    // Create a new Make record in the database
    const newyear = await prisma.year.create({
      data: {
        year,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newyear, { status: 201 });
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
    const allyears= await prisma.year.findMany();
    return NextResponse.json(allyears, { status: 200 });
  } catch (error) {
    console.error('Error fetching Make records:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
