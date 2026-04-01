import { Home, Flame, Compass, Shirt, User } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'drops', label: 'Drops', icon: Flame, glow: true },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ activeTab, onTabChange }) {
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
              } ${tab.glow && active ? 'animate-pulse-glow' : ''}`}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.5}
                  className={active ? 'text-gold' : 'text-warm/35'}
                />
                {tab.glow && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold rounded-full shadow-sm shadow-gold/30"></span>
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
