
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return new NextResponse('Missing audio URL', { status: 400 });
  }

  try {
    const audioResponse = await fetch(audioUrl);

    if (!audioResponse.ok) {
      return new NextResponse('Failed to fetch audio', { status: audioResponse.status });
    }

    const headers = new Headers();
    headers.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mpeg');
    headers.set('Content-Length', audioResponse.headers.get('Content-Length') || '');
    
    // Use a ReadableStream to stream the body
    const readableStream = audioResponse.body;
    
    return new NextResponse(readableStream, { headers });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Error fetching audio', { status: 500 });
  }
}
