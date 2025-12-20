import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

// Interfaces
export interface OrderItem {
    product_name: string;
    quantity: number;
    price_at_purchase: string;
}

export interface Order {
    id: string;
    total_price: string;
    status: 'PENDING' | 'PACKING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
    delivery_status: 'PENDING' | 'PACKING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'; // Using delivery_status as main status
    items: OrderItem[];
    created_at: string;
    driver_name?: string;
    driver_phone?: string;
    driver_location_lat?: number;
    driver_location_lng?: number;
    is_subscription: boolean;
}

interface OrdersState {
    items: Order[];
    activeOrder: Order | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    activeOrder: null,
    isLoading: false,
    error: null,
};

// Async Thunks
export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async () => {
        const response = await client.get('orders/');
        return response.data;
    }
);

export const fetchOrderDetails = createAsyncThunk(
    'orders/fetchDetails',
    async (orderId: string) => {
        const response = await client.get(`orders/${orderId}/`);
        return response.data;
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearActiveOrder: (state) => {
            state.activeOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch orders';
            })
            .addCase(fetchOrderDetails.pending, (state) => {
                state.isLoading = true;
                state.activeOrder = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeOrder = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch order details';
            });
    },
});

export const { clearActiveOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
