'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { ProModal } from '@/components/game/ProModal';
import { DonationModal } from '@/components/game/DonationModal';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Flame, 
  Database, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Newspaper,
  Sparkles,
  BarChart3,
  ArrowLeftRight,
  Swords,
  Globe,
  Heart
} from 'lucide-react';

export function DesktopSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const mode = useGameStore((s) => s.mode);
  const planTier = useGameStore((s) => s.planTier);

  const navItems = [
    {
      label: 'Painel Central',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Modo Online (PvP)',
      href: '/online',
      icon: Swords,
      badge: 'ONLINE',
    },
    {
      label: 'Mercado da Bola',
      href: '/transferencias',
      icon: ArrowLeftRight,
    },
    {
      label: 'Competições & Tabelas',
      href: '/competicoes',
      icon: Trophy,
    },
    {
      label: 'Calendário de Jogos',
      href: '/calendario',
      icon: Database,
    },
    {
      label: 'Loja Pix & VIP',
      href: '/loja-pix',
      icon: Sparkles,
      badge: 'PIX',
    },
    {
      label: 'Rankings & Prêmios',
      href: '/ranking',
      icon: TrendingUp,
    },
    {
      label: 'Cenários & Desafios',
      href: '/desafios',
      icon: Sparkles,
    },
    {
      label: 'Sistema de Pontuação',
      href: '/pontuacao',
      icon: BarChart3,
    },
    {
      label: 'Diário de Notícias',
      href: '/noticias',
      icon: Newspaper,
    },
    {
      label: mode === 'player' ? 'Meu Atleta & Ficha' : 'Elenco & Táticas',
      href: '/dashboard#elenco',
      icon: Users,
    },
    {
      label: mode === 'player' ? 'Fora de Campo (Vida)' : 'Diretoria & Finanças',
      href: '/dashboard#gestao',
      icon: Flame,
    },
    {
      label: 'Editor da Comunidade',
      href: '/editor',
      icon: Database,
    },
    {
      label: 'Nova Carreira',
      href: '/new-career',
      icon: PlusCircle,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur transition-all duration-300 relative ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Botão de Colapsar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm cursor-pointer z-20"
        title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navegação Principal */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {(item as any).badge && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-500 text-zinc-950 ml-1.5 animate-pulse">
                      {(item as any).badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé da Sidebar: Pro Banner */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
              {planTier === 'pro' ? 'Clube VIP Ativo' : 'Passe Pro'}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-2.5 leading-snug">
            {planTier === 'pro' 
              ? 'Multiplayer, dinastias infinitas e ligas europeias liberadas!' 
              : 'Desbloqueie dinastia de gerações, torneios continentais e editor ilimitado.'}
          </p>
          {planTier !== 'pro' ? (
            <button
              type="button"
              onClick={() => setIsProModalOpen(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              Virar Pro (Pix R$ 9,90)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsProModalOpen(true)}
              className="w-full py-1 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold transition-colors cursor-pointer"
            >
              Gerenciar Assinatura
            </button>
          )}

          <div className="pt-2 mt-2 border-t border-border/60 text-center">
            <button
              type="button"
              onClick={() => setIsDonationModalOpen(true)}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
            >
              <Heart className="w-3 h-3 fill-current" />
              <span>Apoiar Projeto / Doar</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal PRO */}
      <ProModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        onOpenDonation={() => setIsDonationModalOpen(true)}
      />

      {/* Modal Doações */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </aside>
  );
}
