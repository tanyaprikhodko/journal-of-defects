import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter'
// import { useAuthStore } from './store-auth';

// const refreshTokenIfNeeded = () => {
//   const refreshTokenAsync = useAuthStore.getState().refreshTokenAsync;
//   refreshTokenAsync();
// };

// refreshTokenIfNeeded();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter/>
  </StrictMode>,
)
