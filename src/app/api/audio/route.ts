import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return new Response('Missing audio URL', { status: 400 });
  }

  try {
    const audioResponse = await fetch(audioUrl, {
      headers: {
        // The quran.com API seems to work better with a standard user-agent.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!audioResponse.ok) {
      return new Response(
        `Failed to fetch audio: ${audioResponse.status} ${audioResponse.statusText}`,
        {
          status: audioResponse.status,
        }
      );
    }

    const body = audioResponse.body;
    if (!body) {
      return new Response('Response body is null', { status: 500 });
    }

    // Correctly stream the response.
    // This creates a new readable stream that can be passed directly to the Response object.
    const readableStream = new ReadableStream({
      start(controller) {
        const reader = body.getReader();
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          }).catch(err => {
            console.error('Stream reading error:', err);
            controller.error(err);
          })
        }
        push();
      }
    });

    const headers = new Headers({
      'Content-Type': audioResponse.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Length': audioResponse.headers.get('Content-Length') || '',
      'Accept-Ranges': 'bytes', // Important for seeking
      'Cache-Control': 'public, max-age=31536000, immutable', // Cache the audio file
    });

    return new Response(readableStream, {
      headers,
      status: audioResponse.status,
    });

  } catch (error: any) {
    console.error('Audio Proxy Error:', error.message);
    return new Response('Error fetching audio via proxy', { status: 500 });
  }
}
