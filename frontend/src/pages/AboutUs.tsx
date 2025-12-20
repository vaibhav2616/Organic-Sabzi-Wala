import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#Fdfbf7] text-stone-800 font-sans pb-10">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md shadow-sm p-4 sticky top-0 z-10 flex items-center gap-4 border-b border-stone-100">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full">
                    <ArrowLeft size={24} className="text-stone-600" />
                </button>
                <h1 className="text-xl font-bold text-organic-green font-serif">About Us</h1>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Hero Section */}
                <div className="relative h-64 bg-organic-green overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1595855709912-198533c33253?q=80&w=2670&auto=format&fit=crop"
                        alt="Organic Farming"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <h1 className="text-4xl font-serif font-bold text-white mb-2 shadow-sm">Organic Sabzi Wala</h1>
                        <p className="text-white/90 text-lg font-medium max-w-lg">Pure Food. Pure Trust.</p>
                    </div>
                </div>

                <div className="p-6 space-y-8 -mt-6 relative z-10">
                    <section className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-50">
                        <h2 className="text-2xl font-bold text-organic-dark mb-4 font-serif">Our Mission</h2>
                        <p className="leading-relaxed text-stone-600 mb-4">
                            Organic Sabzi Wala was founded with a simple yet powerful belief — that every family deserves access to pure, chemical-free, and responsibly grown food. In a world where food quality is often compromised, we are committed to bringing back authenticity, transparency, and trust to everyday grocery shopping.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
                            <span className="text-3xl">🌱</span>
                            <div>
                                <h3 className="font-bold text-stone-800 mb-2">Authentic Sourcing</h3>
                                <p className="text-sm text-stone-600">
                                    We carefully source fresh organic vegetables, fruits, grains, and daily essentials from trusted farmers who follow natural and sustainable farming practices.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
                            <span className="text-3xl">🛡️</span>
                            <div>
                                <h3 className="font-bold text-stone-800 mb-2">Quality Assurance</h3>
                                <p className="text-sm text-stone-600">
                                    Our focus is not only on freshness but also on nutritional value, hygiene, and safe handling. From farm to doorstep, every step is designed to maintain purity.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
                            <span className="text-3xl">🤝</span>
                            <div>
                                <h3 className="font-bold text-stone-800 mb-2">Community Building</h3>
                                <p className="text-sm text-stone-600">
                                    We aim to build a healthier community by supporting ethical farming and promoting clean eating, making organic living accessible and convenient.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-organic-cream p-8 rounded-3xl text-center border border-organic-green/10">
                        <p className="text-organic-dark italic font-serif text-lg mb-6">
                            "Trust, transparency, and responsibility guide everything we do. Because for us, organic is not a trend — it is a long-term commitment to better health and a better future."
                        </p>
                        <div className="inline-block border-t border-organic-green/20 pt-4 px-8">
                            <h3 className="font-bold text-organic-dark">Vedansh Chaudhary</h3>
                            <p className="text-sm text-organic-green font-medium uppercase tracking-wider">Founder</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
