import { NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/cloudflare-r2';

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();
    
    // Generate a signed upload URL
    const { url, key } = await generatePresignedUploadUrl(
      `episodes/${Date.now()}-${filename}`,
      contentType
    );
    
    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
