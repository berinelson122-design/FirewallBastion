import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Shield, Cpu, Activity } from 'lucide-react';

export const Hud: React.FC = () => {
  const { bits, vesselIntegrity, wave } = useGameStore();

  return (
    <div className="absolute top-4 left-4 flex gap-6 z-40 bg-black/80 p-4 border border-[#333] shadow-[0_0_15px_rgba(255,0,60,0.1)]">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Shield size={12} className="text-[var(--color-cyber-red)]" /> VESSEL INTEGRITY
        </span>
        <span className={`text-2xl font-bold ${vesselIntegrity < 30 ? 'text-[var(--color-cyber-red)] animate-pulse' : 'text-white'}`}>
          {vesselIntegrity}%
        </span>
      </div>
      
      <div className="w-[1px] bg-[#333]"></div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Activity size={12} className="text-[#00FFFF]" /> AVAILABLE BITS
        </span>
        <span className="text-2xl font-bold text-[#00FFFF]">
          {bits}
        </span>
      </div>

      <div className="w-[1px] bg-[#333]"></div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Cpu size={12} className="text-[var(--color-red-violet)]" /> INCURSION WAVE
        </span>
        <span className="text-2xl font-bold text-[var(--color-red-violet)]">
          {wave}
        </span>
      </div>
    </div>
  );
};
