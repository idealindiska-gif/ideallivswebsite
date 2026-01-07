import { NextResponse } from 'next/server';
import { checkWooCommerceConnection } from '@/lib/woocommerce';

/**
 * WooCommerce API Diagnostic Endpoint
 * Tests connectivity and authentication to WooCommerce API
 *
 * Usage: GET /api/diagnostics/woocommerce
 */
export async function GET() {
  try {
    const startTime = Date.now();

    // Test connection
    const result = await checkWooCommerceConnection();

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Get environment info (without exposing secrets)
    const envInfo = {
      wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
      hasConsumerKey: !!process.env.WORDPRESS_CONSUMER_KEY,
      hasConsumerSecret: !!process.env.WORDPRESS_CONSUMER_SECRET,
      nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json(
      {
        status: result.connected ? 'success' : 'error',
        connected: result.connected,
        message: result.message,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        environment: envInfo,
      },
      { status: result.connected ? 200 : 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        connected: false,
        message: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
