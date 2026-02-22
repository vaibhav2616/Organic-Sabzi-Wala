// Phase 17: Final build fixes (Trigger v2)
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Minus, Plus, Share2, MapPin, Calendar, FileText, ChevronRight } from 'lucide-react';
import { fetchProducts } from '../features/products/productsSlice';
import { addToCartOptimistic } from '../features/cart/cartSlice';
import { getProductPrice, getProductImage } from '../features/products/productsSlice';
import type { AppDispatch, RootState } from '../features/store';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Select product from store (or fetch if missing)
    const { items: products, isLoading } = useSelector((state: RootState) => state.products);
    const product = products.find(p => p.slug === slug || String(p.id) === slug);

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartItem = product ? cartItems.find(item => String(item.product.id) === String(product.id)) : null;
    const quantityInCart = cartItem ? cartItem.quantity : 0;



    useEffect(() => {
        if (!product && !isLoading) {
            dispatch(fetchProducts());
        }
    }, [dispatch, product, isLoading]);

    if (isLoading && !product) return <div className="h-screen flex items-center justify-center text-organic-green">Loading Freshness...</div>;
    if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

    const price = getProductPrice(product);
    const imageSrc = getProductImage(product);
    const stock = product.stock_quantity || 0;

    // Mock Data for Traceability Story
    const mockTrace = {
        harvestDate: "14 Feb",
        farmName: "Sharma Organic Farm",
        location: "Barabanki, UP",
        farmerName: "Ramesh Sharma",
        farmerImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    };

    const handleUpdate = (qtyChange: number) => {
        dispatch(addToCartOptimistic({ product: product as any, quantity: qtyChange }));
    };

    return (
        <div className="min-h-screen bg-organic-cream pb-24 relative">
            {/* Header Image Area */}
            <div className="relative h-[24rem] bg-organic-light/30 rounded-b-[3rem] overflow-hidden shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-stone-700" />
                </button>

                <div className="absolute top-4 right-4 z-20">
                    <button className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors">
                        <Share2 className="w-5 h-5 text-stone-700" />
                    </button>
                </div>

                {imageSrc ? (
                    <img src={imageSrc} className="w-full h-full object-contain p-8 mix-blend-multiply" alt={product.name} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div>
                )}

                {/* 100% Organic Badge Floating */}
                <div className="absolute bottom-8 left-6 bg-organic-green text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> 100% Organic
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 -mt-4 relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-serif font-bold text-organic-text leading-tight w-[70%]">{product.name}</h1>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-organic-text">₹{price.toFixed(0)}</div>
                        <div className="text-xs text-stone-500">per kg</div>
                    </div>
                </div>

                {/* Story / Traceability Cards */}
                <div className="mt-6 space-y-4">
                    {/* Harvest Info */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
                                <Calendar size={14} /> Harvested
                            </div>
                            <div className="font-bold text-organic-text">{mockTrace.harvestDate}</div>
                        </div>
                        <div className="h-8 w-[1px] bg-stone-100"></div>
                        <div>
                            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
                                <MapPin size={14} /> Farm
                            </div>
                            <div className="font-bold text-organic-text">{mockTrace.farmName}</div>
                        </div>
                    </div>

                    {/* Report & Farmer */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate('/lab-reports')}
                            className="bg-stone-800 text-white p-4 rounded-2xl flex flex-col justify-between items-start hover:bg-stone-900 transition-colors shadow-sm"
                        >
                            <FileText className="w-5 h-5 mb-2 opacity-80" />
                            <div className="text-left">
                                <div className="text-[10px] opacity-70 uppercase tracking-widest">Lab Report</div>
                                <div className="font-bold text-sm">View Report</div>
                            </div>
                        </button>

                        <div className="bg-white p-4 rounded-2xl border border-stone-100 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-organic-green/30 transition-colors cursor-pointer" onClick={() => navigate('/traceability')}>
                            <div className="flex items-center gap-2 mb-2">
                                <img src={mockTrace.farmerImg} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" alt="Farmer" />
                                <div className="text-xs font-bold text-organic-text leading-tight">{mockTrace.farmerName}</div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-organic-green font-bold uppercase tracking-wider">
                                Meet Farmer <ChevronRight size={12} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-8">
                    <h3 className="text-lg font-serif font-bold text-organic-text mb-2">Description</h3>
                    <div className="text-sm text-stone-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description || 'No description available for this fresh produce.' }}></div>
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-stone-200 z-40 pb-safe">
                {stock === 0 ? (
                    <button disabled className="w-full bg-stone-200 text-stone-500 font-bold py-4 rounded-xl cursor-not-allowed">
                        Currently Out of Stock
                    </button>
                ) : (
                    quantityInCart > 0 ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 bg-organic-green/10 px-4 py-2 rounded-xl">
                                <button onClick={() => handleUpdate(-1)} className="p-2 bg-white rounded-lg text-organic-green shadow-sm hover:scale-105 transition-transform"><Minus size={18} /></button>
                                <span className="font-bold text-xl text-organic-green w-6 text-center">{quantityInCart}</span>
                                <button onClick={() => handleUpdate(1)} className="p-2 bg-organic-green text-white rounded-lg shadow-sm hover:scale-105 transition-transform" disabled={quantityInCart >= stock}><Plus size={18} /></button>
                            </div>
                            <button onClick={() => navigate('/cart')} className="flex-1 bg-organic-text text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-colors">
                                View Cart
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleUpdate(1)}
                            className="w-full bg-organic-green text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                        >
                            Add to Cart
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
