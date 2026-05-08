import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Assignment from '@/models/Assignment';

export const dynamic = 'force-dynamic';

// GET: Fetch assignments ONLY for the logged-in user
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Extract the email from the URL query parameters
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    // Filter the database by the user's email
    const assignments = await Assignment.find({ userEmail }).sort({ dueDate: 1 });
    
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Database GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

// POST: Create a new assignment tied to the user
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { title, courseCode, dueDate, urgency, userEmail } = body;

    if (!title || !courseCode || !dueDate || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields or user context.' }, 
        { status: 400 }
      );
    }

    const newAssignment = await Assignment.create({
      title,
      courseCode,
      dueDate,
      urgency,
      userEmail, // Save the email to the database
    });

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error('Database POST Error:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}

// PUT: Toggle completion status
export async function PUT(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { id, isCompleted } = body;

    if (!id || typeof isCompleted !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing assignment ID or valid completion status.' }, 
        { status: 400 }
      );
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id, 
      { isCompleted }, 
      { returnDocument: 'after' }
    );

    if (!updatedAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAssignment, { status: 200 });
  } catch (error) {
    console.error('Database PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}

// DELETE: Remove an assignment completely
export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing assignment ID.' }, { status: 400 });
    }

    await Assignment.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Assignment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}