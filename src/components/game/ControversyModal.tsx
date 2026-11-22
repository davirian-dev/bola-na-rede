'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ControversyOption } from '@/types/game';
import { 
  Mic, 
  Flame, 
  Sparkles, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  CheckCircle2, 
  MessageSquareQuote,
  X,
  Tv,
  ArrowRight
} from 'lucide-react';

interface ControversyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ControversyModal({ isOpen, onClose }: ControversyModalProps) {
  const pendingControversy = useGameStore((s) => s.pendingControversy);
  const answerControversy = useGameStore((s) => s.answerControversy);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);

  const [selectedOption, setSelectedOption] = useState<ControversyOption | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen || !pendingControversy) return null;

  const handleSelectOption = (opt: ControversyOption) => {
    setSelectedOption(opt);
    setShowResult(true);
    answerControversy(opt.id);
  };

  const handleFinish = () => {
    setShowResult(false);
    setSelectedOption(null);
    onClose();
  };

  const currentActorName = playerProfile?.name || managerProfile?.name || 'Craque';

  const cleanText = (str: string) => {
    return str
      .replace(/^["'“”«»]+|["'“”«»]+$/g, '') // remove qualquer aspa externa
      .replace(/""/g, '"')                    // desfaz aspas duplas duplicadas
      .trim();
  };

  const renderOptionContent = (rawText: string) => {
    let cleaned = cleanText(rawText);
    cleaned = cleaned.replace(/^["']/, '');
    const colonIdx = cleaned.indexOf(':');
    if (colonIdx !== -1) {
      const title = cleaned.substring(0, colonIdx).trim();
      const quote = cleanText(cleaned.substring(colonIdx + 1));
      return (
        <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-rose-400 transition-colors mb-2.5 leading-relaxed">
          <strong className="font-bold text-foreground">{title}:</strong>{' '}
          <span className="italic text-zinc-200">“{quote}”</span>
        </p>
      );
    }
    return (
      <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-rose-400 transition-colors mb-2.5 leading-relaxed">
        {cleaned}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border border-rose-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow decorativo de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {!showResult ? (
          <>
            {/* Topo do Modal: Badge de Coletiva */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center animate-pulse">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 block">
                    🔴 Coletiva de Imprensa Ao Vivo
                  </span>
                  <h3 className="font-display text-lg font-black text-foreground">
                    {pendingControversy.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contexto da Situação e Inspiração Real */}
            <div className="space-y-3 mb-6 overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border text-xs text-muted-foreground leading-relaxed">
                {pendingControversy.context}
              </div>

              {/* Inspiração na vida real */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{pendingControversy.realLifeInspiration}</span>
              </div>

              {/* Pergunta Ácida do Repórter */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 relative">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-rose-400 block mb-0.5 tracking-wider">
                      Pergunta do Jornalista:
                    </span>
                    <p className="text-sm font-semibold text-foreground italic leading-relaxed">
                      “{cleanText(pendingControversy.reporterQuestion)}”
                    </p>
                  </div>
                </div>
              </div>

              {/* Opções de Resposta */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase text-muted-foreground tracking-wider block">
                  Escolha como responder diante dos microfones:
                </span>

                {pendingControversy.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className="w-full p-4 rounded-2xl border border-border bg-card hover:border-rose-500 hover:bg-rose-500/5 transition-all text-left cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    {renderOptionContent(opt.text)}

                    {/* Consequências Previstas */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-black uppercase">
                      {opt.consequences.relationshipFans !== undefined && (
                        <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          opt.consequences.relationshipFans > 0
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          <Users className="w-3 h-3" />
                          Torcida {opt.consequences.relationshipFans > 0 ? `+${opt.consequences.relationshipFans}` : opt.consequences.relationshipFans}
                        </span>
                      )}

                      {opt.consequences.relationshipManager !== undefined && (
                        <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          opt.consequences.relationshipManager > 0
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          <ShieldAlert className="w-3 h-3" />
                          Técnico {opt.consequences.relationshipManager > 0 ? `+${opt.consequences.relationshipManager}` : opt.consequences.relationshipManager}
                        </span>
                      )}

                      {opt.consequences.morale !== undefined && (
                        <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          opt.consequences.morale > 0
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                        }`}>
                          <Flame className="w-3 h-3" />
                          Moral {opt.consequences.morale > 0 ? `+${opt.consequences.morale}` : opt.consequences.morale}
                        </span>
                      )}

                      {opt.consequences.reputation !== undefined && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          Fama +{opt.consequences.reputation}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* TELA DE REPERCUSSÃO DA RESPOSTA */
          <div className="space-y-6 text-center my-auto py-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-rose-500 to-amber-500 text-zinc-950 flex items-center justify-center shadow-lg shadow-rose-500/30 text-3xl">
              🗞️
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-rose-500 block mb-1">
                A Imprensa Explodiu! Manchete do Dia:
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground max-w-lg mx-auto">
                {selectedOption?.headline.replace(/Craque|Atleta/g, currentActorName)}
              </h3>
            </div>

            {/* A Frase do Craque */}
            <div className="p-4 rounded-2xl bg-secondary border border-border max-w-md mx-auto text-left">
              <span className="text-[10px] font-black uppercase text-emerald-500 block mb-1">
                Sua Declaração:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground italic leading-relaxed">
                “{cleanText(selectedOption?.quote || '')}”
              </p>
            </div>

            {/* Comentário de TV */}
            {selectedOption?.mediaCommentary && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-md mx-auto text-left flex items-start gap-2.5">
                <Tv className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-400 font-bold leading-relaxed">
                  {selectedOption.mediaCommentary}
                </p>
              </div>
            )}

            <button
              onClick={handleFinish}
              className="py-3.5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm shadow-xl shadow-emerald-500/20 inline-flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Ver Repercussão no Feed de Notícias</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
