import { useMemo, useState } from 'react';
import {
  brightStars,
  iauConstellationOverlay,
} from '../utils/stellarData.js';

/**
 * Manages star snapping, user-made constellations, and PNG export.
 * @returns {{
 * stars: Array<object>,
 * connections: Array<[string, string]>,
 * overlayVisible: boolean,
 * hoveredStar: object | null,
 * setHoveredStar: (star: object | null) => void,
 * toggleOverlay: () => void,
 * connectNearest: (point: { x: number, y: number }) => string | null,
 * clearConnections: () => void,
 * exportCanvas: (canvas: HTMLCanvasElement) => void,
 * overlayLines: Array<[string, string]>
 * }}
 */
export function useConstellations() {
  const stars = useMemo(
    () =>
      brightStars.map((star) => ({
        ...star,
        id: star.name.toLowerCase().replace(/\s+/g, '-'),
      })),
    [],
  );
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [, setLastSelectedStarId] = useState(null);
  const [connections, setConnections] = useState([]);

  const connectNearest = ({ x, y }) => {
    const nearest = stars.reduce((closest, star) => {
      const dx = x - star.position[0];
      const dy = y - star.position[1];
      const distance = Math.hypot(dx, dy);

      if (!closest || distance < closest.distance) {
        return { star, distance };
      }

      return closest;
    }, null);

    if (!nearest || nearest.distance > 0.08) {
      return null;
    }

    setLastSelectedStarId((current) => {
      if (!current) {
        return nearest.star.id;
      }

      if (current !== nearest.star.id) {
        setConnections((existing) => [...existing, [current, nearest.star.id]]);
      }

      return nearest.star.id;
    });

    return nearest.star.id;
  };

  const exportCanvas = (canvas) => {
    const link = document.createElement('a');
    link.download = 'constellation-canvas.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const clearConnections = () => {
    setConnections([]);
    setLastSelectedStarId(null);
  };

  return {
    stars,
    connections,
    overlayVisible,
    hoveredStar,
    overlayLines: iauConstellationOverlay,
    setHoveredStar,
    toggleOverlay: () => setOverlayVisible((current) => !current),
    connectNearest,
    clearConnections,
    exportCanvas,
  };
}
