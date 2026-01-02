
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
      return new Response(`Failed to fetch audio: ${audioResponse.statusText}`, { status: audioResponse.status });
    }

    const headers = new Headers({
      'Content-Type': audioResponse.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Length': audioResponse.headers.get('Content-Length') || '',
      'Accept-Ranges': 'bytes',
    });

    return new Response(audioResponse.body, { headers });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response('Error fetching audio', { status: 500 });
  }
}
