// Premium Product Card Component — Compact Design
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, Sprout } from 'lucide-react';
import { addToCartOptimistic } from '../../features/cart/cartSlice';
import { type Product, getProductPrice, getOriginalPrice, getProductImage, isOnSale as checkOnSale } from '../../features/products/productsSlice';
import type { AppDispatch, RootState } from '../../features/store';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    if (!product) return null;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const cartItem = cartItems.find(item => String(item.product.id) === String(product.id));
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const stockQuantity = product.stock_quantity ?? (product.is_active ? 100 : 0);
    const price = getProductPrice(product);
    const originalPrice = getOriginalPrice(product);
    const onSale = checkOnSale(product);
    const imageSrc = getProductImage(product) || null;

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(addToCartOptimistic({ product: product as any, quantity: 1 }));
    };
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(addToCartOptimistic({ product: product as any, quantity: -1 }));
    };

    return (
        <motion.div
            whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.10)' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="group relative bg-white dark:bg-gray-800 border border-stone-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm cursor-pointer"
            onClick={() => navigate(`/product/${product.slug || product.id}`)}
        >
            {/* Image Section — fixed height */}
            <div className="relative h-32 sm:h-36 bg-stone-50 dark:bg-gray-700/40 flex items-center justify-center overflow-hidden">
                {/* ORGANIC badge */}
                <div className="absolute top-2 left-2 z-10">
                    {stockQuantity === 0 ? (
                        <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                            Out of Stock
                        </span>
                    ) : (
                        <span className="bg-organic-green/10 text-organic-green text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-organic-green/20">
                            <Sprout size={9} /> ORGANIC
                        </span>
                    )}
                </div>

                {/* Sale badge */}
                {onSale && (
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        SALE
                    </div>
                )}

                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform duration-500 ease-out mix-blend-multiply dark:mix-blend-normal"
                    />
                ) : (
                    <div className="text-gray-300 text-xs italic text-center px-2">No Image</div>
                )}
            </div>

            {/* Info Section */}
            <div className="px-3 pt-2 pb-3">
                <h3 className="text-[13px] font-bold text-organic-text dark:text-gray-100 font-serif leading-tight line-clamp-2 mb-1">
                    {product.name}
                </h3>

                {/* Price + Add button row */}
                <div className="flex items-center justify-between mt-2" onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-base text-organic-text dark:text-gray-100 leading-none">₹{price.toFixed(0)}</span>
                        {onSale && originalPrice && (
                            <span className="text-[10px] text-stone-400 line-through">₹{originalPrice.toFixed(0)}</span>
                        )}
                    </div>

                    {stockQuantity > 0 ? (
                        quantityInCart > 0 ? (
                            <div className="flex items-center gap-1.5 bg-organic-green rounded-xl px-1.5 py-1 shadow-sm">
                                <motion.button whileTap={{ scale: 0.75 }} onClick={handleRemove} className="w-6 h-6 flex items-center justify-center text-white">
                                    <Minus size={12} />
                                </motion.button>
                                <span className="text-white text-xs font-bold min-w-[14px] text-center">{quantityInCart}</span>
                                <motion.button whileTap={{ scale: 0.75 }} onClick={handleAdd} className="w-6 h-6 flex items-center justify-center text-white">
                                    <Plus size={12} />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleAdd}
                                className="bg-organic-green text-white rounded-xl px-4 py-2 text-[11px] font-black tracking-widest shadow-sm hover:bg-green-700 active:shadow-inner transition-colors"
                            >
                                ADD
                            </motion.button>
                        )
                    ) : (
                        <button disabled className="bg-stone-100 dark:bg-gray-700 text-stone-300 dark:text-gray-600 px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-not-allowed">
                            OUT
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
