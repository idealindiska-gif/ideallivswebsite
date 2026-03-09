import { NextRequest, NextResponse } from 'next/server';
import {
    getBlockedCustomers,
    blockCustomer,
    unblockCustomer,
    updateBlockReason,
    isCustomerBlocked,
} from '@/lib/blocked-customers';

// Reuse the same admin secret used by the abandoned-carts endpoint
function isAuthorized(request: NextRequest): boolean {
    const secret =
        request.nextUrl.searchParams.get('secret') ||
        request.headers.get('x-admin-secret');
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
        console.warn('ADMIN_SECRET env variable not set — blocking all admin access');
        return false;
    }
    return secret === adminSecret;
}

// ── GET: List all blocked customers ──────────────────────────────────────────

export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const customers = getBlockedCustomers();
        return NextResponse.json({ customers, total: customers.length });
    } catch (error) {
        console.error('Error fetching blocked customers:', error);
        return NextResponse.json({ error: 'Failed to fetch blocked customers' }, { status: 500 });
    }
}

// ── POST: Block a new customer ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { email, customerId, reason, blockedBy } = body as {
            email?: string;
            customerId?: number;
            reason: string;
            blockedBy?: string;
        };

        if (!reason?.trim()) {
            return NextResponse.json({ error: 'A reason is required' }, { status: 400 });
        }

        if (!email && !customerId) {
            return NextResponse.json({ error: 'Either email or customerId is required' }, { status: 400 });
        }

        const entry = blockCustomer({ email, customerId, reason, blockedBy });
        return NextResponse.json({ success: true, entry }, { status: 201 });
    } catch (error: any) {
        console.error('Error blocking customer:', error);
        // Return 409 for duplicate conflicts
        const status = error?.message?.includes('already blocked') ? 409 : 500;
        return NextResponse.json({ error: error?.message || 'Failed to block customer' }, { status });
    }
}

// ── PATCH: Update reason for a block  ─────────────────────────────────────────

export async function PATCH(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, reason } = body as { id: string; reason: string };

        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
        if (!reason?.trim()) return NextResponse.json({ error: 'reason is required' }, { status: 400 });

        const updated = updateBlockReason(id, reason);
        if (!updated) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to update' }, { status: 500 });
    }
}

// ── DELETE: Unblock a customer ────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

        const removed = unblockCustomer(id);
        if (!removed) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Failed to unblock customer' }, { status: 500 });
    }
}
