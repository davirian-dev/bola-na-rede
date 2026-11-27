'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'bolanarede_lgpd_consent';

export function LgpdBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-slate-900/95 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs text-slate-300">
      <p className="mb-3 leading-relaxed">
        Usamos cookies essenciais e métricas para melhorar sua experiência no Bola na Rede. Veja nossa{' '}
        <a href="/privacidade" className="text-emerald-400 underline font-semibold">
          Política de Privacidade
        </a>
        .
      </p>
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={decline}
          className="px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 transition-colors"
        >
          Recusar
        </button>
        <button
          onClick={accept}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
