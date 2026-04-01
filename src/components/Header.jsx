import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-offblack/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-2.5">
        <h1 className="font-display text-xl font-bold text-gold">KitaKakis</h1>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-warm/60 hover:text-warm transition-colors">
            <Search size={18} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center relative text-warm/60 hover:text-warm transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rust rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
