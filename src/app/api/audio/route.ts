
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
    const fetchHeaders: HeadersInit = {};
    if (range) {
      fetchHeaders['Range'] = range;
    }

    const audioResponse = await fetch(audioUrl, { headers: fetchHeaders });

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text();
      console.error(`Failed to fetch audio from source: ${audioResponse.status}`, errorText);
      return new NextResponse(
        `Failed to fetch audio. Status: ${audioResponse.status}. Body: ${errorText}`,
        { status: audioResponse.status }
      );
    }
    
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mpeg');
    responseHeaders.set('Accept-Ranges', audioResponse.headers.get('Accept-Ranges') || 'bytes');
    
    const contentLength = audioResponse.headers.get('Content-Length');
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }
    
    const contentRange = audioResponse.headers.get('Content-Range');
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    return new NextResponse(audioResponse.body, {
      status: audioResponse.status,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error('Audio Proxy Error:', error);
    return new NextResponse(JSON.stringify({ message: 'Error fetching audio file.', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

    