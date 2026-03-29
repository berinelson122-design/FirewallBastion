export type Position = { x: number; y: number };

export type EnemyType = 'corrupted_packet';

export interface Enemy {
  id: string;
  type: EnemyType;
  pos: Position;
  hp: number;
  maxHp: number;
  speed: number;
  pathIndex: number; // Index in the global waypoints array
  slowDuration: number; // 0 if not slowed
}

export type TowerType = 'scrubber' | 'injector' | 'overclocker';

export interface TowerConfig {
  type: TowerType;
  name: string;
  cost: number;
  range: number;
  dps: number;
  fireRate: number; // delay in ms
  color: string;
}

export interface Tower {
  id: string;
  type: TowerType;
  pos: Position;
  lastFired: number;
}

export interface Particle {
  id: string;
  pos: Position;
  velocity: Position;
  life: number;
  maxLife: number;
  color: string;
}

// Global Game State (Zustand & React safe UI state)
export interface GameState {
  bits: number;
  vesselIntegrity: number;
  wave: number;
  isGameOver: boolean;
  selectedTowerType: TowerType | null;
  addBits: (amount: number) => void;
  damageVessel: (amount: number) => void;
  nextWave: () => void;
  setSelectedTower: (type: TowerType | null) => void;
  restartGame: () => void;
  gameStarted: boolean;
  startGame: () => void;
}
