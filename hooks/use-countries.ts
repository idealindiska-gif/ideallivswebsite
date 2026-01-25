import { useState, useEffect } from 'react';
import { ALLOWED_COUNTRIES, Country } from '@/lib/woocommerce/countries';

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>(ALLOWED_COUNTRIES);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCountries = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/settings/countries');
                if (!response.ok) {
                    throw new Error('Failed to fetch countries');
                }
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setCountries(data);
                }
            } catch (err) {
                console.warn('Could not fetch countries from API, using fallback list:', err);
                // Keep the default ALLOWED_COUNTRIES
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return { countries, isLoading, error };
}
