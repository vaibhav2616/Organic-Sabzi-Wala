import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 font-sans pb-10">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 sticky top-0 z-10 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full">
                    <ArrowLeft size={24} className="text-stone-600" />
                </button>
                <h1 className="text-xl font-bold text-organic-green font-serif">Privacy Policy</h1>
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h2 className="text-xl font-bold text-organic-dark mb-4 font-serif">Your Privacy Matters</h2>
                    <p className="leading-relaxed text-stone-600">
                        At Organic Sabzi Wala, we respect and value the privacy of every customer who creates an account on our website or mobile application. When you register with us, we collect only the essential information required to process your orders, provide seamless delivery services, and enhance your shopping experience.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h2 className="text-lg font-bold text-organic-dark mb-3 font-serif">Data Collection & Usage</h2>
                    <p className="leading-relaxed text-stone-600 mb-4">
                        Your personal details, including name, contact information, delivery address, and order history, are securely stored using encrypted systems and are accessible only to authorized personnel for operational purposes.
                    </p>
                    <p className="leading-relaxed text-stone-600">
                        We do not sell, rent, or share your account information with third parties for marketing purposes.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h2 className="text-lg font-bold text-organic-dark mb-3 font-serif">Secure Payments</h2>
                    <p className="leading-relaxed text-stone-600">
                        Payment details are processed through secure and certified payment gateways, and we do not store your card or UPI credentials on our servers.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h2 className="text-lg font-bold text-organic-dark mb-3 font-serif">Your Control</h2>
                    <p className="leading-relaxed text-stone-600">
                        You have full control over your account and may update, modify, or request deletion of your information at any time in accordance with applicable laws. Please contact support via WhatsApp or Email to request data deletion.
                    </p>
                </section>

                <div className="text-center text-sm text-stone-500 italic mt-8">
                    "At Organic Sabzi Wala, your data is handled with the highest standards of confidentiality and integrity — because your trust is as important to us as the purity of the food we deliver."
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
