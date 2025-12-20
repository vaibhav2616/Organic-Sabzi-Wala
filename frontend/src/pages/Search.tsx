import { useState, useRef } from 'react';
import { Search, X, Sparkles, ChefHat } from 'lucide-react';
import client from '../api/client';
import { ProductCard } from '../components/common/ProductCard';
import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';

const RECIPES: Record<string, { title: string, ingredients: string[] }> = {
    'lemon': { title: 'Refreshing Lemonade', ingredients: ['Lemon', 'Honey', 'Mint'] },
    'potato': { title: 'Spicy Aloo Jeera', ingredients: ['Potato', 'Coriander'] },
    'paneer': { title: 'Matar Paneer', ingredients: ['Paneer', 'Green Peas', 'Tomato'] },
};

const SmartSuggestions = ({ onSelect }: { onSelect: (txt: string) => void }) => {
    const cartItems = useSelector((state: RootState) => state.cart.items);

    // Logic: Find related items based on cart
    const relatedSuggestions = new Set<string>();
    const recipeIdeas: any[] = [];

    cartItems.forEach(item => {
        const name = item.product.name.toLowerCase();
        if (name.includes('lemon')) { relatedSuggestions.add('Ginger'); relatedSuggestions.add('Honey'); }
        if (name.includes('potato')) { relatedSuggestions.add('Onion'); relatedSuggestions.add('Tomato'); }
        if (name.includes('milk')) { relatedSuggestions.add('Bread'); relatedSuggestions.add('Butter'); }

        // Check recipes
        Object.entries(RECIPES).forEach(([key, recipe]) => {
            if (name.includes(key)) recipeIdeas.push(recipe);
        });
    });

    const suggestions = Array.from(relatedSuggestions).slice(0, 5);
    const popular = ['Potato', 'Onion', 'Tomato', 'Banana', 'Milk'];

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
            {suggestions.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-green-700 dark:text-green-400 mb-3">
                        <Sparkles size={14} /> Based on your cart
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(s => (
                            <button key={s} onClick={() => onSelect(s)} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium border border-green-100 dark:border-green-800">
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {recipeIdeas.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-orange-700 dark:text-orange-400 mb-3">
                        <ChefHat size={14} /> Cook something new?
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {recipeIdeas.slice(0, 2).map((r, i) => (
                            <div key={i} className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800">
                                <p className="font-bold text-xs text-orange-800 dark:text-orange-300 mb-1">{r.title}</p>
                                <div className="flex gap-1 flex-wrap">
                                    {r.ingredients.map((ing: string) => (
                                        <span key={ing} onClick={() => onSelect(ing)} className="cursor-pointer underline decoration-orange-300 text-[10px] text-orange-600 dark:text-orange-400">{ing}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                    {popular.map(s => (
                        <button key={s} onClick={() => onSelect(s)} className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-100 dark:border-gray-700 shadow-sm">
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<any>(null);

    const handleSearch = (text: string) => {
        setQuery(text);
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (text.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        debounceRef.current = setTimeout(() => {
            // Assume backend has search? Or we filter locally if backend not ready?
            // Let's try backend `products/?search=` if we implemented SearchFilter
            // I'll assume standard list for now and filter manually if needed or update backend
            client.get('products/')
                .then(res => {
                    const allProducts = res.data.data || res.data;
                    const filtered = allProducts.filter((p: any) => p.name.toLowerCase().includes(text.toLowerCase()));
                    setResults(filtered);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }, 300); // 300ms debounce
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-300">
            {/* Search Header */}
            <div className="bg-white dark:bg-gray-800 p-3 shadow-sm sticky top-0 z-20 flex items-center gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search for products..."
                        className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white border-none rounded-lg py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-colors"
                    />
                    {query && (
                        <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="p-2 space-y-2">
                {query.length > 0 && query.length < 2 && (
                    <p className="text-xs text-gray-400 p-4 text-center">Type at least 2 characters</p>
                )}

                {/* Smart Suggestions (When no query) */}
                {query.length === 0 && (
                    <div className="p-4">
                        <SmartSuggestions onSelect={handleSearch} />
                    </div>
                )}

                {loading ? (
                    <div className="p-10 text-center text-gray-400 text-sm">Searching...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {results.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {query.length >= 2 && !loading && results.length === 0 && (
                    <div className="p-10 text-center text-gray-400 text-sm">
                        No results found for "{query}"
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
