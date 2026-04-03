import React, { useRef, useState } from 'react';
import { useInputStore } from '../../store/useInputStore';

/**
 * ARCHITECT // VOID_WEAVER
 * PROTOCOL: HAPTIC_DIRECTIONAL_UPLINK
 * HARDWARE: CAPACITIVE_TOUCH_OPTIMIZED
 */

interface JoystickProps {
    size?: number;
    stickSize?: number;
}

export const VirtualJoystick: React.FC<JoystickProps> = ({
    size = 120,
    stickSize = 50
}) => {
    const { setCommand } = useInputStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState(false);

    const radius = size / 2;
    const threshold = 0.3; // Deadzone filter (30%)

    const handleTouch = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + radius;
        const centerY = rect.top + radius;

        // Calculate relative vector from center
        let dx = clientX - centerX;
        let dy = clientY - centerY;

        // Distance formula for clamping
        const distance = Math.sqrt(dx * dx + dy * dy);
        const clampedDistance = Math.min(distance, radius);

        // Maintain angle while clamping distance
        const angle = Math.atan2(dy, dx);
        const finalX = Math.cos(angle) * clampedDistance;
        const finalY = Math.sin(angle) * clampedDistance;

        setPosition({ x: finalX, y: finalY });

        // Normalize for logical command bus (-1.0 to 1.0)
        const normX = finalX / radius;
        const normY = finalY / radius;

        // Trigger directional logic with deadzone
        setCommand('LEFT', normX < -threshold);
        setCommand('RIGHT', normX > threshold);
        setCommand('UP', normY < -threshold);
        setCommand('DOWN', normY > threshold);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleTouch(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
        setActive(false);
        setPosition({ x: 0, y: 0 });
        // Reset logical directions
        setCommand('UP', false);
        setCommand('DOWN', false);
        setCommand('LEFT', false);
        setCommand('RIGHT', false);
    };

    return (
        <div className="relative select-none touch-none">
            {/* Background Track */}
            <div
                ref={containerRef}
                className="rounded-full border-2 border-[#E056FD]/30 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(224,86,253,0.1)]"
                style={{ width: size, height: size }}
                onTouchStart={() => setActive(true)}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Directional Indicators (Visual Code) */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10">
                    <div className="border-r border-b border-[#E056FD]" />
                    <div className="border-b border-[#E056FD]" />
                    <div className="border-r border-[#E056FD]" />
                    <div />
                </div>

                {/* Thumbstick Node */}
                <div
                    className={`rounded-full transition-shadow duration-200 ${active
                        ? 'bg-[#FF003C] shadow-[0_0_25px_#FF003C]'
                        : 'bg-[#E056FD]/50 shadow-[0_0_10px_#E056FD]/20'
                        }`}
                    style={{
                        width: stickSize,
                        height: stickSize,
                        transform: `translate(${position.x}px, ${position.y}px)`
                    }}
                />
            </div>

            {/* Logic Label */}
            <div className="absolute -bottom-6 left-0 w-full text-center">
                <span className="text-[8px] font-mono text-[#E056FD] tracking-[0.3em] uppercase opacity-40">
                    Haptic_Drive_Active
                </span>
            </div>
        </div>
    );
};