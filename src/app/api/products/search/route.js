import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function POST(request) {
  try {
    // Parse request body
    const { searchtext, make, model, year, type } = await request.json();

    // const searchtext = "Head Light"
    console.log("Search text",searchtext, "make",make, "model",model, "year",year, "type",type)
    // Build filters
    const filters = {};

    if (searchtext && searchtext !== 'Any') {
      // Convert searchtext to lowercase and use Prisma’s SQL raw query for case-insensitive search
      filters.name = {
        contains: searchtext.toLowerCase(), // Prisma will perform a standard contains match
      };
    }

    if (type && type !== 'Any') {
      filters.type = type;
    }
    if (make && make !== 'Any') {
      filters.makeId = parseInt(make, 10);
    }
    if (model && model !== 'Any') {
      filters.modelId = parseInt(model, 10);
    }
    if (year && year !== 'Any') {
      filters.yearId = parseInt(year, 10);
    }

    // Fetch products using Prisma with the filters
    const products = await prisma.product.findMany({
      where: filters,
      include: {
        images: true, // Include images if necessary
        make: true,   // Include make relation
        model: true,  // Include model relation
        year: true,   // Include year relation
      },
    });

    // Format the response if needed
    const formattedProducts = products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url), // Extract image URLs
    }));

    return NextResponse.json(
      { data: formattedProducts, status: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products', error: error.message, status: false },
      { status: 500 }
    );
  }
}
