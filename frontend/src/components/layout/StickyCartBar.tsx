import { useSelector } from 'react-redux';
import { ChevronRight } from 'lucide-react';
import type { RootState } from '../../features/store';
import { Link } from 'react-router-dom';

export const StickyCartBar = () => {
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);

    if (items.length === 0) return null;

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-up">
            <Link to="/cart" className="bg-green-600 text-white p-3 rounded-xl shadow-lg flex justify-between items-center bg-opacity-95 backdrop-blur-sm hover:bg-green-700 transition-colors">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-green-100">{itemCount} items</span>
                    <span className="font-bold text-sm">₹{totalAmount.toFixed(0)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide">
                    View Cart <ChevronRight size={16} />
                </div>
            </Link>
        </div>
    );
};
