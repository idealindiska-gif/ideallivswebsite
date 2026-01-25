import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define supported currencies
export type CurrencyCode = 'SEK' | 'EUR' | 'NOK' | 'DKK' | 'GBP' | 'PLN' | 'CZK' | 'HUF' | 'CHF' | 'ISK';

export interface Currency {
    code: CurrencyCode;
    symbol: string;
    name: string;
    flag: string;
}

// Currency definitions with flags and symbols
export const CURRENCIES: Record<CurrencyCode, Currency> = {
    SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
    DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', flag: '🇵🇱' },
    CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', flag: '🇨🇿' },
    HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', flag: '🇭🇺' },
    CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    ISK: { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna', flag: '🇮🇸' },
};

// Delivery countries with their currency mappings
export interface DeliveryCountry {
    code: string;
    name: string;
    flag: string;
    currency: CurrencyCode;
    shippingZone: 'sweden' | 'scandinavia' | 'europe';
}

export const DELIVERY_COUNTRIES: DeliveryCountry[] = [
    // Scandinavia (local currencies)
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', currency: 'SEK', shippingZone: 'sweden' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴', currency: 'NOK', shippingZone: 'scandinavia' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰', currency: 'DKK', shippingZone: 'scandinavia' },
    { code: 'IS', name: 'Iceland', flag: '🇮🇸', currency: 'ISK', shippingZone: 'scandinavia' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮', currency: 'EUR', shippingZone: 'scandinavia' },

    // Europe (EUR countries)
    { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', shippingZone: 'europe' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', shippingZone: 'europe' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪', currency: 'EUR', shippingZone: 'europe' },
    { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', shippingZone: 'europe' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹', currency: 'EUR', shippingZone: 'europe' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: 'EUR', shippingZone: 'europe' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR', shippingZone: 'europe' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: 'EUR', shippingZone: 'europe' },
    { code: 'GR', name: 'Greece', flag: '🇬🇷', currency: 'EUR', shippingZone: 'europe' },
    { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', currency: 'EUR', shippingZone: 'europe' },

    // Europe (non-EUR countries)
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', shippingZone: 'europe' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', currency: 'PLN', shippingZone: 'europe' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', currency: 'CZK', shippingZone: 'europe' },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺', currency: 'HUF', shippingZone: 'europe' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', shippingZone: 'europe' },
];

// Fallback exchange rates relative to SEK (base currency)
// These are approximate rates - will be updated from API
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
    SEK: 1.0,
    EUR: 0.087,     // 1 SEK ≈ 0.087 EUR
    NOK: 1.02,      // 1 SEK ≈ 1.02 NOK
    DKK: 0.65,      // 1 SEK ≈ 0.65 DKK
    GBP: 0.074,     // 1 SEK ≈ 0.074 GBP
    PLN: 0.38,      // 1 SEK ≈ 0.38 PLN
    CZK: 2.15,      // 1 SEK ≈ 2.15 CZK
    HUF: 33.5,      // 1 SEK ≈ 33.5 HUF
    CHF: 0.082,     // 1 SEK ≈ 0.082 CHF
    ISK: 13.0,      // 1 SEK ≈ 13.0 ISK
};

interface CurrencyState {
    selectedCurrency: CurrencyCode;
    selectedCountry: DeliveryCountry;
    exchangeRates: Record<CurrencyCode, number>;
    lastUpdated: string | null;
    isLoading: boolean;
    setCurrency: (currency: CurrencyCode) => void;
    setCountry: (countryCode: string) => void;
    updateExchangeRates: () => Promise<void>;
    convertPrice: (priceInSEK: number, toCurrency?: CurrencyCode) => number;
    formatPrice: (priceInSEK: number, toCurrency?: CurrencyCode) => string;
}

// Find default country (Sweden)
const defaultCountry = DELIVERY_COUNTRIES.find(c => c.code === 'SE') || DELIVERY_COUNTRIES[0];

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            selectedCurrency: 'SEK',
            selectedCountry: defaultCountry,
            exchangeRates: EXCHANGE_RATES,
            lastUpdated: null,
            isLoading: false,

            setCurrency: (currency) => {
                set({ selectedCurrency: currency });
            },

            setCountry: (countryCode) => {
                const country = DELIVERY_COUNTRIES.find(c => c.code === countryCode);
                if (country) {
                    set({
                        selectedCountry: country,
                        selectedCurrency: country.currency
                    });
                }
            },

            updateExchangeRates: async () => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/currency/rates');
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.rates) {
                            set({
                                exchangeRates: data.rates,
                                lastUpdated: data.lastUpdated,
                                isLoading: false,
                            });
                            console.log('Currency rates updated:', data.rates);
                        }
                    }
                } catch (error) {
                    console.error('Failed to update exchange rates:', error);
                    set({ isLoading: false });
                }
            },

            convertPrice: (priceInSEK, toCurrency) => {
                const currency = toCurrency || get().selectedCurrency;
                const rate = get().exchangeRates[currency];
                return Math.round(priceInSEK * rate * 100) / 100;
            },

            formatPrice: (priceInSEK, toCurrency) => {
                const currency = toCurrency || get().selectedCurrency;
                const convertedPrice = get().convertPrice(priceInSEK, currency);
                const currencyData = CURRENCIES[currency];

                // Format with appropriate decimals and symbol position
                if (currency === 'EUR') {
                    // EUR: €amount (symbol before, no space)
                    return `${currencyData.symbol}${convertedPrice.toFixed(2)}`;
                } else if (currency === 'GBP') {
                    // GBP: £amount
                    return `${currencyData.symbol}${convertedPrice.toFixed(2)}`;
                } else if (currency === 'HUF') {
                    // HUF: no decimals needed (large numbers)
                    return `${Math.round(convertedPrice)} ${currencyData.symbol}`;
                } else {
                    // Nordic currencies and others: amount symbol
                    return `${convertedPrice.toFixed(2)} ${currencyData.symbol}`;
                }
            },
        }),
        {
            name: 'delivery-currency-storage', // localStorage key
            partialize: (state) => ({
                selectedCurrency: state.selectedCurrency,
                selectedCountry: state.selectedCountry,
            }),
        }
    )
);
