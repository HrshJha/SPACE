import { Suspense, lazy, useEffect } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/layout/Navbar.jsx';
import CosmicLoader from './components/layout/CosmicLoader.jsx';
import SectionTransitionOverlay from './components/layout/SectionTransitionOverlay.jsx';
import CosmicScene from './components/background/CosmicScene.jsx';
import WormholeMenu from './components/interactive/WormholeMenu.jsx';
import AstroBot from './components/interactive/AstroBot.jsx';
import CosmicCursor from './components/ui/CosmicCursor.jsx';
import { useMouseGravity } from './hooks/useMouseGravity.js';
import { useScrollCosmos } from './hooks/useScrollCosmos.js';
import { useAmbientSound } from './hooks/useAmbientSound.js';
import { useCosmosStore } from './store/useCosmosStore.js';

const HeroUniverse = lazy(() => import('./components/sections/HeroUniverse.jsx'));
const SolarExplorer = lazy(() => import('./components/sections/SolarExplorer.jsx'));
const BlackHoleSimulation = lazy(() => import('./components/sections/BlackHoleSimulation.jsx'));
const UniverseTimeline = lazy(() => import('./components/sections/UniverseTimeline.jsx'));
const MissionFeed = lazy(() => import('./components/sections/MissionFeed.jsx'));
const ConstellationCanvas = lazy(() => import('./components/sections/ConstellationCanvas.jsx'));
const JoinMission = lazy(() => import('./components/sections/JoinMission.jsx'));

function SectionFallback() {
  return <div className="min-h-[40vh]" />;
}

function SectionErrorFallback() {
  return (
    <div className="section-shell flex min-h-[40vh] items-center justify-center px-6 py-16">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center">
        <p className="hud-label">Section Recovery Mode</p>
        <p className="mt-4 max-w-lg text-white/75">
          A simulation panel failed to initialize, but the rest of the universe is still online.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const loaderComplete = useCosmosStore((state) => state.loaderComplete);
  const setLoaderComplete = useCosmosStore((state) => state.setLoaderComplete);
  const setMenuOpen = useCosmosStore((state) => state.setMenuOpen);
  const { toggleAudio, playInteraction } = useAmbientSound();

  useMouseGravity();
  useScrollCosmos();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);

    if (reduceMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [reduceMotion]);

  const navigateTo = (id) => {
    playInteraction('warp');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-cosmos text-white">
      <AnimatePresence>
        {!loaderComplete ? (
          <CosmicLoader onComplete={() => setLoaderComplete(true)} />
        ) : null}
      </AnimatePresence>

      <ErrorBoundary FallbackComponent={SectionErrorFallback}>
        <CosmicScene />
      </ErrorBoundary>
      <SectionTransitionOverlay />
      <Navbar onToggleAudio={toggleAudio} />
      <WormholeMenu />
      <CosmicCursor />

      <main className="relative z-10">
        <Suspense fallback={<SectionFallback />}>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <HeroUniverse
              onPrimaryAction={() => navigateTo('solar-system')}
              onSecondaryAction={() => setMenuOpen(true)}
            />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <SolarExplorer />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <BlackHoleSimulation onWarp={() => playInteraction('warp')} />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <UniverseTimeline />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <MissionFeed />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <ConstellationCanvas />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <JoinMission />
          </ErrorBoundary>
        </Suspense>
      </main>

      <AstroBot />
    </div>
  );
}
