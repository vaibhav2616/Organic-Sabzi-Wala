import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    phone_number: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    name?: string; // Legacy support or computed
    is_phone_verified: boolean;
    wallet_balance?: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Load from LocalStorage if available
const savedToken = localStorage.getItem('access_token');
const savedUserStr = localStorage.getItem('user_data');

let parsedUser: User | null = null;
try {
    if (savedUserStr && savedUserStr !== "undefined") {
        parsedUser = JSON.parse(savedUserStr);
        // Basic validation: ensure it has an id
        if (!parsedUser || !parsedUser.id) {
            parsedUser = null;
        }
    }
} catch (e) {
    console.error("Failed to parse user data", e);
    parsedUser = null;
    localStorage.removeItem('user_data');
}

const initialState: AuthState = {
    user: parsedUser,
    token: savedToken,
    isAuthenticated: !!savedToken && !!parsedUser,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;

            // Persist
            localStorage.setItem('access_token', action.payload.token);
            localStorage.setItem('user_data', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
        },
        updateUserStatus: (state, action: PayloadAction<{ is_phone_verified: boolean }>) => {
            if (state.user) {
                state.user.is_phone_verified = action.payload.is_phone_verified;
                localStorage.setItem('user_data', JSON.stringify(state.user));
            }
        },
        updateUserData: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user_data', JSON.stringify(state.user));
            }
        }
    },
});

export const { loginSuccess, logout, updateUserStatus } = authSlice.actions;
export default authSlice.reducer;
