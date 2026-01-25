'use client';

import { useCurrencyStore, CURRENCIES } from '@/store/currency-store';
import { useEffect, useState } from 'react';

interface CurrencyPriceProps {
    /** Price in SEK (base currency) */
    price: number | string | null | undefined;
    /** Additional CSS classes */
    className?: string;
    /** Show original SEK price as well */
    showOriginal?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Currency-aware price display component
 * Automatically converts from SEK to the user's selected currency
 */
export function CurrencyPrice({
    price,
    className = '',
    showOriginal = false,
    size = 'md'
}: CurrencyPriceProps) {
    const { selectedCurrency, formatPrice, convertPrice } = useCurrencyStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Parse price to number
    const numericPrice = typeof price === 'string'
        ? parseFloat(price.replace(/[^\d.-]/g, ''))
        : (price ?? 0);

    if (isNaN(numericPrice) || numericPrice === 0) {
        return <span className={className}>-</span>;
    }

    // Format SEK price for fallback/server render
    const sekFormatted = `${numericPrice.toFixed(2)} kr`;

    // Before hydration, show SEK
    if (!mounted) {
        return <span className={className}>{sekFormatted}</span>;
    }

    const formattedPrice = formatPrice(numericPrice);
    const currency = CURRENCIES[selectedCurrency];

    // Size classes
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg font-bold',
    };

    return (
        <span className={`${sizeClasses[size]} ${className}`}>
            {formattedPrice}
            {showOriginal && selectedCurrency !== 'SEK' && (
                <span className="text-xs text-muted-foreground ml-1">
                    ({sekFormatted})
                </span>
            )}
        </span>
    );
}

/**
 * Display sale price with regular price crossed out
 */
interface CurrencySalePriceProps {
    salePrice: number | string | null | undefined;
    regularPrice: number | string | null | undefined;
    className?: string;
}

export function CurrencySalePrice({
    salePrice,
    regularPrice,
    className = ''
}: CurrencySalePriceProps) {
    const { selectedCurrency, formatPrice } = useCurrencyStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const numericSale = typeof salePrice === 'string'
        ? parseFloat(salePrice.replace(/[^\d.-]/g, ''))
        : (salePrice ?? 0);

    const numericRegular = typeof regularPrice === 'string'
        ? parseFloat(regularPrice.replace(/[^\d.-]/g, ''))
        : (regularPrice ?? 0);

    if (!mounted) {
        return (
            <div className={`flex items-baseline gap-1.5 ${className}`}>
                <span className="text-lg font-bold text-primary">
                    {numericSale.toFixed(2)} kr
                </span>
                <span className="text-xs text-muted-foreground line-through">
                    {numericRegular.toFixed(2)} kr
                </span>
            </div>
        );
    }

    return (
        <div className={`flex items-baseline gap-1.5 ${className}`}>
            <span className="text-lg font-bold text-primary">
                {formatPrice(numericSale)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
                {formatPrice(numericRegular)}
            </span>
        </div>
    );
}
