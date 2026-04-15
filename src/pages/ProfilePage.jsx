import { useState } from 'react';
import { Store, Award, ShoppingBag, Users, Calendar, Heart, Star } from 'lucide-react';
import BusinessPacket from './BusinessPacket';

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

const cardStyle = {
  background: 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
  border: '1px solid rgba(36,56,38,0.5)',
};
const cardStyleSubtle = {
  background: 'linear-gradient(145deg, rgba(20,26,18,0.8) 0%, rgba(14,20,12,0.8) 100%)',
  border: '1px solid rgba(36,56,38,0.5)',
};

function PersonalProfile({ appState, activeTab, setActiveTab }) {
  const { stamps, toggleStamp } = appState;
  const filledStamps = stamps.filter(Boolean).length;
  const hasEarlyAccess = filledStamps >= 5;
  const isRegular = filledStamps >= 10;

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{
          background: 'linear-gradient(145deg, #1E3520 0%, #2A3A28 100%)',
          border: '2px solid rgba(212,168,67,0.2)',
        }}>🧑</div>
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

      <div className="relative rounded-2xl overflow-hidden mb-6">
        <div className="p-5" style={{ background: 'linear-gradient(145deg, #2A1810 0%, #3D2518 30%, #2A1810 60%, #1E1008 100%)' }}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 4px)' }} />
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
                <button key={i} onClick={() => toggleStamp(i)}
                  className="aspect-square rounded-full border-2 border-dashed flex items-center justify-center transition-all"
                  style={{ borderColor: filled ? '#D4A843' : 'rgba(212,168,67,0.15)', background: filled ? 'radial-gradient(circle, #D4A843 0%, #B8922E 100%)' : 'transparent' }}>
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
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #B8922E, #D4A843, #E4C373, #D4A843, #B8922E)' }} />
      </div>

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

// =================== MAIN PROFILE PAGE ===================

export default function ProfilePage({ appState }) {
  const [accountType, setAccountType] = useState('personal');
  const [activeTab, setActiveTab] = useState('activity');
  const [loggedInBrand, setLoggedInBrand] = useState(null);

  return (
    <div className="min-h-screen pb-24 bg-offblack">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-xl font-bold text-gold">Profile</h1>
        </div>

        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: '#0A0D08', border: '1px solid rgba(36,56,38,0.3)' }}>
          <button onClick={() => { setAccountType('personal'); setActiveTab('activity'); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${accountType === 'personal' ? 'text-gold bg-[#111A10]' : 'text-warm/35'}`}>
            Personal
          </button>
          <button onClick={() => { setAccountType('business'); setActiveTab('activity'); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${accountType === 'business' ? 'text-gold bg-[#111A10]' : 'text-warm/35'}`}>
            <Store size={13} /> For Business
          </button>
        </div>

        {accountType === 'personal' ? (
          <PersonalProfile appState={appState} activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <BusinessPacket
            loggedInBrand={loggedInBrand}
            onLogin={(brand) => setLoggedInBrand(brand)}
            onLogout={() => setLoggedInBrand(null)}
          />
        )}
      </div>
    </div>
  );
}
