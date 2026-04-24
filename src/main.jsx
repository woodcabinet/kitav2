import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSentry } from './lib/sentry'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { pushNotification } from './lib/notificationStore'

initSentry()

// First-visit demo seed — three notifications so the bell has content.
// Guarded by a localStorage flag so we don't re-seed on every reload.
if (!localStorage.getItem('kita_notifications_seeded')) {
  pushNotification({
    kind: 'drop',
    title: 'Maroon · new drop live',
    body: 'The Vortex Tee restocked — heavyweight cotton, $30. Weekly drop just went out.',
    url: '/brand/maroon',
  })
  pushNotification({
    kind: 'event',
    title: 'RSVP confirmed: Gillman Maker\'s Market',
    body: 'Sat, 3 May · 2pm–8pm. 20 local makers on the block. See you there!',
    url: '/discover',
  })
  pushNotification({
    kind: 'follow',
    title: 'Tiong Bahru Bakery just joined',
    body: 'Croissants baked twice daily. Follow them for drops + event alerts.',
    url: '/brand/tiong-bahru-bakery',
  })
  localStorage.setItem('kita_notifications_seeded', '1')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
