'use client';

import { useEffect } from 'react';

export function PWARegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registrado com escopo:', registration.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Erro ao registrar Service Worker:', err);
          });
      });
    }
  }, []);

  return null;
}
