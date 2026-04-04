'use client';

import { useCartStore } from '@/store/cart-store';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Gift, Loader2, Truck, Package, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/woocommerce';
import { ShippingMethod } from '@/lib/shipping-service';
import { CommerceRules } from '@/config/commerce-rules';
import { useEffect, useState } from 'react';
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

  // Pending pickup selection — awaits confirmation dialog
  const [pendingPickupMethod, setPendingPickupMethod] = useState<ShippingMethod | null>(null);

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

      {/* Promo item notice — free shipping gone, no need for this alert */}

      {/* Shipping Methods */}
      <RadioGroup
        value={selectedMethod || selectedShippingMethod?.id}
        onValueChange={(id) => {
          const method = visibleMethods.find((m) => m.id === id);
          if (!method) return;
          // Intercept local_pickup — require explicit confirmation first
          if (method.method_id === 'local_pickup') {
            setPendingPickupMethod(method);
            return;
          }
          if (onMethodChange) {
            onMethodChange(method);
            if (onShippingCostChange) onShippingCostChange(method.cost);
          } else {
            selectShippingMethod(method);
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
                if (method.method_id === 'local_pickup') {
                  setPendingPickupMethod(method);
                  return;
                }
                if (onMethodChange) {
                  onMethodChange(method);
                  if (onShippingCostChange) onShippingCostChange(method.cost);
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
                        {method.method_id === 'local_pickup' && (
                          <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            Collect from store
                          </span>
                        )}
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
                    {/* Store pickup clarification */}
                    {method.method_id === 'local_pickup' && (
                      <p className="mt-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300">
                        📍 <strong>You collect from our store:</strong> Bandhagsplan 4, 12432 Bandhagen, Stockholm. We will notify you when your order is ready to pick up.
                      </p>
                    )}
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

      {/* Store pickup confirmation dialog */}
      <Dialog open={!!pendingPickupMethod} onOpenChange={(open) => { if (!open) setPendingPickupMethod(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              Confirm Store Pickup
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-2 text-sm text-foreground">
                <p>
                  Store pickup is <strong>only available at our physical store</strong> in Stockholm.
                  You must personally come to collect your order.
                </p>
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
                  <p className="font-semibold">📍 Store address:</p>
                  <p>Bandhagsplan 4, 124 32 Bandhagen, Stockholm</p>
                </div>
                <p className="font-medium text-destructive">
                  ⚠️ If you are not in Stockholm or cannot collect in person, please choose a delivery option. Orders placed as pickup and not collected will be cancelled, and a minimum cancellation fee of <strong>20 kr</strong> will be charged to cover Stripe payment processing costs.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setPendingPickupMethod(null)}
            >
              Choose delivery instead
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                if (!pendingPickupMethod) return;
                if (onMethodChange) {
                  onMethodChange(pendingPickupMethod);
                  if (onShippingCostChange) onShippingCostChange(pendingPickupMethod.cost);
                } else {
                  selectShippingMethod(pendingPickupMethod);
                }
                setPendingPickupMethod(null);
              }}
            >
              Yes, I will collect from the store
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
