import { useState } from 'react';
import { Camera, Sparkles, AlertCircle } from 'lucide-react';
import { wardrobeItems, wardrobeCategories } from '../data/wardrobe';

export default function WardrobePage({ appState }) {
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState(wardrobeItems);

  const filtered = category === 'All' ? items : items.filter(i => i.category === category);
  const totalItems = items.length;
  const totalCost = items.reduce((a, b) => a + b.cost, 0);
  const totalWears = items.reduce((a, b) => a + b.wears, 0);
  const avgCostPerWear = totalWears > 0 ? (totalCost / totalWears).toFixed(2) : '—';
  const unworn = items.filter(i => i.wears === 0);

  return (
    <div className="min-h-screen pb-24" style={{
      background: 'linear-gradient(180deg, #0A0D08 0%, #0D1209 50%, #0A0D08 100%)',
    }}>
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold" style={{
            background: 'linear-gradient(135deg, #E4C373 0%, #D4A843 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>My Wardrobe</h1>
          <button className="w-10 h-10 rounded-full bg-gold text-offblack flex items-center justify-center shadow-lg shadow-gold/15">
            <Camera size={18} />
          </button>
        </div>

        {/* AI Stylist Card */}
        <div className="rounded-2xl p-4 mb-4 animate-fade-in" style={{
          background: 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
          border: '1px solid rgba(212,168,67,0.15)',
        }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{
              background: 'rgba(212,168,67,0.08)',
            }}>
              <Sparkles size={18} className="text-gold/70" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gold">Your AI Stylist</p>
              <p className="text-xs text-warm/40">is learning your style...</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{
            background: 'rgba(10,13,8,0.6)',
          }}>
            <div className="h-full w-[35%] rounded-full" style={{
              background: 'linear-gradient(90deg, #D4A843, #E4C373)',
            }} />
          </div>
          <p className="text-[10px] text-warm/35 mt-1.5">Add more items to get personalized outfit suggestions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { val: totalItems, label: 'Items', color: 'text-gold' },
            { val: `$${avgCostPerWear}`, label: 'Cost/Wear', color: 'text-sage/80' },
            { val: unworn.length, label: 'Unworn', color: 'text-rust/80' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-3 text-center" style={{
              background: 'linear-gradient(145deg, rgba(20,26,18,0.8) 0%, rgba(14,20,12,0.8) 100%)',
              border: '1px solid rgba(36,56,38,0.5)',
            }}>
              <p className={`font-display text-xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-[10px] text-warm/35">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Unworn section */}
        {unworn.length > 0 && (
          <div className="rounded-2xl p-4 mb-4 animate-fade-in" style={{
            background: 'linear-gradient(145deg, rgba(196,98,45,0.06) 0%, rgba(196,98,45,0.02) 100%)',
            border: '1px solid rgba(196,98,45,0.15)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-rust/70" />
              <p className="text-sm font-semibold text-rust/80">Unworn Items</p>
            </div>
            <div className="space-y-2 mb-3">
              {unworn.map(item => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <span>{item.emoji}</span>
                  <span className="text-cream/60">{item.name}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 rounded-xl bg-gold text-offblack text-sm font-semibold hover:bg-gold-light transition-colors shadow-sm shadow-gold/15">
              List in Next KitaKakis Drop
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
          {wardrobeCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                category === cat ? 'bg-gold text-offblack shadow-sm shadow-gold/15' : 'text-warm/50'
              }`}
              style={category !== cat ? {
                background: 'linear-gradient(145deg, rgba(20,26,18,0.8) 0%, rgba(14,20,12,0.8) 100%)',
                border: '1px solid rgba(36,56,38,0.5)',
              } : undefined}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Wardrobe Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden animate-fade-in"
            style={{
              animationDelay: `${i * 0.06}s`,
              background: 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
              border: '1px solid rgba(36,56,38,0.5)',
            }}
          >
            <div
              className="aspect-square flex items-center justify-center text-5xl overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, var(--color-${item.gradient.split(' ')[0].replace('from-', '')}), var(--color-${item.gradient.split(' ')[1]?.replace('to-', '') || 'forest'}))`,
              }}
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
              ) : (
                item.emoji
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-cream/80 leading-tight mb-1 line-clamp-2">{item.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-warm/35">{item.wears > 0 ? `${item.wears} wears` : 'Unworn'}</span>
                <span className="text-[10px] text-gold/70">${item.cost}</span>
              </div>
              {item.wears === 0 && (
                <button className="w-full mt-2 py-1.5 rounded-lg text-gold/70 text-[10px] font-medium" style={{
                  background: 'rgba(212,168,67,0.06)',
                  border: '1px solid rgba(212,168,67,0.12)',
                }}>
                  List on KitaKakis
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
