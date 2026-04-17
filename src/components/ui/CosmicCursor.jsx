import { useMemo, useRef } from 'react';
import { useCosmosStore } from '../../store/useCosmosStore.js';
import { getSectionAura } from '../../utils/colorPalette.js';

export function CosmicCursor() {
  const cursor = useCosmosStore((state) => state.cursor);
  const activeZone = useCosmosStore((state) => state.activeZone);
  const trailRef = useRef([]);
  const trail = useMemo(() => {
    if (!cursor.visible || window.matchMedia('(pointer: coarse)').matches) {
      trailRef.current = [];
      return [];
    }

    trailRef.current = [{ x: cursor.x, y: cursor.y }, ...trailRef.current].slice(0, 12);
    return trailRef.current;
  }, [cursor.visible, cursor.x, cursor.y]);

  const aura = useMemo(() => getSectionAura(activeZone), [activeZone]);
  const gravitationalStretch = activeZone === 'blackhole' ? 1.35 : 1;

  if (!cursor.visible || typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      {trail.map((point, index) => (
        <div
          key={`${point.x}-${point.y}-${index}`}
          className="absolute h-3 w-3 rounded-full blur-md"
          style={{
            left: point.x - 6,
            top: point.y - 6,
            background: aura,
            opacity: (12 - index) / 18,
            transform: `scale(${1 - index * 0.05})`,
          }}
        />
      ))}
      <div
        className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: `translate(-50%, -50%) scale(${gravitationalStretch})`,
          boxShadow: `0 0 18px ${aura}`,
        }}
      />
      <div
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ left: cursor.x, top: cursor.y }}
      />
      <div
        className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: `translate(-50%, -50%) scale(${0.8 + cursor.mass * 0.08})`,
        }}
      />
    </div>
  );
}

export default CosmicCursor;
