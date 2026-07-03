export const TORIKO_CHARACTERS = {
  toriko: {
    name: 'Toriko',
    title: 'Bishokuya',
    tagline: 'Itadakimasu!',
    colors: {
      hair: '#1E90FF',
      skin: '#F5DEB3',
      outfit: '#DC143C',
      eyes: '#4682B4',
      accent: '#FFD700'
    }
  },
  komatsu: {
    name: 'Komatsu',
    title: 'Chef',
    tagline: 'Oishii!',
    colors: {
      hair: '#8B4513',
      skin: '#FFE4C4',
      outfit: '#FFFFFF',
      eyes: '#228B22',
      accent: '#FFD700'
    }
  },
  sunny: {
    name: 'Sunny',
    title: 'Saiseiya',
    tagline: 'Beautiful!',
    colors: {
      hair: '#FF69B4',
      skin: '#FFF0F5',
      outfit: '#FFB6C1',
      eyes: '#9370DB',
      accent: '#FF69B4'
    }
  },
  zebra: {
    name: 'Zebra',
    title: 'Voice Hunter',
    tagline: 'Zebraaaa!',
    colors: {
      hair: '#1A1A1A',
      skin: '#5C4033',
      outfit: '#1A1A1A',
      eyes: '#FFD700',
      accent: '#8B0000'
    }
  },
  coco: {
    name: 'Coco',
    title: 'Poison User',
    tagline: 'Safe to eat.',
    colors: {
      hair: '#32CD32',
      skin: '#F5F5DC',
      outfit: '#4B0082',
      eyes: '#20B2AA',
      accent: '#32CD32'
    }
  }
} as const;

export type TorikoCharacter = keyof typeof TORIKO_CHARACTERS;
