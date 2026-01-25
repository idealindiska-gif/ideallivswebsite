/**
 * Allowed Countries for Shipping and Billing
 *
 * This list reflects the countries configured in WooCommerce settings.
 * Countries are identified by their ISO 3166-1 alpha-2 codes.
 */

export interface Country {
    code: string;
    name: string;
}

export const ALLOWED_COUNTRIES: Country[] = [
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'DE', name: 'Germany' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'FR', name: 'France' },
    { code: 'AT', name: 'Austria' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GR', name: 'Greece' },
    { code: 'PL', name: 'Poland' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'HU', name: 'Hungary' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'IS', name: 'Iceland' },
];

/**
 * Get country name by its 2-letter code
 */
export function getCountryName(code: string): string {
    const country = ALLOWED_COUNTRIES.find(c => c.code === code);
    return country ? country.name : code;
}

/**
 * Check if a country code is allowed
 */
export function isCountryAllowed(code: string): boolean {
    return ALLOWED_COUNTRIES.some(c => c.code === code);
}
