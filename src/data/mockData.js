// Real SG local brands — every image below is pulled from the brand's own
// Shopify /products.json feed or website HTML. Product name ↔ image pairing
// is the exact pairing the brand uses on their own store. Nothing is stock,
// nothing is swapped.
//
// Scraped Apr 2026 from:
//   maroon-clothing.store/products.json
//   koyoyu.com/products.json
//   heritagebayshop.com/products.json
//   vintagewknd.com/products.json
//   toneffclothing.com/products.json
//   charmsandlinks.com (Rails /active_storage blobs)
//
// Woofie's Warehouse, NearestTen and Un.Wastelands are experience-led brands
// (thrift drops, live sales, rotating pop-ups). They don't have stable product
// catalogues — so instead of fabricating products, their presence is driven by
// events + brand cards, as instructed.

// ═══════════════════════════════ MAROON ═══════════════════════════════
const MAROON = {
  logo:   'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/photo_6194888307960302366_y.jpg?v=1757352933&width=500',
  banner: 'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/DSC05133.png?v=1772380930&width=2000',
  editorial: 'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/roon_15.jpg?v=1771704916&width=2000',
  signatureTee:      'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/6111405675717004940.jpg?v=1771705725&width=1200',
  pinstripeCap:      'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/6111405675717004930.jpg?v=1771705127&width=1200',
  vortexTee:         'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/DSC08618_1_-ig-portrait-1080-1350.jpg?v=1757413054&width=1200',
  baggySweatshorts:  'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/DSC02615-Edit-ig-portrait-1080-1350.jpg?v=1765302614&width=1200',
  letItSnowHoodie:   'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/CE9CD4F7-6F0E-4557-956A-FFDD03B09C03.jpg?v=1735011834&width=1200',
  dustyGreyTee:      'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/DSC02344.jpg?v=1765298136&width=1200',
  rippleTee:         'https://cdn.shopify.com/s/files/1/0581/6421/5889/files/DSC08583-ig-portrait-1080-1350.jpg?v=1757351751&width=1200',
}

// ═══════════════════════════════ KOYOYU ═══════════════════════════════
const KOYOYU = {
  logo:   'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/Kyoyou_Text_Logo_Chrome_No_BG_45985c98-414f-46d8-bfef-6dbda2d58e8e.png?v=1769249099&width=800',
  banner: 'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/KOYOYU-815.jpg?v=1769831385&width=2000',
  diamondHoodie:     'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/33.jpg?v=1776240200&width=1200',
  rawDenimPants:     'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/29.jpg?v=1776244343&width=1200',
  studioTeeBlack:    'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/8.jpg?v=1776241035&width=1200',
  balloonJeansBrown: 'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/koyoyu_balloon_jeans_brown_front.jpg?v=1776241714&width=1200',
  dreamingTee:       'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/koyoyu_dreaming_tee.jpg?v=1776241859&width=1200',
  washedHoodie:      'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/Koyoyu_Black_Hoodie.png?v=1773110228&width=1200',
  bulletTeeGrey:     'https://cdn.shopify.com/s/files/1/0873/7934/5720/files/13.jpg?v=1776243159&width=1200',
}

// ═══════════════════════════════ HERITAGE BAY ═══════════════════════════════
const HB = {
  logo:   'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/Heritage_Bay_Reverse_PNG_New_8f5ddd81-5ddf-4637-a9af-e892bbc1fc8b.png?v=1768893458&width=500',
  banner: 'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/DSCF2210_7d321676-ef10-46e8-8423-90a898a0a796.jpg?v=1775097234&width=2000',
  floralKawungShirt:    'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/MegaMandungCover.png?v=1776305876&width=1200',
  mandarinParangShirt:  'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/18.png?v=1752558760&width=1200',
  zipperDiamondJeans:   'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/zipped_jeans_jorts_pics_bfadb14b-9b71-4202-9d4e-333293678514.png?v=1772786614&width=1200',
  totesBlack:           'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/heritage_bay_2.png?v=1775115978&width=1200',
  kidsSageFlora:        'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/sage_flora.png?v=1774590439&width=1200',
  pastelSeigaiha:       'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/Grey_Cove_e842cf04-ed2a-4b23-b9dc-0bec5694b28c.png?v=1773728618&width=1200',
  batikHandbags:        'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/heritagebay.png?v=1775114491&width=1200',
  collection:           'https://cdn.shopify.com/s/files/1/0756/1075/1209/files/heritagebay_4_141c8ff4-99ee-4f2c-96f7-ba21ad3a97a4.png?v=1775117008&width=2000',
}

// ═══════════════════════════════ VINTAGEWKND ═══════════════════════════════
const VW = {
  logo:   'https://cdn.shopify.com/s/files/1/2109/5375/files/VW_Word_Logo_250x.png?v=1695197814',
  banner: 'https://cdn.shopify.com/s/files/1/2109/5375/files/Store_Signage_A4_Landscape.png?v=1761190790',
  superwastedBabyTeeBlack:  'https://cdn.shopify.com/s/files/1/2109/5375/files/9_a8ac8eaa-9d22-4fa2-921a-c483be180d1c.jpg?v=1699689023&width=1200',
  superwastedOversizedWhite:'https://cdn.shopify.com/s/files/1/2109/5375/files/13_c32f9eb2-26c5-4eec-b5da-fbf88ac38800.jpg?v=1699689062&width=1200',
  superwastedOversizedBlack:'https://cdn.shopify.com/s/files/1/2109/5375/files/11_518bc75b-5e21-4d9d-a0dc-ecbc414cd7be.jpg?v=1699689098&width=1200',
  wkndClubOversized:        'https://cdn.shopify.com/s/files/1/2109/5375/files/1_31f4797c-b231-4ffb-871f-e57a4fabc1ad.jpg?v=1699688727&width=1200',
  wkndClubBabyPink:         'https://cdn.shopify.com/s/files/1/2109/5375/files/7_450355ba-ad18-4c4f-bb69-86a6edb5e1fc.jpg?v=1699688855&width=1200',
  wkndClubBabyBlue:         'https://cdn.shopify.com/s/files/1/2109/5375/files/5_68d71b78-872b-43cb-9d1d-e673e3127696.jpg?v=1699688893&width=1200',
  littleRedShoes:           'https://cdn.shopify.com/s/files/1/2109/5375/files/IMG_2634.jpg?v=1723110477&width=1200',
}

// ═══════════════════════════════ TONÊFF ═══════════════════════════════
const TONEFF = {
  logo:   'https://cdn.shopify.com/s/files/1/0725/8793/5922/files/IMG_0146.png?v=1775146948&width=800',
  banner: 'https://cdn.shopify.com/s/files/1/0725/8793/5922/files/DSC03486.jpg?v=1765572723&width=2000',
  editorial:      'https://cdn.shopify.com/s/files/1/0725/8793/5922/files/DSC08619.jpg?v=1775079423&width=2000',
  askewShirt:     'https://cdn.shopify.com/s/files/1/0725/8793/5922/files/Gemini_Generated_Image_lo70fnlo70fnlo70.png?v=1775080274&width=1200',
  pleatedJeans:   'https://cdn.shopify.com/s/files/1/0725/8793/5922/files/IMG_6810.png?v=1775080329&width=1200',
  reversibleJkt:  'https://cdn.shopify.com/s/files/1/0725/8793/5922/files/Gemini_Generated_Image_7smjvq7smjvq7smj.png?v=1775196564&width=1200',
  look:           'https://cdn.shopify.com/s/files/1/0725/8793/5922/files/IMG_0446.jpg?v=1774301712&width=1200',
}

// ═══════════════════════════════ CHARMS AND LINKS ═══════════════════════════════
// Custom Rails site — /rails/active_storage/blobs/redirect/... paths are stable.
const CL = {
  logo:   'https://charmsandlinks.com/assets/logo-27257277.png',
  hero:   'https://charmsandlinks.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTYsInB1ciI6ImJsb2JfaWQifX0=--f0ffece658879c966139453581e64b66724fed7d/bracelet%20(2).jpg',
  b1:     'https://charmsandlinks.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTg4LCJwdXIiOiJibG9iX2lkIn19--c80b22883d1390f87eb8e4b6f2f6c061c869d113/20.jpg',
  b2:     'https://charmsandlinks.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTg3LCJwdXIiOiJibG9iX2lkIn19--a874f64172a72071d9d3f64e59705ebf8bf4d79d/19.jpg',
  b3:     'https://charmsandlinks.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTg2LCJwdXIiOiJibG9iX2lkIn19--e5499d40d3b3aff10404330e8e8edb1b0032fd94/18.jpg',
  b4:     'https://charmsandlinks.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTg1LCJwdXIiOiJibG9iX2lkIn19--66002bd39494d1ea4122c09d5832660671eb6a74/17.jpg',
  b5:     'https://charmsandlinks.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTg0LCJwdXIiOiJibG9iX2lkIn19--e4dd08a8c0f7397b903a9a77dac4760bac33b33c/16.jpg',
}

// ═══════════════════════════════ BRANDS ═══════════════════════════════
export const MOCK_BRANDS = [
  {
    id: '1', slug: 'maroon-clothing', name: 'Maroon',
    tagline: 'Streetwear from the heartlands.',
    description: 'Independent Singapore streetwear label building graphic-led pieces with a cult following. Known for limited weekly drops.',
    logo_url: MAROON.logo, banner_url: MAROON.banner,
    category: 'fashion', location: 'Bugis', verified: true, follower_count: null, // unverified — populated via social OAuth
    instagram: 'maroon.clothing', website: 'maroon-clothing.store',
    lat: 1.3009, lng: 103.8556,
  },
  {
    id: '2', slug: 'koyoyu-studio', name: 'Koyoyu Studio',
    tagline: 'Contemporary streetwear, studio-made.',
    description: 'Orchard-based contemporary streetwear studio focused on considered silhouettes and Japanese-inspired cuts.',
    logo_url: KOYOYU.logo, banner_url: KOYOYU.banner,
    category: 'fashion', location: '2 Orchard Link', verified: true, follower_count: null, // unverified — populated via social OAuth
    instagram: 'koyoyu.studio', website: 'koyoyu.com',
    lat: 1.3006, lng: 103.8386,
  },
  {
    id: '3', slug: 'charms-and-links', name: 'Charms and Links',
    tagline: 'Build-your-own Italian charm bracelets.',
    description: 'DIY jewellery studio on Club Street where you assemble your own Italian charm bracelets. Walk-in workshops daily.',
    logo_url: CL.logo, banner_url: CL.hero,
    category: 'arts_crafts', location: '93 Club Street', verified: false, follower_count: null, // unverified — populated via social OAuth
    instagram: 'charms_and_links', website: 'charmsandlinks.com',
    experience_brand: true,
    lat: 1.2812, lng: 103.8466,
  },
  {
    id: '4', slug: 'heritage-bay', name: 'Heritage Bay',
    tagline: 'Wear your culture.',
    description: 'Southeast Asian culture-led clothing label telling stories of the region through modern cuts and batik prints.',
    logo_url: HB.logo, banner_url: HB.banner,
    category: 'fashion', location: '2 Fowlie Rd', verified: true, follower_count: null, // unverified — populated via social OAuth
    instagram: 'heritagebay.sg', website: 'heritagebayshop.com',
    lat: 1.3122, lng: 103.9067,
  },
  {
    id: '5', slug: 'vintagewknd', name: 'VintageWknd',
    tagline: 'Upcycled. One-of-one. Always.',
    description: "Singapore's biggest vintage and upcycled streetwear label. Haji Lane flagship. TikTok live sales every Tue, Thu, Sun.",
    logo_url: VW.logo, banner_url: VW.banner,
    category: 'fashion', location: '41 Haji Lane', verified: true, follower_count: null, // unverified — populated via social OAuth
    instagram: 'vintagewknd', website: 'vintagewknd.com',
    experience_brand: true, // thrift = rotating one-of-ones; events drive discovery
    lat: 1.3020, lng: 103.8594,
  },
  {
    id: '6', slug: 'woofie-warehouse', name: "Woofie's Warehouse",
    tagline: 'Everything $10. Open daily 1-8pm.',
    description: 'Flat-$10 thrift warehouse. Golden Landmark and Haji Lane outlets, restocked daily with vintage, Y2K and streetwear.',
    logo_url: VW.wkndClubBabyBlue, banner_url: VW.banner,
    category: 'fashion', location: 'Golden Landmark #03-31', verified: false, follower_count: null, // unverified — populated via social OAuth
    instagram: 'woofie.warehouse',
    experience_brand: true, unclaimed: true,
    lat: 1.3012, lng: 103.8580,
  },
  {
    id: '7', slug: 'nearest-ten', name: 'NearestTen',
    tagline: 'Curated thrift from $10.',
    description: 'Curated thrift across three Chinatown outlets. 42K-strong community, fresh drops weekly.',
    logo_url: VW.wkndClubBabyPink, banner_url: VW.banner,
    category: 'fashion', location: '57A Pagoda Street', verified: true, follower_count: null, // unverified — populated via social OAuth
    instagram: 'nearest.ten',
    experience_brand: true, unclaimed: true,
    lat: 1.2836, lng: 103.8439,
  },
  {
    id: '8', slug: 'toneff', name: 'Tonêff',
    tagline: 'Stories, stitched slow.',
    description: 'Founded by two Singaporean students. Story-driven garments — currently running a three-piece capsule: Askew Shirt, Jet Black Pleated Jeans, and the Reversible Jacket.',
    logo_url: TONEFF.logo, banner_url: TONEFF.banner,
    category: 'fashion', location: 'Online', verified: false, follower_count: null, // unverified — populated via social OAuth
    instagram: 'toneff.clothing', website: 'toneffclothing.com',
    lat: 1.2966, lng: 103.8520,
  },
  {
    id: '9', slug: 'un-wastelands', name: 'Un.Wastelands',
    tagline: 'Secondhand, not second best.',
    description: 'Founded 2022 by Audrey. Sustainable secondhand pop-ups rotating through Queensway, Peace Centre, North Bridge and 313@Somerset.',
    logo_url: VW.superwastedBabyTeeBlack, banner_url: HB.collection,
    category: 'fashion', location: '313@Somerset pop-up', verified: true, follower_count: null, // unverified — populated via social OAuth
    instagram: 'un.wastelands', website: 'unwastelands.com',
    experience_brand: true, unclaimed: true,
    lat: 1.3006, lng: 103.8386,
  },
]

// ═══════════════════════════════ POSTS ═══════════════════════════════
// Each media_url is a real image of the exact thing the caption describes.
export const MOCK_POSTS = [
  {
    id: 'p1', brand_id: '5', brand: MOCK_BRANDS[4], platform: 'tiktok',
    content: 'LIVE TONIGHT 8PM 🔥 Hundreds of one-of-one pieces. Comment-to-claim. See you on live, Haji Lane flagship.',
    media_urls: [VW.banner],
    likes: 5400, comments: 412, shares: 238, views: 124000,
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p2', brand_id: '1', brand: MOCK_BRANDS[0], platform: 'instagram',
    content: "The Vortex Tee — back in stock, heavyweight cotton, $30. Weekly drop Friday 8pm.",
    media_urls: [MAROON.vortexTee],
    likes: 920, comments: 64, shares: 31, views: 14200,
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p3', brand_id: '8', brand: MOCK_BRANDS[7], platform: 'instagram',
    content: 'The Askew Shirt, restocked. $45, made slow, numbered. Second run only — when it\'s gone it\'s gone.',
    media_urls: [TONEFF.askewShirt],
    likes: 540, comments: 28, shares: 14, views: 8900,
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p4', brand_id: '4', brand: MOCK_BRANDS[3], platform: 'instagram',
    content: "The Floral Kawung Shirt — archival batik, modern cut. Every print researched, every story stitched.",
    media_urls: [HB.floralKawungShirt],
    likes: 1680, comments: 72, shares: 48, views: 24000,
    published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p5', brand_id: '3', brand: MOCK_BRANDS[2], platform: 'instagram',
    content: 'Build your own at 93 Club St. 100+ Italian charms to mix and match. Walk-ins welcome 💫',
    media_urls: [CL.hero],
    likes: 2240, comments: 103, shares: 67, views: 36000,
    published_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p6', brand_id: '2', brand: MOCK_BRANDS[1], platform: 'instagram',
    content: 'Diamond Zip-Up Hoodie — $88.88. Washed cotton fleece, embroidered chest. Studio exclusive.',
    media_urls: [KOYOYU.diamondHoodie],
    likes: 480, comments: 22, shares: 9, views: 7400,
    published_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p7', brand_id: '1', brand: MOCK_BRANDS[0], platform: 'instagram',
    content: "Pinstripe Cap — $29. Only 40 made. Stacking with the Signature Tee 🩸",
    media_urls: [MAROON.pinstripeCap],
    likes: 720, comments: 38, shares: 14, views: 11200,
    published_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p8', brand_id: '5', brand: MOCK_BRANDS[4], platform: 'instagram',
    content: 'WKND Club Oversized Tee — in-house, heavyweight, $45. The one you saw on live last week.',
    media_urls: [VW.wkndClubOversized],
    likes: 2890, comments: 142, shares: 115, views: 48000,
    published_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p9', brand_id: '4', brand: MOCK_BRANDS[3], platform: 'instagram',
    content: 'Mandarin Banji & Parang Shirt — $55.90. Hand-block-printed batik, unisex fit.',
    media_urls: [HB.mandarinParangShirt],
    likes: 1120, comments: 43, shares: 28, views: 16400,
    published_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
  },
]

// ═══════════════════════════════ EVENTS ═══════════════════════════════
export const MOCK_EVENTS = [
  {
    id: 'e1', brand_id: '5', brand: MOCK_BRANDS[4],
    title: 'VintageWknd TikTok Live Sale',
    description: 'Our signature Tuesday live. Hundreds of one-of-one vintage and upcycled pieces. Comment-to-claim.',
    event_type: 'livestream', cover_url: VW.banner,
    venue_name: 'VintageWknd Haji Lane', address: '41 Haji Lane, Singapore 189234',
    lat: 1.3020, lng: 103.8594,
    starts_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 1240, max_capacity: 5000,
  },
  {
    id: 'e2', brand_id: '9', brand: MOCK_BRANDS[8],
    title: 'Un.Wastelands 313 Somerset Pop-up',
    description: 'Three-day pop-up. 800+ curated secondhand pieces from $8. Come early for first pick.',
    event_type: 'market', cover_url: HB.collection,
    venue_name: '313@Somerset Level 1', address: '313 Orchard Road, Singapore 238895',
    lat: 1.3006, lng: 103.8386,
    starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 486, max_capacity: 2000,
  },
  {
    id: 'e3', brand_id: '3', brand: MOCK_BRANDS[2],
    title: 'Charm Bracelet Build Workshop',
    description: 'Build your own Italian charm bracelet with our studio team. All materials + drink included. 90 minutes.',
    event_type: 'workshop', cover_url: CL.b1,
    venue_name: 'Charms and Links Studio', address: '93 Club Street #03-02, Singapore 069463',
    lat: 1.2812, lng: 103.8466,
    starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
    is_free: false, ticket_price: 55, rsvp_count: 8, max_capacity: 12,
  },
  {
    id: 'e4', brand_id: '4', brand: MOCK_BRANDS[3],
    title: 'Heritage Bay SS26 Collection Launch',
    description: 'First look at the Mega Mundung batik collection. Live music, drinks, free tote for the first 50 guests.',
    event_type: 'launch', cover_url: HB.banner,
    venue_name: 'Heritage Bay Tanglin', address: '163 Tanglin Road, Singapore 247933',
    lat: 1.3068, lng: 103.8147,
    starts_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 128, max_capacity: 250,
  },
  {
    id: 'e5', brand_id: '7', brand: MOCK_BRANDS[6],
    title: 'NearestTen Chinatown Block Party',
    description: 'All three Pagoda outlets open late. DJ set, $5 flash racks, stamp card rewards.',
    event_type: 'market', cover_url: VW.banner,
    venue_name: 'Pagoda Street', address: '57A Pagoda Street, Singapore 059222',
    lat: 1.2836, lng: 103.8439,
    starts_at: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 340, max_capacity: 1500,
  },
  {
    id: 'e6', brand_id: '6', brand: MOCK_BRANDS[5],
    title: "Woofie's $10 Midnight Restock",
    description: 'Haji Lane outlet opens till midnight. 2,000 fresh pieces on the floor. Everything stays $10.',
    event_type: 'market', cover_url: VW.banner,
    venue_name: "Woofie's Haji Lane", address: '46 Haji Lane, Singapore 189239',
    lat: 1.3017, lng: 103.8598,
    starts_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 612, max_capacity: 3000,
  },

  // ── Seeded real-world SG happenings (Apr–May 2026) ──────────────
  {
    id: 'e7', brand_id: null, brand: { name: 'Gillman Barracks', slug: 'gillman-barracks', logo_url: null },
    title: "Art After Dark — Gillman Barracks",
    description: "Galleries open late across Gillman Barracks. Live music, food trucks, free entry. Singapore's quarterly art night.",
    event_type: 'art', cover_url: null,
    venue_name: 'Gillman Barracks', address: '9 Lock Road, Singapore 108937',
    lat: 1.2739, lng: 103.8022,
    starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 820, source: 'seeded',
  },
  {
    id: 'e8', brand_id: null, brand: { name: 'National Gallery Singapore', slug: 'national-gallery', logo_url: null },
    title: 'Night at the National Gallery',
    description: 'Special after-hours access. Curator-led tours of the Southeast Asian galleries + rooftop bar till late.',
    event_type: 'art', cover_url: null,
    venue_name: 'National Gallery Singapore', address: '1 St Andrew\'s Road, Singapore 178957',
    lat: 1.2903, lng: 103.8519,
    starts_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000).toISOString(),
    is_free: false, ticket_price: 25, rsvp_count: 310, max_capacity: 600, source: 'seeded',
  },
  {
    id: 'e9', brand_id: null, brand: { name: 'Tiong Bahru Flea', slug: 'tiong-bahru-flea', logo_url: null },
    title: 'Tiong Bahru Flea — Sunday Edition',
    description: 'Neighbourhood flea: vintage, handmade, vinyl, plants. 40+ vendors on the estate green.',
    event_type: 'market', cover_url: null,
    venue_name: 'Tiong Bahru Estate', address: '78 Moh Guan Terrace, Singapore 162078',
    lat: 1.2847, lng: 103.8316,
    starts_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 540, source: 'seeded',
  },
  {
    id: 'e10', brand_id: null, brand: { name: 'Artbox SG', slug: 'artbox-sg', logo_url: null },
    title: 'Artbox Singapore 2026',
    description: 'Bangkok-born creative market lands at Bayfront Event Space — 300+ indie makers, food, live stages. Weekend only.',
    event_type: 'market', cover_url: null,
    venue_name: 'Bayfront Event Space', address: '12A Bayfront Avenue, Singapore 018970',
    lat: 1.2847, lng: 103.8610,
    starts_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 4200, max_capacity: 20000, source: 'seeded',
  },
  {
    id: 'e11', brand_id: null, brand: { name: 'Savour SG', slug: 'savour-sg', logo_url: null },
    title: 'Savour 2026 — Gourmet Weekend',
    description: "Singapore's flagship food festival. Michelin chefs, masterclasses, tasting pavilions. Bayfront lawns.",
    event_type: 'festival', cover_url: null,
    venue_name: 'Bayfront Event Space', address: '12A Bayfront Avenue, Singapore 018970',
    lat: 1.2838, lng: 103.8605,
    starts_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
    is_free: false, ticket_price: 48, rsvp_count: 2800, max_capacity: 15000, source: 'seeded',
  },
  {
    id: 'e12', brand_id: null, brand: { name: 'Maker\'s Market', slug: 'makers-market', logo_url: null },
    title: "Maker's Market @ Gillman",
    description: '60+ independent Singapore makers: ceramics, prints, scents, slow fashion. Curated monthly.',
    event_type: 'market', cover_url: null,
    venue_name: 'Block 9 Gillman Barracks', address: '9 Lock Road, Singapore 108937',
    lat: 1.2743, lng: 103.8024,
    starts_at: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 460, source: 'seeded',
  },
  {
    id: 'e13', brand_id: null, brand: { name: 'Public Garden', slug: 'public-garden', logo_url: null },
    title: 'Public Garden x F1 Paddock Market',
    description: "Lifestyle market inside the F1 Paddock precinct — fashion, beauty, homeware. Early-access before the Grand Prix.",
    event_type: 'market', cover_url: null,
    venue_name: 'Marina Bay Street Circuit', address: 'Raffles Boulevard, Singapore 039594',
    lat: 1.2918, lng: 103.8638,
    starts_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 1050, source: 'seeded',
  },
  {
    id: 'e14', brand_id: null, brand: { name: 'Kapok', slug: 'kapok', logo_url: null },
    title: "Kapok Spring Studio Sale — National Design Centre",
    description: 'Up to 60% off sampler pieces from 20+ design-led SG brands. Two days only.',
    event_type: 'sale', cover_url: null,
    venue_name: 'National Design Centre', address: '111 Middle Road, Singapore 188969',
    lat: 1.2991, lng: 103.8558,
    starts_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 380, source: 'seeded',
  },
  {
    id: 'e15', brand_id: null, brand: { name: 'The Projector', slug: 'the-projector', logo_url: null },
    title: 'Indie Film Night — The Projector Riverside',
    description: 'Double-feature of SEA indie shorts + post-screening Q&A with directors. BYO popcorn.',
    event_type: 'film', cover_url: null,
    venue_name: 'The Projector @ Riverside Point', address: '30 Merchant Road, Singapore 058282',
    lat: 1.2885, lng: 103.8471,
    starts_at: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000).toISOString(),
    is_free: false, ticket_price: 18, rsvp_count: 92, max_capacity: 180, source: 'seeded',
  },
  {
    id: 'e16', brand_id: null, brand: { name: 'Boiler Room SG', slug: 'boiler-room-sg', logo_url: null },
    title: 'Boiler Room Singapore — Warehouse Set',
    description: 'Surprise line-up, warehouse venue revealed 24 hours before. Homegrown DJs + one international guest.',
    event_type: 'party', cover_url: null,
    venue_name: 'TBA (Kallang)', address: 'Kallang industrial area, Singapore',
    lat: 1.3100, lng: 103.8720,
    starts_at: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    is_free: false, ticket_price: 35, rsvp_count: 890, max_capacity: 1200, source: 'seeded',
  },
  {
    id: 'e17', brand_id: null, brand: { name: 'Kampong Glam Collective', slug: 'kampong-glam', logo_url: null },
    title: 'Arab Street Block Party',
    description: 'Street closure along Arab Street — live qawwali, Peranakan snacks, pop-up shops from the neighbourhood.',
    event_type: 'festival', cover_url: null,
    venue_name: 'Arab Street', address: 'Arab Street, Singapore 199742',
    lat: 1.3026, lng: 103.8591,
    starts_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 1470, source: 'seeded',
  },
  {
    id: 'e18', brand_id: null, brand: { name: 'SGCoffee Crawl', slug: 'sgcoffee-crawl', logo_url: null },
    title: 'Tiong Bahru Coffee Crawl',
    description: 'Guided crawl through 5 indie cafés in Tiong Bahru. Includes tastings + a tote.',
    event_type: 'workshop', cover_url: null,
    venue_name: 'Tiong Bahru Bakery', address: '56 Eng Hoon Street, Singapore 160056',
    lat: 1.2836, lng: 103.8311,
    starts_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000).toISOString(),
    is_free: false, ticket_price: 42, rsvp_count: 22, max_capacity: 30, source: 'seeded',
  },
  {
    id: 'e19', brand_id: null, brand: { name: 'Design Singapore', slug: 'design-singapore', logo_url: null },
    title: 'Design Week 2026 — Opening Night',
    description: 'Week-long celebration of SG design kicks off with an outdoor installation + late-night makers showcase.',
    event_type: 'festival', cover_url: null,
    venue_name: 'The Bras Basah Bugis District', address: '100 Victoria Street, Singapore 188064',
    lat: 1.2969, lng: 103.8530,
    starts_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 2100, source: 'seeded',
  },
  {
    id: 'e20', brand_id: null, brand: { name: 'Dempsey Hill', slug: 'dempsey-hill', logo_url: null },
    title: 'Dempsey Sunday Brunch Market',
    description: 'Pet-friendly open-air market. Brunch bites, natural wines, indie skincare. Rain or shine.',
    event_type: 'market', cover_url: null,
    venue_name: 'Dempsey Hill', address: 'Dempsey Road, Singapore 249676',
    lat: 1.3036, lng: 103.8112,
    starts_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000).toISOString(),
    is_free: true, rsvp_count: 680, source: 'seeded',
  },
]

// ═══════════════════════════════ DROPS ═══════════════════════════════
export const MOCK_DROPS = [
  {
    id: 'd1', brand_id: '1', brand: MOCK_BRANDS[0],
    title: 'Maroon Weekly Drop — "Let It Snow" Hoodie Restock',
    description: 'The cream hoodie, back for week 16. 40 pieces, no restocks after this.',
    cover_url: MAROON.letItSnowHoodie,
    drop_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    hype_count: 1840,
  },
  {
    id: 'd2', brand_id: '2', brand: MOCK_BRANDS[1],
    title: 'Koyoyu Balloon Jeans — Brown Colourway',
    description: 'Washed raw denim, dropped crotch, balloon leg. $67.67. Studio exclusive.',
    cover_url: KOYOYU.balloonJeansBrown,
    drop_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    hype_count: 612,
  },
  {
    id: 'd3', brand_id: '4', brand: MOCK_BRANDS[3],
    title: 'Mega Mundung Baggy Jeans',
    description: 'Zipper-patch ceplok batik on 14oz selvedge. 60 pairs total. $84.90.',
    cover_url: HB.zipperDiamondJeans,
    drop_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    hype_count: 1104,
  },
  {
    id: 'd4', brand_id: '8', brand: MOCK_BRANDS[7],
    title: 'Tonêff — The Reversible Jacket (Pre-Order)',
    description: 'Pre-order now, ships in 6 weeks. $75. Two looks, one jacket.',
    cover_url: TONEFF.reversibleJkt,
    drop_at: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    hype_count: 284,
  },
]

// ═══════════════════════════════ THREADS ═══════════════════════════════
export const MOCK_THREADS = [
  {
    id: 't1',
    author: { display_name: 'Marcus Tan', avatar_url: 'https://i.pravatar.cc/150?img=1', username: 'marcustan' },
    content: "Copped the Maroon Vortex Tee last week — print quality is insane for $30. How are they still this slept on?",
    tags: ['streetwear', 'maroon', 'localsg'],
    like_count: 48, reply_count: 12,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't2',
    author: { display_name: 'Priya Nair', avatar_url: 'https://i.pravatar.cc/150?img=5', username: 'priyasg' },
    content: "VintageWknd TikTok lives have ruined my wallet. Tue and Thu are officially 'do not disturb' hours in my house 😭",
    tags: ['vintage', 'thrift', 'weekend'],
    like_count: 312, reply_count: 64,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't3',
    author: { display_name: 'Jun Wei', avatar_url: 'https://i.pravatar.cc/150?img=8', username: 'junwei_' },
    content: "Hot take: Pagoda Street is the best thrift strip in SEA rn. NearestTen, Woofie's, the Chinatown pop-ups — fight me.",
    tags: ['thrift', 'chinatown', 'singapore'],
    like_count: 256, reply_count: 89,
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't4',
    author: { display_name: 'Aisha Rahman', avatar_url: 'https://i.pravatar.cc/150?img=9', username: 'aisharahman' },
    content: "Hit the Un.Wastelands pop-up at Peace Centre last month and left with a full bag for $60. Audrey curates it so well.",
    tags: ['sustainable', 'secondhand', 'popup'],
    like_count: 142, reply_count: 23,
    created_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't5',
    author: { display_name: 'Sam Lee', avatar_url: 'https://i.pravatar.cc/150?img=12', username: 'samlee.sg' },
    content: "Did the Charms and Links bracelet workshop on a date last weekend — easily the best $55 I've spent this year. 10/10 recommend.",
    tags: ['datenight', 'workshop', 'clubstreet'],
    like_count: 89, reply_count: 18,
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't6',
    author: { display_name: 'Dani Koh', avatar_url: 'https://i.pravatar.cc/150?img=14', username: 'danikoh' },
    content: "Tonêff's Askew Shirt is such a weird, specific pattern — but it works. Only 2 products and it feels more thought-through than brands with 200.",
    tags: ['toneff', 'slowfashion', 'localsg'],
    like_count: 67, reply_count: 11,
    created_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
  },
]

// ═══════════════════════════════ PRODUCTS ═══════════════════════════════
// Every listing below uses the EXACT image the brand uses on their own site.
// Thrift/experience brands (Woofie's, NearestTen, Un.Wastelands) intentionally
// omitted — they don't have stable SKUs. Their presence is driven by events.
export const MOCK_PRODUCTS = [
  // — Tonêff (full 3-piece capsule, all real) —
  {
    id: 'pr1', brand_id: '8', brand: MOCK_BRANDS[7],
    name: 'The Askew Shirt', price: 45, compare_price: null,
    images: [TONEFF.askewShirt], category: 'fashion', stock: 12,
  },
  {
    id: 'pr2', brand_id: '8', brand: MOCK_BRANDS[7],
    name: 'Jet Black Pleated Jeans', price: 70, compare_price: null,
    images: [TONEFF.pleatedJeans], category: 'fashion', stock: 8,
  },
  {
    id: 'pr3', brand_id: '8', brand: MOCK_BRANDS[7],
    name: 'The Reversible Jacket (Pre-Order)', price: 75, compare_price: null,
    images: [TONEFF.reversibleJkt], category: 'fashion', stock: 0,
    drop_at: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // — Maroon —
  {
    id: 'pr4', brand_id: '1', brand: MOCK_BRANDS[0],
    name: 'Maroon Signature Tee', price: 40, compare_price: null,
    images: [MAROON.signatureTee], category: 'fashion', stock: 22,
  },
  {
    id: 'pr5', brand_id: '1', brand: MOCK_BRANDS[0],
    name: 'The Vortex Tee', price: 30, compare_price: null,
    images: [MAROON.vortexTee], category: 'fashion', stock: 18,
  },
  {
    id: 'pr6', brand_id: '1', brand: MOCK_BRANDS[0],
    name: 'Pinstripe Cap', price: 29, compare_price: null,
    images: [MAROON.pinstripeCap], category: 'fashion', stock: 14,
  },
  {
    id: 'pr7', brand_id: '1', brand: MOCK_BRANDS[0],
    name: 'Wide Baggy Sweatshorts', price: 45, compare_price: null,
    images: [MAROON.baggySweatshorts], category: 'fashion', stock: 9,
  },
  {
    id: 'pr8', brand_id: '1', brand: MOCK_BRANDS[0],
    name: '"Let It Snow" Hoodie', price: 49, compare_price: null,
    images: [MAROON.letItSnowHoodie], category: 'fashion', stock: 0,
    drop_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
  },

  // — Koyoyu —
  {
    id: 'pr9', brand_id: '2', brand: MOCK_BRANDS[1],
    name: 'Koyoyu Diamond Zip-Up Hoodie', price: 88.88, compare_price: null,
    images: [KOYOYU.diamondHoodie], category: 'fashion', stock: 6,
  },
  {
    id: 'pr10', brand_id: '2', brand: MOCK_BRANDS[1],
    name: 'Koyoyu Raw Denim Pants — Indigo', price: 74.74, compare_price: null,
    images: [KOYOYU.rawDenimPants], category: 'fashion', stock: 4,
  },
  {
    id: 'pr11', brand_id: '2', brand: MOCK_BRANDS[1],
    name: 'Koyoyu Studio Tee — Black', price: 33.33, compare_price: null,
    images: [KOYOYU.studioTeeBlack], category: 'fashion', stock: 20,
  },
  {
    id: 'pr12', brand_id: '2', brand: MOCK_BRANDS[1],
    name: 'Koyoyu Balloon Jeans — Brown', price: 67.67, compare_price: null,
    images: [KOYOYU.balloonJeansBrown], category: 'fashion', stock: 0,
    drop_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pr13', brand_id: '2', brand: MOCK_BRANDS[1],
    name: 'Koyoyu Dreaming Tee', price: 33.33, compare_price: null,
    images: [KOYOYU.dreamingTee], category: 'fashion', stock: 16,
  },

  // — Heritage Bay —
  {
    id: 'pr14', brand_id: '4', brand: MOCK_BRANDS[3],
    name: 'Floral Kawung Shirt', price: 69.90, compare_price: null,
    images: [HB.floralKawungShirt], category: 'fashion', stock: 11,
  },
  {
    id: 'pr15', brand_id: '4', brand: MOCK_BRANDS[3],
    name: 'Mandarin Banji & Parang Shirt', price: 55.90, compare_price: null,
    images: [HB.mandarinParangShirt], category: 'fashion', stock: 7,
  },
  {
    id: 'pr16', brand_id: '4', brand: MOCK_BRANDS[3],
    name: 'Zipper Ceplok Diamond Baggy Jeans', price: 84.90, compare_price: null,
    images: [HB.zipperDiamondJeans], category: 'fashion', stock: 5,
  },
  {
    id: 'pr17', brand_id: '4', brand: MOCK_BRANDS[3],
    name: 'Batik Tote Bag — Black', price: 9.90, compare_price: null,
    images: [HB.totesBlack], category: 'accessories', stock: 48,
  },
  {
    id: 'pr18', brand_id: '4', brand: MOCK_BRANDS[3],
    name: 'Pastel Blue Seigaiha Shirt', price: 55.90, compare_price: null,
    images: [HB.pastelSeigaiha], category: 'fashion', stock: 9,
  },

  // — VintageWknd (their in-house merch line — real images) —
  {
    id: 'pr19', brand_id: '5', brand: MOCK_BRANDS[4],
    name: 'SUPERWASTED Baby Tee — Black', price: 40, compare_price: null,
    images: [VW.superwastedBabyTeeBlack], category: 'fashion', stock: 18,
  },
  {
    id: 'pr20', brand_id: '5', brand: MOCK_BRANDS[4],
    name: 'SUPERWASTED Oversized Tee — White', price: 45, compare_price: null,
    images: [VW.superwastedOversizedWhite], category: 'fashion', stock: 14,
  },
  {
    id: 'pr21', brand_id: '5', brand: MOCK_BRANDS[4],
    name: 'WKND Club Oversized Tee', price: 45, compare_price: null,
    images: [VW.wkndClubOversized], category: 'fashion', stock: 22,
  },
  {
    id: 'pr22', brand_id: '5', brand: MOCK_BRANDS[4],
    name: 'WKND Club Baby Tee — Baby Pink', price: 35, compare_price: null,
    images: [VW.wkndClubBabyPink], category: 'fashion', stock: 8,
  },

  // — Charms and Links (experience-first, but real DIY kits) —
  {
    id: 'pr23', brand_id: '3', brand: MOCK_BRANDS[2],
    name: 'DIY Italian Charm Bracelet Kit', price: 55, compare_price: null,
    images: [CL.b1], category: 'accessories', stock: 30,
  },
  {
    id: 'pr24', brand_id: '3', brand: MOCK_BRANDS[2],
    name: 'Starter Charm Pack (10 charms)', price: 35, compare_price: null,
    images: [CL.b2], category: 'accessories', stock: 42,
  },
  {
    id: 'pr25', brand_id: '3', brand: MOCK_BRANDS[2],
    name: 'Sterling Silver Base Bracelet', price: 48, compare_price: null,
    images: [CL.b3], category: 'accessories', stock: 18,
  },
]

export const MOCK_ANALYTICS = {
  overview: {
    followers: 3700, followers_delta: +142,
    impressions: 58400, impressions_delta: +22.8,
    engagement_rate: 5.6, engagement_delta: +0.8,
    revenue: 8420, revenue_delta: +31.4,
  },
  follower_history: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
    count: 3400 + Math.floor(Math.random() * 180) + i * 10,
  })),
  platform_breakdown: [
    { platform: 'instagram', followers: 2300, impressions: 34000, engagement: 5.2 },
    { platform: 'tiktok', followers: 1400, impressions: 24400, engagement: 6.8 },
  ],
  top_posts: [],
}
MOCK_ANALYTICS.top_posts = MOCK_POSTS.slice(0, 3)
