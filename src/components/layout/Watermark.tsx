import React from 'react';

export const Watermark: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-6 pointer-events-none z-50 opacity-50 select-none mix-blend-screen text-right">
      <div className="text-[var(--color-red-violet)] text-sm tracking-[0.3em] font-bold">
        ARCHITECT // VOID_WEAVER
      </div>
      <div className="text-[#333] text-xs mt-1">
        SOVEREIGNTY PROTOCOL V1.0
      </div>
    </div>
  );
};
