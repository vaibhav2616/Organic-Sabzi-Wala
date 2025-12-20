import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, User, Leaf } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { BottomNav } from './BottomNav';
import { SplashScreen } from '../common/SplashScreen';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { categories } from '../../pages/Categories';

import type { AppDispatch } from '../../features/store';
import { fetchCart, selectCartItems } from '../../features/cart/cartSlice';

export const MobileLayout = () => {
    // Hooks MUST be unconditional
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector(selectCartItems);
    const cartItemCount = cartItems.length;
    const [showSplash, setShowSplash] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Initial Check
    useEffect(() => {
        // Fetch Cart State
        dispatch(fetchCart());

        localStorage.setItem('has_visited', 'true');
    }, [dispatch]);

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    const isHomePage = location.pathname === '/';

    // Pages that manage their own header/layout (Immersive or Custom Header)
    const isCustomHeaderPage =
        location.pathname === '/lab-reports' ||
        location.pathname.startsWith('/product/');

    const isProductPage = location.pathname.startsWith('/product/');
    const isCheckoutPage = location.pathname === '/checkout';

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                categories={categories}
            />

            {!isCustomHeaderPage && (
                <header className="fixed top-0 left-0 right-0 z-40 bg-white text-stone-900 shadow-sm border-b border-stone-100 transition-all duration-300">
                    <div className="flex items-center justify-between px-4 h-14">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <img src="/src/assets/logo.png" alt="Organic Sabzi Wala" className="h-14 w-auto object-contain" />
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => navigate('/account')}
                                className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
                            >
                                <User size={24} />
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="p-2 rounded-full relative hover:bg-stone-100 text-stone-600 transition-colors"
                            >
                                <ShoppingBag size={24} />
                                {cartItemCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className={`${isCustomHeaderPage ? 'pt-0' : 'pt-14'} pb-20 min-h-screen`}>
                <Outlet />
                <Footer />
            </main>

            {!isProductPage && !isCheckoutPage && <BottomNav />}
        </div>
    );
};
