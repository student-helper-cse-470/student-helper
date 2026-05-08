import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Material from '@/models/Material';

// Force Next.js to NEVER cache this API route so you always see fresh votes
export const dynamic = 'force-dynamic';

// GET: Fetch all materials (optionally filtered by courseCode)
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get('courseCode');

    let query = {};
    if (courseCode) {
      query.courseCode = courseCode;
    }

    const materials = await Material.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(materials, { status: 200 });
  } catch (error) {
    console.error('Database GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST: Create a new material entry
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { title, courseCode, category, link } = body;

    if (!title || !courseCode || !category || !link) {
      return NextResponse.json(
        { error: 'Missing required fields.' }, 
        { status: 400 }
      );
    }

    const newMaterial = await Material.create({
      title,
      courseCode,
      category,
      link,
    });

    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error('Database POST Error:', error);
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}

