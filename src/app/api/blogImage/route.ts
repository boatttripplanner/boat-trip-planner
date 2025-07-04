import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic') || 'sailing';
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'PEXELS_API_KEY not set' }, { status: 500 });
  }
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(topic)}&per_page=1`, {
    headers: { Authorization: apiKey },
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Error fetching from Pexels' }, { status: 500 });
  }
  const data = await res.json();
  const photo = data.photos?.[0]?.src?.large || null;
  return NextResponse.json({ image: photo });
} 