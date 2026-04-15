import { useState } from 'react';
import { ShoppingBag, Compass, User, ChevronRight, BarChart3 } from 'lucide-react';

const steps = [
  {
    title: 'Welcome to KitaKakis',
    subtitle: 'By Singaporeans, For Singaporeans',
    desc: 'Discover Singapore\'s freshest streetwear & fashion brands — all in one place.',
    icon: null,
    gradient: 'linear-gradient(165deg, #0D1A0F 0%, #111A10 60%, #0A0D08 100%)',
    accent: '#D4A843',
    visual: 'logo',
  },
  {
    title: 'Discover Local Drops',
    subtitle: 'Home & Drops',
    desc: 'Scroll through the latest pieces from 10+ SG brands. Swipe stories, browse the feed, and never miss a drop.',
    icon: ShoppingBag,
    gradient: 'linear-gradient(165deg, #121810 0%, #0D1A0F 100%)',
    accent: '#D4A843',
    features: ['Brand stories & TikTok embeds', 'Monthly curated drops', 'Wishlist & save pieces'],
  },
  {
    title: 'Explore Events & Map',
    subtitle: 'Discover',
    desc: 'Find pop-ups, flea markets & fairs happening around Singapore on a real interactive map.',
    icon: Compass,
    gradient: 'linear-gradient(165deg, #0F1510 0%, #0D1A0F 100%)',
    accent: '#7A9E7A',
    features: ['Live event pins on the map', 'RSVP to events', 'Artbox, Resurrack & more'],
  },
  {
    title: 'For Brands Too',
    subtitle: 'Business Dashboard',
    desc: 'Running a brand? Log in to manage your storefront, edit products, and connect with the community.',
    icon: User,
    gradient: 'linear-gradient(165deg, #121015 0%, #0D1A0F 100%)',
    accent: '#D4A843',
    features: ['Full page editor', 'Product & drop management', 'Endorsements & collabs'],
  },
  {
    title: 'Analytics That Matter',
    subtitle: 'Business Insights',
    desc: 'Track traffic, sales and views across every store. Know what works, drop what doesn\'t.',
    icon: BarChart3,
    gradient: 'linear-gradient(165deg, #101815 0%, #0D1A0F 100%)',
    accent: '#7A9E7A',
    features: ['Website traffic & visitor maps', 'Revenue & conversion tracking', 'Per-store performance'],
  },
];

export default function Walkthrough({ onComplete }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: current.gradient }}>
      {/* Progress bar */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-500" style={{
                width: i === step ? 24 : 8,
                background: i <= step ? current.accent : 'rgba(255,255,255,0.08)',
              }} />
            ))}
          </div>
          {step > 0 && (
            <button onClick={onComplete} className="text-[11px] text-warm/30 hover:text-warm/50 transition-colors">
              Skip
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-8">
        {/* Visual / Icon */}
        <div className="mb-8 flex justify-center">
          {current.visual === 'logo' ? (
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #0A0D08, #111A10)',
                border: '2px solid rgba(212,168,67,0.2)',
                boxShadow: '0 0 60px rgba(212,168,67,0.1)',
              }}>
                <span className="font-display text-4xl font-bold text-gold">KK</span>
              </div>
              {/* Floating dots */}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-sage/20 animate-pulse" />
              <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-rust/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 -right-5 w-2 h-2 rounded-full bg-gold/20 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{
              background: `${current.accent}10`,
              border: `1.5px solid ${current.accent}25`,
              boxShadow: `0 0 40px ${current.accent}08`,
            }}>
              {current.icon && <current.icon size={36} style={{ color: current.accent }} strokeWidth={1.5} />}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          {current.subtitle && step > 0 && (
            <span className="text-[10px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: current.accent + '80' }}>
              {current.subtitle}
            </span>
          )}
          <h1 className="font-display text-2xl font-bold text-cream mb-3 leading-tight">{current.title}</h1>
          <p className="text-sm text-cream/50 leading-relaxed max-w-[280px] mx-auto">{current.desc}</p>
        </div>

        {/* Feature bullets */}
        {current.features && (
          <div className="space-y-2.5 max-w-[260px] mx-auto">
            {current.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: current.accent }} />
                <span className="text-[12px] text-cream/60">{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-8 pb-10">
        <button
          onClick={() => isLast ? onComplete() : setStep(step + 1)}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${current.accent}, ${current.accent}CC)`,
            color: '#080C09',
            boxShadow: `0 4px 20px ${current.accent}30`,
          }}
        >
          {isLast ? 'Get Started' : 'Continue'}
          {!isLast && <ChevronRight size={16} />}
        </button>

        {step === 0 && (
          <p className="text-center text-[10px] text-warm/20 mt-4">
            Made with love in Singapore
          </p>
        )}
      </div>
    </div>
  );
}
