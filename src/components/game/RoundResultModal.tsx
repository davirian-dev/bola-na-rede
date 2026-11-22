'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { ClubBadge } from '@/components/game/ClubBadge';
import { 
  Trophy, 
  Flame, 
  Award, 
  Target, 
  Mic, 
  ArrowRight, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Activity,
  Users
} from 'lucide-react';

interface RoundResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenControversy?: () => void;
}

export function RoundResultModal({
  isOpen,
  onClose,
  onOpenControversy,
}: RoundResultModalProps) {
  const lastRoundResult = useGameStore((s) => s.lastRoundResult);
  const clubs = useGameStore((s) => s.clubs);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const mode = useGameStore((s) => s.mode);
  const pendingControversy = useGameStore((s) => s.pendingControversy);
  const completedFlashMissionsLastMatch = useGameStore((s) => s.completedFlashMissionsLastMatch);
  const onFireStreak = useGameStore((s) => s.onFireStreak);

  if (!isOpen || !lastRoundResult) return null;

  const { week, userFixture, otherFixtures } = lastRoundResult;

  const homeClub = userFixture ? clubs[userFixture.homeClubId] : undefined;
  const awayClub = userFixture ? clubs[userFixture.awayClubId] : undefined;

  const isUserHome = mode === 'player'
    ? userFixture?.homeClubId === playerProfile?.clubId
    : userFixture?.homeClubId === managerProfile?.clubId;

  const userRating = (mode === 'player' && playerProfile && userFixture?.ratings)
    ? userFixture.ratings[playerProfile.id]
    : undefined;

  const userGoals = (mode === 'player' && playerProfile && userFixture?.scorers)
    ? userFixture.scorers.filter((s) => s.playerId === playerProfile.id).length
    : 0;

  const userAssists = (mode === 'player' && playerProfile && userFixture?.scorers)
    ? userFixture.scorers.filter((s) => s.assistPlayerId === playerProfile.id).length
    : 0;

  const handleGoToPress = () => {
    onClose();
    if (onOpenControversy) {
      onOpenControversy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border-2 border-emerald-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow de Fundo */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Topo do Modal */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              🏁
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Placar Oficial da Rodada
              </span>
              <h3 className="font-display text-base sm:text-lg font-black text-foreground">
                Resultados da Semana {week}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Card Principal: Partida do Seu Clube */}
          {userFixture && homeClub && awayClub ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-emerald-500/30 shadow-md space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                <span className="text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  Sua Partida • {userFixture.competition === 'sub_20' ? 'Copa Sub-20' : userFixture.competition === 'copa_brasil' ? 'Copa do Brasil' : `Série ${homeClub.division}`}
                </span>
                <span>Fim de Jogo (90')</span>
              </div>

              {/* Placar Central */}
              <div className="flex items-center justify-between gap-2 py-2">
                {/* Mandante */}
                <div className={`flex items-center gap-2.5 flex-1 ${isUserHome ? 'font-black' : ''}`}>
                  <ClubBadge
                    primaryColor={homeClub.primaryColor}
                    secondaryColor={homeClub.secondaryColor}
                    shortName={homeClub.shortName}
                    size="md"
                  />
                  <div className="truncate">
                    <span className="text-xs sm:text-sm text-foreground truncate block font-bold">
                      {homeClub.name}
                    </span>
                    {isUserHome && (
                      <span className="text-[9px] font-black text-emerald-400 uppercase">Seu Clube</span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="px-4 py-1.5 rounded-xl bg-background/80 border border-border text-center shrink-0">
                  <span className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-widest">
                    {userFixture.homeGoals ?? 0} - {userFixture.awayGoals ?? 0}
                  </span>
                </div>

                {/* Visitante */}
                <div className={`flex items-center justify-end gap-2.5 flex-1 text-right ${!isUserHome ? 'font-black' : ''}`}>
                  <div className="truncate">
                    <span className="text-xs sm:text-sm text-foreground truncate block font-bold">
                      {awayClub.name}
                    </span>
                    {!isUserHome && (
                      <span className="text-[9px] font-black text-emerald-400 uppercase">Seu Clube</span>
                    )}
                  </div>
                  <ClubBadge
                    primaryColor={awayClub.primaryColor}
                    secondaryColor={awayClub.secondaryColor}
                    shortName={awayClub.shortName}
                    size="md"
                  />
                </div>
              </div>

              {/* Gols e Lances do Jogo */}
              {userFixture.scorers && userFixture.scorers.length > 0 && (
                <div className="pt-2 border-t border-border/60">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    ⚽ Gols da Partida:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {userFixture.scorers.map((s, idx) => {
                      const isUserScorer = s.playerId === playerProfile?.id;
                      const isUserAssist = s.assistPlayerId === playerProfile?.id;
                      return (
                        <span
                          key={idx}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 font-semibold ${
                            isUserScorer
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-black'
                              : isUserAssist
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-bold'
                              : 'bg-background/60 border-border text-foreground'
                          }`}
                        >
                          ⚽ {s.minute}' {s.playerName || 'Gol'}
                          {isUserScorer && <span className="text-[9px] bg-emerald-500 text-zinc-950 px-1 rounded uppercase font-black">Você!</span>}
                          {isUserAssist && <span className="text-[9px] bg-blue-500 text-white px-1 rounded uppercase font-black">Sua Assist!</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Avaliação Individual do Atleta */}
              {mode === 'player' && playerProfile && (
                <div className="p-3 rounded-xl bg-background/60 border border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                      ⭐
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                        Sua Atuação em Campo
                      </span>
                      <span className="font-extrabold text-foreground">
                        Nota {userRating?.toFixed(1) || '7.5'} · {userGoals} gol(s) · {userAssists} assist(s)
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-[11px]">
                    +XP & Moral 🔥
                  </span>
                </div>
              )}

              {/* Bônus de Missões Relâmpago Cumpridas */}
              {completedFlashMissionsLastMatch && completedFlashMissionsLastMatch.length > 0 && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/40 space-y-2 animate-in slide-in-from-bottom duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Missões Relâmpago Cumpridas (+Recompensas Imediatas)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">
                      +{completedFlashMissionsLastMatch.length} Bônus
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {completedFlashMissionsLastMatch.map((m) => (
                      <div key={m.id} className="p-2 rounded-xl bg-background/80 border border-emerald-500/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{m.icon}</span>
                          <span className="font-bold text-foreground truncate">{m.title}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono font-black shrink-0">
                          +R$ {m.rewardMoney.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status "Em Chamas 🔥" */}
              {onFireStreak?.isOnFire && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-transparent border border-amber-500/50 flex items-center justify-between animate-in zoom-in-95">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-lg shadow-md animate-bounce">
                      🔥
                    </div>
                    <div>
                      <span className="text-xs font-black text-amber-300 block uppercase tracking-wider">
                        SEQUÊNCIA EM CHAMAS! ({onFireStreak.currentStreak} JOGOS)
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        Multiplicador de 1.5x ativado e +2 bônus em todos os atributos!
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-secondary/50 text-center text-xs text-muted-foreground">
              Seu clube folgou nesta rodada.
            </div>
          )}

          {/* Outros Jogos da Rodada */}
          {otherFixtures && otherFixtures.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Outros Resultados da Rodada:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {otherFixtures.map((fix) => {
                  const hC = clubs[fix.homeClubId];
                  const aC = clubs[fix.awayClubId];
                  if (!hC || !aC) return null;
                  return (
                    <div
                      key={fix.id}
                      className="p-2.5 rounded-xl bg-secondary/40 border border-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5 flex-1 truncate">
                        <ClubBadge
                          primaryColor={hC.primaryColor}
                          secondaryColor={hC.secondaryColor}
                          shortName={hC.shortName}
                          size="sm"
                        />
                        <span className="truncate text-foreground font-semibold">
                          {hC.shortName}
                        </span>
                      </div>

                      <span className="font-mono font-black text-foreground px-2 py-0.5 rounded bg-background/80 border border-border shrink-0">
                        {fix.homeGoals ?? 0} - {fix.awayGoals ?? 0}
                      </span>

                      <div className="flex items-center justify-end gap-1.5 flex-1 truncate text-right">
                        <span className="truncate text-foreground font-semibold">
                          {aC.shortName}
                        </span>
                        <ClubBadge
                          primaryColor={aC.primaryColor}
                          secondaryColor={aC.secondaryColor}
                          shortName={aC.shortName}
                          size="sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé: Botão de Avanço para Coletiva */}
        <div className="pt-3 mt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            Tabelas e artilharias foram atualizadas automaticamente.
          </p>

          {pendingControversy ? (
            <button
              onClick={handleGoToPress}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              Ir para Coletiva Pós-Jogo 🎙️
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              Continuar Semana
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}