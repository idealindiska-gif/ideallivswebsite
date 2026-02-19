import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/woocommerce';
import { ProductTemplate } from '@/components/templates';
import { brandConfig } from '@/config/brand.config';
import { siteConfig } from '@/site.config';
import type { Metadata } from 'next';

params: Promise<{
  slug: string;
  locale: string;
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

    const isNationalBrand = product.brands?.some(b => b.slug === 'national' || b.name.toLowerCase() === 'national');
    const isShanBrand = product.brands?.some(b => b.slug === 'shan' || b.slug === 'shan-foods' || b.name.toLowerCase().includes('shan'));

    let title = `${product.name} | ${brandConfig.businessName}`;

    // ── Smart meta description generator ──────────────────────────────────────
    // Bing requires 150–160 chars. Build a rich fallback when short_description
    // is missing or too short (many WooCommerce products have no description set).
    const rawShortDesc = product.short_description
      ? product.short_description.replace(/<[^>]*>/g, '').trim()
      : '';

    const brandName = product.brands?.[0]?.name || '';
    const categoryName = product.categories?.[0]?.name || '';
    const price = product.price ? `${product.price} SEK` : '';

    // Build a rich contextual description from available product data
    const buildFallbackDescription = (): string => {
      const parts: string[] = [];
      if (brandName) parts.push(`${brandName}`);
      parts.push(product.name);
      if (categoryName) parts.push(`in ${categoryName}`);
      const base = `Buy ${parts.join(' ')} at Ideal Indiska LIVS Stockholm.`;
      const suffix = price
        ? ` Price: ${price}. Authentic Indian & Pakistani groceries with fast delivery across Sweden & EU. No customs duty.`
        : ` Authentic Indian & Pakistani groceries delivered fast across Sweden & EU. Free shipping over 500 SEK. No customs duty.`;
      return (base + suffix).substring(0, 160);
    };

    let description = rawShortDesc.length >= 100
      ? rawShortDesc.substring(0, 155) + (rawShortDesc.length > 155 ? '...' : '')
      : buildFallbackDescription();


    // Pakistani targeting for National Foods products
    if (isNationalBrand) {
      title = `${product.name} - Authentic National Foods Pakistan | Ideal Indiska`;
      description = `Order ${product.name} from National Foods at Ideal Indiska LIVS. Authentic Pakistani taste delivered in Stockholm & Europe. Fast shipping, no customs duty in EU.`;
    }

    // Pakistani targeting for Shan Foods products
    if (isShanBrand) {
      title = `${product.name} - Authentic Shan Foods Pakistan | Ideal Indiska`;
      description = `Shop ${product.name} by Shan Foods at Ideal Indiska LIVS Stockholm. The finest Pakistani spice mixes and recipe bases with fast EU delivery. Authentic taste guaranteed.`;
    }

    // HIGH PRIORITY: India Gate Sona Masoori Rice 5kg
    // Targeting keywords: Sona Masoori Rice Stockholm, India Gate Rice 5kg Price, South Indian Rice Sweden
    if (resolvedParams.slug === 'ig-sona-masoori-rice-5kg-new-pack' || product.name.toLowerCase().includes('sona masoori')) {
      title = `India Gate Sona Masoori Rice 5kg | Best Price 99kr | Ideal Indiska Stockholm`;
      description = `Get India Gate Sona Masoori Rice 5kg at the lowest price of 99kr (Regular 150kr). Premium aged South Indian rice, perfect for steaming & Pongal. Fast Stockholm & EU delivery. No customs duty.`;
    }

    // Generic Pakistani brand check
    const pakistaniBrandNames = ['guard', 'falak', 'ahmed food', 'laziza', 'hamdard', 'qarshi', 'shezan', 'tapal'];
    const pBrand = product.brands?.find(b => pakistaniBrandNames.some(name => b.name.toLowerCase().includes(name)));

    // Generic Indian brand check
    const indianBrandNames = ['india gate', 'mdh', 'trs', 'haldiram', 'annam', 'aashirvaad', 'vatika', 'dabur', 'idhayam', 'fortune'];
    const iBrand = product.brands?.find(b => indianBrandNames.some(name => b.name.toLowerCase().includes(name)));

    // Generic International/European brand check
    const internationalBrandNames = ['colgate', 'nestle', 'coca-cola', 'coke', 'ali baba', 'patak', 'pillsbury', 'jabsons', 'johnson', 'vaseline'];
    const intBrand = product.brands?.find(b => internationalBrandNames.some(name => b.name.toLowerCase().includes(name)));

    if (pBrand && !isNationalBrand && !isShanBrand) {
      title = `${product.name} - Authentic ${pBrand.name} Pakistan | Ideal Indiska`;
      description = `Get ${product.name} by ${pBrand.name} at Ideal Indiska LIVS. Authentic Pakistani product delivered in Stockholm & Europe. Fast shipping, no customs duty.`;
    }

    if (iBrand) {
      title = `${product.name} - Official ${iBrand.name} India | Ideal Indiska`;
      description = `Buy ${product.name} by ${iBrand.name} at Ideal Indiska LIVS. Authentic Indian brand products delivered in Stockholm & Europe. Fresh stock, fast delivery.`;
    }

    if (intBrand && !iBrand && !pBrand) {
      title = `${product.name} - ${intBrand.name} | Ideal Indiska Stockholm`;
      description = `Shop ${product.name} by ${intBrand.name} at Ideal Indiska LIVS. Trusted brand quality delivered fast across Stockholm and Europe. No customs duty in EU.`;
    }

    const locale = resolvedParams.locale;
    const localePath = locale === 'en' ? '' : `/${locale}`;
    const url = `${siteConfig.site_domain}${localePath}/product/${product.slug}`;

    // Construct alternates for SEO (hreflang)
    const enUrl = `${siteConfig.site_domain}/product/${product.slug}`;
    const svUrl = `${siteConfig.site_domain}/sv/product/${product.slug}`;

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
        languages: {
          'en': enUrl,
          'sv': svUrl,
        },
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
        locale: locale === 'sv' ? 'sv_SE' : 'en_SE',
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
