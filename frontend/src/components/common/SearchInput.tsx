import { Search } from 'lucide-react';

export const SearchInput = () => {
    return (
        <div className="relative w-full max-w-md mx-auto mt-4 px-4 sticky top-[3.5rem] z-30">
            <div className="relative group">
                <div className="absolute inset-0 bg-organic-green/20 rounded-xl blur-md group-hover:bg-organic-green/30 transition-colors"></div>
                <div className="relative bg-white/90 backdrop-blur-sm border border-organic-light rounded-xl flex items-center shadow-sm">
                    <Search className="ml-4 w-5 h-5 text-stone-400 group-focus-within:text-organic-green transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for vegetables, fruits..."
                        className="w-full bg-transparent border-none focus:ring-0 text-organic-text placeholder:text-stone-400 py-3 px-3 text-sm font-medium"
                    />
                </div>
            </div>
        </div>
    );
};
