'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Ban,
    RefreshCw,
    LogOut,
    Lock,
    Plus,
    Trash2,
    AlertCircle,
    Search,
    UserX,
    Mail,
    Hash,
    Calendar,
    ShieldOff,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface BlockedCustomer {
    id: string;
    email?: string;
    customerId?: number;
    reason: string;
    blockedAt: string;
    blockedBy?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ── Login Gate ────────────────────────────────────────────────────────────────

function LoginGate({ onLogin }: { onLogin: (secret: string) => void }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(
                `/api/admin/blocked-customers?secret=${encodeURIComponent(value.trim())}`
            );
            if (res.ok) {
                sessionStorage.setItem('admin_secret', value.trim());
                onLogin(value.trim());
            } else {
                setError('Invalid secret. Check your ADMIN_SECRET env variable.');
            }
        } catch {
            setError('Could not connect. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">Blocked Customers</h1>
                    <p className="text-sm text-muted-foreground">Enter your admin secret to continue</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        id="admin-secret-input"
                        type="password"
                        placeholder="Admin secret..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                    />
                    {error && (
                        <p className="text-sm text-destructive flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5" /> {error}
                        </p>
                    )}
                    <Button id="admin-login-btn" type="submit" className="w-full rounded-full" disabled={loading}>
                        {loading ? 'Checking...' : 'Enter'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}

// ── Add Block Form ────────────────────────────────────────────────────────────

function AddBlockForm({
    secret,
    onAdded,
}: {
    secret: string;
    onAdded: () => void;
}) {
    const [email, setEmail] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) { setError('A reason is required'); return; }
        if (!email.trim() && !customerId.trim()) {
            setError('Please enter an email or customer ID');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch(
                `/api/admin/blocked-customers?secret=${encodeURIComponent(secret)}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.trim() || undefined,
                        customerId: customerId.trim() ? parseInt(customerId.trim(), 10) : undefined,
                        reason: reason.trim(),
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Failed to block customer'); return; }
            setEmail('');
            setCustomerId('');
            setReason('');
            setOpen(false);
            onAdded();
        } catch {
            setError('Failed to block customer');
        } finally {
            setLoading(false);
        }
    };

    if (!open) {
        return (
            <Button
                id="add-block-btn"
                onClick={() => setOpen(true)}
                className="gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
            >
                <Plus className="h-4 w-4" />
                Block Customer
            </Button>
        );
    }

    return (
        <Card className="p-6 border-red-200 dark:border-red-900/40">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                Block a Customer
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="block-email">Email address</Label>
                        <Input
                            id="block-email"
                            type="email"
                            placeholder="customer@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="block-customer-id">WooCommerce Customer ID</Label>
                        <Input
                            id="block-customer-id"
                            type="number"
                            placeholder="e.g. 1234"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="block-reason">Reason <span className="text-destructive">*</span></Label>
                    <Textarea
                        id="block-reason"
                        placeholder="e.g. Repeated chargebacks, fraudulent orders..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={2}
                    />
                </div>
                {error && (
                    <p className="text-sm text-destructive flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" /> {error}
                    </p>
                )}
                <div className="flex gap-2 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => { setOpen(false); setError(''); }}
                    >
                        Cancel
                    </Button>
                    <Button
                        id="confirm-block-btn"
                        type="submit"
                        disabled={loading}
                        className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading ? 'Blocking...' : (
                            <><Ban className="h-4 w-4" /> Confirm Block</>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function BlockedCustomersAdmin() {
    const [secret, setSecret] = useState<string | null>(null);
    const [customers, setCustomers] = useState<BlockedCustomer[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Restore session
    useEffect(() => {
        const stored = sessionStorage.getItem('admin_secret');
        if (stored) setSecret(stored);
    }, []);

    const fetchCustomers = useCallback(async (s: string) => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/admin/blocked-customers?secret=${encodeURIComponent(s)}`
            );
            if (res.ok) {
                const data = await res.json();
                setCustomers(data.customers || []);
            } else if (res.status === 401) {
                sessionStorage.removeItem('admin_secret');
                setSecret(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (secret) fetchCustomers(secret);
    }, [secret, fetchCustomers]);

    const handleLogout = () => {
        sessionStorage.removeItem('admin_secret');
        setSecret(null);
        setCustomers([]);
    };

    const handleUnblock = async (id: string) => {
        if (!secret) return;
        if (!confirm('Are you sure you want to unblock this customer?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(
                `/api/admin/blocked-customers?secret=${encodeURIComponent(secret)}&id=${id}`,
                { method: 'DELETE' }
            );
            if (res.ok) {
                setCustomers((prev) => prev.filter((c) => c.id !== id));
            }
        } finally {
            setDeletingId(null);
        }
    };

    if (!secret) return <LoginGate onLogin={setSecret} />;

    const filtered = customers.filter((c) => {
        const q = search.toLowerCase();
        return (
            !q ||
            c.email?.toLowerCase().includes(q) ||
            c.customerId?.toString().includes(q) ||
            c.reason.toLowerCase().includes(q) ||
            c.blockedBy?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-background">
            {/* ── Header ── */}
            <div className="border-b border-border bg-card">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                            <ShieldOff className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h1 className="font-bold text-foreground text-lg leading-none">Blocked Customers</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {customers.length} customer{customers.length !== 1 ? 's' : ''} blocked
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => secret && fetchCustomers(secret)}
                            disabled={loading}
                            className="gap-1.5"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="gap-1.5 text-muted-foreground"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                {/* ── Info Banner ── */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
                    <p className="text-sm text-red-800 dark:text-red-200">
                        <strong>How it works:</strong> Blocked customers are prevented from placing orders at checkout.
                        When a blocked email is entered on the checkout page, the customer will see a message asking them to contact support.
                        Blocking is by email address and/or WooCommerce customer ID.
                    </p>
                </div>

                {/* ── Add Form ── */}
                <AddBlockForm secret={secret} onAdded={() => fetchCustomers(secret)} />

                {/* ── Search + Table ── */}
                <Card className="overflow-hidden">
                    <div className="px-4 pt-4 pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-blocked"
                                placeholder="Search by email, ID or reason..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        {loading && customers.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">Loading...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-12 text-center">
                                <UserX className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground text-sm">
                                    {customers.length === 0 ? 'No customers blocked yet' : 'No results found'}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Reason</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Blocked</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                {customer.email && (
                                                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                                                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                        <span className="truncate max-w-[200px]">{customer.email}</span>
                                                    </div>
                                                )}
                                                {customer.customerId && (
                                                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5">
                                                        <Hash className="h-3 w-3 shrink-0" />
                                                        WC ID: {customer.customerId}
                                                    </div>
                                                )}
                                                {/* Show reason on mobile */}
                                                <div className="mt-1 text-xs text-muted-foreground sm:hidden line-clamp-2">
                                                    {customer.reason}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <p className="text-foreground line-clamp-2 max-w-[280px]">
                                                    {customer.reason}
                                                </p>
                                                {customer.blockedBy && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        by {customer.blockedBy}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(customer.blockedAt)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    id={`unblock-btn-${customer.id}`}
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleUnblock(customer.id)}
                                                    disabled={deletingId === customer.id}
                                                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    {deletingId === customer.id ? 'Removing...' : 'Unblock'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
