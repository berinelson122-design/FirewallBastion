
import { Scanlines } from './components/layout/Scanlines';
import { Watermark } from './components/layout/Watermark';
import { Hud } from './components/ui/Hud';
import { BuildMenu } from './components/ui/BuildMenu';
import { GameCanvas } from './components/GameCanvas';
import { useGameStore } from './store/gameStore';

function App() {
  const { isGameOver, gameStarted, startGame, restartGame, wave } = useGameStore();

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center font-mono">
      <Scanlines />
      <Watermark />
      
      {/* HUD & Menus (Only when playing) */}
      {gameStarted && !isGameOver && (
        <>
          <Hud />
          <BuildMenu />
        </>
      )}

      {/* Main Game Render */}
      <GameCanvas />
      
      {/* Start Screen Overlay */}
      {!gameStarted && !isGameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="border border-[var(--color-cyber-red)] bg-black p-8 text-center shadow-[0_0_30px_rgba(255,0,60,0.3)] max-w-lg">
            <h1 className="text-4xl font-bold text-[var(--color-cyber-red)] mb-2 tracking-widest">FIREWALL BASTION</h1>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest">Sovereignty Protocol // Defend the Core</p>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-[var(--color-cyber-red)] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 w-full"
            >
              [ INITIATE UPLINK ]
            </button>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--color-cyber-red)]/10 backdrop-blur-md">
          <div className="border border-[var(--color-cyber-red)] bg-black p-8 text-center shadow-[0_0_50px_rgba(255,0,60,0.6)]">
            <h1 className="text-5xl font-bold text-[var(--color-cyber-red)] mb-4 tracking-widest animate-pulse">SYSTEM COMPROMISED</h1>
            <p className="text-white mb-8 text-lg uppercase tracking-widest">Survived until Wave {wave}</p>
            <button 
              onClick={restartGame}
              className="px-8 py-3 border border-[var(--color-cyber-red)] text-[var(--color-cyber-red)] font-bold uppercase tracking-widest hover:bg-[var(--color-cyber-red)] hover:text-black transition-colors duration-300 w-full"
            >
              [ REBOOT SYSTEM ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
