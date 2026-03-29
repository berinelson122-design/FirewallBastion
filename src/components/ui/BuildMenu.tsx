import React from 'react';
import { useGameStore } from '../../store/gameStore';
import type { TowerType } from '../../types';

interface TowerOption {
  id: TowerType;
  name: string;
  cost: number;
  color: string;
  desc: string;
}

const TOWER_OPTIONS: TowerOption[] = [
  { id: 'scrubber', name: 'SCRUBBER_NODE', cost: 50, color: '#00FFFF', desc: 'Slows targets.' },
  { id: 'injector', name: 'INJECTOR_NODE', cost: 75, color: '#E056FD', desc: 'Sustained DMG.' },
  { id: 'overclocker', name: 'OVERCLOCKER', cost: 150, color: '#FFFFFF', desc: 'High Alpha / Low Rate.' }
];

export const BuildMenu: React.FC = () => {
  const { bits, selectedTowerType, setSelectedTower } = useGameStore();

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-3 z-40 bg-black/80 p-4 border border-[#333] w-64 shadow-[0_0_15px_rgba(255,0,60,0.1)]">
      <div className="text-xs text-gray-400 uppercase tracking-widest border-b border-[#333] pb-2 mb-2">
        CONSTRUCT PROTOCOLS
      </div>
      
      {TOWER_OPTIONS.map(tower => {
        const isSelected = selectedTowerType === tower.id;
        const canAfford = bits >= tower.cost;
        
        return (
          <button
            key={tower.id}
            onClick={() => setSelectedTower(isSelected ? null : tower.id)}
            disabled={!canAfford}
            className={`
              relative flex flex-col items-start p-3 border transition-colors duration-200 text-left cursor-pointer group
              ${!canAfford ? 'opacity-40 cursor-not-allowed border-[#111]' : ''}
              ${isSelected ? 'border-[var(--color-cyber-red)] bg-[#110000]' : 'border-[#333] hover:border-gray-500 hover:bg-[#111]'}
            `}
          >
            {isSelected && <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--color-cyber-red)]" />}
            
            <div className="flex justify-between w-full mb-1">
              <span className="font-bold text-sm text-white">{tower.name}</span>
              <span className="text-xs font-mono" style={{ color: tower.color }}>{tower.cost} BITS</span>
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wide">
              {tower.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
};
