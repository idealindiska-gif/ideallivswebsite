'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth-store';
import { Section, Container } from '@/components/craft';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Package, User, MapPin, LogOut, Loader2, Eye, LayoutDashboard, Download, CreditCard } from 'lucide-react';
import { getCustomerOrdersAction } from '@/app/actions/auth';
import type { Order } from '@/types/woocommerce';
import { format } from 'date-fns';

export default function MyAccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch customer orders
  useEffect(() => {
    async function fetchOrders() {
      console.log('Fetching orders for user:', user);
      console.log('User ID:', user?.id);

      if (!user?.id || user.id === 0) {
        console.log('No valid user ID, skipping order fetch');
        setIsLoadingOrders(false);
        setOrdersError(
          'Your account is not properly linked to our order system. This usually happens when there was an issue creating your customer profile. Please contact our support team to resolve this issue.'
        );
        return;
      }

      try {
        setIsLoadingOrders(true);
        setOrdersError(null);
        console.log('Calling getCustomerOrdersAction with ID:', user.id);
        const result = await getCustomerOrdersAction(user.id, {
          per_page: 20,
          page: 1,
        });

        console.log('Orders result:', result);

        if (result.success && result.data) {
          setOrders(result.data);
          console.log('Loaded', result.data.length, 'orders');
        } else {
          setOrdersError(result.error || 'Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrdersError('An unexpected error occurred');
      } finally {
        setIsLoadingOrders(false);
      }
    }

    if (user) {
      fetchOrders();
    } else {
      setIsLoadingOrders(false);
    }
  }, [user?.id, user]);

  if (!user) return null;

  // Helper function to get order status badge variant
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>;
      case 'on-hold':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">On Hold</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Pending Payment</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Section className="bg-neutral-50 dark:bg-neutral-900/50">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary-950 dark:text-primary-50">
              My Account
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Welcome back, {user.first_name}!
            </p>
          </div>
          <Button variant="outline" onClick={() => logout()} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Downloads</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Overview of your account activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => {
                    const ordersTab = document.querySelector('[value="orders"]') as HTMLElement;
                    ordersTab?.click();
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Orders</h3>
                    </div>
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-sm text-muted-foreground">Total orders placed</p>
                  </div>

                  <div className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => {
                    const downloadsTab = document.querySelector('[value="downloads"]') as HTMLElement;
                    downloadsTab?.click();
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Downloads</h3>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Available downloads</p>
                  </div>

                  <div className="rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => {
                    const addressesTab = document.querySelector('[value="addresses"]') as HTMLElement;
                    addressesTab?.click();
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Addresses</h3>
                    </div>
                    <p className="text-2xl font-bold">{user.billing?.address_1 ? '2' : '0'}</p>
                    <p className="text-sm text-muted-foreground">Saved addresses</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account Information</h3>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{user.first_name} {user.last_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Customer Since:</span>
                      <span className="font-medium">{user.date_created ? format(new Date(user.date_created), 'MMM dd, yyyy') : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
                <CardDescription>Access your downloadable products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                  <Download className="mb-2 h-8 w-8 text-neutral-400" />
                  <p className="text-sm text-neutral-500">No downloadable products yet.</p>
                  <Button variant="link" onClick={() => router.push('/shop')}>
                    Browse Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your recent orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex h-48 flex-col items-center justify-center">
                    <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-neutral-500">Loading your orders...</p>
                  </div>
                ) : ordersError ? (
                  <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-center dark:border-red-800 dark:bg-red-900/10">
                    <Package className="mb-2 h-8 w-8 text-red-400" />
                    <p className="text-sm text-red-600 dark:text-red-400">{ordersError}</p>
                    <Button variant="link" onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                    <Package className="mb-2 h-8 w-8 text-neutral-400" />
                    <p className="text-sm text-neutral-500">No orders found yet.</p>
                    <Button variant="link" onClick={() => router.push('/shop')}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                      >
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold">Order #{order.number || order.id}</h3>
                              <p className="text-sm text-neutral-500">
                                {format(new Date(order.date_created), 'MMM dd, yyyy')} at{' '}
                                {format(new Date(order.date_created), 'hh:mm a')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getOrderStatusBadge(order.status)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.line_items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-sm">
                              {item.image?.src && (
                                <div className="relative h-12 w-12 flex-shrink-0">
                                  <Image
                                    src={item.image.src}
                                    alt={item.name}
                                    fill
                                    sizes="48px"
                                    className="rounded object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-neutral-500">
                                  Quantity: {item.quantity} × {order.currency} {item.price}
                                </p>
                              </div>
                              <p className="font-semibold">
                                {order.currency} {item.total}
                              </p>
                            </div>
                          ))}
                          {order.line_items.length > 3 && (
                            <p className="text-sm text-neutral-500">
                              +{order.line_items.length - 3} more item(s)
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-800">
                          <div className="text-sm">
                            <span className="text-neutral-500">Total: </span>
                            <span className="text-lg font-bold text-primary">
                              {order.currency} {order.total}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/my-account/orders/${order.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue={user.first_name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue={user.last_name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={user.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input defaultValue={user.username} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Addresses</CardTitle>
                <CardDescription>Manage your billing and shipping addresses.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-semibold">Billing Address</h3>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      <p>{user.billing?.first_name} {user.billing?.last_name}</p>
                      <p>{user.billing?.address_1}</p>
                      <p>{user.billing?.city}, {user.billing?.postcode}</p>
                      <p>{user.billing?.country}</p>
                      <p>{user.billing?.phone}</p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-semibold">Shipping Address</h3>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      <p>{user.shipping?.first_name} {user.shipping?.last_name}</p>
                      <p>{user.shipping?.address_1}</p>
                      <p>{user.shipping?.city}, {user.shipping?.postcode}</p>
                      <p>{user.shipping?.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods for faster checkout.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                  <CreditCard className="mb-2 h-8 w-8 text-neutral-400" />
                  <p className="text-sm text-neutral-500">No saved payment methods yet.</p>
                  <p className="text-xs text-neutral-400 mt-1">Payment methods will be saved during checkout.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </Section>
  );
}
