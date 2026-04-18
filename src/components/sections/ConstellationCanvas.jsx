import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CosmicCard from '../ui/CosmicCard.jsx';
import GlowButton from '../ui/GlowButton.jsx';
import { brightStars, iauConstellationOverlay } from '../../utils/stellarData.js';

const SNAP_RADIUS = 20;
const MYTH_NAMES = [
  'Asterion',
  'Nyxaris',
  'Vayunetra',
  'Orphion',
  'Seraphel',
  'Lyranth',
  'Astraea Prime',
];

function uniqueConnectionKey(fromId, toId) {
  return [fromId, toId].sort().join(':');
}

export function ConstellationCanvas() {
  const canvasRef = useRef(null);
  const connectionsRef = useRef([]);
  const clearRef = useRef(null);
  const animationFrameRef = useRef(0);
  const completionTimerRef = useRef(0);
  const [connections, setConnections] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [activeStarId, setActiveStarId] = useState(null);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [toast, setToast] = useState(null);
  const [celebrationStarIds, setCelebrationStarIds] = useState([]);

  const stars = useMemo(
    () =>
      brightStars.map((star) => ({
        ...star,
        id: star.name.toLowerCase().replace(/\s+/g, '-'),
      })),
    [],
  );

  useEffect(() => {
    connectionsRef.current = connections;
  }, [connections]);

  useEffect(
    () => () => {
      window.clearTimeout(completionTimerRef.current);
      window.cancelAnimationFrame(animationFrameRef.current);
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
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

    const draw = (time = 0) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const clearProgress = clearRef.current
        ? Math.min(1, (time - clearRef.current.startedAt) / 800)
        : 0;
      const committedOpacity = clearRef.current ? 1 - clearProgress : 1;

      if (clearRef.current && clearProgress >= 1) {
        clearRef.current = null;
        setConnections([]);
      }

      context.clearRect(0, 0, width, height);
      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, '#000000');
      background.addColorStop(0.5, '#050510');
      background.addColorStop(1, '#0b1020');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const nebula = context.createRadialGradient(width * 0.24, height * 0.28, 0, width * 0.24, height * 0.28, width * 0.36);
      nebula.addColorStop(0, 'rgba(0,194,255,0.16)');
      nebula.addColorStop(1, 'rgba(0,194,255,0)');
      context.fillStyle = nebula;
      context.fillRect(0, 0, width, height);

      const nebulaTwo = context.createRadialGradient(width * 0.78, height * 0.22, 0, width * 0.78, height * 0.22, width * 0.3);
      nebulaTwo.addColorStop(0, 'rgba(106,92,255,0.14)');
      nebulaTwo.addColorStop(1, 'rgba(106,92,255,0)');
      context.fillStyle = nebulaTwo;
      context.fillRect(0, 0, width, height);

      const getStarById = (id) => stars.find((star) => star.id === id || star.name === id);

      const drawConnection = (from, to, opacity) => {
        if (!from || !to || opacity <= 0) {
          return;
        }

        const x1 = from.position[0] * width;
        const y1 = from.position[1] * height;
        const x2 = to.position[0] * width;
        const y2 = to.position[1] * height;
        const gradient = context.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `rgba(0,194,255,${0.92 * opacity})`);
        gradient.addColorStop(1, `rgba(123,47,190,${0.88 * opacity})`);

        context.save();
        context.strokeStyle = gradient;
        context.lineWidth = 2.2;
        context.shadowBlur = 8;
        context.shadowColor = `rgba(0,194,255,${0.7 * opacity})`;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.restore();
      };

      if (overlayVisible) {
        iauConstellationOverlay.forEach(([fromId, toId]) => {
          const from = getStarById(fromId);
          const to = getStarById(toId);
          context.save();
          context.strokeStyle = 'rgba(255,255,255,0.14)';
          context.lineWidth = 1;
          context.setLineDash([6, 12]);
          context.beginPath();
          context.moveTo(from.position[0] * width, from.position[1] * height);
          context.lineTo(to.position[0] * width, to.position[1] * height);
          context.stroke();
          context.restore();
        });
      }

      connectionsRef.current.forEach(([fromId, toId]) => {
        drawConnection(getStarById(fromId), getStarById(toId), committedOpacity);
      });

      if (activeStarId && previewPoint) {
        const origin = getStarById(activeStarId);

        if (origin) {
          context.save();
          context.setLineDash([10, 10]);
          context.strokeStyle = 'rgba(0,194,255,0.6)';
          context.lineWidth = 1.5;
          context.beginPath();
          context.moveTo(origin.position[0] * width, origin.position[1] * height);
          context.lineTo(previewPoint.x, previewPoint.y);
          context.stroke();
          context.restore();
        }
      }

      const celebrationActive = celebrationStarIds.length > 0;

      stars.forEach((star) => {
        const x = star.position[0] * width;
        const y = star.position[1] * height;
        const isActive = star.id === activeStarId;
        const isCelebrating = celebrationStarIds.includes(star.id);
        const pulse = isActive || isCelebrating ? 1 + 0.2 * Math.sin(time * 0.008) + (isActive ? 0.2 : 0) : 1;
        const haloRadius = isCelebrating ? 26 : 20;
        const glow = context.createRadialGradient(x, y, 0, x, y, haloRadius);
        glow.addColorStop(0, isCelebrating ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.86)');
        glow.addColorStop(0.45, isCelebrating ? 'rgba(0,194,255,0.42)' : 'rgba(0,194,255,0.26)');
        glow.addColorStop(1, 'rgba(0,194,255,0)');

        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, haloRadius, 0, Math.PI * 2);
        context.fill();

        if (celebrationActive && isCelebrating) {
          const burst = context.createRadialGradient(x, y, 0, x, y, 42 + Math.sin(time * 0.01) * 6);
          burst.addColorStop(0, 'rgba(255,255,255,0.18)');
          burst.addColorStop(1, 'rgba(255,255,255,0)');
          context.fillStyle = burst;
          context.beginPath();
          context.arc(x, y, 44, 0, Math.PI * 2);
          context.fill();
        }

        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(x, y, 3.2 * pulse, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    animationFrameRef.current = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeStarId, celebrationStarIds, overlayVisible, previewPoint, stars]);

  const resolveCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = 'changedTouches' in event
      ? event.changedTouches[0] ?? event.touches?.[0]
      : event;

    if (!source) {
      return null;
    }

    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const getNearestStar = (point) => {
    if (!point) {
      return null;
    }

    return stars.reduce((closest, star) => {
      const dx = star.position[0] * point.width - point.x;
      const dy = star.position[1] * point.height - point.y;
      const distance = Math.hypot(dx, dy);

      if (distance > SNAP_RADIUS) {
        return closest;
      }

      if (!closest || distance < closest.distance) {
        return { star, distance };
      }

      return closest;
    }, null)?.star ?? null;
  };

  const maybeCelebrate = (nextConnections) => {
    const starIds = new Set(nextConnections.flat());

    if (starIds.size < 5) {
      return;
    }

    const discoveredName = MYTH_NAMES[nextConnections.length % MYTH_NAMES.length];
    setCelebrationStarIds([...starIds]);
    setToast(`New constellation discovered: ${discoveredName}`);
    window.clearTimeout(completionTimerRef.current);
    completionTimerRef.current = window.setTimeout(() => {
      setCelebrationStarIds([]);
      setToast(null);
    }, 2200);
  };

  const beginConnection = (event) => {
    const point = resolveCanvasPoint(event);
    const star = getNearestStar(point);

    if (!star) {
      setActiveStarId(null);
      setPreviewPoint(null);
      return;
    }

    setActiveStarId(star.id);
    setPreviewPoint(point ? { x: point.x, y: point.y } : null);
  };

  const updatePreview = (event) => {
    const point = resolveCanvasPoint(event);

    if (!point) {
      return;
    }

    setPreviewPoint({ x: point.x, y: point.y });
    setHoveredStar(getNearestStar(point));
  };

  const commitConnection = (event) => {
    const point = resolveCanvasPoint(event);
    const target = getNearestStar(point);

    if (activeStarId && target && target.id !== activeStarId) {
      const nextKey = uniqueConnectionKey(activeStarId, target.id);
      const nextConnections = connectionsRef.current.some(
        ([fromId, toId]) => uniqueConnectionKey(fromId, toId) === nextKey,
      )
        ? connectionsRef.current
        : [...connectionsRef.current, [activeStarId, target.id]];

      if (nextConnections !== connectionsRef.current) {
        setConnections(nextConnections);
        maybeCelebrate(nextConnections);
      }
    }

    setActiveStarId(null);
    setPreviewPoint(null);
  };

  const clearSky = () => {
    if (!connectionsRef.current.length) {
      return;
    }

    clearRef.current = { startedAt: performance.now() };
    setToast(null);
    setCelebrationStarIds([]);
  };

  const exportCanvas = () => {
    const link = document.createElement('a');
    link.download = 'constellation-canvas.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <section id="constellations" className="section-shell cosmos-section relative min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <p className="hud-label">Section 06 // Constellation Canvas</p>
          <h2 className="section-title max-w-4xl">
            Draw your own sky geometry and compare it against the official IAU patterns.
          </h2>
          <p className="section-copy">
            Forty anchor stars hold the sky in place. Snap between them, draft new
            mythologies, then export the chart as if mission control had just archived it.
          </p>
        </div>
        <CosmicCard className="space-y-6 overflow-hidden bg-black/[0.45]">
          <div className="flex flex-wrap gap-3">
            <GlowButton
              variant="ghost"
              onClick={() => setOverlayVisible((current) => !current)}
              aria-label="Toggle official IAU constellation overlay"
            >
              {overlayVisible ? 'Hide IAU Overlay' : 'Show IAU Overlay'}
            </GlowButton>
            <GlowButton
              variant="ghost"
              onClick={exportCanvas}
              aria-label="Export constellation canvas as PNG"
            >
              Export PNG
            </GlowButton>
            <GlowButton
              variant="ghost"
              onClick={clearSky}
              aria-label="Clear committed constellation lines"
            >
              Clear Sky
            </GlowButton>
          </div>
          <p className="copy-measure mt-0 text-sm text-white/[0.58]">
            Press and drag from one anchor star to another. The live guide snaps within a
            20-pixel radius, touch input is supported, and every committed line stays luminous
            until you clear the sky.
          </p>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10">
            <canvas
              ref={canvasRef}
              className="h-[34rem] w-full cursor-crosshair touch-none"
              onMouseDown={beginConnection}
              onMouseMove={updatePreview}
              onMouseUp={commitConnection}
              onMouseLeave={() => {
                setHoveredStar(null);
                setActiveStarId(null);
                setPreviewPoint(null);
              }}
              onTouchStart={(event) => {
                event.preventDefault();
                beginConnection(event);
              }}
              onTouchMove={(event) => {
                event.preventDefault();
                updatePreview(event);
              }}
              onTouchEnd={(event) => {
                event.preventDefault();
                commitConnection(event);
              }}
              aria-label="Interactive constellation drawing canvas"
            />
            {hoveredStar ? (
              <div className="absolute bottom-4 left-4 rounded-2xl border border-white/10 bg-black/[0.68] px-4 py-3 text-sm backdrop-blur-xl">
                <p className="font-display text-lg font-bold text-white">{hoveredStar.name}</p>
                <p className="text-white/[0.65]">
                  {hoveredStar.spectralType} • {hoveredStar.distanceLy} light-years
                </p>
              </div>
            ) : null}
            <AnimatePresence>
              {toast ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="absolute right-4 top-4 rounded-2xl border border-nebula-blue/20 bg-black/70 px-4 py-3 text-sm text-white backdrop-blur-xl"
                >
                  {toast}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </CosmicCard>
      </div>
    </section>
  );
}

export default ConstellationCanvas;
