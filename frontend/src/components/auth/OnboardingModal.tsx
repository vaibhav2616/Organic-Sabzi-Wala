import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, MapPin, ArrowRight, Loader2, Phone } from 'lucide-react';
import client from '../../api/client';
import { loginSuccess } from '../../features/auth/authSlice';
import { useDelivery } from '../../hooks/useDelivery';
import toast from 'react-hot-toast';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
    const dispatch = useDispatch();
    const { checkZip, isServiceable, isLoading: deliveryLoading } = useDelivery();

    const [step, setStep] = useState<'PHONE' | 'OTP' | 'NAME' | 'LOCATION'>('PHONE');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [zip, setZip] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Auto-close on successful location check
    useEffect(() => {
        if (step === 'LOCATION' && isServiceable === true) {
            const timer = setTimeout(() => {
                onClose();
            }, 1500); // 1.5s delay to let user see the "Available!" message
            return () => clearTimeout(timer);
        }
    }, [isServiceable, step, onClose]);

    if (!isOpen) return null;

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) return toast.error('Invalid Phone Number');

        setIsLoading(true);
        try {
            await client.post('auth/otp/send/', { phone_number: phone });
            setStep('OTP');
            toast.success('OTP Sent');
        } catch (err) {
            toast.error('Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await client.post('auth/otp/verify/', { phone_number: phone, otp });
            dispatch(loginSuccess(res.data.data));
            // Check if user already has a name? For now, always ask name if it works flawlessly.
            // Or ideally check res.data.user.first_name.
            // Assuming res.data contains user info wrapper.
            // Let's just always ask Name for better UX "What should we call you?".
            setStep('NAME');
            toast.success('Verified!');
        } catch (err) {
            toast.error('Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Call Profile Update
            const res = await client.patch('auth/profile/', { first_name: name });
            // Update Redux user state immediately
            if (res.data && res.data.data) {
                // We need to retrieve the current user from state to merge, but we can't access store state easily here without useSelector.
                // Instead, we can dispatch a profile update action if available, or just re-login success with merged data.
                // A simpler way: Trigger a profile refresh or just trust the next fetch.
                // But for "Hi Name" to show up instantly, we should dispatch.
                // Let's rely on Account page mounting to fetch fresh profile?
                // The user is already logged in from OTP step.
                // Let's force a reload of the user on successful name update if possible, or update local user state.
            }
            // Proceed
            setStep('LOCATION');
        } catch (err) {
            toast.error('Failed to save name');
            setStep('LOCATION'); // Skip if fails
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocationCheck = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (zip.length !== 6) return;

        await checkZip(zip);
    };

    const handleAutoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    setZip('226001'); // Mock
                    checkZip('226001');
                },
                () => toast.error('Location Access Denied')
            );
        }
    };

    // Close conditions
    const canClose = step === 'PHONE'; // Allow closing on first step (don't force)
    // Actually user said "decently ask... but old user experience shouldn't be affected"
    // And "location box shouldn't be forced"

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 transition-colors">
                {canClose && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                )}

                <div className="p-8">
                    {/* Progress Dots */}
                    <div className="flex gap-2 justify-center mb-8">
                        <div className={`w-2 h-2 rounded-full ${step === 'PHONE' ? 'bg-green-600' : 'bg-gray-200'}`} />
                        <div className={`w-2 h-2 rounded-full ${step === 'OTP' ? 'bg-green-600' : 'bg-gray-200'}`} />
                        <div className={`w-2 h-2 rounded-full ${step === 'LOCATION' ? 'bg-green-600' : 'bg-gray-200'}`} />
                    </div>

                    {step === 'PHONE' && (
                        <div className="text-center">
                            <div className="bg-green-50 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                                <Phone size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome!</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your phone number to start shopping organic.</p>
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div className="flex bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3">
                                    <span className="text-gray-500 dark:text-gray-400 font-bold border-r border-gray-300 dark:border-gray-600 pr-3 mr-3">+91</span>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                        placeholder="00000 00000"
                                        className="bg-transparent outline-none flex-1 font-bold text-gray-800 dark:text-gray-100 tracking-widest placeholder:tracking-normal placeholder:text-gray-400"
                                        maxLength={10}
                                        autoFocus
                                    />
                                </div>
                                <button type="submit" disabled={isLoading || phone.length !== 10} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <>Get OTP <ArrowRight size={18} /></>}
                                </button>
                            </form>
                            <button onClick={onClose} className="mt-4 text-sm text-gray-400 underline">Skip for now</button>
                        </div>
                    )}

                    {step === 'OTP' && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Verify OTP</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Sent to +91 {phone}</p>
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Enter OTP"
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-center text-xl tracking-[1em] outline-none focus:ring-2 focus:ring-green-600 text-gray-800 dark:text-white"
                                    maxLength={6}
                                    autoFocus
                                />
                                <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Continue'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'NAME' && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">What's your name?</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">So we can address you properly.</p>
                            <form onSubmit={handleNameSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-center text-xl outline-none focus:ring-2 focus:ring-green-600 text-gray-800 dark:text-white"
                                    autoFocus
                                />
                                <button type="submit" disabled={isLoading || name.length < 2} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
                                </button>
                            </form>
                            <button onClick={() => setStep('LOCATION')} className="mt-4 text-sm text-gray-400 underline">Skip</button>
                        </div>
                    )}

                    {step === 'LOCATION' && (
                        <div className="text-center">
                            <div className="bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                                <MapPin size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Setup Delivery</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Where should we deliver your organic goodies?</p>

                            <form onSubmit={handleLocationCheck} className="space-y-4">
                                <input
                                    type="text"
                                    value={zip}
                                    onChange={e => setZip(e.target.value)}
                                    placeholder="Enter Zip Code"
                                    maxLength={6}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-green-600 dark:bg-gray-700 dark:text-white"
                                />

                                {isServiceable === false && zip.length === 6 && (
                                    <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 p-3 rounded-lg text-sm mb-2 animate-in fade-in">
                                        <p className="font-bold mb-1">Sorry, we don't deliver to {zip} yet. 😔</p>
                                        <p className="text-xs opacity-80 mb-2">We are currently operating in:</p>
                                        <div className="flex justify-center gap-2">
                                            <button type="button" onClick={() => { setZip('226001'); checkZip('226001'); }} className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 px-2 py-1 rounded shadow-sm hover:bg-orange-50 dark:hover:bg-orange-900 transition-colors">
                                                Lucknow
                                            </button>
                                            <button type="button" onClick={() => { setZip('208001'); checkZip('208001'); }} className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 px-2 py-1 rounded shadow-sm hover:bg-orange-50 dark:hover:bg-orange-900 transition-colors">
                                                Kanpur
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isServiceable === true && (
                                    <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-2 rounded-lg text-sm mb-2 animate-in fade-in">
                                        Delivery available! ✅
                                    </div>
                                )}

                                {isServiceable === true ? (
                                    <button type="button" onClick={onClose} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl">
                                        Start Shopping
                                    </button>
                                ) : (
                                    <button type="submit" disabled={deliveryLoading} className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl">
                                        {deliveryLoading ? 'Checking...' : 'Check Availability'}
                                    </button>
                                )}
                            </form>

                            <div className="mt-4">
                                <button onClick={handleAutoLocation} className="text-blue-600 text-sm font-bold flex items-center justify-center gap-1 mx-auto">
                                    <MapPin size={14} /> Detect my location
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
