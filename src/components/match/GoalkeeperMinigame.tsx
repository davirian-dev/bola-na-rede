'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '@/lib/soundEffects';
import { Shield, Sparkles, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export type GoalkeeperVariant = 'shot_save' | 'rush_1v1' | 'cross_catch';

interface GoalkeeperMinigameProps {
  variant: GoalkeeperVariant;
  difficulty?: number; // 1 a 10
  weather?: 'sunny' | 'rainy' | 'snowy' | 'windy';
  playerName: string;
  playerReflexes: number; // 0-99 (elasticity / gkReflexes)
  playerPositioning: number; // 0-99
  onResult: (result: {
    success: boolean;
    type: 'save' | 'goal_conceded' | 'catch' | 'punch' | 'dropped';
    rating: number; // 6.0 a 10.0
    commentary?: string;
  }) => void;
  onCancel: () => void;
}

export function GoalkeeperMinigame({
  variant,
  difficulty = 5,
  weather = 'sunny',
  playerName,
  playerReflexes,
  playerPositioning,
  onResult,
  onCancel,
}: GoalkeeperMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [countdown, setCountdown] = useState<number>(3);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // Estados específicos da mecânica
  const [targetZone, setTargetZone] = useState<number>(Math.floor(Math.random() * 6)); // 0..5
  const [ballPos, setBallPos] = useState<{ x: number; y: number; progress: number }>({ x: 200, y: 220, progress: 0 });
  const [rushTiming, setRushTiming] = useState<number>(0); // 0 a 100 para 1v1
  const [crossHeight, setCrossHeight] = useState<number>(0); // 0 a 100 para cruzamento
  const animFrameRef = useRef<number | null>(null);

  // Inicialização e Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 700);
    } else if (countdown === 0 && gameState === 'ready') {
      setGameState('playing');
      sound.play('whistle');
    }
    return () => clearTimeout(timer);
  }, [countdown, gameState]);

  // Loop de Animação Canvas
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();
    const duration = Math.max(1200, 2200 - difficulty * 90); // ms do lance

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Gramado de Fundo
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Efeito de Clima
      if (weather === 'rainy') {
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          const rx = (Math.sin(now * 0.005 + i) * 0.5 + 0.5) * canvas.width;
          const ry = ((now * 0.4 + i * 20) % canvas.height);
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 12);
          ctx.stroke();
        }
      }

      // 2. Trave / Meta do Goleiro
      const goalW = canvas.width * 0.74;
      const goalH = canvas.height * 0.52;
      const goalX = (canvas.width - goalW) / 2;
      const goalY = canvas.height * 0.12;

      // Rede interna
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(goalX, goalY, goalW, goalH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let x = goalX; x <= goalX + goalW; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, goalY);
        ctx.lineTo(x, goalY + goalH);
        ctx.stroke();
      }
      for (let y = goalY; y <= goalY + goalH; y += 18) {
        ctx.beginPath();
        ctx.moveTo(goalX, y);
        ctx.lineTo(goalX + goalW, y);
        ctx.stroke();
      }

      // Postes brancos
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(goalX, goalY + goalH);
      ctx.lineTo(goalX, goalY);
      ctx.lineTo(goalX + goalW, goalY);
      ctx.lineTo(goalX + goalW, goalY + goalH);
      ctx.stroke();

      // 3. Mecânica Específica
      if (variant === 'shot_save') {
        // Zonas de Defesa (6 Quadrantes)
        const zoneW = goalW / 3;
        const zoneH = goalH / 2;
        ctx.lineWidth = 1.5;
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 3; col++) {
            const zIdx = row * 3 + col;
            const zX = goalX + col * zoneW;
            const zY = goalY + row * zoneH;
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
            ctx.strokeRect(zX + 2, zY + 2, zoneW - 4, zoneH - 4);
          }
        }

        // Bola vindo em direção à zona alvo
        const targetCol = targetZone % 3;
        const targetRow = Math.floor(targetZone / 3);
        const destX = goalX + targetCol * zoneW + zoneW / 2;
        const destY = goalY + targetRow * zoneH + zoneH / 2;

        const startX = canvas.width / 2;
        const startY = canvas.height * 0.9;

        const currentX = startX + (destX - startX) * progress;
        const currentY = startY + (destY - startY) * progress;
        const ballSize = 16 - 7 * progress; // perspectiva diminuindo ao ir pro fundo

        // Sombra da bola
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(currentX, currentY + ballSize * 0.6, ballSize, ballSize * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bola
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(currentX, currentY, ballSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        setBallPos({ x: currentX, y: currentY, progress });

        // Se a bola chegou ao fim sem clique do goleiro = Gol sofrido
        if (progress >= 1 && gameState === 'playing') {
          handleShotResult(false);
          return;
        }
      } else if (variant === 'rush_1v1') {
        // Barra de timing para saída 1x1
        const barW = canvas.width * 0.6;
        const barH = 14;
        const barX = (canvas.width - barW) / 2;
        const barY = canvas.height * 0.78;

        ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
        ctx.fillRect(barX, barY, barW, barH);

        // Zona Verde Perfeita no meio
        const perfectStart = barX + barW * 0.45;
        const perfectW = barW * 0.25;
        ctx.fillStyle = '#10b981';
        ctx.fillRect(perfectStart, barY, perfectW, barH);

        // Cursor oscilando
        const cursorX = barX + barW * (Math.sin(now * 0.005) * 0.5 + 0.5);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(cursorX - 3, barY - 4, 6, barH + 8);
      } else if (variant === 'cross_catch') {
        // Bola cruzada no alto oscilando verticalmente
        const arcProgress = (Math.sin(now * 0.004) * 0.5 + 0.5);
        setCrossHeight(arcProgress);

        const bx = canvas.width * 0.5;
        const by = goalY + goalH * (1 - arcProgress);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bx, by, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Alvo ideal de encaixe
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.strokeRect(bx - 20, goalY + goalH * 0.3 - 20, 40, 40);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, targetZone, difficulty, weather, variant]);

  // Tratamento de Clique / Toque nos Quadrantes de Defesa
  const handleZoneClick = (clickedZone: number) => {
    if (gameState !== 'playing') return;

    // Se acertou a zona ou zona adjacente com reflexos altos
    const reflexesBonus = playerReflexes > 75 ? 1 : 0;
    const isExact = clickedZone === targetZone;
    const isClose = Math.abs(clickedZone - targetZone) <= reflexesBonus;

    handleShotResult(isExact || (isClose && Math.random() < 0.5));
  };

  const handleShotResult = (success: boolean) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setGameState('ended');

    if (success) {
      sound.play('cheer');
      setFeedback({ text: 'MILAGRE! DEFESA HISTÓRICA!', success: true });
      setTimeout(() => {
        onResult({
          success: true,
          type: 'save',
          rating: 8.5 + (playerReflexes / 100) * 1.0,
          commentary: `DEFESAÇA DE ${playerName}! Voou no canto e operou um verdadeiro milagre!`,
        });
      }, 1000);
    } else {
      sound.play('goal');
      setFeedback({ text: 'GOL DO ADVERSÁRIO...', success: false });
      setTimeout(() => {
        onResult({
          success: false,
          type: 'goal_conceded',
          rating: 6.0,
          commentary: `Bola indefensável no canto! O goleiro ${playerName} se esticou mas não alcançou!`,
        });
      }, 1000);
    }
  };

  // Saída 1v1 Botão de Bote
  const handleRushClick = () => {
    if (gameState !== 'playing') return;
    setGameState('ended');

    // Sucesso baseado no posicionamento e reflexos
    const successChance = 0.5 + (playerPositioning / 200);
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
      sound.play('cheer');
      setFeedback({ text: 'ABAFOU O CHUTE! SAÍDA PERFEITA!', success: true });
      setTimeout(() => {
        onResult({
          success: true,
          type: 'save',
          rating: 8.0,
          commentary: `${playerName} saiu com coragem, fechou o ângulo e salvou o gol cara a cara!`,
        });
      }, 1000);
    } else {
      sound.play('goal');
      setFeedback({ text: 'DRIBLADO! GOL DO RIVAL...', success: false });
      setTimeout(() => {
        onResult({
          success: false,
          type: 'goal_conceded',
          rating: 5.8,
          commentary: `${playerName} hesitou na saída e o atacante tocou por cima com categoria!`,
        });
      }, 1000);
    }
  };

  // Cruzamento Pegada / Soco
  const handleCrossCatch = () => {
    if (gameState !== 'playing') return;
    setGameState('ended');

    // Cruzamento bom se altura estiver entre 0.25 e 0.55
    const isGoodTiming = crossHeight >= 0.2 && crossHeight <= 0.6;
    if (isGoodTiming) {
      sound.play('cheer');
      setFeedback({ text: 'BOLA ENCAIXADA NO ALTO!', success: true });
      setTimeout(() => {
        onResult({
          success: true,
          type: 'catch',
          rating: 8.2,
          commentary: `${playerName} subiu com autoridade no terceiro andar e ficou com a bola!`,
        });
      }, 1000);
    } else {
      sound.play('kick');
      setFeedback({ text: 'ESPALMOU PARA ESCANTEIO!', success: true });
      setTimeout(() => {
        onResult({
          success: true,
          type: 'punch',
          rating: 7.2,
          commentary: `${playerName} afastou o perigo dando um soco providencial na bola!`,
        });
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-emerald-500/40 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col items-center">
        {/* Cabeçalho do Minigame */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-zinc-100">
                {variant === 'shot_save' ? 'Defesa de Chute' : variant === 'rush_1v1' ? 'Saída 1x1 Cara a Cara' : 'Cruzamento na Área'}
              </h3>
              <p className="text-xs text-zinc-400">Goleiro: <span className="text-emerald-400 font-semibold">{playerName}</span></p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition"
          >
            Pular Lance
          </button>
        </div>

        {/* Canvas Interativo */}
        <div className="relative my-4 w-full flex justify-center">
          <canvas
            ref={canvasRef}
            width={380}
            height={260}
            className="rounded-xl border border-zinc-700 shadow-inner bg-zinc-950 touch-none max-w-full"
          />

          {/* Overlay de Countdown Inicial */}
          {countdown > 0 && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-extrabold text-emerald-400 animate-pulse font-mono">
                {countdown}
              </span>
              <span className="text-xs text-zinc-300 mt-2 font-medium">Prepare as luvas!</span>
            </div>
          )}

          {/* Feedback Visual de Conclusão */}
          {feedback && (
            <div className={`absolute inset-0 rounded-xl flex items-center justify-center font-bold text-base md:text-lg px-4 text-center ${
              feedback.success ? 'bg-emerald-950/85 text-emerald-300' : 'bg-red-950/85 text-red-300'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>

        {/* Painel de Controles por Variante */}
        {gameState === 'playing' && (
          <div className="w-full">
            {variant === 'shot_save' && (
              <div className="space-y-2 text-center">
                <p className="text-xs text-zinc-300 font-medium">Toque no quadrante onde a bola vai entrar:</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Sup. Esq', 'Sup. Centro', 'Sup. Dir', 'Inf. Esq', 'Inf. Centro', 'Inf. Dir'].map((label, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleZoneClick(idx)}
                      className="py-2.5 px-1 bg-zinc-800/80 hover:bg-emerald-600/30 hover:border-emerald-500 border border-zinc-700 rounded-lg text-[11px] font-bold text-zinc-200 transition active:scale-95"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {variant === 'rush_1v1' && (
              <div className="text-center space-y-3">
                <p className="text-xs text-zinc-300">Espere o momento exato e feche o ângulo:</p>
                <button
                  onClick={handleRushClick}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition active:scale-98"
                >
                  ABAFAR AGORA! 🧤
                </button>
              </div>
            )}

            {variant === 'cross_catch' && (
              <div className="text-center space-y-3">
                <p className="text-xs text-zinc-300">Pule na bola no ponto mais alto do cruzamento:</p>
                <button
                  onClick={handleCrossCatch}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition active:scale-98"
                >
                  SALTAR PARA ENCAIXAR ⚽
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
