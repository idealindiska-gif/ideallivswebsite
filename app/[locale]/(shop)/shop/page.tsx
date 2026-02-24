import { getProducts, getProductCategories } from '@/lib/woocommerce';
import { getProductBrands } from '@/lib/woocommerce/brands';
import { ArchiveTemplate } from '@/components/templates';
import { ShopTopBar } from '@/components/shop/shop-top-bar';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Indian & Pakistani Groceries | Ideal Indiska LIVS',
  description: 'Shop Indian & Pakistani groceries online. Premium Basmati rice, spices, halal products, frozen foods & more. Deliveries across Stockholm & Europe.',
};

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    order?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    stock_status?: string;
    on_sale?: string;
    featured?: string;
    search?: string;
    brand?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const perPage = 20;

  // Get categories and brands for filters
  const [categories, brands] = await Promise.all([
    getProductCategories(),
    getProductBrands({ hide_empty: true })
  ]);

  // Determine sort order
  let orderby = params.orderby || 'popularity';
  let order = (params.order as 'asc' | 'desc') || 'desc';

  // Map 'sort' param (from Sidebar/Top Charts) to WooCommerce API params
  // sort=new -> orderby=date, order=desc
  // sort=bestsellers -> orderby=total_sales, order=desc
  // sort=trending -> orderby=popularity, order=desc
  // sort=price_asc -> orderby=price, order=asc
  // sort=price_desc -> orderby=price, order=desc
  if (params['sort']) {
    switch (params['sort']) {
      case 'new':
        orderby = 'date';
        order = 'desc';
        break;
      case 'bestsellers':
        orderby = 'total_sales';
        order = 'desc';
        break;
      case 'trending':
        orderby = 'popularity';
        order = 'desc';
        break;
      case 'price_asc':
        orderby = 'price';
        order = 'asc';
        break;
      case 'price_desc':
        orderby = 'price';
        order = 'desc';
        break;
    }
  }

  // When a search query is active and no explicit sort chosen by the user,
  // we fetch a wider set and apply our own relevance scoring so that title
  // matches always outrank popularity-based ordering from WooCommerce.
  const isRelevanceSearch = !!params.search && !params.sort && !params.orderby;

  // Build query params (without brand filter for API)
  const queryParams: any = {
    // For relevance search: always start from page 1, fetch 100 for in-memory pagination
    page: (params.brand || isRelevanceSearch) ? 1 : page,
    per_page: params.brand ? 100 : isRelevanceSearch ? 100 : perPage,
    // For relevance search: use alphabetical so WooCommerce doesn't bias by popularity
    orderby: isRelevanceSearch ? 'title' : orderby,
    order: isRelevanceSearch ? 'asc' : order,
  };

  // Apply filters (excluding brand since we'll handle it client-side)
  if (params.category) queryParams.category = params.category;
  if (params.min_price) queryParams.min_price = params.min_price;
  if (params.max_price) queryParams.max_price = params.max_price;
  if (params.stock_status) queryParams.stock_status = params.stock_status;
  if (params.on_sale) queryParams.on_sale = params.on_sale === 'true';
  if (params.featured) queryParams.featured = params.featured === 'true';
  if (params.search) queryParams.search = params.search;

  let { data: products, total, totalPages } = await getProducts(queryParams);

  // Apply relevance scoring + in-memory pagination for search results.
  // This fixes issues like "rice" returning korma (popular but only mentions
  // rice in description) above actual rice products.
  if (isRelevanceSearch) {
    const query = params.search!.toLowerCase().trim();
    const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const scored = products.map((p) => {
      const name = p.name.toLowerCase();
      let score = 0;

      if (name === query) score += 100;
      else if (name.startsWith(query)) score += 90;
      else if (new RegExp(`\\b${escRe(query)}\\b`).test(name)) score += 85;
      else if (name.includes(query)) score += 70;
      else {
        // Multi-word: score each word independently
        const words = query.split(/\s+/).filter((w) => w.length > 1);
        if (words.length > 0) {
          const matched = words.filter((w) => name.includes(w)).length;
          if (matched > 0) score += (matched / words.length) * 55;
        }
      }

      // Tags — strong signal (deliberately assigned)
      const tagNames = (p.tags || []).map((t: any) => t.name.toLowerCase());
      const tagSlugs = (p.tags || []).map((t: any) => t.slug.toLowerCase());
      if (tagNames.includes(query) || tagSlugs.includes(query)) {
        score += 80;   // exact tag match
      } else if (tagNames.some((t: string) => query.includes(t) || t.includes(query))) {
        score += 50;   // partial tag match
      }

      // Descriptions are a weak signal — only used as tiebreaker
      const desc = [p.description || '', p.short_description || ''].join(' ').toLowerCase();
      if (desc.includes(query)) score += 5;

      if (p.stock_status === 'instock') score += 20;
      else if (p.stock_status === 'outofstock') score -= 40;

      return { p, score };
    });

    scored.sort((a, b) => b.score - a.score);

    total = scored.length;
    totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    products = scored.slice(start, start + perPage).map((s) => s.p);
  }

  // Client-side brand filtering if brand param exists
  if (params.brand) {
    products = products.filter(product =>
      product.brands?.some(b => b.slug === params.brand)
    );

    // Recalculate pagination for filtered results
    total = products.length;
    totalPages = Math.ceil(total / perPage);

    // Apply pagination to filtered results
    const start = (page - 1) * perPage;
    const end = start + perPage;
    products = products.slice(start, end);
  }

  return (
    <ArchiveTemplate
      title="Shop"
      description="Shop authentic Indian & Pakistani groceries online. Premium Basmati rice, spices, halal products, frozen foods & more."
      breadcrumbs={[{ label: 'Shop' }]}
      products={products}
      totalProducts={total}
      currentPage={page}
      totalPages={totalPages}
      basePath="/shop"
      gridColumns={5}
      filterBar={
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <ShopTopBar
            categories={categories}
            brands={brands}
            totalProducts={total}
          />
        </Suspense>
      }
    />
  );
}
