import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, ChevronRight } from 'lucide-react';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Walkthrough from './components/Walkthrough';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';
import BrandPage from './pages/BrandPage';
import { useAppState } from './hooks/useAppState';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeBrand, setActiveBrand] = useState(null);
  const [showWalkthrough, setShowWalkthrough] = useState(() => {
    return !localStorage.getItem('kk-onboarded');
  });
  const appState = useAppState();

  // Cart state — persisted to localStorage
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kk-cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('kk-cart', JSON.stringify(cart));
  }, [cart]);

  const handleCartAdd = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleCartRemove = (id, delta) => {
    setCart(prev => {
      return prev.map(c => {
        if (c.id !== id) return c;
        const newQty = c.qty + delta;
        if (newQty <= 0) return null;
        return { ...c, qty: newQty };
      }).filter(Boolean);
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [showCart, setShowCart] = useState(false);

  const handleBrandClick = (brandId) => {
    setActiveBrand(brandId);
  };

  const handleBack = () => {
    setActiveBrand(null);
  };

  const handleTabChange = (tab) => {
    setActiveBrand(null);
    setActiveTab(tab);
  };

  const handleWalkthroughComplete = () => {
    localStorage.setItem('kk-onboarded', '1');
    setShowWalkthrough(false);
  };

  return (
    <div className="max-w-md mx-auto bg-offblack min-h-screen relative">
      {showWalkthrough && <Walkthrough onComplete={handleWalkthroughComplete} />}
      <Toast message={appState.toast} />

      {activeBrand ? (
        <BrandPage brandId={activeBrand} appState={appState} onBack={handleBack} />
      ) : (
        <>
          {activeTab === 'home' && <HomePage appState={appState} onBrandClick={handleBrandClick} onCartAdd={handleCartAdd} onShopClick={() => handleTabChange('shop')} />}
          {activeTab === 'shop' && <ShopPage appState={appState} onBrandClick={handleBrandClick} cart={cart} onCartAdd={handleCartAdd} onCartRemove={handleCartRemove} />}
          {activeTab === 'discover' && <DiscoverPage onBrandClick={handleBrandClick} />}
          {activeTab === 'profile' && <ProfilePage appState={appState} />}
        </>
      )}

      {/* Floating Cart FAB — circle button visible on all tabs */}
      {cartCount > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed z-[60] bottom-24 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-black/40 active:scale-90 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #D4A843 0%, #B8922E 100%)',
          }}
        >
          <ShoppingCart size={22} className="text-offblack" />
          <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] rounded-full bg-rust flex items-center justify-center px-1 shadow-lg">
            <span className="text-[11px] font-bold text-white">{cartCount > 9 ? '9+' : cartCount}</span>
          </span>
        </button>
      )}

      {/* Global Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative rounded-t-3xl max-h-[80vh] flex flex-col" style={{
            background: 'linear-gradient(180deg, #151D13 0%, #0E140C 100%)',
            border: '1px solid rgba(36,56,38,0.5)',
            borderBottom: 'none',
          }}>
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-warm/20" />
            </div>

            <div className="px-5 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(36,56,38,0.3)' }}>
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-gold" />
                <h3 className="text-lg font-bold text-cream/95">Cart</h3>
                <span className="text-[11px] text-warm/40">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              </div>
              <button onClick={() => setShowCart(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(36,56,38,0.3)' }}>
                <X size={14} className="text-warm/50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingCart size={32} className="text-warm/15 mx-auto mb-3" />
                  <p className="text-sm text-warm/40">Your cart is empty</p>
                  <p className="text-[11px] text-warm/25 mt-1">Browse the shop and add some pieces</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl p-3" style={{
                      background: 'linear-gradient(165deg, #151D13 0%, #131A11 50%, #121810 100%)',
                      border: '1px solid rgba(36,56,38,0.5)',
                    }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-cream/85 font-medium truncate">{item.name}</p>
                        <p className="text-[10px] text-warm/40">{item.brand} · <span className="text-gold/70">${item.price}</span></p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleCartRemove(item.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(36,56,38,0.4)' }}>
                          <Minus size={11} className="text-warm/60" />
                        </button>
                        <span className="text-[12px] font-bold text-cream/90 w-4 text-center tabular-nums">{item.qty}</span>
                        <button onClick={() => handleCartRemove(item.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.1)' }}>
                          <Plus size={11} className="text-gold/70" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-gold tabular-nums w-12 text-right">${item.price * item.qty}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(36,56,38,0.3)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-warm/50">Total</span>
                  <span className="text-xl font-bold text-gold tabular-nums">${cartTotal}</span>
                </div>
                <button
                  onClick={() => {
                    setCart([]);
                    setShowCart(false);
                    appState.showToast(`Order placed! 🎉 Your ${cartCount} item${cartCount > 1 ? 's' : ''} will be ready at the drop.`);
                  }}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-offblack bg-gold flex items-center justify-center gap-2 shadow-lg shadow-gold/10 active:scale-[0.98] transition-transform">
                  <ShoppingCart size={15} /> Checkout · ${cartTotal}
                </button>
                <p className="text-[9px] text-warm/30 text-center mt-2">Free delivery on orders above $50</p>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} cartCount={cartCount} />
    </div>
  );
}
