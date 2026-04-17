import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNASAApi } from '../../hooks/useNASAApi.js';
import { curatedMissions } from '../../utils/spaceData.js';
import { useCosmosStore } from '../../store/useCosmosStore.js';
import CosmicCard from '../ui/CosmicCard.jsx';

const filters = ['All', 'Missions', 'Telescopes', 'Discoveries', 'Exoplanets'];

export function MissionFeed() {
  const { loading, apod, donki, error } = useNASAApi();
  const missionFilter = useCosmosStore((state) => state.missionFilter);
  const setMissionFilter = useCosmosStore((state) => state.setMissionFilter);
  const selectedMission = useCosmosStore((state) => state.selectedMission);
  const setSelectedMission = useCosmosStore((state) => state.setSelectedMission);
  const filteredMissions = useMemo(
    () =>
      missionFilter === 'All'
        ? curatedMissions
        : curatedMissions.filter((mission) => mission.category === missionFilter),
    [missionFilter],
  );

  return (
    <section id="missions" className="section-shell relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="hud-label">Section 05 // Missions & Discoveries</p>
            <h2 className="section-title max-w-3xl">
              NASA imagery overhead, space weather in motion, and the missions that taught us scale.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setMissionFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  missionFilter === filter
                    ? 'border-white/40 bg-white/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/[0.65] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(loading ? curatedMissions : apod).slice(0, 6).map((item) => (
              <CosmicCard
                key={item.title}
                className="group cursor-pointer overflow-hidden p-0"
                onClick={() => setSelectedMission(item)}
              >
                {'url' in item ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-48 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-48 bg-[radial-gradient(circle_at_top,rgba(74,158,255,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.32))]" />
                )}
                <div className="space-y-3 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/[0.45]">
                    {'date' in item ? item.date : item.year}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-white/70">
                    {('explanation' in item ? item.explanation : item.description).slice(0, 120)}
                    ...
                  </p>
                </div>
              </CosmicCard>
            ))}
          </div>
          <div className="space-y-6">
            <CosmicCard className="space-y-4 bg-black/[0.45]">
              <p className="hud-label">Space Weather Today</p>
              {donki.map((entry) => (
                <div key={entry.activityID} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/[0.45]">
                    {entry.beginTime}
                  </p>
                  <p className="mt-2 text-lg text-white">
                    {entry.classType ?? entry.messageType}
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {entry.note ?? entry.messageBody ?? entry.sourceLocation}
                  </p>
                </div>
              ))}
              {error ? (
                <p className="text-sm text-white/[0.55]">
                  Live feed unavailable, so the module is showing static fallback data.
                </p>
              ) : null}
            </CosmicCard>
            <CosmicCard className="space-y-4 bg-black/[0.45]">
              <p className="hud-label">Curated Missions</p>
              {filteredMissions.map((mission) => (
                <button
                  key={mission.id}
                  type="button"
                  onClick={() => setSelectedMission(mission)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-nebula-blue/30"
                >
                  <p className="font-display text-xl font-bold text-white">{mission.title}</p>
                  <p className="mt-2 text-sm text-white/[0.65]">{mission.description}</p>
                </button>
              ))}
            </CosmicCard>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedMission ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[72] flex items-center justify-center bg-black/75 p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-black/[0.85]"
            >
              {'url' in selectedMission ? (
                <img
                  src={selectedMission.hdurl ?? selectedMission.url}
                  alt={selectedMission.title}
                  className="h-72 w-full object-cover"
                />
              ) : null}
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/[0.45]">
                      {'date' in selectedMission ? selectedMission.date : selectedMission.year}
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-black text-white">
                      {selectedMission.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMission(null)}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-white/70"
                    aria-label="Close mission details"
                  >
                    Close
                  </button>
                </div>
                <p className="text-lg leading-relaxed text-white/[0.76]">
                  {'explanation' in selectedMission
                    ? selectedMission.explanation
                    : selectedMission.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default MissionFeed;
