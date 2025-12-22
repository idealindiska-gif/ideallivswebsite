'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StripePaymentFormProps {
    amount: number;
    currency: string;
    onSuccess: (paymentIntentId: string) => void;
    onError?: (error: string) => void;
}

export function StripePaymentForm({
    amount,
    currency,
    onSuccess,
    onError,
}: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Confirm the payment
            const { error: submitError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success`,
                },
                redirect: 'if_required',
            });

            if (submitError) {
                setError(submitError.message || 'Payment failed');
                onError?.(submitError.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent.id);
            } else if (paymentIntent && paymentIntent.status === 'requires_action') {
                // 3D Secure or other authentication required
                setError('Additional authentication required. Please complete the verification.');
                setIsProcessing(false);
            } else {
                setError('Payment processing. Please wait...');
                setIsProcessing(false);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            onError?.(err instanceof Error ? err.message : 'An unexpected error occurred');
            setIsProcessing(false);
        }
    };

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Payment Amount Display */}
                    <div className="flex items-center justify-between rounded-lg bg-primary-50 p-4 dark:bg-primary-950/20">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            <span className="font-medium text-primary-950 dark:text-primary-50">
                                Total Amount
                            </span>
                        </div>
                        <span className="text-xl font-bold text-primary-700 dark:text-primary-400">
                            {new Intl.NumberFormat('sv-SE', {
                                style: 'currency',
                                currency: currency,
                            }).format(amount)}
                        </span>
                    </div>

                    {/* Stripe Payment Element */}
                    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                        <PaymentElement
                            options={{
                                layout: {
                                    type: 'accordion',
                                    defaultCollapsed: false,
                                    radios: true,
                                    spacedAccordionItems: true,
                                },
                                paymentMethodOrder: ['apple_pay', 'google_pay', 'klarna', 'card', 'link'],
                                wallets: {
                                    applePay: 'auto',
                                    googlePay: 'auto',
                                },
                                business: {
                                    name: 'Ideal Indiska LIVS',
                                },
                            }}
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!stripe || isProcessing}
                        className="w-full"
                        size="lg"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing Payment...
                            </>
                        ) : (
                            <>
                                Pay {new Intl.NumberFormat('sv-SE', {
                                    style: 'currency',
                                    currency: currency,
                                }).format(amount)}
                            </>
                        )}
                    </Button>

                    {/* Payment Security Notice */}
                    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                        Your payment information is encrypted and secure. Powered by{' '}
                        <span className="font-semibold">Stripe</span>.
                    </p>
                </div>
            </form>
        </Card>
    );
}
