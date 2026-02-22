import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-[65vh] overflow-hidden rounded-b-[2.5rem] shadow-xl">
            {/* Background Image - Farm Scene */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2938&auto=format&fit=crop"
                    alt="Organic Farm"
                    className="w-full h-full object-cover brightness-[0.85]"
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-12 text-white">

                {/* 100% Certified Organic Text */}
                <h3 className="text-3xl font-bold font-sans uppercase tracking-tight mb-2 drop-shadow-lg text-center leading-none">
                    100% Certified<br />Organic
                </h3>

                {/* Subtext */}
                <div className="flex flex-col items-center gap-1 mb-8 opacity-90 text-sm font-medium tracking-wide">
                    <p>Farm to Home in 24 Hours</p>
                    <p className="flex items-center gap-2 text-organic-green-100">
                        <span>• Lab Tested</span>
                        <span>• Fully Traceable</span>
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                    <button
                        onClick={() => navigate('/categories')}
                        className="w-full bg-[#1a472a] text-white px-6 py-4 rounded-full font-bold text-sm hover:bg-[#143620] transition-all active:scale-95 shadow-lg flex items-center justify-between group border border-white/10"
                    >
                        <span className="pl-2">Shop Fresh</span>
                        <div className="bg-white/10 p-1 rounded-full">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/lab-reports')}
                        className="w-full bg-white/95 text-[#1a472a] px-6 py-4 rounded-full font-bold text-sm hover:bg-white transition-all active:scale-95 shadow-lg flex items-center justify-between"
                    >
                        <span className="pl-2">View Lab Reports</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
