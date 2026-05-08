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

// PUT: Update votes for a material (Bulletproof Version)
export async function PUT(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { id, action } = body; 

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing material ID or action' }, 
        { status: 400 }
      );
    }

    // 1. Find the exact material document first
    const material = await Material.findById(id);

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // 2. Modify the values safely in JavaScript (handling missing fields gracefully)
    if (action === 'upvote') {
      material.upvotes = (material.upvotes || 0) + 1;
    } else if (action === 'downvote') {
      material.downvotes = (material.downvotes || 0) + 1;
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be upvote or downvote.' }, 
        { status: 400 }
      );
    }

    // 3. Save the document back to MongoDB
    await material.save();

    // 4. Return the guaranteed fresh document to the frontend
    return NextResponse.json(material, { status: 200 });
  } catch (error) {
    console.error('Database PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update votes' }, { status: 500 });
  }
}