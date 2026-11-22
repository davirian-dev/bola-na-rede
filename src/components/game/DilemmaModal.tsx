'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { DilemmaEvent, DilemmaOption } from '@/types/game';
import { 
  MessageSquare, 
  Users, 
  HeartHandshake, 
  Building2, 
  DollarSign, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  ArrowRight,
  Flame,
  Shield,
  HelpCircle
} from 'lucide-react';

interface DilemmaModalProps {
  isOpen: boolean;
  dilemma?: DilemmaEvent | null;
  onClose: () => void;
}

export const DilemmaModal: React.FC<DilemmaModalProps> = ({
  isOpen,
  dilemma,
  onClose,
}) => {
  const answerDilemma = useGameStore((s) => s.answerDilemma);
  const [selectedOption, setSelectedOption] = useState<DilemmaOption | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !dilemma) return null;

  const handleSelect = (option: DilemmaOption) => {
    if (confirmed) return;
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;
    setConfirmed(true);

    setTimeout(() => {
      answerDilemma(dilemma.id, selectedOption.id);
      setConfirmed(false);
      setSelectedOption(null);
      onClose();
    }, 1100);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'press_conference':
        return { label: 'Coletiva de Imprensa', icon: <MessageSquare className="w-3.5 h-3.5 text-blue-400" />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'locker_room':
        return { label: 'Vestiário & Elenco', icon: <Users className="w-3.5 h-3.5 text-emerald-400" />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'board_room':
        return { label: 'Reunião de Diretoria', icon: <Building2 className="w-3.5 h-3.5 text-amber-400" />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'lifestyle_family':
        return { label: 'Vida Pessoal & Família', icon: <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />, color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'sponsor_commercial':
        return { label: 'Contrato & Patrocinadores', icon: <DollarSign className="w-3.5 h-3.5 text-yellow-400" />, color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
      default:
        return { label: 'Dilema de Carreira', icon: <HelpCircle className="w-3.5 h-3.5 text-purple-400" />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    }
  };

  const badge = getCategoryBadge(dilemma.category);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-950 border-2 border-emerald-500/30 rounded-3xl shadow-2xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Categoria */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>

          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Decisão de Carreira
          </span>
        </div>

        {/* Título & Interlocutor */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-white font-display leading-tight mb-2">
            {dilemma.title}
          </h2>
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-300 leading-relaxed">
            <span className="font-bold text-emerald-400 mr-1.5">
              {dilemma.speaker || 'Interlocutor'}:
            </span>
            &ldquo;{dilemma.description || dilemma.situation}&rdquo;
          </div>
        </div>

        {/* Opções de Resposta */}
        <div className="space-y-2.5 overflow-y-auto pr-1 my-2 flex-1">
          {dilemma.options.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            const c = opt.consequences;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt)}
                disabled={confirmed}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold leading-snug">
                    {opt.text}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Badges de Impacto (Consequências Coloridas) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-bold">
                  {/* Jogador */}
                  {c.coachTrust !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md ${c.coachTrust >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Técnico {c.coachTrust >= 0 ? `+${c.coachTrust}` : c.coachTrust}
                    </span>
                  )}
                  {c.fanApproval !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md ${c.fanApproval >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Torcida {c.fanApproval >= 0 ? `+${c.fanApproval}` : c.fanApproval}
                    </span>
                  )}
                  {c.squadChemistry !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md ${c.squadChemistry >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Elenco {c.squadChemistry >= 0 ? `+${c.squadChemistry}` : c.squadChemistry}
                    </span>
                  )}
                  {c.familyHappiness !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md ${c.familyHappiness >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Família {c.familyHappiness >= 0 ? `+${c.familyHappiness}` : c.familyHappiness}
                    </span>
                  )}

                  {/* Treinador */}
                  {c.boardTrust !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md ${c.boardTrust >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Diretoria {c.boardTrust >= 0 ? `+${c.boardTrust}` : c.boardTrust}
                    </span>
                  )}
                  {c.squadMorale !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md ${c.squadMorale >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Moral {c.squadMorale >= 0 ? `+${c.squadMorale}` : c.squadMorale}
                    </span>
                  )}
                  {c.mediaReputation !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md ${c.mediaReputation >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Imprensa {c.mediaReputation >= 0 ? `+${c.mediaReputation}` : c.mediaReputation}
                    </span>
                  )}

                  {/* Dinheiro & Energia */}
                  {c.moneyChange !== undefined && c.moneyChange !== 0 && (
                    <span className={`px-2 py-0.5 rounded-md ${c.moneyChange > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {c.moneyChange > 0 ? `+R$ ${c.moneyChange.toLocaleString('pt-BR')}` : `-R$ ${Math.abs(c.moneyChange).toLocaleString('pt-BR')}`}
                    </span>
                  )}
                  {c.energyChange !== undefined && c.energyChange !== 0 && (
                    <span className={`px-2 py-0.5 rounded-md ${c.energyChange > 0 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      Energia {c.energyChange > 0 ? `+${c.energyChange}%` : `${c.energyChange}%`}
                    </span>
                  )}

                  {/* Bônus de Partida */}
                  {c.tempMatchBonus && c.tempMatchBonus > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      +{c.tempMatchBonus} no Próximo Jogo
                    </span>
                  )}

                  {/* Banco de Reservas */}
                  {c.benched && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Risco de Banco
                    </span>
                  )}

                  {/* Polêmica / Manchete */}
                  {(opt.tone === 'cocky' || opt.tone === 'aggressive' || !!c.newsHeadline) && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Vira Manchete
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Rodapé / Ação */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
          {confirmed ? (
            <div className="w-full py-3 px-4 rounded-xl bg-emerald-500 text-zinc-950 font-black text-sm text-center flex items-center justify-center gap-2 animate-in zoom-in-95">
              <Check className="w-5 h-5 stroke-[3]" />
              Decisão Registrada com Consequências Reais!
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedOption}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <span>Confirmar Escolha</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
