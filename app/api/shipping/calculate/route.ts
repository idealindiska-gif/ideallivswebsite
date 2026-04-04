import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://crm.ideallivs.com/wp-json';
// Check server-side first, then public fallback
const MCP_KEY = process.env.FOURLINES_MCP_KEY || process.env.NEXT_PUBLIC_FOURLINES_MCP_KEY;

/**
 * Local pickup is only available for customers in the Stockholm area
 * (Swedish postcodes 100xx–199xx, which covers the store at 124 32 Bandhagen)
 */
function isStockholmPostcode(postcode: string): boolean {
  const normalized = postcode.replace(/\s+/g, '');
  const prefix = normalized.substring(0, 3);
  if (prefix.length < 3 || !/^\d+$/.test(prefix)) return false;
  const prefixNum = parseInt(prefix, 10);
  return prefixNum >= 100 && prefixNum <= 199;
}

// Fallback shipping methods when API is unavailable
const FALLBACK_SHIPPING_METHODS = [
  {
    id: 'flat_rate:1',
    method_id: 'flat_rate',
    label: 'Standard Shipping',
    cost: 79,
    total_cost: 79,
    tax: 0,
    meta_data: {},
  },
  {
    id: 'local_pickup:1',
    method_id: 'local_pickup',
    label: 'Store Pickup (Stockholm)',
    cost: 0,
    total_cost: 0,
    tax: 0,
    meta_data: {},
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, postcode, city, country } = body;

    if (process.env.NODE_ENV === 'development') {
      console.log('📍 [API Route] Shipping calculation request:', {
        items,
        postcode,
        city,
        country,
      });
    }

    // Calculate cart total from items for fallback
    let cartTotal = 0;
    if (items && Array.isArray(items)) {
      // We don't have prices here, so we'll assume a default for fallback
      // The actual cart total should be passed or calculated properly
      cartTotal = items.reduce((sum: number, item: any) => sum + (item.quantity * 100), 0); // Rough estimate
    }

    if (!MCP_KEY) {
      console.warn('⚠️ [API Route] Missing MCP API key, using fallback shipping methods');
      return createFallbackResponse(cartTotal, postcode);
    }

    try {
      // Call WordPress MCP API
      const response = await fetch(
        `${WP_API_BASE}/fourlines-mcp/v1/shipping/calculate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Fourlines-Key': MCP_KEY,
          },
          body: JSON.stringify({
            items: items.map((item: any) => ({
              product_id: item.productId,
              variation_id: item.variationId,
              quantity: item.quantity,
            })),
            postcode,
            city,
            country,
          }),
        }
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('📍 [API Route] WordPress response status:', response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [API Route] WordPress API error:', errorText);

        // Use fallback if API fails (authentication error, network issue, etc.)
        console.warn('⚠️ [API Route] Using fallback shipping methods due to API error');
        return createFallbackResponse(cartTotal);
      }

      const data = await response.json();

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [API Route] WordPress response data:', data);
      }

      // Transform response to match expected format
      // The WordPress backend already filters free shipping based on:
      // 1. Cart total >= 500 SEK
      // 2. Zone has free shipping enabled
      // 3. Stockholm postcode (100xx-199xx)
      // So we trust the backend's response completely
      const apiCartTotal = data.cart_total || cartTotal;
      const freeShippingThreshold = data.free_shipping_threshold || 500;
      const rawMethods = data.available_methods || [];

      // Only allow local_pickup for Stockholm-area postcodes
      const pickupAllowed = postcode ? isStockholmPostcode(postcode) : false;
      const availableMethods = pickupAllowed
        ? rawMethods
        : rawMethods.filter((m: any) => m.method_id !== 'local_pickup');

      return NextResponse.json({
        success: true,
        available_methods: availableMethods,
        restricted_products: data.restricted_products || [],
        cart_subtotal: apiCartTotal,
        free_shipping_threshold: freeShippingThreshold,
        amount_to_free_shipping: data.amount_to_free_shipping || Math.max(0, freeShippingThreshold - apiCartTotal),
        minimum_order: 0,
        minimum_order_met: true,
      });
    } catch (fetchError) {
      console.error('❌ [API Route] Fetch error:', fetchError);
      console.warn('⚠️ [API Route] Using fallback shipping methods due to network error');
      return createFallbackResponse(cartTotal, postcode);
    }
  } catch (error) {
    console.error('❌ [API Route] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Create fallback response with standard shipping options
function createFallbackResponse(cartTotal: number, postcode?: string) {
  const freeShippingThreshold = 500;
  // Only offer local pickup for Stockholm-area postcodes
  const pickupAllowed = postcode ? isStockholmPostcode(postcode) : false;
  let methods = FALLBACK_SHIPPING_METHODS.filter(
    m => m.method_id !== 'local_pickup' || pickupAllowed
  );

  // Add free shipping if cart qualifies
  if (cartTotal >= freeShippingThreshold) {
    methods.unshift({
      id: 'free_shipping:1',
      method_id: 'free_shipping',
      label: 'Free Shipping',
      cost: 0,
      total_cost: 0,
      tax: 0,
      meta_data: {},
    });
  }

  return NextResponse.json({
    success: true,
    available_methods: methods,
    restricted_products: [],
    cart_subtotal: cartTotal,
    free_shipping_threshold: freeShippingThreshold,
    amount_to_free_shipping: Math.max(0, freeShippingThreshold - cartTotal),
    minimum_order: 0,
    minimum_order_met: true,
    _fallback: true, // Indicator that fallback was used
  });
}
