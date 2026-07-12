import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register Service Worker for complete high-fidelity PWA capabilities in both dev & prod
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('[PWA] Service Worker active & registered successfully:', registration.scope);
//       })
//       .catch((error) => {
//         console.error('[PWA] Service Worker registration failed:', error);
//       });
//   });
// }

// Active clean up of service workers to avoid reload loops on local machines
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('[PWA] Successfully cleaned up registered service worker to prevent local reload loops');
        }
      });
    }
  });
}

// Clear all browser PWA caches
if (window.caches) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      caches.delete(key).then(() => {
        console.log('[PWA] Cleared stale cache:', key);
      });
    });
  });
}

// Strictly prevent the browser from showing the native PWA install prompt/button
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  console.log('[PWA] Auto-prevented the native browser install prompt.');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

