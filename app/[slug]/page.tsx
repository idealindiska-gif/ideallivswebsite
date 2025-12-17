import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, getProductsByCategory, getProductCategoryBySlug } from '@/lib/woocommerce';
import { ProductTemplate } from '@/components/templates';
import { ArchiveTemplate } from '@/components/templates';
import type { Metadata } from 'next';

interface DynamicPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  // Try category first
  try {
    const category = await getProductCategoryBySlug(resolvedParams.slug);
    if (category) {
      return {
        title: category.name,
        description: category.description || `Browse our ${category.name} products`,
      };
    }
  } catch {
    // Continue to try product
  }

  // Try product
  try {
    const product = await getProductBySlug(resolvedParams.slug);
    if (product) {
      return {
        title: product.name,
        description: product.short_description?.replace(/<[^>]*>/g, '').substring(0, 160) || product.name,
        openGraph: {
          title: product.name,
          description: product.short_description?.replace(/<[^>]*>/g, '').substring(0, 160),
          images: product.images.map((img) => ({
            url: img.src,
            width: 800,
            height: 800,
            alt: img.alt || product.name,
          })),
        },
      };
    }
  } catch {
    // Not found
  }

  return {
    title: 'Not Found',
  };
}

export default async function DynamicPage({ params, searchParams }: DynamicPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Try to fetch as category first
  try {
    const category = await getProductCategoryBySlug(resolvedParams.slug);
    if (category) {
      // Render as category page
      const page = Number(resolvedSearchParams.page) || 1;
      const perPage = 12;

      const { data: products, total, totalPages } = await getProductsByCategory(resolvedParams.slug, {
        page,
        per_page: perPage,
        orderby: 'date',
        order: 'desc',
        status: 'publish',
      });

      return (
        <ArchiveTemplate
          title={category.name}
          description={
            category.description ? (
              <div dangerouslySetInnerHTML={{ __html: category.description }} />
            ) : undefined
          }
          breadcrumbs={[
            { label: 'Shop', href: '/shop' },
            { label: category.name },
          ]}
          products={products}
          totalProducts={total}
          currentPage={page}
          totalPages={totalPages}
          basePath={`/${resolvedParams.slug}`}
          gridColumns={5}
        />
      );
    }
  } catch {
    // Continue to try as product
  }

  // Try to fetch as product
  try {
    const product = await getProductBySlug(resolvedParams.slug);
    if (product) {
      const relatedProducts = await getRelatedProducts(product.id);

      // Build breadcrumbs
      const breadcrumbs = [
        { label: 'Shop', href: '/shop' },
        ...(product.categories && product.categories.length > 0
          ? [{ label: product.categories[0].name, href: `/${product.categories[0].slug}` }]
          : []),
        { label: product.name },
      ];

      return (
        <ProductTemplate
          product={product}
          breadcrumbs={breadcrumbs}
          relatedProducts={relatedProducts}
        />
      );
    }
  } catch {
    // Not found
  }

  notFound();
}
