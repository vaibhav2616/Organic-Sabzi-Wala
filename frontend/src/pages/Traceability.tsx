import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Truck, CheckCircle, Quote } from 'lucide-react';
import { BottomNav } from '../components/layout/BottomNav';

const TraceabilityPage = () => {
    const navigate = useNavigate();

    // Mock Timeline
    const timeline = [
        { date: "14 Feb", time: "06:00 AM", title: "Harvested", desc: "Hand-picked at Sharma Organic Farm", icon: Calendar, active: true },
        { date: "14 Feb", time: "09:00 AM", title: "Quality Check", desc: "Passed pesticide residue test", icon: CheckCircle, active: true },
        { date: "14 Feb", time: "02:00 PM", title: "Dispatched", desc: "On the way to distribution center", icon: Truck, active: true },
        { date: "15 Feb", time: "Expected", title: "Delivery", desc: "Arriving at your doorstep", icon: MapPin, active: false },
    ];

    return (
        <div className="min-h-screen bg-organic-cream dark:bg-gray-900 pb-24 font-sans transition-colors">
            {/* Header Image with Quote Overlay */}
            <div className="relative h-[40vh] w-full overflow-hidden rounded-b-[3rem] shadow-xl">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?q=80&w=2940&auto=format&fit=crop"
                        alt="Farmer"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                </div>

                {/* Navbar Removed - Using Global Header */}

                {/* Quote Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 text-white">
                    <Quote className="w-8 h-8 text-organic-green mb-4 opacity-80" />
                    <h2 className="text-2xl font-serif font-bold leading-relaxed mb-4">
                        "I treat my soil like my children. Healthy soil means healthy food for your family."
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Farmer" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Ramesh Sharma</p>
                            <p className="text-xs text-stone-300">Organic Farmer since 2012</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Preview */}
            <div className="px-6 -mt-8 relative z-20">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-stone-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2.5 rounded-full text-organic-green">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-stone-500 dark:text-gray-400 font-bold uppercase">Farm Location</p>
                            <p className="font-bold text-organic-text dark:text-gray-200 text-sm">Barabanki, Uttar Pradesh</p>
                        </div>
                    </div>
                    <div className="h-12 w-20 bg-stone-100 rounded-lg overflow-hidden relative">
                        {/* Static Map Placeholder */}
                        <div className="absolute inset-0 bg-green-200 opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin size={16} className="text-organic-green fill-current" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="px-8 py-8">
                <h3 className="font-bold text-lg text-organic-text dark:text-gray-100 mb-6 font-serif">Farm to Home Journey</h3>
                <div className="relative border-l-2 border-dashed border-stone-300 dark:border-gray-700 ml-3 space-y-8 pb-2">
                    {timeline.map((item, idx) => (
                        <div key={idx} className="relative pl-8">
                            {/* Dot */}
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-colors ${item.active ? 'bg-organic-green' : 'bg-stone-300'}`}></div>

                            <div className="flex flex-col animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                <span className="text-[10px] font-bold text-stone-400 dark:text-gray-500 mb-1 uppercase tracking-wider">{item.date} • {item.time}</span>
                                <h4 className={`font-bold text-base ${item.active ? 'text-organic-text dark:text-gray-200' : 'text-stone-400 dark:text-gray-600'}`}>{item.title}</h4>
                                <p className="text-sm text-stone-500 dark:text-gray-400 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default TraceabilityPage;
