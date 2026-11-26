import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { injectSpeedInsights } from '@vercel/speed-insights';
import App from './App';
import './index.css';

// Vercel Speed Insights — production only (was agent/scripts/speed-insights.js).
const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname);
if (isProduction) injectSpeedInsights({ debug: false });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => console.log('SW error:', err));
  });
}
