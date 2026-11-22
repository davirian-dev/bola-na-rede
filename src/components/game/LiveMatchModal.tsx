'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { Club, Fixture, TacticalFormation } from '@/types/game';
import { ClubBadge } from '@/components/game/ClubBadge';
import { NSSPenaltyMinigame } from '@/components/game/NSSPenaltyMinigame';
import { NSSPassMinigame } from '@/components/game/NSSPassMinigame';
import { DribbleMinigame } from '@/components/match/DribbleMinigame';
import { TacticalBoardMinigame } from '@/components/manager/TacticalBoardMinigame';
import { ManagerSpeechMinigame } from '@/components/manager/ManagerSpeechMinigame';
import { 
  Play, 
  Pause, 
  FastForward, 
  Trophy, 
  Flame, 
  Target, 
  Zap, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Users,
  Shield,
  Activity,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LiveMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: Fixture;
  homeClub: Club;
  awayClub: Club;
  onFinishMatch: (result: {
    homeScore: number;
    awayScore: number;
    scorers: { playerId: string; minute: number; assistPlayerId?: string; playerName?: string; assistPlayerName?: string }[];
    ratings: Record<string, number>;
    mvpPlayerId: string;
  }) => void;
}

interface MatchComment {
  minute: number;
  text: string;
  type: 'goal' | 'chance' | 'card' | 'normal';
}

export function LiveMatchModal({
  isOpen,
  onClose,
  fixture,
  homeClub,
  awayClub,
  onFinishMatch,
}: LiveMatchModalProps) {
  const mode = useGameStore((s) => s.mode);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const drinkEnergyCan = useGameStore((s) => s.drinkEnergyCan);

  // Estados do Placar e Cronômetro
  const [minute, setMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(350); // ms por minuto
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [scorers, setScorers] = useState<{ playerId: string; name: string; minute: number; assistPlayerId?: string; assistPlayerName?: string }[]>([]);
  const [comments, setComments] = useState<MatchComment[]>([
    { minute: 0, text: 'Bola rolando! Início de partida com grande público no estádio!', type: 'normal' }
  ]);
  const [isFinished, setIsFinished] = useState(false);

  // Estados dos Momentos Decisivos (New Star Soccer & RPG)
  const [activeMoment, setActiveMoment] = useState<'none' | 'penalty_minigame' | 'pass_minigame' | 'dribble_minigame' | 'rpg_decision'>('none');
  const [momentResolved, setMomentResolved] = useState(false);

  // Estados Táticos (Modo Treinador e Jogador)
  type TacticPosture = 'attacking' | 'balanced' | 'defensive' | 'counter' | 'possession';
  const [tacticPosture, setTacticPosture] = useState<TacticPosture>('balanced');
  const [hasSubstituted, setHasSubstituted] = useState(false);

  // Estados de Substituição (Até 5 substituições na partida)
  const [subsLeft, setSubsLeft] = useState(5);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subOutPlayerId, setSubOutPlayerId] = useState<string | null>(null);
  const [subInPlayerId, setSubInPlayerId] = useState<string | null>(null);

  // Radar 2D de Campo em Canvas2D
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballPosRef = useRef({ x: 160, y: 75, targetX: 160, targetY: 75 });
  const [viewTab, setViewTab] = useState<'radar' | 'lineups'>('radar');

  // Estatísticas de Impedimento e VAR
  const [homeOffsides, setHomeOffsides] = useState(0);
  const [awayOffsides, setAwayOffsides] = useState(0);
  const [varReviewBanner, setVarReviewBanner] = useState<string | null>(null);

  // Nível de Esforço do Atleta (1: Cadenciado, 2: Equilibrado, 3: Sangue no Olho)
  const [effortLevel, setEffortLevel] = useState<1 | 2 | 3>(2);
  const [userInjuredInMatch, setUserInjuredInMatch] = useState(false);
  const [uniformKit, setUniformKit] = useState<'home' | 'away'>('home');

  // Minijogos de Intervalo do Treinador
  const [isHalfTimeSpeechOpen, setIsHalfTimeSpeechOpen] = useState(false);
  const [isHalfTimeBoardOpen, setIsHalfTimeBoardOpen] = useState(false);
  const [halfTimeActionDone, setHalfTimeActionDone] = useState(false);

  // Estatísticas Globais da Partida para o Pós-Jogo
  const [matchStats] = useState({
    possessionHome: Math.floor(Math.random() * 12) + 48,
    shotsHome: Math.floor(Math.random() * 8) + 9,
    shotsAway: Math.floor(Math.random() * 7) + 6,
    shotsOnTargetHome: Math.floor(Math.random() * 4) + 4,
    shotsOnTargetAway: Math.floor(Math.random() * 3) + 3,
    passesAccHome: Math.floor(Math.random() * 8) + 81,
    passesAccAway: Math.floor(Math.random() * 8) + 76,
    foulsHome: Math.floor(Math.random() * 6) + 8,
    foulsAway: Math.floor(Math.random() * 6) + 9,
    cornersHome: Math.floor(Math.random() * 5) + 3,
    cornersAway: Math.floor(Math.random() * 4) + 2,
  });

  const isUserHome = mode === 'player' 
    ? playerProfile?.clubId === homeClub.id 
    : managerProfile?.clubId === homeClub.id;

  const isUserAway = mode === 'player'
    ? playerProfile?.clubId === awayClub.id
    : managerProfile?.clubId === awayClub.id;

  const userActorName = mode === 'player' 
    ? (playerProfile?.nickname || playerProfile?.name || 'Craque') 
    : (managerProfile?.name || 'Professor');

  const userClub = isUserHome ? homeClub : awayClub;

  // Escalações Titulares 11x11 e Banco de Reservas
  const isYouthMatch = fixture.competition === 'sub_20';
  const rawHomeRoster = (isYouthMatch ? homeClub.youthRoster : homeClub.roster) || [];
  const rawAwayRoster = (isYouthMatch ? awayClub.youthRoster : awayClub.roster) || [];

  const initialHomeStarters = rawHomeRoster.slice(0, 11).map((p, idx) => {
    if (mode === 'player' && playerProfile && isUserHome && idx === 10) {
      return {
        id: playerProfile.id,
        name: playerProfile.name,
        position: playerProfile.position,
        overall: playerProfile.overall,
        number: playerProfile.jerseyNumber || 10,
        isUser: true,
        isCaptain: Boolean(playerProfile.isCaptain || (homeClub.captainPlayerId === playerProfile.id)),
        isPenalty: Boolean(playerProfile.isPenaltyTaker || (homeClub.penaltyTakerPlayerId === playerProfile.id)),
        isFreeKick: Boolean(playerProfile.isFreeKickTaker || (homeClub.freeKickTakerPlayerId === playerProfile.id)),
      };
    }
    return {
      id: p.id,
      name: p.name,
      position: p.position,
      overall: p.overall,
      number: idx + 1,
      isUser: false,
      isCaptain: Boolean((homeClub.captainPlayerId || rawHomeRoster[0]?.id) === p.id),
      isPenalty: Boolean((homeClub.penaltyTakerPlayerId || rawHomeRoster[10]?.id) === p.id),
      isFreeKick: Boolean((homeClub.freeKickTakerPlayerId || rawHomeRoster[9]?.id) === p.id),
    };
  });

  const initialAwayStarters = rawAwayRoster.slice(0, 11).map((p, idx) => {
    if (mode === 'player' && playerProfile && isUserAway && idx === 10) {
      return {
        id: playerProfile.id,
        name: playerProfile.name,
        position: playerProfile.position,
        overall: playerProfile.overall,
        number: playerProfile.jerseyNumber || 10,
        isUser: true,
        isCaptain: Boolean(playerProfile.isCaptain || (awayClub.captainPlayerId === playerProfile.id)),
        isPenalty: Boolean(playerProfile.isPenaltyTaker || (awayClub.penaltyTakerPlayerId === playerProfile.id)),
        isFreeKick: Boolean(playerProfile.isFreeKickTaker || (awayClub.freeKickTakerPlayerId === playerProfile.id)),
      };
    }
    return {
      id: p.id,
      name: p.name,
      position: p.position,
      overall: p.overall,
      number: idx + 1,
      isUser: false,
      isCaptain: Boolean((awayClub.captainPlayerId || rawAwayRoster[0]?.id) === p.id),
      isPenalty: Boolean((awayClub.penaltyTakerPlayerId || rawAwayRoster[10]?.id) === p.id),
      isFreeKick: Boolean((awayClub.freeKickTakerPlayerId || rawAwayRoster[9]?.id) === p.id),
    };
  });

  const [homeLineup, setHomeLineup] = useState(initialHomeStarters);
  const [awayLineup, setAwayLineup] = useState(initialAwayStarters);
  const [homeBench, setHomeBench] = useState(rawHomeRoster.slice(11, 22));
  const [awayBench, setAwayBench] = useState(rawAwayRoster.slice(11, 22));

  // Loop do Cronômetro da Partida
  useEffect(() => {
    if (!isOpen || !isPlaying || isFinished || activeMoment !== 'none') return;

    const timer = setInterval(() => {
      setMinute((prev) => {
        const nextMin = prev + 1;

        // Disparo do Momento Decisivo no Modo Jogador baseado no Nível de Esforço
        const triggerMinutes = effortLevel === 1 
          ? [62] 
          : effortLevel === 2 
          ? [35, 74] 
          : [20, 38, 64, 82];

        if (mode === 'player' && !userInjuredInMatch && triggerMinutes.includes(nextMin)) {
          setIsPlaying(false);

          // Risco de Lesão Muscular no Esforço 3 (Intensidade Máxima)
          if (effortLevel === 3 && Math.random() < 0.12) {
            setUserInjuredInMatch(true);
            setComments((c) => [
              { minute: nextMin, text: `🏥 LESÃO MUSCULAR! A intensidade extrema causou uma fisgada forte na coxa de ${userActorName}! O atleta sai de maca!`, type: 'card' },
              ...c,
            ]);
            if (playerProfile) {
              useGameStore.setState({
                playerProfile: {
                  ...playerProfile,
                  energy: Math.max(10, playerProfile.energy - 40),
                  isInjured: true,
                  injuryWeeks: Math.floor(Math.random() * 3) + 2,
                },
              });
            }
            return nextMin;
          }

          // Abre a Decisão Tática do Craque (RPG Choice)
          setActiveMoment('rpg_decision');
          setComments((c) => [
            { minute: nextMin, text: `🚨 OPORTUNIDADE DECISIVA! A bola chega limpa para ${userActorName}! Qual será a sua decisão?`, type: 'chance' },
            ...c,
          ]);
          return nextMin;
        }

        // Lances e Gols Automáticos baseados na força dos elencos
        if (Math.random() < 0.08) {
          generateRandomMatchEvent(nextMin);
        }

        // Intervalo do Jogo aos 45' com liderança do Capitão ou Treinador
        if (nextMin === 45 && prev === 44) {
          const captainNote = playerProfile?.isCaptain 
            ? ` ©️ O Capitão ${userActorName} reúne os companheiros, inflama o vestiário e cobra reação!` 
            : '';
          setComments((c) => [
            { minute: 45, text: `⏸️ Fim do primeiro tempo! Equipes descem para os vestiários.${captainNote}`, type: 'normal' },
            ...c
          ]);
          if (mode === 'manager') {
            setIsPlaying(false);
          }
        }

        // Apito Final aos 90'
        if (nextMin >= 90) {
          setIsPlaying(false);
          setIsFinished(true);
          setComments((c) => [
            { minute: 90, text: 'APITA O ÁRBITRO! Fim de jogo emocionante!', type: 'normal' },
            ...c
          ]);
          return 90;
        }

        return nextMin;
      });
    }, simSpeed);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, isFinished, activeMoment, simSpeed, mode, momentResolved, userActorName]);

  // Geração de Eventos e Gols durante a Simulação
  const generateRandomMatchEvent = (currentMin: number) => {
    const isHomeAttacking = Math.random() < 0.52;
    const attackingClub = isHomeAttacking ? homeClub : awayClub;
    const defendingClub = isHomeAttacking ? awayClub : homeClub;

    // Movimenta a bola no mini-campo 2D
    ballPosRef.current.targetX = isHomeAttacking ? 220 + Math.random() * 60 : 30 + Math.random() * 60;
    ballPosRef.current.targetY = 30 + Math.random() * 90;

    // Chance de Gol
    if (Math.random() < 0.32) {
      const isGoal = Math.random() < 0.40;
      if (isGoal) {
        const currentStarters = isHomeAttacking ? homeLineup : awayLineup;
        const isUserTeamAttacking = isHomeAttacking ? isUserHome : isUserAway;
        const scorer = currentStarters[Math.floor(Math.random() * currentStarters.length)] || { id: 'p-rand', name: 'Atacante' };

        if (isHomeAttacking) {
          setHomeScore((s) => s + 1);
        } else {
          setAwayScore((s) => s + 1);
        }

        let assistPlayerId: string | undefined = undefined;
        let assistPlayerName: string | undefined = undefined;

        if (mode === 'player' && playerProfile && isUserTeamAttacking && scorer.id !== playerProfile.id) {
          const isPlaymaker = ['MEI', 'MC', 'PE', 'PD', 'LE', 'LD'].includes(playerProfile.position);
          const hasPassingSpec = playerProfile.specialties?.some((s) => ['passing', 'playmaker', 'crossing'].includes(s));
          const assistChance = hasPassingSpec ? 0.45 : isPlaymaker ? 0.35 : 0.20;

          if (Math.random() < assistChance) {
            assistPlayerId = playerProfile.id;
            assistPlayerName = playerProfile.nickname || playerProfile.name;
          }
        }

        setScorers((prev) => [
          ...prev, 
          { 
            playerId: scorer.id, 
            name: scorer.name, 
            minute: currentMin,
            assistPlayerId,
            assistPlayerName,
          }
        ]);

        const assistComment = assistPlayerName 
          ? ` com passe magistral de ${assistPlayerName}` 
          : '';

        setComments((c) => [
          { minute: currentMin, text: `⚽ GOOOOOOL DO ${attackingClub.name.toUpperCase()}! ${scorer.name} finaliza no cantinho${assistComment} e corre para o abraço!`, type: 'goal' },
          ...c
        ]);
      } else {
        setComments((c) => [
          { minute: currentMin, text: `Perigo! Grande finalização do ${attackingClub.name}, mas o goleiro faz defesa espetacular espalmando para escanteio!`, type: 'chance' },
          ...c
        ]);
      }
    } else if (Math.random() < 0.16) {
      // Evento de Impedimento Oficial & Revisão do VAR
      const isDisallowedGoal = Math.random() < 0.28;
      const attackers = (isHomeAttacking ? homeLineup : awayLineup).filter(p => ['ATA', 'PD', 'PE', 'MEI'].includes(p.position));
      const offsidePlayer = attackers[Math.floor(Math.random() * attackers.length)] || { name: 'Atacante' };

      if (isHomeAttacking) {
        setHomeOffsides(s => s + 1);
      } else {
        setAwayOffsides(s => s + 1);
      }

      if (isDisallowedGoal) {
        setVarReviewBanner(`🖥️ REVISÃO DO VAR: Gol do ${attackingClub.name} anulado por impedimento!`);
        setTimeout(() => setVarReviewBanner(null), 3500);

        setComments((c) => [
          { minute: currentMin, text: `🚩⚽ GOL ANULADO PELO VAR! ${offsidePlayer.name} (${attackingClub.name}) balançou a rede, mas o VAR traçou as linhas e confirmou impedimento milimétrico! Segue o jogo!`, type: 'card' },
          ...c
        ]);
      } else {
        setComments((c) => [
          { minute: currentMin, text: `🚩 IMPEDIMENTO! O assistente ergueu a bandeira! ${offsidePlayer.name} (${attackingClub.name}) estava adiantado na linha defensiva do ${defendingClub.name}!`, type: 'chance' },
          ...c
        ]);
      }
    } else if (Math.random() < 0.18) {
      // Evento Realista de Falta Dura e Cartões Amarelos / Vermelhos
      const isRed = Math.random() < 0.08;
      const clubFouled = isHomeAttacking ? homeClub : awayClub;
      const defenders = (isHomeAttacking ? homeLineup : awayLineup).filter(p => ['ZAG', 'LD', 'LE', 'VOL'].includes(p.position));
      const foulPlayer = defenders[Math.floor(Math.random() * defenders.length)] || { name: 'Zagueiro' };

      if (isRed) {
        setComments((c) => [
          { minute: currentMin, text: `🟥 EXPULSÃO DIRETA! Cartão vermelho para ${foulPlayer.name} (${clubFouled.name}) após entrada duríssima por trás! O time jogará com 1 a menos!`, type: 'card' },
          ...c
        ]);
      } else {
        setComments((c) => [
          { minute: currentMin, text: `🟨 CARTÃO AMARELO! Falta tática de ${foulPlayer.name} (${clubFouled.name}) para interromper o contra-ataque perigoso!`, type: 'card' },
          ...c
        ]);
      }
    }
  };

  // Executar Substituição de Jogador (Até 5 por jogo)
  const handleExecuteSubstitution = () => {
    if (!subOutPlayerId || !subInPlayerId || subsLeft <= 0) return;

    if (isUserHome) {
      const outIndex = homeLineup.findIndex(p => p.id === subOutPlayerId);
      const inPlayer = homeBench.find(p => p.id === subInPlayerId);

      if (outIndex !== -1 && inPlayer) {
        const outPlayer = homeLineup[outIndex];
        const newStarters = [...homeLineup];
        newStarters[outIndex] = {
          id: inPlayer.id,
          name: inPlayer.name,
          position: inPlayer.position,
          overall: inPlayer.overall,
          number: outPlayer.number,
          isUser: false,
          isCaptain: false,
          isPenalty: false,
          isFreeKick: false,
        };

        const newBench = homeBench.filter(p => p.id !== subInPlayerId);
        // Coloca o jogador substituído de volta no banco
        newBench.push({
          id: outPlayer.id,
          name: outPlayer.name,
          position: outPlayer.position as any,
          overall: outPlayer.overall,
          potential: outPlayer.overall + 3,
          age: 24,
          marketValue: 1000000,
          wage: 15000,
          energy: 65,
          morale: 85,
          contractWeeks: 52,
          isYouth: isYouthMatch,
          attributes: {} as any,
        });

        setHomeLineup(newStarters);
        setHomeBench(newBench);
        setSubsLeft(s => s - 1);
        setComments(c => [
          {
            minute,
            text: `🔄 [${minute}'] SUBSTITUIÇÃO NO ${homeClub.name.toUpperCase()}: Sai ${outPlayer.name} (${outPlayer.position}) e entra ${inPlayer.name} (${inPlayer.position})!`,
            type: 'normal',
          },
          ...c,
        ]);
      }
    } else {
      const outIndex = awayLineup.findIndex(p => p.id === subOutPlayerId);
      const inPlayer = awayBench.find(p => p.id === subInPlayerId);

      if (outIndex !== -1 && inPlayer) {
        const outPlayer = awayLineup[outIndex];
        const newStarters = [...awayLineup];
        newStarters[outIndex] = {
          id: inPlayer.id,
          name: inPlayer.name,
          position: inPlayer.position,
          overall: inPlayer.overall,
          number: outPlayer.number,
          isUser: false,
          isCaptain: false,
          isPenalty: false,
          isFreeKick: false,
        };

        const newBench = awayBench.filter(p => p.id !== subInPlayerId);
        setAwayLineup(newStarters);
        setAwayBench(newBench);
        setSubsLeft(s => s - 1);
        setComments(c => [
          {
            minute,
            text: `🔄 [${minute}'] SUBSTITUIÇÃO NO ${awayClub.name.toUpperCase()}: Sai ${outPlayer.name} (${outPlayer.position}) e entra ${inPlayer.name} (${inPlayer.position})!`,
            type: 'normal',
          },
          ...c,
        ]);
      }
    }

    setSubOutPlayerId(null);
    setSubInPlayerId(null);
    setIsSubModalOpen(false);
    setIsPlaying(true);
  };

  // Animação 2D do Mini-Campo em Canvas2D Puro (60 FPS leve e fluido)
  useEffect(() => {
    if (!isOpen || viewTab !== 'radar' || activeMoment !== 'none') return;

    let animId: number;
    let tick = 0;
    let isMounted = true;

    const renderField = () => {
      if (!isMounted) return;

      const canvas = canvasRef.current;
      if (!canvas) {
        // Se ainda não montou no DOM, tenta no próximo frame
        animId = requestAnimationFrame(renderField);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(renderField);
        return;
      }

      tick++;
      const w = canvas.width || 320;
      const h = canvas.height || 150;

      // Fundo do Gramado
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, w, h);

      // Faixas de grama cortada realista
      ctx.fillStyle = '#047857';
      for (let x = 0; x < w; x += 30) {
        if ((x / 30) % 2 === 0) ctx.fillRect(x, 0, 15, h);
      }

      // Linhas brancas do gramado
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // Linha de meio de campo e círculo central
      ctx.beginPath();
      ctx.moveTo(w / 2, 10);
      ctx.lineTo(w / 2, h - 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 24, 0, Math.PI * 2);
      ctx.stroke();

      // Ponto central
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Áreas dos gols
      ctx.strokeRect(10, (h - 60) / 2, 28, 60);
      ctx.strokeRect(w - 38, (h - 60) / 2, 28, 60);

      // 1. Renderiza os 11 Jogadores Mandantes (4-3-3 Tático com Micro-Movimentos)
      const homeBasePos = [
        { x: 24, y: 75, pos: 'GOL' },
        { x: 58, y: 24, pos: 'LD' },
        { x: 50, y: 56, pos: 'ZAG' },
        { x: 50, y: 94, pos: 'ZAG' },
        { x: 58, y: 126, pos: 'LE' },
        { x: 88, y: 75, pos: 'VOL' },
        { x: 112, y: 46, pos: 'MC' },
        { x: 112, y: 104, pos: 'MEI' },
        { x: 136, y: 32, pos: 'PD' },
        { x: 144, y: 75, pos: 'ATA' },
        { x: 136, y: 118, pos: 'PE' },
      ];

      homeBasePos.forEach((p, idx) => {
        const floatX = Math.sin(tick * 0.05 + idx) * 2;
        const floatY = Math.cos(tick * 0.05 + idx * 1.3) * 2;
        const px = p.x + floatX;
        const py = p.y + floatY;
        const isUserPlayer = isUserHome && mode === 'player' && idx === 10;

        ctx.fillStyle = homeClub.primaryColor || '#dc2626';
        ctx.beginPath();
        ctx.arc(px, py, isUserPlayer ? 6.5 : 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isUserPlayer ? '#facc15' : (homeClub.secondaryColor || '#ffffff');
        ctx.lineWidth = isUserPlayer ? 2 : 1;
        ctx.stroke();

        if (isUserPlayer) {
          // Indicador Dourado do Atleta do Usuário
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(px, py - 8, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. Renderiza os 11 Jogadores Visitantes (Espelhado com Micro-Movimentos)
      const awayBasePos = [
        { x: w - 24, y: 75, pos: 'GOL' },
        { x: w - 58, y: 24, pos: 'LE' },
        { x: w - 50, y: 56, pos: 'ZAG' },
        { x: w - 50, y: 94, pos: 'ZAG' },
        { x: w - 58, y: 126, pos: 'LD' },
        { x: w - 88, y: 75, pos: 'VOL' },
        { x: w - 112, y: 46, pos: 'MC' },
        { x: w - 112, y: 104, pos: 'MEI' },
        { x: w - 136, y: 32, pos: 'PE' },
        { x: w - 144, y: 75, pos: 'ATA' },
        { x: w - 136, y: 118, pos: 'PD' },
      ];

      awayBasePos.forEach((p, idx) => {
        const floatX = Math.cos(tick * 0.05 + idx * 1.1) * 2;
        const floatY = Math.sin(tick * 0.05 + idx) * 2;
        const px = p.x + floatX;
        const py = p.y + floatY;
        const isUserPlayer = isUserAway && mode === 'player' && idx === 10;

        ctx.fillStyle = awayClub.primaryColor || '#1d4ed8';
        ctx.beginPath();
        ctx.arc(px, py, isUserPlayer ? 6.5 : 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isUserPlayer ? '#facc15' : (awayClub.secondaryColor || '#ffffff');
        ctx.lineWidth = isUserPlayer ? 2 : 1;
        ctx.stroke();

        if (isUserPlayer) {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(px, py - 8, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3. Bola interpolando suavemente no gramado
      const ball = ballPosRef.current;
      ball.x += (ball.targetX - ball.x) * 0.08;
      ball.y += (ball.targetY - ball.y) * 0.08;

      // Limita a bola às linhas do gramado
      const clampedX = Math.max(14, Math.min(w - 14, ball.x));
      const clampedY = Math.max(14, Math.min(h - 14, ball.y));

      // Sombra da Bola
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.arc(clampedX, clampedY + 2.5, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Bola Branca com contorno
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(clampedX, clampedY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();

      animId = requestAnimationFrame(renderField);
    };

    renderField();

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isOpen, viewTab, activeMoment, homeClub, awayClub, isUserHome, isUserAway, mode]);

  // Resolução do Minigame de Pênalti / Chute
  const handleScoreGoalMinigame = (ratingBonus: number) => {
    setActiveMoment('none');
    setMomentResolved(true);
    setIsPlaying(true);

    if (isUserHome) {
      setHomeScore((s) => s + 1);
    } else {
      setAwayScore((s) => s + 1);
    }

    const playerId = playerProfile?.id || 'player-user';
    setScorers((prev) => [...prev, { playerId, name: userActorName, minute }]);

    setComments((c) => [
      { minute, text: `⚽ GOLAÇOOOO! ${userActorName} converte o lance com maestria e incendeia o estádio!`, type: 'goal' },
      ...c
    ]);

    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#10b981', '#fbbf24', '#ffffff'],
    });
  };

  // Resolução do Minigame de Passe
  const handleCompletePassMinigame = (assistBonus: number) => {
    setActiveMoment('none');
    setMomentResolved(true);
    setIsPlaying(true);

    if (isUserHome) {
      setHomeScore((s) => s + 1);
    } else {
      setAwayScore((s) => s + 1);
    }

    const myClubRoster = isUserHome ? homeLineup : awayLineup;
    const forwardTeammate = myClubRoster.find(
      (p) => p.id !== playerProfile?.id && ['ATA', 'CA', 'PD', 'PE', 'MEI'].includes(p.position)
    ) || myClubRoster.find((p) => p.id !== playerProfile?.id) || { id: 'teammate-scorer', name: 'Companheiro de Ataque' };

    const myId = playerProfile?.id || 'player-user';
    const myName = playerProfile?.nickname || playerProfile?.name || 'Craque';

    setScorers((prev) => [
      ...prev, 
      { 
        playerId: forwardTeammate.id, 
        name: forwardTeammate.name, 
        minute, 
        assistPlayerId: myId,
        assistPlayerName: myName,
      }
    ]);

    setComments((c) => [
      { minute, text: `⚽ GOL DEPOIS DE ASSISTÊNCIA GENIAL! ${userActorName} descolou um passe espetacular para ${forwardTeammate.name} guardar no fundo da rede!`, type: 'goal' },
      ...c
    ]);
  };

  // Resolução do Minigame de Drible (1 contra 1)
  const handleDribbleSuccessMinigame = (_dribbleType: string, _ratingBonus: number) => {
    setComments((c) => [
      { 
        minute, 
        text: `✨ DRIBLE DESCONCERTANTE! ${userActorName} limpou o lance com maestria e arrancou aplausos no estádio!`, 
        type: 'chance' 
      },
      ...c
    ]);
  };

  const handleAdvanceFromDribbleToShot = () => {
    // Passou pelo zagueiro e emenda direto no chute decisivo com gol aberto!
    setActiveMoment('penalty_minigame');
    setComments((c) => [
      {
        minute,
        text: `🔥 DEIXOU O MARCADOR NA SAUDADE! ${userActorName} sai cara a cara com o goleiro para finalizar!`,
        type: 'chance',
      },
      ...c,
    ]);
  };

  const handleDribbleFailMinigame = (reason: 'tackle' | 'foul') => {
    setActiveMoment('none');
    setMomentResolved(true);
    setIsPlaying(true);
    if (reason === 'foul') {
      setComments((c) => [
        { minute, text: `⚠️ FALTA DURA! ${userActorName} sofreu entrada violenta após o drible! Falta perigosa!`, type: 'chance' },
        ...c
      ]);
    } else {
      setComments((c) => [
        { minute, text: `❌ Desarme preciso! O zagueiro adversário leu o drible de ${userActorName} e travou a bola.`, type: 'normal' },
        ...c
      ]);
    }
  };

  const handleMissMinigame = () => {
    setActiveMoment('none');
    setMomentResolved(true);
    setIsPlaying(true);
    setComments((c) => [
      { minute, text: `Inacreditável! ${userActorName} tentou o lance, mas a bola não entrou!`, type: 'chance' },
      ...c
    ]);
  };

  // Finalização da Partida
  const handleFinishMatchClick = () => {
    const ratings: Record<string, number> = {};
    const allRoster = [...(homeClub.roster || []), ...(awayClub.roster || [])];
    
    allRoster.forEach((p) => {
      ratings[p.id] = Number((6.0 + Math.random() * 2.8).toFixed(1));
    });

    if (mode === 'player' && playerProfile) {
      const userGoals = scorers.filter((s) => s.playerId === playerProfile.id).length;
      const userAssists = scorers.filter((s) => s.assistPlayerId === playerProfile.id).length;
      ratings[playerProfile.id] = Number(Math.min(10.0, 6.5 + (userGoals * 1.5) + (userAssists * 1.0)).toFixed(1));
    }

    const mvpScorer = scorers[0]?.playerId || playerProfile?.id || allRoster[0]?.id || 'mvp';

    onFinishMatch({
      homeScore,
      awayScore,
      scorers: scorers.map((s) => ({ 
        playerId: s.playerId, 
        minute: s.minute, 
        assistPlayerId: s.assistPlayerId,
        playerName: s.name,
        assistPlayerName: s.assistPlayerName,
      })),
      ratings,
      mvpPlayerId: mvpScorer,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border border-emerald-500/40 rounded-3xl max-w-4xl w-full p-4 sm:p-7 shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Glow decorativo de estádio */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header do Placar ao Vivo */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Ao Vivo • {fixture.competition === 'sub_20' ? 'Copa Sub-20' : fixture.competition === 'copa_brasil' ? 'Copa do Brasil' : `Série ${homeClub.division}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimSpeed((s) => s === 350 ? 120 : 350)}
              className="py-1 px-2.5 rounded-xl bg-secondary text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              {simSpeed === 120 ? '2x Veloz' : '1x Normal'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Banner de Revisão do VAR (Impedimento) */}
        {varReviewBanner && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 text-amber-300 text-xs font-black flex items-center justify-center gap-2 animate-pulse shadow-lg">
            <span>{varReviewBanner}</span>
          </div>
        )}

        {/* 2. Placar Grande com Escudos e Cronômetro */}
        <div className="p-4 sm:p-6 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between mb-3">
          {/* Clube Mandante */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <ClubBadge
              primaryColor={homeClub.primaryColor}
              secondaryColor={homeClub.secondaryColor}
              shortName={homeClub.shortName}
              size="lg"
            />
            <div className="min-w-0">
              <h3 className="font-display text-sm sm:text-lg font-black text-foreground truncate max-w-[160px] sm:max-w-xs" title={homeClub.name}>
                {homeClub.name}
              </h3>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Mandante</span>
            </div>
          </div>

          {/* Placar Central e Minuto */}
          <div className="text-center px-4 flex flex-col items-center">
            <span className="font-mono text-xs sm:text-sm font-black text-emerald-400 bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-500/30 mb-1">
              {minute}' {minute >= 90 ? 'FIM' : ''}
            </span>
            <div className="font-display text-3xl sm:text-5xl font-black tracking-wider text-foreground">
              {homeScore} <span className="text-muted-foreground text-2xl sm:text-3xl">-</span> {awayScore}
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5">Estádio {homeClub.stadiumName}</span>
          </div>

          {/* Clube Visitante */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1 text-right">
            <div className="min-w-0">
              <h3 className="font-display text-sm sm:text-lg font-black text-foreground truncate max-w-[160px] sm:max-w-xs" title={awayClub.name}>
                {awayClub.name}
              </h3>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Visitante</span>
            </div>
            <ClubBadge
              primaryColor={awayClub.primaryColor}
              secondaryColor={awayClub.secondaryColor}
              shortName={awayClub.shortName}
              size="lg"
            />
          </div>
        </div>

        {/* Faixa de Configurações da Partida: Esforço & Uniforme */}
        <div className="mb-3 px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Seletor de Esforço do Atleta */}
          {mode === 'player' ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-zinc-400 font-bold text-[11px]">Nível de Esforço:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEffortLevel(1)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition cursor-pointer ${
                    effortLevel === 1
                      ? 'bg-blue-600 text-white font-black shadow-sm'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title="Cadenciado: Cansa menos (-12%), poucas chances clutch, zero lesão"
                >
                  🍃 1: Cadenciado
                </button>
                <button
                  type="button"
                  onClick={() => setEffortLevel(2)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition cursor-pointer ${
                    effortLevel === 2
                      ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title="Normal: Cansaço equilibrado (-25%), 2 a 3 chances clutch"
                >
                  ⚽ 2: Normal
                </button>
                <button
                  type="button"
                  onClick={() => setEffortLevel(3)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition cursor-pointer ${
                    effortLevel === 3
                      ? 'bg-rose-600 text-white font-black shadow-sm'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title="Sangue no Olho: Cansa muito (-45%), 4 a 5 chances clutch, alto risco de lesão muscular!"
                >
                  🔥 3: Sangue no Olho
                </button>
              </div>
            </div>
          ) : (
            <div className="text-zinc-400 text-[11px] font-bold">
              Comando da Prancheta: Substituições e posturas táticas ativas
            </div>
          )}

          {/* Seletor de Uniforme */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-zinc-400 font-bold text-[11px]">Uniforme:</span>
            <button
              type="button"
              onClick={() => setUniformKit('home')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                uniformKit === 'home'
                  ? 'bg-emerald-500 text-zinc-950 font-black'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              👕 Titular
            </button>
            <button
              type="button"
              onClick={() => setUniformKit('away')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                uniformKit === 'away'
                  ? 'bg-emerald-500 text-zinc-950 font-black'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              🎽 Reserva
            </button>
          </div>
        </div>

        {/* Banner de Revisão do VAR (Impedimento) */}
        {varReviewBanner && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 text-amber-300 text-xs font-black flex items-center justify-center gap-2 animate-pulse shadow-lg">
            <span>{varReviewBanner}</span>
          </div>
        )}

        {/* 3. Área Principal: Mini-campo 2D & Feed de Lances ou Minigame */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden min-h-[300px]">
          
          {/* Coluna da Esquerda: Mini-Campo 2D & Controles de Treinador */}
          <div className="md:col-span-2 flex flex-col gap-3">
            {/* Se estiver no Momento Decisivo: Abre a Decisão Tática ou o Minigame correspondente */}
            {activeMoment === 'rpg_decision' ? (
              <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 rounded-2xl border-2 border-amber-500/50 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                    ⚡ Decisão do Craque ({minute}')
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-white mt-1">
                    A bola é sua, {userActorName}!
                  </h3>
                  <p className="text-xs text-zinc-300 max-w-md">
                    Você domina na intermediária de ataque com a zaga adversária se recompondo. Qual jogada você escolhe executar?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                  {/* Opção 1: Chute direto */}
                  <button
                    type="button"
                    onClick={() => setActiveMoment('penalty_minigame')}
                    className="p-4 rounded-xl bg-gradient-to-br from-rose-950/80 to-zinc-900 border-2 border-rose-500/40 hover:border-rose-400 hover:scale-[1.02] transition flex flex-col items-center text-center gap-2 cursor-pointer shadow-lg group"
                  >
                    <span className="text-3xl p-2 rounded-xl bg-rose-500/20 group-hover:scale-110 transition">🚀</span>
                    <div>
                      <h4 className="text-sm font-black text-white">Chutar no Gol</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Bomba ou colocada no ângulo</p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full mt-auto">
                      Finalização
                    </span>
                  </button>

                  {/* Opção 2: Passe enfiado */}
                  <button
                    type="button"
                    onClick={() => setActiveMoment('pass_minigame')}
                    className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/80 to-zinc-900 border-2 border-emerald-500/40 hover:border-emerald-400 hover:scale-[1.02] transition flex flex-col items-center text-center gap-2 cursor-pointer shadow-lg group"
                  >
                    <span className="text-3xl p-2 rounded-xl bg-emerald-500/20 group-hover:scale-110 transition">👟</span>
                    <div>
                      <h4 className="text-sm font-black text-white">Passe Enfiado</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Achar companheiro livre</p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full mt-auto">
                      Assistência
                    </span>
                  </button>

                  {/* Opção 3: Drible no 1x1 */}
                  <button
                    type="button"
                    onClick={() => setActiveMoment('dribble_minigame')}
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-950/80 to-zinc-900 border-2 border-blue-500/40 hover:border-blue-400 hover:scale-[1.02] transition flex flex-col items-center text-center gap-2 cursor-pointer shadow-lg group"
                  >
                    <span className="text-3xl p-2 rounded-xl bg-blue-500/20 group-hover:scale-110 transition">⚡</span>
                    <div>
                      <h4 className="text-sm font-black text-white">Driblar no 1x1</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Finta, caneta ou elástico</p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full mt-auto">
                      Habilidade
                    </span>
                  </button>
                </div>
              </div>
            ) : activeMoment === 'penalty_minigame' ? (
              <div className="flex-1 flex flex-col justify-center">
                <NSSPenaltyMinigame
                  mode="match_clutch"
                  onScoreGoal={handleScoreGoalMinigame}
                  onMiss={handleMissMinigame}
                  matchInfo={{
                    minute,
                    oppClubName: isUserHome ? awayClub.name : homeClub.name,
                    currentScore: `${homeScore} x ${awayScore}`,
                  }}
                />
              </div>
            ) : activeMoment === 'pass_minigame' ? (
              <div className="flex-1 flex flex-col justify-center">
                <NSSPassMinigame
                  mode="match_clutch"
                  onCompletePass={handleCompletePassMinigame}
                  onInterception={handleMissMinigame}
                  teammateName="Atacante"
                />
              </div>
            ) : activeMoment === 'dribble_minigame' ? (
              <div className="flex-1 flex flex-col justify-center">
                <DribbleMinigame
                  mode="match_clutch"
                  onDribbleSuccess={handleDribbleSuccessMinigame}
                  onDribbleFail={handleDribbleFailMinigame}
                  onAdvanceToShot={handleAdvanceFromDribbleToShot}
                  defenderName={isUserHome ? (awayClub.roster?.[2]?.name || 'Zagueiro Central') : (homeClub.roster?.[2]?.name || 'Zagueiro Central')}
                  defenderRating={isUserHome ? (awayClub.roster?.[2]?.overall || 72) : (homeClub.roster?.[2]?.overall || 72)}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between bg-emerald-950/40 rounded-2xl border border-emerald-900/50 p-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
                  <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-emerald-800/80">
                    <button
                      type="button"
                      onClick={() => setViewTab('radar')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black transition-colors cursor-pointer ${
                        viewTab === 'radar' ? 'bg-emerald-500 text-zinc-950 shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      ⚽ Radar 2D
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewTab('lineups')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black transition-colors cursor-pointer ${
                        viewTab === 'lineups' ? 'bg-emerald-500 text-zinc-950 shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      👥 Escalações (11x11)
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-emerald-300">
                      Posse: {
                        tacticPosture === 'possession' ? (isUserHome ? '68%' : '32%') :
                        tacticPosture === 'attacking' ? (isUserHome ? '58%' : '42%') :
                        tacticPosture === 'counter' ? (isUserHome ? '42%' : '58%') :
                        tacticPosture === 'defensive' ? (isUserHome ? '35%' : '65%') :
                        (isUserHome ? '52%' : '48%')
                      } x {
                        tacticPosture === 'possession' ? (isUserHome ? '32%' : '68%') :
                        tacticPosture === 'attacking' ? (isUserHome ? '42%' : '58%') :
                        tacticPosture === 'counter' ? (isUserHome ? '58%' : '42%') :
                        tacticPosture === 'defensive' ? (isUserHome ? '65%' : '35%') :
                        (isUserHome ? '48%' : '52%')
                      }
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                      <span>🚩 Impedimentos:</span>
                      <span>{homeOffsides} x {awayOffsides}</span>
                    </span>
                  </div>
                </div>

                {/* Badges de Habilidades Épicas Ativas */}
                {mode === 'player' && playerProfile?.unlockedEpicSkills && playerProfile.unlockedEpicSkills.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {playerProfile.unlockedEpicSkills.map((sk) => (
                      <span 
                        key={sk}
                        className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                        {sk === 'epic_trivela' ? 'Trivela Fatal' :
                         sk === 'epic_canhota_fogo' ? 'Canhota de Fogo' :
                         sk === 'epic_aura_ouro' ? 'Aura The Best' :
                         sk === 'epic_teleguiado' ? 'Passe Teleguiado' :
                         sk === 'epic_frieza' ? 'Frieza Glacial' : 'Segundo Pulmão'}
                      </span>
                    ))}
                  </div>
                )}

                {/* VISÃO 1: Canvas 2D do Campo com os 22 Jogadores */}
                {viewTab === 'radar' ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={150}
                      className="w-full max-w-[340px] h-[140px] rounded-xl border border-emerald-800 shadow-md"
                    />
                    <span className="text-[10px] text-emerald-400/80 font-bold mt-1">
                      🟢 11 {homeClub.shortName} x 11 {awayClub.shortName} • Estrela ⭐ = Seu Atleta
                    </span>
                  </div>
                ) : (
                  /* VISÃO 2: Escalações Titulares 11x11 */
                  <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto max-h-[170px] pr-1 py-1">
                    {/* 11 Titulares Mandante */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-emerald-400 block border-b border-emerald-900/60 pb-0.5">
                        {homeClub.shortName} (Titulares)
                      </span>
                      {homeLineup.map((p) => (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between px-1.5 py-0.5 rounded text-[10px] ${
                            p.isUser ? 'bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/50' : 'text-zinc-300 hover:bg-secondary/40'
                          }`}
                        >
                          <span className="font-mono text-muted-foreground mr-1">#{p.number}</span>
                          <span className="truncate flex-1 font-semibold">{p.name}</span>
                          {p.isCaptain && <span className="ml-1 text-[8px] bg-amber-400 text-zinc-950 px-1 rounded font-black" title="Capitão">C</span>}
                          {p.isPenalty && <span className="ml-0.5 text-[9px]" title="Cobrador de Pênaltis">🎯</span>}
                          {p.isFreeKick && <span className="ml-0.5 text-[9px]" title="Cobrador de Faltas">☄️</span>}
                          <span className="text-muted-foreground ml-1 font-mono">{p.position}</span>
                          {p.isUser && <span className="ml-1 text-[8px] bg-emerald-500 text-zinc-950 px-1 rounded font-black">VOCÊ</span>}
                        </div>
                      ))}
                    </div>

                    {/* 11 Titulares Visitante */}
                    <div className="space-y-1 border-l border-emerald-900/40 pl-2">
                      <span className="text-[10px] font-black uppercase text-blue-400 block border-b border-emerald-900/60 pb-0.5">
                        {awayClub.shortName} (Titulares)
                      </span>
                      {awayLineup.map((p) => (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between px-1.5 py-0.5 rounded text-[10px] ${
                            p.isUser ? 'bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/50' : 'text-zinc-300 hover:bg-secondary/40'
                          }`}
                        >
                          <span className="font-mono text-muted-foreground mr-1">#{p.number}</span>
                          <span className="truncate flex-1 font-semibold">{p.name}</span>
                          {p.isCaptain && <span className="ml-1 text-[8px] bg-amber-400 text-zinc-950 px-1 rounded font-black" title="Capitão">C</span>}
                          {p.isPenalty && <span className="ml-0.5 text-[9px]" title="Cobrador de Pênaltis">🎯</span>}
                          {p.isFreeKick && <span className="ml-0.5 text-[9px]" title="Cobrador de Faltas">☄️</span>}
                          <span className="text-muted-foreground ml-1 font-mono">{p.position}</span>
                          {p.isUser && <span className="ml-1 text-[8px] bg-emerald-500 text-zinc-950 px-1 rounded font-black">VOCÊ</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Controles de Estratégia Tática em Tempo Real */}
                <div className="pt-2 border-t border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground font-semibold text-[11px]">
                    {mode === 'manager' ? 'Estratégia do Treinador:' : 'Instrução Tática do Jogador:'}
                  </span>
                  
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      onClick={() => setTacticPosture('defensive')}
                      className={`px-2 py-1 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors ${
                        tacticPosture === 'defensive' ? 'bg-amber-500 text-zinc-950 font-black shadow-sm' : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                      title="Linha de 5, -35% de gols sofridos"
                    >
                      🛡️ Retranca
                    </button>

                    <button
                      onClick={() => setTacticPosture('counter')}
                      className={`px-2 py-1 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors ${
                        tacticPosture === 'counter' ? 'bg-blue-600 text-white font-black shadow-sm' : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                      title="Transição rápida e contra-ataque letal"
                    >
                      🎯 Contra-Ataque
                    </button>

                    <button
                      onClick={() => setTacticPosture('balanced')}
                      className={`px-2 py-1 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors ${
                        tacticPosture === 'balanced' ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm' : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                      title="Transições normais equilibradas"
                    >
                      ⚖️ Equilibrado
                    </button>

                    <button
                      onClick={() => setTacticPosture('possession')}
                      className={`px-2 py-1 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors ${
                        tacticPosture === 'possession' ? 'bg-purple-600 text-white font-black shadow-sm' : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                      title="Toque de bola cadenciado, controle de jogo e poupa fôlego"
                    >
                      🪄 Posse / Tiki-Taka
                    </button>

                    <button
                      onClick={() => setTacticPosture('attacking')}
                      className={`px-2 py-1 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors ${
                        tacticPosture === 'attacking' ? 'bg-rose-500 text-zinc-950 font-black shadow-sm' : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                      title="Linha alta e pressão total no campo adversário"
                    >
                      ⚡ Pressão Total
                    </button>

                    {/* Botão Oficial de Substituição Durante a Partida (Até 5 por jogo) */}
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setIsSubModalOpen(true);
                      }}
                      disabled={subsLeft <= 0}
                      className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase cursor-pointer transition-all flex items-center gap-1 ml-auto ${
                        subsLeft > 0 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95' 
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                      title="Fazer substituição de atleta no jogo"
                    >
                      🔄 Substituir ({subsLeft})
                    </button>
                  </div>
                </div>

                {/* AÇÕES DE INTERVALO DO TREINADOR (PRELEÇÃO & PRANCHETA) */}
                {mode === 'manager' && minute === 45 && !isFinished && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⏸️</span>
                        <div>
                          <h4 className="text-xs font-black text-amber-300">
                            INTERVALO DE JOGO: Vestiário Aberto!
                          </h4>
                          <p className="text-[11px] text-zinc-300">
                            {halfTimeActionDone 
                              ? 'Ajuste tático aplicado! Seus atletas estão prontos para o 2º tempo.'
                              : 'Realize uma preleção motivacional ou ajuste as jogadas na prancheta antes do recomeço!'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsHalfTimeSpeechOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer"
                      >
                        🎙️ Preleção de Intervalo
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsHalfTimeBoardOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer"
                      >
                        📋 Ajuste na Prancheta
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPlaying(true)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer ml-auto"
                      >
                        ▶️ Iniciar 2º Tempo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Coluna da Direita: Feed de Lances e Comentários Minuto a Minuto */}
          <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-emerald-500" />
                Transmissão Ao Vivo
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Rádio & TV</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar max-h-[220px]">
              {comments.map((comm, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl text-xs leading-relaxed transition-all ${
                    comm.type === 'goal'
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold'
                      : comm.type === 'chance'
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold'
                      : comm.type === 'card'
                      ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                      : 'bg-card/70 border border-border text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground">
                      {comm.minute}'
                    </span>
                    {comm.type === 'goal' && <span className="text-emerald-400">⚽ Gol!</span>}
                    {comm.type === 'chance' && <span className="text-amber-400">⚠️ Lance Perigoso</span>}
                    {comm.type === 'card' && (
                      <span className="text-xs font-black">
                        {comm.text.includes('🟥') ? '🟥 Expulsão' : '🟨 Cartão'}
                      </span>
                    )}
                  </div>
                  <p>{comm.text}</p>
                </div>
              ))}
            </div>

            {/* Ações de Fim de Jogo & Estatísticas Detalhadas */}
            {isFinished ? (
              <div className="pt-3 border-t border-border mt-2 space-y-2.5">
                {/* Painel de Estatísticas Finais da Partida */}
                <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                      📊 Estatísticas do Jogo
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Craque da Partida: {scorers[0]?.name || userActorName} ⭐
                    </span>
                  </div>

                  {/* Posse de bola */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-300 font-semibold">
                      <span>{homeClub.shortName} {matchStats.possessionHome}%</span>
                      <span className="text-zinc-500">Posse de Bola</span>
                      <span>{100 - matchStats.possessionHome}% {awayClub.shortName}</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${matchStats.possessionHome}%` }} />
                      <div className="h-full bg-blue-500" style={{ width: `${100 - matchStats.possessionHome}%` }} />
                    </div>
                  </div>

                  {/* Chutes totais e no gol */}
                  <div className="grid grid-cols-3 text-center text-[11px] pt-1 border-t border-zinc-800/60">
                    <span className="font-bold text-zinc-200">{matchStats.shotsHome} ({matchStats.shotsOnTargetHome})</span>
                    <span className="text-zinc-500">Finalizações</span>
                    <span className="font-bold text-zinc-200">{matchStats.shotsAway} ({matchStats.shotsOnTargetAway})</span>
                  </div>

                  {/* Passes certos */}
                  <div className="grid grid-cols-3 text-center text-[11px]">
                    <span className="font-bold text-zinc-200">{matchStats.passesAccHome}%</span>
                    <span className="text-zinc-500">Passes Certos</span>
                    <span className="font-bold text-zinc-200">{matchStats.passesAccAway}%</span>
                  </div>

                  {/* Faltas */}
                  <div className="grid grid-cols-3 text-center text-[11px]">
                    <span className="font-bold text-zinc-200">{matchStats.foulsHome}</span>
                    <span className="text-zinc-500">Faltas</span>
                    <span className="font-bold text-zinc-200">{matchStats.foulsAway}</span>
                  </div>

                  {/* Escanteios e Impedimentos */}
                  <div className="grid grid-cols-3 text-center text-[11px]">
                    <span className="font-bold text-zinc-200">{matchStats.cornersHome} / {homeOffsides}</span>
                    <span className="text-zinc-500">Escanteios / Imp.</span>
                    <span className="font-bold text-zinc-200">{matchStats.cornersAway} / {awayOffsides}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinishMatchClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Concluir e Ver Súmula da Rodada
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-border mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{isPlaying ? 'Partida em andamento...' : 'Partida pausada para lance'}</span>
                {mode === 'player' && playerProfile && (
                  <span className="font-bold text-emerald-400">Energia: {playerProfile.energy}%</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Banner de Revisão do VAR (Impedimento) */}
        {varReviewBanner && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 text-amber-300 text-xs font-black flex items-center justify-center gap-2 animate-pulse shadow-lg">
            <span>{varReviewBanner}</span>
          </div>
        )}

        {/* MODAL SOBREPOSTO DE SUBSTITUIÇÃO DURANTE A PARTIDA */}
        {isSubModalOpen && (
          <div className="absolute inset-0 z-40 bg-zinc-950/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150">
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                    🔄
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-black text-foreground">
                      Substituição Tática • {userClub.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {subsLeft} alterações restantes nesta partida. Escolha quem sai e quem entra.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSubModalOpen(false);
                    setIsPlaying(true);
                  }}
                  className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                {/* 1. Escolha quem SAI (Titulares) */}
                <div className="p-3 rounded-2xl bg-secondary/40 border border-border space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 block border-b border-border pb-1">
                    1. Selecione o Titular que vai SAIR:
                  </span>
                  <div className="space-y-1.5">
                    {(isUserHome ? homeLineup : awayLineup).map((player) => {
                      const isSelected = subOutPlayerId === player.id;
                      return (
                        <button
                          key={player.id}
                          type="button"
                          onClick={() => setSubOutPlayerId(player.id)}
                          className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer border ${
                            isSelected
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                              : 'bg-card/70 border-border hover:bg-secondary text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-muted-foreground">#{player.number}</span>
                            <span className="truncate">{player.name}</span>
                            {player.isUser && <span className="text-[8px] bg-emerald-500 text-zinc-950 px-1 rounded font-black">VOCÊ</span>}
                          </div>
                          <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded font-black text-emerald-400">
                            {player.position} • {player.overall} OVR
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Escolha quem ENTRA (Reservas) */}
                <div className="p-3 rounded-2xl bg-secondary/40 border border-border space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block border-b border-border pb-1">
                    2. Selecione o Reserva que vai ENTRAR:
                  </span>
                  <div className="space-y-1.5">
                    {(isUserHome ? homeBench : awayBench).map((player) => {
                      const isSelected = subInPlayerId === player.id;
                      return (
                        <button
                          key={player.id}
                          type="button"
                          onClick={() => setSubInPlayerId(player.id)}
                          className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-card/70 border-border hover:bg-secondary text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="truncate">{player.name}</span>
                          </div>
                          <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded font-black text-emerald-400">
                            {player.position} • {player.overall} OVR
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Ação de Confirmação da Troca */}
            <div className="pt-3 border-t border-border mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                {subOutPlayerId && subInPlayerId 
                  ? 'Pronto para confirmar a alteração no time!' 
                  : 'Selecione 1 titular e 1 reserva para realizar a troca.'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubModalOpen(false);
                    setIsPlaying(true);
                  }}
                  className="py-2 px-3.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteSubstitution}
                  disabled={!subOutPlayerId || !subInPlayerId}
                  className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    subOutPlayerId && subInPlayerId
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20 active:scale-95'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar Substituição
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MINIJOGOS DE INTERVALO DO TREINADOR */}
        <TacticalBoardMinigame
          isOpen={isHalfTimeBoardOpen}
          onClose={() => setIsHalfTimeBoardOpen(false)}
          onCompleted={(res) => {
            setIsHalfTimeBoardOpen(false);
            setHalfTimeActionDone(true);
            setComments((c) => [
              { minute: 45, text: `📋 Ajuste na Prancheta executado com sucesso! O elenco volta para o 2º tempo com entrosamento refinado (+${res.entrosamentoBonus}% de entrosamento)!`, type: 'chance' },
              ...c,
            ]);
          }}
        />

        <ManagerSpeechMinigame
          isOpen={isHalfTimeSpeechOpen}
          isHalfTime={true}
          onClose={() => setIsHalfTimeSpeechOpen(false)}
          onCompleted={(res) => {
            setIsHalfTimeSpeechOpen(false);
            setHalfTimeActionDone(true);
            setComments((c) => [
              { minute: 45, text: `🎙️ Discurso de Vestiário eletrizante! Os jogadores voltam com sangue nos olhos para a virada (+${res.moraleGain} de moral)!`, type: 'chance' },
              ...c,
            ]);
          }}
        />

      </div>
    </div>
  );
}