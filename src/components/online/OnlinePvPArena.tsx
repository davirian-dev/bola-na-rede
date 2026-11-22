'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { NSSPenaltyMinigame } from '@/components/game/NSSPenaltyMinigame';
import { ClubBadge } from '@/components/game/ClubBadge';
import { sound } from '@/lib/soundEffects';
import { 
  Swords, 
  Shield, 
  Zap, 
  Trophy, 
  RotateCcw, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Users, 
  Sparkles,
  ArrowRight,
  Crown,
  Share2
} from 'lucide-react';

interface OpponentData {
  id: string;
  name: string;
  clubName: string;
  clubShortName: string;
  primaryColor: string;
  secondaryColor: string;
  overall: number;
  elo: number;
  division: string;
  avatarIcon: string;
}

const OPPONENT_POOL: OpponentData[] = [
  {
    id: 'opp-1',
    name: 'Lucas "Muralha" Silva',
    clubName: 'Flamengo',
    clubShortName: 'FLA',
    primaryColor: '#c8102e',
    secondaryColor: '#000000',
    overall: 78,
    elo: 1240,
    division: 'Prata',
    avatarIcon: '⚡',
  },
  {
    id: 'opp-2',
    name: 'Gabriel "Fenômeno" Santos',
    clubName: 'Palmeiras',
    clubShortName: 'PAL',
    primaryColor: '#006437',
    secondaryColor: '#ffffff',
    overall: 82,
    elo: 1390,
    division: 'Ouro',
    avatarIcon: '🎯',
  },
  {
    id: 'opp-3',
    name: 'Matheus "Canhota de Ouro"',
    clubName: 'Corinthians',
    clubShortName: 'COR',
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    overall: 75,
    elo: 1180,
    division: 'Prata',
    avatarIcon: '🔥',
  },
  {
    id: 'opp-4',
    name: 'Arthur Antunes (Craque)',
    clubName: 'São Paulo',
    clubShortName: 'SAO',
    primaryColor: '#e11d48',
    secondaryColor: '#000000',
    overall: 85,
    elo: 1520,
    division: 'Diamante',
    avatarIcon: '👑',
  },
  {
    id: 'opp-5',
    name: 'Rodrigo "Raio" Costa',
    clubName: 'Santos',
    clubShortName: 'SAN',
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    overall: 79,
    elo: 1290,
    division: 'Prata',
    avatarIcon: '⚽',
  },
  {
    id: 'opp-6',
    name: 'Thiago "Frieza" Ribeiro',
    clubName: 'Grêmio',
    clubShortName: 'GRE',
    primaryColor: '#0d85c8',
    secondaryColor: '#000000',
    overall: 77,
    elo: 1210,
    division: 'Prata',
    avatarIcon: '❄️',
  },
];

export function OnlinePvPArena() {
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const clubs = useGameStore((s) => s.clubs);
  const onlineStats = useGameStore((s) => s.onlineStats) || {
    elo: 1200,
    division: 'Prata',
    wins: 0,
    losses: 0,
    draws: 0,
  };
  const recordOnlineMatchResult = useGameStore((s) => s.recordOnlineMatchResult);

  // Estados do Matchmaking e Duelo
  type ArenaState = 'idle' | 'searching' | 'match_found' | 'in_match' | 'match_result';
  const [arenaState, setArenaState] = useState<ArenaState>('idle');
  const [matchType, setMatchType] = useState<'penalties' | 'tactical'>('penalties');
  const [searchTimer, setSearchTimer] = useState<number>(0);
  const [currentOpponent, setCurrentOpponent] = useState<OpponentData | null>(null);

  // Estados do Duelo de Pênaltis Online (5 cobranças)
  // round: 0 a 4 (cada rodada tem chute do usuário e chute do rival)
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [turn, setTurn] = useState<'user_shooting' | 'user_goalkeeping'>('user_shooting');
  const [userScoreBoard, setUserScoreBoard] = useState<('goal' | 'miss' | 'pending')[]>(['pending', 'pending', 'pending', 'pending', 'pending']);
  const [oppScoreBoard, setOppScoreBoard] = useState<('goal' | 'miss' | 'pending')[]>(['pending', 'pending', 'pending', 'pending', 'pending']);
  const [lastEventText, setLastEventText] = useState<string>('Prepare-se para cobrar o 1º pênalti!');
  const [keeperChoice, setKeeperChoice] = useState<'left' | 'center' | 'right' | null>(null);
  const [keeperDefending, setKeeperDefending] = useState<boolean>(false);
  const [matchResultData, setMatchResultData] = useState<{
    result: 'win' | 'loss' | 'draw';
    userGoals: number;
    oppGoals: number;
    eloChange: number;
    newElo: number;
  } | null>(null);

  // Dados do usuário
  const userActorName = mode === 'player' 
    ? (playerProfile?.name || 'Seu Atleta') 
    : (managerProfile?.name || 'Seu Treinador');
  const userClub = mode === 'player' 
    ? (playerProfile?.clubId ? clubs[playerProfile.clubId] : clubs['fla'])
    : (managerProfile?.clubId ? clubs[managerProfile.clubId] : clubs['pal']);
  const userRating = mode === 'player' ? (playerProfile?.overall || 65) : 75;

  // Timer de Matchmaking com cleanup robusto
  useEffect(() => {
    if (arenaState !== 'searching') {
      setSearchTimer(0);
      return;
    }

    let seconds = 0;
    const interval = setInterval(() => {
      seconds += 1;
      setSearchTimer(seconds);

      if (seconds >= 3) {
        clearInterval(interval);
        const randomOpp = OPPONENT_POOL[Math.floor(Math.random() * OPPONENT_POOL.length)];
        setCurrentOpponent(randomOpp);
        setArenaState('match_found');
        sound.playWhistle();
        setTimeout(() => {
          startMatch(randomOpp);
        }, 2200);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [arenaState]);

  const handleStartSearch = (type: 'penalties' | 'tactical') => {
    setMatchType(type);
    setArenaState('searching');
    sound.playWhistle();
  };

  const handleCancelSearch = () => {
    setArenaState('idle');
  };

  const startMatch = (opp: OpponentData) => {
    setCurrentOpponent(opp);
    setCurrentRound(0);
    setTurn('user_shooting');
    setUserScoreBoard(['pending', 'pending', 'pending', 'pending', 'pending']);
    setOppScoreBoard(['pending', 'pending', 'pending', 'pending', 'pending']);
    setLastEventText(`⚔️ Duelo Iniciado! Você cobra a 1ª bola parada contra ${opp.name}!`);
    setMatchResultData(null);
    setArenaState('in_match');
  };

  // 1. Quando o usuário chuta no minigame (sucesso)
  const handleUserScoreGoal = () => {
    const updatedUser = [...userScoreBoard];
    updatedUser[currentRound] = 'goal';
    setUserScoreBoard(updatedUser);
    setLastEventText(`⚽ GOLAÇO! Você converteu a cobrança com categoria no ângulo!`);

    setTimeout(() => {
      // Passa a vez para o rival chutar (usuário no gol)
      setTurn('user_goalkeeping');
      setKeeperChoice(null);
      setKeeperDefending(false);
      setLastEventText(`🧤 Sua vez no gol! ${currentOpponent?.name} vai cobrar. Escolha um canto para pular!`);
    }, 1200);
  };

  // 2. Quando o usuário erra o chute
  const handleUserMissGoal = () => {
    const updatedUser = [...userScoreBoard];
    updatedUser[currentRound] = 'miss';
    setUserScoreBoard(updatedUser);
    setLastEventText(`❌ PERDEU! O goleiro adversário defendeu a cobrança!`);

    setTimeout(() => {
      setTurn('user_goalkeeping');
      setKeeperChoice(null);
      setKeeperDefending(false);
      setLastEventText(`🧤 Sua vez no gol! ${currentOpponent?.name} vai cobrar. Escolha um canto para pular!`);
    }, 1200);
  };

  // 3. Quando o adversário cobra e o usuário escolhe o canto do pulo
  const handleKeeperDive = (side: 'left' | 'center' | 'right') => {
    if (keeperDefending) return;
    setKeeperChoice(side);
    setKeeperDefending(true);

    // O adversário chuta em um lado
    const oppSides: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
    const oppSide = oppSides[Math.floor(Math.random() * oppSides.length)];
    const oppScores = oppSide !== side;

    setTimeout(() => {
      const updatedOpp = [...oppScoreBoard];
      if (oppScores) {
        updatedOpp[currentRound] = 'goal';
        setOppScoreBoard(updatedOpp);
        setLastEventText(`⚽ GOL DO ADVERSÁRIO! ${currentOpponent?.name} bateu no canto oposto!`);
        sound.playKick();
      } else {
        updatedOpp[currentRound] = 'miss';
        setOppScoreBoard(updatedOpp);
        setLastEventText(`🧤 DEFESAAAAÇA! Você acertou o canto e espalmou a cobrança de ${currentOpponent?.name}!`);
        sound.playWoodwork();
      }

      // Verifica se encerrou o duelo ou passa para a próxima rodada
      setTimeout(() => {
        if (currentRound >= 4) {
          // Fim do Duelo!
          finalizeMatch(userScoreBoard, updatedOpp);
        } else {
          setCurrentRound((r) => r + 1);
          setTurn('user_shooting');
          setKeeperDefending(false);
          setKeeperChoice(null);
          setLastEventText(`Rodada ${currentRound + 2} de 5 • Sua vez de bater a bola parada!`);
        }
      }, 1500);
    }, 800);
  };

  // Finalização do Duelo Online
  const finalizeMatch = (
    userBoard: ('goal' | 'miss' | 'pending')[], 
    oppBoard: ('goal' | 'miss' | 'pending')[]
  ) => {
    const userGoals = userBoard.filter((b) => b === 'goal').length;
    const oppGoals = oppBoard.filter((b) => b === 'goal').length;

    let result: 'win' | 'loss' | 'draw' = 'draw';
    if (userGoals > oppGoals) result = 'win';
    else if (userGoals < oppGoals) result = 'loss';

    const oppName = currentOpponent?.name || 'Rival Online';
    const oppClubName = currentOpponent?.clubName || 'Clube Rival';
    const scoreStr = `${userGoals} x ${oppGoals}`;

    const { eloChange, newElo } = recordOnlineMatchResult(result, oppName, oppClubName, scoreStr);

    if (result === 'win') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      sound.playGoal();
    } else {
      sound.playWhistle();
    }

    setMatchResultData({
      result,
      userGoals,
      oppGoals,
      eloChange,
      newElo,
    });
    setArenaState('match_result');
  };

  return (
    <div className="space-y-6">
      {/* 1. TELA IDLE: ESCOLHA DO MODO DE DUELO */}
      {arenaState === 'idle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Duelo de Bolas Paradas & Pênaltis X1 */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-card via-card to-emerald-950/20 border-2 border-emerald-500/40 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  X1 Interativo • Tempo Real
                </span>
                <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  +35 ELO por Vitória
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-black text-foreground">
                Duelo de Bola Parada (X1 PvP)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Disputa de 5 cobranças alternadas. Use mira, força e o <strong>novo ponto de impacto com efeito na bola</strong> contra jogadores reais do Brasil!
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleStartSearch('penalties')}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
              >
                <Swords className="w-4 h-4 fill-current" />
                Buscar Partida Rápida Online
              </button>
            </div>
          </div>

          {/* Card 2: Duelo Tático de Elencos (11x11) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-card via-card to-blue-950/20 border border-border shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Simulação Tática
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  Seu Elenco vs Comunidade
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-black text-foreground">
                Amistoso Tático de Clubes
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Coloque sua escalação tática, entrosamento e os 11 titulares do seu clube para enfrentar elencos montados por outros treinadores da comunidade.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleStartSearch('tactical')}
                className="w-full py-3.5 px-6 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-border transition-transform active:scale-95 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Desafiar Elenco da Comunidade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TELA DE BUSCA / MATCHMAKING */}
      {arenaState === 'searching' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-card border-2 border-emerald-500/40 shadow-2xl text-center space-y-6 max-w-lg mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />

          {/* Radar Animado */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping duration-1000" />
            <div className="absolute inset-2 rounded-full border border-emerald-500/40 animate-spin duration-700" />
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">
              <Swords className="w-8 h-8 animate-bounce" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
              Servidor Central Brasil • Supabase Matchmaking
            </span>
            <h3 className="font-display text-2xl font-black text-foreground">
              Buscando Adversário na Fila...
            </h3>
            <p className="text-xs text-muted-foreground">
              Tempo de busca: <span className="font-mono text-emerald-400 font-bold">{searchTimer}s</span> • Pareando pelo seu ELO ({onlineStats.elo} Pts)
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancelSearch}
            className="py-2.5 px-6 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancelar Busca
          </button>
        </div>
      )}

      {/* 3. TELA DE ADVERSÁRIO ENCONTRADO */}
      {arenaState === 'match_found' && currentOpponent && (
        <div className="p-6 sm:p-10 rounded-3xl bg-card border-2 border-emerald-500 shadow-2xl text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95 duration-200">
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500 text-zinc-950 inline-block shadow-md">
            ADVERSÁRIO ENCONTRADO! ⚽
          </span>

          {/* Versus Visual */}
          <div className="flex items-center justify-between gap-4 py-4 border-y border-border">
            {/* Você */}
            <div className="flex-1 text-center space-y-1">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-md">
                ⭐
              </div>
              <h4 className="font-display font-black text-sm text-foreground truncate">{userActorName}</h4>
              <span className="text-[11px] text-muted-foreground block truncate">{userClub?.name}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ELO {onlineStats.elo}</span>
            </div>

            {/* VS */}
            <div className="w-12 h-12 rounded-full bg-secondary text-foreground font-display font-black text-sm flex items-center justify-center shrink-0 border border-border shadow-inner">
              VS
            </div>

            {/* Adversário */}
            <div className="flex-1 text-center space-y-1">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl shadow-md">
                {currentOpponent.avatarIcon}
              </div>
              <h4 className="font-display font-black text-sm text-foreground truncate">{currentOpponent.name}</h4>
              <span className="text-[11px] text-muted-foreground block truncate">{currentOpponent.clubName}</span>
              <span className="text-[10px] font-mono text-rose-400 font-bold">ELO {currentOpponent.elo}</span>
            </div>
          </div>

          <p className="text-xs font-semibold text-emerald-400 animate-pulse">
            Carregando gramado e bolas paradas...
          </p>
        </div>
      )}

      {/* 4. PARTIDA AO VIVO: DUELO DE PÊNALTIS (5 COBRANÇAS) */}
      {arenaState === 'in_match' && currentOpponent && (
        <div className="space-y-4">
          {/* Placar Oficial de Pênaltis estilo Copa do Mundo */}
          <div className="p-4 sm:p-5 rounded-2xl bg-card border-2 border-emerald-500/40 shadow-xl flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-emerald-400">
                  Arena Online • Rodada {currentRound + 1} de 5
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                {turn === 'user_shooting' ? '🎯 SEU TURNO DE CHUTAR' : '🧤 SEU TURNO NO GOL'}
              </span>
            </div>

            {/* Linha das Cobranças */}
            <div className="grid grid-cols-2 gap-4">
              {/* Você */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-foreground truncate">{userActorName} (Você)</span>
                  <span className="text-emerald-400 font-black font-mono">
                    {userScoreBoard.filter((b) => b === 'goal').length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {userScoreBoard.map((st, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                        st === 'goal'
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                          : st === 'miss'
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                    >
                      {st === 'goal' ? '✓' : st === 'miss' ? '✕' : idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Adversário */}
              <div className="space-y-1.5 border-l border-border pl-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-foreground truncate">{currentOpponent.name}</span>
                  <span className="text-rose-400 font-black font-mono">
                    {oppScoreBoard.filter((b) => b === 'goal').length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {oppScoreBoard.map((st, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                        st === 'goal'
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                          : st === 'miss'
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                    >
                      {st === 'goal' ? '✓' : st === 'miss' ? '✕' : idx + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Texto de Narração do Último Lance */}
            <div className="px-3 py-1.5 rounded-xl bg-secondary/60 text-xs font-semibold text-center text-foreground">
              {lastEventText}
            </div>
          </div>

          {/* TURNO 1: VOCÊ CHUTA (Minijogo com Ponto de Impacto na Bola) */}
          {turn === 'user_shooting' && (
            <NSSPenaltyMinigame
              mode="match_clutch"
              matchInfo={{
                minute: currentRound + 1,
                oppClubName: currentOpponent.clubName,
                currentScore: `${userScoreBoard.filter((b) => b === 'goal').length} x ${oppScoreBoard.filter((b) => b === 'goal').length}`,
              }}
              onScoreGoal={handleUserScoreGoal}
              onMiss={handleUserMissGoal}
            />
          )}

          {/* TURNO 2: VOCÊ NO GOL (Escolha o canto para pular) */}
          {turn === 'user_goalkeeping' && (
            <div className="p-6 rounded-3xl bg-card border-2 border-blue-500/40 shadow-xl space-y-5 text-center max-w-lg mx-auto">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block">
                  Defesa de Pênalti • Rodada {currentRound + 1}
                </span>
                <h3 className="font-display text-xl font-black text-foreground">
                  {currentOpponent.name} na Marca da Cal!
                </h3>
                <p className="text-xs text-muted-foreground">
                  O adversário está ajeitando a bola. Escolha o canto para onde o seu goleiro vai se atirar!
                </p>
              </div>

              {/* Botões dos 3 Cantos do Gol */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={keeperDefending}
                  onClick={() => handleKeeperDive('left')}
                  className={`py-6 px-3 rounded-2xl font-black text-xs uppercase flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer ${
                    keeperChoice === 'left'
                      ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground border-border'
                  }`}
                >
                  <span className="text-2xl">🧤⬅️</span>
                  <span>Canto Esquerdo</span>
                </button>

                <button
                  type="button"
                  disabled={keeperDefending}
                  onClick={() => handleKeeperDive('center')}
                  className={`py-6 px-3 rounded-2xl font-black text-xs uppercase flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer ${
                    keeperChoice === 'center'
                      ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground border-border'
                  }`}
                >
                  <span className="text-2xl">🧤⬆️</span>
                  <span>Ficar no Meio</span>
                </button>

                <button
                  type="button"
                  disabled={keeperDefending}
                  onClick={() => handleKeeperDive('right')}
                  className={`py-6 px-3 rounded-2xl font-black text-xs uppercase flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer ${
                    keeperChoice === 'right'
                      ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground border-border'
                  }`}
                >
                  <span className="text-2xl">➡️🧤</span>
                  <span>Canto Direito</span>
                </button>
              </div>

              {keeperDefending && (
                <p className="text-xs font-bold text-blue-400 animate-pulse">
                  O batedor correu para a bola...
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. TELA DE RESULTADO DO DUELO */}
      {arenaState === 'match_result' && matchResultData && currentOpponent && (
        <div className="p-8 sm:p-10 rounded-3xl bg-card border-2 border-emerald-500/50 shadow-2xl text-center space-y-6 max-w-lg mx-auto animate-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              matchResultData.result === 'win'
                ? 'bg-emerald-500 text-zinc-950'
                : matchResultData.result === 'loss'
                ? 'bg-rose-500 text-white'
                : 'bg-amber-500 text-zinc-950'
            }`}>
              {matchResultData.result === 'win' ? 'VITÓRIA ÉPICA! 🏆' : matchResultData.result === 'loss' ? 'DERROTA NO X1 ❌' : 'EMPATE! ⚖️'}
            </span>

            <h3 className="font-display text-3xl font-black text-foreground">
              {matchResultData.userGoals} x {matchResultData.oppGoals}
            </h3>

            <p className="text-xs text-muted-foreground">
              {matchResultData.result === 'win' 
                ? `Você superou ${currentOpponent.name} com maestria nas cobranças decisivas!`
                : `Foi por pouco! ${currentOpponent.name} levou a melhor nos pênaltis.`}
            </p>
          </div>

          {/* Recompensas & Variação de ELO */}
          <div className="p-4 rounded-2xl bg-secondary/60 border border-border grid grid-cols-2 gap-3 text-left">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-black block">Pontos de ELO</span>
              <span className={`font-mono font-black text-base sm:text-lg ${matchResultData.eloChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {matchResultData.eloChange > 0 ? `+${matchResultData.eloChange}` : matchResultData.eloChange} Pts
              </span>
              <span className="text-[10px] text-muted-foreground block">Novo ELO: {matchResultData.newElo}</span>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-black block">Premiação do Duelo</span>
              <span className="font-mono font-black text-base sm:text-lg text-amber-400">
                {matchResultData.result === 'win' ? '+R$ 2.500' : 'R$ 0'}
              </span>
              <span className="text-[10px] text-muted-foreground block">Moral: {matchResultData.result === 'win' ? '+10' : '0'}</span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => handleStartSearch('penalties')}
              className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Jogar Outro X1
            </button>

            <button
              type="button"
              onClick={() => setArenaState('idle')}
              className="w-full py-3 px-6 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Voltar ao Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
}