import { brands } from './brands';

// Auto-generate stories from brands data so names/avatars/logos stay in sync
const storyContent = {
  toneff: [
    { id: 'ts1', caption: 'The Askew Shirt — dropping this Saturday on KitaKakis.', timestamp: '2h ago' },
    { id: 'ts2', caption: 'Asymmetry meets alignment. Every stitch, intentional.', timestamp: '2h ago' },
    { id: 'ts3', caption: 'Film x Fashion. Our process, unfiltered.', timestamp: '3h ago' },
  ],
  koyoyu: [
    { id: 'ks1', caption: 'Three weeks in Hanoi. The May Drop is going to be different.', timestamp: '4h ago' },
    { id: 'ks2', caption: 'Coach jacket preview. Oversized. Vietnamese-made.', timestamp: '4h ago' },
  ],
  maroon: [
    { id: 'ms1', caption: 'Signature Hoodie restocking for the May Drop. Limited units.', timestamp: '6h ago' },
    { id: 'ms2', caption: 'We make drops, not collections. Every piece is limited.', timestamp: '6h ago' },
    { id: 'ms3', caption: 'Cargo Cap · $29 · Drops Saturday 10AM', timestamp: '7h ago' },
  ],
  unwastelands: [
    { id: 'us1', caption: 'New arrivals at our Bugis location. Come dig.', timestamp: '1d ago' },
  ],
  vintagewknd: [
    { id: 'vs1', caption: 'Found this in a Tokyo garment factory. One of one.', timestamp: '1d ago' },
    { id: 'vs2', caption: 'Seoul sourcing trip haul incoming 🇰🇷', timestamp: '1d ago' },
  ],
  studiogypsied: [
    { id: 'gs1', caption: 'Hand-waxed batik. From Yogyakarta to Singapore.', timestamp: '2d ago' },
  ],
  charmsandlinks: [
    { id: 'cls1', caption: 'Every charm tells a story. What does yours say? 💎', timestamp: '3h ago' },
  ],
  no1apparels: [
    { id: 'n1s1', caption: 'Subtle anime. For those who know. New drop incoming ⚡', timestamp: '5h ago' },
  ],
  heritagebay: [
    { id: 'hbs1', caption: 'Batik reimagined. New Ceplok jeans dropping soon.', timestamp: '1d ago' },
  ],
  squarishmind: [
    { id: 'sms1', caption: 'Art meets fashion meets Singapore. 🔲', timestamp: '2d ago' },
  ],
};

const unseenBrands = ['toneff', 'koyoyu', 'maroon', 'charmsandlinks', 'no1apparels'];

export const stories = brands.map(brand => ({
  brandId: brand.id,
  brandName: brand.shortName,
  avatar: brand.avatar,
  logo: brand.logo || null,
  seen: !unseenBrands.includes(brand.id),
  items: (storyContent[brand.id] || []).map(item => ({
    ...item,
    type: 'image',
    gradient: brand.heroGradient,
  })),
})).filter(s => s.items.length > 0);
