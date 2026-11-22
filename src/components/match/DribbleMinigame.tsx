'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { sound } from '@/lib/soundEffects';
import { getCommentary, CommentaryCategory } from '@/engine/commentary';
import { 
  renderBallWithShadow, 
  BallPhysicsState, 
  applyScreenShake 
} from '@/engine/ballPhysics';
import { 
  Zap, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  ShieldAlert,
  Crown
} from 'lucide-react';

export type DribbleActionType = 'elastic' | 'nutmeg' | 'lob' | 'stepover';

interface DribbleMinigameProps {
  onDribbleSuccess?: (dribbleType: DribbleActionType, ratingBonus: number) => void;
  onDribbleFail?: (reason: 'tackle' | 'foul') => void;
  onAdvanceToShot?: () => void;
  onClose?: () => void;
  mode?: 'training' | 'match_clutch';
  defenderName?: string;
  defenderRating?: number;
}

export function DribbleMinigame({
  onDribbleSuccess,
  onDribbleFail,
  onAdvanceToShot,
  onClose,
  mode = 'training',
  defenderName = 'Zagueiro',
  defenderRating = 72,
}: DribbleMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerProfile = useGameStore((s) => s.playerProfile);

  const actorName = playerProfile?.nickname || playerProfile?.name || 'Craque';
  const dribbleSkill = playerProfile?.attributes.dribbling || 70;
  const paceSkill = playerProfile?.attributes.pace || 70;

  // Estados do Jogo
  const [gameState, setGameState] = useState<'approaching' | 'success' | 'failed_tackle' | 'failed_foul'>('approaching');
  const [chosenDribble, setChosenDribble] = useState<DribbleActionType | null>(null);
  const [feedbackText, setFeedbackText] = useState('O zagueiro está vindo dar o bote! Escolha o momento e a finta certa!');
  const [commentaryText, setCommentaryText] = useState<string>('');
  const [screenShakeIntensity, setScreenShakeIntensity] = useState<number>(0);
  const [attempts, setAttempts] = useState(0);
  const [successfulDribbles, setSuccessfulDribbles] = useState(0);

  // Janela de Timing calculada pelo Drible e Ritmo do jogador (em pixels de aproximação)
  // Quanto maior o Drible do jogador, maior a janela de acerto ideal (zona verde)
  const timingWindowBonus = (dribbleSkill - 60) * 0.45;
  const sweetSpotYMin = 210 - timingWindowBonus;
  const sweetSpotYMax = 270 + timingWindowBonus;

  // Estado Físico em Refs para 60 FPS
  const simRef = useRef({
    player: { x: 200, y: 360, vx: 0, vy: -1.2, speed: 1.2 + (paceSkill - 60) * 0.015, radius: 14 },
    ball: {
      x: 200,
      y: 344,
      z: 0,
      vx: 0,
      vy: -1.2,
      vz: 0,
      radius: 8,
      baseRadius: 8,
      spinCurve: 0,
      friction: 0.99,
      gravity: 0.25,
      shotType: 'medium' as const,
      hasMotionTrail: false,
      trailPoints: [],
      screenShake: 0,
      isOffTarget: false,
      inFlight: true,
      bouncedCount: 0,
    } as BallPhysicsState,
    defender: { 
      x: 200, 
      y: 90, 
      vy: 1.8 + (defenderRating - 60) * 0.02, 
      radius: 14, 
      state: 'charging' as 'charging' | 'slide' | 'frozen' | 'beaten' 
    },
    actionExecuted: false,
    executionTime: 0,
  });

  // Reinicia a jogada para treino ou nova tentativa
  const resetDribble = useCallback(() => {
    const s = simRef.current;
    s.player = { x: 200, y: 360, vx: 0, vy: -1.2, speed: 1.2 + (paceSkill - 60) * 0.015, radius: 14 };
    s.ball = {
      x: 200,
      y: 344,
      z: 0,
      vx: 0,
      vy: -1.2,
      vz: 0,
      radius: 8,
      baseRadius: 8,
      spinCurve: 0,
      friction: 0.99,
      gravity: 0.25,
      shotType: 'medium',
      hasMotionTrail: false,
      trailPoints: [],
      screenShake: 0,
      isOffTarget: false,
      inFlight: true,
      bouncedCount: 0,
    };
    s.defender = { 
      x: 200, 
      y: 90, 
      vy: 1.8 + (defenderRating - 60) * 0.02, 
      radius: 14, 
      state: 'charging' 
    };
    s.actionExecuted = false;
    s.executionTime = 0;
    setGameState('approaching');
    setChosenDribble(null);
    setFeedbackText('O zagueiro está vindo dar o bote! Escolha o momento e a finta certa!');
    setCommentaryText('');
    setScreenShakeIntensity(0);
  }, [paceSkill, defenderRating]);

  // Execução do Drible pelo Jogador
  const executeDribble = (type: DribbleActionType) => {
    const s = simRef.current;
    if (s.actionExecuted || gameState !== 'approaching') return;

    s.actionExecuted = true;
    s.executionTime = Date.now();
    setChosenDribble(type);
    setAttempts((prev) => prev + 1);

    const distance = Math.abs(s.player.y - s.defender.y);
    const inSweetSpot = distance >= 40 && distance <= 95 + timingWindowBonus;

    if (inSweetSpot) {
      // SUCESSO NO DRIBLE!
      let category: CommentaryCategory = 'dribble_plastico';
      let bonusRating = 0.35;

      if (type === 'lob') {
        // Chapéu: A bola sobe alto no eixo Z com sombra no chão
        category = 'dribble_chapeu';
        bonusRating = 0.5;
        s.ball.vz = 5.0;
        s.ball.hasMotionTrail = true;
        s.defender.state = 'slide'; // Zagueiro deu carrinho no vazio
        s.player.vy = -2.8; // Arranca por trás do zagueiro
      } else if (type === 'nutmeg') {
        // Caneta: Passa reto entre as pernas
        category = 'dribble_caneta';
        bonusRating = 0.5;
        s.ball.vy = -4.5; // Bola acelera reto
        s.defender.state = 'frozen'; // Zagueiro fica estático olhando
        s.player.vy = -3.2;
      } else if (type === 'elastic') {
        // Elástico: Corte lateral rápido
        category = 'dribble_elastico';
        bonusRating = 0.4;
        s.player.vx = Math.random() > 0.5 ? -3.5 : 3.5;
        s.ball.vx = s.player.vx;
        s.defender.state = 'beaten';
      } else {
        // Pedalada / Finta rápida
        category = 'dribble_plastico';
        bonusRating = 0.35;
        s.defender.state = 'frozen';
        s.player.vy = -2.5;
      }

      const comment = getCommentary(category, actorName, defenderName);
      setCommentaryText(comment);
      setFeedbackText(`🌟 DRIBLE ESPETACULAR! ${comment}`);
      setGameState('success');
      setSuccessfulDribbles((prev) => prev + 1);

      sound.playCheer();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#facc15'],
      });

      onDribbleSuccess?.(type, bonusRating);
    } else {
      // FALHA: Timing antecipado ou atrasado
      sound.playKick();
      setScreenShakeIntensity(4.5);

      // Chance de sofrer falta se o zagueiro foi imprudente
      if (Math.random() < 0.35) {
        setGameState('failed_foul');
        s.defender.state = 'slide';
        const comment = getCommentary('dribble_fail_foul', actorName, defenderName);
        setCommentaryText(comment);
        setFeedbackText(`⚠️ FALTA PERIGOSA! ${comment}`);
        sound.playWhistle();
        onDribbleFail?.('foul');
      } else {
        setGameState('failed_tackle');
        s.defender.state = 'beaten';
        const comment = getCommentary('dribble_fail_tackle', actorName, defenderName);
        setCommentaryText(comment);
        setFeedbackText(`❌ DESARMADO! ${comment}`);
        onDribbleFail?.('tackle');
      }
    }
  };

  // Suporte a Atalhos de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'approaching') return;
      if (e.key === '1' || e.key === 'a' || e.key === 'A') executeDribble('elastic');
      if (e.key === '2' || e.key === 'w' || e.key === 'W') executeDribble('nutmeg');
      if (e.key === '3' || e.key === ' ') executeDribble('lob');
      if (e.key === '4' || e.key === 'd' || e.key === 'D') executeDribble('stepover');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Loop Principal de Física e Renderização Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = simRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.save();

      // Screen Shake se houver impacto
      if (screenShakeIntensity > 0) {
        applyScreenShake(ctx, screenShakeIntensity);
      }

      // 1. Gramado Verde com Listras Horizontais
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, w, h);

      const stripeHeight = 28;
      for (let y = 0; y < h; y += stripeHeight * 2) {
        ctx.fillStyle = '#047857';
        ctx.fillRect(0, y, w, stripeHeight);
      }

      // Linhas brancas laterais e linha de grande área ao fundo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 10, w - 40, h - 20);

      // Linha tracejada da Zona de Decisão (Sweet Spot visual)
      const distToDef = Math.abs(s.player.y - s.defender.y);
      const isGreenZone = distToDef >= 45 && distToDef <= 95 + timingWindowBonus;

      ctx.strokeStyle = isGreenZone ? 'rgba(52, 211, 153, 0.6)' : 'rgba(251, 191, 36, 0.25)';
      ctx.lineWidth = isGreenZone ? 3 : 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(s.defender.x, s.defender.y, 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Movimento dos Personagens
      if (gameState === 'approaching') {
        s.player.y += s.player.vy;
        s.ball.y = s.player.y - 14;
        s.ball.x = s.player.x;

        // Marcador avança para dar o bote
        if (s.defender.state === 'charging') {
          s.defender.y += s.defender.vy;
        }

        // Se passarem um pelo outro sem drible, é desarme por choque
        if (s.player.y <= s.defender.y + 12 && !s.actionExecuted) {
          executeDribble('elastic'); // Dispara desarme automático por hesitação
        }
      } else if (gameState === 'success') {
        // Atacante avança livre após o drible
        s.player.y -= 3.5;
        s.player.x += s.player.vx;
        s.player.vx *= 0.95;

        // Atualiza física da bola
        s.ball.y += s.ball.vy;
        s.ball.x += s.ball.vx;
        s.ball.z += s.ball.vz;
        s.ball.vz -= s.ball.gravity;
        if (s.ball.z < 0) s.ball.z = 0;
      }

      // 3. Renderiza o Marcador Adversário (Uniforme Vermelho/Escuro)
      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(s.defender.x, s.defender.y + 8, s.defender.radius, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo
      ctx.fillStyle = s.defender.state === 'slide' ? '#dc2626' : '#ef4444';
      ctx.beginPath();
      ctx.arc(s.defender.x, s.defender.y, s.defender.radius, 0, Math.PI * 2);
      ctx.fill();

      // Faixa / Número
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.defender.state === 'slide' ? '⚡' : 'DEF', s.defender.x, s.defender.y + 3);

      // Nome do Marcador acima
      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`${defenderName} (${defenderRating})`, s.defender.x, s.defender.y - 18);

      // 4. Renderiza o Atacante (Jogador do Usuário - Camisa Verde/Dourada)
      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(s.player.x, s.player.y + 8, s.player.radius, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo do Atacante
      ctx.fillStyle = '#10b981'; // Verde Oficial
      ctx.beginPath();
      ctx.arc(s.player.x, s.player.y, s.player.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VOCÊ', s.player.x, s.player.y + 3);

      // Nome do Atacante abaixo
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(actorName, s.player.x, s.player.y + 26);

      // 5. Renderiza a Bola com Sombra e Efeito de Altura Z (Chapéu/Passe)
      renderBallWithShadow(ctx, s.ball);

      ctx.restore();

      // Decai screen shake
      setScreenShakeIntensity((prev) => Math.max(0, prev - 0.2));

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [gameState, screenShakeIntensity, actorName, defenderName, defenderRating, timingWindowBonus]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-in fade-in">
      
      {/* Topo: Placar e Dicas */}
      <div className="w-full flex items-center justify-between border-b border-border pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <Zap className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-black text-foreground uppercase tracking-wide">
              Duelo 1 contra 1 • Minigame de Drible
            </h3>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Seu Drible: <strong className="text-emerald-400">{dribbleSkill}</strong> • Ritmo: <strong className="text-amber-400">{paceSkill}</strong>
            </span>
          </div>
        </div>

        {mode === 'training' && (
          <div className="text-right">
            <span className="text-xs font-mono font-black text-emerald-400">
              {successfulDribbles}/{attempts}
            </span>
            <span className="text-[9px] text-muted-foreground block uppercase font-bold">
              Acertos
            </span>
          </div>
        )}
      </div>

      {/* Canvas 2D Interativo */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-inner bg-zinc-950 flex justify-center touch-none select-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-auto aspect-square max-h-[380px] touch-none select-none cursor-pointer"
          onClick={() => {
            if (gameState === 'approaching') executeDribble('stepover');
          }}
          onTouchStart={(e) => {
            if (e.touches && e.touches.length > 0 && gameState === 'approaching') {
              e.preventDefault();
              executeDribble('stepover');
            }
          }}
        />

        {/* Overlay de Sucesso ou Falha */}
        {gameState !== 'approaching' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95 duration-150">
            {gameState === 'success' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <span className="font-display text-lg font-black text-emerald-400 uppercase tracking-wider">
                  Drible Desconcertante!
                </span>
                <p className="text-xs text-foreground font-semibold mt-1 max-w-[280px]">
                  {commentaryText}
                </p>
                <span className="text-[10px] text-amber-300 font-bold mt-2 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                  ⭐ +0.4 Nota na Partida • Moral da Torcida ↑
                </span>

                <div className="flex items-center gap-2 mt-4 w-full max-w-[260px]">
                  {mode === 'match_clutch' && onAdvanceToShot ? (
                    <button
                      onClick={onAdvanceToShot}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      Avançar para o Chute!
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={resetDribble}
                      className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Próxima Finta
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 shadow-lg shadow-rose-500/30">
                  {gameState === 'failed_foul' ? <ShieldAlert className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                </div>
                <span className="font-display text-base font-black text-rose-400 uppercase tracking-wider">
                  {gameState === 'failed_foul' ? 'Falta Dura Sofrida!' : 'Desarmado pelo Marcador!'}
                </span>
                <p className="text-xs text-foreground font-semibold mt-1 max-w-[280px]">
                  {commentaryText}
                </p>

                <div className="flex items-center gap-2 mt-4 w-full max-w-[220px]">
                  <button
                    onClick={resetDribble}
                    className="w-full py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tentar Novamente
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Banner de Feedback / Narração */}
      <div className="w-full mt-2.5 p-2 rounded-xl bg-secondary/50 border border-border text-center">
        <p className="text-[11px] font-semibold text-muted-foreground truncate">
          {feedbackText}
        </p>
      </div>

      {/* 4 Botões Táteis Rápidos de Drible (Mobile & PC) */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3 select-none">
        {/* 1. Corte / Elástico */}
        <button
          type="button"
          onClick={() => executeDribble('elastic')}
          disabled={gameState !== 'approaching'}
          className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-left transition-transform active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-2 touch-manipulation select-none"
        >
          <span className="text-xl">⚡</span>
          <div>
            <span className="font-display text-xs font-black text-foreground block leading-tight">
              Corte / Elástico
            </span>
            <span className="text-[10px] text-muted-foreground block">
              Desvio lateral ágil [A]
            </span>
          </div>
        </button>

        {/* 2. Caneta (Rolinho) */}
        <button
          type="button"
          onClick={() => executeDribble('nutmeg')}
          disabled={gameState !== 'approaching'}
          className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-left transition-transform active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-2 touch-manipulation select-none"
        >
          <span className="text-xl">👖</span>
          <div>
            <span className="font-display text-xs font-black text-foreground block leading-tight">
              Caneta (Rolinho)
            </span>
            <span className="text-[10px] text-muted-foreground block">
              Entre as pernas [W]
            </span>
          </div>
        </button>

        {/* 3. Chapéu (Lençol) */}
        <button
          type="button"
          onClick={() => executeDribble('lob')}
          disabled={gameState !== 'approaching'}
          className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-400/10 hover:from-amber-500/25 border border-amber-500/30 text-left transition-transform active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-2 touch-manipulation select-none"
        >
          <span className="text-xl">🎩</span>
          <div>
            <span className="font-display text-xs font-black text-amber-400 block leading-tight">
              Chapéu (Lençol)
            </span>
            <span className="text-[10px] text-muted-foreground block">
              Por cima do carrinho [Espaço]
            </span>
          </div>
        </button>

        {/* 4. Drible Plástico / Pedalada */}
        <button
          type="button"
          onClick={() => executeDribble('stepover')}
          disabled={gameState !== 'approaching'}
          className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-left transition-transform active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-2 touch-manipulation select-none"
        >
          <span className="text-xl">✨</span>
          <div>
            <span className="font-display text-xs font-black text-foreground block leading-tight">
              Pedalada & Finta
            </span>
            <span className="text-[10px] text-muted-foreground block">
              Congela o zagueiro [D]
            </span>
          </div>
        </button>
      </div>

      {mode === 'training' && onClose && (
        <button
          onClick={onClose}
          className="mt-3 text-[11px] font-bold text-muted-foreground hover:text-foreground underline cursor-pointer"
        >
          Encerrar Treino de Dribles
        </button>
      )}
    </div>
  );
}
