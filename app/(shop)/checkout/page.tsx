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
import { Loader2, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { StripeProvider } from '@/components/providers/stripe-provider';
import { StripePaymentForm } from '@/components/checkout/stripe-payment-form';
import { trackInitiateCheckout } from '@/lib/analytics';
import { WhatsAppOrderButton } from '@/components/whatsapp/whatsapp-order-button';

type CheckoutStep = 'information' | 'shipping-payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, setShippingAddress } = useCartStore();
  const { user } = useAuthStore(); // Get logged-in user for customer linking

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
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(0);
  const [loadingMinimum, setLoadingMinimum] = useState(true);
  const [coupon, setCoupon] = useState<any | null>(null);

  // Stripe state
  const [stripeWcOrderId, setStripeWcOrderId] = useState<number | null>(null);
  const [stripeWcOrderKey, setStripeWcOrderKey] = useState<string | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [isStripePayment, setIsStripePayment] = useState(false);

  // Track initiate checkout event on mount
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(items, getTotalPrice());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch minimum order amount on mount - DISABLED (no minimum requirement)
  useEffect(() => {
    // Minimum order amount disabled - users can checkout with any amount
    setLoadingMinimum(false);
    setMinimumOrderAmount(0);

    /* Original code - disabled to remove minimum order requirement
    const fetchMinimumOrderAmount = async () => {
      setLoadingMinimum(true);
      try {
        const result = await getMinimumOrderAmount();
        if (result.success && result.data) {
          setMinimumOrderAmount(result.data.minimumAmount);
        }
      } catch (err) {
        console.error('Failed to fetch minimum order amount:', err);
      } finally {
        setLoadingMinimum(false);
      }
    };

    fetchMinimumOrderAmount();
    */
  }, []);

  // Check if cart meets minimum order amount
  const cartTotal = getTotalPrice();
  const meetsMinimum = minimumOrderAmount === 0 || cartTotal >= minimumOrderAmount;

  if (items.length === 0) {
    return (
      <Section>
        <Container>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-neutral-400" />
            <h1 className="mb-2 font-heading text-3xl font-bold text-primary-950 dark:text-primary-50">
              Your cart is empty
            </h1>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              Add items to your cart before proceeding to checkout
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const handleShippingSubmit = async (data: ShippingFormData) => {
    setError(null);
    setShippingRestrictions([]);

    // Validate shipping restrictions
    const restrictionResult = await validateShippingRestrictions({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
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
      setError(
        'Some items in your cart cannot be shipped to this location. Please review the restrictions below.'
      );
      return;
    }

    setShippingData(data);

    // Set shipping address in cart store to trigger shipping calculation
    setShippingAddress({
      postcode: data.postcode,
      city: data.city,
      country: data.country,
    });

    if (sameAsShipping) {
      setBillingData({
        ...data,
        state: data.state || '', // Ensure state is always a string (billing requires it)
        email: data.email, // Use email from shipping form
        phone: data.phone,
      });
    }
    setCurrentStep('shipping-payment');
  };

  const handleBillingSubmit = (data: BillingFormData) => {
    setBillingData(data);
    setCurrentStep('shipping-payment');
  };

  // Handler for successful Stripe payment - order is already created, just redirect
  // The Stripe webhook will handle updating the order status to 'processing'
  const handleStripeSuccess = (paymentIntentId: string) => {
    clearCart();
    sessionStorage.removeItem('pendingCheckoutData');
    if (stripeWcOrderId && stripeWcOrderKey) {
      router.push(`/checkout/success?order=${stripeWcOrderId}&key=${stripeWcOrderKey}&payment_intent=${paymentIntentId}`);
    } else {
      router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingData || !billingData) {
      setError('Please complete all required information');
      return;
    }

    if (!shippingMethod) {
      setError('Please select a shipping method');
      return;
    }

    // Check if this is a Stripe payment method
    // Include Klarna, Link, and other redirect-based methods that go through Stripe
    const stripePaymentMethods = [
      'stripe',
      'stripe_cc',
      'stripe_klarna', // Klarna through Stripe
      'klarna',        // Standalone Klarna but still uses Stripe in headless mode
      'link',          // Link by Stripe
    ];
    const isStripe = stripePaymentMethods.includes(paymentMethod) || paymentMethod.startsWith('stripe');
    setIsStripePayment(isStripe);

    setIsProcessing(true);
    setError(null);
    setStockErrors([]);

    try {
      // Validate stock before proceeding
      const stockValidationResult = await validateCartStockAction(
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      if (!stockValidationResult.success) {
        setError(stockValidationResult.error || 'Failed to validate stock');
        setIsProcessing(false);
        return;
      }

      const stockValidation = stockValidationResult.data;

      if (!stockValidation || !stockValidation.valid) {
        setStockErrors(stockValidation?.errors || []);
        setError('Some items in your cart are no longer available');
        setIsProcessing(false);
        return;
      }

      // For Stripe payments, create WooCommerce order FIRST (with pending status)
      // Then create PaymentIntent with order ID in metadata
      // This ensures orders are never lost - webhook updates order on payment success/failure
      if (isStripe) {
        try {
          const totalAmount = getTotalPrice() + shippingCost - calculateDiscount();

          if (process.env.NODE_ENV === 'development') {
            console.log('📦 Creating WooCommerce order with pending status...');
          }

          // Only pass customer_id if it's a real WooCommerce customer
          const isRealCustomer = user?.id && !(user as any)?._meta?.is_temporary;

          // STEP 1: Create WooCommerce order first with pending status
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
            shipping_lines: [
              {
                method_id: shippingMethod.method_id,
                method_title: shippingMethod.label,
                total: shippingCost.toString(),
              },
            ],
            payment_method: paymentMethod,
            payment_method_title: getPaymentMethodTitle(paymentMethod),
            customer_note: orderNotes || undefined,
            coupon_lines: coupon ? [{ code: coupon.code }] : undefined,
            set_paid: false, // Order starts as pending payment
          });

          if (!orderResult.success || !orderResult.data) {
            throw new Error(orderResult.error || 'Failed to create order');
          }

          const wcOrderId = orderResult.data.id;
          const wcOrderKey = orderResult.data.order_key;

          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ WooCommerce order #${wcOrderId} created with pending status`);
            console.log('💳 Creating Stripe PaymentIntent...');
          }

          // STEP 2: Create PaymentIntent with WooCommerce order ID in metadata
          const response = await fetch('/api/stripe/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: Math.round(totalAmount * 100), // Convert to öre (cents)
              currency: 'sek',
              customerEmail: billingData.email,
              customerName: `${billingData.first_name} ${billingData.last_name}`,
              wcOrderId: wcOrderId, // CRITICAL: Links payment to order for webhook
              billingAddress: {
                line1: billingData.address_1,
                line2: billingData.address_2,
                city: billingData.city,
                state: billingData.state,
                postal_code: billingData.postcode,
                country: billingData.country,
              },
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to initialize payment');
          }

          const { clientSecret, paymentIntentId } = await response.json();

          if (!clientSecret) {
            throw new Error('Failed to get payment client secret');
          }

          // Store minimal data for redirect-based payments (Klarna, etc.)
          // Only wcOrderId + wcOrderKey needed — order is already in WooCommerce
          sessionStorage.setItem('pendingCheckoutData', JSON.stringify({ wcOrderId, wcOrderKey }));

          setStripeWcOrderId(wcOrderId);
          setStripeWcOrderKey(wcOrderKey);
          setStripeClientSecret(clientSecret);
          setIsProcessing(false);

          // The Stripe payment form will now be shown
          // Webhook handles order status update after payment
          return;

        } catch (stripeError) {
          console.error('Order/Stripe initialization failed:', stripeError);
          setError(
            stripeError instanceof Error
              ? stripeError.message
              : 'Failed to initialize payment. Please try again.'
          );
          setIsProcessing(false);
          return;
        }
      }

      // Build customer note
      let customerNote = orderNotes || '';

      // Only pass customer_id if it's a real WooCommerce customer (not a temporary profile)
      const isRealCustomer = user?.id && !(user as any)?._meta?.is_temporary;

      // For non-Stripe payments (COD, etc.), create order immediately
      const result = await createOrderAction({
        customer_id: isRealCustomer ? user.id : undefined, // Only link if real WC customer
        billing: billingData,
        shipping: shippingData,
        line_items: items.map((item) => ({
          product_id: item.productId,
          variation_id: item.variationId,
          quantity: item.quantity,
          tax_class: item.variation?.tax_class || item.product.tax_class, // Include tax class for Swedish rates (25% standard, 12% reduced)
        })),
        shipping_lines: [
          {
            method_id: shippingMethod.method_id,
            method_title: shippingMethod.label,
            total: shippingCost.toString(),
          },
        ],
        payment_method: paymentMethod,
        payment_method_title: getPaymentMethodTitle(paymentMethod),
        customer_note: customerNote || undefined,
        coupon_lines: coupon ? [{ code: coupon.code }] : undefined,
        set_paid: false,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error);
      }

      // For non-Stripe payments, redirect to success immediately
      clearCart();
      router.push(`/checkout/success?order=${result.data.id}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  };

  const calculateDiscount = () => {
    if (!coupon) return 0;
    const subtotal = getTotalPrice();
    // Handle percent discount
    if (coupon.discount_type === 'percent') {
      return (subtotal * parseFloat(coupon.amount)) / 100;
    }
    // Handle fixed cart discount
    if (coupon.discount_type === 'fixed_cart') {
      return parseFloat(coupon.amount);
    }
    return 0;
  };

  const getPaymentMethodTitle = (methodId: string): string => {
    const titles: Record<string, string> = {
      cod: 'Cash on Delivery',
      bacs: 'Direct Bank Transfer',
      stripe: 'Credit Card',
      swish: 'Swish',
    };
    return titles[methodId] || methodId;
  };

  const steps = [
    { id: 'information', label: 'Information', completed: !!shippingData },
    { id: 'shipping-payment', label: 'Shipping & Payment', completed: !!shippingMethod && currentStep === 'review' },
    { id: 'review', label: 'Review & Pay', completed: false },
  ];

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="mb-4 font-heading text-4xl font-bold text-primary-950 dark:text-primary-50">
            Checkout
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

        {/* Error Display */}
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
              <p className="font-semibold">Stock issues:</p>
              <ul className="mt-2 list-disc pl-4">
                {stockErrors.map((err) => (
                  <li key={err.productId}>{err.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}


        {/* Minimum order notification removed - no minimum order requirement */}

        {/* Shipping Restrictions */}
        {shippingRestrictions.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">Shipping Restrictions:</p>
              <ul className="mt-2 list-disc pl-4">
                {shippingRestrictions.map((restriction) => (
                  <li key={restriction.productId}>
                    <strong>{restriction.productName}:</strong> {restriction.reason}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Information (Shipping + Billing + Order Notes) */}
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

                  {/* Billing Same as Shipping Checkbox */}
                  <div className="mt-6 p-4 rounded-lg border bg-neutral-50 dark:bg-neutral-900">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="same-as-shipping"
                        checked={sameAsShipping}
                        onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                      />
                      <Label htmlFor="same-as-shipping" className="cursor-pointer font-medium">
                        Billing address same as shipping
                      </Label>
                    </div>

                    {/* Conditional Billing Form */}
                    {!sameAsShipping && (
                      <div className="mt-4">
                        <BillingForm
                          onSubmit={handleBillingSubmit}
                          defaultValues={billingData || undefined}
                        />
                      </div>
                    )}
                  </div>

                  {/* Order Notes (moved from payment step) */}
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="order-notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="order-notes"
                      placeholder="Special instructions for your order..."
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
                          // Auto-set billing if same as shipping
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
                      Continue to Shipping & Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Shipping & Payment (Combined Method Selections) */}
              {currentStep === 'shipping-payment' && shippingData && (
                <motion.div
                  key="shipping-payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Shipping Method Selection */}
                  <div>
                    <ShippingMethodSelector
                      postcode={shippingData.postcode}
                      cartTotal={getTotalPrice()}
                      selectedMethod={shippingMethod?.id}
                      onMethodChange={setShippingMethod}
                      onShippingCostChange={setShippingCost}
                    />
                  </div>

                  {/* Visual Separator */}
                  <Separator />

                  {/* Payment Method Selection */}
                  <div>
                    <PaymentMethodSelector
                      selectedMethod={paymentMethod}
                      onMethodChange={setPaymentMethod}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('information')}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="rounded-full"
                      onClick={() => {
                        if (!shippingMethod) {
                          setError('Please select a shipping method before continuing');
                          return;
                        }
                        setCurrentStep('review');
                      }}
                      disabled={!shippingMethod}
                    >
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Pay (Enhanced Layout) */}
              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="font-heading text-2xl font-bold text-primary-950 dark:text-primary-50">
                    Review Your Order
                  </h2>

                  {/* 2-Column Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping Address */}
                    {shippingData && (
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-semibold">Shipping Address</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {shippingData.first_name} {shippingData.last_name}
                          <br />
                          {shippingData.address_1}
                          {shippingData.address_2 && (
                            <>
                              <br />
                              {shippingData.address_2}
                            </>
                          )}
                          <br />
                          {shippingData.city}, {shippingData.state} {shippingData.postcode}
                          <br />
                          {shippingData.country}
                        </p>
                      </div>
                    )}

                    {/* Billing Address (only if different) */}
                    {billingData && !sameAsShipping && (
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-semibold">Billing Address</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {billingData.first_name} {billingData.last_name}
                          <br />
                          {billingData.address_1}
                          {billingData.address_2 && (
                            <>
                              <br />
                              {billingData.address_2}
                            </>
                          )}
                          <br />
                          {billingData.city}, {billingData.state} {billingData.postcode}
                          <br />
                          {billingData.country}
                        </p>
                      </div>
                    )}

                    {/* Shipping Method Display */}
                    {shippingMethod && (
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-semibold">Shipping Method</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {shippingMethod.label}
                          {shippingCost > 0 && ` - ${formatPrice(shippingCost, 'SEK')}`}
                          {shippingCost === 0 && ' - Free'}
                        </p>
                      </div>
                    )}

                    {/* Payment Method */}
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-semibold">Payment Method</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {getPaymentMethodTitle(paymentMethod)}
                      </p>
                    </div>
                  </div>


                  {/* Order Notes Display */}
                  {orderNotes && (
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-semibold">Order Notes</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {orderNotes}
                      </p>
                    </div>
                  )}

                  {/* Shipping Method Missing Alert */}
                  {!shippingMethod && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>No shipping method selected.</strong> Please go back to the previous step and select a shipping method before placing your order.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('shipping-payment')}
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="rounded-full"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || !shippingMethod}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </Button>
                  </div>

                  {/* Stripe Payment Form (shown after PaymentIntent creation) */}
                  {stripeClientSecret && isStripePayment && (
                    <div className="mt-8">
                      <Separator className="my-6" />
                      <h3 className="mb-4 font-heading text-xl font-bold text-primary-950 dark:text-primary-50">
                        Complete Payment
                      </h3>
                      <StripeProvider clientSecret={stripeClientSecret}>
                        {/* Payment Form (Card, Klarna, Link, Apple Pay, Google Pay via PaymentElement) */}
                        <StripePaymentForm
                          amount={getTotalPrice() + shippingCost - calculateDiscount()}
                          currency="SEK"
                          onSuccess={handleStripeSuccess}
                          onError={(error) => {
                            console.error('Payment failed:', error);
                            setError(`Payment failed: ${error}`);
                          }}
                        />
                      </StripeProvider>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
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
                  label="Order via WhatsApp"
                  onSuccess={() => {
                    clearCart();
                    router.push('/');
                  }}
                />
              </div>

              {/* Stock Disclaimer */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-200">
                <p>
                  <strong>Note:</strong> Inventory is shared with our physical store. In the rare event of a stock discrepancy, we will contact you immediately.
                </p>
              </div>

              <OrderSummary
                shippingCost={shippingCost}
                discountAmount={calculateDiscount()}
                onApplyCoupon={setCoupon}
                appliedCoupon={coupon?.code}
              />

              {/* Swish Payment QR Code */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-4 text-center font-heading text-lg font-semibold text-primary-950 dark:text-primary-50">
                  Scan and pay by Swish
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
