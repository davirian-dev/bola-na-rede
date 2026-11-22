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
  Wind,
  Target
} from 'lucide-react';
import { sound } from '@/lib/soundEffects';
import { BallImpactSelector, BallImpact } from './BallImpactSelector';
import { MatchWeatherType } from '@/types/game';

interface NSSFreeKickMinigameProps {
  onScoreGoal?: (ratingBonus: number) => void;
  onMiss?: () => void;
  onClose?: () => void;
  mode?: 'training' | 'match_clutch';
  weather?: MatchWeatherType;
  matchInfo?: {
    minute: number;
    oppClubName: string;
    currentScore: string;
  };
}

export function NSSFreeKickMinigame({
  onScoreGoal,
  onMiss,
  onClose,
  mode = 'training',
  weather = 'sunny',
  matchInfo,
}: NSSFreeKickMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerProfile = useGameStore((s) => s.playerProfile);

  // Distância da cobrança de falta (18m a 32m)
  const [distanceMeters] = useState<number>(() => Math.floor(Math.random() * 12) + 20);

  // Vento (-3 a +3 nós laterais)
  const [windKnots] = useState<number>(() => {
    if (weather === 'windy') return Math.floor(Math.random() * 7) - 3;
    return Math.floor(Math.random() * 3) - 1;
  });

  const [shotResult, setShotResult] = useState<'aiming' | 'shooting' | 'goal' | 'saved' | 'woodwork' | 'blocked' | 'out'>('aiming');
  const [feedbackText, setFeedbackText] = useState('Ajuste o efeito na bola, mire no canto e trave a força na barra!');
  const [power, setPower] = useState<number>(50);
  const [powerLocked, setPowerLocked] = useState<boolean>(false);
  const [impact, setImpact] = useState<BallImpact>({ x: 0.35, y: 0.4 }); // Efeito colocado padrão
  const [targetAim, setTargetAim] = useState<{ x: number; y: number }>({ x: 280, y: 130 });

  // Posições da Barreira e Goleiro
  const wallJumpOffsetRef = useRef<number>(0);
  const ballPosRef = useRef<{ x: number; y: number; z: number; vx: number; vy: number; vz: number }>({
    x: 280,
    y: 350,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
  });

  // Animação da barra de força
  useEffect(() => {
    if (shotResult !== 'aiming' || powerLocked) return;
    let dir = 1;
    const interval = setInterval(() => {
      setPower((p) => {
        let next = p + dir * 3.8;
        if (next >= 100) { next = 100; dir = -1; }
        else if (next <= 10) { next = 10; dir = 1; }
        return Math.round(next);
      });
    }, 45);
    return () => clearInterval(interval);
  }, [shotResult, powerLocked]);

  // Renderização do Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Gramado com perspectiva
      const grassGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grassGrad.addColorStop(0, '#15803d');
      grassGrad.addColorStop(1, '#166534');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Linhas da grande área
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(100, 240);
      ctx.lineTo(460, 240);
      ctx.stroke();

      // Meia-lua
      ctx.beginPath();
      ctx.arc(280, 240, 60, Math.PI, 0);
      ctx.stroke();

      // 2. Trave e Rede do Gol
      const goalLeft = 140;
      const goalRight = 420;
      const goalTop = 70;
      const goalBottom = 170;

      // Rede interna
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let x = goalLeft + 15; x < goalRight; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, goalTop);
        ctx.lineTo(x, goalBottom);
        ctx.stroke();
      }
      for (let y = goalTop + 15; y < goalBottom; y += 15) {
        ctx.beginPath();
        ctx.moveTo(goalLeft, y);
        ctx.lineTo(goalRight, y);
        ctx.stroke();
      }

      // Moldura da Trave (Postes brancos)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.strokeRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);

      // 3. Goleiro Adversário
      const gkX = 280;
      const gkY = goalBottom - 25;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(gkX, gkY - 14, 10, 0, Math.PI * 2); // Cabeça
      ctx.fill();
      ctx.fillRect(gkX - 8, gkY - 4, 16, 26); // Corpo
      // Luvas
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(gkX - 12, gkY + 2, 5, 0, Math.PI * 2);
      ctx.arc(gkX + 12, gkY + 2, 5, 0, Math.PI * 2);
      ctx.fill();

      // 4. Barreira de Defensores (4 jogadores pulando)
      const wallCount = 4;
      const wallStartX = 230;
      const wallBaseY = 245 - wallJumpOffsetRef.current;

      for (let i = 0; i < wallCount; i++) {
        const wx = wallStartX + i * 26;
        // Cabeça
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.arc(wx, wallBaseY - 26, 9, 0, Math.PI * 2);
        ctx.fill();
        // Camisa
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(wx - 8, wallBaseY - 16, 16, 28);
        // Pernas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(wx - 6, wallBaseY + 12, 4, 14);
        ctx.fillRect(wx + 2, wallBaseY + 12, 4, 14);
      }

      // Sombra da barreira no chão
      for (let i = 0; i < wallCount; i++) {
        const wx = wallStartX + i * 26;
        ctx.beginPath();
        ctx.ellipse(wx, 265, 10, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();
      }

      // 5. Mira do Chute (quando está mirando)
      if (shotResult === 'aiming') {
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetAim.x, targetAim.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(targetAim.x - 18, targetAim.y);
        ctx.lineTo(targetAim.x + 18, targetAim.y);
        ctx.moveTo(targetAim.x, targetAim.y - 18);
        ctx.lineTo(targetAim.x, targetAim.y + 18);
        ctx.stroke();

        // Linha pontilhada com prévia da curva
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
        ctx.beginPath();
        ctx.moveTo(ballPosRef.current.x, ballPosRef.current.y);
        const curveMidX = (ballPosRef.current.x + targetAim.x) / 2 + impact.x * 45;
        const curveMidY = (ballPosRef.current.y + targetAim.y) / 2 - impact.y * 30;
        ctx.quadraticCurveTo(curveMidX, curveMidY, targetAim.x, targetAim.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 6. Bola e Trajetória em Voo
      const ball = ballPosRef.current;
      if (shotResult === 'shooting') {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.z += ball.vz;
        ball.vz -= 0.18; // Gravidade

        // Efeito da curva e vento durante o voo
        ball.vx += (impact.x * 0.38) + (windKnots * 0.08);

        // Barreira pula aos poucos
        if (wallJumpOffsetRef.current < 20) {
          wallJumpOffsetRef.current += 1.8;
        }

        // Checagem de Colisão com a Barreira (quando atinge Y ~ 245)
        if (ball.y <= 255 && ball.y >= 235 && ball.z < 26) {
          if (ball.x >= 220 && ball.x <= 325) {
            setShotResult('blocked');
            setFeedbackText('Na barreira! A bola carimbou o zagueiro adversário!');
            sound.play('whistle');
            if (onMiss) onMiss();
            return;
          }
        }

        // Checagem de Linha do Gol (Y <= 170)
        if (ball.y <= 170) {
          const isInsideWidth = ball.x >= goalLeft + 8 && ball.x <= goalRight - 8;
          const isInsideHeight = ball.y >= goalTop && ball.z >= 0 && ball.z <= 60;

          if (isInsideWidth && isInsideHeight) {
            setShotResult('goal');
            setFeedbackText('GOLAÇO DE FALTA! Bola na gaveta com efeito indefensável! 🔥');
            sound.play('goal');
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#10b981', '#fbbf24', '#ffffff'],
            });
            if (onScoreGoal) onScoreGoal(0.6);
          } else {
            setShotResult('out');
            setFeedbackText('Pra fora! A falta passou raspando o travessão!');
            sound.play('whistle');
            if (onMiss) onMiss();
          }
          return;
        }
      }

      // Desenha a Bola
      const ballRadius = Math.max(5, 12 - (350 - ball.y) * 0.02);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y - ball.z, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sombra da bola no chão
      ctx.beginPath();
      ctx.ellipse(ball.x, ball.y, ballRadius * 0.9, ballRadius * 0.35, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();

      if (shotResult === 'shooting') {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [shotResult, targetAim, impact, windKnots, onScoreGoal, onMiss]);

  // Mira pelo toque/clique no Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (shotResult !== 'aiming') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Limita mira na região do gol
    setTargetAim({
      x: Math.max(130, Math.min(430, x)),
      y: Math.max(65, Math.min(185, y)),
    });
  };

  // Disparo do Chute
  const handleKick = () => {
    if (shotResult !== 'aiming') return;
    setPowerLocked(true);
    setShotResult('shooting');
    sound.play('kick');

    // Cálculo da trajetória da bola
    const dx = (targetAim.x - 280) / 22;
    const dy = -8.5 * (power / 58);
    const dz = 4.2 + (impact.y * 3.2);

    ballPosRef.current = {
      x: 280,
      y: 350,
      z: 0,
      vx: dx,
      vy: dy,
      vz: dz,
    };
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-card border border-border/80 rounded-3xl shadow-2xl">
      {/* Cabeçalho do Minigame */}
      <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
            🎯
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              Cobrança de Falta • {distanceMeters}m
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold uppercase">
                Estilo NSS
              </span>
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              Vento: {windKnots > 0 ? `➡️ +${windKnots} nós (Direita)` : windKnots < 0 ? `⬅️ ${windKnots} nós (Esquerda)` : 'Calmo 🍃'}
            </span>
          </div>
        </div>

        {matchInfo && (
          <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-secondary text-foreground">
            {matchInfo.oppClubName} • {matchInfo.minute}' ({matchInfo.currentScore})
          </span>
        )}
      </div>

      {/* Canvas do Lance */}
      <div className="relative w-full aspect-[560/380] bg-zinc-950 rounded-2xl overflow-hidden border border-border/60 shadow-inner">
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Overlay de Resultado */}
        {shotResult !== 'aiming' && shotResult !== 'shooting' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            {shotResult === 'goal' ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2 animate-bounce" />
                <h4 className="text-xl font-black text-emerald-400 uppercase tracking-wide">Golaço de Falta!</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-2" />
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">Cobrança Desperdiçada</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition-all shadow-lg cursor-pointer"
              >
                Voltar à Partida
              </button>
            )}
          </div>
        )}
      </div>

      {/* Controles de Chute e Efeito */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4 pt-3 border-t border-border">
        {/* Lado Esquerdo: Seletor de Impacto */}
        <div className="flex flex-col items-center">
          <BallImpactSelector value={impact} onChange={setImpact} disabled={shotResult !== 'aiming'} size="sm" />
        </div>

        {/* Lado Direito: Barra de Força + Botão de Chutar */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black mb-1.5">
              <span className="text-muted-foreground uppercase text-[10px]">Potência do Chute:</span>
              <span className={`font-mono ${power > 85 ? 'text-rose-400' : power > 55 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {power}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-800 border border-border/70 overflow-hidden relative">
              <div
                className={`h-full transition-all duration-75 ${
                  power > 85 ? 'bg-rose-500' : power > 55 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${power}%` }}
              />
              <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-white/40" title="Zona Ideal" />
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={shotResult !== 'aiming'}
              onClick={handleKick}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Flame className="w-4 h-4" />
              BATER NO GOL COM EFEITO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
