'use client';

import { ExpressCheckoutElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useMemo, useEffect } from 'react';
import type {
    StripeExpressCheckoutElementOptions,
    StripeElementsOptionsMode,
} from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface ExpressCheckoutProps {
    amount: number;
    currency?: string;
    onSuccess: (paymentIntent: any) => void;
    onError?: (error: string) => void;
    showDebug?: boolean;
}

/**
 * Express Checkout Element Component
 * Uses the NEW Stripe ExpressCheckoutElement (same as WordPress Stripe Gateway)
 */
function ExpressCheckoutInner({
    amount,
    onSuccess,
    onError,
    showDebug = false,
}: ExpressCheckoutProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable' | 'error'>('loading');
    const [availableMethods, setAvailableMethods] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    useEffect(() => {
        console.log('🔧 ExpressCheckoutInner mounted');
        console.log('🔧 Stripe:', !!stripe);
        console.log('🔧 Elements:', !!elements);
        console.log('🔧 Amount:', amount);
    }, [stripe, elements, amount]);

    // Handle click - called when user clicks the button
    const handleClick = (event: any) => {
        console.log('🔘 Express Checkout clicked:', event.expressPaymentType);
        event.resolve();
    };

    // Handle confirm - called after user authenticates
    const handleConfirm = async (event: any) => {
        if (!stripe || !elements) {
            onError?.('Stripe not loaded');
            return;
        }

        console.log('✅ Confirming payment:', event.expressPaymentType);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/stripe-return`,
                },
            });

            if (error) {
                console.error('Payment error:', error);
                onError?.(error.message || 'Payment failed');
            } else {
                console.log('Payment submitted');
                onSuccess({ success: true });
            }
        } catch (err) {
            console.error('Payment exception:', err);
            onError?.(err instanceof Error ? err.message : 'Payment failed');
        }
    };

    // Handle ready - called when element is ready
    const handleReady = (event: { availablePaymentMethods?: Record<string, boolean> }) => {
        console.log('📱 ExpressCheckout onReady fired');
        console.log('📱 Available payment methods:', event.availablePaymentMethods);
        console.log('📱 Full event:', event);

        setAvailableMethods(event.availablePaymentMethods);

        if (event.availablePaymentMethods && Object.keys(event.availablePaymentMethods).length > 0) {
            const hasMethod = Object.values(event.availablePaymentMethods).some(v => v === true);
            console.log('📱 Has at least one method:', hasMethod);
            setStatus(hasMethod ? 'ready' : 'unavailable');
        } else {
            console.log('📱 No payment methods available');
            setStatus('unavailable');
        }
    };

    // Handle load error
    const handleLoadError = (event: { error: { message: string } }) => {
        console.error('❌ ExpressCheckout load error:', event.error);
        setStatus('error');
        setErrorMsg(event.error?.message || 'Failed to load');
    };

    // Options for the Express Checkout Element  
    const expressCheckoutOptions: StripeExpressCheckoutElementOptions = {
        buttonHeight: 48,
        buttonTheme: {
            applePay: 'black',
            googlePay: 'black',
        },
        buttonType: {
            applePay: 'plain',
            googlePay: 'plain',
        },
        paymentMethods: {
            applePay: 'always',
            googlePay: 'always',
            link: 'auto',
        },
        layout: {
            maxRows: 2,
            maxColumns: 4,
            overflow: 'never',
        },
    };

    // Don't hide if unavailable in debug mode
    if (status === 'unavailable' && !showDebug) {
        return null;
    }

    return (
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
            {/* Header */}
            <div className="mb-4 flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Express Checkout
                </span>
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Fast & Secure
                </span>
            </div>

            {/* Express Checkout Element Container */}
            <div className="min-h-[48px]">
                <ExpressCheckoutElement
                    options={expressCheckoutOptions}
                    onClick={handleClick}
                    onConfirm={handleConfirm}
                    onReady={handleReady}
                    onLoadError={handleLoadError}
                />
            </div>

            {/* Debug info */}
            {showDebug && (
                <div className="mt-4 rounded bg-yellow-50 p-3 text-xs dark:bg-yellow-900/20">
                    <p className="font-bold text-yellow-800 dark:text-yellow-300">Debug Info:</p>
                    <p>Status: <strong>{status}</strong></p>
                    <p>Stripe loaded: {stripe ? 'Yes' : 'No'}</p>
                    <p>Elements loaded: {elements ? 'Yes' : 'No'}</p>
                    <p>Amount: {amount} SEK ({Math.round(amount * 100)} öre)</p>
                    <p>Available methods: {JSON.stringify(availableMethods)}</p>
                    {errorMsg && <p className="text-red-600">Error: {errorMsg}</p>}
                    <p className="mt-2 text-yellow-700">
                        <strong>Check Stripe Dashboard:</strong><br />
                        1. Go to Settings → Payment Methods<br />
                        2. Enable Apple Pay and Google Pay<br />
                        3. Go to Settings → Apple Pay → Add domain
                    </p>
                </div>
            )}

            {/* Status messages */}
            {status === 'loading' && (
                <p className="mt-2 text-center text-xs text-neutral-500">
                    Loading payment options...
                </p>
            )}

            {status === 'error' && (
                <p className="mt-2 text-center text-xs text-red-500">
                    Error loading payment options: {errorMsg}
                </p>
            )}

            {status === 'unavailable' && showDebug && (
                <p className="mt-2 text-center text-xs text-orange-500">
                    No express payment methods available.
                    Make sure Apple Pay & Google Pay are enabled in Stripe Dashboard.
                </p>
            )}

            {status === 'ready' && (
                <>
                    <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        Pay instantly with Apple Pay, Google Pay, or Link
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        <span className="text-sm font-medium text-neutral-500">Or continue below</span>
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * Wrapper component with Stripe Elements context
 */
export function StripeExpressCheckout(props: ExpressCheckoutProps) {
    const { amount, currency = 'SEK' } = props;

    // Elements options for deferred payment intent
    const elementsOptions: StripeElementsOptionsMode = useMemo(() => ({
        mode: 'payment',
        amount: Math.round(amount * 100), // Amount in smallest currency unit (öre)
        currency: currency.toLowerCase(),
        // IMPORTANT: For Express Checkout to work without a PaymentIntent,
        // we need to use payment_method_creation: 'manual'
        paymentMethodCreation: 'manual',
        appearance: {
            theme: 'stripe',
            variables: {
                borderRadius: '8px',
            },
        },
    }), [amount, currency]);

    // Debug logging
    useEffect(() => {
        console.log('🚀 StripeExpressCheckout mounting');
        console.log('🚀 Amount:', amount, currency);
        console.log('🚀 Stripe Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...');
    }, [amount, currency]);

    if (amount <= 0) {
        console.log('⚠️ Amount is 0 or less, not rendering');
        return null;
    }

    return (
        <Elements stripe={stripePromise} options={elementsOptions}>
            <ExpressCheckoutInner {...props} />
        </Elements>
    );
}

export default StripeExpressCheckout;
