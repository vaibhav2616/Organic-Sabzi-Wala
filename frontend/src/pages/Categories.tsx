import { useNavigate } from 'react-router-dom';
import { Search, Carrot, Apple, Wheat, Milk, Leaf, Sprout, Home } from 'lucide-react';
import { BottomNav } from '../components/layout/BottomNav';

export const categories = [
    { id: 1, name: "Organic Vegetables", slug: "organic-vegetables", icon: Carrot, color: "text-green-600" },
    { id: 2, name: "Organic Fruits", slug: "organic-fruits", icon: Apple, color: "text-red-500" },
    { id: 3, name: "Cut Fresh & Salads", slug: "organic-cut-fresh-salads", icon: Leaf, color: "text-emerald-700" },
    { id: 4, name: "Herbs & Spices", slug: "organic-herbs-spices", icon: Sprout, color: "text-purple-600" },
    { id: 5, name: "Organic Flour", slug: "organic-flour", icon: Wheat, color: "text-amber-600" },
    { id: 6, name: "Organic Rice", slug: "organic-rice", icon: Wheat, color: "text-amber-500" },
    { id: 7, name: "Organic Millets", slug: "organic-millets", icon: Wheat, color: "text-yellow-600" }, // Using Wheat as placeholder for grains
    { id: 8, name: "Organic Pulses", slug: "organic-pulses", icon: Leaf, color: "text-orange-600" },
    { id: 9, name: "Organic Oils", slug: "organic-oils", icon: Leaf, color: "text-yellow-500" }, // Using Leaf/Drop metaphor
    { id: 10, name: "Organic Dairy", slug: "organic-dairy", icon: Milk, color: "text-blue-500" },
    { id: 11, name: "Organic Eggs", slug: "organic-eggs", icon: Home, color: "text-stone-500" }, // Egg icon not available, using Home/Farm metaphor or default
];

const CategoriesPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#Fdfbf7] dark:bg-gray-900 pb-24">
            {/* Header & Search */}
            <div className="sticky top-[3.5rem] z-30 bg-[#Fdfbf7]/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-serif font-bold text-organic-text dark:text-gray-100">Shop by Categories</h1>
                </div>

                {/* Pill Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for vegetables, fruits..."
                        className="w-full bg-white dark:bg-gray-800 rounded-full py-3.5 px-6 pl-12 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-stone-100 dark:border-gray-700 text-base font-medium text-stone-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-organic-green/50 placeholder:text-stone-400"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-organic-dark text-white p-2 rounded-full shadow-md">
                        <Search size={16} />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="p-4 grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => navigate(`/category/${cat.slug}`)}
                        className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-all cursor-pointer border border-stone-50 dark:border-gray-700 aspect-square group"
                    >
                        {/* Circle Illustration Background */}
                        <div className="w-20 h-20 rounded-full bg-[#Fdfbf7] dark:bg-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            {/* Illustration Placeholder - Using Icon for now but styled */}
                            <cat.icon className={`w-10 h-10 ${cat.color}`} strokeWidth={1.5} />
                        </div>

                        <span className="font-bold text-organic-text dark:text-gray-200 text-lg tracking-tight font-serif">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
            <BottomNav />
        </div>
    );
};

export default CategoriesPage;
