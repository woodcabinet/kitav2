import { useState } from 'react';
import { Settings, Award, ShoppingBag, Users, Calendar, Heart, Star, Globe, Link2, RefreshCw, BarChart3, Package, Palette, Store, ChevronRight, ChevronDown, Zap, TrendingUp, Eye, Edit3, Image, Plus, Trash2, GripVertical, MapPin, MessageCircle, Send, Check, X, Clock, ExternalLink, Sparkles, ArrowUpRight, Move, Type, Tag, Share2, LogOut, Lock } from 'lucide-react';
import { brands } from '../data/brands';

// Brand credentials — username and password are both the brand shortname in uppercase
const brandCredentials = brands.reduce((acc, b) => {
  const key = b.shortName.toUpperCase().replace(/[^A-Z]/g, '');
  acc[key] = { password: key, brand: b };
  return acc;
}, {});
// Also allow full name matches
brands.forEach(b => {
  const key = b.name.replace(/[^A-Z]/gi, '').toUpperCase();
  if (!brandCredentials[key]) brandCredentials[key] = { password: key, brand: b };
});

function BrandLogin({ onLogin }) {
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    const uKey = username.trim().toUpperCase().replace(/[^A-Z]/g, '');
    const pKey = password.trim().toUpperCase().replace(/[^A-Z]/g, '');
    const cred = brandCredentials[uKey];
    if (cred && cred.password === pKey) {
      onLogin(cred.brand);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="mt-2">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#111A10' }}>
          <Store size={24} className="text-gold/60" />
        </div>
        <h2 className="font-display text-xl font-bold text-cream/90 mb-1">Brand Dashboard</h2>
        <p className="text-warm/40 text-sm">Select your brand to manage your store</p>
      </div>

      {/* Password Login toggle */}
      <div className="flex gap-1 p-0.5 rounded-xl mb-4" style={{ background: 'rgba(10,13,8,0.5)', border: '1px solid rgba(36,56,38,0.3)' }}>
        <button onClick={() => setShowPasswordLogin(false)}
          className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all ${!showPasswordLogin ? 'text-gold' : 'text-warm/30'}`}
          style={!showPasswordLogin ? { background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.12)' } : undefined}>
          Quick Access
        </button>
        <button onClick={() => setShowPasswordLogin(true)}
          className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all flex items-center justify-center gap-1 ${showPasswordLogin ? 'text-gold' : 'text-warm/30'}`}
          style={showPasswordLogin ? { background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.12)' } : undefined}>
          <Lock size={10} /> Password Login
        </button>
      </div>

      {showPasswordLogin ? (
        <div className="animate-fade-in">
          <form onSubmit={handlePasswordLogin} className="space-y-3">
            <div>
              <label className="text-[11px] text-warm/40 uppercase tracking-wider mb-1 block">Brand Name</label>
              <input type="text" value={username} onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="e.g. KOYOYU" autoComplete="off"
                className="w-full rounded-xl px-4 py-3 text-sm text-cream placeholder-warm/20 focus:outline-none focus:ring-1 focus:ring-gold/30"
                style={{ background: '#111A10', border: '1px solid rgba(36,56,38,0.4)' }} />
            </div>
            <div>
              <label className="text-[11px] text-warm/40 uppercase tracking-wider mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                className="w-full rounded-xl px-4 py-3 text-sm text-cream placeholder-warm/20 focus:outline-none focus:ring-1 focus:ring-gold/30"
                style={{ background: '#111A10', border: '1px solid rgba(36,56,38,0.4)' }} />
            </div>
            {error && <p className="text-rust text-xs text-center">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-offblack bg-gold">Sign In</button>
          </form>
          <p className="text-[10px] text-warm/20 text-center mt-3">Secure login for brand owners with credentials</p>
        </div>
      ) : (
      /* Brand Grid — tap to login */
      <div className="grid grid-cols-2 gap-2.5">
        {brands.map(b => (
          <button
            key={b.id}
            onClick={() => onLogin(b)}
            className="rounded-2xl overflow-hidden text-left transition-all hover:scale-[1.02] active:scale-[0.98] group"
            style={{
              background: 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
              border: '1px solid rgba(36,56,38,0.5)',
            }}
          >
            {/* Brand banner */}
            <div className="h-16 relative" style={{ background: b.heroGradient || 'linear-gradient(135deg, #1E3520, #2A4A2D)' }}>
              {b.heroImage && (
                <img src={b.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121810]" />
            </div>
            {/* Brand info */}
            <div className="px-3 pb-3 -mt-5 relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-1.5 shadow-lg overflow-hidden" style={{
                background: b.heroGradient || '#1E3520',
                border: '2px solid rgba(36,56,38,0.6)',
              }}>
                {b.logo ? (
                  <img src={b.logo} alt={b.shortName} className="w-full h-full object-cover" />
                ) : (
                  <span>{b.avatar}</span>
                )}
              </div>
              <p className="text-[12px] font-semibold text-cream/85 truncate">{b.name}</p>
              <p className="text-[9px] text-warm/35 truncate">{b.category}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] text-gold/60 font-medium">{b.followers >= 1000 ? (b.followers / 1000).toFixed(1) + 'K' : b.followers} followers</span>
                {b.tiktokHandle && (
                  <span className="text-[8px] text-warm/25 flex items-center gap-0.5">
                    <svg width={7} height={7} viewBox="0 0 24 24" fill="#FF004F"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52V6.95a4.85 4.85 0 01-1-.26z"/></svg>
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      )}

      <div className="mt-5 rounded-xl p-3.5" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.08)' }}>
        <p className="text-[11px] text-warm/35 text-center leading-relaxed">
          Want your brand on KitaKakis?{' '}
          <span className="text-gold/70 font-medium">Apply to get listed</span>
        </p>
      </div>
    </div>
  );
}

const activityFeed = [
  { id: 'a1', icon: '🛍️', text: 'Purchased Tonêff Askew Shirt from April Drop', time: '2 weeks ago' },
  { id: 'a2', icon: '⭐', text: 'Earned stamp — April Drop participant', time: '2 weeks ago' },
  { id: 'a3', icon: '❤️', text: 'Started following KOYOYU STUDIO', time: '3 weeks ago' },
  { id: 'a4', icon: '🛍️', text: 'Purchased Maroon Cargo Cap from March Drop', time: '1 month ago' },
  { id: 'a5', icon: '⭐', text: 'Earned stamp — March Drop participant', time: '1 month ago' },
  { id: 'a6', icon: '📍', text: 'Attended Vintage Night Market @ 313', time: '1 month ago' },
  { id: 'a7', icon: '⭐', text: 'Earned stamp — Event attendance', time: '1 month ago' },
  { id: 'a8', icon: '❤️', text: 'Started following MAROON', time: '2 months ago' },
];

const personalListings = [
  { id: 'l1', name: 'Vintage Band Tee', price: 25, status: 'Listed' },
  { id: 'l2', name: 'Corduroy Pants (Size M)', price: 35, status: 'Sold' },
];

// -- Shared card style helper --
const cardStyle = {
  background: 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
  border: '1px solid rgba(36,56,38,0.5)',
};
const cardStyleSubtle = {
  background: 'linear-gradient(145deg, rgba(20,26,18,0.8) 0%, rgba(14,20,12,0.8) 100%)',
  border: '1px solid rgba(36,56,38,0.5)',
};
const inputStyle = {
  background: 'rgba(10,13,8,0.6)',
  border: '1px solid rgba(36,56,38,0.5)',
};

// =================== PERSONAL PROFILE ===================

function PersonalProfile({ appState, activeTab, setActiveTab }) {
  const { stamps, toggleStamp } = appState;
  const filledStamps = stamps.filter(Boolean).length;
  const hasEarlyAccess = filledStamps >= 5;
  const isRegular = filledStamps >= 10;

  return (
    <>
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{
          background: 'linear-gradient(145deg, #1E3520 0%, #2A3A28 100%)',
          border: '2px solid rgba(212,168,67,0.2)',
        }}>
          🧑
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-cream/95">Alex Tan</h2>
          <p className="text-warm/40 text-sm">@alexkaki</p>
          {hasEarlyAccess && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-gold fill-gold" />
              <span className="text-[10px] text-gold font-semibold">Early Drop Access</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { val: 3, label: 'Drops', icon: ShoppingBag },
          { val: 4, label: 'Following', icon: Users },
          { val: 2, label: 'Listed', icon: Heart },
          { val: 2, label: 'Events', icon: Calendar },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-3 text-center" style={cardStyleSubtle}>
            <s.icon size={14} className="text-warm/30 mx-auto mb-1" />
            <p className="font-display text-lg font-bold text-cream/85">{s.val}</p>
            <p className="text-[9px] text-warm/35">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Passport */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <div className="p-5" style={{
          background: 'linear-gradient(145deg, #2A1810 0%, #3D2518 30%, #2A1810 60%, #1E1008 100%)',
        }}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 4px)',
          }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gold/50 text-[10px] tracking-[0.3em] uppercase">KitaKakis</p>
                <h3 className="font-display text-lg font-bold text-gold">Passport</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <Award size={16} className={isRegular ? 'text-gold' : 'text-gold/25'} />
                <span className={`text-[10px] font-semibold ${isRegular ? 'text-gold' : 'text-gold/25'}`}>
                  {isRegular ? 'KitaKakis Regular' : 'Regular (10 stamps)'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {stamps.map((filled, i) => (
                <button
                  key={i}
                  onClick={() => toggleStamp(i)}
                  className="aspect-square rounded-full border-2 border-dashed flex items-center justify-center transition-all"
                  style={{
                    borderColor: filled ? '#D4A843' : 'rgba(212,168,67,0.15)',
                    background: filled ? 'radial-gradient(circle, #D4A843 0%, #B8922E 100%)' : 'transparent',
                  }}
                >
                  {filled && <span className="text-offblack text-xs font-bold animate-stamp">{i < 5 ? '✦' : '★'}</span>}
                  {!filled && <span className="text-[10px] text-gold/15 font-medium">{i + 1}</span>}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gold/50">{filledStamps}/10 stamps collected</span>
              {!hasEarlyAccess && <span className="text-gold/30">{5 - filledStamps} more for Early Access</span>}
              {hasEarlyAccess && !isRegular && <span className="text-gold/30">{10 - filledStamps} more for Regular status</span>}
              {isRegular && <span className="text-gold">KitaKakis Regular ✦</span>}
            </div>
          </div>
        </div>
        <div className="h-1" style={{
          background: 'linear-gradient(90deg, #B8922E, #D4A843, #E4C373, #D4A843, #B8922E)',
        }} />
      </div>

      {/* Tabs */}
      <div className="flex mb-4" style={{ borderBottom: '1px solid rgba(36,56,38,0.5)' }}>
        {['Activity', 'My Listings'].map(tab => {
          const key = tab === 'Activity' ? 'activity' : 'listings';
          return (
            <button key={tab} onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === key ? 'text-gold' : 'text-warm/35'}`}>
              {tab}
              {activeTab === key && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gold rounded-full" />}
            </button>
          );
        })}
      </div>

      {activeTab === 'activity' && (
        <div className="space-y-2">
          {activityFeed.map((item, i) => (
            <div key={item.id} className="flex items-start gap-3 rounded-2xl p-3 animate-fade-in" style={{ ...cardStyle, animationDelay: `${i * 0.05}s` }}>
              <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-cream/65">{item.text}</p>
                <p className="text-[10px] text-warm/30 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="space-y-3">
          {personalListings.map((item, i) => (
            <div key={item.id} className="rounded-2xl p-4 flex items-center justify-between animate-fade-in" style={{ ...cardStyle, animationDelay: `${i * 0.08}s` }}>
              <div>
                <p className="text-sm font-medium text-cream/80">{item.name}</p>
                <p className="text-gold font-semibold text-sm">${item.price}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-semibold ${item.status === 'Sold' ? 'text-sage/80' : 'text-gold/70'}`} style={{
                background: item.status === 'Sold' ? 'rgba(122,158,122,0.1)' : 'rgba(212,168,67,0.08)',
                border: `1px solid ${item.status === 'Sold' ? 'rgba(122,158,122,0.15)' : 'rgba(212,168,67,0.15)'}`,
              }}>{item.status}</span>
            </div>
          ))}
          <button className="w-full py-3 rounded-2xl text-warm/40 text-sm font-medium hover:text-gold transition-colors" style={{ border: '2px dashed rgba(36,56,38,0.4)' }}>
            + List another item
          </button>
        </div>
      )}
    </>
  );
}

// =================== BUSINESS DASHBOARD ===================

// --- Event opportunities for brands ---
const eventOpportunities = [
  {
    id: 'opp1',
    title: 'KitaKakis Pop-Up Market — Haji Lane',
    organizer: 'KitaKakis',
    date: 'May 3, 2026',
    location: 'Haji Lane',
    spotsLeft: 4,
    totalSpots: 12,
    fee: 'Free',
    type: 'Pop-Up Market',
    desc: 'Monthly pop-up market for KitaKakis brands. Setup provided. Bring your products and vibes.',
    tags: ['Streetwear', 'Vintage', 'All Categories'],
  },
  {
    id: 'opp2',
    title: 'Resurrack Night Market',
    organizer: 'Resurrack',
    date: 'May 10-11, 2026',
    location: 'Bugis Art Lane',
    spotsLeft: 2,
    totalSpots: 8,
    fee: '$50/day',
    type: 'Night Market',
    desc: 'Evening market from 5-11PM. Great foot traffic from Bugis area. Looking for fashion & lifestyle brands.',
    tags: ['Fashion', 'Lifestyle', 'Accessories'],
  },
  {
    id: 'opp3',
    title: 'Vintage Collective @ 313@Somerset',
    organizer: '313@Somerset',
    date: 'May 17, 2026',
    location: '313@Somerset, Level 1 Atrium',
    spotsLeft: 6,
    totalSpots: 15,
    fee: '$80',
    type: 'Collective Fair',
    desc: 'Curated vintage and pre-loved fashion fair. High visibility location. Apply with photos of your best pieces.',
    tags: ['Vintage', 'Pre-loved', 'Curated'],
  },
  {
    id: 'opp4',
    title: 'Design Market × NUS',
    organizer: 'NUS Design Club',
    date: 'May 24, 2026',
    location: 'NUS University Town',
    spotsLeft: 10,
    totalSpots: 20,
    fee: 'Free',
    type: 'University Market',
    desc: 'Student-run design market. Great for reaching younger audiences. Free booth for local brands.',
    tags: ['Student', 'Design', 'All Categories'],
  },
];

// --- Other brands on KitaKakis (LinkedIn-style) ---
const brandNetwork = [
  {
    ...brands.find(b => b.id === 'toneff'),
    mutualFollowers: 187,
    lastActive: 'Just now',
    headline: 'Contemporary silhouette-focused label. Anti-hype, anti-loud.',
    collabStatus: 'open',
    sharedEvents: 2,
    endorsements: ['Quality Pieces', 'Fast Shipping', 'Great Collab Partner'],
    recentPost: 'Just wrapped our April drop — 94% sell-through. Grateful for this community.',
    postTime: '3h ago',
  },
  {
    ...brands.find(b => b.id === 'maroon'),
    mutualFollowers: 312,
    lastActive: '2h ago',
    headline: 'Streetwear drops since 2021. Limited runs only.',
    collabStatus: 'open',
    sharedEvents: 1,
    endorsements: ['Consistent Drops', 'Strong Community', 'Quality Pieces'],
    recentPost: 'Looking for brands to share a booth at Resurrack Night Market — DM us if interested! 🤝',
    postTime: '5h ago',
  },
  {
    ...brands.find(b => b.id === 'unwastelands'),
    mutualFollowers: 198,
    lastActive: '1d ago',
    headline: 'Curated vintage. 4 locations. 1.7M TikTok likes.',
    collabStatus: 'busy',
    sharedEvents: 3,
    endorsements: ['TikTok Game Strong', 'Great Vintage Finds', 'Reliable'],
    recentPost: 'Restocking Bugis store this weekend. Come dig through the new arrivals! 🔍',
    postTime: '1d ago',
  },
  {
    ...brands.find(b => b.id === 'vintagewknd'),
    mutualFollowers: 89,
    lastActive: '5h ago',
    headline: 'Premium vintage from Japan, HK & Korea.',
    collabStatus: 'open',
    sharedEvents: 0,
    endorsements: ['Unique Finds', 'Premium Quality'],
    recentPost: 'Sourcing trip to Osaka next month. Any brands want us to look out for anything specific?',
    postTime: '8h ago',
  },
  {
    ...brands.find(b => b.id === 'studiogypsied'),
    mutualFollowers: 134,
    lastActive: '3h ago',
    headline: 'Slow fashion. Nusantara heritage. Batik reimagined.',
    collabStatus: 'open',
    sharedEvents: 1,
    endorsements: ['Heritage Craft', 'Beautiful Textiles', 'Slow Fashion Leader'],
    recentPost: 'Working with artisans in Jogja on a special KitaKakis exclusive. More details soon 🪷',
    postTime: '6h ago',
  },
];

// --- Brand's own products ---
const myProducts = [
  { id: 'p1', name: 'Vietnamese-Made Oversized Coach Jacket', price: 89, emoji: '🧥', status: 'live', views: 487, wishes: 241 },
  { id: 'p2', name: 'Wide-Leg Cargo Trousers', price: 72, emoji: '👖', status: 'live', views: 312, wishes: 156 },
  { id: 'p3', name: 'Washed Graphic Tee', price: 45, emoji: '👕', status: 'draft', views: 0, wishes: 0 },
];

// --- Synced TikTok media ---
const syncedMedia = [
  { id: 'sm1', caption: 'Exclusive Vietnamese streetwear 🔥', likes: '4.2K', views: '18.3K', pinned: true },
  { id: 'sm2', caption: 'Behind the scenes in Hanoi 🇻🇳', likes: '2.8K', views: '12.1K', pinned: true },
  { id: 'sm3', caption: 'Coach jacket fit check', likes: '6.1K', views: '24.5K', pinned: false },
  { id: 'sm4', caption: 'The cargo trousers everyone wants 👀', likes: '3.5K', views: '15.7K', pinned: false },
  { id: 'sm5', caption: 'New drop teaser — May edition', likes: '1.9K', views: '8.4K', pinned: false },
  { id: 'sm6', caption: 'Warehouse tour — where we source', likes: '2.1K', views: '9.7K', pinned: false },
];

function BusinessDashboard({ loggedInBrand, onLogout }) {
  const brand = loggedInBrand || brands[0];
  const [bizTab, setBizTab] = useState('mypage');
  const [appliedEvents, setAppliedEvents] = useState(new Set());
  const [connectedBrands, setConnectedBrands] = useState(new Set(['toneff']));
  const [editingSection, setEditingSection] = useState(null);
  const [pinnedMedia, setPinnedMedia] = useState(new Set(['sm1', 'sm2']));
  const [productStatuses, setProductStatuses] = useState({ p1: 'live', p2: 'live', p3: 'draft' });
  const [brandFeedTab, setBrandFeedTab] = useState('feed');
  const [showSettings, setShowSettings] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [storyText, setStoryText] = useState(brand.story || 'Born from a desire to bring the best of Vietnamese contemporary streetwear to Singapore. We source exclusively, so you won\'t find these pieces anywhere else on the island.');
  const [storySaved, setStorySaved] = useState(false);
  const [tags, setTags] = useState(brand.tags || ['Streetwear', 'Vietnamese', 'Exclusive', 'Contemporary']);
  const [endorsedBrands, setEndorsedBrands] = useState(new Set());
  const [settingsState, setSettingsState] = useState({
    notifications: true, autoSync: true, publicProfile: true, analytics: true, darkBanner: false, showFollowers: true,
  });
  const [pageSettings, setPageSettings] = useState({
    gradient: brand.heroGradient || 'linear-gradient(135deg, #1E3520 0%, #2A4A2D 40%, #3A5A3D 100%)',
    backgroundImage: brand.heroImage || null,
    usePhoto: false,
    bio: brand.description || 'Contemporary streetwear curating exclusive Vietnamese streetwear for Singapore.',
    tagline: brand.story?.slice(0, 50) || 'Từ Việt Nam, cho Singapore 🇻🇳',
  });
  // Figma-style page sections — each can be toggled visible, reordered, and edited
  const [pageSections, setPageSections] = useState([
    { id: 'banner', label: 'Hero Banner', icon: '🖼', visible: true, locked: true },
    { id: 'bio', label: 'Bio & Tagline', icon: '✏️', visible: true, locked: false },
    { id: 'products', label: 'Featured Products', icon: '🏷️', visible: true, locked: false },
    { id: 'media', label: 'Media Gallery', icon: '📹', visible: true, locked: false },
    { id: 'links', label: 'Social Links', icon: '🔗', visible: true, locked: false },
    { id: 'story', label: 'Brand Story', icon: '📖', visible: true, locked: false },
    { id: 'tags', label: 'Tags & Category', icon: '🏷', visible: true, locked: false },
    { id: 'events', label: 'Upcoming Events', icon: '📅', visible: false, locked: false },
    { id: 'collabs', label: 'Collab Partners', icon: '🤝', visible: false, locked: false },
  ]);

  const moveSection = (idx, dir) => {
    const arr = [...pageSections];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    if (arr[target].locked || arr[idx].locked) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setPageSections(arr);
  };

  const toggleSectionVisibility = (idx) => {
    const arr = [...pageSections];
    if (arr[idx].locked) return;
    arr[idx] = { ...arr[idx], visible: !arr[idx].visible };
    setPageSections(arr);
  };

  const gradientPresets = [
    { name: 'Forest', value: 'linear-gradient(135deg, #1E3520 0%, #2A4A2D 40%, #3A5A3D 100%)' },
    { name: 'Night', value: 'linear-gradient(135deg, #111811 0%, #1a1a2e 40%, #16213e 100%)' },
    { name: 'Rust', value: 'linear-gradient(135deg, #8B1A1A 0%, #C4622D 40%, #D4784A 100%)' },
    { name: 'Gold', value: 'linear-gradient(135deg, #B8922E 0%, #8B7020 40%, #1E3520 100%)' },
    { name: 'Sage', value: 'linear-gradient(135deg, #7A9E7A 0%, #5A7E5A 40%, #1E3520 100%)' },
    { name: 'Warm', value: 'linear-gradient(135deg, #C4622D 0%, #B8922E 40%, #D4A843 100%)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #0F2027 0%, #203A43 40%, #2C5364 100%)' },
    { name: 'Midnight', value: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 40%, #2D2D44 100%)' },
  ];

  const toggleApply = (id) => {
    setAppliedEvents(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleConnect = (id) => {
    setConnectedBrands(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const togglePin = (id) => {
    setPinnedMedia(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleProductStatus = (id) => {
    setProductStatuses(prev => ({
      ...prev,
      [id]: prev[id] === 'live' ? 'draft' : 'live',
    }));
  };

  const bizTabs = [
    { id: 'mypage', label: 'My Page', icon: Palette },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'brands', label: 'Brands', icon: Users },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <>
      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl relative overflow-hidden" style={{
          background: pageSettings.gradient,
          border: '2px solid rgba(212,168,67,0.2)',
        }}>
          {brand.logo ? (
            <img src={brand.logo} alt={brand.shortName} className="w-full h-full object-cover" />
          ) : (
            brand.avatar
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-cream/95">{brand.name}</h2>
            <div className="px-1.5 py-0.5 rounded text-[8px] font-bold text-gold/80" style={{
              background: 'rgba(212,168,67,0.1)',
              border: '1px solid rgba(212,168,67,0.2)',
            }}>PRO</div>
          </div>
          <p className="text-warm/40 text-sm">{brand.category}</p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${showSettings ? 'text-gold' : ''}`} style={cardStyleSubtle}>
          <Settings size={16} className={showSettings ? 'text-gold' : 'text-warm/35'} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="rounded-2xl mb-5 overflow-hidden animate-fade-in" style={{ ...cardStyle, border: '1px solid rgba(212,168,67,0.15)' }}>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{
            background: 'linear-gradient(90deg, rgba(212,168,67,0.06) 0%, rgba(14,20,12,0.8) 100%)',
            borderBottom: '1px solid rgba(36,56,38,0.3)',
          }}>
            <h4 className="text-[11px] font-semibold text-gold/70 flex items-center gap-1.5">
              <Settings size={11} /> Brand Settings
            </h4>
            <button onClick={() => setShowSettings(false)} className="text-warm/35 hover:text-cream"><X size={13} /></button>
          </div>
          <div className="p-4 space-y-1">
            {[
              { key: 'notifications', label: 'Push Notifications', desc: 'Drop alerts, new followers, collabs' },
              { key: 'autoSync', label: 'Auto-Sync TikTok', desc: 'Automatically import new TikTok posts' },
              { key: 'publicProfile', label: 'Public Profile', desc: 'Visible to other brands on KitaKakis' },
              { key: 'analytics', label: 'Share Analytics', desc: 'Let KitaKakis show your stats publicly' },
              { key: 'showFollowers', label: 'Show Follower Count', desc: 'Display follower count on your page' },
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(36,56,38,0.15)' }}>
                <div>
                  <p className="text-[12px] text-cream/70">{setting.label}</p>
                  <p className="text-[9px] text-warm/30">{setting.desc}</p>
                </div>
                <button
                  onClick={() => setSettingsState(s => ({ ...s, [setting.key]: !s[setting.key] }))}
                  className={`w-10 h-5.5 rounded-full relative transition-colors ${settingsState[setting.key] ? 'bg-gold/80' : 'bg-warm/15'}`}
                  style={{ width: 40, height: 22 }}
                >
                  <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full transition-all shadow ${settingsState[setting.key] ? 'bg-offblack left-[20px]' : 'bg-warm/40 left-[2px]'}`}
                    style={{ width: 18, height: 18 }} />
                </button>
              </div>
            ))}
            <div className="pt-3 space-y-2">
              <button className="w-full py-2.5 rounded-xl text-[12px] font-medium text-cream/60 flex items-center justify-center gap-1.5"
                style={{ background: 'rgba(36,56,38,0.3)', border: '1px solid rgba(36,56,38,0.4)' }}>
                <ExternalLink size={11} /> View Public Page
              </button>
              <button onClick={onLogout} className="w-full py-2.5 rounded-xl text-[12px] font-medium text-rust/70 flex items-center justify-center gap-1.5"
                style={{ background: 'rgba(139,26,26,0.06)', border: '1px solid rgba(139,26,26,0.15)' }}>
                <LogOut size={11} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { val: brand.followers >= 1000 ? (brand.followers / 1000).toFixed(1) + 'K' : String(brand.followers), label: 'Followers', icon: Users, color: 'text-gold' },
          { val: brand.sellThrough || '—', label: 'Sell-through', icon: TrendingUp, color: 'text-sage/80' },
          { val: brand.dropCount || 0, label: 'Drops', icon: Package, color: 'text-rust/80' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-3 text-center" style={cardStyleSubtle}>
            <s.icon size={14} className="text-warm/30 mx-auto mb-1" />
            <p className={`font-display text-lg font-bold ${s.color}`}>{s.val}</p>
            <p className="text-[9px] text-warm/35">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Business Tabs - scrollable */}
      <div className="flex gap-1 mb-4 overflow-x-auto no-scrollbar -mx-1 px-1">
        {bizTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setBizTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all whitespace-nowrap ${
              bizTab === tab.id ? 'text-gold shadow-sm' : 'text-warm/35'
            }`}
            style={bizTab === tab.id ? {
              background: 'rgba(212,168,67,0.08)',
              border: '1px solid rgba(212,168,67,0.15)',
            } : {
              background: 'transparent',
              border: '1px solid rgba(36,56,38,0.3)',
            }}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========== MY PAGE TAB — FIGMA-STYLE EDITOR ========== */}
      {bizTab === 'mypage' && (
        <div className="space-y-3">
          {/* Editor Mode Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <span className="text-[11px] text-sage/70 font-medium">Page is Live</span>
            </div>
            <button onClick={() => alert('Opening page preview...')}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-gold/70 flex items-center gap-1.5" style={{
              background: 'rgba(212,168,67,0.06)',
              border: '1px solid rgba(212,168,67,0.15)',
            }}>
              <Eye size={11} /> Preview Page
            </button>
          </div>

          {/* Live Preview Card */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,168,67,0.12)' }}>
            <div className="relative h-36" style={{ background: pageSettings.usePhoto ? '#0A0D08' : pageSettings.gradient }}>
              {pageSettings.usePhoto && pageSettings.backgroundImage && (
                <img src={pageSettings.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0D08]/60" />
              {/* Figma-style selection outline */}
              <div className="absolute inset-0 pointer-events-none" style={{
                border: editingSection === 'banner' ? '2px solid rgba(212,168,67,0.5)' : '2px solid transparent',
                transition: 'border-color 0.2s',
              }} />
              <button
                onClick={() => setEditingSection(editingSection === 'banner' ? null : 'banner')}
                className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg backdrop-blur flex items-center gap-1.5 text-[11px] font-medium text-white/80 transition-all hover:text-white"
                style={{ background: 'rgba(0,0,0,0.45)' }}
              >
                <Edit3 size={11} /> Edit
              </button>
              <div className="absolute bottom-3 left-3 flex items-end gap-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg relative" style={{
                  background: 'linear-gradient(145deg, #1E3520 0%, #2A3A28 100%)',
                  border: '2px solid rgba(255,255,255,0.15)',
                }}>
                  🎨
                  <button className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold flex items-center justify-center shadow">
                    <Edit3 size={8} className="text-offblack" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-bold text-white drop-shadow">{brand.name}</p>
                  <p className="text-[10px] text-white/60">{pageSettings.tagline}</p>
                </div>
              </div>
            </div>

            {/* Banner Editor */}
            {editingSection === 'banner' && (
              <div className="p-4 space-y-3 animate-fade-in" style={{ background: 'rgba(14,20,12,0.95)' }}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-cream/70">Background</h4>
                  <button onClick={() => setEditingSection(null)} className="text-warm/40 hover:text-cream"><X size={14} /></button>
                </div>

                {/* Toggle: Gradient vs Photo */}
                <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(10,13,8,0.5)', border: '1px solid rgba(36,56,38,0.3)' }}>
                  <button onClick={() => setPageSettings(p => ({ ...p, usePhoto: false }))}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${!pageSettings.usePhoto ? 'text-gold' : 'text-warm/30'}`}
                    style={!pageSettings.usePhoto ? { background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' } : undefined}>
                    <Palette size={10} /> Gradient
                  </button>
                  <button onClick={() => setPageSettings(p => ({ ...p, usePhoto: true }))}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${pageSettings.usePhoto ? 'text-gold' : 'text-warm/30'}`}
                    style={pageSettings.usePhoto ? { background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' } : undefined}>
                    <Image size={10} /> Photo
                  </button>
                </div>

                {!pageSettings.usePhoto ? (
                  <div className="grid grid-cols-4 gap-2">
                    {gradientPresets.map((g, i) => (
                      <button key={i} onClick={() => setPageSettings(p => ({ ...p, gradient: g.value }))}
                        className="rounded-xl overflow-hidden transition-all hover:scale-105"
                        style={{ border: pageSettings.gradient === g.value ? '2px solid #D4A843' : '2px solid rgba(36,56,38,0.4)' }}>
                        <div className="aspect-[2/1]" style={{ background: g.value }} />
                        <p className="text-[9px] text-warm/50 text-center py-1">{g.name}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Photo options from brand's product images + hero */}
                    <p className="text-[10px] text-warm/35">Choose from your brand photos</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[brand.heroImage, ...(brand.productImages || [])].filter(Boolean).map((img, i) => (
                        <button key={i} onClick={() => setPageSettings(p => ({ ...p, backgroundImage: img }))}
                          className="rounded-xl overflow-hidden aspect-[3/2] transition-all hover:scale-105"
                          style={{ border: pageSettings.backgroundImage === img ? '2px solid #D4A843' : '2px solid rgba(36,56,38,0.4)' }}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {/* Custom URL option */}
                      <button onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) setPageSettings(p => ({ ...p, backgroundImage: url }));
                      }}
                        className="rounded-xl aspect-[3/2] flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                        style={{ border: '2px dashed rgba(212,168,67,0.2)' }}>
                        <Plus size={14} className="text-gold/40" />
                        <span className="text-[8px] text-warm/30">Add URL</span>
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-warm/40 block mb-1">Tagline</label>
                  <input type="text" value={pageSettings.tagline}
                    onChange={e => setPageSettings(p => ({ ...p, tagline: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2 text-sm text-cream placeholder-warm/25 focus:outline-none focus:ring-1 focus:ring-gold/30"
                    style={inputStyle} />
                </div>
                <button onClick={() => setEditingSection(null)}
                  className="w-full py-2 rounded-xl bg-gold text-offblack text-sm font-semibold shadow-sm shadow-gold/15">
                  Done
                </button>
              </div>
            )}

            {/* Quick bio inline */}
            {editingSection !== 'banner' && (
              <div className="p-3" style={{ borderTop: '1px solid rgba(36,56,38,0.3)' }}>
                {editingSection === 'bio' ? (
                  <div className="space-y-2 animate-fade-in">
                    <textarea value={pageSettings.bio}
                      onChange={e => setPageSettings(p => ({ ...p, bio: e.target.value }))} rows={2}
                      className="w-full rounded-xl px-3 py-2 text-[12px] text-cream placeholder-warm/25 focus:outline-none focus:ring-1 focus:ring-gold/30 resize-none"
                      style={inputStyle} />
                    <div className="flex gap-2">
                      <button onClick={() => setEditingSection(null)} className="flex-1 py-1.5 rounded-lg bg-gold text-offblack text-xs font-semibold">Done</button>
                      <button onClick={() => setEditingSection(null)} className="px-3 py-1.5 rounded-lg text-xs text-warm/40" style={{ border: '1px solid rgba(36,56,38,0.5)' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] text-cream/55 leading-relaxed flex-1">{pageSettings.bio}</p>
                    <button onClick={() => setEditingSection('bio')} className="text-warm/25 hover:text-gold shrink-0 mt-0.5"><Edit3 size={11} /></button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---- FIGMA LAYER PANEL ---- */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,168,67,0.1)' }}>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{
              background: 'linear-gradient(90deg, rgba(212,168,67,0.06) 0%, rgba(14,20,12,0.8) 100%)',
              borderBottom: '1px solid rgba(36,56,38,0.3)',
            }}>
              <h4 className="text-[11px] font-semibold text-gold/70 flex items-center gap-1.5">
                <Palette size={11} /> Page Sections
              </h4>
              <span className="text-[9px] text-warm/30">Drag to reorder · Toggle visibility</span>
            </div>

            <div style={{ background: 'rgba(10,13,8,0.5)' }}>
              {pageSections.map((section, idx) => (
                <div key={section.id} className="flex items-center gap-2 px-3 py-2.5 transition-all hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid rgba(36,56,38,0.2)' }}>
                  {/* Drag handle */}
                  <div className={`shrink-0 ${section.locked ? 'text-warm/10' : 'text-warm/20 cursor-grab'}`}>
                    <GripVertical size={13} />
                  </div>
                  {/* Icon */}
                  <span className="text-sm shrink-0">{section.icon}</span>
                  {/* Label */}
                  <span className={`text-[12px] flex-1 ${section.visible ? 'text-cream/70' : 'text-warm/25'}`}>
                    {section.label}
                  </span>
                  {/* Move arrows */}
                  {!section.locked && (
                    <div className="flex gap-0.5 shrink-0">
                      <button onClick={() => moveSection(idx, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-warm/20 hover:text-cream/50 transition-colors"
                        style={{ fontSize: 10 }}>▲</button>
                      <button onClick={() => moveSection(idx, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-warm/20 hover:text-cream/50 transition-colors"
                        style={{ fontSize: 10 }}>▼</button>
                    </div>
                  )}
                  {/* Visibility toggle */}
                  <button onClick={() => toggleSectionVisibility(idx)}
                    className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all ${
                      section.locked ? 'text-warm/10' : section.visible ? 'text-sage/60' : 'text-warm/15'
                    }`}>
                    {section.visible ? <Eye size={12} /> : <span className="text-[10px]">—</span>}
                  </button>
                  {/* Edit button */}
                  <button onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                    className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all ${
                      editingSection === section.id ? 'text-gold' : 'text-warm/20 hover:text-warm/50'
                    }`}>
                    <Edit3 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inline editors for selected section */}
          {editingSection === 'products' && (
            <div className="rounded-2xl p-4 animate-fade-in" style={{ ...cardStyle, border: '1px solid rgba(212,168,67,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-cream/70">Featured Products</h4>
                <button onClick={() => setEditingSection(null)} className="text-warm/35 hover:text-cream"><X size={13} /></button>
              </div>
              {myProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2.5 py-2" style={{ borderBottom: i < myProducts.length - 1 ? '1px solid rgba(36,56,38,0.2)' : 'none' }}>
                  <GripVertical size={11} className="text-warm/15 cursor-grab" />
                  {(brand.drops?.[i]?.image || brand.productImages?.[i]) ? (
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0"><img src={brand.drops?.[i]?.image || brand.productImages?.[i]} alt={p.name} className="w-full h-full object-cover" /></div>
                  ) : <span className="text-lg">{p.emoji}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-cream/70 truncate">{p.name}</p>
                    <p className="text-[10px] text-gold/60">${p.price}</p>
                  </div>
                  <button onClick={() => toggleProductStatus(p.id)}
                    className={`px-2 py-0.5 rounded text-[9px] font-semibold ${productStatuses[p.id] === 'live' ? 'text-sage/70' : 'text-warm/30'}`}
                    style={{ background: productStatuses[p.id] === 'live' ? 'rgba(122,158,122,0.08)' : 'rgba(36,56,38,0.2)' }}>
                    {productStatuses[p.id] === 'live' ? 'Show' : 'Hide'}
                  </button>
                </div>
              ))}
              <button onClick={() => alert('Select a product to feature on your page')}
                className="w-full py-2 mt-2 rounded-xl text-[11px] text-gold/50 flex items-center justify-center gap-1" style={{ border: '1px dashed rgba(212,168,67,0.15)' }}>
                <Plus size={10} /> Add Product to Page
              </button>
            </div>
          )}

          {editingSection === 'media' && (
            <div className="rounded-2xl p-4 animate-fade-in" style={{ ...cardStyle, border: '1px solid rgba(212,168,67,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-cream/70 flex items-center gap-1.5">
                  Media Gallery
                  <span className="text-warm/30 font-normal text-[9px]">Synced from TikTok</span>
                </h4>
                <button onClick={() => setEditingSection(null)} className="text-warm/35 hover:text-cream"><X size={13} /></button>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {syncedMedia.map((m) => (
                  <button key={m.id} onClick={() => togglePin(m.id)}
                    className="relative rounded-xl overflow-hidden aspect-square transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #1E3520 0%, #2A4A2D 40%, #3A5A3D 100%)',
                      border: pinnedMedia.has(m.id) ? '2px solid #D4A843' : '2px solid rgba(36,56,38,0.3)',
                      opacity: pinnedMedia.has(m.id) ? 1 : 0.5,
                    }}>
                    <div className="absolute top-1 left-1 px-1 py-0.5 rounded text-[7px] font-bold flex items-center gap-0.5" style={{ background: 'rgba(0,0,0,0.6)' }}>
                      <svg width={7} height={7} viewBox="0 0 24 24" fill="#FF004F"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52V6.95a4.85 4.85 0 01-1-.26z"/></svg>
                      <span className="text-white/60">{m.views}</span>
                    </div>
                    {pinnedMedia.has(m.id) && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                        <Check size={8} className="text-offblack" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-lg opacity-25">▶</span></div>
                    <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-[7px] text-white/60 leading-tight line-clamp-1">{m.caption}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-warm/30">Tap to pin — pinned show first on your page</p>
                <div className="flex items-center gap-1 text-[9px] text-sage/50"><RefreshCw size={8} /> Auto-sync ON</div>
              </div>
            </div>
          )}

          {editingSection === 'links' && (
            <div className="rounded-2xl p-4 animate-fade-in" style={{ ...cardStyle, border: '1px solid rgba(212,168,67,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-cream/70">Social Links</h4>
                <button onClick={() => setEditingSection(null)} className="text-warm/35 hover:text-cream"><X size={13} /></button>
              </div>
              {[
                { icon: <Globe size={13} />, label: brand.website ? new URL(brand.website).hostname : 'No website', connected: !!brand.website, color: 'text-gold/60' },
                { icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="#FF004F"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52V6.95a4.85 4.85 0 01-1-.26z"/></svg>, label: brand.tiktokHandle || 'Not connected', connected: !!brand.tiktokHandle, color: 'text-tiktok' },
                { icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#C4622D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={2} y={2} width={20} height={20} rx={5} ry={5}/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1={17.5} y1={6.5} x2={17.51} y2={6.5}/></svg>, label: brand.instagram ? '@' + brand.instagram.split('/').pop() : 'Not connected', connected: !!brand.instagram, color: 'text-rust/70' },
                { icon: <MessageCircle size={13} />, label: 'Add Telegram', connected: false, color: 'text-warm/30' },
              ].map((link, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2" style={{ borderBottom: i < 3 ? '1px solid rgba(36,56,38,0.15)' : 'none' }}>
                  <span className={link.color}>{link.icon}</span>
                  <span className={`text-[12px] flex-1 ${link.connected ? 'text-cream/60' : 'text-warm/25'}`}>{link.label}</span>
                  {link.connected ? <span className="text-[9px] text-sage/50 flex items-center gap-0.5"><Check size={8} /> Linked</span>
                    : <span className="text-[9px] text-gold/50 flex items-center gap-0.5"><Plus size={8} /> Add</span>}
                </div>
              ))}
            </div>
          )}

          {editingSection === 'tags' && (
            <div className="rounded-2xl p-4 animate-fade-in" style={{ ...cardStyle, border: '1px solid rgba(212,168,67,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-cream/70">Tags & Category</h4>
                <button onClick={() => setEditingSection(null)} className="text-warm/35 hover:text-cream"><X size={13} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] text-sage/70 flex items-center gap-1" style={{
                    background: 'rgba(30,53,32,0.3)', border: '1px solid rgba(122,158,122,0.1)',
                  }}>{tag} <button onClick={() => setTags(t => t.filter(x => x !== tag))} className="text-warm/25 hover:text-rust/60"><X size={8} /></button></span>
                ))}
                <button onClick={() => {
                  const tag = prompt('Enter new tag:');
                  if (tag && !tags.includes(tag)) setTags(t => [...t, tag]);
                }} className="px-2.5 py-1 rounded-full text-[11px] text-gold/40 flex items-center gap-0.5" style={{
                  border: '1px dashed rgba(212,168,67,0.2)',
                }}><Plus size={9} /> Add</button>
              </div>
            </div>
          )}

          {editingSection === 'story' && (
            <div className="rounded-2xl p-4 animate-fade-in" style={{ ...cardStyle, border: '1px solid rgba(212,168,67,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-cream/70">Brand Story</h4>
                <button onClick={() => setEditingSection(null)} className="text-warm/35 hover:text-cream"><X size={13} /></button>
              </div>
              <textarea rows={4} value={storyText}
                onChange={e => { setStoryText(e.target.value); setStorySaved(false); }}
                className="w-full rounded-xl px-3 py-2 text-[12px] text-cream/70 placeholder-warm/25 focus:outline-none focus:ring-1 focus:ring-gold/30 resize-none leading-relaxed"
                style={inputStyle} />
              <button onClick={() => { setStorySaved(true); setTimeout(() => setStorySaved(false), 2000); }}
                className={`w-full py-2 mt-2 rounded-xl text-[12px] font-semibold transition-all ${storySaved ? 'bg-sage/80 text-offblack' : 'bg-gold text-offblack'}`}>
                {storySaved ? <><Check size={12} className="inline mr-1" />Saved!</> : 'Save Story'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========== PRODUCTS TAB ========== */}
      {bizTab === 'products' && (
        <div className="space-y-3">
          {/* Drop Submission CTA */}
          <div className="rounded-2xl p-4" style={{
            background: 'linear-gradient(145deg, rgba(42,26,16,0.3) 0%, rgba(30,53,32,0.15) 100%)',
            border: '1px solid rgba(212,168,67,0.15)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-gold/70" />
              <p className="text-sm font-semibold text-gold/80">May Drop — Submit by Apr 25</p>
            </div>
            <p className="text-[11px] text-warm/45 mb-3">Submit pieces for the next monthly drop. Accepted brands get featured on the home feed.</p>
            <button onClick={() => alert('Drop submission form opening — coming soon!')}
              className="w-full py-2.5 rounded-xl bg-gold text-offblack text-sm font-semibold shadow-sm shadow-gold/15">
              Submit Pieces for May Drop
            </button>
          </div>

          {/* Product List */}
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-cream/70">Your Products ({myProducts.length})</h4>
          </div>

          {myProducts.map((product, i) => (
            <div key={product.id} className="rounded-2xl overflow-hidden animate-fade-in" style={{ ...cardStyle, animationDelay: `${i * 0.06}s` }}>
              <div className="flex items-center gap-3 p-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden" style={{
                  background: pageSettings.gradient,
                }}>
                  {(brand.drops?.[i]?.image || brand.productImages?.[i]) ? (
                    <img src={brand.drops?.[i]?.image || brand.productImages?.[i]} alt={product.name} className="w-full h-full object-cover" />
                  ) : product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cream/80 truncate">{product.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-gold font-semibold text-sm">${product.price}</span>
                    {productStatuses[product.id] === 'live' && (
                      <span className="text-[9px] text-warm/35 flex items-center gap-1">
                        <Eye size={9} /> {product.views} · <Heart size={9} /> {product.wishes}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    productStatuses[product.id] === 'live' ? 'text-sage/80' : 'text-warm/40'
                  }`}
                  style={{
                    background: productStatuses[product.id] === 'live' ? 'rgba(122,158,122,0.08)' : 'rgba(36,56,38,0.3)',
                    border: `1px solid ${productStatuses[product.id] === 'live' ? 'rgba(122,158,122,0.15)' : 'rgba(36,56,38,0.4)'}`,
                  }}
                >
                  {productStatuses[product.id] === 'live' ? 'Live' : 'Draft'}
                </button>
              </div>

              {/* Quick edit bar */}
              <div className="flex border-t" style={{ borderColor: 'rgba(36,56,38,0.3)' }}>
                <button onClick={() => setEditingProduct(editingProduct === product.id ? null : product.id)}
                  className={`flex-1 py-2 text-[10px] flex items-center justify-center gap-1 transition-colors ${editingProduct === product.id ? 'text-gold' : 'text-warm/35 hover:text-cream/60'}`}>
                  <Edit3 size={10} /> Edit
                </button>
                <div style={{ width: 1, background: 'rgba(36,56,38,0.3)' }} />
                <button onClick={() => alert(`Photo gallery for ${product.name} — coming soon`)}
                  className="flex-1 py-2 text-[10px] text-warm/35 flex items-center justify-center gap-1 hover:text-cream/60 transition-colors">
                  <Image size={10} /> Photos
                </button>
                <div style={{ width: 1, background: 'rgba(36,56,38,0.3)' }} />
                <button onClick={() => { navigator.clipboard?.writeText?.(`https://kitakakis.com/product/${product.id}`); alert('Link copied!'); }}
                  className="flex-1 py-2 text-[10px] text-warm/35 flex items-center justify-center gap-1 hover:text-cream/60 transition-colors">
                  <Share2 size={10} /> Share
                </button>
              </div>
              {/* Inline product editor */}
              {editingProduct === product.id && (
                <div className="p-3 space-y-2 animate-fade-in" style={{ borderTop: '1px solid rgba(36,56,38,0.3)', background: 'rgba(10,13,8,0.4)' }}>
                  <div>
                    <label className="text-[9px] text-warm/35 block mb-0.5">Product Name</label>
                    <input type="text" defaultValue={product.name}
                      className="w-full rounded-lg px-3 py-2 text-[12px] text-cream focus:outline-none focus:ring-1 focus:ring-gold/30"
                      style={inputStyle} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[9px] text-warm/35 block mb-0.5">Price ($)</label>
                      <input type="number" defaultValue={product.price}
                        className="w-full rounded-lg px-3 py-2 text-[12px] text-cream focus:outline-none focus:ring-1 focus:ring-gold/30"
                        style={inputStyle} />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] text-warm/35 block mb-0.5">Status</label>
                      <select defaultValue={productStatuses[product.id]}
                        onChange={e => setProductStatuses(p => ({ ...p, [product.id]: e.target.value }))}
                        className="w-full rounded-lg px-3 py-2 text-[12px] text-cream focus:outline-none"
                        style={inputStyle}>
                        <option value="live">Live</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditingProduct(null)} className="flex-1 py-1.5 rounded-lg bg-gold text-offblack text-[11px] font-semibold">Save</button>
                    <button onClick={() => setEditingProduct(null)} className="px-3 py-1.5 rounded-lg text-[11px] text-warm/40" style={{ border: '1px solid rgba(36,56,38,0.5)' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Product */}
          <button onClick={() => alert('Add product form — coming soon')}
            className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 text-gold/50 text-sm font-medium hover:text-gold transition-colors"
            style={{ border: '2px dashed rgba(212,168,67,0.15)' }}>
            <Plus size={16} /> Add New Product
          </button>

          {/* Import from website */}
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw size={13} className="text-gold/50" />
              <h4 className="text-xs font-semibold text-cream/60">Import from Website</h4>
            </div>
            <p className="text-[10px] text-warm/35 mb-2">Auto-import product listings from your website. We'll pull names, prices, and images.</p>
            <button onClick={() => alert(`Syncing products from ${brand.website || 'your website'}...`)}
              className="w-full py-2 rounded-xl text-sm font-medium text-gold/60" style={{
              background: 'rgba(212,168,67,0.05)',
              border: '1px solid rgba(212,168,67,0.12)',
            }}>
              Sync from {brand.website ? new URL(brand.website).hostname : 'website'}
            </button>
          </div>
        </div>
      )}

      {/* ========== EVENTS TAB ========== */}
      {bizTab === 'events' && (
        <div className="space-y-3">
          <p className="text-[12px] text-warm/45 leading-relaxed mb-1">
            Events looking for brands. Apply to get a booth, collab, or showcase your pieces.
          </p>

          {eventOpportunities.map((event, i) => {
            const applied = appliedEvents.has(event.id);
            const spotsPercent = ((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100;
            return (
              <div key={event.id} className="rounded-2xl overflow-hidden animate-fade-in" style={{ ...cardStyle, animationDelay: `${i * 0.06}s` }}>
                {/* Event header bar */}
                <div className="px-4 py-2 flex items-center justify-between" style={{
                  background: 'linear-gradient(90deg, rgba(196,98,45,0.08) 0%, rgba(212,168,67,0.08) 100%)',
                  borderBottom: '1px solid rgba(36,56,38,0.3)',
                }}>
                  <span className="text-[10px] font-semibold text-rust/70">{event.type}</span>
                  <span className="text-[10px] text-warm/40">{event.fee === 'Free' ? '🆓 Free booth' : `💰 ${event.fee}`}</span>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-cream/85 mb-1">{event.title}</h3>
                  <p className="text-[11px] text-cream/50 leading-relaxed mb-3">{event.desc}</p>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-[11px] text-warm/45">
                      <Calendar size={11} className="text-gold/50" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-warm/45">
                      <MapPin size={11} className="text-rust/50" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-warm/45">
                      <Users size={11} className="text-sage/50" />
                      <span>{event.spotsLeft} spots left of {event.totalSpots}</span>
                    </div>
                  </div>

                  {/* Spots progress */}
                  <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(10,13,8,0.6)' }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${spotsPercent}%`,
                      background: spotsPercent > 80 ? 'linear-gradient(90deg, #C4622D, #D4784A)' : 'linear-gradient(90deg, #7A9E7A, #5A7E5A)',
                    }} />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {event.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] text-warm/40" style={{
                        background: 'rgba(30,53,32,0.2)',
                        border: '1px solid rgba(36,56,38,0.3)',
                      }}>{tag}</span>
                    ))}
                  </div>

                  <button
                    onClick={() => toggleApply(event.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      applied ? 'text-sage/80' : 'text-offblack'
                    }`}
                    style={applied ? {
                      background: 'rgba(122,158,122,0.08)',
                      border: '1px solid rgba(122,158,122,0.2)',
                    } : {
                      background: '#D4A843',
                      boxShadow: '0 2px 8px rgba(212,168,67,0.15)',
                    }}
                  >
                    {applied ? <><Check size={14} /> Applied</> : <><Send size={13} /> Apply to Participate</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========== BRANDS TAB — LINKEDIN STYLE ========== */}
      {bizTab === 'brands' && (
        <div className="space-y-3">
          {/* Feed/Network toggle */}
          <div className="flex gap-1 p-0.5 rounded-xl" style={{ background: 'rgba(10,13,8,0.5)', border: '1px solid rgba(36,56,38,0.3)' }}>
            {[
              { id: 'feed', label: 'Brand Feed' },
              { id: 'network', label: 'Network' },
            ].map(t => (
              <button key={t.id} onClick={() => setBrandFeedTab(t.id)}
                className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all ${brandFeedTab === t.id ? 'text-gold' : 'text-warm/30'}`}
                style={brandFeedTab === t.id ? { background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.12)' } : undefined}>
                {t.label}
              </button>
            ))}
          </div>

          {/* BRAND FEED — like LinkedIn feed */}
          {brandFeedTab === 'feed' && (
            <div className="space-y-3">
              {brandNetwork.map((brand, i) => {
                const isConnected = connectedBrands.has(brand.id);
                return (
                  <div key={brand.id} className="rounded-2xl overflow-hidden animate-fade-in" style={{ ...cardStyle, animationDelay: `${i * 0.06}s` }}>
                    {/* Post header — LinkedIn style */}
                    <div className="p-4 pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: brand.heroGradient }}>
                          {brand.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-cream/85 truncate">{brand.name}</p>
                          <p className="text-[10px] text-warm/40 leading-snug">{brand.headline}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-warm/25">
                            <Clock size={8} />
                            <span>{brand.postTime}</span>
                            {brand.collabStatus === 'open' && (
                              <>
                                <span>·</span>
                                <span className="text-sage/60 flex items-center gap-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-sage/60" /> Open to collabs
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {!isConnected && (
                          <button onClick={() => toggleConnect(brand.id)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-gold flex items-center gap-1 shrink-0"
                            style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
                            <Plus size={9} /> Connect
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Post content */}
                    <div className="px-4 pb-3">
                      <p className="text-[12px] text-cream/60 leading-relaxed">{brand.recentPost}</p>
                    </div>

                    {/* Mutual connections bar */}
                    <div className="mx-4 mb-3 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: 'rgba(10,13,8,0.5)' }}>
                      <Users size={10} className="text-warm/25" />
                      <span className="text-[10px] text-warm/35">{brand.mutualFollowers} mutual followers</span>
                      {brand.sharedEvents > 0 && (
                        <>
                          <span className="text-warm/15">·</span>
                          <Calendar size={9} className="text-warm/25" />
                          <span className="text-[10px] text-warm/35">{brand.sharedEvents} shared events</span>
                        </>
                      )}
                    </div>

                    {/* Endorsements */}
                    <div className="px-4 pb-3 flex flex-wrap gap-1">
                      {brand.endorsements.slice(0, 3).map(e => (
                        <span key={e} className="px-2 py-0.5 rounded-full text-[9px] text-gold/50" style={{
                          background: 'rgba(212,168,67,0.04)',
                          border: '1px solid rgba(212,168,67,0.08)',
                        }}>{e}</span>
                      ))}
                    </div>

                    {/* Action bar — LinkedIn style */}
                    <div className="flex border-t" style={{ borderColor: 'rgba(36,56,38,0.25)' }}>
                      <button onClick={() => setEndorsedBrands(prev => {
                        const next = new Set(prev);
                        if (next.has(brand.id)) next.delete(brand.id); else next.add(brand.id);
                        return next;
                      })}
                        className={`flex-1 py-2.5 text-[11px] flex items-center justify-center gap-1.5 transition-colors ${endorsedBrands.has(brand.id) ? 'text-gold' : 'text-warm/35 hover:text-cream/50'}`}>
                        <Heart size={12} fill={endorsedBrands.has(brand.id) ? 'currentColor' : 'none'} /> {endorsedBrands.has(brand.id) ? 'Endorsed' : 'Endorse'}
                      </button>
                      <div style={{ width: 1, background: 'rgba(36,56,38,0.2)' }} />
                      <button onClick={() => alert(`Opening chat with ${brand.name}...`)}
                        className="flex-1 py-2.5 text-[11px] text-warm/35 flex items-center justify-center gap-1.5 hover:text-cream/50 transition-colors">
                        <MessageCircle size={12} /> Message
                      </button>
                      <div style={{ width: 1, background: 'rgba(36,56,38,0.2)' }} />
                      <button onClick={() => alert(`Collab request sent to ${brand.name}!`)}
                        className="flex-1 py-2.5 text-[11px] text-warm/35 flex items-center justify-center gap-1.5 hover:text-cream/50 transition-colors">
                        <Send size={12} /> Collab
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* NETWORK — LinkedIn-style connections grid */}
          {brandFeedTab === 'network' && (
            <div className="space-y-3">
              {/* Your connections */}
              <h4 className="text-[11px] text-warm/40 font-medium">Your Connections ({connectedBrands.size})</h4>
              {brandNetwork.filter(b => connectedBrands.has(b.id)).map((brand, i) => (
                <div key={brand.id} className="rounded-2xl p-4 animate-fade-in" style={{ ...cardStyle, animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 relative" style={{ background: brand.heroGradient }}>
                      {brand.avatar}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-sage flex items-center justify-center">
                        <Check size={7} className="text-offblack" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-cream/85">{brand.name}</p>
                      <p className="text-[10px] text-warm/40">{brand.headline}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => alert(`Opening chat with ${brand.name}...`)}
                      className="flex-1 py-2 rounded-xl text-[11px] font-medium text-cream/60 flex items-center justify-center gap-1.5"
                      style={{ background: 'rgba(36,56,38,0.3)', border: '1px solid rgba(36,56,38,0.4)' }}>
                      <MessageCircle size={11} /> Message
                    </button>
                    <button onClick={() => alert(`Collab proposal sent to ${brand.name}!`)}
                      className="flex-1 py-2 rounded-xl text-[11px] font-medium text-gold/60 flex items-center justify-center gap-1.5"
                      style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.12)' }}>
                      <Send size={11} /> Propose Collab
                    </button>
                  </div>
                </div>
              ))}

              {/* Suggested */}
              <h4 className="text-[11px] text-warm/40 font-medium mt-2">Suggested for You</h4>
              {brandNetwork.filter(b => !connectedBrands.has(b.id)).map((brand, i) => (
                <div key={brand.id} className="rounded-2xl p-3 flex items-center gap-3 animate-fade-in" style={{ ...cardStyle, animationDelay: `${i * 0.06}s` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: brand.heroGradient }}>
                    {brand.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-cream/80 truncate">{brand.name}</p>
                    <p className="text-[9px] text-warm/30">{brand.mutualFollowers} mutual · {brand.category}</p>
                  </div>
                  <button onClick={() => toggleConnect(brand.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gold flex items-center gap-1 shrink-0"
                    style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
                    <Plus size={10} /> Connect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== ANALYTICS TAB ========== */}
      {bizTab === 'analytics' && (
        <div className="space-y-4">
          <p className="text-[12px] text-warm/45 mb-1">Last 30 days</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Page Views', val: '1,247', change: '+18%', up: true },
              { label: 'Followers', val: '2,431', change: '+52', up: true },
              { label: 'Drop Sales', val: '$2,840', change: '+24%', up: true },
              { label: 'Sell-through', val: '94%', change: '+3%', up: true },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-3" style={cardStyleSubtle}>
                <p className="text-[10px] text-warm/35 mb-1">{stat.label}</p>
                <p className="font-display text-xl font-bold text-cream/85">{stat.val}</p>
                <p className={`text-[10px] font-medium ${stat.up ? 'text-sage/70' : 'text-rust/70'}`}>{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4" style={cardStyle}>
            <h3 className="text-sm font-semibold text-cream/80 mb-3">Top Performing Pieces</h3>
            {[
              { name: 'Oversized Coach Jacket', views: 487, wishes: 241 },
              { name: 'Cropped Work Vest', views: 312, wishes: 156 },
              { name: 'Logo Tee (Earth)', views: 198, wishes: 89 },
            ].map((piece, i) => (
              <div key={i} className="flex items-center justify-between py-2.5" style={{
                borderBottom: i < 2 ? '1px solid rgba(36,56,38,0.3)' : 'none',
              }}>
                <p className="text-[12px] text-cream/70">{piece.name}</p>
                <div className="flex items-center gap-3 text-[10px] text-warm/40">
                  <span className="flex items-center gap-0.5"><Eye size={9} /> {piece.views}</span>
                  <span className="flex items-center gap-0.5"><Heart size={9} /> {piece.wishes}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4" style={cardStyle}>
            <div className="flex items-center gap-2 mb-3">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="#FF004F">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52V6.95a4.85 4.85 0 01-1-.26z"/>
              </svg>
              <h3 className="text-sm font-semibold text-cream/80">TikTok Referrals</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-warm/40">Clicks from TikTok</span>
              <span className="text-sm font-semibold text-cream/80">347</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-warm/40">Conversions</span>
              <span className="text-sm font-semibold text-gold">12%</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// =================== MAIN PROFILE PAGE ===================

export default function ProfilePage({ appState }) {
  const [accountType, setAccountType] = useState('personal');
  const [activeTab, setActiveTab] = useState('activity');
  const [loggedInBrand, setLoggedInBrand] = useState(null);

  const handleBrandLogin = (brand) => {
    setLoggedInBrand(brand);
  };

  const handleBrandLogout = () => {
    setLoggedInBrand(null);
  };

  return (
    <div className="min-h-screen pb-24 bg-offblack">
      <div className="px-4 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-xl font-bold text-gold">Profile</h1>
        </div>

        {/* Account Type Toggle */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{
          background: '#0A0D08',
          border: '1px solid rgba(36,56,38,0.3)',
        }}>
          <button
            onClick={() => { setAccountType('personal'); setActiveTab('activity'); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              accountType === 'personal' ? 'text-gold bg-[#111A10]' : 'text-warm/35'
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => { setAccountType('business'); setActiveTab('activity'); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'business' ? 'text-gold bg-[#111A10]' : 'text-warm/35'
            }`}
          >
            <Store size={13} /> For Business
          </button>
        </div>

        {accountType === 'personal' ? (
          <PersonalProfile appState={appState} activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : loggedInBrand ? (
          <BusinessDashboard loggedInBrand={loggedInBrand} onLogout={handleBrandLogout} />
        ) : (
          <BrandLogin onLogin={handleBrandLogin} />
        )}
      </div>
    </div>
  );
}
