'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  TrendingUp,
  Mail,
  RefreshCw,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Lock,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface PeriodStats {
  total: number;
  recovered: number;
  rate: number;
  totalValue: number;
  recoveredValue: number;
  lostValue: number;
}

interface Cart {
  id: number;
  email: string;
  name: string;
  phone: string;
  value: number;
  itemCount: number;
  items: string;
  status: 'fresh' | 'awaiting_email' | 'emailed' | 'recovered';
  abandonedAt: string;
  emailSentAt: string | null;
  recoveredAt: string | null;
  token: string;
}

interface StatsData {
  today: PeriodStats;
  week: PeriodStats;
  month: PeriodStats;
  all30: PeriodStats;
  carts: Cart[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatSEK(amount: number) {
  return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(amount);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_CONFIG: Record<Cart['status'], { label: string; color: string; icon: React.ReactNode }> = {
  fresh: {
    label: 'Fresh',
    color: 'bg-muted text-muted-foreground',
    icon: <Clock className="h-3 w-3" />,
  },
  awaiting_email: {
    label: 'Awaiting email',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: <Inbox className="h-3 w-3" />,
  },
  emailed: {
    label: 'Email sent',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: <Mail className="h-3 w-3" />,
  },
  recovered: {
    label: 'Recovered',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  label,
  total,
  recovered,
  rate,
  totalValue,
  lostValue,
}: PeriodStats & { label: string }) {
  return (
    <Card className="p-5 space-y-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground mt-0.5">abandoned carts</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{recovered}</p>
          <p className="text-xs text-muted-foreground">recovered</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {/* Recovery rate bar */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Recovery rate</span>
          <span className="font-semibold text-foreground">{rate}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${rate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs pt-0.5">
          <span className="text-muted-foreground">Lost: <span className="text-destructive font-medium">{formatSEK(lostValue)}</span></span>
          <span className="text-muted-foreground">Value: <span className="text-foreground font-medium">{formatSEK(totalValue)}</span></span>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: Cart['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Login gate ────────────────────────────────────────────────────────────────
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
      const res = await fetch(`/api/admin/abandoned-cart-stats?secret=${encodeURIComponent(value.trim())}`);
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Enter your admin secret to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
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
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? 'Checking...' : 'Enter'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AbandonedCartsAdmin() {
  const [secret, setSecret] = useState<string | null>(null);
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'all' | Cart['status']>('all');

  // Restore session
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_secret');
    if (stored) setSecret(stored);
  }, []);

  const fetchStats = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/abandoned-cart-stats?secret=${encodeURIComponent(s)}`);
      if (res.ok) {
        setData(await res.json());
        setLastUpdated(new Date());
      } else if (res.status === 401) {
        sessionStorage.removeItem('admin_secret');
        setSecret(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (secret) fetchStats(secret);
  }, [secret, fetchStats]);

  const handleLogin = (s: string) => setSecret(s);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_secret');
    setSecret(null);
    setData(null);
  };

  if (!secret) return <LoginGate onLogin={handleLogin} />;

  const siteUrl = 'https://www.ideallivs.com';
  const filteredCarts = data?.carts.filter(
    (c) => filter === 'all' || c.status === filter
  ) ?? [];

  const statusCounts = data?.carts.reduce(
    (acc, c) => ({ ...acc, [c.status]: (acc[c.status as keyof typeof acc] ?? 0) + 1 }),
    { fresh: 0, awaiting_email: 0, emailed: 0, recovered: 0 }
  ) ?? { fresh: 0, awaiting_email: 0, emailed: 0, recovered: 0 };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-none">Abandoned Carts</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lastUpdated ? `Updated ${timeAgo(lastUpdated.toISOString())}` : 'Loading...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => secret && fetchStats(secret)}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Period stats */}
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Today" {...data.today} />
            <StatCard label="Last 7 days" {...data.week} />
            <StatCard label="This month" {...data.month} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="p-5 h-40 animate-pulse bg-muted" />
            ))}
          </div>
        )}

        {/* 30-day summary strip */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total (30d)', value: data.all30.total, icon: <ShoppingCart className="h-4 w-4" />, color: 'text-foreground' },
              { label: 'Recovered (30d)', value: data.all30.recovered, icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-green-600 dark:text-green-400' },
              { label: 'Recovery rate', value: `${data.all30.rate}%`, icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Value recovered', value: formatSEK(data.all30.recoveredValue), icon: <Mail className="h-4 w-4" />, color: 'text-green-600 dark:text-green-400' },
            ].map(({ label, value, icon, color }) => (
              <Card key={label} className="p-4 flex items-center gap-3">
                <div className={`${color} opacity-70`}>{icon}</div>
                <div>
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Filter tabs + Table */}
        <Card className="overflow-hidden">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 px-4 pt-4 border-b border-border pb-0 flex-wrap">
            {([
              { key: 'all', label: 'All', count: data?.carts.length ?? 0 },
              { key: 'fresh', label: 'Fresh', count: statusCounts.fresh },
              { key: 'awaiting_email', label: 'Awaiting email', count: statusCounts.awaiting_email },
              { key: 'emailed', label: 'Emailed', count: statusCounts.emailed },
              { key: 'recovered', label: 'Recovered', count: statusCounts.recovered },
            ] as const).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  filter === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === key ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading && !data ? (
              <div className="p-12 text-center text-muted-foreground">Loading...</div>
            ) : filteredCarts.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">No carts found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Items</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Value</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Time</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCarts.map((cart) => (
                    <tr key={cart.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground truncate max-w-[160px]">{cart.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[160px]">{cart.email}</div>
                        {cart.phone && (
                          <div className="text-xs text-muted-foreground">{cart.phone}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="text-foreground">{cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{cart.items}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground whitespace-nowrap">
                        {formatSEK(cart.value)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={cart.status} />
                        {cart.emailSentAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Sent {timeAgo(cart.emailSentAt)}
                          </div>
                        )}
                        {cart.recoveredAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Recovered {timeAgo(cart.recoveredAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-muted-foreground text-xs">
                          {timeAgo(cart.abandonedAt)}
                        </div>
                        <div className="text-muted-foreground text-xs opacity-60">
                          {new Date(cart.abandonedAt).toLocaleDateString('sv-SE')}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://crm.ideallivs.com/wp-admin/post.php?post=${cart.id}&action=edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline whitespace-nowrap"
                          >
                            WC #{cart.id}
                          </a>
                          {cart.token && cart.status !== 'recovered' && (
                            <a
                              href={`${siteUrl}/checkout/recover?token=${cart.token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-foreground hover:underline whitespace-nowrap"
                            >
                              Recovery link
                            </a>
                          )}
                        </div>
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
