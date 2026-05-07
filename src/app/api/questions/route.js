import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Question from '@/models/Question';

export const dynamic = 'force-dynamic';

// GET: Fetch all questions (with their replies), newest first
export async function GET() {
  try {
    await connectToDatabase();
    
    const questions = await Question.find().sort({ createdAt: -1 });
    
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error('Database GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

// POST: Ask a new question
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { title, courseCode, body: questionBody, author } = body;

    if (!title || !courseCode || !questionBody) {
      return NextResponse.json(
        { error: 'Missing required fields: title, courseCode, and body.' }, 
        { status: 400 }
      );
    }

    const newQuestion = await Question.create({
      title,
      courseCode,
      body: questionBody,
      author: author || 'Anonymous Student',
      replies: [], // Starts empty
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Database POST Error:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

// PUT: Add a reply to an existing question
export async function PUT(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { questionId, text, author } = body;

    if (!questionId || !text) {
      return NextResponse.json(
        { error: 'Missing question ID or reply text.' }, 
        { status: 400 }
      );
    }

    // Find the question and push the new reply into the array
    const question = await Question.findById(questionId);
    
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    question.replies.push({
      text,
      author: author || 'Anonymous Student',
    });

    await question.save();

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error('Database PUT Error:', error);
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}