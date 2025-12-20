import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, CheckCircle, CreditCard, Banknote, Wallet } from 'lucide-react';
import type { RootState, AppDispatch } from '../features/store';
import { loginSuccess } from '../features/auth/authSlice';
import client from '../api/client';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { items, totalAmount, discountAmount, couponCode } = useSelector((state: RootState) => state.cart);
    const { zipCode, city, deliveryTimeHrs } = useSelector((state: RootState) => state.delivery);

    // Form State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [address, setAddress] = useState({ name: '', street: '' });
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'WALLET'>('COD');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Address State
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Fetch Addresses
    useEffect(() => {
        if (isAuthenticated) {
            client.get('addresses/')
                .then(res => {
                    const addrs = res.data.data || res.data;
                    setSavedAddresses(addrs);
                    if (addrs.length > 0) {
                        // Auto-select default or first
                        const def = addrs.find((a: any) => a.is_default) || addrs[0];
                        setAddress({ name: def.name, street: def.street });
                    } else {
                        setShowAddressForm(true);
                    }
                })
                .catch(err => console.log('Address fetch failed', err));
        }
    }, [isAuthenticated]);

    // Business Logic
    const deliveryFee = totalAmount > 200 ? 0 : 25;
    const handlingFee = 5;
    const grandTotal = totalAmount + deliveryFee + handlingFee - (discountAmount || 0);

    // --- Auth Handlers ---
    const handleSendOtp = async () => {
        if (phoneNumber.length !== 10) {
            toast.error('Enter valid 10-digit number');
            return;
        }
        try {
            await client.post('auth/otp/send/', { phone_number: phoneNumber });
            setShowOtpInput(true);
            toast.success('OTP Sent!');
        } catch (err) {
            toast.error('Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await client.post('auth/otp/verify/', { phone_number: phoneNumber, otp });
            // Backend returns: { success, data: { message, token, user: { id, phone_number, ... } } }
            if (response.data.success) {
                const innerData = response.data.data;
                const userData = innerData.user || {};
                dispatch(loginSuccess({
                    user: {
                        id: userData.id || '1',
                        phone_number: userData.phone_number || phoneNumber,
                        first_name: userData.first_name || '',
                        last_name: userData.last_name || '',
                        email: userData.email || '',
                        is_phone_verified: userData.is_phone_verified ?? true,
                        wallet_balance: userData.wallet_balance ?? 0
                    },
                    token: innerData.token
                }));
                toast.success('Logged In!');
            } else {
                toast.error(response.data.user_msg || 'Invalid OTP');
            }
        } catch (err) {
            toast.error('Verification Failed');
        }
    };

    // --- Order Handler ---
    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        try {
            const payload = {
                total_price: grandTotal,
                payment_method: paymentMethod,
                delivery_name: address.name,
                delivery_street: address.street,
                delivery_city: city || 'Lucknow',
                delivery_zip_code: zipCode || '226001',
                coupon_code: couponCode,
                items: items.map(i => ({
                    product_id: i.product.id,
                    quantity: i.quantity,
                    price: i.product.price // Fixed: used base_price which doesn't exist on Product interface
                }))
            };

            const response = await client.post('orders/place/', payload);

            if (response.data.success) {
                toast.success('Order Placed Successfully!');
                navigate('/order-success', { state: { orderId: response.data.data?.order_id || 'ORD-NEW' } });
            } else if (response.data.action_required === 'VERIFY_OTP') {
                toast('Please verify phone for COD');
            }
        } catch (err: any) {
            if (err.response?.status === 403) {
                toast.error('Verification Required');
            } else {
                toast.error('Order Failed');
            }
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (items.length === 0) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-28 max-w-3xl mx-auto transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3 border-b dark:border-gray-700">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
                </button>
                <h1 className="font-bold text-lg text-gray-800 dark:text-white">Checkout</h1>
            </header>

            <main className="p-4 space-y-6">

                {/* Step 1: Account */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${isAuthenticated ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 dark:text-white">Account</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {isAuthenticated ? `Logged in as ${user?.phone_number}` : 'Login to place order'}
                            </p>
                        </div>
                    </div>

                    {!isAuthenticated && (
                        <div className="space-y-3">
                            {!showOtpInput ? (
                                <div className="flex gap-2">
                                    <span className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600">+91</span>
                                    <input
                                        type="tel"
                                        maxLength={10}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Mobile Number"
                                        className="flex-1 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={handleSendOtp}
                                        className="bg-green-600 text-white px-4 rounded-lg font-bold text-sm hover:bg-green-700"
                                    >
                                        Next
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 animate-fade-in">
                                    <p className="text-xs text-green-600 dark:text-green-400">OTP Sent to {phoneNumber}</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter OTP"
                                            className="flex-1 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-center tracking-widest font-bold text-gray-900 dark:text-white"
                                        />
                                        <button
                                            onClick={handleVerifyOtp}
                                            className="bg-green-600 text-white px-4 rounded-lg font-bold text-sm hover:bg-green-700"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Step 2: Address */}
                {isAuthenticated && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-fade-in border dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                    <MapPin size={20} />
                                </div>
                                <h2 className="font-bold text-gray-800 dark:text-white">Delivery Address</h2>
                            </div>
                            {savedAddresses.length > 0 && !showAddressForm && (
                                <button onClick={() => { setShowAddressForm(true); setAddress({ name: '', street: '' }); }} className="text-green-600 dark:text-green-400 text-xs font-bold uppercase">
                                    + Add New
                                </button>
                            )}
                        </div>

                        {/* Saved Addresses List */}
                        {!showAddressForm && savedAddresses.length > 0 && (
                            <div className="space-y-3 mb-4">
                                {savedAddresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        onClick={() => setAddress({ name: addr.name, street: addr.street })}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${address.street === addr.street
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                    {addr.type} <span className="text-gray-400 dark:text-gray-500 font-normal">| {addr.name}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{addr.street}</p>
                                            </div>
                                            {address.street === addr.street && <CheckCircle size={16} className="text-green-600 dark:text-green-400" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Address Form (or if no addresses) */}
                        {(showAddressForm || savedAddresses.length === 0) && (
                            <div className="space-y-3 relative">
                                {savedAddresses.length > 0 && (
                                    <button onClick={() => setShowAddressForm(false)} className="text-xs text-gray-400 absolute right-0 -top-8 underline">
                                        Cancel
                                    </button>
                                )}
                                <input
                                    type="text"
                                    placeholder="Receiver's Name"
                                    value={address.name}
                                    onChange={e => setAddress({ ...address, name: e.target.value })}
                                    className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                />
                                <textarea
                                    placeholder="Street Address / Flat No"
                                    value={address.street}
                                    onChange={e => setAddress({ ...address, street: e.target.value })}
                                    className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-sm resize-none h-20 text-gray-900 dark:text-white"
                                />
                            </div>
                        )}

                        {/* Shared Location Info */}
                        <div className="flex gap-3 mt-3">
                            <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-300">
                                {city || 'Lucknow'}
                            </div>
                            <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-300">
                                {zipCode || '226001'}
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs p-3 rounded-lg flex items-center gap-2 mt-3 border border-blue-100 dark:border-blue-900/30">
                            <Truck size={14} />
                            Delivery in {deliveryTimeHrs || 2} hours
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {isAuthenticated && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-fade-in border dark:border-gray-700">
                        <h2 className="font-bold text-gray-800 dark:text-white mb-4">Payment Method</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => setPaymentMethod('COD')}
                                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors ${paymentMethod === 'COD' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                            >
                                <Banknote size={20} className="text-green-700 dark:text-green-400" />
                                <div className="text-left flex-1">
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Pay cash to delivery partner</p>
                                </div>
                                {paymentMethod === 'COD' && <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-500" />}
                            </button>

                            <button
                                onClick={() => setPaymentMethod('WALLET')}
                                disabled={!user?.wallet_balance || user.wallet_balance < grandTotal}
                                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors ${paymentMethod === 'WALLET' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'} ${(!user?.wallet_balance || user.wallet_balance < grandTotal) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Wallet size={20} className="text-purple-600 dark:text-purple-400" />
                                <div className="text-left flex-1">
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">Blinkit Wallet</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Balance: ₹{user?.wallet_balance || 0}</p>
                                    {user?.wallet_balance !== undefined && user.wallet_balance < grandTotal && (
                                        <p className="text-xs text-red-500 dark:text-red-400">Insufficient Balance</p>
                                    )}
                                </div>
                                {paymentMethod === 'WALLET' && <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-500" />}
                            </button>

                            <button
                                disabled
                                className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed"
                            >
                                <CreditCard size={20} className="text-gray-500 dark:text-gray-400" />
                                <div className="text-left flex-1">
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">UPI / Cards</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Temporarily Unavailable</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Bill Summary (Compact) */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Total Amount to Pay: <span className="font-bold text-gray-900 dark:text-white text-sm">₹{grandTotal.toFixed(0)}</span>
                </div>

            </main>

            {/* Bottom Bar */}
            {isAuthenticated && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 max-w-3xl mx-auto border-t dark:border-gray-700">
                    <button
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder || !address.name || !address.street}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 dark:shadow-none disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isPlacingOrder ? 'Processing...' : `Place Order • ₹${grandTotal.toFixed(0)}`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;
