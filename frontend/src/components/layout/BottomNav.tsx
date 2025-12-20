import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, Leaf, FlaskConical } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: Grid, label: 'Categories', to: '/categories' },
    { icon: Leaf, label: 'Traceability', to: '/traceability' },
    { icon: FlaskConical, label: 'Lab Reports', to: '/lab-reports' },
];

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0f2819] border-t border-white/5 pb-safe z-50 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.to)}
                            className={clsx(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300",
                                isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            <div className={clsx(
                                "p-1.5 rounded-xl transition-all",
                                isActive ? "bg-white/10" : "bg-transparent"
                            )}>
                                <item.icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    className={clsx("transition-transform", isActive && "scale-105")}
                                />
                            </div>
                            <span className={clsx(
                                "text-[10px] font-medium tracking-wide",
                                isActive ? "opacity-100" : "opacity-70"
                            )}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
