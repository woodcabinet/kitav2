import { Home, ShoppingBag, Compass, User } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ activeTab, onTabChange, cartCount = 0 }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t border-card-border/40" style={{
      background: 'linear-gradient(180deg, rgba(10,13,8,0.92) 0%, rgba(10,13,8,0.98) 100%)',
    }}>
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-300"
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                active ? 'bg-gold/8' : ''
              }`}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.5}
                  className={active ? 'text-gold' : 'text-warm/35'}
                />
                {tab.id === 'shop' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rust rounded-full flex items-center justify-center px-1">
                    <span className="text-[9px] text-white font-bold">{cartCount > 9 ? '9+' : cartCount}</span>
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-gold' : 'text-warm/30'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
