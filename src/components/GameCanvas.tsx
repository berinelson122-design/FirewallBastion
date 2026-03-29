import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { GameEngine } from '../engine/GameEngine';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const selectedTowerType = useGameStore(state => state.selectedTowerType);
  const setSelectedTower = useGameStore(state => state.setSelectedTower);
  const gameStarted = useGameStore(state => state.gameStarted);
  
  // Init engine
  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new GameEngine(canvasRef.current);
      console.log('%c[SYS] TECHNICAL WIZARD INITIALIZED. ARCHITECT // VOID_WEAVER', 'color: #E056FD; font-weight: bold; background: black; padding: 4px;');
      setIsReady(true);
    }
  }, []);

  // Use the highly efficient game loop
  useGameLoop((deltaTime, timeStamp) => {
    if (engineRef.current && isReady && gameStarted) {
      engineRef.current.update(deltaTime, timeStamp);
      engineRef.current.draw();
    } else if (engineRef.current && !gameStarted) {
      // Draw static background before game starts
      engineRef.current.draw();
    }
  }, isReady);

  // Handle building logic via React synthetic event -> Engine method bridge
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current || !selectedTowerType || !gameStarted) return;
    
    // Calculate relative canvas coordinates
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Hardcoded canvas scaling ratios if needed (assuming 1000x600 logical)
    const scaleX = 1000 / rect.width;
    const scaleY = 600 / rect.height;
    
    const logicalX = x * scaleX;
    const logicalY = y * scaleY;
    
    const success = engineRef.current.placeTower(selectedTowerType, { x: logicalX, y: logicalY });
    if (success) {
      setSelectedTower(null); // deselect after built
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <canvas
        ref={canvasRef}
        className={`bg-black max-w-full max-h-full aspect-[10/6] border border-[#333] shadow-[0_0_30px_rgba(255,0,60,0.15)] ${selectedTowerType ? 'cursor-crosshair' : 'cursor-default'}`}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};
