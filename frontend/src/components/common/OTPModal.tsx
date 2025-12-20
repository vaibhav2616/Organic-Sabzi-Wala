import { useState, useRef, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OTPModalProps {
    isOpen: boolean;
    phoneNumber: string;
    onClose: () => void;
    onVerify: (otp: string) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export const OTPModal = ({ isOpen, phoneNumber, onClose, onVerify, isLoading, error }: OTPModalProps) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            inputRefs.current[0]?.focus();
        }
    }, [isOpen]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        onVerify(otp.join(''));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 500 }}
                        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 relative"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">Verify Phone Network</h2>
                        <p className="text-sm text-gray-500 mb-6">Enter the 6-digit code sent to <span className="font-bold text-gray-900">{phoneNumber}</span></p>

                        <div className="flex gap-2 justify-center mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-10 h-12 border border-gray-300 rounded-lg text-center text-xl font-bold focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={isLoading || otp.some(d => !d)}
                            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Verifying...
                                </>
                            ) : (
                                'Verify & Proceed'
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Didn't receive code? <span className="text-green-600 font-bold">Resend in 30s</span>
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
