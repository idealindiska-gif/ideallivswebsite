'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { Container, Section } from '@/components/craft';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { ShippingForm, type ShippingFormData } from '@/components/checkout/shipping-form';
import { BillingForm, type BillingFormData } from '@/components/checkout/billing-form';
import { PaymentMethodSelector } from '@/components/checkout/payment-method-selector';
import { ShippingMethodSelector, type ShippingMethod } from '@/components/checkout/shipping-method-selector';
import { OrderSummary } from '@/components/checkout/order-summary';
import { createOrderAction } from '@/app/actions/order';
import { validateCartStockAction } from '@/app/actions/cart';
import { getMinimumOrderAmount } from '@/app/actions/woocommerce-settings';
import { validateShippingRestrictions } from '@/app/actions/shipping-restrictions';
import { formatPrice } from '@/lib/woocommerce';
import { Loader2, CheckCircle2, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { StripeProvider } from '@/components/providers/stripe-provider';
import { StripePaymentForm } from '@/components/checkout/stripe-payment-form';
import { trackInitiateCheckout } from '@/lib/analytics';
import { WhatsAppOrderButton } from '@/components/whatsapp/whatsapp-order-button';
import { useTranslations } from 'next-intl';

// Stripe payment methods that require the payment form
const STRIPE_METHODS = ['stripe', 'stripe_cc', 'stripe_klarna', 'klarna', 'link'];
const isStripeMethod = (method: string) =>
  STRIPE_METHODS.includes(method) || method.startsWith('stripe');

type CheckoutStep = 'information' | 'shipping-payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, setShippingAddress } = useCartStore();
  const { user } = useAuthStore();
  const t = useTranslations('checkoutPage');
  const tPaymentMethod = useTranslations('paymentMethod');

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [billingData, setBillingData] = useState<BillingFormData | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<{ productId: number; message: string }[]>([]);
  const [shippingRestrictions, setShippingRestrictions] = useState<
    Array<{ productId: number; productName: string; reason: string }>
  >([]);
  const [coupon, setCoupon] = useState<any | null>(null);

  // Stripe payment state — when set, the payment form replaces Step 2 content
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeWcOrderId, setStripeWcOrderId] = useState<number | null>(null);
  const [stripeWcOrderKey, setStripeWcOrderKey] = useState<string | null>(null);

  // Track initiate checkout event on mount
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(items, getTotalPrice());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const calculateDiscount = () => {
    if (!coupon) return 0;
    const subtotal = getTotalPrice();
    if (coupon.discount_type === 'percent') return (subtotal * parseFloat(coupon.amount)) / 100;
    if (coupon.discount_type === 'fixed_cart') return parseFloat(coupon.amount);
    return 0;
  };

  const getPaymentMethodTitle = (methodId: string): string => {
    switch (methodId) {
      case 'cod': return tPaymentMethod('cod');
      case 'bacs': return tPaymentMethod('bacs');
      case 'stripe':
      case 'stripe_cc': return tPaymentMethod('cards');
      case 'swish': return tPaymentMethod('swish');
      case 'klarna':
      case 'stripe_klarna': return tPaymentMethod('klarna');
      default: return methodId;
    }
  };

  // ─── Empty cart ──────────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <Section>
        <Container>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-neutral-400" />
            <h1 className="mb-2 font-heading text-3xl font-bold text-primary-950 dark:text-primary-50">
              {t('emptyCartTitle')}
            </h1>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              {t('emptyCartMessage')}
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/shop">{t('shopNow')}</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  // ─── Step 1: Shipping form submit ────────────────────────────────────────────

  const handleShippingSubmit = async (data: ShippingFormData) => {
    setError(null);
    setShippingRestrictions([]);

    // Validate shipping restrictions
    const restrictionResult = await validateShippingRestrictions({
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      postcode: data.postcode,
      city: data.city,
      country: data.country,
    });

    if (!restrictionResult.success) {
      setError(restrictionResult.error || 'Failed to validate shipping restrictions');
      return;
    }

    if (restrictionResult.data && !restrictionResult.data.valid) {
      setShippingRestrictions(restrictionResult.data.restrictedProducts);
      setError(t('itemsRestricted'));
      return;
    }

    setShippingData(data);
    setShippingAddress({ postcode: data.postcode, city: data.city, country: data.country });

    if (sameAsShipping) {
      setBillingData({
        ...data,
        state: data.state || '',
        email: data.email,
        phone: data.phone,
      });
    }
    setCurrentStep('shipping-payment');
  };

  const handleBillingSubmit = (data: BillingFormData) => {
    setBillingData(data);
    setCurrentStep('shipping-payment');
  };

  // ─── Stripe: validate stock, create WC order, then create PaymentIntent ─────
  // Order is created FIRST so the webhook can always update it on payment success,
  // including redirect-based payments (Klarna, Apple Pay, Google Pay) where the
  // user navigates away and handleStripeSuccess never fires.

  const handleInitStripePayment = async () => {
    if (!shippingData || !billingData) { setError(t('pleaseComplete')); return; }
    if (!shippingMethod) { setError(t('selectShipping')); return; }

    setIsProcessing(true);
    setError(null);
    setStockErrors([]);

    try {
      // 1. Validate stock before creating order
      const stockResult = await validateCartStockAction(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      );
      if (!stockResult.success) { setError(stockResult.error || 'Stock validation failed'); setIsProcessing(false); return; }
      const stockValidation = stockResult.data;
      if (!stockValidation?.valid) {
        setStockErrors(stockValidation?.errors || []);
        setError(t('itemsUnavailable'));
        setIsProcessing(false);
        return;
      }

      // 2. Create WC order first (pending, not paid yet)
      const isRealCustomer = user?.id && !(user as any)?._meta?.is_temporary;
      const orderResult = await createOrderAction({
        customer_id: isRealCustomer ? user.id : undefined,
        billing: billingData,
        shipping: shippingData,
        line_items: items.map((item) => ({
          product_id: item.productId,
          variation_id: item.variationId,
          quantity: item.quantity,
          tax_class: item.variation?.tax_class || item.product.tax_class,
        })),
        shipping_lines: [{
          method_id: shippingMethod.method_id,
          method_title: shippingMethod.label,
          total: shippingCost.toString(),
        }],
        payment_method: paymentMethod,
        payment_method_title: getPaymentMethodTitle(paymentMethod),
        customer_note: orderNotes || undefined,
        coupon_lines: coupon ? [{ code: coupon.code }] : undefined,
        set_paid: false,
      });

      if (!orderResult.success || !orderResult.data) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      const wcOrderId = orderResult.data.id;
      const wcOrderKey = orderResult.data.order_key;

      // 3. Create Stripe PaymentIntent with wc_order_id so the webhook can update it.
      // Use the WC order total as the authoritative amount — WC calculates taxes, coupons,
      // and shipping server-side, so this prevents any frontend/backend rounding mismatch.
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(parseFloat(orderResult.data.total) * 100),
          currency: 'sek',
          customerEmail: billingData.email,
          customerName: `${billingData.first_name} ${billingData.last_name}`,
          wcOrderId,
          shippingAddress: {
            name: `${shippingData.first_name} ${shippingData.last_name}`,
            address_1: shippingData.address_1,
            address_2: shippingData.address_2,
            city: shippingData.city,
            state: shippingData.state,
            postcode: shippingData.postcode,
            country: shippingData.country,
          },
          metadata: {
            customer_name: `${billingData.first_name} ${billingData.last_name}`,
            customer_email: billingData.email,
            item_count: items.length.toString(),
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to initialize payment');
      }

      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error('Failed to get payment client secret');

      // 4. Store order ID + key in sessionStorage for redirect-based payments (Klarna, etc.)
      //    so /checkout/stripe-return can redirect to the correct success page
      sessionStorage.setItem('pendingCheckoutData', JSON.stringify({ wcOrderId, wcOrderKey }));

      setStripeWcOrderId(wcOrderId);
      setStripeWcOrderKey(wcOrderKey);
      setStripeClientSecret(clientSecret);
      setIsProcessing(false);

    } catch (err) {
      console.error('Stripe init failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  // ─── Non-Stripe: create order immediately (COD / Swish / BACS) ──────────────

  const handlePlaceOrder = async () => {
    if (!shippingData || !billingData) { setError(t('pleaseComplete')); return; }
    if (!shippingMethod) { setError(t('selectShipping')); return; }

    setIsProcessing(true);
    setError(null);
    setStockErrors([]);

    try {
      // Validate stock
      const stockResult = await validateCartStockAction(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      );
      if (!stockResult.success) { setError(stockResult.error || 'Stock validation failed'); setIsProcessing(false); return; }
      const stockValidation = stockResult.data;
      if (!stockValidation?.valid) {
        setStockErrors(stockValidation?.errors || []);
        setError(t('itemsUnavailable'));
        setIsProcessing(false);
        return;
      }

      const isRealCustomer = user?.id && !(user as any)?._meta?.is_temporary;

      const result = await createOrderAction({
        customer_id: isRealCustomer ? user.id : undefined,
        billing: billingData,
        shipping: shippingData,
        line_items: items.map((item) => ({
          product_id: item.productId,
          variation_id: item.variationId,
          quantity: item.quantity,
          tax_class: item.variation?.tax_class || item.product.tax_class,
        })),
        shipping_lines: [{
          method_id: shippingMethod.method_id,
          method_title: shippingMethod.label,
          total: shippingCost.toString(),
        }],
        payment_method: paymentMethod,
        payment_method_title: getPaymentMethodTitle(paymentMethod),
        customer_note: orderNotes || undefined,
        coupon_lines: coupon ? [{ code: coupon.code }] : undefined,
        set_paid: false,
      });

      if (!result.success || !result.data) throw new Error(result.error);

      clearCart();
      router.push(`/checkout/success?order=${result.data.id}&key=${result.data.order_key}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  };

  // ─── Stripe payment success: order already exists, just redirect ────────────
  // The WC order was created before payment in handleInitStripePayment.
  // The Stripe webhook (payment_intent.succeeded) handles updating the order
  // status to "processing". This callback just clears the cart and redirects.

  const handleStripeSuccess = (paymentIntentId: string) => {
    clearCart();
    sessionStorage.removeItem('pendingCheckoutData');
    if (stripeWcOrderId && stripeWcOrderKey) {
      router.push(`/checkout/success?order=${stripeWcOrderId}&key=${stripeWcOrderKey}&payment_intent=${paymentIntentId}`);
    } else {
      router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
    }
  };

  // ─── Progress steps (2 steps only) ──────────────────────────────────────────

  const steps = [
    { id: 'information', label: t('steps.information'), completed: !!shippingData },
    { id: 'shipping-payment', label: t('steps.shippingPayment'), completed: false },
  ];

  const isStripe = isStripeMethod(paymentMethod);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 font-heading text-4xl font-bold text-primary-950 dark:text-primary-50">
            {t('title')}
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step.completed
                      ? 'bg-primary-600 text-white'
                      : currentStep === step.id
                        ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-600 dark:bg-primary-950 dark:text-primary-400'
                        : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                  >
                    {step.completed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </div>
                  <span
                    className={`hidden text-sm font-medium sm:inline ${currentStep === step.id
                      ? 'text-primary-700 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-2 h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                )}
              </div>
            ))}
          </div>

          {/* Payment Methods Banner */}
          <div className="mt-4 flex justify-center">
            <Image
              src="https://crm.ideallivs.com/wp-content/uploads/2026/01/payment-methods.png"
              alt="Payment Methods - Visa, Mastercard, Klarna, Swish, Apple Pay, Google Pay"
              width={400}
              height={50}
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>

        {/* Global Error Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {stockErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">{t('stockIssues')}:</p>
              <ul className="mt-2 list-disc pl-4">
                {stockErrors.map((err) => (
                  <li key={err.productId}>{err.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {shippingRestrictions.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">{t('shippingRestrictions')}:</p>
              <ul className="mt-2 list-disc pl-4">
                {shippingRestrictions.map((r) => (
                  <li key={r.productId}>
                    <strong>{r.productName}:</strong> {r.reason}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* ══════════════════════════════════════════════════════════════
                  STEP 1: Information
              ══════════════════════════════════════════════════════════════ */}
              {currentStep === 'information' && (
                <motion.div
                  key="information"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShippingForm
                    onSubmit={handleShippingSubmit}
                    defaultValues={shippingData || undefined}
                  />

                  {/* Billing Same as Shipping */}
                  <div className="mt-6 rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-900">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="same-as-shipping"
                        checked={sameAsShipping}
                        onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                      />
                      <Label htmlFor="same-as-shipping" className="cursor-pointer font-medium">
                        {t('billingSameAsShipping')}
                      </Label>
                    </div>
                    {!sameAsShipping && (
                      <div className="mt-4">
                        <BillingForm
                          onSubmit={handleBillingSubmit}
                          defaultValues={billingData || undefined}
                        />
                      </div>
                    )}
                  </div>

                  {/* Order Notes */}
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="order-notes">{t('orderNotes')}</Label>
                    <Textarea
                      id="order-notes"
                      placeholder={t('orderNotesPlaceholder')}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Continue Button */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      size="lg"
                      className="rounded-full"
                      onClick={() => {
                        const form = document.getElementById('shipping-form') as HTMLFormElement;
                        if (form) {
                          form.requestSubmit();
                        } else if (shippingData) {
                          if (sameAsShipping) {
                            setBillingData({
                              ...shippingData,
                              state: shippingData.state || '',
                              email: billingData?.email || '',
                              phone: shippingData.phone || '',
                            });
                          }
                          setCurrentStep('shipping-payment');
                        }
                      }}
                    >
                      {t('continueToShipping')}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  STEP 2: Shipping & Payment
                  — Shows payment form inline when Stripe is initialised
              ══════════════════════════════════════════════════════════════ */}
              {currentStep === 'shipping-payment' && shippingData && (
                <motion.div
                  key="shipping-payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* ── PAYMENT MODE: Stripe form replaces step content ── */}
                  {stripeClientSecret ? (
                    <>
                      {/* Header with back link */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setStripeClientSecret(null);
                            setStripeWcOrderId(null);
                            setStripeWcOrderKey(null);
                            sessionStorage.removeItem('pendingCheckoutData');
                            setError(null);
                          }}
                          className="flex items-center gap-1 text-sm text-primary-600 hover:underline dark:text-primary-400"
                        >
                          ← {t('back')}
                        </button>
                        <h2 className="font-heading text-2xl font-bold text-primary-950 dark:text-primary-50">
                          {t('completePayment')}
                        </h2>
                      </div>

                      {/* Info banner */}
                      <Alert className="border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          {t('orderReserved')}
                        </AlertDescription>
                      </Alert>

                      {/* Stripe payment form — handles cards, wallets (Apple Pay,
                          Google Pay), Klarna, and Link via PaymentElement */}
                      <StripeProvider clientSecret={stripeClientSecret}>
                        <StripePaymentForm
                          amount={getTotalPrice() + shippingCost - calculateDiscount()}
                          currency="SEK"
                          onSuccess={handleStripeSuccess}
                          onError={(error) => {
                            console.error('Payment failed:', error);
                            setError(t('paymentError', { error }));
                          }}
                        />
                      </StripeProvider>
                    </>
                  ) : (
                    <>
                      {/* ── SELECTION MODE: Choose shipping + payment ── */}

                      {/* Shipping Method */}
                      <div>
                        <ShippingMethodSelector
                          postcode={shippingData.postcode}
                          cartTotal={getTotalPrice()}
                          selectedMethod={shippingMethod?.id}
                          onMethodChange={setShippingMethod}
                          onShippingCostChange={setShippingCost}
                        />
                      </div>

                      <Separator />

                      {/* Payment Method */}
                      <div>
                        <PaymentMethodSelector
                          selectedMethod={paymentMethod}
                          onMethodChange={(method) => {
                            setPaymentMethod(method);
                            // Reset Stripe state if switching away
                            setStripeClientSecret(null);
                            setStripeWcOrderId(null);
                            setStripeWcOrderKey(null);
                          }}
                        />
                      </div>

                      {/* Navigation Buttons */}
                      <div className="mt-6 flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep('information')}
                          disabled={isProcessing}
                        >
                          {t('back')}
                        </Button>

                        {/* Stripe: "Pay Now" → initialise payment form */}
                        {isStripe ? (
                          <Button
                            size="lg"
                            className="rounded-full bg-green-600 hover:bg-green-700"
                            onClick={handleInitStripePayment}
                            disabled={isProcessing || !shippingMethod}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('processing')}
                              </>
                            ) : (
                              <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                {t('proceedToPayment')}
                              </>
                            )}
                          </Button>
                        ) : (
                          /* Non-Stripe: "Place Order" → create order immediately */
                          <Button
                            size="lg"
                            className="rounded-full"
                            onClick={handlePlaceOrder}
                            disabled={isProcessing || !shippingMethod}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('processing')}
                              </>
                            ) : (
                              t('placeOrder')
                            )}
                          </Button>
                        )}
                      </div>

                      {/* No shipping method warning */}
                      {!shippingMethod && (
                        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                          {t('selectShippingContinue')}
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* WhatsApp Order Button */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <WhatsAppOrderButton
                  context="cart"
                  cartItems={items}
                  cartTotal={getTotalPrice().toString()}
                  cartSubtotal={getTotalPrice().toString()}
                  requireCustomerInfo={true}
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                  label={undefined}
                  onSuccess={() => {
                    clearCart();
                    router.push('/');
                  }}
                />
              </div>

              {/* Stock Disclaimer */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-200">
                <p>
                  <strong>{t('note')}:</strong> {t('inventoryDisclaimer')}
                </p>
              </div>

              <OrderSummary
                shippingCost={shippingCost}
                discountAmount={calculateDiscount()}
                onApplyCoupon={setCoupon}
                appliedCoupon={coupon?.code}
              />

              {/* Swish QR Code */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-4 text-center font-heading text-lg font-semibold text-primary-950 dark:text-primary-50">
                  {t('scanSwish')}
                </h3>
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://crm.ideallivs.com/wp-content/uploads/2025/05/swish.jpg"
                    alt="Swish QR Code"
                    className="max-w-full rounded-lg"
                    style={{ maxWidth: '250px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
