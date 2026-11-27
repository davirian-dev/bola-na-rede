'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGameStore } from '@/store/gameStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import { 
  Heart, 
  Copy, 
  Check, 
  X, 
  QrCode, 
  Sparkles, 
  Server, 
  Trophy, 
  Gamepad2, 
  Send,
  Crown,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const planTier = useGameStore((s) => s.planTier);
  const setPlanTier = useGameStore((s) => s.setPlanTier);
  const syncWithSupabase = useGameStore((s) => s.syncWithSupabase);
  const isGuest = useGameStore((s) => s.isGuest);

  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [successActivated, setSuccessActivated] = useState(false);
  const mounted = useIsMounted();

  const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY || 'elisantos157h@gmail.com';

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

  const handleCopyPix = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(PIX_KEY);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    }
  };

  const handleClaimProFromDonation = async () => {
    try {
      setPlanTier('pro');
      if (!isGuest) {
        await syncWithSupabase();
      }
      setSuccessActivated(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setSuccessActivated(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Erro ao sincronizar doação PRO:', err);
      setSuccessActivated(true);
      setTimeout(() => {
        setSuccessActivated(false);
        onClose();
      }, 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Fiz uma doação no valor de R$ ${selectedAmount.toFixed(2).replace('.', ',')} para apoiar o desenvolvimento do jogo Bola na Rede: Carreira!`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div 
        style={{ backgroundColor: '#09090b', opacity: 1 }}
        className="bg-[#09090b] text-white border-2 border-rose-500/50 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-[0_0_80px_rgba(244,63,94,0.25)] relative overflow-hidden flex flex-col max-h-[94vh] z-10 my-auto"
      >
        {/* Glow decorativo de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-500/25 mb-2.5">
            <Heart className="w-7 h-7 fill-current animate-pulse" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black text-white">
            Apoie o Projeto <span className="text-rose-400">Bola na Rede 💖</span>
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto leading-relaxed">
            Jogo 100% independente criado por amor ao futebol. Sua doação mantém nossos servidores online e viabiliza novas atualizações!
          </p>
        </div>

        {/* Metas da Comunidade */}
        <div className="p-3 sm:p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-4 space-y-2 text-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Metas de Desenvolvimento Ativas:
          </span>
          
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                <span className="flex items-center gap-1"><Server className="w-3 h-3 text-emerald-400" /> Servidores Supabase 24/7 (PvP)</span>
                <span className="text-emerald-400">85%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-400" /> Libertadores & Mundial Oficial</span>
                <span className="text-amber-400">60%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3 text-rose-400" /> Minigames de Falta e Escanteio</span>
                <span className="text-rose-400">45%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Escolha do Valor de Doação */}
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2 text-center">
            Escolha o valor de apoio:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 5, label: 'R$ 5', desc: 'Cafezinho ☕' },
              { val: 10, label: 'R$ 10', desc: 'Bola ⚽' },
              { val: 25, label: 'R$ 25', desc: 'Chuteira 👟' },
              { val: 50, label: 'R$ 50', desc: 'Master 🏆' },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => setSelectedAmount(item.val)}
                className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedAmount === item.val
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-black scale-102 shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold text-white">{item.label}</div>
                <div className="text-[9px] text-zinc-400 truncate">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Card Pix Copia e Cola */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-bold flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-400" />
              Chave Pix Oficial (E-mail):
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-black uppercase">
              Transferência Direta
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs">
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
                  <span>Copiar Pix</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 text-center leading-tight">
            Abra seu app do banco (Nubank, Inter, Caixa, Itaú, etc.), selecione Pix e cole a chave acima.
          </p>
        </div>

        {/* Bônus PRO por Doação */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-extrabold text-amber-300 block">
                Doou a partir de R$ 9,90?
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Apoiadores ganham o Modo PRO Vitalício!
              </span>
            </div>
          </div>

          {planTier !== 'pro' ? (
            <button
              type="button"
              onClick={handleClaimProFromDonation}
              className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] uppercase whitespace-nowrap cursor-pointer transition-all active:scale-95 shrink-0"
            >
              Já Fiz o Pix (Ativar)
            </button>
          ) : (
            <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase">
              PRO Ativo ✓
            </span>
          )}
        </div>

        {/* Feedback de Sucesso */}
        {successActivated && (
          <div className="p-3 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs text-center flex items-center justify-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4" />
            Obrigado pelo apoio! Modo PRO ativado com sucesso!
          </div>
        )}

        {/* Botão de WhatsApp */}
        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-zinc-950 font-black text-xs text-center flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Mensagem no WhatsApp</span>
          </a>
          
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
