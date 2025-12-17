'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ReactNode, useEffect, useState } from 'react';

// Load Stripe.js
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
    if (!stripePromise) {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!key) {
            console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
            return Promise.resolve(null);
        }

        stripePromise = loadStripe(key);
    }

    return stripePromise;
};

interface StripeProviderProps {
    children: ReactNode;
    clientSecret?: string;
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
    const [stripe, setStripe] = useState<Stripe | null>(null);

    useEffect(() => {
        getStripe().then(setStripe);
    }, []);

    // If no Stripe key configured, render children without Stripe wrapper
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        return <>{children}</>;
    }

    // If no client secret, render without Elements (for non-payment pages)
    if (!clientSecret) {
        return <>{children}</>;
    }

    // If Stripe is loading, show loading state
    if (!stripe) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-neutral-600 dark:text-neutral-400">
                    Loading payment form...
                </div>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripe}
            options={{
                clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#10b981', // primary-600
                        colorBackground: '#ffffff',
                        colorText: '#0a0a0a',
                        colorDanger: '#ef4444',
                        fontFamily: 'system-ui, sans-serif',
                        borderRadius: '0.5rem',
                    },
                },
            }}
        >
            {children}
        </Elements>
    );
}
