'use server';

import { isCustomerBlocked } from '@/lib/blocked-customers';

/**
 * Server action — check whether a customer is blocked from placing orders.
 * Returns { blocked: true, reason: string } or { blocked: false }.
 *
 * Used by the checkout page after the user fills in their email address.
 */
export async function checkCustomerBlockedAction(opts: {
    email?: string;
    customerId?: number;
}): Promise<{ blocked: boolean; reason?: string }> {
    try {
        const result = isCustomerBlocked(opts);
        if (result.blocked) {
            return { blocked: true, reason: result.reason };
        }
        return { blocked: false };
    } catch (error) {
        console.error('Error checking blocked customer:', error);
        // Fail open — do not block customers if the check itself fails
        return { blocked: false };
    }
}
