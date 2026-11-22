'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Info,
  Zap,
  Target
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import { getCommentary, CommentaryCategory } from '@/engine/commentary';
import { 
  renderBallWithShadow, 
  applyScreenShake,
  calculateShotPhysics,
  BallPhysicsState 
} from '@/engine/ballPhysics';

interface NSSPenaltyMinigameProps {
  onScoreGoal?: (ratingBonus: number) => void;
  onMiss?: () => void;
  onClose?: () => void;
  mode?: 'training' | 'match_clutch';
  matchInfo?: {
    minute: number;
    oppClubName: string;
    currentScore: string;
  };
}

export function NSSPenaltyMinigame({
  onScoreGoal,
  onMiss,
  onClose,
  mode = 'training',
  matchInfo,
}: NSSPenaltyMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerProfile = useGameStore((s) => s.playerProfile);

  // Estados do Jogo
  const [attempts, setAttempts] = useState(0);
  const [goals, setGoals] = useState(0);
  const [shotResult, setShotResult] = useState<'idle' | 'aiming' | 'shooting' | 'goal' | 'saved' | 'woodwork' | 'out'>('idle');
  const [feedbackText, setFeedbackText] = useState('Toque na bola para escolher onde chutar, mire no gol e trave a força!');
  const [curve, setCurve] = useState<number>(0); // -1 (curva esquerda) a +1 (curva direita)
  const [power, setPower] = useState<number>(50); // Barra de Força 0 a 100%
  const [powerLocked, setPowerLocked] = useState<boolean>(false);

  // Ponto de Impacto da Chuteira na Bola (New Star Soccer / Score Hero style)
  // x: -1 (lateral esquerda) a +1 (lateral direita)
  // y: -1 (topo da bola) a +1 (embaixo da bola)
  const [impactPoint, setImpactPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0.35 });
  const [isDraggingBall, setIsDraggingBall] = useState<boolean>(false);

  // Oscilação Contínua da Barra de Força estilo New Star Soccer
  useEffect(() => {
    if (shotResult === 'shooting' || gameStateRef.current.inPlay) return;

    let dir = 1;
    const interval = setInterval(() => {
      setPower((p) => {
        let next = p + dir * 3.5;
        if (next >= 100) {
          next = 100;
          dir = -1;
        } else if (next <= 10) {
          next = 10;
          dir = 1;
        }
        return Math.round(next);
      });
    }, 35);

    return () => clearInterval(interval);
  }, [shotResult]);

  // Calibrações Físicas do Jogador
  const isTall = (playerProfile?.height || 178) >= 188;
  const isShort = (playerProfile?.height || 178) <= 172;
  const foot = playerProfile?.preferredFoot || 'right';

  // Manipulação do Ponto de Impacto na Bola (New Star Soccer style)
  const handleBallContact = (clientX: number, clientY: number, targetElem: HTMLElement) => {
    const rect = targetElem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relX = clientX - centerX;
    const relY = clientY - centerY;
    const radius = rect.width / 2;

    const dist = Math.hypot(relX, relY);
    const maxRadius = radius * 0.88;
    const clampedDist = Math.min(maxRadius, dist);
    const angle = Math.atan2(relY, relX);

    const normX = Number(((Math.cos(angle) * clampedDist) / maxRadius).toFixed(2));
    const normY = Number(((Math.sin(angle) * clampedDist) / maxRadius).toFixed(2));

    setImpactPoint({ x: normX, y: normY });
    if (normX < -0.25) setCurve(0.8);
    else if (normX > 0.25) setCurve(-0.8);
    else setCurve(0);
  };

  const setImpactPreset = (x: number, y: number, name: string) => {
    setImpactPoint({ x, y });
    if (x < -0.25) setCurve(0.8);
    else if (x > 0.25) setCurve(-0.8);
    else setCurve(0);
    setFeedbackText(`🎯 Ponto Definido: ${name}`);
  };

  // Referências físicas
  const gameStateRef = useRef({
    ball: { 
      x: 200, 
      y: 310, 
      z: 0, 
      vx: 0, 
      vy: 0, 
      vz: 0, 
      radius: 10,
      baseRadius: 10,
      shotType: 'medium' as 'weak' | 'medium' | 'power' | 'lob',
      hasMotionTrail: false,
      trailPoints: [] as { x: number; y: number; z: number; alpha: number }[],
      screenShake: 0,
      isOffTarget: false,
      offTargetReason: undefined as 'high' | 'wide_left' | 'wide_right' | undefined,
    },
    goal: { x: 50, y: 55, width: 300, height: 110 },
    keeper: { x: 200, y: 140, targetX: 200, width: 44, height: 50, diving: false, diveVx: 0 },
    aim: { active: false, startX: 200, startY: 310, targetX: 200, targetY: 100, power: 0 },
    inPlay: false,
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
  });

  const resetBall = useCallback(() => {
    const s = gameStateRef.current;
    s.ball = { 
      x: 200, 
      y: 310, 
      z: 0, 
      vx: 0, 
      vy: 0, 
      vz: 0, 
      radius: 10,
      baseRadius: 10,
      shotType: 'medium',
      hasMotionTrail: false,
      trailPoints: [],
      screenShake: 0,
      isOffTarget: false,
      offTargetReason: undefined,
    };
    s.keeper = { x: 200, y: 140, targetX: 200, width: 44, height: 50, diving: false, diveVx: 0 };
    s.aim.active = false;
    s.inPlay = false;
    setShotResult('idle');
    setFeedbackText('Toque ou arraste no gol para mirar e soltar o chute!');
  }, []);

  // Loop de Animação e Física em Canvas2D Puro
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = gameStateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.save();
      if (s.ball.screenShake > 0) {
        applyScreenShake(ctx, s.ball.screenShake);
        s.ball.screenShake = Math.max(0, s.ball.screenShake - 0.35);
      }

      // 1. Gramado Verde com Listras
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, width, height);

      // Faixas de grama cortada
      const stripeHeight = 24;
      for (let y = 0; y < height; y += stripeHeight * 2) {
        ctx.fillStyle = '#047857';
        ctx.fillRect(0, y, width, stripeHeight);
      }

      // Pequena área / Linha da Grande Área
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 40, width - 60, 160);
      ctx.beginPath();
      ctx.arc(width / 2, 200, 45, 0, Math.PI);
      ctx.stroke();

      // Ponto do Pênalti
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(width / 2, 310, 4, 0, Math.PI * 2);
      ctx.fill();

      // 2. Trave e Rede (Visual New Star Soccer)
      const gx = s.goal.x;
      const gy = s.goal.y;
      const gw = s.goal.width;
      const gh = s.goal.height;

      // Fundo e Rede do Gol
      ctx.fillStyle = 'rgba(10, 30, 20, 0.7)';
      ctx.fillRect(gx, gy, gw, gh);

      // Malha da Rede
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let rx = gx; rx <= gx + gw; rx += 14) {
        ctx.beginPath();
        ctx.moveTo(rx, gy);
        ctx.lineTo(rx, gy + gh);
        ctx.stroke();
      }
      for (let ry = gy; ry <= gy + gh; ry += 12) {
        ctx.beginPath();
        ctx.moveTo(gx, ry);
        ctx.lineTo(gx + gw, ry);
        ctx.stroke();
      }

      // Postes e Travessão da Trave (Grossura e Sombra 3D leve em 2D)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(gx, gy + gh);
      ctx.lineTo(gx, gy);
      ctx.lineTo(gx + gw, gy);
      ctx.lineTo(gx + gw, gy + gh);
      ctx.stroke();

      // 3. Goleiro (IA Simples de Reação)
      const k = s.keeper;
      if (!s.inPlay) {
        // Balanço de prontidão do goleiro
        k.x = 200 + Math.sin(Date.now() * 0.003) * 25;
      } else if (k.diving) {
        k.x += k.diveVx;
      }

      // Desenha o Goleiro em 2D
      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(k.x, k.y + 18, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo / Uniforme do Goleiro
      ctx.fillStyle = '#eab308'; // Camisa amarela clássica de goleiro
      ctx.beginPath();
      ctx.roundRect(k.x - 14, k.y - 12, 28, 26, 6);
      ctx.fill();

      // Cabeça
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(k.x, k.y - 18, 8, 0, Math.PI * 2);
      ctx.fill();

      // Luvas
      ctx.fillStyle = '#ffffff';
      const armSpread = k.diving ? 24 : 16;
      ctx.beginPath();
      ctx.arc(k.x - armSpread, k.y - 4, 6, 0, Math.PI * 2);
      ctx.arc(k.x + armSpread, k.y - 4, 6, 0, Math.PI * 2);
      ctx.fill();

      // Calção
      ctx.fillStyle = '#18181b';
      ctx.fillRect(k.x - 10, k.y + 14, 20, 10);

      // 4. Linha de Mira do Chute (Se o jogador estiver mirando)
      if (s.aim.active) {
        const ax = s.aim.targetX;
        const ay = s.aim.targetY;

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(s.ball.x, s.ball.y);
        ctx.lineTo(ax, ay);
        ctx.stroke();
        ctx.setLineDash([]);

        // Mira / Alvo no Gol
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ax, ay, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ax - 16, ay);
        ctx.lineTo(ax + 16, ay);
        ctx.moveTo(ax, ay - 16);
        ctx.lineTo(ax, ay + 16);
        ctx.stroke();
      }

      // 5. Física da Bola em Movimento
      const b = s.ball;
      const actorName = playerProfile?.nickname || playerProfile?.name || 'Craque';
      const oppClub = matchInfo?.oppClubName || 'Adversário';

      if (s.inPlay) {
        b.x += b.vx + (curve * 0.4);
        b.y += b.vy;
        b.z += b.vz;
        b.vz -= 0.16; // Gravidade
        if (b.z < 0) b.z = 0;

        // Guarda pontos para Motion Trail
        if (b.hasMotionTrail) {
          b.trailPoints.push({ x: b.x, y: b.y, z: b.z, alpha: 1.0 });
          if (b.trailPoints.length > 7) b.trailPoints.shift();
          for (const p of b.trailPoints) p.alpha = Math.max(0, p.alpha - 0.14);
        }

        // Checagem de Colisão com a Linha do Gol
        const distToKeeper = Math.hypot(b.x - k.x, b.y - k.y);
        const inGoalX = b.x >= gx + 8 && b.x <= gx + gw - 8;
        const inGoalY = b.y >= gy && b.y <= gy + gh;
        const hitsWoodwork = (
          (Math.abs(b.x - gx) < 14 && b.y <= gy + gh + 10 && b.y >= gy - 10) || 
          (Math.abs(b.x - (gx + gw)) < 14 && b.y <= gy + gh + 10 && b.y >= gy - 10) || 
          (Math.abs(b.y - gy) < 14 && b.x >= gx - 10 && b.x <= gx + gw + 10)
        );

        if (distToKeeper < 26 && b.y <= gy + 25) {
          // Defesa do Goleiro!
          s.inPlay = false;
          setShotResult('saved');
          if (b.shotType === 'weak') {
            setFeedbackText(getCommentary('shot_weak', actorName, oppClub));
          } else if (b.shotType === 'power') {
            setFeedbackText(getCommentary('shot_power_saved', actorName, oppClub));
          } else {
            setFeedbackText('🧤 DEFESAÇA DO GOLEIRO! O paredão buscou no canto!');
          }
          onMiss?.();
        } else if (hitsWoodwork && b.y <= gy + 20) {
          // Na Trave!
          s.inPlay = false;
          setShotResult('woodwork');
          b.screenShake = 8;
          setFeedbackText(getCommentary('shot_woodwork', actorName, oppClub));
          sound.playWoodwork();
          onMiss?.();
        } else if (inGoalX && inGoalY && b.y <= gy + 20 && b.z < 35) {
          // GOL!
          s.inPlay = false;
          setShotResult('goal');
          setGoals((prev) => prev + 1);
          b.screenShake = b.shotType === 'power' ? 6 : 2;
          if (b.shotType === 'power') {
            setFeedbackText(getCommentary('shot_power_goal', actorName, oppClub));
          } else {
            setFeedbackText('⚽ GOOOOOOOOOL! NA GAVETA! QUE PINTURA!');
          }
          confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
          sound.playGoal();
          onScoreGoal?.(1.5);
        } else if (b.y <= -30 || b.x < -30 || b.x > width + 30) {
          // Pra Fora! Animação contínua até sair pela linha de fundo
          s.inPlay = false;
          setShotResult('out');
          if (b.y <= -30 || b.offTargetReason === 'high' || b.vz > 3.0) {
            setFeedbackText(getCommentary('shot_off_target_high', actorName, oppClub));
          } else {
            setFeedbackText(getCommentary('shot_off_target_wide', actorName, oppClub));
          }
          onMiss?.();
        }
      }

      // Renderiza a Bola com Sombra e Efeito de Altura 3D Realista
      renderBallWithShadow(ctx, b as any, { 
        perspectiveProgress: Math.max(0.4, (b.y - 40) / 270) 
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [curve, onScoreGoal, onMiss]);

  // Controles de Mira do Chute (Touch ou Mouse)
  const handleAimStart = (clientX: number, clientY: number) => {
    if (shotResult === 'shooting' || gameStateRef.current.inPlay) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    gameStateRef.current.aim.active = true;
    gameStateRef.current.aim.targetX = Math.max(40, Math.min(360, x));
    gameStateRef.current.aim.targetY = Math.max(50, Math.min(180, y));
    setShotResult('aiming');
  };

  const handleAimMove = (clientX: number, clientY: number) => {
    if (!gameStateRef.current.aim.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    gameStateRef.current.aim.targetX = Math.max(40, Math.min(360, x));
    gameStateRef.current.aim.targetY = Math.max(50, Math.min(180, y));
  };

  const handleAimRelease = () => {
    const s = gameStateRef.current;
    if (s.inPlay) return;

    // Se o usuário não mirou arrastando, mira no canto superior oposto
    if (!s.aim.active) {
      s.aim.targetX = Math.random() > 0.5 ? 90 : 310;
      s.aim.targetY = 90;
    }

    s.aim.active = false;
    s.inPlay = true;
    setShotResult('shooting');
    setAttempts((prev) => prev + 1);
    sound.playKick();

    // Calcula vetor de mira e distância
    const dx = s.aim.targetX - s.ball.x;
    const dy = s.aim.targetY - s.ball.y;
    const dist = Math.hypot(dx, dy) || 1;

    // Calcula física do chute realista com base nos atributos do atleta, barra de força e ponto de impacto
    const physics = calculateShotPhysics({
      startX: s.ball.x,
      startY: s.ball.y,
      targetX: s.aim.targetX,
      targetY: s.aim.targetY,
      power,
      curve,
      impactPoint,
      finishingAttr: playerProfile?.attributes.shooting || 68,
      composureAttr: playerProfile?.attributes.dribbling || 65,
      preferredFoot: foot,
    });

    s.ball.vx = physics.ball.vx;
    s.ball.vy = physics.ball.vy;
    s.ball.vz = physics.ball.vz;
    s.ball.shotType = physics.shotType;
    s.ball.hasMotionTrail = physics.ball.hasMotionTrail;
    s.ball.screenShake = physics.ball.screenShake;
    s.ball.isOffTarget = physics.ball.isOffTarget;
    s.ball.offTargetReason = physics.ball.offTargetReason;
    (s.ball as any).spinCurve = physics.ball.spinCurve;
    (s.ball as any).rotationSpeed = physics.ball.rotationSpeed;
    (s.ball as any).rotationAngle = 0;

    if (physics.shotType === 'power') {
      setFeedbackText(`💣 BOMBAÇO! ${physics.impactLabel} (${power}% de força)!`);
    } else if (physics.shotType === 'weak') {
      setFeedbackText(`🐢 Chute mascado! ${physics.impactLabel} (${power}% de força).`);
    } else {
      setFeedbackText(`🎯 ${physics.impactLabel} (${power}% de força)!`);
    }

    // Goleiro decide o lado do pulo (70% de chance de adivinhar o lado aproximado)
    const jumpLeft = s.aim.targetX < 200;
    const guessRight = Math.random() < (power < 38 ? 0.85 : power >= 60 && power <= 85 ? 0.45 : 0.65);
    s.keeper.diving = true;
    s.keeper.diveVx = (jumpLeft ? (guessRight ? -3.2 : 2.5) : (guessRight ? 3.2 : -2.5));
  };

  return (
    <div className="bg-card text-foreground border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl max-w-lg w-full mx-auto relative overflow-hidden flex flex-col space-y-4">
      {/* Topo: Informações do Lance */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-lg">
            ⚽
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block">
              {mode === 'match_clutch' ? 'Momento Decisivo da Partida' : 'Minigame New Star Soccer'}
            </span>
            <h3 className="font-display text-base sm:text-lg font-black text-foreground">
              {mode === 'match_clutch' 
                ? `Cobrança aos ${matchInfo?.minute || 44}' • vs ${matchInfo?.oppClubName || 'Rival'}` 
                : 'Treino de Finalização e Pênaltis'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground font-mono">
            {goals}/{attempts} Gols
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Canvas 2D Interativo */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-inner bg-zinc-950 w-full max-w-[400px] h-[340px] touch-none select-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={340}
          className="w-full h-full cursor-crosshair"
          onMouseDown={(e) => handleAimStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleAimMove(e.clientX, e.clientY)}
          onMouseUp={handleAimRelease}
          onTouchStart={(e) => {
            if (e.touches[0]) handleAimStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handleAimMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handleAimRelease}
        />

        {/* Feedback Sobreposto em Gols */}
        {shotResult === 'goal' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-in zoom-in-95 duration-200 pointer-events-none">
            <div className="text-center">
              <span className="font-display text-4xl sm:text-5xl font-black text-emerald-400 drop-shadow-lg block animate-bounce">
                GOLAÇO!
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-100 bg-emerald-600 px-3 py-1 rounded-full">
                Nota +1.5 na Partida ⭐
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Força Estilo New Star Soccer */}
      <div className="p-3 rounded-2xl bg-secondary/50 border border-border space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-foreground">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Barra de Força:
          </span>
          <span className={`font-mono font-black px-2 py-0.5 rounded text-[11px] ${
            power > 88 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
              : power >= 60 && power <= 85 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
              : 'bg-blue-500/20 text-blue-400'
          }`}>
            {power}% {power > 88 ? '• ISOLOU! 🚀' : power >= 60 && power <= 85 ? '• ZONA IDEAL 🔥' : '• Fraco'}
          </span>
        </div>

        {/* Trilho da Barra de Força */}
        <div className="relative w-full h-4 bg-zinc-950 rounded-full overflow-hidden border border-border">
          {/* Zona Azul Fraca (0-35%) */}
          <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-blue-500/60" />
          {/* Zona Neutra (35-60%) */}
          <div className="absolute left-[35%] top-0 bottom-0 w-[25%] bg-yellow-500/60" />
          {/* Zona Verde Ideal (60-85%) */}
          <div className="absolute left-[60%] top-0 bottom-0 w-[25%] bg-emerald-500 animate-pulse" />
          {/* Zona Vermelha Isolou (85-100%) */}
          <div className="absolute left-[85%] top-0 bottom-0 w-[15%] bg-rose-600" />

          {/* Marcador de Força Móvel */}
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-white shadow-[0_0_8px_#ffffff] rounded-full -ml-1 transition-all duration-75 pointer-events-none"
            style={{ left: `${power}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold px-0.5">
          <span>0% Fraco</span>
          <span className="text-emerald-400 font-black">60%-85% Ideal ⭐</span>
          <span className="text-rose-400 font-black">100% Isolou</span>
        </div>

        {/* Botão de Disparo por Clique com Força Atual */}
        {shotResult === 'idle' && (
          <button
            type="button"
            onClick={handleAimRelease}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Chutar com Força Atual ({power}%)
          </button>
        )}
      </div>

      {/* Seletor de Ponto de Impacto na Bola (New Star Soccer / Score Hero Style) */}
      <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border flex flex-col space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>Ponto de Impacto na Bola (Efeito & Altura):</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            {foot === 'left' ? '🦶 Canhoto' : foot === 'right' ? '🦵 Destro' : '⚡ Ambidestro'} · {playerProfile?.height || 178}cm
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3.5">
          {/* Bola de Futebol Interativa com Ponto de Contato Tátil */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className="relative w-28 h-28 rounded-full bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-400 border-2 border-zinc-900 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_-8px_16px_rgba(0,0,0,0.4)] cursor-pointer touch-none select-none overflow-hidden"
              onMouseDown={(e) => {
                setIsDraggingBall(true);
                handleBallContact(e.clientX, e.clientY, e.currentTarget);
              }}
              onMouseMove={(e) => {
                if (isDraggingBall) handleBallContact(e.clientX, e.clientY, e.currentTarget);
              }}
              onMouseUp={() => setIsDraggingBall(false)}
              onMouseLeave={() => setIsDraggingBall(false)}
              onTouchStart={(e) => {
                if (e.touches[0]) handleBallContact(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) handleBallContact(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
              }}
            >
              {/* Textura Clássica da Bola com Gomos Pretos */}
              {/* Gomo Central */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 rounded-[6px] rotate-12 opacity-85 pointer-events-none" />
              {/* Gomos Periféricos */}
              <div className="absolute top-1 left-7 w-6 h-5 bg-zinc-900 rounded-[5px] -rotate-12 opacity-80 pointer-events-none" />
              <div className="absolute bottom-2 left-6 w-6 h-5 bg-zinc-900 rounded-[5px] rotate-45 opacity-80 pointer-events-none" />
              <div className="absolute top-6 -left-2 w-5 h-6 bg-zinc-900 rounded-[5px] opacity-80 pointer-events-none" />
              <div className="absolute top-6 -right-2 w-5 h-6 bg-zinc-900 rounded-[5px] opacity-80 pointer-events-none" />
              <div className="absolute bottom-2 right-6 w-6 h-5 bg-zinc-900 rounded-[5px] -rotate-45 opacity-80 pointer-events-none" />
              <div className="absolute top-1 right-7 w-6 h-5 bg-zinc-900 rounded-[5px] rotate-12 opacity-80 pointer-events-none" />

              {/* Brilho Superior 3D */}
              <div className="absolute top-1 left-3 w-16 h-8 bg-white/45 rounded-full blur-[2px] pointer-events-none -rotate-12" />

              {/* Linhas de Mira Cruzadas (Guias) */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-zinc-500/30 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-zinc-500/30 pointer-events-none" />

              {/* Cursor Vermelho de Ponto de Impacto (Onde a chuteira bate) */}
              <div
                className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-rose-500 border-2 border-white shadow-[0_0_10px_#ef4444] flex items-center justify-center transition-all duration-75 pointer-events-none"
                style={{
                  left: `${50 + impactPoint.x * 40}%`,
                  top: `${50 + impactPoint.y * 40}%`,
                }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-bold mt-1 text-center">
              Toque ou arraste na bola
            </span>
          </div>

          {/* Presets Rápidos e Diagnóstico do Chute */}
          <div className="flex-1 space-y-2 w-full">
            {/* Rótulo de Diagnóstico do Efeito Físico */}
            <div className="px-2.5 py-1.5 rounded-xl bg-card border border-border flex items-center justify-between text-[11px] font-bold">
              <span className="text-muted-foreground">Efeito Físico:</span>
              <span className="text-emerald-400 font-black truncate max-w-[210px] text-right">
                {impactPoint.y > 0.25 
                  ? (impactPoint.x < -0.2 ? '⬆️ Sobe com Curva Direita' : impactPoint.x > 0.2 ? '⬆️ Sobe com Curva Esquerda' : '⬆️ Bola Sobe (Cavadinha)') 
                  : impactPoint.y < -0.25 
                  ? (impactPoint.x < -0.2 ? '⬇️ Folha Seca Curvada' : impactPoint.x > 0.2 ? '⬇️ Mergulho com Curva' : '⬇️ Topspin (Mergulha)') 
                  : (impactPoint.x < -0.2 ? '↪️ Curva Direita (Trivela)' : impactPoint.x > 0.2 ? '↩️ Curva Esquerda (Chapa)' : '🎯 Chute Reto e Firme')}
              </span>
            </div>

            {/* Grid de 6 Presets Táticos */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => setImpactPreset(0, 0, 'Chute no Centro (Reta e Firme)')}
                className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all cursor-pointer truncate ${
                  impactPoint.x === 0 && impactPoint.y === 0 
                    ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm' 
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
                }`}
              >
                🎯 No Meio (Reta)
              </button>

              <button
                type="button"
                onClick={() => setImpactPreset(0, 0.75, 'Batida por Baixo (A Bola Sobe)')}
                className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all cursor-pointer truncate ${
                  impactPoint.y > 0.4 && Math.abs(impactPoint.x) <= 0.2 
                    ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm' 
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
                }`}
              >
                ⬆️ Por Baixo (Sobe)
              </button>

              <button
                type="button"
                onClick={() => setImpactPreset(0, -0.65, 'Batida no Topo (Topspin / Folha Seca)')}
                className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all cursor-pointer truncate ${
                  impactPoint.y < -0.4 && Math.abs(impactPoint.x) <= 0.2 
                    ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm' 
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
                }`}
              >
                ⬇️ Topo (Mergulha)
              </button>

              <button
                type="button"
                onClick={() => setImpactPreset(-0.75, 0.1, 'Batida na Lateral Esquerda (Curva para a Direita)')}
                className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all cursor-pointer truncate ${
                  impactPoint.x < -0.4 && Math.abs(impactPoint.y) <= 0.3 
                    ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm' 
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
                }`}
              >
                ↪️ Efeito Direita
              </button>

              <button
                type="button"
                onClick={() => setImpactPreset(0.75, 0.1, 'Batida na Lateral Direita (Curva para a Esquerda)')}
                className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all cursor-pointer truncate ${
                  impactPoint.x > 0.4 && Math.abs(impactPoint.y) <= 0.3 
                    ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm' 
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
                }`}
              >
                ↩️ Efeito Esquerda
              </button>

              <button
                type="button"
                onClick={() => setImpactPreset(-0.6, 0.6, 'Batida no Ângulo (Trivela / Gaveta)')}
                className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all cursor-pointer truncate ${
                  impactPoint.x < -0.3 && impactPoint.y > 0.3 
                    ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm' 
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
                }`}
              >
                ⭐ Ângulo / Gaveta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Texto de Instruções e Botão de Próximo Lance */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <p className="text-xs font-semibold text-muted-foreground text-center sm:text-left">
          {feedbackText}
        </p>

        {shotResult !== 'idle' && shotResult !== 'aiming' && shotResult !== 'shooting' && (
          <button
            type="button"
            onClick={resetBall}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0 shadow-md shadow-emerald-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Cobrar Novamente
          </button>
        )}
      </div>
    </div>
  );
}
