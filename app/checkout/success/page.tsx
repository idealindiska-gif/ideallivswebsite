'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Mail, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GoogleCustomerReviews, getEstimatedDeliveryDate, extractProductGTINs } from '@/components/reviews/google-customer-reviews';

interface OrderDetails {
    id: number;
    order_key: string;
    status: string;
    total: string;
    currency: string;
    date_created: string;
    billing: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address_1: string;
        city: string;
        postcode: string;
        country: string;
    };
    shipping: {
        first_name: string;
        last_name: string;
        address_1: string;
        city: string;
        postcode: string;
        country: string;
    };
    line_items: Array<{
        id: number;
        name: string;
        quantity: number;
        total: string;
        product_id: number;
        variation_id?: number;
        meta_data?: Array<{ key: string; value: any }>;
    }>;
    shipping_lines: Array<{
        method_title: string;
        total: string;
    }>;
}

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = searchParams.get('order');
    const paymentIntentId = searchParams.get('payment_intent');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError('No order ID provided');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/orders/${orderId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }

                const orderData = await response.json();
                setOrder(orderData);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Unable to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full p-8 text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                    <h1 className="text-xl font-semibold mb-2">Loading Order Details...</h1>
                </Card>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4 text-green-700">Thank You for Your Order!</h1>
                    <p className="text-muted-foreground mb-6">
                        Your order has been received and is being processed. You will receive a confirmation email shortly.
                    </p>
                    {orderId && (
                        <p className="text-lg font-semibold mb-6">Order #{orderId}</p>
                    )}
                    <div className="space-y-2">
                        <Link href="/my-account/orders">
                            <Button className="w-full">View My Orders</Button>
                        </Link>
                        <Link href="/shop">
                            <Button variant="outline" className="w-full">Continue Shopping</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    // Calculate estimated delivery date (3 days for local, 5 days for national)
    const isLocalDelivery = order.shipping.country === 'SE' &&
        ['Stockholm', 'Bandhagen', 'Högdalen'].some(city =>
            order.shipping.city.toLowerCase().includes(city.toLowerCase())
        );
    const deliveryDays = isLocalDelivery ? 3 : 5;
    const estimatedDelivery = getEstimatedDeliveryDate(deliveryDays);

    // Extract product GTINs for Google Customer Reviews
    const productGTINs = extractProductGTINs(order.line_items);

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <Card className="p-8 mb-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-2 text-green-700">Order Confirmed!</h1>
                    <p className="text-lg text-muted-foreground mb-4">
                        Thank you, {order.billing.first_name}! Your order has been successfully placed.
                    </p>
                    <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200">
                        <p className="text-sm text-muted-foreground">Order Number</p>
                        <p className="text-2xl font-bold text-primary">#{order.id}</p>
                    </div>
                </Card>

                {/* Order Status Timeline */}
                <Card className="p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <Mail className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Confirmation Email Sent</h3>
                                <p className="text-sm text-muted-foreground">
                                    We've sent a confirmation to {order.billing.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Order Processing</h3>
                                <p className="text-sm text-muted-foreground">
                                    We're preparing your items for shipment
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Truck className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">Estimated Delivery</h3>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(estimatedDelivery).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Order Details */}
                <Card className="p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Order Details</h2>

                    {/* Items */}
                    <div className="space-y-3 mb-6">
                        {order.line_items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b">
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">{item.total} {order.currency}</p>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 pt-4 border-t">
                        {order.shipping_lines.map((shipping, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{shipping.method_title}</span>
                                <span>{shipping.total} {order.currency}</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span>{order.total} {order.currency}</span>
                        </div>
                    </div>
                </Card>

                {/* Shipping Address */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="p-6">
                        <h3 className="font-semibold mb-3">Shipping Address</h3>
                        <div className="text-sm space-y-1 text-muted-foreground">
                            <p>{order.shipping.first_name} {order.shipping.last_name}</p>
                            <p>{order.shipping.address_1}</p>
                            <p>{order.shipping.postcode} {order.shipping.city}</p>
                            <p>{order.shipping.country}</p>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold mb-3">Billing Address</h3>
                        <div className="text-sm space-y-1 text-muted-foreground">
                            <p>{order.billing.first_name} {order.billing.last_name}</p>
                            <p>{order.billing.email}</p>
                            <p>{order.billing.phone}</p>
                            <p>{order.billing.address_1}</p>
                            <p>{order.billing.postcode} {order.billing.city}</p>
                        </div>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/my-account/orders">
                        <Button className="w-full" size="lg">
                            <Package className="mr-2 h-5 w-5" />
                            Track Your Order
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="outline" className="w-full" size="lg">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                {/* Google Customer Reviews Opt-in */}
                <GoogleCustomerReviews
                    orderId={order.id.toString()}
                    email={order.billing.email}
                    deliveryCountry={order.shipping.country}
                    estimatedDeliveryDate={estimatedDelivery}
                    products={productGTINs}
                />
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full p-8 text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                    <h1 className="text-xl font-semibold mb-2">Loading...</h1>
                </Card>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
