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
  ArrowRight,
  Copy,
  QrCode,
  Send,
  Heart,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDonation?: () => void;
}

const PRO_FEATURES = [
  {
    icon: <Globe className="w-4 h-4 text-amber-400" />,
    title: 'Ligas da Europa, MLS e Liga Saudita',
    desc: 'Premier League, La Liga, Serie A, Champions League e Copa do Mundo com a Seleção.',
  },
  {
    icon: <Zap className="w-4 h-4 text-emerald-400" />,
    title: 'Ambidestria Suprema e Criação Livre',
    desc: 'Atletas ambidestros sem pontos negativos e início imediato em qualquer clube.',
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-blue-400" />,
    title: 'Início Imediato em Qualquer Divisão',
    desc: 'Assuma gigantes da Série A, B, C, Europa ou Arábia sem bloqueios.',
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

export function ProModal({ isOpen, onClose, onOpenDonation }: ProModalProps) {
  const planTier = useGameStore((s) => s.planTier);
  const setPlanTier = useGameStore((s) => s.setPlanTier);
  const syncWithSupabase = useGameStore((s) => s.syncWithSupabase);
  const isGuest = useGameStore((s) => s.isGuest);

  const [billingCycle, setBillingCycle] = useState<'lifetime' | 'monthly'>('lifetime');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY || 'elisantos157h@gmail.com';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowCancelConfirm(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleCopyPix = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(PIX_KEY);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    }
  };

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      setPlanTier('pro');
      if (!isGuest) {
        await syncWithSupabase();
      }
      setIsUpgrading(false);
      setSuccessMessage('Parabéns! Modo PRO Ativado com Sucesso!');
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch {
      setIsUpgrading(false);
    }
  };

  const handleCancelPro = async () => {
    try {
      setIsUpgrading(true);
      setPlanTier('free');
      if (!isGuest) {
        await syncWithSupabase();
      }
      setIsUpgrading(false);
      setShowCancelConfirm(false);
      setSuccessMessage('Modo PRO cancelado. Você voltou para o plano Free.');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch {
      setIsUpgrading(false);
    }
  };

  const selectedPrice = billingCycle === 'lifetime' ? 'R$ 9,90' : 'R$ 4,90';
  const whatsappText = encodeURIComponent(
    `Olá! Acabei de fazer o Pix de ${selectedPrice} para ativar o Bola na Rede PRO. Chave utilizada: ${PIX_KEY}. Segue meu comprovante!`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div 
        style={{ backgroundColor: '#09090b', opacity: 1 }}
        className="bg-[#09090b] text-white border-2 border-amber-500/60 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-[0_0_80px_rgba(245,158,11,0.25)] relative overflow-hidden flex flex-col max-h-[94vh] z-10 my-auto"
      >
        {/* Glow decorativo de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 mb-2">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black text-white">
            BOLA NA REDE <span className="text-amber-400">PRO ⭐</span>
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto leading-relaxed">
            Europa, MLS, Liga Saudita, Seleção e dinastia sem limites.
          </p>
        </div>

        {/* SEÇÃO CASO O USUÁRIO JÁ SEJA PRO */}
        {planTier === 'pro' && !showCancelConfirm && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-center mb-4 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Você é Membro PRO Ativo! 👑
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-snug">
              Todos os benefícios da Europa, Seleção Brasileira, Hall da Fama e saves ilimitados estão liberados na sua conta.
            </p>

            <div className="pt-1 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                className="py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-rose-950/60 border border-zinc-700 hover:border-rose-500/60 text-zinc-400 hover:text-rose-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancelar / Desativar PRO</span>
              </button>
            </div>
          </div>
        )}

        {/* Confirmação de Cancelamento do PRO */}
        {showCancelConfirm && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-center mb-4 space-y-3 animate-in zoom-in-95 duration-150">
            <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-300">
              Deseja cancelar o Modo PRO?
            </h4>
            <p className="text-[11px] text-zinc-300 leading-snug">
              Você voltará para o plano gratuito (Free). É possível reativar o PRO a qualquer momento usando sua chave Pix.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancelPro}
                disabled={isUpgrading}
                className="py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase cursor-pointer transition-all active:scale-95"
              >
                {isUpgrading ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </button>
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="py-2 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {/* SELEÇÃO DE PLANO (SE NÃO FOR PRO OU PARA RENOVAR) */}
        {planTier !== 'pro' && (
          <>
            {/* Alternador de Preço */}
            <div className="flex items-center justify-center p-1 bg-zinc-900 rounded-2xl mb-3.5 max-w-xs mx-auto border border-zinc-800">
              <button
                type="button"
                onClick={() => setBillingCycle('lifetime')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  billingCycle === 'lifetime'
                    ? 'bg-amber-500 text-zinc-950 font-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Vitalício</span>
                <span className="text-[9px] bg-zinc-950/20 px-1 rounded font-black">PRO</span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-zinc-800 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Mensal
              </button>
            </div>

            {/* Card de Preço & Pix Oficial */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/40 mb-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest block">
                    {billingCycle === 'lifetime' ? 'Acesso Vitalício PRO' : 'Assinatura Mensal'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-amber-400 font-display">
                      {selectedPrice}
                    </span>
                    <span className="text-xs text-zinc-400 font-bold">
                      {billingCycle === 'lifetime' ? 'pagamento único' : '/mês'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
                    Liberação Imediata
                  </span>
                </div>
              </div>

              {/* Box da Chave Pix */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
                  <span className="flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    Chave Pix (E-mail):
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px]">Copia e Cola</span>
                </div>

                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs">
                  <span className="text-emerald-400 font-bold truncate select-all">
                    {PIX_KEY}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="py-1 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-[11px] flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Lista de Vantagens com Scroll */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1 mb-3.5 text-left max-h-44 sm:max-h-52">
          {PRO_FEATURES.map((feat, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
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

        {/* Mensagem de Sucesso */}
        {successMessage && (
          <div className="py-2.5 px-3 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs text-center flex items-center justify-center gap-1.5 mb-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* Botões de Ação */}
        {planTier !== 'pro' && !successMessage && (
          <div className="space-y-2">
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-70"
            >
              {isUpgrading ? (
                <span className="animate-pulse">Ativando sua assinatura...</span>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  <span>Já Fiz o Pix (Liberar Modo PRO Agora)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Comprovante no WhatsApp</span>
            </a>
          </div>
        )}

        {/* Link para Aba / Modal de Doação Voluntária */}
        {onOpenDonation && (
          <div className="pt-2 text-center border-t border-zinc-800/80 mt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDonation();
              }}
              className="text-xs text-zinc-400 hover:text-rose-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>Quer apenas fazer uma doação para apoiar o jogo? Clique aqui.</span>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
