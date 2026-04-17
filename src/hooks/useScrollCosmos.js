import { useEffect } from 'react';
import { useCosmosStore } from '../store/useCosmosStore.js';

/**
 * Synchronizes scroll progress with the shared cosmic state machine.
 */
export function useScrollCosmos() {
  const setScrollProgress = useCosmosStore((state) => state.setScrollProgress);
  const syncZoneFromProgress = useCosmosStore((state) => state.syncZoneFromProgress);

  useEffect(() => {
    const syncScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight <= 0 ? 0 : window.scrollY / scrollableHeight;

      setScrollProgress(progress);
      syncZoneFromProgress(progress);
      document.documentElement.style.setProperty(
        '--scroll-progress',
        progress.toFixed(4),
      );
    };

    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    window.addEventListener('resize', syncScroll);

    return () => {
      window.removeEventListener('scroll', syncScroll);
      window.removeEventListener('resize', syncScroll);
    };
  }, [setScrollProgress, syncZoneFromProgress]);
}
