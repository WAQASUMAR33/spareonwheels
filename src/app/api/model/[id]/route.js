import prisma from '../../../util/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const  id  = parseInt(params.id);

  console.log("id to be fetched is : ",id);
  try {
    const make = await prisma.model.findUnique({
      where: { id },
    });

    if (!make) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(make);
  } catch (error) {
    console.error('Error fetching Model by ID:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();
  const { makeId,model } = data;

 

  try {
    const updatedMake = await prisma.model.update({
      where: { id : parseInt(id) },
      data: {
        makeId,
        model,
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
    await prisma.model.delete({
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
