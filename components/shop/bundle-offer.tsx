'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { ShoppingCart, Package, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CurrencyPrice } from '@/components/ui/currency-price';
import { useCartStore } from '@/store/cart-store';
import { calculateBundlePrice } from '@/config/bundles.config';
import type { BundleOffer as BundleOfferType } from '@/config/bundles.config';
import type { Product } from '@/types/woocommerce';

interface BundleOfferProps {
  bundle: BundleOfferType;
  products: Product[];
}

export function BundleOfferCard({ bundle, products }: BundleOfferProps) {
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle');
  const { addItem, openCart } = useCartStore();

  // Build product lookup map
  const productMap = new Map<number, Product>();
  for (const p of products) {
    productMap.set(p.id, p);
  }

  // Check all products were fetched and in stock
  const allAvailable = bundle.items.every((item) => {
    const p = productMap.get(item.productId);
    return p && p.stock_status !== 'outofstock';
  });

  // Calculate pricing
  const priceMap = new Map<number, { price: string; regular_price: string }>();
  for (const p of products) {
    priceMap.set(p.id, { price: p.price, regular_price: p.regular_price });
  }
  const { originalTotal, bundlePrice, savings } = calculateBundlePrice(bundle, priceMap);

  const savingsPercent = originalTotal > 0
    ? Math.round((savings / originalTotal) * 100)
    : 0;

  const handleAddBundle = () => {
    if (!allAvailable || state === 'adding') return;
    setState('adding');

    // Calculate per-item bundle prices proportionally, adjusting last item for rounding
    const ratio = originalTotal > 0 ? bundlePrice / originalTotal : 1;
    let allocated = 0;

    for (let i = 0; i < bundle.items.length; i++) {
      const item = bundle.items[i];
      const product = productMap.get(item.productId);
      if (!product) continue;

      const originalUnitPrice = parseFloat(product.regular_price || product.price) || 0;
      let unitPrice: number;

      if (i === bundle.items.length - 1) {
        // Last item absorbs rounding difference
        unitPrice = Math.round(((bundlePrice - allocated) / item.quantity) * 100) / 100;
      } else {
        unitPrice = Math.round(originalUnitPrice * ratio * 100) / 100;
        allocated += unitPrice * item.quantity;
      }

      const bundledProduct = {
        ...product,
        price: unitPrice.toFixed(2),
        sale_price: unitPrice.toFixed(2),
        on_sale: true,
      };
      addItem(bundledProduct, item.quantity);
    }

    setState('added');
    openCart();
    setTimeout(() => setState('idle'), 2500);
  };

  if (savings <= 0 && !bundle.fixedPrice) return null;

  return (
    <div className="border-2 border-primary/20 rounded-xl bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-heading font-semibold text-sm text-foreground">
            Bundle Deal
          </span>
        </div>
        <div className="flex items-center gap-2">
          {bundle.badge && (
            <Badge variant="secondary" className="text-xs">
              {bundle.badge}
            </Badge>
          )}
          {savingsPercent > 0 && (
            <Badge className="bg-red-500 text-white text-xs hover:bg-red-600">
              Save {savingsPercent}%
            </Badge>
          )}
        </div>
      </div>

      {/* Bundle Info */}
      <div className="px-4 pt-3 pb-2">
        <h4 className="font-heading font-bold text-foreground text-base">
          {bundle.name}
        </h4>
        {bundle.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {bundle.description}
          </p>
        )}
      </div>

      {/* Product List */}
      <div className="px-4 pb-3 space-y-2">
        {bundle.items.map((item) => {
          const product = productMap.get(item.productId);
          if (!product) return null;
          const itemPrice = parseFloat(product.regular_price || product.price) || 0;
          const outOfStock = product.stock_status === 'outofstock';

          return (
            <div
              key={item.productId}
              className={`flex items-center gap-3 py-1.5 ${outOfStock ? 'opacity-50' : ''}`}
            >
              {/* Product Image */}
              <Link href={`/product/${product.slug}`} className="shrink-0">
                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted border border-border">
                  {product.images?.[0]?.src ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${product.slug}`} className="hover:underline">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                </Link>
                {outOfStock && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Out of stock
                  </span>
                )}
              </div>

              {/* Quantity & Price */}
              <div className="text-right shrink-0">
                <span className="text-xs text-muted-foreground">
                  x{item.quantity}
                </span>
                <div className="text-sm font-medium text-foreground">
                  <CurrencyPrice price={itemPrice * item.quantity} size="sm" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Summary */}
      <div className="px-4 py-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Regular total</span>
          <span className="text-sm text-muted-foreground line-through">
            <CurrencyPrice price={originalTotal} size="sm" />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Bundle price</span>
          <span className="text-lg font-bold text-primary">
            <CurrencyPrice price={bundlePrice} size="lg" />
          </span>
        </div>
        {savings > 0 && (
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1 text-right">
            You save <CurrencyPrice price={savings} size="sm" className="inline font-semibold" />
          </p>
        )}
      </div>

      {/* Add Bundle Button */}
      <div className="px-4 pb-4 pt-2">
        <Button
          onClick={handleAddBundle}
          disabled={!allAvailable || state === 'adding'}
          className="w-full rounded-full py-5"
          size="lg"
        >
          {state === 'added' ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added to Cart
            </>
          ) : state === 'adding' ? (
            'Adding...'
          ) : !allAvailable ? (
            'Some items unavailable'
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add Bundle to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/**
 * Renders all bundle offers for a product
 */
interface BundleOffersProps {
  bundles: BundleOfferType[];
  products: Product[];
}

export function BundleOffers({ bundles, products }: BundleOffersProps) {
  if (!bundles.length) return null;

  return (
    <div className="space-y-4">
      {bundles.map((bundle) => (
        <BundleOfferCard key={bundle.id} bundle={bundle} products={products} />
      ))}
    </div>
  );
}
