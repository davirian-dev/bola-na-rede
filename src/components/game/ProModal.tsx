'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGameStore } from '@/store/gameStore';
import { 
  Crown, 
  Check, 
  X, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Trophy, 
  Zap, 
  Star,
  Flame,
  ArrowRight
} from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRO_FEATURES = [
  {
    icon: <Globe className="w-4 h-4 text-amber-400" />,
    title: 'Ligas da Europa e Convocação Internacional',
    desc: 'Premier League, La Liga, Serie A, Champions League e Copa do Mundo com a Seleção.',
  },
  {
    icon: <Zap className="w-4 h-4 text-emerald-400" />,
    title: 'Narração de Lances Detalhada',
    desc: 'Acompanhe gols, defesas difíceis e decisões táticas minuto a minuto.',
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-blue-400" />,
    title: 'Início Imediato em Qualquer Divisão',
    desc: 'Assuma clubes da Série A, B, C ou D livremente sem restrições.',
  },
  {
    icon: <Trophy className="w-4 h-4 text-amber-400" />,
    title: 'Hall da Fama VIP e Saves Ilimitados',
    desc: 'Salve quantas carreiras quiser na nuvem via Supabase e dispute o topo do ranking.',
  },
  {
    icon: <Flame className="w-4 h-4 text-rose-400" />,
    title: 'Eventos Exclusivos Fora de Campo',
    desc: 'Propostas milionárias, entrevistas coletivas e contratos de patrocínio de elite.',
  },
  {
    icon: <Star className="w-4 h-4 text-emerald-400" />,
    title: '100% Sem Anúncios',
    desc: 'Experiência imersiva, limpa e com renderização instantânea.',
  },
];

export function ProModal({ isOpen, onClose }: ProModalProps) {
  const planTier = useGameStore((s) => s.planTier);
  const setPlanTier = useGameStore((s) => s.setPlanTier);
  const syncWithSupabase = useGameStore((s) => s.syncWithSupabase);
  const isGuest = useGameStore((s) => s.isGuest);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      setPlanTier('pro');
      if (!isGuest) {
        await syncWithSupabase();
      }
      setIsUpgrading(false);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1200);
    } catch {
      setIsUpgrading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div 
        style={{ backgroundColor: '#09090b', opacity: 1 }}
        className="bg-[#09090b] text-white border-2 border-amber-500/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.98)] relative overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto"
      >
        {/* Glow decorativo de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 mb-3">
            <Crown className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
            BOLA NA REDE <span className="text-amber-400">PRO ⭐</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Desbloqueie o universo completo do futebol: Europa, Seleção, narração detalhada e dinastia sem limites.
          </p>
        </div>

        {/* Alternador Mensal / Anual */}
        <div className="flex items-center justify-center p-1 bg-zinc-900 rounded-2xl mb-6 max-w-xs mx-auto border border-zinc-800">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-amber-500 text-zinc-950 shadow-sm font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Anual</span>
            <span className="text-[10px] bg-zinc-950/20 text-current px-1.5 py-0.5 rounded-full font-black">
              -66%
            </span>
          </button>
        </div>

        {/* Card de Preço */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center mb-5">
          {billingCycle === 'annual' ? (
            <div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-xs font-bold text-muted-foreground">Apenas</span>
                <span className="text-3xl font-black text-amber-400 font-display">R$ 1,66</span>
                <span className="text-xs font-bold text-muted-foreground">/mês</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                R$ 19,90 cobrados anualmente (Economia de 66%)
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black text-amber-400 font-display">R$ 4,90</span>
                <span className="text-xs font-bold text-muted-foreground">/mês</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Cancele quando quiser diretamente no painel
              </p>
            </div>
          )}
        </div>

        {/* Lista de Vantagens com Scroll Suave */}
        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 mb-5 text-left">
          {PRO_FEATURES.map((feat, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0 mt-0.5">
                {feat.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Ação */}
        {successMessage ? (
          <div className="py-3.5 px-4 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-sm text-center flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            Parabéns! Modo PRO Ativado com Sucesso!
          </div>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-70"
          >
            {isUpgrading ? (
              <span className="animate-pulse">Ativando sua assinatura...</span>
            ) : (
              <>
                <Crown className="w-4 h-4" />
                <span>{planTier === 'pro' ? 'Você já é PRO (Renovar)' : 'Desbloquear Acesso PRO Agora'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
