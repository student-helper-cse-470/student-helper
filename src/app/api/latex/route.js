import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import LatexSnippet from '@/models/LatexSnippet';

export const dynamic = 'force-dynamic';

// GET: Fetch all snippets
export async function GET() {
  try {
    await connectToDatabase();
    const snippets = await LatexSnippet.find().sort({ createdAt: -1 });
    return NextResponse.json(snippets, { status: 200 });
  } catch (error) {
    console.error('Database GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch snippets' }, { status: 500 });
  }
}

// POST: Share a new snippet
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, latexCode, description, author, userEmail } = body;

    if (!title || !latexCode || !author || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const newSnippet = await LatexSnippet.create({
      title,
      latexCode,
      description,
      author,
      userEmail,
    });

    return NextResponse.json(newSnippet, { status: 201 });
  } catch (error) {
    console.error('Database POST Error:', error);
    return NextResponse.json({ error: 'Failed to create snippet' }, { status: 500 });
  }
}

// DELETE: Remove a snippet
export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID.' }, { status: 400 });

    await LatexSnippet.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Snippet removed' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 });
  }
}