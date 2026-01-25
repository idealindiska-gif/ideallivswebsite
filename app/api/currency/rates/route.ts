import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

// Fallback exchange rates relative to SEK (base currency)
const FALLBACK_RATES = {
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
};

/**
 * Currency Exchange Rates API
 * Fetches real-time rates from Frankfurter.app (free, no API key required)
 * Base currency: SEK
 */
export async function GET(request: NextRequest) {
    try {
        // Use Frankfurter.app - completely free, no API key, reliable
        // Note: ISK is not supported by Frankfurter, so we'll use fallback for it
        const response = await fetch(
            'https://api.frankfurter.app/latest?from=SEK&to=EUR,NOK,DKK,GBP,PLN,CZK,HUF,CHF',
            {
                next: { revalidate: 3600 }, // Cache for 1 hour
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.error('Frankfurter API response not ok:', response.status);
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();

        if (!data.rates) {
            console.error('Frankfurter API returned no rates:', data);
            throw new Error('Exchange rate API returned no rates');
        }

        // Format rates for our application
        const rates = {
            SEK: 1.0,
            EUR: data.rates.EUR || FALLBACK_RATES.EUR,
            NOK: data.rates.NOK || FALLBACK_RATES.NOK,
            DKK: data.rates.DKK || FALLBACK_RATES.DKK,
            GBP: data.rates.GBP || FALLBACK_RATES.GBP,
            PLN: data.rates.PLN || FALLBACK_RATES.PLN,
            CZK: data.rates.CZK || FALLBACK_RATES.CZK,
            HUF: data.rates.HUF || FALLBACK_RATES.HUF,
            CHF: data.rates.CHF || FALLBACK_RATES.CHF,
            ISK: FALLBACK_RATES.ISK, // ISK not available in Frankfurter, use fallback
        };

        return NextResponse.json({
            success: true,
            rates,
            base: 'SEK',
            lastUpdated: data.date || new Date().toISOString().split('T')[0],
        });
    } catch (error: any) {
        console.error('Currency API error:', error.message);

        // Return fallback rates if API fails - this ensures the feature still works
        return NextResponse.json(
            {
                success: true,
                rates: FALLBACK_RATES,
                base: 'SEK',
                lastUpdated: new Date().toISOString().split('T')[0],
                fallback: true,
                message: 'Using fallback rates',
            },
            { status: 200 }
        );
    }
}
