'use client';

import React from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { ClubBadge } from '@/components/game/ClubBadge';
import { formatCurrency } from '@/lib/calculations';
import { 
  Briefcase, 
  Coins, 
  Calendar, 
  CheckCircle2, 
  X, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  ArrowRight
} from 'lucide-react';

interface TransferOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferOfferModal({ isOpen, onClose }: TransferOfferModalProps) {
  const pendingTransferOffer = useGameStore((s) => s.pendingTransferOffer);
  const acceptTransferOffer = useGameStore((s) => s.acceptTransferOffer);
  const rejectTransferOffer = useGameStore((s) => s.rejectTransferOffer);
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);

  if (!isOpen || !pendingTransferOffer) return null;

  const currentActorName = mode === 'player' ? (playerProfile?.name || 'Atleta') : (managerProfile?.name || 'Comandante');

  const handleAccept = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    acceptTransferOffer();
    onClose();
  };

  const handleReject = () => {
    rejectTransferOffer();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col space-y-5">
        
        {/* Glow decorativo de fundo */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Topo do Modal com Imagem Oficial de Apresentação */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-zinc-950 border border-border">
          <Image
            src="/images/news/mercado.webp"
            alt="Proposta de Transferência"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          <div className="absolute top-3 left-3 bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Mercado da Bola Oficial
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ClubBadge
                primaryColor={pendingTransferOffer.primaryColor}
                secondaryColor={pendingTransferOffer.secondaryColor}
                shortName={pendingTransferOffer.shortName}
                size="md"
              />
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
                  Proposta de Contratação
                </span>
                <h3 className="font-display text-lg font-black text-white">
                  {pendingTransferOffer.fromClubName}
                </h3>
              </div>
            </div>

            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded backdrop-blur ${
              pendingTransferOffer.division === 'EUROPA'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'bg-white/20 text-white'
            }`}>
              {pendingTransferOffer.division === 'EUROPA' ? '👑 Europa' : `Série ${pendingTransferOffer.division}`}
            </span>
          </div>
        </div>

        {/* Mensagem da Diretoria do Novo Clube */}
        <div className="p-3.5 rounded-2xl bg-secondary/70 border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Motivo do Interesse
          </span>
          <p className="text-xs font-semibold text-foreground leading-relaxed">
            &quot;{pendingTransferOffer.reason}&quot;
          </p>
        </div>

        {/* Detalhes Financeiros e Contratuais */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-500 block">Novo Salário</span>
            <span className="font-display text-base font-black text-foreground">
              {formatCurrency(pendingTransferOffer.weeklyWageOffer)}
            </span>
            <span className="text-[10px] text-muted-foreground block">por semana</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-amber-500 block">Luvas na Assinatura</span>
            <span className="font-display text-base font-black text-foreground">
              +{formatCurrency(pendingTransferOffer.signingBonus)}
            </span>
            <span className="text-[10px] text-muted-foreground block">bônus à vista</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary text-xs font-semibold text-muted-foreground">
          <span>Duração do Vínculo: <strong className="text-foreground">{pendingTransferOffer.contractDurationYears} anos</strong></span>
          <span>Status: <strong className="text-emerald-400">{pendingTransferOffer.roleOffered}</strong></span>
        </div>

        {/* Botões de Decisão */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 py-3 px-4 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground font-bold text-xs transition-colors cursor-pointer"
          >
            Recusar e Ficar no Clube
          </button>

          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Assinar Contrato</span>
          </button>
        </div>
      </div>
    </div>
  );
}
