import { create } from 'zustand';

const zoneOrder = [
  'hero',
  'solar',
  'blackhole',
  'timeline',
  'missions',
  'constellations',
  'contact',
];

export const useCosmosStore = create((set) => ({
  loaderComplete: false,
  scrollProgress: 0,
  activeZone: 'hero',
  audioEnabled: false,
  soundReady: false,
  menuOpen: false,
  chatbotOpen: false,
  selectedPlanetId: 'earth',
  selectedMission: null,
  missionFilter: 'All',
  blackHoleMass: 35,
  horizonApproach: 0,
  jetPulse: 0,
  realityTear: false,
  temporaryMassPoint: {
    x: 0.5,
    y: 0.5,
    active: false,
    strength: 0,
    expiresAt: 0,
  },
  cursor: {
    x: 0,
    y: 0,
    velocity: 0,
    mass: 1,
    hovering: false,
    visible: false,
  },
  setLoaderComplete: (value) => set({ loaderComplete: value }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setActiveZone: (activeZone) => set({ activeZone }),
  setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
  setSoundReady: (soundReady) => set({ soundReady }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setChatbotOpen: (chatbotOpen) => set({ chatbotOpen }),
  setSelectedPlanetId: (selectedPlanetId) => set({ selectedPlanetId }),
  setSelectedMission: (selectedMission) => set({ selectedMission }),
  setMissionFilter: (missionFilter) => set({ missionFilter }),
  setBlackHoleMass: (updater) =>
    set((state) => ({
      blackHoleMass:
        typeof updater === 'function' ? updater(state.blackHoleMass) : updater,
    })),
  setJetPulse: (updater) =>
    set((state) => ({
      jetPulse: typeof updater === 'function' ? updater(state.jetPulse) : updater,
    })),
  setHorizonApproach: (horizonApproach) => set({ horizonApproach }),
  setRealityTear: (realityTear) => set({ realityTear }),
  setTemporaryMassPoint: (updater) =>
    set((state) => ({
      temporaryMassPoint:
        typeof updater === 'function'
          ? updater(state.temporaryMassPoint)
          : {
              ...state.temporaryMassPoint,
              ...updater,
            },
    })),
  setCursor: (cursor) =>
    set((state) => ({
      cursor: {
        ...state.cursor,
        ...cursor,
      },
    })),
  syncZoneFromProgress: (progress) =>
    set(() => {
      const thresholds = [0.14, 0.3, 0.49, 0.68, 0.82, 0.93];
      const zoneIndex = thresholds.findIndex((threshold) => progress < threshold);

      return {
        activeZone:
          zoneIndex === -1 ? zoneOrder[zoneOrder.length - 1] : zoneOrder[zoneIndex],
      };
    }),
}));
