import { NextResponse } from 'next/server';
import { getSellingCountriesAction } from '@/app/actions/woocommerce-settings';

export async function GET() {
    try {
        const result = await getSellingCountriesAction();

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Selling countries fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch selling countries' },
            { status: 500 }
        );
    }
}
