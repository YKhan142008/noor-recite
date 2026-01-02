
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return new Response('Missing audio URL', { status: 400 });
  }

  try {
    const audioResponse = await fetch(audioUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    });

    if (!audioResponse.ok) {
      return new Response(`Failed to fetch audio: ${audioResponse.status} ${audioResponse.statusText}`, {
        status: audioResponse.status,
      });
    }

    const body = await audioResponse.arrayBuffer();

    const headers = new Headers();
    headers.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mpeg');
    headers.set('Content-Length', body.byteLength.toString());
    headers.set('Accept-Ranges', 'bytes');
    
    return new Response(body, { headers });

  } catch (error: any) {
    console.error('Proxy Error:', error.message);
    return new Response('Error fetching audio', { status: 500 });
  }
}
