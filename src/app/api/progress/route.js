import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Progress from '@/models/Progress';

export const dynamic = 'force-dynamic';

// GET: Fetch the user's specific progress
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    let progress = await Progress.findOne({ userEmail });
    
    // If they don't have a profile yet, return a clean slate
    if (!progress) {
      progress = { totalCredits: 120, completedCredits: 0, requirements: [] };
    }
    
    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST: Upsert (Update or Create) the user's progress
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { userEmail, totalCredits, completedCredits, requirements } = body;

    if (!userEmail) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    // Upsert logic: find by email, update the fields, create if it doesn't exist
    const updatedProgress = await Progress.findOneAndUpdate(
      { userEmail },
      { totalCredits: Number(totalCredits), completedCredits: Number(completedCredits), requirements, updatedAt: Date.now() },
      { returnDocument: 'after', upsert: true }
    );

    return NextResponse.json(updatedProgress, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}