import { NextResponse } from 'next/server';
import prisma from '../../../../util/prisma';

// This function will be used to handle GET requests for the dynamic route
export async function GET(req, { params }) {
  const { makeId, modelId } = params;  // Extract makeId and modelId from the URL parameters

  try {
    // Validate the received parameters
    if (!makeId || !modelId) {
      return NextResponse.json({ error: 'makeId and modelId are required' }, { status: 400 });
    }

    // Fetch distinct yearIds from the Product table based on makeId and modelId
    const productYears = await prisma.product.findMany({
      where: {
        makeId: parseInt(makeId),
        modelId: parseInt(modelId)
      },
      select: {
        yearId: true  // Only select the yearId from Product table
      },
      distinct: ['yearId'],  // Ensure no duplicates in the yearId
    });

    // If no yearIds are found, return a custom record
    if (productYears.length === 0) {
      return NextResponse.json([
      ], { status: 200 });
    }

    // Fetch the corresponding year records from the Year table based on yearIds from Product table
    const years = await prisma.year.findMany({
      where: {
        id: {
          in: productYears.map((product) => product.yearId),  // Map yearIds from the Product table
        }
      }
    });

    // If no matching years are found in the Year table, return the custom record
    if (years.length === 0) {
      return NextResponse.json([
       
      ], { status: 200 });
    }

    // Return the year records from the Year table
    return NextResponse.json(years, { status: 200 });

  } catch (error) {
    console.error(error);
    // Return an error response if something goes wrong
    return NextResponse.json({ error: 'Failed to fetch years' }, { status: 500 });
  }
}
