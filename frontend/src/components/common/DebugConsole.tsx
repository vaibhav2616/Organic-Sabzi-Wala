import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Terminal, X, ChevronDown } from 'lucide-react';
import type { RootState } from '../../features/store';

export const DebugConsole = () => {
    const { lastDebugLog, error } = useSelector((state: RootState) => state.delivery);
    const [isOpen, setIsOpen] = useState(false);

    // Hide unless there is something to show
    if (!lastDebugLog && !error) return null;

    return (
        <div className="fixed bottom-14 right-4 z-[100] flex flex-col items-end">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                title="Toggle Debug Console"
            >
                {isOpen ? <ChevronDown size={20} /> : <Terminal size={20} />}
            </button>

            {isOpen && (
                <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg shadow-2xl w-80 mt-2 border border-gray-700 max-h-60 overflow-y-auto">
                    <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                        <span className="font-bold">Backend Debug Log</span>
                        <X size={14} className="cursor-pointer" onClick={() => setIsOpen(false)} />
                    </div>
                    {error && (
                        <div className="text-red-400 mb-2">
                            &gt; Error: {error}
                        </div>
                    )}
                    {lastDebugLog ? (
                        <pre className="whitespace-pre-wrap break-words">
                            {lastDebugLog}
                        </pre>
                    ) : (
                        <span className="text-gray-500">No logs available.</span>
                    )}
                </div>
            )}
        </div>
    );
};
