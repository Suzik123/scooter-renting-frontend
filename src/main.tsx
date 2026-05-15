import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './i18n'
import 'leaflet/dist/leaflet.css'
import App from './App'
import './index.css'

const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim()

const tree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {googleClientId
      ? <GoogleOAuthProvider clientId={googleClientId}>{tree}</GoogleOAuthProvider>
      : tree}
  </StrictMode>,
)
