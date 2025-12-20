import { ProductGrid } from '../components/common/ProductGrid';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { SearchInput } from '../components/common/SearchInput';
import { ArrowRight, Microscope, Sprout, Truck } from 'lucide-react';

const HeroSection = () => (
    <div className="relative mx-4 mt-6 rounded-3xl overflow-hidden shadow-2xl h-[22rem] bg-stone-900 group">
        {/* Background Image - Placeholder for now */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595855709940-1e2c925e0cfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-8">
            <div className="inline-flex items-center gap-2 bg-organic-green/90 backdrop-blur-sm self-start px-3 py-1 rounded-full mb-3 shadow-lg">
                <LeafIcon className="w-3 h-3 text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">100% Certified Organic</span>
            </div>

            <h2 className="text-3xl font-serif font-bold text-white leading-tight mb-2 drop-shadow-md">
                Farm to Home <br /> in <span className="text-accent">24 Hours</span>
            </h2>

            <p className="text-stone-200 text-sm mb-6 max-w-[80%] drop-shadow">
                Lab tested. Fully traceable. Straight from Sharma Organic Farm.
            </p>

            <div className="flex gap-3">
                <button
                    onClick={() => window.location.href = '/categories'}
                    className="bg-organic-green text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-green-800 transition-colors flex items-center gap-2"
                >
                    Shop Fresh <ArrowRight className="w-4 h-4" />
                </button>
                <button
                    onClick={() => window.location.href = '/lab-reports'}
                    className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-5 py-3 rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
                >
                    View Reports
                </button>
            </div>
        </div>
    </div>
);

const FeaturesRow = () => (
    <div className="flex justify-between px-6 py-6 mt-2">
        {[
            { icon: Sprout, label: "Direct From\nFarmers" },
            { icon: Microscope, label: "Lab Tested\nSafe" },
            { icon: Truck, label: "100%\nTraceable" }
        ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-2 group">
                <div className="w-12 h-12 bg-organic-light rounded-full flex items-center justify-center text-organic-green group-hover:bg-organic-green group-hover:text-white transition-colors duration-300 shadow-sm">
                    <feature.icon className="w-6 h-6 stroke-1.5" />
                </div>
                <span className="text-[10px] font-medium text-organic-text/70 uppercase tracking-wide leading-tight whitespace-pre-line">
                    {feature.label}
                </span>
            </div>
        ))}
    </div>
);

// Small leaf icon helper
const LeafIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M7 17a5 5 0 0 1 5 5 5 5 0 0 1-5 5A5 5 0 0 1 2 22a5 5 0 0 1 5-5m12-15a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5a5 5 0 0 1 5-5m-9 3c-2.67 0-8 1.34-8 4v8c0 2.66 5.33 4 8 4s8-1.34 8-4v-8c0-2.66-5.33-4-8-4z" />
        {/* Simple path, actual lucide leaf used elsewhere but this is for solid fill style if needed, 
            actually let's just use lucide Sprout for standard icons */}
    </svg>
);

const Home = () => {
    return (
        <div className="pb-24 bg-organic-cream min-h-screen">
            <SearchInput />
            <HeroSection />
            <FeaturesRow />

            <div className="mt-8 px-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold text-organic-text">Fresh Harvest</h3>
                    <button onClick={() => window.location.href = '/categories'} className="text-xs font-medium text-organic-green hover:underline">View All</button>
                </div>

                <ErrorBoundary>
                    <ProductGrid />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default Home;
