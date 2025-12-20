import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productsSlice';
import { ProductCard } from './ProductCard';
import type { AppDispatch, RootState } from '../../features/store';
import { Loader2 } from 'lucide-react';

export const ProductGrid = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items = [], isLoading, error } = useSelector((state: RootState) => state.products || {});

    useEffect(() => {
        // Only fetch if empty or undefined
        if (!items || items.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, items?.length]);

    if (isLoading && (!items || items.length === 0)) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-500 mb-2">Failed to load products</p>
                <button onClick={() => dispatch(fetchProducts())} className="text-sm underline text-gray-600">Retry</button>
            </div>
        );
    }

    if (!isLoading && (!items || items.length === 0)) {
        return (
            <div className="p-10 text-center text-gray-500">
                <p>No products found.</p>
                <p className="text-xs">Check console for API details.</p>
            </div>
        );
    }

    return (
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {Array.isArray(items) && items.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
