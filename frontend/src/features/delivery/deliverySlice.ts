import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import client from '../../api/client';

interface DeliveryState {
    zipCode: string | null;
    city: string | null;
    deliveryTimeHrs: number | null;
    isServiceable: boolean;
    isLoading: boolean;
    error: string | null;
    lastDebugLog?: string | null;
}

const initialState: DeliveryState = {
    zipCode: null,
    city: null,
    deliveryTimeHrs: null,
    isServiceable: false, // Default false until checked
    isLoading: false,
    error: null,
    lastDebugLog: null,
};

// Async Thunk for Checking Delivery
export const checkDelivery = createAsyncThunk(
    'delivery/check',
    async (zipCode: string, { rejectWithValue }) => {
        try {
            const response = await client.post('check-delivery/', { zip_code: zipCode });
            if (response.data.success) {
                return {
                    ...response.data.data,
                    debug_log: response.data.debug_log
                };
            } else {
                // Pass debug log even on failure if possible, but rejectWithValue usually just takes message
                // For separate field, we might need a custom reject object
                return rejectWithValue(response.data.user_msg || 'Not Serviceable');
            }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.user_msg || 'Connection Error');
        }
    }
);

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        setZipCode: (state, action: PayloadAction<string>) => {
            state.zipCode = action.payload;
        },
        resetDelivery: (state) => {
            state.zipCode = null;
            state.city = null;
            state.deliveryTimeHrs = null;
            state.isServiceable = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkDelivery.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkDelivery.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isServiceable = action.payload.is_serviceable;
                state.lastDebugLog = action.payload.debug_log;
                if (action.payload.is_serviceable) {
                    state.deliveryTimeHrs = action.payload.delivery_time_hrs;
                    state.city = action.payload.city;
                } else {
                    state.error = 'Not Serviceable in this area yet.';
                    state.isServiceable = false;
                }
            })
            .addCase(checkDelivery.rejected, (state, action) => {
                state.isLoading = false;
                state.isServiceable = false;
                state.error = action.payload as string;
            });
    },
});

export const { setZipCode, resetDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;
