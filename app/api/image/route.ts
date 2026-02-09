import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

/**
 * Image Optimization API Route
 * 
 * Converts images to WebP format on-the-fly with caching
 * 
 * Usage: /api/image?url=IMAGE_URL&w=WIDTH&q=QUALITY
 * 
 * Example: /api/image?url=https://crm.ideallivs.com/wp-content/uploads/2024/01/product.png&w=400&q=80
 */

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const imageUrl = searchParams.get('url');
        const width = parseInt(searchParams.get('w') || '800');
        const quality = parseInt(searchParams.get('q') || '80');

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Missing image URL parameter' },
                { status: 400 }
            );
        }

        // Validate URL is from allowed domains
        const allowedDomains = [
            'crm.ideallivs.com',
            'ideallivs.com',
            'www.ideallivs.com',
        ];

        const url = new URL(imageUrl);
        if (!allowedDomains.includes(url.hostname)) {
            return NextResponse.json(
                { error: 'Image URL not from allowed domain' },
                { status: 403 }
            );
        }

        // Fetch the original image
        const imageResponse = await fetch(imageUrl, {
            next: { revalidate: 86400 }, // Cache for 24 hours
        });

        if (!imageResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch image' },
                { status: imageResponse.status }
            );
        }

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        // Convert to WebP using Sharp
        const webpBuffer = await sharp(imageBuffer)
            .resize(width, null, {
                withoutEnlargement: true,
                fit: 'inside',
            })
            .webp({ quality })
            .toBuffer();

        // Return WebP image with proper headers
        return new NextResponse(webpBuffer, {
            headers: {
                'Content-Type': 'image/webp',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Length': webpBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('Image optimization error:', error);

        // If conversion fails, try to return original image
        const imageUrl = request.nextUrl.searchParams.get('url');
        if (imageUrl) {
            try {
                const imageResponse = await fetch(imageUrl);
                const imageBuffer = await imageResponse.arrayBuffer();

                return new NextResponse(imageBuffer, {
                    headers: {
                        'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
                        'Cache-Control': 'public, max-age=31536000, immutable',
                    },
                });
            } catch (fallbackError) {
                console.error('Fallback image fetch error:', fallbackError);
            }
        }

        return NextResponse.json(
            { error: 'Image processing failed' },
            { status: 500 }
        );
    }
}
