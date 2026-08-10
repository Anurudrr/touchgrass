import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const products = [
  { id: 1, name: '1-graphic-tee-pink', color: '#FF6B9D', label: 'T-shirt Rose' },
  { id: 2, name: '1b-graphic-tee-white', color: '#FFFFFF', label: 'T-shirt Blanc', border: true },
  { id: 3, name: '2a-og2k-purple', color: '#7B2CBF', label: 'OG2K Violet' },
  { id: 4, name: '2b-og2k-skyblue', color: '#00B4D8', label: 'OG2K Bleu' },
  { id: 5, name: '3a-tracksuit-jacket-purple', color: '#7B2CBF', label: 'Veste Violet' },
  { id: 6, name: '3b-tracksuit-jacket-gray', color: '#9CA3AF', label: 'Veste Gris' },
  { id: 7, name: '4-graphic-crewneck-gray', color: '#9CA3AF', label: 'Sweat Gris' },
  { id: 8, name: '5a-tracksuit-pant-purple', color: '#7B2CBF', label: 'Pantalon Violet' },
  { id: 9, name: '5b-tracksuit-pant-gray', color: '#9CA3AF', label: 'Pantalon Gris' },
  { id: 10, name: '6a-crop-tee-purple', color: '#7B2CBF', label: 'Crop Violet' },
  { id: 11, name: '6b-crop-tee-white', color: '#FFFFFF', label: 'Crop Blanc', border: true },
  { id: 12, name: '7-flared-legging-pink', color: '#FF6B9D', label: 'Legging Rose' },
  { id: 13, name: '8-bag-green-pink', color: '#2EC4B6', label: 'Sac Vert/Rose' },
  { id: 14, name: '9-short-green', color: '#2EC4B6', label: 'Short Vert' },
  { id: 15, name: '10-sunglasses-white-orange', color: '#FF9F1C', label: 'Lunettes Orange' },
  { id: 16, name: '11-cap-offwhite-green', color: '#2EC4B6', label: 'Casquette Vert' },
  { id: 17, name: '12-roller-purple', color: '#7B2CBF', label: 'Roller Violet' },
  { id: 18, name: '13-socks-white-green', color: '#2EC4B6', label: 'Chaussettes Vert' },
];

products.forEach(product => {
  const borderAttr = product.border ? `stroke="${product.color === '#FFFFFF' ? '#E5E7EB' : '#D1D5DB'}" stroke-width="2"` : '';
  const textColor = product.color === '#FFFFFF' ? '#6B7280' : '#FFFFFF';
  
  const svg = `<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="800" fill="${product.color}" ${borderAttr} />
  <g transform="translate(300, 350)">
    <circle r="120" fill="${product.color}" fill-opacity="0.1" stroke="${textColor}" stroke-width="2" stroke-opacity="0.3" />
    <circle r="80" fill="${product.color}" fill-opacity="0.15" stroke="${textColor}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="10 10" />
    <text x="0" y="160" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="600" fill="${textColor}" fill-opacity="0.8">${product.label}</text>
    <text x="0" y="185" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="${textColor}" fill-opacity="0.5">Yestalgia Collection</text>
  </g>
  <g transform="translate(300, 650)">
    <rect x="-60" y="-20" width="120" height="40" rx="20" fill="${textColor}" fill-opacity="0.1" stroke="${textColor}" stroke-width="1" stroke-opacity="0.3" />
    <text x="0" y="5" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="500" fill="${textColor}" fill-opacity="0.7">Decathlon</text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(__dirname, 'public/images', `${product.name}.svg`), svg);
  console.log(`Created: ${product.name}.svg`);
});

console.log('All placeholder images created!');