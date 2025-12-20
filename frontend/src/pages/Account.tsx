import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, MapPin, Moon, Sun, Wallet, Package, Plus, Trash2, User as UserIcon, RefreshCw, Heart, ChevronDown, Pencil } from 'lucide-react';
import type { RootState, AppDispatch } from '../features/store';
import { logout } from '../features/auth/authSlice';
import { fetchSubscriptions, toggleSubscription } from '../features/subscriptions/subscriptionsSlice';
import { type Product } from '../features/products/productsSlice';
import client from '../api/client';
import toast from 'react-hot-toast';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';


interface Address {
    id: number;
    name: string;
    street: string;
    city: string;
    zip_code: string;
    type: 'HOME' | 'WORK' | 'OTHER';
    is_default: boolean;
}

const WishlistSection = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const [showAll, setShowAll] = useState(false);

    // items to show initially
    const INITIAL_COUNT = 4;
    const displayedItems = showAll ? wishlistItems : wishlistItems.slice(0, INITIAL_COUNT);
    const hasMore = wishlistItems.length > INITIAL_COUNT;

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    // if (wishlistItems.length === 0) return null; // Removed to show empty state

    return (
        <div className="bg-white dark:bg-gray-800 px-4 py-6 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Heart size={18} className="text-red-500 fill-red-500" /> My Wishlist
                </h2>
                <span className="text-xs text-gray-500">{wishlistItems.length} items</span>
            </div>
            {wishlistItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                    <p>Your wishlist is empty.</p>
                    <p className="text-xs">Start saving your favorite items!</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {displayedItems.map((item: { id: number, product_details: Product }) => {
                            const product = item.product_details || {};
                            if (!product.id) return null;

                            return (
                                <Link
                                    key={item.id}
                                    to={`/product/${product.slug || product.id}`}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center p-2 shadow-sm border border-gray-100 dark:border-gray-600 group-hover:scale-105 transition-transform relative overflow-hidden">
                                        {product.images?.[0]?.src ? (
                                            <img src={product.images[0].src} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-[8px] text-gray-400">IMG</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight max-w-[80px]">
                                        {product.name}
                                    </p>
                                </Link>
                            );
                        })}
                        {/* View All Arrow Circle if hidden */}
                        {!showAll && hasMore && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                    <ChevronDown size={24} className="text-gray-500 dark:text-gray-400" />
                                </div>
                                <p className="text-xs text-center font-medium text-gray-500 dark:text-gray-400">View All</p>
                            </button>
                        )}
                    </div>
                    {/* Collapse Button */}
                    {
                        showAll && hasMore && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setShowAll(false)}
                                    className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 hover:text-green-600 transition-colors"
                                >
                                    Show Less <ChevronDown size={14} className="rotate-180" />
                                </button>
                            </div>
                        )
                    }
                </>
            )}
        </div >
    );
};

const SubscriptionList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: subscriptions, isLoading } = useSelector((state: RootState) => state.subscriptions);

    useEffect(() => {
        dispatch(fetchSubscriptions());
    }, [dispatch]);

    const handleToggle = (id: string, currentStatus: string) => {
        const action = currentStatus === 'ACTIVE' ? 'pause' : 'resume';
        dispatch(toggleSubscription({ id, action }));
        toast.success(`Subscription ${action}d`);
    };

    const handleCancel = (id: string) => {
        if (confirm('Are you sure you want to cancel this subscription?')) {
            dispatch(toggleSubscription({ id, action: 'cancel' }));
            toast.success('Subscription Cancelled');
        }
    };

    if (isLoading && subscriptions.length === 0) return <div className="text-sm text-gray-400 py-4">Loading subscriptions...</div>;
    if (subscriptions.length === 0) return <div className="text-sm text-gray-400 py-4">No active subscriptions.</div>;

    return (
        <div className="space-y-4">
            {subscriptions.map(sub => (
                <div key={sub.id} className="border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-700/30">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{sub.product_details?.name || 'Unknown Product'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{sub.frequency} • Next: {sub.next_delivery_date}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            sub.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {sub.status === 'CANCELLED' ? 'Cancelled' : sub.status}
                        </span>
                    </div>
                    {sub.status !== 'CANCELLED' && (
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleToggle(sub.id, sub.status)}
                                className="flex-1 text-xs py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 transition-colors"
                            >
                                {sub.status === 'ACTIVE' ? 'Pause Pack' : 'Resume Pack'}
                            </button>
                            <button
                                onClick={() => handleCancel(sub.id)}
                                className="px-3 text-xs py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

import { OnboardingModal } from '../components/auth/OnboardingModal';

// ... (imports)

const Account = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // States
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false); // NEW STATE
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newAddress, setNewAddress] = useState({ name: '', street: '', city: 'Lucknow', zip_code: '', type: 'HOME' });

    useEffect(() => {
        if (isAuthenticated) fetchAddresses();
    }, [isAuthenticated]);

    const fetchAddresses = async () => {
        try {
            const res = await client.get('addresses/');
            setAddresses(res.data.data || res.data); // Handle wrapper
        } catch (err) {
            console.error(err);
        }
    };

    // ... Handlers ... 
    const handleSaveAddress = async () => {
        try {
            if (editingId) {
                // UPDATE user's existing address
                await client.put(`addresses/${editingId}/`, newAddress);
                toast.success('Address Updated');
            } else {
                // CREATE new
                await client.post('addresses/', newAddress);
                toast.success('Address Added');
            }
            // Reset
            setShowAddressForm(false);
            setEditingId(null);
            fetchAddresses();
            setNewAddress({ name: '', street: '', city: 'Lucknow', zip_code: '', type: 'HOME' });
        } catch (err) {
            toast.error(editingId ? 'Failed to update' : 'Failed to add address');
        }
    };

    const handleEditAddress = (addr: Address) => {
        setEditingId(addr.id);
        setNewAddress({
            name: addr.name,
            street: addr.street,
            city: addr.city,
            zip_code: addr.zip_code,
            type: addr.type
        });
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (id: number) => {
        if (!confirm('Delete this address?')) return;
        try {
            await client.delete(`addresses/${id}/`);
            toast.success('Address Deleted');
            fetchAddresses();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
        if (newMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        toast.success('Logged Out');
    };

    useEffect(() => {
        // Theme Init
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Guest View
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center transition-colors">
                <OnboardingModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
                {/* Reusing showAddressForm state is messy, let's make a dedicated state or ensure we import modal properly */}

                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <UserIcon size={40} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">My Account</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Log in to track orders and manage your profile.</p>
                <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 transition"
                >
                    Login / Sign Up
                </button>
            </div>
        );
    }

    if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

    // Use name from default address if available, else first address, else user name/phone
    const defaultAddress = addresses.find(a => a.is_default) || addresses[0];
    const displayName = defaultAddress?.name || user.first_name || user.phone_number || 'Valued Customer';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 transition-colors duration-300">
            <OnboardingModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            {/* ... Header & Actions ... */}
            <div className="bg-white dark:bg-gray-800 p-6 pt-10 shadow-sm mb-4">
                {/* ... Header Content ... */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Hi, {displayName}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone_number}</p>

                {/* Wallet Card */}
                <div className="mt-6 bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-4 text-white shadow-lg flex justify-between items-center">
                    <div>
                        <p className="text-xs opacity-80 mb-1">My Wallet Balance</p>
                        <p className="text-2xl font-bold">₹{user.wallet_balance || 0}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Wallet size={24} />
                    </div>
                </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3 px-4 mb-6">
                <button onClick={() => navigate('/orders')} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Package className="text-blue-500 mb-2" size={24} />
                    <p className="font-bold text-gray-800 dark:text-gray-200">Your Orders</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Track & Re-order</p>
                </button>
                <button onClick={toggleTheme} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {darkMode ? <Sun className="text-orange-500 mb-2" size={24} /> : <Moon className="text-purple-500 mb-2" size={24} />}
                    <p className="font-bold text-gray-800 dark:text-gray-200">{darkMode ? 'Light Mode' : 'Dark Mode'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Adjust Appearance</p>
                </button>
            </div>

            {/* Wishlist Section */}
            <WishlistSection />

            {/* My Subscriptions */}
            <div className="bg-white dark:bg-gray-800 px-4 py-6 mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <RefreshCw size={18} className="text-green-600" /> My Subscriptions
                    </h2>
                </div>
                <SubscriptionList />
            </div>

            {/* ... Addresses & Logout ... */}
            <div className="bg-white dark:bg-gray-800 px-4 py-6 mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-800 dark:text-gray-white">Saved Addresses</h2>
                    <button
                        onClick={() => {
                            setShowAddressForm(!showAddressForm);
                            setEditingId(null);
                            setNewAddress({ name: '', street: '', city: 'Lucknow', zip_code: '', type: 'HOME' });
                        }}
                        className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1"
                    >
                        <Plus size={16} /> Add New
                    </button>
                </div>

                {showAddressForm && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4 animate-in fade-in slide-in-from-top-4">
                        <div className="space-y-3">
                            <input
                                placeholder="Name (e.g. Home)"
                                value={newAddress.name}
                                onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                className="w-full p-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <textarea
                                placeholder="Street Address"
                                value={newAddress.street}
                                onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                className="w-full p-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <div className="flex gap-2">
                                <input
                                    placeholder="Zip Code"
                                    value={newAddress.zip_code}
                                    onChange={e => setNewAddress({ ...newAddress, zip_code: e.target.value })}
                                    className="w-full p-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
                                />
                                <select
                                    value={newAddress.type}
                                    onChange={e => setNewAddress({ ...newAddress, type: e.target.value as any })}
                                    className="p-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                >
                                    <option value="HOME">Home</option>
                                    <option value="WORK">Work</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <button onClick={handleSaveAddress} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold">
                                {editingId ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {addresses.map(addr => (
                        <div key={addr.id} className="flex justify-between items-start border-b dark:border-gray-700 pb-3 last:border-0">
                            <div className="flex gap-3">
                                <div className="mt-1 text-gray-400">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{addr.type} - {addr.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{addr.street}, {addr.city} - {addr.zip_code}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditAddress(addr)} className="text-blue-400 p-1 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors">
                                    <Pencil size={16} />
                                </button>
                                <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-400 p-1 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {addresses.length === 0 && !showAddressForm && (
                        <p className="text-center text-gray-400 text-sm py-4">No saved addresses.</p>
                    )}
                </div>
            </div>

            {/* Logout */}
            <div className="px-4">
                <button onClick={handleLogout} className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={18} /> Log Out
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">Version 1.0.0 • Made with ❤️</p>
            </div>
        </div>
    );
};

export default Account;
