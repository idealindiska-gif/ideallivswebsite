'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useCartStore } from '@/store/cart-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { Link } from '@/lib/navigation';

function RecoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, clearCart } = useCartStore();

  const [status, setStatus] = useState<'loading' | 'restoring' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setErrorMessage('Invalid recovery link.');
      setStatus('error');
      return;
    }

    const restore = async () => {
      try {
        const res = await fetch(`/api/abandoned-cart/recover?token=${token}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Cart not found');
        }

        const { orderId, billingData, items } = await res.json();

        if (!items?.length) {
          throw new Error('Your saved cart appears to be empty.');
        }

        setStatus('restoring');

        // Clear any existing cart and restore the saved one
        clearCart();
        for (const item of items) {
          if (item?.product) {
            addItem(item.product, item.quantity, item.variation ?? undefined);
          }
        }

        // Save billing data + abandoned cart order ID to sessionStorage so the
        // checkout page can pre-fill the form and clean up the abandoned record
        if (billingData?.email) {
          sessionStorage.setItem(
            'abandoned_cart_recovery',
            JSON.stringify({ billingData, abandonedCartId: orderId })
          );
        }

        setStatus('success');

        // Redirect to checkout after a brief delay
        setTimeout(() => {
          router.push('/checkout');
        }, 1500);
      } catch (err) {
        console.error('Cart recovery error:', err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Unable to recover your cart. It may have expired.'
        );
        setStatus('error');
      }
    };

    restore();
  }, [searchParams, clearCart, addItem, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center">
        {(status === 'loading' || status === 'restoring') && (
          <>
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <h1 className="mb-2 text-xl font-semibold text-foreground">
              {status === 'restoring' ? 'Restoring your cart…' : 'Loading your saved cart…'}
            </h1>
            <p className="text-muted-foreground">Just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h1 className="mb-2 text-xl font-semibold text-foreground">Cart restored!</h1>
            <p className="text-muted-foreground">Redirecting you to checkout…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h1 className="mb-2 text-xl font-semibold text-foreground">Link expired</h1>
            <p className="mb-6 text-sm text-muted-foreground">{errorMessage}</p>
            <div className="flex flex-col gap-3">
              <Button asChild className="rounded-full">
                <Link href="/shop">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function RecoverPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading…</p>
          </Card>
        </div>
      }
    >
      <RecoverContent />
    </Suspense>
  );
}
