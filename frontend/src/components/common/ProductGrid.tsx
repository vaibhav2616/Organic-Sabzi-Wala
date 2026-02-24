import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productsSlice';
import { ProductCard } from './ProductCard';
import type { AppDispatch, RootState } from '../../features/store';
import { motion } from 'framer-motion';

export const ProductGrid = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items = [], isLoading, error } = useSelector((state: RootState) => state.products || {});
    const [loadingSeconds, setLoadingSeconds] = useState(0);

    useEffect(() => {
        if (!items || items.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch]);

    // Count seconds while loading so we can show the "waking up" message
    useEffect(() => {
        if (!isLoading) {
            setLoadingSeconds(0);
            return;
        }
        const interval = setInterval(() => setLoadingSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, [isLoading]);

    if (isLoading && (!items || items.length === 0)) {
        const isWakingUp = loadingSeconds >= 5;
        return (
            <div className="p-4">
                {isWakingUp && (
                    <div className="mb-4 mx-auto max-w-xs text-center bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-amber-700 text-sm font-semibold">🌱 Waking up the server...</p>
                        <p className="text-amber-600 text-xs mt-1">
                            Our backend takes ~30s to wake up. Please wait ({loadingSeconds}s)
                        </p>
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-[3/5] bg-stone-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        const isTimeout = error.toLowerCase().includes('timeout');
        return (
            <div className="p-10 text-center">
                {isTimeout ? (
                    <>
                        <p className="text-2xl mb-2">😴</p>
                        <p className="text-orange-500 font-bold mb-1">Backend is waking up</p>
                        <p className="text-stone-500 text-sm mb-4">
                            Our server on Render takes up to 60 seconds to start after being idle. Please try again in a moment!
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-red-500 font-bold mb-2">Failed to load products</p>
                        <p className="text-xs text-stone-400 mb-4 bg-stone-50 p-2 rounded-lg inline-block border border-stone-100">
                            {error}
                        </p>
                    </>
                )}
                <button
                    onClick={() => dispatch(fetchProducts())}
                    className="bg-organic-green text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-green-700 transition-colors"
                >
                    {isTimeout ? '🔄 Wake Up & Retry' : 'Try Again'}
                </button>
            </div>
        );
    }

    return (
        <motion.div
            className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 }
                }
            }}
        >
            {Array.isArray(items) && items.map(product => (
                <motion.div
                    key={product.id}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                    }}
                >
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </motion.div>
    );
};
