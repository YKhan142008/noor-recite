
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return new NextResponse(JSON.stringify({ message: 'Audio URL is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const range = request.headers.get('range');
    const headers: HeadersInit = {};
    if (range) {
      headers['range'] = range;
    }

    const audioResponse = await fetch(audioUrl, { headers });

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text();
      return new NextResponse(
        `Failed to fetch audio. Status: ${audioResponse.status}. Body: ${errorText}`,
        { status: audioResponse.status }
      );
    }
    
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mpeg');
    responseHeaders.set('Content-Length', audioResponse.headers.get('Content-Length') || '0');
    responseHeaders.set('Accept-Ranges', 'bytes');

    if (audioResponse.status === 206) {
        responseHeaders.set('Content-Range', audioResponse.headers.get('Content-Range') || '');
    }

    return new NextResponse(audioResponse.body, {
      status: audioResponse.status,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error('Proxy Error:', error);
    return new NextResponse(JSON.stringify({ message: 'Error fetching audio file.', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
