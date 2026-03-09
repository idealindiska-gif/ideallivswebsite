'use client';

import { useCartStore } from '@/store/cart-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CartThresholdMessages({
  className,
  showFreeShipping = true,
}: {
  className?: string;
  showFreeShipping?: boolean;
}) {
  // showFreeShipping prop kept for backwards compatibility but free shipping
  // is no longer offered — we just show a neutral delivery note.
  void showFreeShipping;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Delivery info note */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
        <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription>
          <p className="font-medium text-blue-800 dark:text-blue-300">
            Delivery available across Stockholm & Sweden.
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Shipping costs are calculated at checkout based on your address.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
