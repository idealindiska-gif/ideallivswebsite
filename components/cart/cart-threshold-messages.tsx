'use client';

import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/woocommerce';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

const MINIMUM_ORDER = 300; // SEK
const FREE_SHIPPING_THRESHOLD = 500; // SEK

export function CartThresholdMessages({
  className,
  showMinimumOrder = true,
  showFreeShipping = true,
}: {
  className?: string;
  showMinimumOrder?: boolean;
  showFreeShipping?: boolean;
}) {
  const { getSubtotal, freeShippingThreshold, amountToFreeShipping, minimumOrderMet } =
    useCartStore();

  const subtotal = getSubtotal();
  const actualMinimumOrder = MINIMUM_ORDER;
  const actualFreeShippingThreshold = freeShippingThreshold || FREE_SHIPPING_THRESHOLD;
  const minimumMet = subtotal >= actualMinimumOrder;
  const freeShippingMet = subtotal >= actualFreeShippingThreshold;
  const amountToMinimum = Math.max(0, actualMinimumOrder - subtotal);
  const amountToFree = Math.max(
    0,
    actualFreeShippingThreshold - subtotal
  );
  const freeShippingProgress = Math.min(
    (subtotal / actualFreeShippingThreshold) * 100,
    100
  );

  return (
    <div className={cn('space-y-3', className)}>
      {/* 1. MINIMUM ORDER WARNING (below 550 SEK) */}
      {showMinimumOrder && !minimumMet && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">
              Your current order total is {formatPrice(subtotal, 'SEK')} — you must have
              an order with a minimum of {formatPrice(actualMinimumOrder, 'SEK')} to
              place your order.
            </p>
            <p className="mt-2 text-sm">
              Add {formatPrice(amountToMinimum, 'SEK')} more to continue.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* 2. FREE SHIPPING PROGRESS (300-499 SEK) */}
      {showFreeShipping && minimumMet && !freeShippingMet && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
          <Gift className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-green-800 dark:text-green-300">
                You only need {formatPrice(amountToFree, 'SEK')} more to get free
                shipping for Stockholm!
              </p>
              <Progress value={freeShippingProgress} className="h-2" />
              <div className="flex justify-between text-xs text-green-700 dark:text-green-400">
                <span>{formatPrice(subtotal, 'SEK')}</span>
                <span>{formatPrice(actualFreeShippingThreshold, 'SEK')}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 3. FREE SHIPPING ACHIEVED (500+ SEK) */}
      {showFreeShipping && freeShippingMet && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
          <Gift className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription>
            <p className="font-semibold text-green-800 dark:text-green-300">
              Congratulations! You qualify for free shipping to Stockholm!
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
