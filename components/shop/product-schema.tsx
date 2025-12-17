import type { Product, ProductReview } from '@/types/woocommerce';

interface ProductSchemaProps {
  product: Product;
  reviews?: ProductReview[];
}

export function ProductSchema({ product, reviews = [] }: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description?.replace(/<[^>]*>/g, '') || product.description?.replace(/<[^>]*>/g, ''),
    image: product.images?.map((img) => img.src) || [],
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: product.permalink,
      priceCurrency: 'SEK',
      price: product.price,
      priceValidUntil: product.date_on_sale_to || undefined,
      availability:
        product.stock_status === 'instock'
          ? 'https://schema.org/InStock'
          : product.stock_status === 'onbackorder'
          ? 'https://schema.org/BackOrder'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Royal Sweets & Restaurant',
      },
    },
    aggregateRating:
      product.rating_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.average_rating,
            reviewCount: product.rating_count,
            bestRating: '5',
            worstRating: '1',
          }
        : undefined,
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.reviewer,
      },
      datePublished: review.date_created,
      reviewBody: review.review.replace(/<[^>]*>/g, ''),
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
    })),
  };

  // Remove undefined fields
  const cleanedSchema = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanedSchema) }}
    />
  );
}
