import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, FileCheck, Download, ChevronRight } from 'lucide-react';
import { BottomNav } from '../components/layout/BottomNav';

const LabReportsPage = () => {
    const navigate = useNavigate();

    const reports = [
        { id: "LR-2024-001", date: "14 Feb 2024", product: "Organic Tomatoes", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200", status: "PASSED", tests: ["Pesticide Residue", "Heavy Metals", "Microbial Contamination"] },
        { id: "LR-2024-002", date: "12 Feb 2024", product: "Spinach", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200", status: "PASSED", tests: ["Nitrate Levels", "Pesticide Residue"] },
        { id: "LR-2024-003", date: "10 Feb 2024", product: "Apples (Kinnaur)", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=200", status: "PASSED", tests: ["Wax Coating", "Chemical Wash"] },
    ];

    return (
        <div className="min-h-screen bg-organic-cream pb-24 font-sans">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-organic-cream/95 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-organic-text" />
                </button>
                <h1 className="text-lg font-serif font-bold text-organic-text">Lab Reports</h1>
                <div className="w-10"></div>
            </div>

            <div className="px-6 py-6">
                {/* Hero Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 text-center mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-organic-green to-emerald-400"></div>
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <FlaskConical className="w-10 h-10 text-organic-green" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-organic-text mb-3 font-serif">We Don't Hide Anything</h2>
                    <p className="text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
                        Total transparency is our promise. Every batch is tested at NABL accredited labs before it reaches you.
                    </p>
                </div>

                {/* Reports List */}
                <h3 className="font-bold text-lg text-organic-text mb-4 font-outfit">Latest Reports</h3>
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    {/* Product Thumbnail */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-stone-100 flex-shrink-0">
                                        <img src={report.image} alt={report.product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-organic-text text-base leading-tight mb-1">{report.product}</h3>
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Batch #{report.id}</span>
                                        <span className="text-[10px] text-stone-400 font-medium block mt-0.5">{report.date}</span>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200 shadow-sm flex items-center gap-1">
                                    <FileCheck size={10} /> {report.status}
                                </span>
                            </div>

                            <div className="bg-stone-50 rounded-xl p-3 mb-4 space-y-2">
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Tests Conducted</p>
                                <div className="flex flex-wrap gap-2">
                                    {report.tests.map((test, i) => (
                                        <span key={i} className="text-xs bg-white border border-stone-200 px-2 py-1 rounded-md text-stone-600 font-medium whitespace-nowrap">
                                            {test}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-organic-green bg-green-50 py-3 rounded-xl hover:bg-organic-green hover:text-white transition-all active:scale-95 group-hover:bg-organic-green/10">
                                <Download size={14} /> Download Analysis Report
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default LabReportsPage;
