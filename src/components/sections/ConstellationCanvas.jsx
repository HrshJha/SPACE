import { useEffect, useRef } from 'react';
import { useConstellations } from '../../hooks/useConstellations.js';
import CosmicCard from '../ui/CosmicCard.jsx';

export function ConstellationCanvas() {
  const canvasRef = useRef(null);
  const {
    stars,
    connections,
    overlayVisible,
    hoveredStar,
    overlayLines,
    setHoveredStar,
    toggleOverlay,
    connectNearest,
    clearConnections,
    exportCanvas,
  } = useConstellations();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      context.clearRect(0, 0, width, height);
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.55, '#020209');
      gradient.addColorStop(1, '#060618');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = 'rgba(74, 158, 255, 0.24)';
      context.lineWidth = 1.5;

      const drawConnection = ([fromId, toId], opacity) => {
        const from = stars.find((star) => star.id === fromId || star.name === fromId);
        const to = stars.find((star) => star.id === toId || star.name === toId);
        if (!from || !to) return;

        context.save();
        context.globalAlpha = opacity;
        context.beginPath();
        context.moveTo(from.position[0] * width, from.position[1] * height);
        context.lineTo(to.position[0] * width, to.position[1] * height);
        context.stroke();
        context.restore();
      };

      connections.forEach((line) => drawConnection(line, 0.92));
      if (overlayVisible) {
        overlayLines.forEach((line) => drawConnection(line, 0.28));
      }

      stars.forEach((star) => {
        const x = star.position[0] * width;
        const y = star.position[1] * height;
        const glow = context.createRadialGradient(x, y, 0, x, y, 18);
        glow.addColorStop(0, 'rgba(255,255,255,0.9)');
        glow.addColorStop(1, 'rgba(74,158,255,0)');
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, 18, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(x, y, 2.8, 0, Math.PI * 2);
        context.fill();
      });
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, [connections, overlayLines, overlayVisible, stars]);

  const resolvePoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  };

  return (
    <section id="constellations" className="section-shell relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <p className="hud-label">Section 06 // Constellation Canvas</p>
          <h2 className="section-title max-w-3xl">
            Draw your own sky geometry and compare it against the official IAU patterns.
          </h2>
        </div>
        <CosmicCard className="space-y-6 overflow-hidden bg-black/[0.45] p-4 sm:p-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={toggleOverlay}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
              aria-label="Toggle official IAU constellation overlay"
            >
              {overlayVisible ? 'Hide IAU overlay' : 'Show IAU overlay'}
            </button>
            <button
              type="button"
              onClick={() => exportCanvas(canvasRef.current)}
              className="rounded-full border border-nebula-blue/30 bg-nebula-blue/[0.15] px-4 py-2 text-sm text-white"
              aria-label="Export constellation canvas as PNG"
            >
              Export PNG
            </button>
            <button
              type="button"
              onClick={clearConnections}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
              aria-label="Clear drawn constellation lines"
            >
              Clear Sky
            </button>
          </div>
          <p className="text-sm text-white/[0.58]">
            Tap or click bright stars to connect them. Touch support snaps to the nearest
            stellar anchor for mobile drawing.
          </p>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10">
            <canvas
              ref={canvasRef}
              className="h-[34rem] w-full cursor-crosshair touch-none"
              onClick={(event) => connectNearest(resolvePoint(event))}
              onTouchStart={(event) => {
                const touch = event.touches[0];
                if (!touch) return;
                connectNearest(resolvePoint(touch));
              }}
              onMouseMove={(event) => {
                const point = resolvePoint(event);
                const nearest = stars.find((star) => {
                  const dx = star.position[0] - point.x;
                  const dy = star.position[1] - point.y;
                  return Math.hypot(dx, dy) < 0.03;
                });
                setHoveredStar(nearest ?? null);
              }}
              onMouseLeave={() => setHoveredStar(null)}
              aria-label="Interactive constellation drawing canvas"
            />
            {hoveredStar ? (
              <div className="absolute bottom-4 left-4 rounded-2xl border border-white/10 bg-black/[0.65] px-4 py-3 text-sm backdrop-blur-xl">
                <p className="font-display text-lg font-bold text-white">{hoveredStar.name}</p>
                <p className="text-white/[0.65]">
                  {hoveredStar.spectralType} • {hoveredStar.distanceLy} light-years
                </p>
              </div>
            ) : null}
          </div>
        </CosmicCard>
      </div>
    </section>
  );
}

export default ConstellationCanvas;
