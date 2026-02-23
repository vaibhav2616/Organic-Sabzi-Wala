import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productsSlice';
import { ProductCard } from './ProductCard';
import type { AppDispatch, RootState } from '../../features/store';
import { motion } from 'framer-motion';

export const ProductGrid = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items = [], isLoading, error } = useSelector((state: RootState) => state.products || {});

    useEffect(() => {
        if (!items || items.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, items?.length]);

    if (isLoading && (!items || items.length === 0)) {
        return (
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/5] bg-stone-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-500 font-bold mb-2">Failed to load products</p>
                <p className="text-xs text-stone-400 mb-4 bg-stone-50 p-2 rounded-lg inline-block border border-stone-100">
                    Error Detail: {error}
                </p>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => dispatch(fetchProducts())}
                        className="text-sm font-bold text-organic-green underline"
                    >
                        Try Again
                    </button>
                    <p className="text-[10px] text-stone-400">
                        Check if your Render Backend is active and Env Vars are set.
                    </p>
                </div>
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
                    transition: { staggerChildren: 0.1 }
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
