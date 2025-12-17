# Schema Generation System

Production-ready, modular, reusable JSON-LD schema generation system for SEO.

## Overview

This system provides clean, pure functions for generating Google-friendly JSON-LD structured data. It's framework-agnostic JavaScript that works seamlessly with Next.js (SSR + SSG).

## Features

- ✅ **Modular Architecture** - Each schema type in its own file
- ✅ **Pure Functions** - No side effects, fully testable
- ✅ **Framework Agnostic** - Works with any JavaScript framework
- ✅ **Type Safe** - Full TypeScript support
- ✅ **WooCommerce Ready** - Built-in helpers for WooCommerce data
- ✅ **Composable** - Schemas can be combined and nested
- ✅ **Google Rich Results** - Optimized for Google search features
- ✅ **Anmol Sweets Pre-configured** - Ready-to-use brand schemas

## Folder Structure

```
lib/schema/
├── types.ts              # TypeScript type definitions
├── base.ts               # Core utility functions
├── organization.ts       # Organization/Restaurant schema
├── brand.ts              # Brand schema
├── product.ts            # Product + Offer schema
├── category.ts           # Category/CollectionPage schema
├── breadcrumb.ts         # Breadcrumb navigation schema
├── website.ts            # WebSite + WebPage schema
├── schema-script.tsx     # React components for schema injection
├── index.ts              # Main exports
└── README.md             # This file
```

## Installation

Already installed! Just import from `@/lib/schema`:

```typescript
import { productSchema, breadcrumbSchema } from '@/lib/schema';
```

## Quick Start

### 1. Product Page Schema

```tsx
import { wooCommerceProductSchema, productBreadcrumbs, breadcrumbSchema } from '@/lib/schema';
import { SchemaScript } from '@/lib/schema/schema-script';

export default function ProductPage({ product }) {
  const baseUrl = 'https://anmolsweets.se';

  // Generate product schema
  const productJsonLd = wooCommerceProductSchema(product, { baseUrl });

  // Generate breadcrumb schema
  const breadcrumbJsonLd = breadcrumbSchema(
    productBreadcrumbs(
      {
        name: product.name,
        category: { name: product.categories[0].name, slug: product.categories[0].slug }
      },
      baseUrl
    )
  );

  return (
    <>
      <head>
        <SchemaScript schema={[productJsonLd, breadcrumbJsonLd]} />
      </head>
      {/* Your page content */}
    </>
  );
}
```

### 2. Category Page Schema

```tsx
import { wooCategorySchema, categoryBreadcrumbs, breadcrumbSchema } from '@/lib/schema';
import { SchemaScript } from '@/lib/schema/schema-script';

export default function CategoryPage({ category, products }) {
  const baseUrl = 'https://anmolsweets.se';

  // Generate category schema with products
  const categoryJsonLd = wooCategorySchema(category, products, {
    baseUrl,
    websiteId: `${baseUrl}/#website`
  });

  // Generate breadcrumb schema
  const breadcrumbJsonLd = breadcrumbSchema(
    categoryBreadcrumbs({ name: category.name }, baseUrl)
  );

  return (
    <>
      <head>
        <SchemaScript schema={[categoryJsonLd, breadcrumbJsonLd]} />
      </head>
      {/* Your page content */}
    </>
  );
}
```

### 3. Homepage Schema (Full)

```tsx
import {
  anmolOrganizationSchemaFull,
  anmolWebsiteSchema,
  schemaGraph
} from '@/lib/schema';
import { SchemaScript } from '@/lib/schema/schema-script';

export default function HomePage() {
  const baseUrl = 'https://anmolsweets.se';

  // Combine multiple schemas into a graph
  const graph = schemaGraph(
    anmolOrganizationSchemaFull(baseUrl),
    anmolWebsiteSchema(baseUrl)
  );

  return (
    <>
      <head>
        <SchemaScript schema={graph} />
      </head>
      {/* Your page content */}
    </>
  );
}
```

### 4. Blog Post Schema

```tsx
import { postBreadcrumbs, breadcrumbSchema, webpageSchema } from '@/lib/schema';
import { SchemaScript } from '@/lib/schema/schema-script';

export default function BlogPost({ post }) {
  const baseUrl = 'https://anmolsweets.se';

  // Generate webpage schema
  const pageJsonLd = webpageSchema({
    name: post.title,
    url: `${baseUrl}/blog/${post.slug}`,
    description: post.excerpt,
    websiteId: `${baseUrl}/#website`,
    datePublished: post.date,
    dateModified: post.modified,
    language: 'en'
  });

  // Generate breadcrumb schema
  const breadcrumbJsonLd = breadcrumbSchema(
    postBreadcrumbs(
      {
        title: post.title,
        category: post.categories[0]
      },
      baseUrl
    )
  );

  return (
    <>
      <head>
        <SchemaScript schema={[pageJsonLd, breadcrumbJsonLd]} />
      </head>
      {/* Your page content */}
    </>
  );
}
```

## Available Schema Functions

### Organization

```typescript
// Generic organization schema
organizationSchema(config: OrganizationInput): Organization

// Pre-configured Anmol Sweets basic schema
anmolOrganizationSchema(baseUrl?: string): Organization

// Pre-configured Anmol Sweets full schema (with buffets, amenities, etc.)
anmolOrganizationSchemaFull(baseUrl?: string): Organization
```

### Brand

```typescript
// Generic brand schema
brandSchema(name: string, options?: {...}): Brand

// Pre-configured Anmol Sweets brand
anmolBrandSchema(): Brand
```

### Product

```typescript
// Generic product schema
productSchema(product: ProductInput, options?: {...}): Product

// WooCommerce product schema
wooCommerceProductSchema(wooProduct: {...}, options?: {...}): Product

// Product list item (for categories)
productListItem(product: ProductInput, position: number, options?: {...})
```

### Category

```typescript
// Generic category schema
categorySchema(category: CategoryInput, options?: {...}): CollectionPage

// WooCommerce category schema
wooCategorySchema(wooCategory: {...}, wooProducts: [...], options: {...}): CollectionPage
```

### Breadcrumbs

```typescript
// Generic breadcrumb schema
breadcrumbSchema(items: BreadcrumbInput[], currentPageUrl?: string): BreadcrumbList

// Build breadcrumbs from URL path
buildBreadcrumbsFromPath(path: string, baseUrl: string, labels?: {...}): BreadcrumbInput[]

// Product page breadcrumbs
productBreadcrumbs(product: {...}, baseUrl: string): BreadcrumbInput[]

// Category page breadcrumbs
categoryBreadcrumbs(category: {...}, baseUrl: string): BreadcrumbInput[]

// Blog post breadcrumbs
postBreadcrumbs(post: {...}, baseUrl: string): BreadcrumbInput[]
```

### Website

```typescript
// Generic website schema
websiteSchema(config: {...}): WebSite

// Generic webpage schema
webpageSchema(config: {...}): WebPage

// Pre-configured Anmol Sweets website
anmolWebsiteSchema(baseUrl?: string): WebSite

// Combine multiple schemas into a graph
schemaGraph(...schemas: unknown[]): Graph
```

## React Components

### SchemaScript

Minified JSON-LD output (recommended for production):

```tsx
import { SchemaScript } from '@/lib/schema/schema-script';

<SchemaScript schema={mySchema} />
```

### PrettySchemaScript

Pretty-printed JSON-LD output (useful for debugging):

```tsx
import { PrettySchemaScript } from '@/lib/schema/schema-script';

<PrettySchemaScript schema={mySchema} />
```

### MultiSchemaScript

Multiple schemas as a graph:

```tsx
import { MultiSchemaScript } from '@/lib/schema/schema-script';

<MultiSchemaScript schemas={[schema1, schema2, schema3]} />
```

## Utility Functions

### Base Utilities

```typescript
// Format price for schema
formatSchemaPrice(price: number | string): string

// Convert availability to Schema.org URL
formatAvailability(status: 'InStock' | 'OutOfStock' | ...): string

// Convert item condition to Schema.org URL
formatItemCondition(condition: 'NewCondition' | ...): string

// Create image object
createImageObject(url: string, options?: {...}): ImageObject

// Sanitize text (remove HTML, decode entities)
sanitizeSchemaText(text: string): string

// Remove undefined/null fields
cleanSchema<T>(schema: T): T

// Get price valid until date
getPriceValidUntil(months?: number): string

// Format opening hours
formatOpeningHours(hours: [...])

// Get image URLs from various formats
getFirstImageUrl(images: ...): string | undefined
getAllImageUrls(images: ...): string[]
```

## Best Practices

### 1. Always Include Breadcrumbs

Breadcrumbs help Google understand your site structure:

```tsx
const breadcrumbJsonLd = breadcrumbSchema([
  { name: 'Home', url: 'https://anmolsweets.se' },
  { name: 'Menu', url: 'https://anmolsweets.se/shop' },
  { name: 'Sweets', url: 'https://anmolsweets.se/shop/category/sweets' },
  { name: 'Gulab Jamun' } // Current page (no URL)
]);
```

### 2. Use Graph Structure on Important Pages

Combine Organization + Website + Page schemas:

```tsx
const graph = schemaGraph(
  anmolOrganizationSchema(),
  anmolWebsiteSchema(),
  webpageSchema({ ... })
);
```

### 3. Include Product Images

Always add high-quality product images:

```tsx
const productJsonLd = productSchema({
  name: 'Gulab Jamun',
  images: [
    { src: 'https://...image1.jpg', alt: 'Gulab Jamun' },
    { src: 'https://...image2.jpg', alt: 'Gulab Jamun close-up' }
  ],
  // ...
});
```

### 4. Add Reviews When Available

Include aggregate ratings if you have reviews:

```tsx
const productJsonLd = productSchema({
  name: 'Samosa',
  rating: 4.8,
  reviewCount: 127,
  // ...
});
```

### 5. Keep Descriptions Clean

Use `sanitizeSchemaText` to remove HTML:

```tsx
import { sanitizeSchemaText } from '@/lib/schema';

const cleanDescription = sanitizeSchemaText(product.description);
```

## Testing Schemas

### Google Rich Results Test

1. Copy the generated JSON-LD
2. Go to: https://search.google.com/test/rich-results
3. Paste and test

### Schema.org Validator

1. Copy the generated JSON-LD
2. Go to: https://validator.schema.org/
3. Paste and validate

## Migration Guide

### From Old Schema System

If you have existing schema code, here's how to migrate:

**Before:**
```php
// Old WordPress PHP approach
function my_product_schema() {
  $schema = array(
    '@context' => 'https://schema.org',
    '@type' => 'Product',
    'name' => get_the_title(),
    // ...
  );
  echo '<script type="application/ld+json">' . json_encode($schema) . '</script>';
}
```

**After:**
```tsx
import { wooCommerceProductSchema } from '@/lib/schema';
import { SchemaScript } from '@/lib/schema/schema-script';

const productJsonLd = wooCommerceProductSchema(product, { baseUrl: 'https://anmolsweets.se' });

<SchemaScript schema={productJsonLd} />
```

## Customization for Other Brands

To use this system for another brand:

1. **Update base configuration:**
   ```typescript
   // In your config file
   const brandConfig = {
     name: 'Your Brand',
     url: 'https://yourbrand.com',
     // ...
   };
   ```

2. **Use generic functions:**
   ```typescript
   const orgSchema = organizationSchema({
     name: brandConfig.name,
     url: brandConfig.url,
     // ...
   });
   ```

3. **Or create brand-specific helpers:**
   ```typescript
   export function yourBrandOrganizationSchema() {
     return organizationSchema({
       // Your brand data
     });
   }
   ```

## Troubleshooting

### Schema Not Appearing

1. Check browser console for errors
2. View page source to verify `<script type="application/ld+json">` is rendered
3. Test with Google Rich Results Test

### Invalid Schema Errors

1. Ensure required fields are present (name, url, etc.)
2. Check price format (must be valid number)
3. Verify image URLs are absolute, not relative
4. Use `cleanSchema` to remove empty fields

### Next.js Hydration Errors

If you see hydration warnings:

```tsx
// Use suppressHydrationWarning
<head suppressHydrationWarning>
  <SchemaScript schema={mySchema} />
</head>
```

## Support

For schema-related questions:
- Google Rich Results Guide: https://developers.google.com/search/docs/appearance/structured-data
- Schema.org Documentation: https://schema.org/

---

**Version:** 1.0
**Last Updated:** December 2025
**Maintained for:** Anmol Sweets & Restaurant
