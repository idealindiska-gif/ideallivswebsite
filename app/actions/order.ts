'use server';

import { createOrder, updateOrder, type CreateOrderData, type UpdateOrderData } from '@/lib/woocommerce/orders';

export async function createOrderAction(orderData: CreateOrderData) {
    try {
        const order = await createOrder(orderData);
        return { success: true, data: order };
    } catch (error: any) {
        console.error('Order creation error:', error);
        return { success: false, error: error.message || 'Failed to create order' };
    }
}

export async function updateOrderAction(orderId: number, orderData: UpdateOrderData) {
    try {
        const order = await updateOrder(orderId, orderData);
        return { success: true, data: order };
    } catch (error: any) {
        console.error('Order update error:', error);
        return { success: false, error: error.message || 'Failed to update order' };
    }
}
