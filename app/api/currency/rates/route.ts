import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * Currency Exchange Rates API
 * Fetches real-time rates from ExchangeRate.host
 * Base currency: SEK
 */
export async function GET(request: NextRequest) {
    try {
        // Fetch latest rates from ExchangeRate.host API (free, no API key required)
        const symbols = 'EUR,NOK,DKK,GBP,PLN,CZK,HUF,CHF,ISK';
        const response = await fetch(
            `https://api.exchangerate.host/latest?base=SEK&symbols=${symbols}`,
            {
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error('Exchange rate API returned error');
        }

        // Format rates for our application
        const rates = {
            SEK: 1.0,
            EUR: data.rates?.EUR || 0.087,
            NOK: data.rates?.NOK || 1.02,
            DKK: data.rates?.DKK || 0.65,
            GBP: data.rates?.GBP || 0.074,
            PLN: data.rates?.PLN || 0.38,
            CZK: data.rates?.CZK || 2.15,
            HUF: data.rates?.HUF || 33.5,
            CHF: data.rates?.CHF || 0.082,
            ISK: data.rates?.ISK || 13.0,
        };

        return NextResponse.json({
            success: true,
            rates,
            base: 'SEK',
            lastUpdated: data.date || new Date().toISOString().split('T')[0],
        });
    } catch (error: any) {
        console.error('Currency API error:', error);

        // Return fallback rates if API fails
        return NextResponse.json(
            {
                success: true,
                rates: {
                    SEK: 1.0,
                    EUR: 0.087,
                    NOK: 1.02,
                    DKK: 0.65,
                    GBP: 0.074,
                    PLN: 0.38,
                    CZK: 2.15,
                    HUF: 33.5,
                    CHF: 0.082,
                    ISK: 13.0,
                },
                base: 'SEK',
                lastUpdated: new Date().toISOString().split('T')[0],
                fallback: true,
                message: 'Using fallback rates due to API error',
            },
            { status: 200 }
        );
    }
}
