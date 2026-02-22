import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Heart, Share2, Leaf, MapPin, CheckCircle2, ChevronRight, FileText, User } from 'lucide-react';
import { addToCartOptimistic, addToCartAPI } from '../features/cart/cartSlice';
import type { RootState, AppDispatch } from '../features/store';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const products = useSelector((state: RootState) => state.products.items) || [];
    const product = products.find(p => p.slug === slug || String(p.id) === slug);

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartItem = cartItems.find(item => product && String(item.product.id) === String(product.id));
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const wishlistIds = useSelector((state: RootState) => state.wishlist.itemIds);
    const isWishlisted = product ? wishlistIds.some(id => String(id) === String(product.id)) : false;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const images = product.images && product.images.length > 0 ? product.images.map(i => i.src) : [(product as any).image];
    const price = parseFloat(product.price || product.regular_price || '60'); // Default to 60 as per image

    const handleUpdate = (qty: number) => {
        dispatch(addToCartOptimistic({ product: product, quantity: qty }));
        dispatch(addToCartAPI({ product: product, quantity: qty }));
    };

    return (
        <div className="min-h-screen bg-organic-cream dark:bg-gray-900 font-sans pb-24 relative">
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
                    <img src={images[0]} alt={product.name} className="w-full h-full object-contain drop-shadow-xl" />
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

                <div className="h-20"></div> {/* Spacer */}
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-stone-100 dark:border-gray-700 p-4 pb-8 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
                <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-stone-400 font-bold line-through">₹{parseFloat(product.regular_price || '0').toFixed(0)}</span>
                        <span className="text-2xl font-serif font-bold text-organic-text dark:text-white">₹{price.toFixed(0)} <span className="text-sm font-sans text-stone-500 dark:text-gray-400 font-normal">/ kg</span></span>
                    </div>

                    {quantityInCart === 0 ? (
                        <button
                            onClick={() => handleUpdate(1)}
                            className="flex-1 bg-organic-green text-white py-3.5 rounded-full font-bold text-sm shadow-xl shadow-green-200 dark:shadow-none flex items-center justify-center gap-2 hover:bg-green-800 transition-colors"
                        >
                            Add to Cart <ChevronRight size={18} />
                        </button>
                    ) : (
                        <div className="flex-1 flex items-center justify-between bg-stone-100 dark:bg-gray-700 rounded-full p-1">
                            <button onClick={() => handleUpdate(quantityInCart - 1)} className="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center shadow-sm font-bold text-lg text-organic-text dark:text-white">-</button>
                            <span className="font-bold text-lg dark:text-white">{quantityInCart}</span>
                            <button onClick={() => handleUpdate(quantityInCart + 1)} className="w-10 h-10 bg-organic-green text-white rounded-full flex items-center justify-center shadow-md font-bold text-lg">+</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
