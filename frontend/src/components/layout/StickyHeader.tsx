import { Menu, User, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useDelivery } from '../../hooks/useDelivery'; // Location logic moved to specific flows or menu
// import { LocationModal } from '../common/LocationModal'; // Temporarily disabled or moved

export const StickyHeader = () => {
    const navigate = useNavigate();
    // const { city } = useDelivery(); 
    // const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-organic-cream/90 backdrop-blur-md px-4 py-3 flex justify-between items-center shadow-sm">
            {/* Left: Menu (Placeholder for Sidebar/Location) */}
            <button className="p-2 text-organic-green hover:bg-organic-light rounded-full transition-colors">
                <Menu className="w-6 h-6" />
            </button>

            {/* Center: Brand */}
            <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                <div className="bg-organic-green p-1.5 rounded-full">
                    <Leaf className="w-4 h-4 text-white fill-current" />
                </div>
                <h1 className="text-lg font-outfit font-bold text-organic-text tracking-tight">
                    Organic Sabzi Wala
                </h1>
            </div>

            {/* Right: User */}
            <button
                onClick={() => navigate('/account')}
                className="p-2 text-stone-600 hover:text-organic-green transition-colors"
            >
                <User className="w-6 h-6" />
            </button>

            {/* <LocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
        </header>
    );
};
