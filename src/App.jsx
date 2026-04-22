import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'

// Consumer layouts & pages
import { ConsumerHeader } from './components/consumer/ConsumerHeader'
import { BottomNav } from './components/consumer/BottomNav'
import { SideNav } from './components/consumer/SideNav'
import { FloatingCart } from './components/consumer/FloatingCart'
import HomePage from './pages/consumer/HomePage'
import DiscoverPage from './pages/consumer/DiscoverPage'
import SearchPage from './pages/consumer/SearchPage'
// Events + Drops now live inside Discover
import ThreadsPage from './pages/consumer/ThreadsPage'
import ShopPage from './pages/consumer/ShopPage'
import RewardsPage from './pages/consumer/RewardsPage'
import BrandProfilePage from './pages/consumer/BrandProfilePage'
import ProfilePage from './pages/consumer/ProfilePage'

// Brand dashboard pages
import { DashboardSidebar } from './components/brand/DashboardSidebar'
import DashboardOverview from './pages/brand/DashboardOverview'
import ContentPage from './pages/brand/ContentPage'
import ConnectPage from './pages/brand/ConnectPage'
import StorePage from './pages/brand/StorePage'
import BrandEventsPage from './pages/brand/EventsPage'
import OnboardingPage from './pages/brand/OnboardingPage'

// Auth pages
import LoginPage from './pages/auth/LoginPage'

const queryClient = new QueryClient()

// Consumer layout wrapper
function ConsumerLayout() {
  return (
    <div className="min-h-screen paper-texture">
      {/* Desktop left rail (Instagram-web style), collapses to icons <1280px */}
      <SideNav />

      {/* Centered content column — phone-width on mobile, feed-width on desktop */}
      <div className="md:pl-[72px] xl:pl-60 flex justify-center">
        <div className="w-full max-w-md md:max-w-[630px] min-h-screen bg-[#FAF6EE] md:border-x md:border-[#E8DDC8] relative">
          <ConsumerHeader />
          <main className="pb-20 md:pb-8">
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </div>
      <FloatingCart />
    </div>
  )
}

// Brand dashboard layout wrapper
function DashboardLayout() {
  return (
    <div className="flex min-h-screen paper-texture">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<LoginPage />} />

            {/* Brand onboarding (standalone) */}
            <Route path="/brand/onboarding" element={<OnboardingPage />} />

            {/* Global search (standalone full-page) */}
            <Route path="/search" element={<SearchPage />} />

            {/* Brand dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="content" element={<ContentPage />} />
              <Route path="connect" element={<ConnectPage />} />
              <Route path="analytics" element={<DashboardOverview />} />
              <Route path="store" element={<StorePage />} />
              <Route path="events" element={<BrandEventsPage />} />
              <Route path="drops" element={<Navigate to="/dashboard/store" replace />} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>} />
            </Route>

            {/* Consumer app */}
            <Route element={<ConsumerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/events" element={<Navigate to="/discover" replace />} />
              <Route path="/drops" element={<Navigate to="/discover" replace />} />
              <Route path="/threads" element={<ThreadsPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/brand/:slug" element={<BrandProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
