
import {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return new Response('Missing audio URL', { status: 400 });
  }

  try {
    const audioResponse = await fetch(audioUrl);

    if (!audioResponse.ok) {
      return new Response(`Failed to fetch audio: ${audioResponse.status} ${audioResponse.statusText}`, {
        status: audioResponse.status,
      });
    }
    
    // Ensure we have a readable stream to pipe
    if (!audioResponse.body) {
      return new Response('Response body is null', { status: 500 });
    }

    const headers = new Headers({
      'Content-Type': audioResponse.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Length': audioResponse.headers.get('Content-Length') || '',
      'Accept-Ranges': 'bytes',
    });

    // Stream the response body directly to the client
    return new Response(audioResponse.body, {
      headers,
      status: audioResponse.status,
    });

  } catch (error: any) {
    console.error('Proxy Error:', error.message);
    return new Response('Error fetching audio', { status: 500 });
  }
}
