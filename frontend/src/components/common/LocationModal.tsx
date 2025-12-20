import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { useDelivery } from '../../hooks/useDelivery';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LocationModal = ({ isOpen, onClose }: LocationModalProps) => {
    const [zip, setZip] = useState(localStorage.getItem('user_zip') || '');
    const { checkZip, isLoading, error, isServiceable, deliveryTimeHrs } = useDelivery();

    useEffect(() => {
        const savedZip = localStorage.getItem('user_zip');
        if (savedZip && isOpen) {
            checkZip(savedZip);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (zip.length === 6) {
            localStorage.setItem('user_zip', zip);
            checkZip(zip);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Select Location</h2>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }}><X className="w-6 h-6 text-gray-500" /></button>
                </div>

                <div className="p-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="Enter 6-digit Zip Code"
                            maxLength={6}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-lg text-center tracking-widest focus:ring-2 focus:ring-green-600 outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isLoading || zip.length !== 6}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 text-lg shadow-md transition-all active:scale-95"
                        >
                            {isLoading ? 'Checking Availability...' : 'Check Zip Code'}
                        </button>
                    </form>

                    <div className="mt-4 flex flex-col gap-2">
                        <button
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition(
                                        () => {
                                            // Mock Success for Demo (Real Reverse Geocoding is complex without API Key)
                                            // We assume if they are close, it works. 
                                            setZip('226001'); // Auto-fill Lucknow Zip
                                            checkZip('226001'); // Trigger Check
                                        },
                                        (error) => alert('Location access denied or unavailable.')
                                    );
                                } else {
                                    alert('Geolocation is not supported by your browser.');
                                }
                            }}
                            className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <MapPin size={18} /> Detect My Location
                        </button>
                    </div>

                    <div className="mt-4">
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {error}
                            </div>
                        )}
                        {isServiceable === true && (
                            <div className="text-green-700 text-sm bg-green-50 p-3 rounded-xl flex flex-col gap-1 border border-green-100 animate-in fade-in zoom-in-95">
                                <span className="font-bold flex items-center gap-1">
                                    ✅ Delivery Available
                                </span>
                                <span>Expect delivery in {deliveryTimeHrs} hours.</span>
                                <div className="mt-2 text-center">
                                    <button onClick={onClose} className="text-green-800 font-bold text-xs underline bg-white/50 px-2 py-1 rounded">
                                        Start Shopping
                                    </button>
                                </div>
                            </div>
                        )}

                        {isServiceable === false && (
                            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100 animate-in fade-in zoom-in-95">
                                <div className="text-4xl mb-2">😔</div>
                                <h3 className="font-bold text-orange-800 mb-1">Sorry, we don't deliver here yet.</h3>
                                <p className="text-xs text-orange-600 mb-3">
                                    We are currently expanding our network. Please try a different zip code.
                                </p>
                                <button
                                    onClick={() => setZip('')}
                                    className="text-orange-700 font-bold text-xs underline"
                                >
                                    Try Another Location
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
