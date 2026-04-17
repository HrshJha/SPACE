import { useEffect, useRef } from 'react';
import { useCosmosStore } from '../store/useCosmosStore.js';
import { clamp } from '../utils/cosmicMath.js';

/**
 * Tracks pointer motion and turns stillness into a temporary "mass" value.
 * @returns {{ massRef: React.MutableRefObject<number> }}
 */
export function useMouseGravity() {
  const lastPointRef = useRef({ x: 0, y: 0, t: 0 });
  const massRef = useRef(1);
  const massPointTimerRef = useRef(0);
  const setCursor = useCosmosStore((state) => state.setCursor);
  const setTemporaryMassPoint = useCosmosStore(
    (state) => state.setTemporaryMassPoint,
  );

  useEffect(() => {
    const handlePointerMove = (event) => {
      const now = performance.now();
      const dx = event.clientX - lastPointRef.current.x;
      const dy = event.clientY - lastPointRef.current.y;
      const dt = Math.max(16, now - lastPointRef.current.t);
      const velocity = Math.hypot(dx, dy) / dt;

      massRef.current = clamp(1 + (0.15 - Math.min(0.15, velocity)) * 26, 1, 4.5);
      setCursor({
        x: event.clientX,
        y: event.clientY,
        velocity,
        mass: massRef.current,
        visible: true,
      });

      lastPointRef.current = {
        x: event.clientX,
        y: event.clientY,
        t: now,
      };
    };

    const handlePointerLeave = () => {
      setCursor({ visible: false });
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
      window.clearTimeout(massPointTimerRef.current);

      setTemporaryMassPoint({
        x: event.clientX / window.innerWidth,
        y: 1 - event.clientY / window.innerHeight,
        active: true,
        strength: clamp(massRef.current + 2.2, 2.5, 6),
        expiresAt: Date.now() + 3000,
      });

      massPointTimerRef.current = window.setTimeout(() => {
        setTemporaryMassPoint({ active: false, strength: 0 });
      }, 3000);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.clearTimeout(massPointTimerRef.current);
    };
  }, [setCursor, setTemporaryMassPoint]);

  return { massRef };
}
