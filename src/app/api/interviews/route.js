import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import InterviewQuestion from '@/models/InterviewQuestion';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const questions = await InterviewQuestion.find().sort({ createdAt: -1 });
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prep bank' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { company, role, type, difficulty, question, author, userEmail } = body;

    if (!company || !role || !type || !difficulty || !question || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const newQuestion = await InterviewQuestion.create({
      company, role, type, difficulty, question, author, userEmail
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post question' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const id = new URL(request.url).searchParams.get('id');
    await InterviewQuestion.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}