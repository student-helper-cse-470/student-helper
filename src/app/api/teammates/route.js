import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import TeammatePost from '@/models/TeammatePost';

export const dynamic = 'force-dynamic';

// GET: Fetch all recruitment posts
export async function GET() {
  try {
    await connectToDatabase();
    const posts = await TeammatePost.find().sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Database GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST: Create a new recruitment post
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, description, skills, author, userEmail, contactInfo } = body;

    if (!title || !description || !skills || !author || !userEmail || !contactInfo) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const newPost = await TeammatePost.create({
      title,
      description,
      skills,
      author,
      userEmail,
      contactInfo,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Database POST Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// DELETE: Remove a post once a team is formed
export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing post ID.' }, { status: 400 });

    await TeammatePost.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Post removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}