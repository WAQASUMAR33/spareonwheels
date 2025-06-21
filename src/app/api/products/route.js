import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
export async function POST(request) {
  try {
    const {
      name,
      description,
      discount,
      price,
      categorySlug, // Foreign key to Category's slug
      image,
      meta_title,
      meta_description,
      meta_keywords,
    } = await request.json();

    // Validate required fields
    if (!name || !description || !price || !categorySlug) {
      return NextResponse.json(
        {
          status: false,
          message: 'Missing required fields.',
        },
        { status: 400 }
      );
    }

    // Check if the categorySlug exists in the `Category` table
    const existingCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (!existingCategory) {
      return NextResponse.json(
        {
          status: false,
          message: 'Category with the provided slug does not exist.',
        },
        { status: 400 }
      );
    }

    // Create new service
    const newService = await prisma.services.create({
      data: {
        name,
        description,
        discount: discount ? parseFloat(discount) : null,
        price: parseFloat(price),
        categorySlug, // Connects to the `slug` field in the `Category` model
        image,
        meta_title,
        meta_description,
        meta_keywords,
      },
    });

    return NextResponse.json(
      {
        status: true,
        message: 'Service created successfully',
        data: newService,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      {
        message: 'Failed to create service',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const products = await prisma.$queryRaw`SELECT * FROM Services`;
    return NextResponse.json(products);
  } catch (error) {
    console.log('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}
