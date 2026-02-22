import { ProductGrid } from '../components/common/ProductGrid';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';




const Home = () => {
    const navigate = useNavigate();

    const scrollToProductGrid = () => {
        window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    };


    return (
        <div className="pb-24 bg-[#Fdfbf7] dark:bg-gray-900 min-h-screen">
            {/* Header handled by MobileLayout now */}

            <HeroSection />

            {/* Yearly Offer Banner */}
            <div
                onClick={() => navigate('/categories')}
                className="mt-6 mx-4 bg-[#FFEBEE] dark:bg-red-900/20 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:scale-95 transition-all">
                <div>
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Limited Time</span>
                    <h3 className="font-bold text-lg text-red-900 dark:text-red-100 mt-1">Get 50% OFF</h3>
                    <p className="text-xs text-red-700 dark:text-red-300">On your first yearly subscription</p>
                </div>
                <div className="text-3xl">🍓</div>
            </div>

            {/* Free Delivery Offer Banner */}
            <div
                onClick={scrollToProductGrid}
                className="mx-4 mt-4 bg-gradient-to-r from-organic-green to-emerald-600 rounded-xl p-0.5 shadow-md cursor-pointer active:scale-[0.99] transition-all"
            >
                <div className="bg-white dark:bg-gray-800 rounded-[10px] p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">
                        BEST VALUE
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="bg-green-50 p-3 rounded-full text-2xl">🎉</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-organic-dark dark:text-gray-100 leading-tight font-serif">
                                Free Delivery for a Year!
                            </h3>
                            <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                                Save big with our yearly membership. Unlimited free deliveries on orders above ₹999.
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="font-bold text-xl text-organic-green">₹149</span>
                                <span className="text-xs text-stone-400 line-through">₹499</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/account');
                                    }}
                                    className="ml-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors z-10"
                                >
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-2 text-center border-t border-stone-100 pt-1">
                        *T&C Apply. Applicable on orders above ₹999.
                    </p>
                </div>
            </div>

            <h2 className="font-bold text-lg px-4 mt-6 text-gray-800 dark:text-gray-100 font-serif">Fresh Vegetables</h2>
            <ErrorBoundary>
                <div className="mt-2">
                    <ProductGrid />
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default Home;
