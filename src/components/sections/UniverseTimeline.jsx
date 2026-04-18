import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CosmicCard from '../ui/CosmicCard.jsx';
import { timelineEvents } from '../../utils/spaceData.js';

export function UniverseTimeline() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.set(track, { x: 0 });
      gsap.to(track, {
        x: () => -(track.scrollWidth - section.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  const currentEvent =
    timelineEvents[
      Math.min(
        timelineEvents.length - 1,
        Math.round(progress * (timelineEvents.length - 1)),
      )
    ];

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="section-shell cosmos-section timeline-section relative"
    >
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10 pt-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="hud-label">Section 04 // Timeline of the Universe</p>
            <h2 className="section-title max-w-4xl">
              From the first light to the final cooling of structure.
            </h2>
            <p className="section-copy">
              Scroll the chronology and watch the observable universe move from plasma to
              galaxies, from a young Sun to a dim far-future sky with no free energy left to spend.
            </p>
          </div>
          <div className="self-start rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.3em] text-white/[0.65]">
            {currentEvent.age}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div ref={trackRef} className="timeline-track absolute left-0 top-0 h-full pb-24 pt-8">
            {timelineEvents.map((event) => (
              <CosmicCard
                key={event.label}
                className="timeline-card min-h-[24rem] bg-black/42"
              >
                <div
                  className="mb-6 h-1.5 w-24 rounded-full"
                  style={{ background: event.accent }}
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/[0.45]">
                  {event.age}
                </p>
                <h3 className="mt-5 font-display text-[clamp(1.6rem,2vw,2.2rem)] font-black text-white">
                  {event.label}
                </h3>
                <p className="clamp-3 mt-5 text-[clamp(0.95rem,1vw,1.05rem)] leading-8 text-white/[0.74]">
                  {event.description}
                </p>
              </CosmicCard>
            ))}
          </div>
        </div>

        <div className="timeline-bar mx-auto w-full max-w-7xl">
          <div className="relative h-12">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
            <div
              className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-nebula-blue via-quantum to-plasma"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="timeline-dot"
              style={{ transform: `translate3d(calc(${progress * 100}% - 8px), -50%, 0)` }}
            />
          </div>
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-white/45">
            <span>Big Bang</span>
            <span>{currentEvent.label}</span>
            <span>Heat Death</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UniverseTimeline;
