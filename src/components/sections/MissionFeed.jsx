import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNASAApi } from '../../hooks/useNASAApi.js';
import {
  curatedMissions,
  ISRO_MISSIONS,
} from '../../utils/spaceData.js';
import { useCosmosStore } from '../../store/useCosmosStore.js';
import CosmicCard from '../ui/CosmicCard.jsx';
import GlowButton from '../ui/GlowButton.jsx';

const filters = ['All', 'Missions', 'Telescopes', 'Discoveries', 'Exoplanets'];

function cleanText(value) {
  return String(value ?? '')
    .replace(/#+\s*/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getWeatherTone(code) {
  const label = String(code ?? '').toUpperCase();

  if (label === 'GST') {
    return '#FF6B35';
  }

  if (label === 'RBE') {
    return '#00C2FF';
  }

  if (label === 'CME') {
    return '#A78BFA';
  }

  if (label === 'FLR') {
    return '#FFB347';
  }

  return '#6A5CFF';
}

function formatWeatherDate(value) {
  if (!value) {
    return 'Latest analyzed alert';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date);
}

function MissionCard({ item, onOpen, accent = '#00C2FF', badge }) {
  const image = item.url ?? item.hdurl ?? item.image;
  const dateLabel = item.date ?? item.year;
  const description = cleanText(item.explanation ?? item.description);

  return (
    <CosmicCard className="group overflow-hidden p-0">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="block w-full text-left"
        aria-label={`Read more about ${item.title}`}
      >
        <div className="relative aspect-video overflow-hidden border-b border-white/10">
          <img
            src={image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          {badge ? (
            <span
              className="absolute left-4 top-4 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.32em]"
              style={{
                borderColor: `${accent}66`,
                backgroundColor: `${accent}22`,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {badge}
            </span>
          ) : null}
        </div>
        <div className="space-y-3 p-5">
          <p
            className="text-[12px] uppercase tracking-[0.08em]"
            style={{ color: accent, fontFamily: '"DM Sans", sans-serif' }}
          >
            {dateLabel}
          </p>
          <h3 className="clamp-2 font-display text-[18px] font-bold text-[rgba(255,255,255,0.92)]">
            {item.title}
          </h3>
          <p className="clamp-3 text-sm font-light leading-6 text-[rgba(255,255,255,0.6)]">
            {description}
          </p>
          <span className="inline-flex pt-2 font-mono text-[11px] uppercase tracking-[0.26em] text-white/72">
            Read More
          </span>
        </div>
      </button>
    </CosmicCard>
  );
}

function WeatherCard({ entry, onOpen }) {
  const tone = getWeatherTone(entry.code);

  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="cosmic-card w-full text-left"
      style={{
        borderColor: `${tone}40`,
        boxShadow: `0 0 28px ${tone}12, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
      aria-label={`Open ${entry.code} space weather details`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            {formatWeatherDate(entry.issuedAt)}
          </p>
          <h4 className="mt-3 font-display text-lg font-bold text-white">
            {entry.title}
          </h4>
        </div>
        <span
          className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ backgroundColor: `${tone}22`, color: tone }}
        >
          {entry.code}
        </span>
      </div>
      <p className="mt-4 clamp-2 text-sm leading-6 text-white/68">{entry.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/52">
          {entry.sourceLocation}
        </span>
        {entry.affectedAssets?.length ? (
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/52">
            {entry.affectedAssets.length} affected assets
          </span>
        ) : null}
      </div>
      <span className="mt-4 inline-flex font-mono text-[11px] uppercase tracking-[0.26em] text-white/74">
        Open Alert
      </span>
    </button>
  );
}

function SkeletonCard() {
  return (
    <CosmicCard className="overflow-hidden p-0 animate-pulse">
      <div className="aspect-video bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.1),rgba(255,255,255,0.04))]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 rounded-full bg-white/10" />
        <div className="h-5 w-4/5 rounded-full bg-white/10" />
        <div className="h-4 w-full rounded-full bg-white/10" />
        <div className="h-4 w-2/3 rounded-full bg-white/10" />
      </div>
    </CosmicCard>
  );
}

export function MissionFeed() {
  const { loading, apod, donki, error } = useNASAApi();
  const missionFilter = useCosmosStore((state) => state.missionFilter);
  const setMissionFilter = useCosmosStore((state) => state.setMissionFilter);
  const selectedMission = useCosmosStore((state) => state.selectedMission);
  const setSelectedMission = useCosmosStore((state) => state.setSelectedMission);
  const [selectedWeather, setSelectedWeather] = useState(null);

  const filteredMissions = useMemo(
    () =>
      missionFilter === 'All'
        ? curatedMissions
        : curatedMissions.filter((mission) => mission.category === missionFilter),
    [missionFilter],
  );

  return (
    <section id="missions" className="section-shell cosmos-section relative min-h-screen">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="hud-label">Section 05 // Missions & Discoveries</p>
            <h2 className="section-title max-w-4xl">
              NASA imagery overhead, live space weather below, and the missions that taught us scale.
            </h2>
            <p className="section-copy">
              The gallery stays alive even when the network goes dark. Live APOD and DONKI
              data are preferred, but the archive never collapses into empty space.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setMissionFilter(filter)}
                className={`glow-button-primary ${missionFilter === filter ? '' : 'glow-button-secondary'}`}
                aria-label={`Filter mission archive by ${filter}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 3 }, (_, index) => <SkeletonCard key={index} />)
                : apod.slice(0, 6).map((item) => (
                    <MissionCard
                      key={`${item.title}-${item.date}`}
                      item={item}
                      onOpen={setSelectedMission}
                    />
                  ))}
            </div>
            <CosmicCard className="space-y-5 bg-black/[0.45]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="hud-label">Mission Archive</p>
                  <h3 className="mt-3 font-display text-2xl font-black text-white">
                    Deep-space instruments, probes, and decisive observations
                  </h3>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {filteredMissions.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    item={mission}
                    onOpen={setSelectedMission}
                    accent="#00C2FF"
                  />
                ))}
              </div>
            </CosmicCard>
          </div>

          <div className="space-y-6">
            <CosmicCard className="space-y-5 bg-black/[0.45]">
              <div className="space-y-2">
                <p className="hud-label">Space Weather Today</p>
                <p className="text-sm leading-6 text-white/62">
                  Latest DONKI-analyzed alert per event class. Repeated update chains are
                  collapsed so this panel stays readable.
                </p>
              </div>
              <div className="space-y-4">
                {donki.map((entry) => (
                  <WeatherCard
                    key={entry.id}
                    entry={entry}
                    onOpen={setSelectedWeather}
                  />
                ))}
              </div>
              {error ? (
                <p className="text-sm text-white/[0.55]">
                  Live feed unavailable. COSMOS is rendering the onboard weather archive instead.
                </p>
              ) : null}
            </CosmicCard>

            <CosmicCard className="space-y-4 bg-black/[0.45]">
              <p className="hud-label">Archive Integrity</p>
              <p className="copy-measure mt-0 text-sm text-white/[0.66]">
                APOD cards follow a fixed 16:9 media frame, lazy-loaded imagery, and a stable
                fallback archive. Space weather entries are normalized from DONKI notifications,
                deduped by event class, and opened on demand for the full analysis text.
              </p>
            </CosmicCard>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="hud-label" style={{ color: '#FF9933' }}>
              ISRO Deep Archive
            </p>
            <h3 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] font-black text-white">
              BHARAT&apos;S COSMIC FRONTIER
            </h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ISRO_MISSIONS.map((mission) => (
              <MissionCard
                key={mission.id}
                item={mission}
                onOpen={setSelectedMission}
                accent="#FF9933"
                badge="🇮🇳 ISRO"
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMission ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[72] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="cosmic-card max-h-[88vh] w-full max-w-4xl overflow-hidden border-white/12 bg-black/[0.88] p-0"
            >
              <img
                src={selectedMission.hdurl ?? selectedMission.url ?? selectedMission.image}
                alt={selectedMission.title}
                className="aspect-video w-full object-cover"
              />
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/[0.45]">
                      {selectedMission.date ?? selectedMission.year}
                    </p>
                    <h3 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] font-black text-white">
                      {selectedMission.title}
                    </h3>
                  </div>
                  <GlowButton
                    variant="ghost"
                    onClick={() => setSelectedMission(null)}
                    aria-label="Close mission details"
                  >
                    Close
                  </GlowButton>
                </div>
                <p className="text-base leading-8 text-white/[0.76]">
                  {cleanText(
                    selectedMission.details ??
                      selectedMission.explanation ??
                      selectedMission.description,
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedWeather ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[73] flex items-center justify-center bg-black/82 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="cosmic-card w-full max-w-3xl border-white/12 bg-black/[0.9]"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/[0.45]">
                    {formatWeatherDate(selectedWeather.issuedAt)}
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.75rem)] font-black text-white">
                    {selectedWeather.title}
                  </h3>
                </div>
                <GlowButton
                  variant="ghost"
                  onClick={() => setSelectedWeather(null)}
                  aria-label="Close space weather details"
                >
                  Close
                </GlowButton>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span
                  className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em]"
                  style={{
                    backgroundColor: `${getWeatherTone(selectedWeather.code)}22`,
                    color: getWeatherTone(selectedWeather.code),
                  }}
                >
                  {selectedWeather.code}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/58">
                  {selectedWeather.sourceLocation}
                </span>
                {selectedWeather.affectedAssets?.length ? (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/58">
                    {selectedWeather.affectedAssets.join(' • ')}
                  </span>
                ) : null}
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                    Summary
                  </p>
                  <p className="mt-3 text-base leading-8 text-white/76">
                    {selectedWeather.summary}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                    Full DONKI Analysis
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/64">
                    {selectedWeather.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default MissionFeed;
