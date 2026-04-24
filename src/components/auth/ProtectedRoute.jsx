import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Route gate. Renders children only when an authenticated user exists;
 * otherwise redirects to /auth/login and preserves the attempted URL in
 * location state so the login page can return the user after success.
 *
 * `requireBrand` flips this to also require the user have an associated
 * brand record (used for /dashboard routes — any consumer who happens to
 * be signed in shouldn't see the brand dashboard).
 *
 * While the auth context is still hydrating (loading=true) we render a
 * minimal placeholder instead of flickering the login redirect, which
 * would race the session restore on first load.
 */
export function ProtectedRoute({ children, requireBrand = false }) {
  const { user, brand, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6EE]">
        <div className="text-sm text-[#8B7355]">Loading…</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (requireBrand && !brand) {
    // Signed-in consumer trying to reach /dashboard — send them to the
    // brand onboarding instead of looping them on login.
    return <Navigate to="/brand/onboarding" replace />
  }

  return children
}
