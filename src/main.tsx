import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter'
import { useAuthStore } from './store-auth';

// Attempt silent token refresh on startup if a refresh token exists but the
// access token is missing or expired. This prevents the first protected API
// call from failing after a page reload.
const refreshToken = localStorage.getItem('refreshToken');
if (refreshToken) {
  useAuthStore.getState().refreshTokenAsync();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
