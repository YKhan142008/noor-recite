
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
      headers['Range'] = range;
    }

    // Fetch the audio from the external source
    const audioResponse = await fetch(audioUrl, { headers });

    // Check if the external fetch was successful
    if (!audioResponse.ok) {
      const errorText = await audioResponse.text();
      console.error(`Failed to fetch audio from source: ${audioResponse.status}`, errorText);
      return new NextResponse(
        `Failed to fetch audio. Status: ${audioResponse.status}. Body: ${errorText}`,
        { status: audioResponse.status }
      );
    }
    
    // Create new headers for our response, copying from the external source's response
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mpeg');
    responseHeaders.set('Content-Length', audioResponse.headers.get('Content-Length') || '0');
    responseHeaders.set('Accept-Ranges', 'bytes');

    // If the original server sent a partial response (206), mirror that header
    if (audioResponse.status === 206) {
        const contentRange = audioResponse.headers.get('Content-Range');
        if (contentRange) {
          responseHeaders.set('Content-Range', contentRange);
        }
    }

    // Stream the body directly from the external response to our client
    return new NextResponse(audioResponse.body, {
      status: audioResponse.status, // This will be 200 for full content, 206 for partial
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
