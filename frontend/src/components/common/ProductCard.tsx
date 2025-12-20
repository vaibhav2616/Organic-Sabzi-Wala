import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, Sprout } from 'lucide-react';
import { addToCartOptimistic } from '../../features/cart/cartSlice';
import { type Product, getProductPrice, getOriginalPrice, getProductImage, isOnSale as checkOnSale } from '../../features/products/productsSlice';
import type { AppDispatch, RootState } from '../../features/store';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    if (!product) return null;
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const cartItem = cartItems.find(item => String(item.product.id) === String(product.id));
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const [isAnimating, setIsAnimating] = useState(false);
    const step = 1;

    const stockQuantity = product.stock_quantity ?? (product.is_active ? 100 : 0);
    const displayStock = stockQuantity;

    const price = getProductPrice(product);
    const originalPrice = getOriginalPrice(product);
    const onSale = checkOnSale(product);
    const imageSrc = getProductImage(product) || null;

    const navigate = useNavigate();

    const handleUpdate = (qtyChange: number) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 200);
        dispatch(addToCartOptimistic({ product: product as any, quantity: qtyChange }));
    };

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 border border-stone-100 dark:border-gray-700 p-3 rounded-2xl shadow-sm flex flex-col justify-between h-auto min-h-[16rem] transition-all duration-300 hover:shadow-md cursor-pointer aspect-[3/5]"
            onClick={() => navigate(`/product/${product.slug || product.id}`)}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {displayStock === 0 ? (
                    <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 dark:border-red-800/50">
                        Out of Stock
                    </span>
                ) : (
                    <span className="bg-organic-green/10 dark:bg-organic-green/20 text-organic-green dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-organic-green/20 backdrop-blur-sm flex items-center gap-1">
                        <Sprout size={10} /> Organic
                    </span>
                )}
            </div>

            {/* Image area */}
            <div className="h-32 w-full mb-3 flex items-center justify-center relative rounded-xl overflow-hidden bg-organic-light/30 dark:bg-gray-700/30">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-multiply dark:mix-blend-normal"
                    />
                ) : (
                    <span className="text-gray-300 text-xs">No Image</span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-sm font-bold text-organic-text dark:text-gray-100 font-serif leading-tight mb-1 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 dark:text-gray-400 font-medium">
                        {displayStock > 0 ? 'In Stock' : 'Currently Unavailable'}
                    </p>
                </div>

                <div className="flex justify-between items-end mt-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-organic-text dark:text-gray-100">₹{price.toFixed(0)}</span>
                        {onSale && originalPrice && (
                            <span className="text-[10px] text-stone-400 dark:text-gray-500 line-through">₹{originalPrice.toFixed(0)}</span>
                        )}
                    </div>

                    {/* Add Button */}
                    {displayStock > 0 ? (
                        quantityInCart > 0 ? (
                            <div className={`flex items-center gap-2 bg-organic-green text-white rounded-lg px-2 py-1.5 shadow-sm ${isAnimating ? 'scale-95' : 'scale-100'} transition-transform`}>
                                <button onClick={() => handleUpdate(-step)} className="p-0.5 hover:bg-white/20 rounded transition-colors">
                                    <Minus size={14} />
                                </button>
                                <span className="text-xs font-bold min-w-[14px] text-center">{quantityInCart}</span>
                                <button onClick={() => handleUpdate(step)} className="p-0.5 hover:bg-white/20 rounded transition-colors" disabled={quantityInCart >= displayStock}>
                                    <Plus size={14} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleUpdate(step)}
                                className="bg-stone-100 dark:bg-gray-700 text-stone-600 dark:text-gray-200 hover:bg-organic-green hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                                ADD
                            </button>
                        )
                    ) : (
                        <button disabled className="bg-stone-100 dark:bg-gray-800 text-stone-400 dark:text-gray-600 px-3 py-2 rounded-xl text-xs font-bold cursor-not-allowed">
                            Out
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
