import { NextRequest, NextResponse } from 'next/server';

/**
 * Error Logging Endpoint
 * Receives client-side errors and logs them
 *
 * In production, you might want to:
 * - Store errors in a database
 * - Send to monitoring service (Sentry, LogRocket, etc.)
 * - Alert on critical errors
 */
export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();

    // Log to console (Vercel will capture this in logs)
    console.error('Client Error:', {
      message: errorData.message,
      stack: errorData.stack,
      url: errorData.url,
      timestamp: errorData.timestamp,
      context: errorData.context,
    });

    // In production, you could:
    // 1. Store in database for analysis
    // 2. Send email alerts for critical errors
    // 3. Forward to monitoring service
    // 4. Aggregate metrics

    return NextResponse.json(
      { success: true, message: 'Error logged' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to log error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 500 }
    );
  }
}
