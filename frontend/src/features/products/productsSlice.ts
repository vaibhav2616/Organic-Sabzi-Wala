import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../api/client';

// === Canonical Product Type ===
// Works with both v2/products/ (local DB) and proxy/products/ (WooCommerce)
export interface Product {
    // Core fields (always present)
    id: number | string;
    name: string;
    slug: string;
    description: string;

    // Canonical fields (from v2/products/ — local DB)
    image?: string | null;
    base_price?: number;
    discounted_price?: number | null;
    pricing_unit?: { id?: number; name: string; symbol: string } | null;
    weight_value?: number;
    weight_unit?: { id?: number; name: string; symbol: string } | null;
    is_organic?: boolean;
    trust_badge?: string | null;
    is_active?: boolean;
    category?: { id: number; name: string; slug: string };

    // Legacy WooCommerce fields (from proxy/products/)
    short_description?: string;
    price?: string;
    regular_price?: string;
    sale_price?: string;
    on_sale?: boolean;
    stock_quantity?: number | null;
    stock_status?: string;
    images?: { id: number; src: string; alt: string }[];
    categories?: { id: number; name: string; slug: string }[];
    meta_data?: { id: number; key: string; value: any }[];
    weight?: string;
    dimensions?: any;
}

// === Helper: Get price from either format (always returns a number) ===
export function getProductPrice(product: Product): number {
    let finalPrice = 0;

    // Canonical format (may be string from DRF DecimalField)
    if (product.discounted_price != null) finalPrice = parseFloat(String(product.discounted_price)) || 0;
    else if (product.base_price != null) finalPrice = parseFloat(String(product.base_price)) || 0;

    // Legacy WC format (string)
    else if (product.price) finalPrice = parseFloat(product.price) || 0;
    else if (product.regular_price) finalPrice = parseFloat(product.regular_price) || 0;

    // Fallback for "Sem" or other incomplete data to avoid "₹0"
    if (finalPrice === 0) {
        return 40; // Default fallback price
    }

    return finalPrice;
}

// === Helper: Get original price (for strikethrough, always returns number or null) ===
export function getOriginalPrice(product: Product): number | null {
    if (product.base_price != null && product.discounted_price != null) {
        return parseFloat(String(product.base_price)) || null;
    }
    if (product.on_sale && product.regular_price) {
        return parseFloat(product.regular_price) || null;
    }
    return null;
}

// === Helper: Get product image URL ===
export function getProductImage(product: Product): string {
    let imgPath = '';
    if (product.image) imgPath = product.image;
    else if (product.images && product.images.length > 0) imgPath = product.images[0].src;

    if (!imgPath) return '';

    // If it's a relative path, prepend the API base URL (excluding the /api/ suffix)
    if (imgPath.startsWith('/')) {
        const apiBase = client.defaults.baseURL?.replace('/api/', '') || '';
        return `${apiBase}${imgPath}`;
    }

    return imgPath;
}

// === Helper: Check if product is on sale ===
export function isOnSale(product: Product): boolean {
    if (product.discounted_price != null && product.base_price != null) {
        return product.discounted_price < product.base_price;
    }
    return product.on_sale || false;
}

interface ProductsState {
    items: Product[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    isLoading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetch',
    async (_, { rejectWithValue }) => {
        try {
            // Try v2 endpoint first (local DB)
            try {
                const response = await client.get('v2/products/', { timeout: 10000 });
                const data = response.data;
                // v2 uses StandardResponseRenderer: { success, data }
                let products: Product[] = [];
                if (data && data.success && Array.isArray(data.data)) {
                    products = data.data;
                } else if (Array.isArray(data)) {
                    products = data;
                }

                if (products.length > 0) {
                    console.log("Successfully fetched products from v2");
                    return products;
                }
            } catch (err) {
                console.warn("v2 endpoint failed or timed out, trying proxy...", err);
            }

            // Legacy: WooCommerce proxy
            const response = await client.get('proxy/products/', { timeout: 20000 });
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
                return response.data.data;
            }

            console.error("Unexpected API Response format (likely HTML):", response.data);
            return rejectWithValue('Backend returned invalid data format');
        } catch (err: any) {
            console.error("API Connection Error:", err);
            return rejectWithValue(err.response?.data?.message || 'Connection Error: Check if Backend is Awake');
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default productsSlice.reducer;
