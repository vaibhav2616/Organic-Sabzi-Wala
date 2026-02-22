import { X, ChevronRight, Home, Info, FileText, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    categories: { id: number; name: string; slug: string; icon: any; color: string }[];
}

export const Sidebar = ({ isOpen, onClose, categories }: SidebarProps) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <div className="relative w-3/4 max-w-xs bg-white h-full shadow-xl flex flex-col animate-slide-in-left">
                {/* Header */}
                <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-organic-cream/50">
                    <h2 className="font-serif text-xl font-bold text-organic-green">Menu</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-500">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Main Links */}
                    <div className="p-4 space-y-2 border-b border-stone-100">
                        <button onClick={() => handleNavigate('/')} className="flex items-center gap-3 w-full p-2 hover:bg-stone-50 rounded-lg text-organic-text">
                            <Home size={20} />
                            <span className="font-medium">Home</span>
                        </button>
                        <button onClick={() => handleNavigate('/about-us')} className="flex items-center gap-3 w-full p-2 hover:bg-stone-50 rounded-lg text-organic-text">
                            <Info size={20} />
                            <span className="font-medium">About Us</span>
                        </button>
                        <button onClick={() => handleNavigate('/privacy-policy')} className="flex items-center gap-3 w-full p-2 hover:bg-stone-50 rounded-lg text-organic-text">
                            <FileText size={20} />
                            <span className="font-medium">Privacy Policy</span>
                        </button>
                        <button onClick={() => handleNavigate('/contact-us')} className="flex items-center gap-3 w-full p-2 hover:bg-stone-50 rounded-lg text-organic-text">
                            <Phone size={20} />
                            <span className="font-medium">Contact Us</span>
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="p-4">
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 px-2">Shop by Category</h3>
                        <div className="space-y-1">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleNavigate(`/category/${category.slug}`)}
                                    className="flex items-center justify-between w-full p-2 hover:bg-stone-50 rounded-lg group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md bg-stone-100 ${category.color} bg-opacity-10`}>
                                            <category.icon size={16} className={category.color} />
                                        </div>
                                        <span className="text-stone-700 font-medium group-hover:text-organic-green transition-colors">
                                            {category.name}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} className="text-stone-300 group-hover:text-organic-green" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer/Version */}
                <div className="p-4 border-t border-stone-100 text-xs text-stone-400 text-center">
                    Version 1.0.0
                </div>
            </div>
        </div>
    );
};
