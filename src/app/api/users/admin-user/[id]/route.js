import prisma from '../../../../util/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const id = parseInt(params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", status: false },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  const id = parseInt(params.id);
  console.log("Received id is: ", id);

  try {
    const data = await request.json();
    const { email, password, name, role, phoneno, city, status } = data;

    // Check if there is already a SUPERADMIN
    console.log("user status is : ",role)
    if (role === "SUPERADMIN") {
      const existingSuperAdmin = await prisma.user.findFirst({
        where: {
          role: "SUPERADMIN",
        },
      });

      if (existingSuperAdmin) {
        return NextResponse.json(
          { message: "There can only be one SUPERADMIN", status: false },
          { status: 400 }
        );
      }
    }

    // Update the user if the SUPERADMIN check passes
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email, password, name, role, phoneno, city, status, updatedAt: new Date() },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", status: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);
  try {
    const deleteUser = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json(deleteUser);
  } catch (error) {
    console.log("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", status: false },
      { status: 500 }
    );
  }
}
