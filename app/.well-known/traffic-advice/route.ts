import { NextResponse } from 'next/server';

/**
 * Handle Chrome's traffic-advice requests
 * This prevents 404 errors in logs from Chrome's network quality feature
 * See: https://github.com/WICG/traffic-advice
 */
export async function GET() {
  return NextResponse.json(
    {
      // Empty traffic advice - no special routing needed
      version: 1,
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/trafficadvice+json',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    }
  );
}
