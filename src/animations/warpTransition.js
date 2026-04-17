import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Creates a scroll-linked warp translation for a target element.
 * @param {HTMLElement | null} element
 * @param {number} distance
 * @returns {() => void}
 */
export function createWarpTransition(element, distance = 120) {
  if (!element) {
    return () => {};
  }

  gsap.registerPlugin(ScrollTrigger);

  const tween = gsap.fromTo(
    element,
    { y: distance, opacity: 0.5 },
    {
      y: 0,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
