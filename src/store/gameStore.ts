import { create } from 'zustand';
import type { GameState } from '../types';

const INITIAL_BITS = 100;
const INITIAL_INTEGRITY = 100;

export const useGameStore = create<GameState>((set) => ({
  bits: INITIAL_BITS,
  vesselIntegrity: INITIAL_INTEGRITY,
  wave: 1,
  isGameOver: false,
  selectedTowerType: null,
  gameStarted: false,
  
  addBits: (amount) => set((state) => ({ bits: state.bits + amount })),
  
  damageVessel: (amount) => set((state) => {
    const newIntegrity = Math.max(0, state.vesselIntegrity - amount);
    return {
      vesselIntegrity: newIntegrity,
      isGameOver: newIntegrity === 0
    };
  }),

  nextWave: () => set((state) => ({ wave: state.wave + 1 })),
  
  setSelectedTower: (type) => set({ selectedTowerType: type }),
  
  restartGame: () => set({
    bits: INITIAL_BITS,
    vesselIntegrity: INITIAL_INTEGRITY,
    wave: 1,
    isGameOver: false,
    selectedTowerType: null,
    gameStarted: true,
  }),

  startGame: () => set({ gameStarted: true })
}));
