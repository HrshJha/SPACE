import { gsap } from 'gsap';

/**
 * Animates a set of character spans into a holographic lock-on effect.
 * @param {HTMLElement | null} element
 */
export function createStardustTextReveal(element) {
  if (!element) {
    return;
  }

  const chars = element.querySelectorAll('[data-char]');

  gsap.fromTo(
    chars,
    {
      opacity: 0,
      yPercent: 70,
      filter: 'blur(18px)',
    },
    {
      opacity: 1,
      yPercent: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      stagger: 0.04,
      ease: 'power3.out',
    },
  );
}
