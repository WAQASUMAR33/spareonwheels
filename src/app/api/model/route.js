import prisma from '../../util/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const {makeId, model } = data;


    // Create a new Make record in the database
    const newmodel = await prisma.model.create({
      data: {
        makeId,
        model,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newmodel, { status: 201 });
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
    const allmodels= await prisma.model.findMany();
    return NextResponse.json(allmodels, { status: 200 });
  } catch (error) {
    console.error('Error fetching Make records:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
