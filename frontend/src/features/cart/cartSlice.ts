import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import client from '../../api/client';
import { type Product, getProductPrice } from '../products/productsSlice';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
    isLoading: boolean;
    error: string | null;
    isOpen: boolean;
    // Coupon State
    couponCode: string | null;
    discountAmount: number;
    couponError: string | null;
}

// Helper: Calculate Total (uses canonical price helper for format-agnostic calculation)
const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => {
        return total + (getProductPrice(item.product) * item.quantity);
    }, 0);
};

// Helper: Load from Storage
const loadCartFromStorage = (): CartItem[] => {
    try {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const initialState: CartState = {
    items: loadCartFromStorage(),
    totalAmount: calculateTotal(loadCartFromStorage()),
    isLoading: false,
    error: null,
    isOpen: false,
    couponCode: null,
    discountAmount: 0,
    couponError: null,
};

// Async Thunk: Fetch Cart from Backend
export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async (_) => {
        // MOCK: Backend cart fetch disabled for now (Guest Mode)
        // const response = await client.get('cart/');
        // return response.data; 
        return { items: [] };
    }
);

// Async Thunk: Sync Add to Backend
export const addToCartAPI = createAsyncThunk(
    'cart/addAPI',
    async ({ product, quantity }: { product: Product, quantity: number }, { rejectWithValue }) => {
        try {
            const response = await client.post('cart/add/', {
                product_id: product.id,
                quantity: quantity
            });
            if (response.data.success) {
                return { product, quantity };
            }
            return rejectWithValue(response.data.user_msg);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.quantity?.[0] || err.response?.data?.user_msg || 'Add failed');
        }
    }
);

// Async Thunk: Apply Coupon
export const applyCouponAPI = createAsyncThunk(
    'cart/applyCoupon',
    async ({ code, total }: { code: string, total: number }, { rejectWithValue }) => {
        // MOCK: Client-side verification since backend isn't ready
        return new Promise<{ coupon: string, discount_amount: number }>((resolve, reject) => {
            setTimeout(() => {
                const normalizedCode = code.toUpperCase();
                if (normalizedCode === 'WELCOME50') {
                    const discount = Math.min(total * 0.5, 150); // 50% off up to ₹150
                    resolve({ coupon: 'WELCOME50', discount_amount: discount });
                } else if (normalizedCode === 'FREEDEL') {
                    // Assuming standard delivery is around ₹40-50, or just a flat discount
                    resolve({ coupon: 'FREEDEL', discount_amount: 49 });
                } else {
                    reject(rejectWithValue('Invalid Coupon Code'));
                }
            }, 500);
        });

        // Original Backend Call (Commented out)
        /*
        try {
            const response = await client.post('coupons/apply/', { code, order_total: total });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Invalid Coupon');
        }
        */
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCartOptimistic: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
            const { product, quantity } = action.payload;
            const existingItem = state.items.find(item => item.product.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity;
                if (existingItem.quantity <= 0) {
                    state.items = state.items.filter(item => item.product.id !== product.id);
                }
            } else if (quantity > 0) {
                state.items.push({ product, quantity });
            }
            state.totalAmount = calculateTotal(state.items);
            state.error = null;
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeFromCart: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter(item => String(item.product.id) !== String(action.payload));
            state.totalAmount = calculateTotal(state.items);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.couponCode = null;
            state.discountAmount = 0;
            state.couponError = null;
            localStorage.removeItem('cart');
        },
        removeCoupon: (state) => {
            state.couponCode = null;
            state.discountAmount = 0;
            state.couponError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                // Robustly handle backend response format
                const payload = action.payload as any; // Cast to any to handle flexible structure
                let backendItems: CartItem[] = [];

                if (Array.isArray(payload)) {
                    backendItems = payload;
                } else if (payload && Array.isArray(payload.items)) {
                    backendItems = payload.items;
                } else if (payload && Array.isArray(payload.data)) {
                    backendItems = payload.data;
                }

                // Always sync, even if empty, to ensure backend state is reflected
                state.items = backendItems;
                state.totalAmount = calculateTotal(state.items);
                localStorage.setItem('cart', JSON.stringify(state.items));
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(addToCartAPI.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCartAPI.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addToCartAPI.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(applyCouponAPI.pending, (state) => { state.isLoading = true; state.couponError = null; })
            .addCase(applyCouponAPI.fulfilled, (state, action) => {
                state.isLoading = false;
                state.couponCode = action.payload.coupon;
                state.discountAmount = action.payload.discount_amount;
                state.couponError = null;
            })
            .addCase(applyCouponAPI.rejected, (state, action) => {
                state.isLoading = false;
                state.couponError = action.payload as string;
                state.couponCode = null;
                state.discountAmount = 0;
            });
    },
});


export const { addToCartOptimistic, removeFromCart, clearCart, removeCoupon } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export default cartSlice.reducer;
