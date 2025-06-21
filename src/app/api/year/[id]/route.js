import prisma from '../../../util/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  console.log("id to be update is : ",id);
  try {
    const make = await prisma.year.findUnique({
      where: { id : parseInt(id,10) },
    });

    if (!make) {
      return NextResponse.json(
        { error: 'Make not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(make);
  } catch (error) {
    console.error('Error fetching make by ID:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();
  const { year } = data;

 

  try {
    const updatedMake = await prisma.year.update({
      where: { id : parseInt(id) },
      data: {
        year,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedMake);
  } catch (error) {
    console.error('Error updating make:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.year.delete({
      where: { id : parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Make deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting make:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
