/**
 * Blocked Customers Management
 *
 * Stores the blocked list in /data/blocked-customers.json.
 * Customers can be blocked by email address or WooCommerce customer ID.
 * All lookups are case-insensitive on email.
 */

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'blocked-customers.json');

export interface BlockedCustomer {
    id: string;              // Internal unique ID (UUID-like timestamp)
    email?: string;          // Block by email (case-insensitive)
    customerId?: number;     // Block by WooCommerce customer ID
    reason: string;          // Admin note — why blocked
    blockedAt: string;       // ISO timestamp
    blockedBy?: string;      // Admin who added the block
}

export interface BlockedCustomersData {
    customers: BlockedCustomer[];
    updatedAt: string;
}

// ── Read / Write helpers ──────────────────────────────────────────────────────

function readData(): BlockedCustomersData {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return { customers: [], updatedAt: new Date().toISOString() };
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw) as BlockedCustomersData;
    } catch {
        return { customers: [], updatedAt: new Date().toISOString() };
    }
}

function writeData(data: BlockedCustomersData): void {
    // Ensure the data directory exists
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns the full list of blocked customers */
export function getBlockedCustomers(): BlockedCustomer[] {
    return readData().customers;
}

/**
 * Check whether a customer is blocked.
 * Pass email and/or WooCommerce customer ID.
 */
export function isCustomerBlocked(opts: {
    email?: string;
    customerId?: number;
}): { blocked: boolean; reason?: string; entry?: BlockedCustomer } {
    const data = readData();
    const normalizedEmail = opts.email?.trim().toLowerCase();

    for (const entry of data.customers) {
        // Match by email
        if (normalizedEmail && entry.email && entry.email.toLowerCase() === normalizedEmail) {
            return { blocked: true, reason: entry.reason, entry };
        }
        // Match by WooCommerce customer ID
        if (opts.customerId && entry.customerId && entry.customerId === opts.customerId) {
            return { blocked: true, reason: entry.reason, entry };
        }
    }

    return { blocked: false };
}

/**
 * Add a customer to the blocked list.
 * At least one of email or customerId must be provided.
 */
export function blockCustomer(opts: {
    email?: string;
    customerId?: number;
    reason: string;
    blockedBy?: string;
}): BlockedCustomer {
    if (!opts.email && !opts.customerId) {
        throw new Error('Either email or customerId must be provided');
    }

    const data = readData();
    const normalizedEmail = opts.email?.trim().toLowerCase();

    // Check for duplicates
    for (const entry of data.customers) {
        if (normalizedEmail && entry.email && entry.email.toLowerCase() === normalizedEmail) {
            throw new Error(`Customer with email ${opts.email} is already blocked`);
        }
        if (opts.customerId && entry.customerId && entry.customerId === opts.customerId) {
            throw new Error(`Customer with ID ${opts.customerId} is already blocked`);
        }
    }

    const newEntry: BlockedCustomer = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        email: normalizedEmail,
        customerId: opts.customerId,
        reason: opts.reason.trim(),
        blockedAt: new Date().toISOString(),
        blockedBy: opts.blockedBy,
    };

    data.customers.push(newEntry);
    data.updatedAt = new Date().toISOString();
    writeData(data);

    return newEntry;
}

/**
 * Remove a customer from the blocked list by their internal ID.
 */
export function unblockCustomer(id: string): boolean {
    const data = readData();
    const before = data.customers.length;
    data.customers = data.customers.filter((c) => c.id !== id);

    if (data.customers.length === before) return false;

    data.updatedAt = new Date().toISOString();
    writeData(data);
    return true;
}

/**
 * Update the reason for an existing block.
 */
export function updateBlockReason(id: string, reason: string): boolean {
    const data = readData();
    const entry = data.customers.find((c) => c.id === id);
    if (!entry) return false;

    entry.reason = reason.trim();
    data.updatedAt = new Date().toISOString();
    writeData(data);
    return true;
}
