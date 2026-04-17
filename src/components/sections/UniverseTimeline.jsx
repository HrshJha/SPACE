import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CosmicCard from '../ui/CosmicCard.jsx';
import { timelineEvents } from '../../utils/spaceData.js';

export function UniverseTimeline() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) {
      return undefined;
    }

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 120),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress),
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const currentEvent =
    timelineEvents[Math.min(timelineEvents.length - 1, Math.round(progress * (timelineEvents.length - 1)))];

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="section-shell relative h-[320vh] px-6 py-24"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-6 pb-12 pt-28">
          <div>
            <p className="hud-label">Section 04 // Timeline of the Universe</p>
            <h2 className="section-title max-w-3xl">
              From the first light to the final cooling of structure.
            </h2>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.3em] text-white/[0.65] md:block">
            {currentEvent.age}
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="absolute left-0 top-0 flex h-full items-center gap-8 pr-20"
            style={{ width: `${timelineEvents.length * 32}rem` }}
          >
            {timelineEvents.map((event) => (
              <CosmicCard
                key={event.label}
                className="mx-3 min-h-[22rem] w-[26rem] flex-shrink-0 bg-black/40"
              >
                <div
                  className="mb-6 h-1 w-24 rounded-full"
                  style={{ background: event.accent }}
                />
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/[0.45]">
                  {event.age}
                </p>
                <h3 className="mt-5 font-display text-4xl font-black text-white">
                  {event.label}
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-white/[0.74]">
                  {event.description}
                </p>
              </CosmicCard>
            ))}
          </div>
          <div className="absolute bottom-10 left-6 right-6 h-px bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-nebula-blue via-quantum to-plasma"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default UniverseTimeline;
