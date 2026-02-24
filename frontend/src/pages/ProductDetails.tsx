import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Heart, Share2, Leaf, MapPin, CheckCircle2, ChevronRight, FileText, User, ShoppingCart, Home, Grid, Star } from 'lucide-react';
import { addToCartOptimistic, addToCartAPI } from '../features/cart/cartSlice';
import { getProductImage } from '../features/products/productsSlice';
import type { RootState, AppDispatch } from '../features/store';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { ProductCard } from '../components/common/ProductCard';

const REVIEWS = [
    { id: 1, name: 'Priya S.', rating: 5, date: '2 days ago', text: 'Absolutely fresh! You can tell it was harvested recently. The quality is unmatched compared to local market.', verified: true },
    { id: 2, name: 'Rahul M.', rating: 4, date: '1 week ago', text: 'Great product, delivered on time. Slightly smaller portions than expected but the taste is amazing.', verified: true },
    { id: 3, name: 'Ananya K.', rating: 5, date: '2 weeks ago', text: 'Love the traceability feature — knowing exactly which farm this comes from gives so much confidence. Will order again!', verified: false },
];

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={13} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-gray-600'} />
        ))}
    </div>
);

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const products = useSelector((state: RootState) => state.products.items) || [];
    const product = products.find(p => p.slug === slug || String(p.id) === slug);

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartItem = cartItems.find(item => product && String(item.product.id) === String(product.id));
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    const wishlistIds = useSelector((state: RootState) => state.wishlist.itemIds);
    const isWishlisted = product ? wishlistIds.some(id => String(id) === String(product.id)) : false;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // Suggested products: same category, exclude current
    const suggestedProducts = products
        .filter(p => p.id !== product.id && (p.category === product.category || (p as any).category_id === (product as any).category_id))
        .slice(0, 6);
    const displaySuggested = suggestedProducts.length >= 2 ? suggestedProducts : products.filter(p => p.id !== product.id).slice(0, 6);

    const imageSrc = getProductImage(product);
    const price = parseFloat(product.price || product.regular_price || '60');

    // FIX: send DELTA (+1 or -1), not absolute quantity
    const handleAdd = () => {
        dispatch(addToCartOptimistic({ product, quantity: 1 }));
        dispatch(addToCartAPI({ product, quantity: 1 }));
    };

    const handleRemove = () => {
        dispatch(addToCartOptimistic({ product, quantity: -1 }));
        dispatch(addToCartAPI({ product, quantity: -1 }));
    };

    return (
        <div className="min-h-screen bg-organic-cream dark:bg-gray-900 font-sans pb-40 relative">
            {/* Header Image Section */}
            <div className="relative h-[45vh] bg-stone-100 dark:bg-gray-800 rounded-b-[2.5rem] overflow-hidden shadow-sm">
                {/* Navbar Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-between items-start pt-6">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full shadow-sm">
                        <ArrowLeft size={24} className="text-gray-800 dark:text-white" />
                    </button>
                    <div className="flex gap-3">
                        <button onClick={() => dispatch(toggleWishlist(product))} className="p-2 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full shadow-sm">
                            <Heart size={24} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-800 dark:text-white'} />
                        </button>
                    </div>
                </div>

                {/* Badge Header Row */}
                <div className="absolute top-20 left-0 right-0 flex justify-center gap-3 z-20">
                    <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wide text-organic-dark dark:text-white">
                        <CheckCircle2 size={12} className="text-organic-green dark:text-green-400" /> Direct
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wide text-organic-dark dark:text-white">
                        <CheckCircle2 size={12} className="text-organic-green dark:text-green-400" /> Lab-Tested
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wide text-organic-dark dark:text-white">
                        <CheckCircle2 size={12} className="text-organic-green dark:text-green-400" /> Traceable
                    </div>
                </div>

                {/* Main Image */}
                <div className="w-full h-full flex items-center justify-center p-8 relative pt-20">
                    {imageSrc ? (
                        <img src={imageSrc} alt={product.name} className="w-full h-full object-contain drop-shadow-xl mix-blend-multiply dark:mix-blend-normal" />
                    ) : (
                        <div className="w-32 h-32 bg-stone-200 rounded-3xl flex items-center justify-center">
                            <Leaf size={40} className="text-stone-400" />
                        </div>
                    )}
                    {/* 100% Organic Badge Overlay */}
                    <div className="absolute top-28 left-6 bg-organic-green text-white w-16 h-16 rounded-full flex flex-col items-center justify-center font-serif leading-none shadow-lg rotate-[-10deg] border-2 border-white/30">
                        <span className="text-sm font-bold">100%</span>
                        <span className="text-[10px]">Organic</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-6 relative -mt-6 z-30">
                {/* Title & Unit */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-organic-text dark:text-gray-100 mb-1">{product.name}</h1>
                        <p className="text-stone-500 dark:text-gray-400 font-medium">1 kg (Approx. 8-10 pcs)</p>
                    </div>
                    <button className="bg-stone-100 dark:bg-gray-800 p-2 rounded-full text-stone-400 dark:text-gray-500">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Traceability Info */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-stone-100 dark:border-gray-700 mb-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-organic-green dark:text-green-400">
                                <Leaf size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-stone-500 dark:text-gray-400 font-bold uppercase">Harvested</p>
                                <p className="font-bold text-organic-text dark:text-gray-200">14 Feb (Yesterday)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-organic-green dark:text-green-400">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-stone-500 dark:text-gray-400 font-bold uppercase">Farm</p>
                                <p className="font-bold text-organic-text dark:text-gray-200">Sharma Organic Farm</p>
                                <p className="text-xs text-stone-400 dark:text-gray-500">Barabanki, UP</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={() => navigate('/lab-reports')}
                            className="flex-1 bg-stone-800 dark:bg-black text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                        >
                            <FileText size={14} /> View Report
                        </button>
                        <button
                            onClick={() => navigate('/traceability')}
                            className="flex-1 bg-white dark:bg-gray-700 border border-stone-200 dark:border-gray-600 text-organic-text dark:text-gray-200 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                        >
                            <div className="w-5 h-5 rounded-full bg-stone-200 dark:bg-gray-500 flex items-center justify-center overflow-hidden">
                                <User size={12} className="dark:text-white" />
                            </div>
                            Meet the Farmer
                        </button>
                    </div>
                </div>

                {/* ─── Suggested Products ─── */}
                {displaySuggested.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-serif font-bold text-organic-text dark:text-gray-100 mb-3">
                            🛒 You Might Also Like
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {displaySuggested.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Reviews Section ─── */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-serif font-bold text-organic-text dark:text-gray-100">⭐ Customer Reviews</h2>
                        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">4.7</span>
                            <span className="text-xs text-stone-400 dark:text-gray-500">(128)</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {REVIEWS.map(review => (
                            <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-stone-100 dark:border-gray-700 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-organic-green to-green-700 flex items-center justify-center text-white text-xs font-bold">
                                            {review.name[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold text-organic-text dark:text-gray-100">{review.name}</span>
                                                {review.verified && (
                                                    <span className="text-[9px] bg-green-100 dark:bg-green-900/30 text-organic-green dark:text-green-400 font-bold px-1.5 py-0.5 rounded-full">✓ Verified</span>
                                                )}
                                            </div>
                                            <StarRating rating={review.rating} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-stone-400 dark:text-gray-500">{review.date}</span>
                                </div>
                                <p className="text-sm text-stone-600 dark:text-gray-400 leading-relaxed">{review.text}</p>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-3 py-3 border border-stone-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-stone-500 dark:text-gray-400 hover:bg-stone-50 dark:hover:bg-gray-800 transition-colors">
                        See All 128 Reviews
                    </button>
                </div>

                <div className="h-4"></div>

            </div>

            {/* ───── BOTTOM SECTION: Add to Cart BAR ───── */}
            <div className="fixed bottom-0 left-0 w-full z-50">
                {/* Cart Control Bar */}
                <div className="bg-white dark:bg-gray-800 border-t border-stone-100 dark:border-gray-700 px-4 pt-4 pb-2 shadow-[0_-5px_20px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                        {/* Price */}
                        <div className="flex flex-col">
                            {product.regular_price && parseFloat(product.regular_price) > price && (
                                <span className="text-xs text-stone-400 font-bold line-through">₹{parseFloat(product.regular_price).toFixed(0)}</span>
                            )}
                            <span className="text-2xl font-serif font-bold text-organic-text dark:text-white">
                                ₹{price.toFixed(0)} <span className="text-sm font-sans text-stone-500 dark:text-gray-400 font-normal">/ kg</span>
                            </span>
                        </div>

                        {/* Add / Quantity control */}
                        {quantityInCart === 0 ? (
                            <button
                                onClick={handleAdd}
                                className="flex-1 bg-organic-green text-white py-3.5 rounded-full font-bold text-sm shadow-xl shadow-green-200 dark:shadow-none flex items-center justify-center gap-2 hover:bg-green-800 active:scale-95 transition-all"
                            >
                                Add to Cart <ChevronRight size={18} />
                            </button>
                        ) : (
                            <div className="flex-1 flex items-center justify-between bg-stone-100 dark:bg-gray-700 rounded-full p-1">
                                <button
                                    onClick={handleRemove}
                                    className="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center shadow-sm font-bold text-lg text-organic-text dark:text-white active:scale-90 transition-transform"
                                >
                                    −
                                </button>
                                <span className="font-bold text-lg dark:text-white">{quantityInCart}</span>
                                <button
                                    onClick={handleAdd}
                                    className="w-10 h-10 bg-organic-green text-white rounded-full flex items-center justify-center shadow-md font-bold text-lg active:scale-90 transition-transform"
                                >
                                    +
                                </button>
                            </div>
                        )}

                        {/* Go to Cart button */}
                        {quantityInCart > 0 && (
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative bg-organic-green text-white p-3 rounded-full shadow-lg"
                            >
                                <ShoppingCart size={20} />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                                    {totalCartCount}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mini Navigation Bar (replaces BottomNav since it's hidden on product pages) */}
                <div className="bg-[#0f2819] flex justify-around items-center h-14 px-2">
                    <button onClick={() => navigate('/')} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors">
                        <Home size={20} strokeWidth={1.5} />
                        <span className="text-[9px] font-medium">Home</span>
                    </button>
                    <button onClick={() => navigate('/categories')} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors">
                        <Grid size={20} strokeWidth={1.5} />
                        <span className="text-[9px] font-medium">Categories</span>
                    </button>
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors relative"
                    >
                        <ShoppingCart size={20} strokeWidth={1.5} />
                        {totalCartCount > 0 && (
                            <span className="absolute -top-1 right-1 bg-red-500 text-white text-[9px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5">
                                {totalCartCount}
                            </span>
                        )}
                        <span className="text-[9px] font-medium">Cart</span>
                    </button>
                    <button onClick={() => navigate('/account')} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white transition-colors">
                        <User size={20} strokeWidth={1.5} />
                        <span className="text-[9px] font-medium">Account</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
