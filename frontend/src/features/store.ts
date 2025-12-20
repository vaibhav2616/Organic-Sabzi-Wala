import { configureStore } from '@reduxjs/toolkit';
import deliveryReducer from './delivery/deliverySlice';
import productsReducer from './products/productsSlice';
import cartReducer from './cart/cartSlice';
import authReducer from './auth/authSlice';
import subscriptionsReducer from './subscriptions/subscriptionsSlice';
import ordersReducer from './orders/ordersSlice';
import wishlistReducer from './wishlist/wishlistSlice';

export const store = configureStore({
    reducer: {
        delivery: deliveryReducer,
        products: productsReducer,
        cart: cartReducer,
        auth: authReducer,
        subscriptions: subscriptionsReducer,
        orders: ordersReducer,
        wishlist: wishlistReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
