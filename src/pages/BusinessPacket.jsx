import { useState } from 'react';
import { Settings, ShoppingBag, Users, Calendar, Heart, Globe, Link2, RefreshCw, BarChart3, Package, Palette, Store, ChevronRight, Zap, TrendingUp, Eye, Edit3, Image, Plus, Trash2, GripVertical, MapPin, MessageCircle, Send, Check, X, Clock, ExternalLink, Sparkles, ArrowUpRight, LogOut, Lock } from 'lucide-react';
import { brands } from '../data/brands';

// -- Shared card style helpers --
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
  const [analyticsRange, setAnalyticsRange] = useState('30d');
  const [analyticsStore, setAnalyticsStore] = useState('all');
  const [studioTab, setStudioTab] = useState('ideas');
  const [contentIdeas, setContentIdeas] = useState([
    { id: 'ci1', title: 'BTS: Askew Shirt stitching process', platform: 'TikTok', status: 'idea', hook: 'First frame should show the asymmetry up close', tags: ['process', 'product'] },
    { id: 'ci2', title: 'Founder story — why Vietnam', platform: 'TikTok', status: 'idea', hook: 'Voiceover over factory footage', tags: ['story', 'founder'] },
    { id: 'ci3', title: 'Drop-day countdown teaser', platform: 'Stories', status: 'idea', hook: '3-2-1 with product reveals', tags: ['drop', 'hype'] },
    { id: 'ci4', title: 'Customer styling reel', platform: 'Instagram', status: 'draft', hook: 'Pull from wishlist tagged photos', tags: ['ugc', 'community'] },
  ]);
  const [scheduledPosts, setScheduledPosts] = useState([
    { id: 'sp1', title: 'Drop-day countdown teaser', platform: 'Stories', date: '2026-04-12', time: '18:00', status: 'scheduled' },
    { id: 'sp2', title: 'Askew Shirt launch reel', platform: 'TikTok', date: '2026-04-13', time: '10:00', status: 'scheduled' },
    { id: 'sp3', title: 'Drop recap carousel', platform: 'Instagram', date: '2026-04-14', time: '19:30', status: 'draft' },
  ]);
  const [incomeRange, setIncomeRange] = useState('30d');
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
    { id: 'studio', label: 'Studio', icon: Sparkles },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'brands', label: 'Deals', icon: Users },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'income', label: 'Income', icon: TrendingUp },
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

      {/* ========== STUDIO TAB — Content ideas, drafts, scheduling ========== */}
      {bizTab === 'studio' && (
        <div className="space-y-4">
          {/* Sub-tabs: Ideas / Schedule / Calendar */}
          <div className="flex gap-1 p-0.5 rounded-xl" style={{ background: 'rgba(10,13,8,0.5)', border: '1px solid rgba(36,56,38,0.3)' }}>
            {[
              { id: 'ideas', label: 'Ideas', icon: Sparkles },
              { id: 'schedule', label: 'Scheduled', icon: Clock },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
            ].map(t => (
              <button key={t.id} onClick={() => setStudioTab(t.id)}
                className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all flex items-center justify-center gap-1.5 ${studioTab === t.id ? 'text-gold' : 'text-warm/35'}`}
                style={studioTab === t.id ? { background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.12)' } : undefined}>
                <t.icon size={11} /> {t.label}
              </button>
            ))}
          </div>

          {/* IDEAS BOARD */}
          {studioTab === 'ideas' && (
            <div className="space-y-3">
              {/* Quick capture */}
              <div className="rounded-2xl p-3.5" style={{ ...cardStyle, border: '1px solid rgba(212,168,67,0.18)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={13} className="text-gold" />
                  <p className="text-[11px] font-semibold text-gold/85">Capture an idea</p>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. Factory tour reel..."
                    className="flex-1 rounded-lg px-3 py-2 text-[12px] text-cream placeholder-warm/25 focus:outline-none focus:ring-1 focus:ring-gold/30"
                    style={inputStyle}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        setContentIdeas(prev => [{ id: 'ci' + Date.now(), title: e.target.value.trim(), platform: 'TikTok', status: 'idea', hook: '', tags: [] }, ...prev]);
                        e.target.value = '';
                      }
                    }} />
                  <button className="px-3 rounded-lg bg-gold text-offblack text-[11px] font-semibold">Add</button>
                </div>
              </div>

              {/* AI suggestions */}
              <div className="rounded-2xl p-3.5" style={{ ...cardStyle, background: 'linear-gradient(145deg, rgba(30,53,32,0.35) 0%, rgba(20,26,18,0.5) 100%)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-sage/80" />
                    <p className="text-[11px] font-semibold text-sage/80">KitaKakis suggests</p>
                  </div>
                  <button className="text-[9px] text-warm/35">Refresh</button>
                </div>
                <div className="space-y-1.5">
                  {[
                    'Compare your top-3 pieces side-by-side — viewers 3× more likely to comment',
                    'Repost UGC from @sarahthrifts — she tagged you last week',
                    'Drop-day countdown Stories perform 2.1× better with timer stickers',
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-cream/55 leading-snug">
                      <span className="text-sage/60 shrink-0 mt-0.5">→</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideas list — grouped by status */}
              {['idea', 'draft'].map(status => {
                const items = contentIdeas.filter(i => i.status === status);
                if (!items.length) return null;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-warm/45">
                        {status === 'idea' ? 'Idea board' : 'Drafts'} <span className="text-warm/25">· {items.length}</span>
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {items.map(idea => (
                        <div key={idea.id} className="rounded-xl p-3" style={cardStyleSubtle}>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="text-[12px] font-semibold text-cream/85 leading-snug">{idea.title}</p>
                            <span className="text-[9px] font-semibold text-gold/70 px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,168,67,0.08)' }}>{idea.platform}</span>
                          </div>
                          {idea.hook && <p className="text-[10px] text-warm/40 italic mb-1.5">"{idea.hook}"</p>}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1 flex-wrap">
                              {idea.tags.map(t => (
                                <span key={t} className="text-[9px] text-warm/40 px-1.5 py-0.5 rounded" style={{ background: 'rgba(36,56,38,0.35)' }}>#{t}</span>
                              ))}
                            </div>
                            <div className="flex gap-1">
                              <button className="text-[10px] text-warm/40 px-2 py-0.5 rounded flex items-center gap-0.5"
                                style={{ background: 'rgba(36,56,38,0.3)', border: '1px solid rgba(36,56,38,0.4)' }}>
                                <Edit3 size={9} /> Edit
                              </button>
                              <button className="text-[10px] text-gold/70 px-2 py-0.5 rounded flex items-center gap-0.5"
                                style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
                                <Send size={9} /> Schedule
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SCHEDULED LIST */}
          {studioTab === 'schedule' && (
            <div className="space-y-3">
              <button className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-offblack bg-gold flex items-center justify-center gap-1.5">
                <Plus size={13} /> Schedule a new post
              </button>
              {scheduledPosts.length === 0 && (
                <p className="text-[11px] text-warm/35 text-center py-6">No scheduled posts yet.</p>
              )}
              {scheduledPosts.map(p => {
                const when = new Date(p.date + 'T' + p.time);
                const dayLabel = when.toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' });
                const timeLabel = when.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false });
                return (
                  <div key={p.id} className="rounded-2xl p-3.5" style={cardStyle}>
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold text-cream/85">{p.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gold/70 flex items-center gap-0.5"><Clock size={9} /> {dayLabel} · {timeLabel}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(212,168,67,0.08)', color: '#D4A843' }}>{p.platform}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${p.status === 'scheduled' ? 'text-sage/80' : 'text-warm/50'}`} style={{ background: p.status === 'scheduled' ? 'rgba(122,158,122,0.1)' : 'rgba(36,56,38,0.3)' }}>
                        {p.status === 'scheduled' ? '● Scheduled' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <button className="flex-1 py-1.5 rounded-lg text-[10px] text-warm/50" style={{ background: 'rgba(36,56,38,0.3)', border: '1px solid rgba(36,56,38,0.4)' }}>Edit</button>
                      <button className="flex-1 py-1.5 rounded-lg text-[10px] text-warm/50" style={{ background: 'rgba(36,56,38,0.3)', border: '1px solid rgba(36,56,38,0.4)' }}>Reschedule</button>
                      <button onClick={() => setScheduledPosts(prev => prev.filter(x => x.id !== p.id))}
                        className="flex-1 py-1.5 rounded-lg text-[10px] text-rust/70" style={{ background: 'rgba(139,26,26,0.06)', border: '1px solid rgba(139,26,26,0.15)' }}>Cancel</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CALENDAR VIEW */}
          {studioTab === 'calendar' && (() => {
            const today = new Date('2026-04-11');
            const daysInMonth = 30;
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
            const cells = Array.from({ length: firstDay + daysInMonth });
            return (
              <div className="rounded-2xl p-4" style={cardStyle}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-cream/85">April 2026</h4>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={cardStyleSubtle}><span className="text-warm/50">‹</span></button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={cardStyleSubtle}><span className="text-warm/50">›</span></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[9px] text-warm/35 mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center font-semibold">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((_, i) => {
                    const dayNum = i - firstDay + 1;
                    if (dayNum < 1) return <div key={i} />;
                    const dateStr = `2026-04-${String(dayNum).padStart(2, '0')}`;
                    const postsOnDay = scheduledPosts.filter(p => p.date === dateStr);
                    const isToday = dayNum === 11;
                    return (
                      <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center relative ${isToday ? 'bg-gold/10 border border-gold/30' : ''}`}
                        style={!isToday ? { background: 'rgba(10,13,8,0.3)', border: '1px solid rgba(36,56,38,0.25)' } : undefined}>
                        <span className={`text-[10px] ${isToday ? 'text-gold font-bold' : 'text-cream/55'}`}>{dayNum}</span>
                        {postsOnDay.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {postsOnDay.slice(0, 3).map((_, k) => (
                              <div key={k} className="w-1 h-1 rounded-full bg-gold/70" />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 text-[10px]" style={{ borderTop: '1px solid rgba(36,56,38,0.3)' }}>
                  <span className="text-warm/40">● {scheduledPosts.length} scheduled this month</span>
                  <span className="text-gold/70">View all →</span>
                </div>
              </div>
            );
          })()}
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
      {bizTab === 'analytics' && (() => {
        // Parse stores from brand.location — supports "Multi — A, B" or "A & B, ..." patterns
        const parseStores = (loc = '') => {
          const cleaned = loc.replace(/^Multiple\s*—\s*/i, '').replace(/,\s*Singapore$/i, '');
          const parts = cleaned.split(/,|&|\sand\s/).map(s => s.trim()).filter(Boolean);
          if (parts.length <= 1 || parts[0].toLowerCase() === 'singapore') {
            return [{ id: 'main', name: brand.shortName + ' Flagship', weight: 1 }];
          }
          return parts.slice(0, 4).map((p, i) => ({ id: 's' + i, name: p, weight: 1 - i * 0.15 }));
        };
        const rawStores = parseStores(brand.location);
        const weightSum = rawStores.reduce((a, s) => a + s.weight, 0);
        const stores = rawStores.map(s => ({ ...s, share: s.weight / weightSum }));
        const isMultiStore = stores.length > 1;

        // Deterministic pseudo-random from brand id, so numbers stay stable per brand
        const seed = brand.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const rand = (offset = 0) => {
          const x = Math.sin(seed + offset) * 10000;
          return x - Math.floor(x);
        };

        const rangeMultiplier = analyticsRange === '7d' ? 0.25 : analyticsRange === '90d' ? 2.8 : 1;
        const pointCount = analyticsRange === '7d' ? 7 : analyticsRange === '90d' ? 12 : 10;
        const storeMultiplier = analyticsStore === 'all' ? 1 : (stores.find(s => s.id === analyticsStore)?.share || 1);

        const baseFollowers = brand.followers || 1500;
        const pageViews = Math.round(baseFollowers * 1.4 * rangeMultiplier * storeMultiplier);
        const uniqueVisitors = Math.round(pageViews * 0.62);
        const revenue = Math.round(baseFollowers * 2.1 * rangeMultiplier * storeMultiplier);
        const conversionRate = (2.4 + rand(1) * 2.8).toFixed(1);
        const avgOrder = Math.round(45 + rand(2) * 60);

        // Mini sparkline generator
        const sparkline = (seedOffset, color = '#D4A843', trendUp = true) => {
          const pts = Array.from({ length: pointCount }, (_, i) => {
            const base = 20 + rand(seedOffset + i) * 60;
            const trend = trendUp ? i * 2.5 : -i * 1.2;
            return Math.max(6, Math.min(70, base + trend));
          });
          const w = 100, h = 32;
          const step = w / (pts.length - 1);
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - (p / 80) * h).toFixed(1)}`).join(' ');
          const areaPath = path + ` L${w},${h} L0,${h} Z`;
          return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8 mt-1.5" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`g-${seedOffset}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill={`url(#g-${seedOffset})`} />
              <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        };

        const heroMetrics = [
          { label: 'Page Views', val: pageViews.toLocaleString(), change: '+18.2%', up: true, color: '#D4A843', icon: Eye, sub: `${Math.round(pageViews / pointCount)}/day avg` },
          { label: 'Unique Visitors', val: uniqueVisitors.toLocaleString(), change: '+12.4%', up: true, color: '#7A9E7A', icon: Users, sub: `${(uniqueVisitors / pageViews * 100).toFixed(0)}% of views` },
          { label: 'Revenue', val: '$' + revenue.toLocaleString(), change: '+24.8%', up: true, color: '#C4622D', icon: TrendingUp, sub: `$${avgOrder} avg order` },
          { label: 'Conversion', val: conversionRate + '%', change: '+0.6%', up: true, color: '#F2D279', icon: Zap, sub: `${Math.round(revenue / avgOrder)} orders` },
        ];

        const trafficSources = [
          { name: 'TikTok', pct: 42, val: Math.round(pageViews * 0.42), color: '#FF004F' },
          { name: 'KitaKakis Feed', pct: 28, val: Math.round(pageViews * 0.28), color: '#D4A843' },
          { name: 'Instagram', pct: 15, val: Math.round(pageViews * 0.15), color: '#E1306C' },
          { name: 'Direct', pct: 10, val: Math.round(pageViews * 0.10), color: '#7A9E7A' },
          { name: 'Google', pct: 5, val: Math.round(pageViews * 0.05), color: '#4285F4' },
        ];

        const topProducts = [
          { name: 'Signature Drop Piece', views: Math.round(pageViews * 0.18), wishes: Math.round(pageViews * 0.08), revenue: Math.round(revenue * 0.32) },
          { name: 'Core Essential', views: Math.round(pageViews * 0.14), wishes: Math.round(pageViews * 0.05), revenue: Math.round(revenue * 0.24) },
          { name: 'Limited Edition Tee', views: Math.round(pageViews * 0.11), wishes: Math.round(pageViews * 0.04), revenue: Math.round(revenue * 0.18) },
          { name: 'Accessories Bundle', views: Math.round(pageViews * 0.08), wishes: Math.round(pageViews * 0.03), revenue: Math.round(revenue * 0.12) },
        ];

        const visitorLocations = [
          { area: 'Central SG', pct: 34 },
          { area: 'East SG', pct: 22 },
          { area: 'North SG', pct: 18 },
          { area: 'West SG', pct: 14 },
          { area: 'Overseas', pct: 12 },
        ];

        return (
          <div className="space-y-4">
            {/* Filters row */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 p-0.5 rounded-lg flex-1" style={{ background: 'rgba(10,13,8,0.5)', border: '1px solid rgba(36,56,38,0.3)' }}>
                {[
                  { id: '7d', label: '7D' },
                  { id: '30d', label: '30D' },
                  { id: '90d', label: '90D' },
                ].map(r => (
                  <button key={r.id} onClick={() => setAnalyticsRange(r.id)}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${analyticsRange === r.id ? 'text-gold' : 'text-warm/30'}`}
                    style={analyticsRange === r.id ? { background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' } : undefined}>
                    {r.label}
                  </button>
                ))}
              </div>
              <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-warm/50 flex items-center gap-1.5" style={cardStyleSubtle}>
                <ArrowUpRight size={11} /> Export
              </button>
            </div>

            {/* Store filter (multi-store only) */}
            {isMultiStore && (
              <div className="rounded-xl p-2" style={cardStyleSubtle}>
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <Store size={10} className="text-warm/40" />
                  <span className="text-[10px] text-warm/40 uppercase tracking-wider font-semibold">Filter by store</span>
                </div>
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                  <button onClick={() => setAnalyticsStore('all')}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${analyticsStore === 'all' ? 'text-gold' : 'text-warm/40'}`}
                    style={analyticsStore === 'all' ? { background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' } : { background: 'transparent', border: '1px solid rgba(36,56,38,0.3)' }}>
                    All stores ({stores.length})
                  </button>
                  {stores.map(s => (
                    <button key={s.id} onClick={() => setAnalyticsStore(s.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${analyticsStore === s.id ? 'text-gold' : 'text-warm/40'}`}
                      style={analyticsStore === s.id ? { background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' } : { background: 'transparent', border: '1px solid rgba(36,56,38,0.3)' }}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hero metric cards with sparklines */}
            <div className="grid grid-cols-2 gap-2.5">
              {heroMetrics.map((m, i) => (
                <div key={i} className="rounded-2xl p-3 relative overflow-hidden" style={cardStyle}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${m.color}12`, border: `1px solid ${m.color}25` }}>
                      <m.icon size={11} style={{ color: m.color }} />
                    </div>
                    <span className={`text-[9px] font-semibold ${m.up ? 'text-sage/80' : 'text-rust/80'} flex items-center gap-0.5`}>
                      {m.up ? '▲' : '▼'} {m.change}
                    </span>
                  </div>
                  <p className="text-[9px] text-warm/35 uppercase tracking-wider">{m.label}</p>
                  <p className="font-display text-xl font-bold text-cream/90 leading-tight">{m.val}</p>
                  <p className="text-[9px] text-warm/30">{m.sub}</p>
                  {sparkline(i * 10, m.color, m.up)}
                </div>
              ))}
            </div>

            {/* Traffic over time — full chart */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-cream/85">Traffic overview</h3>
                  <p className="text-[10px] text-warm/35">Page views vs. unique visitors</p>
                </div>
                <div className="flex gap-2 text-[9px]">
                  <span className="flex items-center gap-1 text-warm/50"><span className="w-2 h-2 rounded-sm bg-gold" /> Views</span>
                  <span className="flex items-center gap-1 text-warm/50"><span className="w-2 h-2 rounded-sm bg-sage/70" /> Visitors</span>
                </div>
              </div>
              {(() => {
                const w = 320, h = 100;
                const viewsPts = Array.from({ length: pointCount }, (_, i) => 25 + rand(i + 5) * 50 + i * 2);
                const visitorsPts = viewsPts.map((v, i) => v * (0.55 + rand(i + 20) * 0.1));
                const step = w / (pointCount - 1);
                const maxY = Math.max(...viewsPts) * 1.1;
                const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - (p / maxY) * h).toFixed(1)}`).join(' ');
                return (
                  <svg viewBox={`0 0 ${w} ${h + 18}`} className="w-full h-28">
                    <defs>
                      <linearGradient id="views-g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4A843" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((p, i) => (
                      <line key={i} x1="0" x2={w} y1={h * p} y2={h * p} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    ))}
                    {/* Views area */}
                    <path d={toPath(viewsPts) + ` L${w},${h} L0,${h} Z`} fill="url(#views-g)" />
                    <path d={toPath(viewsPts)} fill="none" stroke="#D4A843" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Visitors line */}
                    <path d={toPath(visitorsPts)} fill="none" stroke="#7A9E7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3,3" />
                    {/* X-axis labels */}
                    {analyticsRange === '7d' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                      <text key={i} x={i * step} y={h + 12} fontSize="8" fill="rgba(255,255,255,0.25)" textAnchor="middle">{d}</text>
                    ))}
                    {analyticsRange === '30d' && (
                      <>
                        <text x="0" y={h + 12} fontSize="8" fill="rgba(255,255,255,0.25)">30d ago</text>
                        <text x={w / 2} y={h + 12} fontSize="8" fill="rgba(255,255,255,0.25)" textAnchor="middle">15d</text>
                        <text x={w} y={h + 12} fontSize="8" fill="rgba(255,255,255,0.25)" textAnchor="end">Today</text>
                      </>
                    )}
                    {analyticsRange === '90d' && (
                      <>
                        <text x="0" y={h + 12} fontSize="8" fill="rgba(255,255,255,0.25)">90d</text>
                        <text x={w / 2} y={h + 12} fontSize="8" fill="rgba(255,255,255,0.25)" textAnchor="middle">45d</text>
                        <text x={w} y={h + 12} fontSize="8" fill="rgba(255,255,255,0.25)" textAnchor="end">Today</text>
                      </>
                    )}
                  </svg>
                );
              })()}
            </div>

            {/* Traffic sources */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={13} className="text-gold/70" />
                <h3 className="text-sm font-semibold text-cream/85">Traffic sources</h3>
              </div>
              <div className="space-y-2.5">
                {trafficSources.map((src, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-cream/70 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: src.color }} />
                        {src.name}
                      </span>
                      <span className="text-[10px] text-warm/50 tabular-nums">{src.val.toLocaleString()} <span className="text-warm/30">· {src.pct}%</span></span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(10,13,8,0.6)' }}>
                      <div className="h-full rounded-full" style={{ width: `${src.pct}%`, background: src.color, opacity: 0.7 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-store performance (multi-store only) */}
            {isMultiStore && (
              <div className="rounded-2xl p-4" style={cardStyle}>
                <div className="flex items-center gap-2 mb-3">
                  <Store size={13} className="text-gold/70" />
                  <h3 className="text-sm font-semibold text-cream/85">Store performance</h3>
                </div>
                <div className="space-y-2">
                  {stores.map((s, i) => {
                    const denomViews = analyticsStore === 'all' ? pageViews : pageViews / storeMultiplier;
                    const denomRev = analyticsStore === 'all' ? revenue : revenue / storeMultiplier;
                    const storeViews = Math.round(denomViews * s.share);
                    const storeRev = Math.round(denomRev * s.share);
                    const storeConv = (2 + rand(i + 30) * 3).toFixed(1);
                    return (
                      <div key={s.id} className="rounded-xl p-2.5 flex items-center justify-between" style={{ background: 'rgba(10,13,8,0.45)', border: '1px solid rgba(36,56,38,0.3)' }}>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' }}>
                            <MapPin size={11} className="text-gold/70" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] text-cream/80 truncate">{s.name}</p>
                            <p className="text-[9px] text-warm/35">{storeViews.toLocaleString()} views · {storeConv}% conv</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gold/90 tabular-nums">${storeRev.toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top products */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package size={13} className="text-gold/70" />
                  <h3 className="text-sm font-semibold text-cream/85">Top products</h3>
                </div>
                <span className="text-[9px] text-warm/35 uppercase tracking-wider">Revenue</span>
              </div>
              <div className="space-y-2.5">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: i === 0 ? 'rgba(212,168,67,0.15)' : 'rgba(36,56,38,0.4)' }}>
                      <span className={`text-[9px] font-bold ${i === 0 ? 'text-gold' : 'text-warm/50'}`}>{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-cream/80 truncate">{p.name}</p>
                      <div className="flex items-center gap-3 text-[9px] text-warm/35">
                        <span className="flex items-center gap-0.5"><Eye size={8} /> {p.views.toLocaleString()}</span>
                        <span className="flex items-center gap-0.5"><Heart size={8} /> {p.wishes.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-[12px] font-semibold text-sage/80 tabular-nums">${p.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor geography */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={13} className="text-gold/70" />
                <h3 className="text-sm font-semibold text-cream/85">Visitor locations</h3>
              </div>
              <div className="space-y-2">
                {visitorLocations.map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[11px] text-cream/70 w-20 shrink-0">{l.area}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,13,8,0.6)' }}>
                      <div className="h-full rounded-full bg-gold/60" style={{ width: `${l.pct * 2.8}%` }} />
                    </div>
                    <span className="text-[10px] text-warm/45 tabular-nums w-8 text-right">{l.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement panel */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl p-3.5" style={cardStyle}>
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="#FF004F">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52V6.95a4.85 4.85 0 01-1-.26z"/>
                  </svg>
                  <h4 className="text-[11px] font-semibold text-cream/75">TikTok</h4>
                </div>
                <p className="text-[9px] text-warm/35">Link clicks</p>
                <p className="font-display text-lg font-bold text-cream/90">{Math.round(pageViews * 0.28).toLocaleString()}</p>
                <p className="text-[9px] text-sage/70">+31% vs prev.</p>
              </div>
              <div className="rounded-2xl p-3.5" style={cardStyle}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={12} className="text-gold/70" />
                  <h4 className="text-[11px] font-semibold text-cream/75">Stories</h4>
                </div>
                <p className="text-[9px] text-warm/35">Total story views</p>
                <p className="font-display text-lg font-bold text-cream/90">{Math.round(pageViews * 0.74).toLocaleString()}</p>
                <p className="text-[9px] text-sage/70">+14% vs prev.</p>
              </div>
              <div className="rounded-2xl p-3.5" style={cardStyle}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Heart size={12} className="text-rust/70" />
                  <h4 className="text-[11px] font-semibold text-cream/75">Wishlist</h4>
                </div>
                <p className="text-[9px] text-warm/35">Products saved</p>
                <p className="font-display text-lg font-bold text-cream/90">{Math.round(pageViews * 0.18).toLocaleString()}</p>
                <p className="text-[9px] text-sage/70">+22% vs prev.</p>
              </div>
              <div className="rounded-2xl p-3.5" style={cardStyle}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users size={12} className="text-sage/70" />
                  <h4 className="text-[11px] font-semibold text-cream/75">New followers</h4>
                </div>
                <p className="text-[9px] text-warm/35">This period</p>
                <p className="font-display text-lg font-bold text-cream/90">+{Math.round(baseFollowers * 0.08 * rangeMultiplier).toLocaleString()}</p>
                <p className="text-[9px] text-sage/70">+9% vs prev.</p>
              </div>
            </div>

            {/* Insights / recommendations */}
            <div className="rounded-2xl p-4" style={{ ...cardStyle, border: '1px solid rgba(212,168,67,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-gold" />
                <h3 className="text-sm font-semibold text-gold/90">KitaKakis Insights</h3>
              </div>
              <p className="text-[11px] text-cream/60 leading-relaxed">
                Your <span className="text-gold">TikTok → sales funnel</span> is 2.3× stronger than the KitaKakis average. Posting within 2 hours of a drop converts best. Your top product drives <span className="text-gold">32% of all revenue</span> — consider a restock.
              </p>
            </div>
          </div>
        );
      })()}

      {/* ========== INCOME TAB — Earnings, payouts, transactions ========== */}
      {bizTab === 'income' && (() => {
        const seed = brand.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const rand = (o = 0) => { const x = Math.sin(seed + o) * 10000; return x - Math.floor(x); };
        const baseFollowers = brand.followers || 1500;
        const rangeMult = incomeRange === '7d' ? 0.25 : incomeRange === '90d' ? 2.8 : 1;

        const gross = Math.round(baseFollowers * 2.1 * rangeMult);
        const platformFee = Math.round(gross * 0.05);
        const processingFee = Math.round(gross * 0.029 + 20);
        const netEarnings = gross - platformFee - processingFee;
        const pendingPayout = Math.round(netEarnings * 0.32);
        const availableBalance = netEarnings - pendingPayout;

        // Mock transaction history
        const txns = [
          { id: 't1', type: 'sale', title: 'Signature Hoodie × 2', amount: 170, date: 'Today · 14:23', status: 'completed' },
          { id: 't2', type: 'sale', title: 'Cargo Cap', amount: 29, date: 'Today · 11:05', status: 'completed' },
          { id: 't3', type: 'payout', title: 'Payout to DBS ****4821', amount: -1240, date: 'Yesterday · 09:00', status: 'completed' },
          { id: 't4', type: 'sale', title: 'Askew Shirt × 3', amount: 108, date: 'Yesterday · 22:14', status: 'completed' },
          { id: 't5', type: 'sponsorship', title: 'Collab — Tonêff × Koyoyu', amount: 450, date: '2d ago', status: 'pending' },
          { id: 't6', type: 'sale', title: 'Logo Tee', amount: 42, date: '3d ago · 16:40', status: 'completed' },
          { id: 't7', type: 'refund', title: 'Refund — Oversized Coach Jacket', amount: -85, date: '4d ago', status: 'completed' },
          { id: 't8', type: 'sale', title: 'Corduroy Overshirt', amount: 68, date: '5d ago · 12:30', status: 'completed' },
        ];

        // Monthly revenue bars for last 6 months
        const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
        const monthlyRev = months.map((m, i) => ({
          month: m,
          val: Math.round(gross * (0.7 + rand(i + 50) * 0.6) * (0.8 + i * 0.08)),
        }));
        const maxRev = Math.max(...monthlyRev.map(m => m.val));

        const iconFor = (type) => {
          if (type === 'sale') return { icon: ShoppingBag, color: '#7A9E7A', bg: 'rgba(122,158,122,0.1)' };
          if (type === 'payout') return { icon: ArrowUpRight, color: '#D4A843', bg: 'rgba(212,168,67,0.08)' };
          if (type === 'sponsorship') return { icon: Sparkles, color: '#C4622D', bg: 'rgba(196,98,45,0.1)' };
          if (type === 'refund') return { icon: RefreshCw, color: '#8B1A1A', bg: 'rgba(139,26,26,0.1)' };
          return { icon: TrendingUp, color: '#7A9E7A', bg: 'rgba(122,158,122,0.1)' };
        };

        return (
          <div className="space-y-4">
            {/* Range tabs */}
            <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ background: 'rgba(10,13,8,0.5)', border: '1px solid rgba(36,56,38,0.3)' }}>
              {[
                { id: '7d', label: 'This week' },
                { id: '30d', label: 'This month' },
                { id: '90d', label: 'Quarter' },
              ].map(r => (
                <button key={r.id} onClick={() => setIncomeRange(r.id)}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all ${incomeRange === r.id ? 'text-gold' : 'text-warm/30'}`}
                  style={incomeRange === r.id ? { background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' } : undefined}>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Hero: Available balance */}
            <div className="rounded-2xl p-5 relative overflow-hidden" style={{
              background: 'linear-gradient(145deg, rgba(30,53,32,0.5) 0%, rgba(20,26,18,0.8) 100%)',
              border: '1px solid rgba(212,168,67,0.25)',
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{
                background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)',
                transform: 'translate(25%, -25%)',
              }} />
              <div className="relative">
                <p className="text-[10px] text-warm/50 uppercase tracking-wider mb-1">Available balance</p>
                <p className="font-display text-3xl font-bold text-cream/95">${availableBalance.toLocaleString()}</p>
                <p className="text-[11px] text-sage/70 mt-1 flex items-center gap-1"><TrendingUp size={10} /> +${Math.round(netEarnings * 0.18).toLocaleString()} this period</p>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2.5 rounded-xl bg-gold text-offblack text-[12px] font-semibold flex items-center justify-center gap-1.5">
                    <ArrowUpRight size={12} /> Withdraw
                  </button>
                  <button className="px-4 py-2.5 rounded-xl text-[12px] font-semibold text-gold/80 flex items-center justify-center gap-1.5"
                    style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.2)' }}>
                    <Settings size={12} /> Payout settings
                  </button>
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl p-3" style={cardStyle}>
                <p className="text-[9px] text-warm/40 uppercase tracking-wider">Gross revenue</p>
                <p className="font-display text-lg font-bold text-cream/90">${gross.toLocaleString()}</p>
                <p className="text-[9px] text-warm/35">Before fees</p>
              </div>
              <div className="rounded-2xl p-3" style={cardStyle}>
                <p className="text-[9px] text-warm/40 uppercase tracking-wider">Net earnings</p>
                <p className="font-display text-lg font-bold text-sage/85">${netEarnings.toLocaleString()}</p>
                <p className="text-[9px] text-warm/35">After fees</p>
              </div>
              <div className="rounded-2xl p-3" style={cardStyle}>
                <p className="text-[9px] text-warm/40 uppercase tracking-wider">Pending payout</p>
                <p className="font-display text-lg font-bold text-gold/85">${pendingPayout.toLocaleString()}</p>
                <p className="text-[9px] text-warm/35">Clears in 3 days</p>
              </div>
              <div className="rounded-2xl p-3" style={cardStyle}>
                <p className="text-[9px] text-warm/40 uppercase tracking-wider">Fees</p>
                <p className="font-display text-lg font-bold text-rust/75">${(platformFee + processingFee).toLocaleString()}</p>
                <p className="text-[9px] text-warm/35">5% + 2.9% + $0.20</p>
              </div>
            </div>

            {/* Monthly revenue bars */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-cream/85">Revenue trend</h3>
                <span className="text-[9px] text-warm/35">Last 6 months</span>
              </div>
              <div className="flex items-end gap-2 h-28">
                {monthlyRev.map((m, i) => {
                  const h = (m.val / maxRev) * 100;
                  const isCurrent = i === monthlyRev.length - 1;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex items-end flex-1">
                        <div className="w-full rounded-t-md transition-all" style={{
                          height: `${h}%`,
                          background: isCurrent ? 'linear-gradient(180deg, #D4A843, #B8922E)' : 'linear-gradient(180deg, rgba(122,158,122,0.5), rgba(122,158,122,0.15))',
                        }} />
                      </div>
                      <span className={`text-[9px] ${isCurrent ? 'text-gold font-semibold' : 'text-warm/40'}`}>{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payout method */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-cream/85">Payout method</h3>
                <button className="text-[10px] text-gold/70">Change</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' }}>
                  <Link2 size={15} className="text-gold/70" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-semibold text-cream/85">DBS Bank · ****4821</p>
                  <p className="text-[10px] text-warm/35">Next payout: Mon, 13 Apr · ${pendingPayout.toLocaleString()}</p>
                </div>
                <Check size={14} className="text-sage/80" />
              </div>
            </div>

            {/* Transaction history */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-cream/85">Recent transactions</h3>
                <button className="text-[10px] text-gold/70 flex items-center gap-0.5">See all <ChevronRight size={10} /></button>
              </div>
              <div className="space-y-1">
                {txns.map((t, i) => {
                  const meta = iconFor(t.type);
                  const Icon = meta.icon;
                  const isNegative = t.amount < 0;
                  return (
                    <div key={t.id} className="flex items-center gap-3 py-2" style={{ borderBottom: i < txns.length - 1 ? '1px solid rgba(36,56,38,0.2)' : 'none' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: meta.bg, border: `1px solid ${meta.color}25` }}>
                        <Icon size={12} style={{ color: meta.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-cream/85 truncate">{t.title}</p>
                        <p className="text-[9px] text-warm/35">{t.date} · <span className={t.status === 'pending' ? 'text-gold/60' : 'text-sage/60'}>{t.status}</span></p>
                      </div>
                      <p className={`text-[13px] font-semibold tabular-nums ${isNegative ? 'text-rust/80' : 'text-sage/85'}`}>
                        {isNegative ? '−' : '+'}${Math.abs(t.amount).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tax summary */}
            <div className="rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-cream/85">Tax summary</h3>
                <span className="text-[9px] text-warm/35 uppercase tracking-wider">YTD</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-warm/45">Total earnings</span>
                  <span className="text-[12px] font-semibold text-cream/85 tabular-nums">${(gross * 3.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-warm/45">Deductible fees</span>
                  <span className="text-[12px] font-semibold text-cream/85 tabular-nums">${((platformFee + processingFee) * 3.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(36,56,38,0.3)' }}>
                  <span className="text-[11px] text-gold/80 font-semibold">Taxable income</span>
                  <span className="text-sm font-bold text-gold tabular-nums">${(netEarnings * 3.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              <button className="w-full mt-3 py-2 rounded-xl text-[11px] font-semibold text-gold/80 flex items-center justify-center gap-1.5"
                style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
                <ArrowUpRight size={11} /> Download IRAS statement
              </button>
            </div>
          </div>
        );
      })()}
    </>
  );
}

// =================== DEFAULT EXPORT — Business Packet wrapper ===================
export default function BusinessPacket({ loggedInBrand, onLogin, onLogout }) {
  return loggedInBrand
    ? <BusinessDashboard loggedInBrand={loggedInBrand} onLogout={onLogout} />
    : <BrandLogin onLogin={onLogin} />;
}
