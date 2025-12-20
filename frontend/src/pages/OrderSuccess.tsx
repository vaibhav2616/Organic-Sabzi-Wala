
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Truck, Leaf, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [fact, setFact] = useState('');

    // Facts about Organic Farming & Sustainability
    const facts = [
        "Did you know? Organic farming uses 45% less energy than conventional farming.",
        "Choosing organic saves pollinators like bees and butterflies from harmful chemicals.",
        "Organic soil absorbs more carbon dioxide, helping fight climate change.",
        "No synthetic pesticides means cleaner water and healthier soil for future generations.",
        "Our 'Certified Organic' badge ensures 100% natural growth verify by USDA standards."
    ];

    const dispatch = useDispatch();

    useEffect(() => {
        // Clear cart on success
        dispatch(clearCart());

        // Pick a random fact
        setFact(facts[Math.floor(Math.random() * facts.length)]);
    }, []);

    const orderId = location.state?.orderId || "OD-12345";

    return (
        <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors">

            {/* Confetti Background (Simulated via CSS dots if we could, but let's keep it clean) */}

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl flex flex-col items-center text-center max-w-md w-full z-10 transition-colors"
            >
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
                    </motion.div>
                </div>

                <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Order ID: {orderId}</p>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 w-full mb-6 text-left flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-green-800 dark:text-green-300 text-sm mb-1">Impact Made</h3>
                        <p className="text-green-700 dark:text-green-400 text-xs leading-relaxed">
                            {fact}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex flex-col items-center gap-2">
                        <Truck className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Live Tracking</span>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg flex flex-col items-center gap-2">
                        <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-800 dark:text-yellow-300">100% Organic</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => navigate('/orders')}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 transition"
                    >
                        Track Order
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-white dark:bg-gray-700 text-gray-600 dark:text-white font-bold py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                    >
                        Continue Shopping
                    </button>
                </div>

            </motion.div>

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl" />
            </div>

        </div>
    );
};

export default OrderSuccess;
