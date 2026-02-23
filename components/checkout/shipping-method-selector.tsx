'use client';

import { useCartStore } from '@/store/cart-store';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Gift, Loader2, Truck, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/woocommerce';
import { ShippingMethod } from '@/lib/shipping-service';
import { CommerceRules } from '@/config/commerce-rules';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export type { ShippingMethod };

interface ShippingMethodSelectorProps {
  postcode?: string;
  cartTotal?: number;
  selectedMethod?: string;
  onMethodChange?: (method: ShippingMethod) => void;
  onShippingCostChange?: (cost: number) => void;
  className?: string;
}

export function ShippingMethodSelector({
  postcode,
  cartTotal,
  selectedMethod,
  onMethodChange,
  onShippingCostChange,
  className
}: ShippingMethodSelectorProps) {
  const {
    items,
    shippingAddress,
    availableShippingMethods,
    selectedShippingMethod,
    restrictedProducts,
    isCalculatingShipping,
    freeShippingThreshold,
    amountToFreeShipping,
    selectShippingMethod,
    getSubtotal,
  } = useCartStore();
  const t = useTranslations('shippingMethod');

  // Use props if provided, otherwise fall back to cart store
  const effectivePostcode = postcode || shippingAddress?.postcode;
  const subtotal = cartTotal !== undefined ? cartTotal : getSubtotal();
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;

  // Hide free shipping when any promotional item is in the cart
  const hasPromoItem = items.some(item =>
    CommerceRules.isPromotionalProduct(item.product.tags || [])
  );
  const visibleMethods = hasPromoItem
    ? availableShippingMethods.filter(m => m.method_id !== 'free_shipping')
    : availableShippingMethods;

  // FIX: Auto-notify parent when cart store selects free shipping AND customer qualifies
  useEffect(() => {
    if (selectedShippingMethod && onMethodChange && !selectedMethod) {
      // Only auto-select free shipping if customer qualifies AND cart has no promo items
      if (selectedShippingMethod.method_id === 'free_shipping') {
        if (qualifiesForFreeShipping && !hasPromoItem) {
          console.log('✅ Auto-selecting free shipping (qualifies):', subtotal, '>=', freeShippingThreshold);
          onMethodChange(selectedShippingMethod);
          if (onShippingCostChange) {
            onShippingCostChange(selectedShippingMethod.cost);
          }
        } else {
          console.log('⚠️ Not auto-selecting free shipping (promo item or does not qualify)');
          // Don't auto-select - let user choose another method
        }
      } else {
        // For non-free shipping methods (like store pickup), auto-select them
        console.log('✅ Auto-selecting shipping method:', selectedShippingMethod.label);
        onMethodChange(selectedShippingMethod);
        if (onShippingCostChange) {
          onShippingCostChange(selectedShippingMethod.cost);
        }
      }
    }
  }, [selectedShippingMethod, onMethodChange, onShippingCostChange, selectedMethod, qualifiesForFreeShipping, subtotal, freeShippingThreshold, hasPromoItem]);

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'local_pickup':
        return <Package className="h-5 w-5" />;
      case 'free_shipping':
        return <Gift className="h-5 w-5 text-green-600" />;
      default:
        return <Truck className="h-5 w-5" />;
    }
  };

  // 1. No address entered
  if (!effectivePostcode && !shippingAddress) {
    return (
      <Alert className={className}>
        <AlertDescription>
          {t('noMethods')}
        </AlertDescription>
      </Alert>
    );
  }

  // 2. Calculating shipping
  if (isCalculatingShipping) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
          <span className="text-neutral-600">
            {t('calculating')}
          </span>
        </div>
      </Card>
    );
  }

  // 3. Restricted products
  if (restrictedProducts.length > 0) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <p className="font-semibold">
            Some products cannot be shipped to your address:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {restrictedProducts.map((product) => (
              <li key={product.product_id}>
                <strong>{product.product_name}</strong>: {product.reason}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  // 4. No methods available
  if (availableShippingMethods.length === 0) {
    return (
      <Alert className={className}>
        <AlertDescription>
          {t('noMethods')}
        </AlertDescription>
      </Alert>
    );
  }

  // 5. Show methods with free shipping progress
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary-950 dark:text-primary-50">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {t('subtitle', { address: `${effectivePostcode || shippingAddress?.postcode}${shippingAddress?.city ? `, ${shippingAddress.city}` : ''}` })}
        </p>
      </div>

      {/* Promo item notice */}
      {hasPromoItem && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-300">
            Free shipping is not available when your cart contains promotional items.
          </AlertDescription>
        </Alert>
      )}

      {/* Shipping Methods */}
      <RadioGroup
        value={selectedMethod || selectedShippingMethod?.id}
        onValueChange={(id) => {
          const method = visibleMethods.find((m) => m.id === id);
          if (method) {
            // Use callback props if provided, otherwise use cart store
            if (onMethodChange) {
              onMethodChange(method);
              if (onShippingCostChange) {
                onShippingCostChange(method.cost);
              }
            } else {
              selectShippingMethod(method);
            }
          }
        }}
      >
        <div className="space-y-3">
          {visibleMethods.map((method) => (
            <Card
              key={method.id}
              className={cn(
                'cursor-pointer transition-all hover:border-primary-500',
                (selectedMethod || selectedShippingMethod?.id) === method.id
                  ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500 dark:bg-primary-950/20'
                  : 'border-neutral-200 dark:border-neutral-800'
              )}
              onClick={() => {
                if (onMethodChange) {
                  onMethodChange(method);
                  if (onShippingCostChange) {
                    onShippingCostChange(method.cost);
                  }
                } else {
                  selectShippingMethod(method);
                }
              }}
            >
              <div className="flex items-start gap-4 p-4">
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="mt-1"
                />
                <div className="flex flex-1 items-start gap-3">
                  <div className="mt-0.5 text-primary-600 dark:text-primary-400">
                    {getMethodIcon(method.method_id)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Label
                        htmlFor={method.id}
                        className="cursor-pointer font-semibold text-primary-950 dark:text-primary-50"
                      >
                        {method.label}
                      </Label>
                      <span className="font-bold text-primary-700 dark:text-primary-400">
                        {method.cost === 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            Free
                          </span>
                        ) : (
                          formatPrice(method.total_cost, 'SEK')
                        )}
                      </span>
                    </div>
                    {/* Show DHL info if available */}
                    {method.method_id.includes('dhl') && (
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {t('poweredBy')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
