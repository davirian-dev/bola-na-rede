'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useIsMounted } from '@/hooks/useIsMounted';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-emerald-900/30 bg-emerald-950/20" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-200 dark:border-emerald-900/40 bg-zinc-100 dark:bg-emerald-950/30 text-zinc-700 dark:text-emerald-400 hover:bg-zinc-200 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
      title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
      aria-label="Alternar tema de cores"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 transition-transform rotate-0" />
      )}
    </button>
  );
}
