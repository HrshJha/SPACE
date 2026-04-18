import { cosmicPalette } from '../constants/cosmicPalette.js';

function createMissionPlate(title, accentStart, accentEnd, subtitle) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#000000" />
          <stop offset="48%" stop-color="#050510" />
          <stop offset="100%" stop-color="#0b1020" />
        </linearGradient>
        <radialGradient id="haloA" cx="28%" cy="34%" r="45%">
          <stop offset="0%" stop-color="${accentStart}" stop-opacity="0.92" />
          <stop offset="100%" stop-color="${accentStart}" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="haloB" cx="78%" cy="22%" r="38%">
          <stop offset="0%" stop-color="${accentEnd}" stop-opacity="0.75" />
          <stop offset="100%" stop-color="${accentEnd}" stop-opacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)" />
      <rect width="1600" height="900" fill="url(#haloA)" />
      <rect width="1600" height="900" fill="url(#haloB)" />
      <g fill="white" opacity="0.72">
        <circle cx="124" cy="118" r="2" />
        <circle cx="290" cy="208" r="1.8" />
        <circle cx="612" cy="148" r="1.4" />
        <circle cx="804" cy="264" r="2.1" />
        <circle cx="1098" cy="180" r="1.6" />
        <circle cx="1386" cy="132" r="2.2" />
        <circle cx="1438" cy="324" r="1.4" />
        <circle cx="352" cy="392" r="1.5" />
        <circle cx="508" cy="514" r="2" />
        <circle cx="1322" cy="478" r="1.3" />
      </g>
      <ellipse cx="1160" cy="518" rx="320" ry="142" fill="${accentEnd}" opacity="0.18" filter="url(#glow)" />
      <ellipse cx="1142" cy="510" rx="240" ry="86" fill="${accentStart}" opacity="0.2" filter="url(#glow)" />
      <path d="M0 712 C258 586 436 608 738 730 C1010 840 1298 838 1600 664 L1600 900 L0 900 Z" fill="rgba(255,255,255,0.03)" />
      <rect x="84" y="84" width="356" height="48" rx="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
      <text x="116" y="116" fill="rgba(255,255,255,0.72)" font-family="Inter, Arial, sans-serif" font-size="24" letter-spacing="6">${subtitle}</text>
      <text x="84" y="734" fill="rgba(255,255,255,0.96)" font-family="Orbitron, Exo 2, Arial, sans-serif" font-size="88" font-weight="800">${title}</text>
      <text x="88" y="798" fill="rgba(255,255,255,0.58)" font-family="Inter, Arial, sans-serif" font-size="28">Static mission archive fallback rendered inside COSMOS.</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const PLANET_TEXTURES = {
  mercury: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
  venus: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
  earth: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
  mars: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
  jupiter: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
  saturn: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
  uranus: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
  neptune: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
};

export const planetaryProfiles = {
  mercury: {
    name: 'Mercury',
    type: 'Terrestrial planet',
    diameter: '4,879 km',
    mass: '3.3011 × 10^23 kg',
    gravity: '3.70 m/s²',
    moons: 'None',
    orbitalPeriod: '87.97 Earth days',
    distanceFromSun: '57.9 million km',
    avgTemperature: '167°C average surface temperature',
    axialTilt: '0.03°',
    atmosphere:
      'A surface-bounded exosphere of oxygen, sodium, hydrogen, helium, and potassium.',
    fact:
      'Mercury’s core is so large that it occupies roughly 85% of the planet’s radius, making it the most metal-dominated terrestrial world in the Solar System.',
    mission: 'MESSENGER',
    texture: PLANET_TEXTURES.mercury,
  },
  venus: {
    name: 'Venus',
    type: 'Terrestrial planet',
    diameter: '12,104 km',
    mass: '4.8675 × 10^24 kg',
    gravity: '8.87 m/s²',
    moons: 'None',
    orbitalPeriod: '224.7 Earth days',
    distanceFromSun: '108.2 million km',
    avgTemperature: '464°C mean surface temperature',
    axialTilt: '177.4°',
    atmosphere:
      'About 96.5% carbon dioxide and 3.5% nitrogen with sulfuric-acid cloud decks.',
    fact:
      'Venus is hot enough to melt lead because its dense carbon-dioxide atmosphere traps outgoing heat in a runaway greenhouse state.',
    mission: 'Magellan',
    texture: PLANET_TEXTURES.venus,
  },
  earth: {
    name: 'Earth',
    type: 'Ocean-bearing terrestrial planet',
    diameter: '12,742 km',
    mass: '5.97237 × 10^24 kg',
    gravity: '9.81 m/s²',
    moons: 'Moon',
    orbitalPeriod: '365.25 days',
    distanceFromSun: '149.6 million km',
    avgTemperature: '15°C global mean surface temperature',
    axialTilt: '23.44°',
    atmosphere:
      '78% nitrogen, 21% oxygen, with argon, water vapor, and trace greenhouse gases.',
    fact:
      'Earth is the only known planet where plate tectonics, persistent surface water, and a biologically reshaped atmosphere operate together.',
    mission: 'Apollo 11',
    texture: PLANET_TEXTURES.earth,
  },
  mars: {
    name: 'Mars',
    type: 'Cold desert terrestrial planet',
    diameter: '6,779 km',
    mass: '6.4171 × 10^23 kg',
    gravity: '3.71 m/s²',
    moons: 'Phobos, Deimos',
    orbitalPeriod: '687 Earth days',
    distanceFromSun: '227.9 million km',
    avgTemperature: '-63°C mean surface temperature',
    axialTilt: '25.19°',
    atmosphere: 'Mostly carbon dioxide with nitrogen, argon, and trace oxygen and water vapor.',
    fact:
      'Ancient valley networks and mineral deposits show that Mars once sustained long-lived liquid water at the surface.',
    mission: 'Perseverance',
    texture: PLANET_TEXTURES.mars,
  },
  jupiter: {
    name: 'Jupiter',
    type: 'Gas giant',
    diameter: '139,820 km',
    mass: '1.8982 × 10^27 kg',
    gravity: '24.79 m/s²',
    moons: 'Io, Europa, Ganymede, Callisto',
    orbitalPeriod: '11.86 Earth years',
    distanceFromSun: '778.5 million km',
    avgTemperature: '-110°C at cloud tops',
    axialTilt: '3.13°',
    atmosphere: 'Predominantly hydrogen and helium with ammonia, methane, and water vapor traces.',
    fact:
      'Jupiter’s magnetic field is so large that it traps intense radiation belts and generates aurorae brighter than any on Earth.',
    mission: 'Juno',
    texture: PLANET_TEXTURES.jupiter,
  },
  saturn: {
    name: 'Saturn',
    type: 'Ringed gas giant',
    diameter: '116,460 km',
    mass: '5.6834 × 10^26 kg',
    gravity: '10.44 m/s²',
    moons: 'Titan, Enceladus, Rhea, Mimas',
    orbitalPeriod: '29.46 Earth years',
    distanceFromSun: '1.43 billion km',
    avgTemperature: '-140°C at cloud tops',
    axialTilt: '26.73°',
    atmosphere: 'Hydrogen and helium with methane, ammonia, and hydrocarbon hazes.',
    fact:
      'Saturn’s rings are astonishingly thin compared with their width, with most bright structure confined to only tens of meters in vertical thickness.',
    mission: 'Cassini-Huygens',
    texture: PLANET_TEXTURES.saturn,
  },
  uranus: {
    name: 'Uranus',
    type: 'Ice giant',
    diameter: '50,724 km',
    mass: '8.6810 × 10^25 kg',
    gravity: '8.69 m/s²',
    moons: 'Titania, Oberon, Ariel, Umbriel, Miranda',
    orbitalPeriod: '84 Earth years',
    distanceFromSun: '2.87 billion km',
    avgTemperature: '-195°C upper atmosphere',
    axialTilt: '97.77°',
    atmosphere: 'Hydrogen, helium, and methane above a deep mantle rich in water, ammonia, and methane ices.',
    fact:
      'Uranus appears to roll around the Sun because a likely ancient impact tipped the whole planet nearly onto its side.',
    mission: 'Voyager 2',
    texture: PLANET_TEXTURES.uranus,
  },
  neptune: {
    name: 'Neptune',
    type: 'Dynamic ice giant',
    diameter: '49,244 km',
    mass: '1.02413 × 10^26 kg',
    gravity: '11.15 m/s²',
    moons: 'Triton, Nereid, Proteus, Larissa',
    orbitalPeriod: '164.8 Earth years',
    distanceFromSun: '4.50 billion km',
    avgTemperature: '-200°C upper atmosphere',
    axialTilt: '28.32°',
    atmosphere: 'Hydrogen, helium, methane, and high-altitude hazes above a volatile-rich interior.',
    fact:
      'Despite receiving little sunlight, Neptune drives supersonic winds and giant storms using internal heat leaking outward.',
    mission: 'Voyager 2',
    texture: PLANET_TEXTURES.neptune,
  },
};

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
    accent: cosmicPalette.nebulaBlue,
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
    details:
      'Voyager 1 carries the Golden Record and is the first human-made object to operate in interstellar space, still returning plasma-wave and particle data.',
    image: createMissionPlate('VOYAGER I', cosmicPalette.nebulaBlue, cosmicPalette.quantumPurple, 'INTERSTELLAR PROBE'),
  },
  {
    id: 'hubble-deep-field',
    title: 'Hubble Deep Field',
    category: 'Discoveries',
    year: '1995',
    description:
      'A tiny dark patch of sky revealed thousands of galaxies and changed how we imagine cosmic depth.',
    details:
      'By staring at what looked like empty space for days, Hubble transformed a speck of darkness into a census of early galaxies and a lesson in scale.',
    image: createMissionPlate('DEEP FIELD', cosmicPalette.quantumPurple, cosmicPalette.nebulaBlue, 'HUBBLE LEGACY'),
  },
  {
    id: 'jwst',
    title: 'James Webb Space Telescope',
    category: 'Telescopes',
    year: '2021-Present',
    description:
      'Infrared eyes now pierce stellar nurseries, early galaxies, and the atmospheres of distant exoplanets.',
    details:
      'JWST observes the infrared universe from Sun-Earth L2, combining an actively cooled architecture with a 6.5-meter segmented mirror.',
    image: createMissionPlate('JWST', cosmicPalette.nebulaBlue, cosmicPalette.plasmaOrange, 'INFRARED COSMOS'),
  },
  {
    id: 'kepler',
    title: 'Kepler',
    category: 'Exoplanets',
    year: '2009-2018',
    description:
      'Kepler turned exoplanets from isolated curiosities into a statistical population and proved that planets are common across the Milky Way.',
    details:
      'Kepler watched the brightness of over 150,000 stars to catch planetary transits and changed the exoplanet question from whether planets exist to how many worlds there are.',
    image: createMissionPlate('KEPLER', cosmicPalette.quantumPurple, cosmicPalette.plasmaOrange, 'EXOPLANET SURVEYOR'),
  },
  {
    id: 'cassini',
    title: 'Cassini-Huygens',
    category: 'Missions',
    year: '1997-2017',
    description:
      'Cassini transformed Saturn from a silhouette into an entire world-system of rings, moons, storms, and chemistry.',
    details:
      'Cassini mapped ring dynamics, sampled Enceladus plume chemistry, and dropped Huygens through Titan’s atmosphere to its surface.',
    image: createMissionPlate('CASSINI', cosmicPalette.plasmaOrange, cosmicPalette.nebulaBlue, 'SATURN SYSTEM'),
  },
  {
    id: 'perseverance',
    title: 'Perseverance',
    category: 'Missions',
    year: '2021-Present',
    description:
      'The rover is caching Martian samples while Ingenuity rewrote expectations for another planet’s sky.',
    details:
      'Perseverance explores Jezero Crater for biosignature-bearing rocks and packages samples for a future return campaign.',
    image: createMissionPlate('PERSEVERANCE', cosmicPalette.plasmaOrange, cosmicPalette.quantumPurple, 'MARS SAMPLE CACHE'),
  },
  {
    id: 'tess',
    title: 'TESS',
    category: 'Exoplanets',
    year: '2018-Present',
    description:
      'TESS scans almost the entire sky, prioritizing nearby stars whose planets can be studied in detail.',
    details:
      'TESS identifies transiting exoplanets around bright nearby stars, feeding the next generation of follow-up spectroscopy and atmospheric science.',
    image: createMissionPlate('TESS', cosmicPalette.nebulaBlue, cosmicPalette.quantumPurple, 'ALL-SKY SEARCH'),
  },
];

export const ISRO_MISSIONS = [
  {
    id: 'chandrayaan-3',
    title: 'Chandrayaan-3',
    year: '2023',
    description:
      'First spacecraft to soft-land near the lunar south pole, with in-situ measurements that included sulfur confirmation in regolith.',
    details:
      'Vikram and Pragyan extended India’s lunar program into the south polar region, where permanently shadowed terrain may preserve volatiles from the early Solar System.',
    image: createMissionPlate('CHANDRAYAAN-3', cosmicPalette.isroSaffron, cosmicPalette.nebulaBlue, 'LUNAR SOUTH POLE'),
  },
  {
    id: 'aditya-l1',
    title: 'Aditya-L1',
    year: '2023',
    description:
      'India’s first dedicated solar observatory studies the corona, solar wind, and eruptive space-weather drivers from Sun-Earth L1.',
    details:
      'Positioned near the Sun-Earth L1 region, Aditya-L1 watches coronal heating, CME launch conditions, and the plasma environment that shapes space weather at Earth.',
    image: createMissionPlate('ADITYA-L1', cosmicPalette.isroSaffron, cosmicPalette.plasmaOrange, 'SOLAR SENTINEL'),
  },
  {
    id: 'mangalyaan',
    title: 'Mangalyaan',
    year: '2014',
    description:
      'The Mars Orbiter Mission made India the first Asian nation to reach Mars orbit and did it on an exceptionally lean interplanetary budget.',
    details:
      'Mangalyaan demonstrated deep-space navigation, methane sensing, and planetary imaging while redefining what cost-effective interplanetary engineering can look like.',
    image: createMissionPlate('MANGALYAAN', cosmicPalette.isroSaffron, cosmicPalette.quantumPurple, 'MARS ORBITER MISSION'),
  },
  {
    id: 'gaganyaan',
    title: 'Gaganyaan',
    year: '2025',
    description:
      'India’s first crewed orbital mission is designed for a three-day low Earth orbit flight carrying Indian Vyomnauts.',
    details:
      'Gaganyaan is the human-spaceflight architecture that transitions ISRO from robotic exploration to independent crewed orbital capability.',
    image: createMissionPlate('GAGANYAAN', cosmicPalette.isroSaffron, cosmicPalette.nebulaBlue, 'CREWED ORBIT'),
  },
];

export const nasaApodFallback = [
  {
    title: 'Pillars of Creation',
    date: '2025-04-18',
    explanation:
      'Columns of cold gas in the Eagle Nebula host star formation sculpted by ultraviolet radiation from nearby young stars.',
    url: createMissionPlate('PILLARS OF CREATION', cosmicPalette.nebulaBlue, cosmicPalette.pillarsGold, 'STATIC NASA ARCHIVE'),
    hdurl: createMissionPlate('PILLARS OF CREATION', cosmicPalette.nebulaBlue, cosmicPalette.pillarsGold, 'STATIC NASA ARCHIVE'),
  },
  {
    title: 'Orion in Infrared',
    date: '2025-04-16',
    explanation:
      'Infrared imaging peels back visible-light dust to reveal star birth and turbulent gas in the Orion molecular cloud.',
    url: createMissionPlate('ORION INFRARED', cosmicPalette.quantumPurple, cosmicPalette.nebulaBlue, 'STATIC NASA ARCHIVE'),
    hdurl: createMissionPlate('ORION INFRARED', cosmicPalette.quantumPurple, cosmicPalette.nebulaBlue, 'STATIC NASA ARCHIVE'),
  },
  {
    title: 'Saturn from Cassini',
    date: '2025-04-14',
    explanation:
      'Backlit ring geometry turned Saturn into a luminous system of ice, dust, and shadow layered across the void.',
    url: createMissionPlate('SATURN IN ECLIPSE', cosmicPalette.plasmaOrange, cosmicPalette.nebulaBlue, 'STATIC NASA ARCHIVE'),
    hdurl: createMissionPlate('SATURN IN ECLIPSE', cosmicPalette.plasmaOrange, cosmicPalette.nebulaBlue, 'STATIC NASA ARCHIVE'),
  },
  {
    title: 'Webb Cosmic Cliffs',
    date: '2025-04-12',
    explanation:
      'Near-infrared structure in the Carina Nebula reveals a turbulent wall of gas, jets, cavities, and newborn stars.',
    url: createMissionPlate('COSMIC CLIFFS', cosmicPalette.nebulaBlue, cosmicPalette.plasmaOrange, 'STATIC NASA ARCHIVE'),
    hdurl: createMissionPlate('COSMIC CLIFFS', cosmicPalette.nebulaBlue, cosmicPalette.plasmaOrange, 'STATIC NASA ARCHIVE'),
  },
  {
    title: 'Jupiter Aurora',
    date: '2025-04-10',
    explanation:
      'Charged particles guided by Jupiter’s magnetic field pour into the poles and drive giant ultraviolet auroral curtains.',
    url: createMissionPlate('JUPITER AURORA', cosmicPalette.quantumPurple, cosmicPalette.nebulaBlue, 'STATIC NASA ARCHIVE'),
    hdurl: createMissionPlate('JUPITER AURORA', cosmicPalette.quantumPurple, cosmicPalette.nebulaBlue, 'STATIC NASA ARCHIVE'),
  },
  {
    title: 'Crab Nebula Shock Front',
    date: '2025-04-08',
    explanation:
      'A pulsar-powered supernova remnant glows across wavelengths as relativistic particles energize surrounding magnetic fields.',
    url: createMissionPlate('CRAB NEBULA', cosmicPalette.plasmaOrange, cosmicPalette.quantumPurple, 'STATIC NASA ARCHIVE'),
    hdurl: createMissionPlate('CRAB NEBULA', cosmicPalette.plasmaOrange, cosmicPalette.quantumPurple, 'STATIC NASA ARCHIVE'),
  },
];

export const donkiFallback = [
  {
    activityID: 'CME-STATIC-000',
    messageType: 'CME',
    classType: 'Coronal Mass Ejection',
    sourceLocation: 'Near-Earth heliosphere',
    beginTime: '2026-04-18T05:22Z',
    note: 'Summary: A moderate-speed coronal mass ejection was analyzed as a likely glancing encounter for missions near Earth, with forecast confidence remaining moderate.',
  },
  {
    activityID: 'GST-STATIC-001',
    messageType: 'GST',
    classType: 'Minor Geomagnetic Storm',
    sourceLocation: 'Solar wind interaction',
    beginTime: '2026-04-17T02:17Z',
    note: 'Geomagnetic activity elevated auroral visibility at high latitudes. Forecast confidence remains moderate.',
  },
  {
    activityID: 'RBE-STATIC-002',
    messageType: 'RBE',
    classType: 'Radiation Belt Enhancement',
    sourceLocation: 'Outer Van Allen belt',
    beginTime: '2026-04-16T14:43Z',
    note: 'Energetic electrons intensified in the outer radiation belt after sustained geomagnetic stirring.',
  },
  {
    activityID: 'FLR-STATIC-003',
    messageType: 'FLR',
    classType: 'M1.2 Solar Flare',
    sourceLocation: 'AR3559',
    beginTime: '2026-04-15T08:11Z',
    note: 'Moderate flare signature with limited Earth-directed consequences but continued active-region complexity.',
  },
];

export const cosmosPrompts = [
  'What is inside a black hole?',
  'How big is the observable universe?',
  'What would happen if I fell into a neutron star?',
];

export const externalLinks = [
  { label: 'NASA', url: 'https://www.nasa.gov/', accent: cosmicPalette.nebulaBlue },
  { label: 'ESA', url: 'https://www.esa.int/', accent: cosmicPalette.quantumPurple },
  { label: 'SpaceX', url: 'https://www.spacex.com/', accent: cosmicPalette.plasmaOrange },
  { label: 'JWST', url: 'https://webb.nasa.gov/', accent: cosmicPalette.nebulaBlue },
  { label: 'ISRO', url: 'https://www.isro.gov.in', accent: cosmicPalette.isroSaffron },
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
