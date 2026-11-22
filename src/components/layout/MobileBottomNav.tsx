'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Trophy, 
  Award,
  Newspaper, 
  Database, 
  PlusCircle,
  Swords
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Painel',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Online',
      href: '/online',
      icon: Swords,
    },
    {
      label: 'Ligas',
      href: '/competicoes',
      icon: Trophy,
    },
    {
      label: 'Rankings',
      href: '/ranking',
      icon: Award,
    },
    {
      label: 'Notícias',
      href: '/noticias',
      icon: Newspaper,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-t border-border px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive
                ? 'text-emerald-500 font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
