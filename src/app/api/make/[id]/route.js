import prisma from '../../../util/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const  id  = parseInt(params.id);

  try {
    const make = await prisma.make.findUnique({
      where: { id },
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
  // const { id } = params;
  const  id  = parseInt(params.id);
  const data = await request.json();
  const { make, image } = data;

  if (!make || !image) {
    return NextResponse.json(
      { error: 'Make and image fields are required' },
      { status: 400 }
    );
  }

  try {
    const updatedMake = await prisma.make.update({
      where: { id },
      data: {
        make,
        image,
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
  const  id  = parseInt(params.id);

  try {
    await prisma.make.delete({
      where: { id },
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
