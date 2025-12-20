import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ArrowLeft, ShoppingBag, Tag, Check } from 'lucide-react';
import type { RootState, AppDispatch } from '../features/store';
import { addToCartOptimistic, addToCartAPI, applyCouponAPI, removeCoupon } from '../features/cart/cartSlice';
import { ProductCard } from '../components/common/ProductCard';
import { getProductPrice } from '../features/products/productsSlice';

import { useState } from 'react';
const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { items, totalAmount, couponCode, discountAmount, couponError } = useSelector((state: RootState) => state.cart);
    const { deliveryTimeHrs, isServiceable } = useSelector((state: RootState) => state.delivery);
    const { items: productItems } = useSelector((state: RootState) => state.products);

    // UI State
    const [showCoupons, setShowCoupons] = useState(false);

    const availableCoupons = [
        { code: 'WELCOME50', desc: 'Save ₹50 on first order', min: 200 },
        { code: 'FREEDEL', desc: 'Free Delivery', min: 0 }
    ];

    // Business Logic: Delivery Fee
    const deliveryFee = totalAmount > 200 ? 0 : 25;
    const handlingFee = 5;
    const grandTotal = totalAmount + deliveryFee + handlingFee;

    const handleUpdate = (item: { product: any, quantity: number }, change: number) => {
        if (!item?.product?.id) return;
        dispatch(addToCartOptimistic({ product: item.product, quantity: change }));
        dispatch(addToCartAPI({ product: item.product, quantity: change }));
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-full mb-6 animate-pulse">
                    <ShoppingBag size={48} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 dark:shadow-none"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32 max-w-3xl mx-auto transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3 transition-colors">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft size={24} className="text-gray-700 dark:text-white" />
                </button>
                <div>
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white">My Cart</h1>
                    {isServiceable && (
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            Delays likely? No. Delivery in {deliveryTimeHrs} hours
                        </p>
                    )}
                </div>
            </header>

            <main className="p-4 space-y-4">
                {/* Items List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="flex items-center gap-3">
                                {/* Small Image */}
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                    {item.product.images && item.product.images.length > 0 ? (
                                        <img src={item.product.images[0].src} className="w-full h-full object-contain" alt={item.product.name} />
                                    ) : (
                                        <span className="text-[8px] text-gray-400">IMG</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-1">{item.product.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.product.weight || '1 unit'}</p>
                                    <p className="text-sm font-bold mt-1 text-gray-900 dark:text-white">₹{getProductPrice(item.product).toFixed(0)}</p>
                                </div>
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/30 rounded-lg px-2 py-1 border border-green-200 dark:border-green-800">
                                <button onClick={() => handleUpdate(item, -1)} className="text-green-700 dark:text-green-400 p-1">
                                    <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold text-green-800 dark:text-green-300 w-4 text-center">{item.quantity}</span>
                                <button onClick={() => handleUpdate(item, 1)} className="text-green-700 dark:text-green-400 p-1">
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cancellation Policy */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm transition-colors">
                    <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Cancellation Policy</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be processed to your original payment method.
                    </p>
                </div>

                {/* Offers & Coupons */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm transition-colors">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <Tag size={16} className="text-blue-600" />
                        Offers & Benefits
                    </h3>

                    {!couponCode ? (
                        <>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Coupon Code"
                                    className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            dispatch(applyCouponAPI({ code: e.currentTarget.value, total: totalAmount }));
                                        }
                                    }}
                                    onFocus={() => setShowCoupons(true)}
                                />
                                <button
                                    className="text-green-600 font-bold text-sm px-3 hover:text-green-500 transition-colors"
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        if (input.value) dispatch(applyCouponAPI({ code: input.value, total: totalAmount }));
                                    }}
                                >
                                    APPLY
                                </button>
                            </div>

                            {/* Coupon Suggestions */}
                            {showCoupons && (
                                <div className="mt-3 space-y-2 animate-in slide-in-from-top-2">
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Available Coupons</p>
                                    {availableCoupons.map((c) => (
                                        <div
                                            key={c.code}
                                            onClick={() => {
                                                dispatch(applyCouponAPI({ code: c.code, total: totalAmount }));
                                                setShowCoupons(false);
                                            }}
                                            className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex justify-between items-center cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                        >
                                            <div>
                                                <span className="font-bold text-gray-800 dark:text-white text-xs block border border-green-500 rounded px-1.5 py-0.5 w-fit bg-white dark:bg-gray-800">{c.code}</span>
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400">{c.desc}</span>
                                            </div>
                                            <button className="text-green-600 dark:text-green-400 text-xs font-bold">APPLY</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2">
                                <Check size={16} className="text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm font-bold text-green-800 dark:text-green-300">'{couponCode}' applied</p>
                                    <p className="text-xs text-green-600 dark:text-green-400">You saved ₹{discountAmount}</p>
                                </div>
                            </div>
                            <button onClick={() => dispatch(removeCoupon())} className="text-xs text-red-500 font-bold uppercase hover:text-red-400">
                                Remove
                            </button>
                        </div>
                    )}
                    {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
                </div>

                {/* Suggestions */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm transition-colors">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">You might also like</h3>

                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                        {(productItems || [])
                            .filter(p => p && !items.find(i => i.product.id === p.id))
                            .slice(0, 5)
                            .map(p => (
                                <div key={p.id} className="min-w-[140px] w-[140px]">
                                    <ProductCard product={p} />
                                </div>
                            ))}
                    </div>
                </div>

                {/* Bill Details */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm transition-colors">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Bill Details</h3>
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                            <span>Item Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>{deliveryFee === 0 ? <span className="text-green-600 dark:text-green-400">FREE</span> : `₹${deliveryFee}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Handling Charge</span>
                            <span>₹{handlingFee}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                                <span>Coupon ({couponCode})</span>
                                <span>-₹{discountAmount}</span>
                            </div>
                        )}
                        <div className="border-t border-gray-100 dark:border-gray-700 my-2 pt-2 flex justify-between font-bold text-base text-gray-900 dark:text-white transition-colors">
                            <span>Grand Total</span>
                            <span>₹{(grandTotal - (discountAmount || 0)).toFixed(0)}</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Bar */}
            <div className="fixed bottom-[60px] left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 transition-all border-t dark:border-gray-700">
                <div className="flex justify-between items-center mb-0">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">To Pay</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹{(grandTotal - (discountAmount || 0)).toFixed(0)}</p>
                    </div>
                    <button
                        onClick={() => navigate('/checkout')}
                        disabled={items.length === 0}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 dark:shadow-none flex items-center gap-2"
                    >
                        Proceed to Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
