
// src/app/api/image-proxy/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Image URL is required', { status: 400 });
  }

  try {
    // IMPORTANT: In a real production app, you should validate the imageUrl
    // to prevent abuse (e.g., only allow certain domains, check for SSRF).
    // For this demo, we'll fetch directly.

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, {
        status: response.status,
      });
    }

    const imageBlob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    if (response.headers.has('Content-Length')) {
      headers.set('Content-Length', response.headers.get('Content-Length')!);
    }
    
    return new NextResponse(imageBlob, { status: 200, headers });

  } catch (error) {
    console.error('Image proxy error:', error);
    if (error instanceof Error) {
        return new NextResponse(`Error fetching image: ${error.message}`, { status: 500 });
    }
    return new NextResponse('An unknown error occurred while fetching the image.', { status: 500 });
  }
}
