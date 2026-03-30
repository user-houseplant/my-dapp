'use client';

import { useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const fire = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fireBatch(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fireBatch(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fireBatch(0.2, {
      spread: 60,
    });
    fireBatch(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fireBatch(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fireBatch(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return { fire };
}

export function ConfettiEffect() {
  // This component doesn't render anything, it's just for the hook
  return null;
}
