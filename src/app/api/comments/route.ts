
import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/lib/sanity';
import { nanoid } from 'nanoid';


export async function POST(req: NextRequest) {
  const { slug, author, email, body } = await req.json();

  
  if (!slug || !author || !email || !body) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  
  const newComment = {
    _type: 'comment',
    _id: nanoid(),  
    author,
    email,
    body,
    createdAt: new Date().toISOString(),
  };

  
  await sanityClient
    .patch(slug) 
    .setIfMissing({ comments: [] })
    .append('comments', [newComment]) 
    .commit();

  return NextResponse.json({ comment: newComment });
}
