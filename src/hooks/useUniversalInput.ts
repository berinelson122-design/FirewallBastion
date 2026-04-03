import { useEffect } from 'react';
import { useInputStore, type CommandNode } from '../store/useInputStore';

export const useUniversalInput = () => {
    const { setCommand, setDevice } = useInputStore();

    useEffect(() => {
        // --- PC NODE: KEYBOARD ---
        const keyMap: Record<string, CommandNode> = {
            ArrowUp: 'UP', w: 'UP',
            ArrowDown: 'DOWN', s: 'DOWN',
            ArrowLeft: 'LEFT', a: 'LEFT',
            ArrowRight: 'RIGHT', d: 'RIGHT',
            z: 'ACTION', ' ': 'ACTION',
            x: 'BOMB',
            Shift: 'FOCUS'
        };

        const handleKey = (e: KeyboardEvent, active: boolean) => {
            if (keyMap[e.key]) {
                setDevice('PC');
                setCommand(keyMap[e.key], active);
            }
        };

        // --- CONSOLE NODE: GAMEPAD API ---
        let rafId: number;
        const pollGamepad = () => {
            const gamepads = navigator.getGamepads();
            if (gamepads[0]) {
                setDevice('CONSOLE');
                const gp = gamepads[0];
                // D-Pad and Stick Mapping
                setCommand('UP', gp.axes[1] < -0.5 || gp.buttons[12].pressed);
                setCommand('DOWN', gp.axes[1] > 0.5 || gp.buttons[13].pressed);
                setCommand('LEFT', gp.axes[0] < -0.5 || gp.buttons[14].pressed);
                setCommand('RIGHT', gp.axes[0] > 0.5 || gp.buttons[15].pressed);
                // Buttons
                setCommand('ACTION', gp.buttons[0].pressed); // A / Cross
                setCommand('BOMB', gp.buttons[1].pressed);   // B / Circle
                setCommand('FOCUS', gp.buttons[6].pressed);  // L2
            }
            rafId = requestAnimationFrame(pollGamepad);
        };

        window.addEventListener('keydown', (e) => handleKey(e, true));
        window.addEventListener('keyup', (e) => handleKey(e, false));
        pollGamepad();

        return () => {
            window.removeEventListener('keydown', (e) => handleKey(e, true));
            window.removeEventListener('keyup', (e) => handleKey(e, false));
            cancelAnimationFrame(rafId);
        };
    }, [setCommand, setDevice]);
};