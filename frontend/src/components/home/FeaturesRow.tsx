import { Sprout, FlaskConical, MapPin } from 'lucide-react';

const features = [
    {
        id: 1,
        label: "Direct\nFrom Farmers",
        icon: Sprout,
        color: "bg-[#e8f5e9] dark:bg-green-900/30 text-[#1a472a] dark:text-green-300"
    },
    {
        id: 2,
        label: "Lab Tested\nSafe",
        icon: FlaskConical,
        color: "bg-[#e3f2fd] dark:bg-blue-900/30 text-[#0d47a1] dark:text-blue-300"
    },
    {
        id: 3,
        label: "100%\nTraceable",
        icon: MapPin,
        color: "bg-[#f1f8e9] dark:bg-lime-900/30 text-[#33691e] dark:text-lime-300"
    }
];

export const FeaturesRow = () => {
    return (
        <div className="px-6 py-8">
            <div className="flex justify-between items-start gap-2">
                {features.map((feature) => (
                    <div key={feature.id} className="flex flex-col items-center text-center gap-3 w-1/3 group">
                        <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center shadow-sm group-active:scale-95 transition-transform duration-300`}>
                            <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 leading-tight whitespace-pre-line tracking-tight">
                            {feature.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
