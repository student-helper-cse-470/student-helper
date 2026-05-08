import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/Note';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const userEmail = new URL(request.url).searchParams.get('userEmail');
    if (!userEmail) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const notes = await Note.find({ userEmail }).sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const { content, color, userEmail } = await request.json();

    if (!content || !userEmail) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newNote = await Note.create({ content, color, userEmail });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const id = new URL(request.url).searchParams.get('id');
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}