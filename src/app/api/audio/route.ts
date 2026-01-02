import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return new Response('Missing audio URL', { status: 400 });
  }

  try {
    // Fetch the external audio source
    const audioResponse = await fetch(audioUrl, {
      headers: {
        // The quran.com API seems to work better with a standard user-agent.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Check if the request to the external source was successful
    if (!audioResponse.ok) {
      return new Response(
        `Failed to fetch audio: ${audioResponse.status} ${audioResponse.statusText}`,
        {
          status: audioResponse.status,
        }
      );
    }
    
    // The body of the fetch response is already a ReadableStream.
    // We can pass it directly to our new Response object.
    const body = audioResponse.body;
    if (!body) {
      return new Response('Response body is null', { status: 500 });
    }

    // Create new headers, forwarding essential ones from the original response.
    const headers = new Headers({
      'Content-Type': audioResponse.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Length': audioResponse.headers.get('Content-Length') || '',
      'Accept-Ranges': 'bytes', // Important for seeking
      'Cache-Control': 'public, max-age=31536000, immutable', // Cache the audio file
    });
    
    // Create a new response with the streamed body and correct headers.
    return new Response(body, {
      headers,
      status: audioResponse.status,
    });

  } catch (error: any) {
    console.error('Audio Proxy Error:', error.message);
    return new Response('Error fetching audio via proxy', { status: 500 });
  }
}
