import { cosmicPalette } from '../constants/cosmicPalette.js';

export const heroQuote = {
  text: 'Somewhere, something incredible is waiting to be known.',
  author: 'Carl Sagan',
};

export const cosmicFacts = [
  'A teaspoon of neutron-star matter would weigh about a billion tons on Earth.',
  'The cosmic microwave background is light released when the universe was only about 380,000 years old.',
  'Jupiter’s moon Europa likely hides a global saltwater ocean beneath its icy crust.',
  'A black hole with more mass actually has a lower Hawking temperature.',
  'The Milky Way and Andromeda are on course to merge in roughly 4.5 billion years.',
];

export const timelineEvents = [
  {
    label: 'Quark Epoch',
    age: '10^-12 s',
    description:
      'Matter had not yet assembled into protons and neutrons; the universe was a quantum plasma of fundamental particles.',
    accent: cosmicPalette.starlightWhite,
  },
  {
    label: 'CMB Release',
    age: '380,000 years',
    description:
      'Electrons and protons combined into neutral atoms, allowing the first free light to stream across the cosmos.',
    accent: '#f2d8a7',
  },
  {
    label: 'First Stars',
    age: '200 million years',
    description:
      'Population III stars ignited and seeded the universe with the first heavy elements forged in stellar cores.',
    accent: cosmicPalette.nebulaBlue,
  },
  {
    label: 'First Galaxies',
    age: '500 million years',
    description:
      'Dark matter halos and baryonic gas assembled into the first persistent galactic structures.',
    accent: cosmicPalette.quantumPurple,
  },
  {
    label: 'Solar System',
    age: '4.6 billion years ago',
    description:
      'Dust and gas around the young Sun collided, accreted, and sculpted the planetary architecture we live within today.',
    accent: cosmicPalette.plasmaOrange,
  },
  {
    label: 'Life on Earth',
    age: '3.8 billion years ago',
    description:
      'The earliest evidence of life suggests biology took hold surprisingly soon after Earth cooled.',
    accent: '#7dd3fc',
  },
  {
    label: 'Observable Universe',
    age: 'Now',
    description:
      'Galaxies, filaments, voids, and dark-energy-driven expansion define the current cosmic large-scale structure.',
    accent: cosmicPalette.nebulaBlue,
  },
  {
    label: 'Heat Death',
    age: 'Far Future',
    description:
      'If dark energy continues dominating, stars die out, black holes evaporate, and thermodynamic free energy approaches zero.',
    accent: cosmicPalette.horizon,
  },
];

export const curatedMissions = [
  {
    id: 'voyager-1',
    title: 'Voyager 1',
    category: 'Missions',
    year: '1977-Present',
    description:
      'Humanity’s farthest spacecraft crossed the heliopause and now samples the plasma of interstellar space.',
  },
  {
    id: 'hubble-deep-field',
    title: 'Hubble Deep Field',
    category: 'Discoveries',
    year: '1995',
    description:
      'A tiny dark patch of sky revealed thousands of galaxies and changed how we imagine cosmic depth.',
  },
  {
    id: 'jwst',
    title: 'James Webb Space Telescope',
    category: 'Telescopes',
    year: '2021-Present',
    description:
      'Infrared eyes now pierce stellar nurseries, early galaxies, and the atmospheres of distant exoplanets.',
  },
  {
    id: 'kepler',
    title: 'Kepler',
    category: 'Exoplanets',
    year: '2009-2018',
    description:
      'Kepler turned exoplanets from isolated curiosities into a statistical population and proved that planets are common across the Milky Way.',
  },
  {
    id: 'cassini',
    title: 'Cassini-Huygens',
    category: 'Missions',
    year: '1997-2017',
    description:
      'Cassini transformed Saturn from a silhouette into an entire world-system of rings, moons, storms, and chemistry.',
  },
  {
    id: 'perseverance',
    title: 'Perseverance',
    category: 'Missions',
    year: '2021-Present',
    description:
      'The rover is caching Martian samples while the Ingenuity flights rewrote expectations for another planet’s sky.',
  },
  {
    id: 'tess',
    title: 'TESS',
    category: 'Exoplanets',
    year: '2018-Present',
    description:
      'The Transiting Exoplanet Survey Satellite scans almost the entire sky, prioritizing nearby stars whose planets can be studied in detail.',
  },
];

export const nasaApodFallback = [
  {
    title: 'Pillars of Creation',
    date: '2024-10-18',
    explanation:
      'Columns of cold gas in the Eagle Nebula host star formation sculpted by ultraviolet radiation from nearby young stars.',
    url: 'https://images-assets.nasa.gov/image/PIA16239/PIA16239~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA16239/PIA16239~orig.jpg',
  },
  {
    title: 'Orion in Infrared',
    date: '2025-01-11',
    explanation:
      'Infrared imaging peels back visible-light dust to reveal star birth and turbulent gas in the Orion molecular cloud.',
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001832/GSFC_20171208_Archive_e001832~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001832/GSFC_20171208_Archive_e001832~orig.jpg',
  },
  {
    title: 'Saturn from Cassini',
    date: '2024-07-03',
    explanation:
      'Backlit ring geometry turned Saturn into a luminous system of ice, dust, and shadow layered across the void.',
    url: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~orig.jpg',
  },
];

export const donkiFallback = [
  {
    activityID: 'FLR-STATIC-001',
    classType: 'M1.2',
    sourceLocation: 'AR3559',
    beginTime: '2026-04-11T02:17Z',
    note: 'Static fallback flare feed shown when live DONKI data is unavailable.',
  },
  {
    activityID: 'CME-STATIC-002',
    classType: 'Halo CME',
    sourceLocation: 'AR3561',
    beginTime: '2026-04-12T14:43Z',
    note: 'Coronal mass ejection candidate with moderate geomagnetic response potential.',
  },
];

export const cosmosPrompts = [
  'What is inside a black hole?',
  'How big is the observable universe?',
  'What would happen if I fell into a neutron star?',
];

export const externalLinks = [
  { label: 'NASA', href: 'https://www.nasa.gov/' },
  { label: 'ESA', href: 'https://www.esa.int/' },
  { label: 'SpaceX', href: 'https://www.spacex.com/' },
  { label: 'JWST', href: 'https://webb.nasa.gov/' },
];

export const cosmosFallbackAnswers = [
  {
    match: /black hole/i,
    answer:
      'General relativity predicts that once matter passes the event horizon, every future-directed path points inward. We do not yet have a tested quantum theory of the singular interior, so the honest answer is: physics becomes incomplete exactly where the question becomes most extreme.',
  },
  {
    match: /observable universe/i,
    answer:
      'The observable universe is about 93 billion light-years across today because space itself has expanded while the light was traveling. That is why its radius is far larger than 13.8 billion light-years.',
  },
  {
    match: /neutron star/i,
    answer:
      'You would never land. Tidal forces, intense radiation, and magnetic fields would dismantle ordinary matter long before you reached the surface, and the star’s gravity would compress what remained into an unrecognizable state.',
  },
];
