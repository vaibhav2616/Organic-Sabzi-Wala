import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import client from '../../api/client';

interface WishlistState {
    itemIds: (string | number)[];
    items: any[];
    isLoading: boolean;
}

const initialState: WishlistState = {
    itemIds: JSON.parse(localStorage.getItem('wishlist_ids') || '[]'),
    items: [],
    isLoading: false,
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async () => {
        const response = await client.get('wishlist/');
        return response.data;
    }
);

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggle',
    async (product: any) => {
        try {
            const response = await client.post('wishlist/toggle/', { product_id: product.id });
            return { ...response.data, product };
        } catch {
            // Guest / not logged in: just return a local toggle signal
            return { status: 'local', product_id: product.id, product };
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        // Optimistic local toggle (for guests)
        localToggleWishlist: (state, action: PayloadAction<any>) => {
            const id = action.payload.id;
            const alreadyIn = state.itemIds.some(w => String(w) === String(id));
            if (alreadyIn) {
                state.itemIds = state.itemIds.filter(w => String(w) !== String(id));
                state.items = state.items.filter(item => String(item.product) !== String(id));
            } else {
                state.itemIds.push(id);
                state.items.push({ product: id, product_details: action.payload });
            }
            localStorage.setItem('wishlist_ids', JSON.stringify(state.itemIds));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
                state.itemIds = action.payload.map((item: any) => item.product);
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                const { status, product_id, product } = action.payload;
                if (status === 'local') {
                    // Guest fallback — toggle locally
                    const alreadyIn = state.itemIds.some(w => String(w) === String(product_id));
                    if (alreadyIn) {
                        state.itemIds = state.itemIds.filter(w => String(w) !== String(product_id));
                    } else {
                        state.itemIds.push(product_id);
                        state.items.push({ product: product_id, product_details: product });
                    }
                } else if (status === 'added') {
                    if (!state.itemIds.some(w => String(w) === String(product_id))) {
                        state.itemIds.push(product_id);
                        state.items.push({ product: product_id, product_details: product });
                    }
                } else {
                    state.itemIds = state.itemIds.filter(id => id !== product_id);
                    state.items = state.items.filter(item => item.product !== product_id);
                }
                localStorage.setItem('wishlist_ids', JSON.stringify(state.itemIds));
            });
    },
});

export const { localToggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
