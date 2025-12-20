import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

interface WishlistState {
    itemIds: (string | number)[]; // For quick lookup
    items: any[]; // Full product details for Account page
    isLoading: boolean;
}

const initialState: WishlistState = {
    itemIds: [],
    items: [],
    isLoading: false,
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async () => {
        const response = await client.get('wishlist/');
        // Backend returns [{id, product: ID, product_details: {...}}, ...]
        return response.data;
    }
);

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggle',
    async (product: any) => {
        // We pass full product object to add it optimistically or just ID
        const response = await client.post('wishlist/toggle/', { product_id: product.id });
        return { ...response.data, product }; // Pass product back for reducer
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.items = action.payload; // Full list
                state.itemIds = action.payload.map((item: any) => item.product); // IDs
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                const { status, product_id, product } = action.payload;
                if (status === 'added') {
                    state.itemIds.push(product_id);
                    // Add to items list (Mocking the structure since backend returns new ID)
                    // We'll re-fetch or just append a partial object
                    state.items.push({
                        product: product_id,
                        product_details: product
                    });
                } else {
                    state.itemIds = state.itemIds.filter(id => id !== product_id);
                    state.items = state.items.filter(item => item.product !== product_id);
                }
            });
    },
});

export default wishlistSlice.reducer;
