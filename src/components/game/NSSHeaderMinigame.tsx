'use client';

import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { Sparkles, CheckCircle2, XCircle, ArrowUp } from 'lucide-react';
import { sound } from '@/lib/soundEffects';

interface NSSHeaderMinigameProps {
  onScoreGoal?: (ratingBonus: number) => void;
  onMiss?: () => void;
  onClose?: () => void;
  matchInfo?: {
    minute: number;
    oppClubName: string;
    currentScore: string;
  };
}

export function NSSHeaderMinigame({
  onScoreGoal,
  onMiss,
  onClose,
  matchInfo,
}: NSSHeaderMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerProfile = useGameStore((s) => s.playerProfile);

  // Altura do atleta (padrão 178 se não configurado)
  const athleteHeight = playerProfile?.height || 178;
  const isTall = athleteHeight >= 185;
  const isGiant = athleteHeight >= 190;

  // Bônus de cabeceio baseado na altura
  const timingTolerance = isGiant ? 45 : isTall ? 35 : 24; // Milissegundos/pixels de tolerância do salto

  const [headerState, setHeaderState] = useState<'incoming' | 'jumping' | 'goal' | 'saved' | 'out'>('incoming');
  const [feedbackText, setFeedbackText] = useState(
    isGiant
      ? `Torre de ${athleteHeight}cm! Pressione no momento exato em que a bola cruzar a zona dourada!`
      : isTall
      ? `Bom porte físico (${athleteHeight}cm)! Acerte o tempo de bola para testar o cabeceio!`
      : `Suba no terceiro andar! Pressione "CABECEAR" na zona perfeita!`
  );

  // Bola vindo da lateral direita em arco de cruzamento
  const ballRef = useRef<{ x: number; y: number; z: number; vx: number; vy: number; vz: number }>({
    x: 520,
    y: 200,
    z: 90,
    vx: -4.8,
    vy: 1.2,
    vz: -0.6,
  });

  // Posição do jogador
  const playerX = 260;
  const playerBaseY = 280;
  const [playerJumpY, setPlayerJumpY] = useState(0);

  // Mira no gol (onde o cabeceio vai)
  const [aimX, setAimX] = useState<number>(180); // Canto esquerdo por padrão

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gramado
      const grassGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grassGrad.addColorStop(0, '#15803d');
      grassGrad.addColorStop(1, '#166534');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Trave do Gol ao Fundo
      const goalLeft = 130;
      const goalRight = 430;
      const goalTop = 50;
      const goalBottom = 160;

      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.strokeRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);

      // Goleiro se posicionando no centro
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(280, 130, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(270, 140, 20, 20);

      // Zona Dourada do "Sweet Spot" de Salto Aéreo
      const sweetSpotX = playerX;
      const sweetSpotY = playerBaseY - 60;
      const sweetSpotRadius = timingTolerance;

      ctx.beginPath();
      ctx.arc(sweetSpotX, sweetSpotY, sweetSpotRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Desenha o Atleta
      const currentPY = playerBaseY - playerJumpY;

      // Sombra
      ctx.beginPath();
      ctx.ellipse(playerX, playerBaseY + 20, 16, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();

      // Cabeça
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(playerX, currentPY - 35, 12, 0, Math.PI * 2);
      ctx.fill();

      // Corpo
      ctx.fillStyle = '#059669';
      ctx.fillRect(playerX - 10, currentPY - 20, 20, 32);

      // Pernas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(playerX - 8, currentPY + 12, 6, 18);
      ctx.fillRect(playerX + 2, currentPY + 12, 6, 18);

      // Movimentação da Bola
      const ball = ballRef.current;
      if (headerState === 'incoming') {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.z += ball.vz;

        // Se a bola passar reto sem o jogador ter cabeceado
        if (ball.x < 150) {
          setHeaderState('out');
          setFeedbackText('Passou da bola! Cruzamento viajou sem ninguém desviar!');
          sound.play('whistle');
          if (onMiss) onMiss();
          return;
        }
      } else if (headerState === 'jumping') {
        // Bola cabeceada voando para o gol
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.z += ball.vz;

        // Checagem de Gol
        if (ball.y <= 160) {
          const isInside = ball.x >= goalLeft + 10 && ball.x <= goalRight - 10;
          if (isInside) {
            setHeaderState('goal');
            setFeedbackText(`TESTADA MORTÍFERA! ${athleteHeight}cm de puro perigo aéreo guardando na rede! ⚽`);
            sound.play('goal');
            confetti({
              particleCount: 80,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#10b981', '#fbbf24', '#ffffff'],
            });
            if (onScoreGoal) onScoreGoal(0.45);
          } else {
            setHeaderState('out');
            setFeedbackText('Cabeceou pra fora! Raspou a trave!');
            sound.play('whistle');
            if (onMiss) onMiss();
          }
          return;
        }
      }

      // Desenha Bola com elevação 2D
      const ballRadius = Math.max(6, 13 * (ball.z / 90));
      ctx.beginPath();
      ctx.arc(ball.x, ball.y - ball.z * 0.7, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (headerState === 'incoming' || headerState === 'jumping') {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [headerState, timingTolerance, athleteHeight, aimX, playerJumpY, onScoreGoal, onMiss]);

  // Ação de Cabecear
  const handleHeaderJump = () => {
    if (headerState !== 'incoming') return;

    setPlayerJumpY(40);
    const ball = ballRef.current;
    const distToSweetSpot = Math.hypot(ball.x - playerX, (ball.y - ball.z * 0.7) - (playerBaseY - 60));

    if (distToSweetSpot <= timingTolerance * 1.3) {
      setHeaderState('jumping');
      sound.play('kick');

      // Trajetória da cabeçada em direção ao gol
      const dx = (aimX - ball.x) / 14;
      const dy = (120 - ball.y) / 14;
      ballRef.current.vx = dx;
      ballRef.current.vy = dy;
      ballRef.current.vz = -0.5;
    } else {
      setHeaderState('out');
      setFeedbackText('Subiu fora de hora! O cabeceio saiu mascado para a linha de fundo.');
      sound.play('whistle');
      if (onMiss) onMiss();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-card border border-border/80 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
            👤
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              Cruzamento Aéreo • Cabeceio
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                isGiant ? 'bg-amber-500 text-zinc-950' : isTall ? 'bg-emerald-500/20 text-emerald-300' : 'bg-secondary text-muted-foreground'
              }`}>
                {athleteHeight}cm {isGiant ? '• Bônus +40% 🦒' : isTall ? '• Bônus +25% ⬆️' : ''}
              </span>
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              Acerte o tempo da bola dentro da zona dourada e cabeceie firme no canto!
            </span>
          </div>
        </div>

        {matchInfo && (
          <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-secondary text-foreground">
            {matchInfo.oppClubName} • {matchInfo.minute}'
          </span>
        )}
      </div>

      <div className="relative w-full aspect-[560/380] bg-zinc-950 rounded-2xl overflow-hidden border border-border/60 shadow-inner">
        <canvas ref={canvasRef} width={560} height={380} className="w-full h-full touch-none" />

        {headerState !== 'incoming' && headerState !== 'jumping' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-200">
            {headerState === 'goal' ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2 animate-bounce" />
                <h4 className="text-xl font-black text-emerald-400 uppercase tracking-wide">Testada Fulminante!</h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm">{feedbackText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-2" />
                <h4 className="text-xl font-black text-rose-500 uppercase tracking-wide">Cabeceio Desperdiçado</h4>
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

      {/* Controles de Direção e Salto */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-muted-foreground uppercase">Canto do Gol:</span>
          <button
            type="button"
            onClick={() => setAimX(160)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              aimX === 160 ? 'bg-emerald-500 text-zinc-950' : 'bg-secondary text-muted-foreground'
            }`}
          >
            ⬅️ Canto Esquerdo
          </button>
          <button
            type="button"
            onClick={() => setAimX(400)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              aimX === 400 ? 'bg-emerald-500 text-zinc-950' : 'bg-secondary text-muted-foreground'
            }`}
          >
            ➡️ Canto Direito
          </button>
        </div>

        <button
          type="button"
          disabled={headerState !== 'incoming'}
          onClick={handleHeaderJump}
          className="w-full sm:w-auto py-3 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
          SUBIR DE CABEÇA AGORA!
        </button>
      </div>
    </div>
  );
}
