import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, Sprout } from 'lucide-react';
import { addToCartOptimistic } from '../../features/cart/cartSlice';
import { type Product, getProductPrice, getOriginalPrice, getProductImage, isOnSale as checkOnSale } from '../../features/products/productsSlice';
import type { AppDispatch, RootState } from '../../features/store';

interface ProductCardProps {
    product: Product;
}

import { motion } from 'framer-motion';

export const ProductCard = ({ product }: ProductCardProps) => {
    if (!product) return null;
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const cartItem = cartItems.find(item => String(item.product.id) === String(product.id));
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const step = 1;

    const stockQuantity = product.stock_quantity ?? (product.is_active ? 100 : 0);
    const displayStock = stockQuantity;

    const price = getProductPrice(product);
    const originalPrice = getOriginalPrice(product);
    const onSale = checkOnSale(product);
    const imageSrc = getProductImage(product) || null;

    const navigate = useNavigate();

    const handleUpdate = (qtyChange: number) => {
        dispatch(addToCartOptimistic({ product: product as any, quantity: qtyChange }));
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="group relative bg-white dark:bg-gray-800 border border-stone-100 dark:border-gray-700 p-3 rounded-2xl shadow-premium flex flex-col justify-between h-auto min-h-[16rem] transition-all duration-300 hover:shadow-xl cursor-pointer aspect-[3/5] seed-texture"
            onClick={() => navigate(`/product/${product.slug || product.id}`)}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {displayStock === 0 ? (
                    <span className="glass text-red-600 dark:text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800/50">
                        Out of Stock
                    </span>
                ) : (
                    <span className="glass text-organic-green dark:text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-organic-green/20 flex items-center gap-1.5 shadow-sm">
                        <Sprout size={11} className="animate-pulse" /> ORGANIC
                    </span>
                )}
            </div>

            {/* Image area */}
            <div className="h-36 w-full mb-3 flex items-center justify-center relative rounded-xl overflow-hidden bg-stone-50/50 dark:bg-gray-700/20">
                {imageSrc ? (
                    <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={imageSrc}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-2 group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply dark:mix-blend-normal"
                    />
                ) : (
                    <div className="bg-stone-100 dark:bg-gray-700 w-full h-full flex items-center justify-center">
                        <span className="text-gray-300 text-xs italic">Coming Soon</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 justify-between px-1">
                <div>
                    <h3 className="text-sm font-bold text-organic-text dark:text-gray-100 font-serif leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>
                    <p className="text-[10px] text-stone-400 dark:text-gray-500 font-bold tracking-wider uppercase">
                        {displayStock > 0 ? 'FARM FRESH' : 'NOT IN SEASON'}
                    </p>
                </div>

                <div className="flex justify-between items-end mt-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-organic-text dark:text-gray-100">₹{price.toFixed(0)}</span>
                        {onSale && originalPrice && (
                            <span className="text-[10px] text-stone-400 dark:text-gray-500 line-through">₹{originalPrice.toFixed(0)}</span>
                        )}
                    </div>

                    {/* Add Button */}
                    {displayStock > 0 ? (
                        quantityInCart > 0 ? (
                            <div className="flex items-center gap-2 bg-organic-green text-white rounded-lg p-1 shadow-md">
                                <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleUpdate(-step)} className="p-1 hover:bg-white/20 rounded transition-colors">
                                    <Minus size={14} />
                                </motion.button>
                                <span className="text-xs font-bold min-w-[14px] text-center">{quantityInCart}</span>
                                <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleUpdate(step)} className="p-1 hover:bg-white/20 rounded transition-colors" disabled={quantityInCart >= displayStock}>
                                    <Plus size={14} />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUpdate(step)}
                                className="bg-organic-green text-white dark:bg-green-700 px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md hover:bg-green-600 active:shadow-inner tracking-widest"
                            >
                                ADD
                            </motion.button>
                        )
                    ) : (
                        <button disabled className="bg-stone-50 dark:bg-gray-800 text-stone-300 dark:text-gray-700 px-3 py-2 rounded-xl text-xs font-bold cursor-not-allowed border border-stone-100 dark:border-gray-700">
                            OUT
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
