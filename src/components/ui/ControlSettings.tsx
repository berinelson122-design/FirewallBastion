import React from 'react';
import { useInputStore } from '../../store/useInputStore';
import { Smartphone, Monitor, Gamepad2 } from 'lucide-react';

export const ControlSettings: React.FC = () => {
    const { deviceType, commands } = useInputStore();

    return (
        <div className="p-4 bg-black border-2 border-[#E056FD] font-mono text-[10px] w-64 shadow-[0_0_20px_rgba(224,86,253,0.2)]">
            <div className="flex items-center gap-2 text-[#E056FD] mb-4 border-b border-[#E056FD]/30 pb-2">
                {deviceType === 'MOBILE' && <Smartphone size={14} />}
                {deviceType === 'PC' && <Monitor size={14} />}
                {deviceType === 'CONSOLE' && <Gamepad2 size={14} />}
                <span className="font-black tracking-widest uppercase">Input_Matrix_v1.0</span>
            </div>

            <div className="space-y-2">
                {Object.entries(commands).map(([key, active]) => (
                    <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-500 uppercase">{key}</span>
                        <div className={`h-2 w-12 border ${active ? 'bg-[#FF003C] border-[#FF003C] shadow-[0_0_10px_#FF003C]' : 'border-gray-800'}`} />
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-2 border-t border-[#333] text-[8px] text-gray-600 flex justify-between">
                <span>POLLING_RATE: 120HZ</span>
                <span>LATENCY: 0.8MS</span>
            </div>

            <div className="absolute bottom-2 right-2 opacity-20 text-[6px]">ARCHITECT // VOID_WEAVER</div>
        </div>
    );
};