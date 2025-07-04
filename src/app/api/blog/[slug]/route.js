import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(req, { params }) {
  const filePath = path.join(process.cwd(), 'content/blog', `${params.slug}.md`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
  }
  const file = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(file);
  return NextResponse.json({ meta: data, content });
} 