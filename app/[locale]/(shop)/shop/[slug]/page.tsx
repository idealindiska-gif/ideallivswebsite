import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/woocommerce';
import { ProductTemplate } from '@/components/templates';
import { brandConfig } from '@/config/brand.config';
import { siteConfig } from '@/site.config';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const product = await getProductBySlug(resolvedParams.slug);

    if (!product) {
      return {
        title: 'Product Not Found',
        robots: { index: false, follow: false },
      };
    }

    const title = `${product.name} | ${brandConfig.businessName}`;
    const description = product.short_description
      ? product.short_description.replace(/<[^>]*>/g, '').substring(0, 160)
      : brandConfig.seo.defaultDescription;
    const url = `${siteConfig.site_domain}/product/${product.slug}`;
    const images = product.images.map((img) => ({
      url: img.src,
      width: 800,
      height: 800,
      alt: img.alt || product.name,
    }));

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title,
        description,
        url,
        siteName: brandConfig.businessName,
        images,
        locale: 'en_SE',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: images.map((i) => i.url),
      },
      keywords: [
        product.name,
        ...(product.categories?.map((c) => c.name) || []),
        ...brandConfig.seo.keywords,
      ],
    };
  } catch {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }
}


export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product;

  try {
    product = await getProductBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id);

  // Build breadcrumbs
  const breadcrumbs = [
    { label: 'Shop', href: '/shop' },
    ...(product.categories && product.categories.length > 0
      ? [{ label: product.categories[0].name, href: `/product-category/${product.categories[0].slug}` }]
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
