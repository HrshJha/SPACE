export const spectralClasses = [
  {
    key: 'O',
    label: 'Blue supergiant',
    color: '#9bb0ff',
    temperatureKelvin: '30,000+',
    probability: 0.01,
  },
  {
    key: 'B',
    label: 'Blue-white giant',
    color: '#aabfff',
    temperatureKelvin: '10,000-30,000',
    probability: 0.02,
  },
  {
    key: 'A',
    label: 'White main-sequence',
    color: '#cad7ff',
    temperatureKelvin: '7,500-10,000',
    probability: 0.06,
  },
  {
    key: 'F',
    label: 'Yellow-white star',
    color: '#f8f7ff',
    temperatureKelvin: '6,000-7,500',
    probability: 0.1,
  },
  {
    key: 'G',
    label: 'Solar-type star',
    color: '#fff4ea',
    temperatureKelvin: '5,200-6,000',
    probability: 0.17,
  },
  {
    key: 'K',
    label: 'Orange dwarf',
    color: '#ffd2a1',
    temperatureKelvin: '3,700-5,200',
    probability: 0.24,
  },
  {
    key: 'M',
    label: 'Red dwarf',
    color: '#ffcc6f',
    temperatureKelvin: '2,400-3,700',
    probability: 0.4,
  },
];

export const brightStars = [
  {
    name: 'Sirius',
    spectralType: 'A1V',
    distanceLy: 8.6,
    position: [0.17, 0.24],
  },
  {
    name: 'Betelgeuse',
    spectralType: 'M1-2Ia-ab',
    distanceLy: 548,
    position: [0.54, 0.35],
  },
  {
    name: 'Rigel',
    spectralType: 'B8Ia',
    distanceLy: 860,
    position: [0.69, 0.58],
  },
  {
    name: 'Vega',
    spectralType: 'A0V',
    distanceLy: 25,
    position: [0.26, 0.68],
  },
  {
    name: 'Polaris',
    spectralType: 'F7Ib',
    distanceLy: 433,
    position: [0.44, 0.14],
  },
  {
    name: 'Antares',
    spectralType: 'M1.5Iab-Ib',
    distanceLy: 554,
    position: [0.79, 0.76],
  },
  {
    name: 'Altair',
    spectralType: 'A7V',
    distanceLy: 16.7,
    position: [0.13, 0.57],
  },
  {
    name: 'Aldebaran',
    spectralType: 'K5III',
    distanceLy: 65,
    position: [0.62, 0.23],
  },
];

export const iauConstellationOverlay = [
  ['Polaris', 'Vega'],
  ['Vega', 'Altair'],
  ['Betelgeuse', 'Rigel'],
  ['Sirius', 'Aldebaran'],
  ['Aldebaran', 'Betelgeuse'],
];
