import type { Enemy, Particle, Position, TowerType, Tower, TowerConfig } from '../types';
import { useGameStore } from '../store/gameStore';

const WAYPOINTS: Position[] = [
  { x: 0, y: 100 },
  { x: 300, y: 100 },
  { x: 300, y: 400 },
  { x: 600, y: 400 },
  { x: 600, y: 200 },
  { x: 900, y: 200 },
];

const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
  scrubber: { type: 'scrubber', name: 'Scrubber', cost: 50, range: 120, dps: 10, fireRate: 1000, color: '#00FFFF' },
  injector: { type: 'injector', name: 'Injector', cost: 75, range: 150, dps: 20, fireRate: 2000, color: '#E056FD' }, // DoT concept simplified to damage
  overclocker: { type: 'overclocker', name: 'Overclocker', cost: 150, range: 100, dps: 50, fireRate: 300, color: '#FFFFFF' }
};

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  
  public towers: Tower[] = [];
  public enemies: Enemy[] = [];
  public particles: Particle[] = [];
  private enemyIdCounter = 0;
  
  private timeSinceLastSpawn = 0;
  private spawnInterval = 1000;
  private enemiesSpawnedThisWave = 0;
  
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width = 1000;
    this.height = canvas.height = 600;
  }
  
  public getResolution() {
    return { w: this.width, h: this.height };
  }

  public placeTower(type: TowerType, pos: Position): boolean {
    const state = useGameStore.getState();
    const config = TOWER_CONFIGS[type];
    
    // Simplistic collision with path omitted for brevity; normally we'd check distance from waypoints
    if (state.bits >= config.cost) {
      state.addBits(-config.cost);
      this.towers.push({
        id: `t_${Date.now()}_${this.towers.length}`,
        type,
        pos,
        lastFired: 0
      });
      return true;
    }
    return false;
  }

  public update(deltaTime: number, timeStamp: number) {
    const state = useGameStore.getState();
    if (state.isGameOver || !state.gameStarted) return;
    
    // Wave Management
    this.timeSinceLastSpawn += deltaTime;
    const waveSize = state.wave * 5;
    
    if (this.enemiesSpawnedThisWave < waveSize && this.timeSinceLastSpawn >= this.spawnInterval) {
      this.spawnEnemy(state.wave);
      this.timeSinceLastSpawn = 0;
      this.enemiesSpawnedThisWave++;
    } else if (this.enemiesSpawnedThisWave >= waveSize && this.enemies.length === 0) {
      // Wave complete
      state.nextWave();
      this.enemiesSpawnedThisWave = 0;
      this.spawnInterval = Math.max(200, 1000 - (state.wave * 50));
    }
    
    // Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      const targetWp = WAYPOINTS[e.pathIndex + 1];
      
      if (!targetWp) continue; // Reached end
      
      const dx = targetWp.x - e.pos.x;
      const dy = targetWp.y - e.pos.y;
      const dist = Math.hypot(dx, dy);
      
      const speed = e.slowDuration > 0 ? e.speed * 0.5 : e.speed;
      if (e.slowDuration > 0) e.slowDuration -= deltaTime;
      
      const move = speed * (deltaTime / 1000);
      
      if (dist <= move) {
        e.pos.x = targetWp.x;
        e.pos.y = targetWp.y;
        e.pathIndex++;
        
        if (e.pathIndex >= WAYPOINTS.length - 1) {
          // Reached Base!
          state.damageVessel(10);
          this.enemies.splice(i, 1);
        }
      } else {
        e.pos.x += (dx / dist) * move;
        e.pos.y += (dy / dist) * move;
      }
    }
    
    // Update Towers
    this.towers.forEach(tower => {
      const config = TOWER_CONFIGS[tower.type];
      if (timeStamp - tower.lastFired >= config.fireRate) {
        // Find Target
        const target = this.enemies.find(e => Math.hypot(e.pos.x - tower.pos.x, e.pos.y - tower.pos.y) <= config.range);
        if (target) {
          target.hp -= config.dps;
          tower.lastFired = timeStamp;
          if (tower.type === 'scrubber') target.slowDuration = 2000;
          
          this.createGlitchParticles(target.pos);
          
          // Attack laser effect
          this.ctx.beginPath();
          this.ctx.strokeStyle = config.color;
          this.ctx.lineWidth = 2;
          this.ctx.moveTo(tower.pos.x, tower.pos.y);
          this.ctx.lineTo(target.pos.x, target.pos.y);
          this.ctx.stroke();
        }
      }
    });
    
    // Check Enemy HP
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.hp <= 0) {
        state.addBits(10);
        this.enemies.splice(i, 1);
      }
    }
    
    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= deltaTime;
      p.pos.x += p.velocity.x;
      p.pos.y += p.velocity.y;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  public draw() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw Path
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 40;
    this.ctx.lineCap = 'square';
    this.ctx.lineJoin = 'miter';
    this.ctx.beginPath();
    WAYPOINTS.forEach((wp, i) => {
      if (i === 0) this.ctx.moveTo(wp.x, wp.y);
      else this.ctx.lineTo(wp.x, wp.y);
    });
    this.ctx.stroke();
    
    // Draw Path Line Center
    this.ctx.strokeStyle = '#555555';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    WAYPOINTS.forEach((wp, i) => {
      if (i === 0) this.ctx.moveTo(wp.x, wp.y);
      else this.ctx.lineTo(wp.x, wp.y);
    });
    this.ctx.stroke();

    // Draw Towers
    this.towers.forEach(t => {
      const conf = TOWER_CONFIGS[t.type];
      this.ctx.fillStyle = conf.color;
      this.ctx.beginPath();
      if (t.type === 'scrubber') {
        this.ctx.arc(t.pos.x, t.pos.y, 12, 0, Math.PI * 2);
      } else if (t.type === 'injector') {
        this.ctx.rect(t.pos.x - 10, t.pos.y - 10, 20, 20);
      } else {
        this.ctx.moveTo(t.pos.x, t.pos.y - 14);
        this.ctx.lineTo(t.pos.x + 12, t.pos.y + 10);
        this.ctx.lineTo(t.pos.x - 12, t.pos.y + 10);
      }
      this.ctx.fill();
    });

    // Draw Enemies
    this.enemies.forEach(e => {
      this.ctx.fillStyle = '#FF003C';
      this.ctx.fillRect(e.pos.x - 10, e.pos.y - 10, 20, 20);
      
      // HP Bar
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(e.pos.x - 10, e.pos.y - 15, 20 * (e.hp / e.maxHp), 3);
    });

    // Draw Particles
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.pos.x, p.pos.y, 4, 4);
    });
  }

  private spawnEnemy(wave: number) {
    const baseHp = 50 + (wave * 20);
    this.enemies.push({
      id: `e_${this.enemyIdCounter++}`,
      type: 'corrupted_packet',
      pos: { x: WAYPOINTS[0].x, y: WAYPOINTS[0].y },
      hp: baseHp,
      maxHp: baseHp,
      speed: 60 + (wave * 2),
      pathIndex: 0,
      slowDuration: 0
    });
  }

  private createGlitchParticles(pos: Position) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        id: `p_${Date.now()}_${Math.random()}`,
        pos: { x: pos.x + (Math.random() * 10 - 5), y: pos.y + (Math.random() * 10 - 5) },
        velocity: { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 },
        life: 200 + Math.random() * 200,
        maxLife: 400,
        color: Math.random() > 0.5 ? '#FF003C' : '#FFFFFF'
      });
    }
  }
}
