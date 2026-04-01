import { useState } from 'react';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import DropsPage from './pages/DropsPage';
import DiscoverPage from './pages/DiscoverPage';
import WardrobePage from './pages/WardrobePage';
import ProfilePage from './pages/ProfilePage';
import BrandPage from './pages/BrandPage';
import { useAppState } from './hooks/useAppState';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeBrand, setActiveBrand] = useState(null);
  const appState = useAppState();

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

  return (
    <div className="max-w-md mx-auto bg-offblack min-h-screen relative">
      <Toast message={appState.toast} />

      {activeBrand ? (
        <BrandPage brandId={activeBrand} appState={appState} onBack={handleBack} />
      ) : (
        <>
          {activeTab === 'home' && <HomePage appState={appState} onBrandClick={handleBrandClick} />}
          {activeTab === 'drops' && <DropsPage appState={appState} onBrandClick={handleBrandClick} />}
          {activeTab === 'discover' && <DiscoverPage onBrandClick={handleBrandClick} />}
          {activeTab === 'wardrobe' && <WardrobePage appState={appState} />}
          {activeTab === 'profile' && <ProfilePage appState={appState} />}
        </>
      )}

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
