/**
 * WooCommerce Brands API Functions
 * Fetch product brands from WooCommerce
 */

import { fetchWooCommerceAPI } from './api';
import { WC_API_CONFIG } from './config';

export interface ProductBrand {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy?: string;
    parent?: number;
    image?: {
        id: number;
        src: string;
        alt: string;
    };
}

/**
 * Get all product brands using WooCommerce REST API
 */
export async function getProductBrands(params?: {
    per_page?: number;
    page?: number;
    search?: string;
    hide_empty?: boolean;
}): Promise<ProductBrand[]> {
    const queryParams = {
        per_page: params?.per_page || 100,
        page: params?.page || 1,
        hide_empty: params?.hide_empty !== undefined ? params.hide_empty : true,
        ...(params?.search && { search: params.search }),
    };

    try {
        // Build query string
        const queryString = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            queryString.append(key, String(value));
        });

        // Try WooCommerce Brands API
        const fullEndpoint = `/products/brands?${queryString.toString()}`;
        const brands = await fetchWooCommerceAPI<ProductBrand[]>(fullEndpoint);

        if (brands && Array.isArray(brands)) {
            return brands;
        }

        return [];
    } catch (error) {
        console.error('Error fetching product brands:', error);
        return [];
    }
}

/**
 * Get all brands with pagination to ensure we fetch all
 */
export async function getAllProductBrands(): Promise<ProductBrand[]> {
    const allBrands: ProductBrand[] = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    while (hasMore) {
        try {
            const brands = await getProductBrands({ per_page: perPage, page, hide_empty: true });
            if (brands.length === 0) {
                hasMore = false;
            } else {
                allBrands.push(...brands);
                if (brands.length < perPage) {
                    hasMore = false;
                } else {
                    page++;
                }
            }
        } catch (error) {
            hasMore = false;
        }
    }

    // Sort alphabetically by name
    return allBrands.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single brand by slug
 */
export async function getBrandBySlug(slug: string): Promise<ProductBrand | null> {
    try {
        const brands = await fetchWooCommerceAPI<ProductBrand[]>(`/products/brands?slug=${slug}`);
        if (brands && Array.isArray(brands) && brands.length > 0) {
            return brands[0];
        }
        return null;
    } catch (error) {
        console.error(`Error fetching brand ${slug}:`, error);
        return null;
    }
}
