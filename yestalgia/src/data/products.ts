export interface Product {
  id: number;
  name: string;
  price: number;
  colors: Array<{
    name: string;
    hex: string;
    image: string;
  }>;
  category: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'T-shirt graphique',
    price: 20,
    colors: [
      { name: 'Rose', hex: '#FF6B9D', image: '/images/1-graphic-tee-pink.svg' },
      { name: 'Blanc', hex: '#FFFFFF', image: '/images/1b-graphic-tee-white.svg' },
    ],
    category: 'T-shirts',
    featured: true,
  },
  {
    id: 2,
    name: 'OG2K',
    price: 45,
    colors: [
      { name: 'Violet', hex: '#7B2CBF', image: '/images/2a-og2k-purple.svg' },
      { name: 'Bleu ciel', hex: '#00B4D8', image: '/images/2b-og2k-skyblue.svg' },
    ],
    category: 'Chaussures',
    featured: true,
  },
  {
    id: 3,
    name: 'Veste de survetement',
    price: 35,
    colors: [
      { name: 'Violet', hex: '#7B2CBF', image: '/images/3a-tracksuit-jacket-purple.svg' },
      { name: 'Gris', hex: '#9CA3AF', image: '/images/3b-tracksuit-jacket-gray.svg' },
    ],
    category: 'Vestes',
    featured: true,
  },
  {
    id: 4,
    name: 'Sweat graphique',
    price: 30,
    colors: [
      { name: 'Gris', hex: '#9CA3AF', image: '/images/4-graphic-crewneck-gray.svg' },
    ],
    category: 'Sweats',
    featured: true,
  },
  {
    id: 5,
    name: 'Pantalon de survetement',
    price: 30,
    colors: [
      { name: 'Violet', hex: '#7B2CBF', image: '/images/5a-tracksuit-pant-purple.svg' },
      { name: 'Gris', hex: '#9CA3AF', image: '/images/5b-tracksuit-pant-gray.svg' },
    ],
    category: 'Pantalons',
    featured: true,
  },
  {
    id: 6,
    name: 'T-shirt crop',
    price: 15,
    colors: [
      { name: 'Violet', hex: '#7B2CBF', image: '/images/6a-crop-tee-purple.svg' },
      { name: 'Blanc', hex: '#FFFFFF', image: '/images/6b-crop-tee-white.svg' },
    ],
    category: 'T-shirts',
    featured: true,
  },
  {
    id: 7,
    name: 'Legging évasé',
    price: 25,
    colors: [
      { name: 'Rose', hex: '#FF6B9D', image: '/images/7-flared-legging-pink.svg' },
    ],
    category: 'Leggings',
    featured: true,
  },
  {
    id: 8,
    name: 'Sac',
    price: 30,
    colors: [
      { name: 'Vert & Rose', hex: '#2EC4B6', image: '/images/8-bag-green-pink.svg' },
    ],
    category: 'Accessoires',
    featured: true,
  },
  {
    id: 9,
    name: 'Short',
    price: 18,
    colors: [
      { name: 'Vert', hex: '#2EC4B6', image: '/images/9-short-green.svg' },
    ],
    category: 'Shorts',
    featured: true,
  },
  {
    id: 10,
    name: 'Lunettes de soleil',
    price: 20,
    colors: [
      { name: 'Blanc & Orange', hex: '#FF9F1C', image: '/images/10-sunglasses-white-orange.svg' },
    ],
    category: 'Accessoires',
    featured: true,
  },
  {
    id: 11,
    name: 'Casquette',
    price: 12,
    colors: [
      { name: 'Blanc cassé & Vert', hex: '#2EC4B6', image: '/images/11-cap-offwhite-green.svg' },
    ],
    category: 'Accessoires',
    featured: true,
  },
  {
    id: 12,
    name: 'Roller',
    price: 90,
    colors: [
      { name: 'Violet', hex: '#7B2CBF', image: '/images/12-roller-purple.svg' },
    ],
    category: 'Sports',
    featured: true,
  },
  {
    id: 13,
    name: 'Chaussettes',
    price: 15,
    colors: [
      { name: 'Blanc & Vert', hex: '#2EC4B6', image: '/images/13-socks-white-green.svg' },
    ],
    category: 'Accessoires',
    featured: true,
  },
];

export const navigationItems = [
  { label: 'La collection', href: '#collection' },
  { label: "À propos de l'artiste", href: '#dalkhafine' },
  { label: 'la conception', href: '#og2k' },
  { label: 'Lookbook', href: '#lookbook' },
];

export const languages = [
  { code: 'FR', label: 'FR', active: true },
  { code: 'EN', label: 'EN', active: false },
  { code: 'IT', label: 'IT', active: false },
  { code: 'ES', label: 'ES', active: false },
  { code: 'DE', label: 'DE', active: false },
  { code: 'BE-NL', label: 'BE-NL', active: false },
  { code: 'BE-FR', label: 'BE-FR', active: false },
];