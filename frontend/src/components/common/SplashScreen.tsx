import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FACTS = [
    "Did you know? Lemons float, but limes sink.",
    "Potatoes were the first food grown in space!",
    "Broccoli contains more protein than steak per calorie.",
    "Carrots were originally purple, not orange.",
    "Apples usually have five seed pockets.",
    "Bananas are technically berries!",
    "Cucumbers are 95% water.",
    "A strawberry isn't a true berry, but a banana is.",
    "Honey never spoils. Archaeologists found 3000-year-old honey!",
    "Tomatoes are fruits, but legally vegetables in the US (1893 ruling)."
];

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [factIndex, setFactIndex] = useState(0);

    useEffect(() => {
        // Pick a random fact initially
        setFactIndex(Math.floor(Math.random() * FACTS.length));

        // Show for 3 seconds, then complete
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-green-50 z-[1000] flex flex-col items-center justify-center p-6 text-center"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm">
                        <span className="text-4xl animate-bounce">🥗</span>
                    </div>
                </motion.div>

                <h1 className="text-2xl font-bold text-green-800 mb-2">Organic Sabzi Wala</h1>
                <p className="text-sm text-green-600 mb-8">Fresh from the farm, straight to your door.</p>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 max-w-xs">
                    <p className="text-gray-600 italic">"{FACTS[factIndex]}"</p>
                </div>

                <div className="mt-8 flex gap-1">
                    <motion.div className="w-2 h-2 bg-green-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-green-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-green-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
