import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

export interface Subscription {
    id: string;
    product: string;
    product_details: any;
    quantity: number;
    frequency: 'DAILY' | 'ALTERNATE_DAYS' | 'WEEKLY' | 'MONTHLY';
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    start_date: string;
    next_delivery_date: string;
}

interface SubscriptionState {
    items: Subscription[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    items: [],
    isLoading: false,
    error: null,
};

export const fetchSubscriptions = createAsyncThunk(
    'subscriptions/fetch',
    async () => {
        const response = await client.get('/subscriptions/');
        return response.data;
    }
);

export const createSubscription = createAsyncThunk(
    'subscriptions/create',
    async (data: { product: string | number; quantity: number; frequency: string; start_date: string }) => {
        const response = await client.post('/subscriptions/', data);
        return response.data;
    }
);

export const toggleSubscription = createAsyncThunk(
    'subscriptions/toggle',
    async ({ id, action }: { id: string; action: 'pause' | 'resume' | 'cancel' }) => {
        await client.post(`/subscriptions/${id}/${action}/`);
        return { id, status: action === 'resume' ? 'ACTIVE' : action.toUpperCase() };
    }
);

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchSubscriptions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch subscriptions';
            })
            .addCase(createSubscription.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(toggleSubscription.fulfilled, (state, action) => {
                const index = state.items.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    // @ts-ignore
                    state.items[index].status = action.payload.status;
                }
            });
    },
});

export default subscriptionsSlice.reducer;
