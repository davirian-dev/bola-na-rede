'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sound } from '@/lib/soundEffects';
import { ShieldAlert, Zap, Trophy, Shield } from 'lucide-react';

export type DefenseVariant = 'tackle_1v1' | 'interception' | 'aerial_duel';

interface DefenseMinigameProps {
  variant: DefenseVariant;
  difficulty?: number; // 1 a 10
  weather?: 'sunny' | 'rainy' | 'snowy' | 'windy';
  playerName: string;
  playerTackling: number; // 0-99
  playerHeading: number;  // 0-99
  playerJumping: number;  // 0-99
  playerPositioning: number; // 0-99
  onResult: (result: {
    success: boolean;
    type: 'clean_tackle' | 'foul' | 'beaten' | 'interception' | 'deflection' | 'passed_through' | 'header_won' | 'header_lost';
    rating: number;
    cardRisk?: boolean;
    commentary?: string;
  }) => void;
  onCancel: () => void;
}

export function DefenseMinigame({
  variant,
  difficulty = 5,
  weather = 'sunny',
  playerName,
  playerTackling,
  playerHeading,
  playerJumping,
  playerPositioning,
  onResult,
  onCancel,
}: DefenseMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [countdown, setCountdown] = useState<number>(3);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const [tackleProgress, setTackleProgress] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Contagem regressiva
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

  // Loop de renderização Canvas
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();
    const duration = Math.max(1400, 2400 - difficulty * 100);

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setTackleProgress(progress);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Gramado
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Linhas do campo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
      ctx.stroke();

      if (variant === 'tackle_1v1') {
        // Atacante vindo com a bola
        const attX = canvas.width * 0.2 + (canvas.width * 0.5) * progress;
        const attY = canvas.height * 0.5;

        // Marcador (Você)
        const defX = canvas.width * 0.75;
        const defY = canvas.height * 0.5;

        // Desenhar defensor
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(defX, defY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('VOCÊ', defX, defY - 18);

        // Desenhar atacante adversário
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(attX, attY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Bola nos pés do atacante
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(attX + 12, attY + 4, 7, 0, Math.PI * 2);
        ctx.fill();

        // Zona do bote ideal
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(canvas.width * 0.55, canvas.height * 0.3, canvas.width * 0.2, canvas.height * 0.4);

        if (progress >= 1) {
          handleAction('wait'); // Se não agiu, foi driblado
          return;
        }
      } else if (variant === 'interception') {
        // Trajetória do passe adversário
        const passStartX = canvas.width * 0.1;
        const passStartY = canvas.height * 0.2;
        const passEndX = canvas.width * 0.9;
        const passEndY = canvas.height * 0.8;

        const currentBallX = passStartX + (passEndX - passStartX) * progress;
        const currentBallY = passStartY + (passEndY - passStartY) * progress;

        // Linha pontilhada da rota
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(passStartX, passStartY);
        ctx.lineTo(passEndX, passEndY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Bola
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(currentBallX, currentBallY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Zona de interceptação ideal
        const zoneX = canvas.width * 0.45;
        const zoneY = canvas.height * 0.45;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(zoneX - 25, zoneY - 25, 50, 50);

        if (progress >= 1) {
          handleAction('wait');
          return;
        }
      } else if (variant === 'aerial_duel') {
        // Bola cruzada no ar subindo e descendo
        const ballY = canvas.height * 0.85 - Math.sin(progress * Math.PI) * (canvas.height * 0.65);
        const ballX = canvas.width * 0.5;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
        ctx.fill();

        // Ponto mais alto
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.strokeRect(ballX - 20, canvas.height * 0.2 - 10, 40, 40);

        if (progress >= 1) {
          handleAction('wait');
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, variant, difficulty]);

  // Ações do Jogador
  const handleAction = (action: 'tackle' | 'wait' | 'intercept' | 'jump') => {
    if (gameState !== 'playing') return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setGameState('ended');

    if (variant === 'tackle_1v1') {
      if (action === 'tackle') {
        // Bote na hora certa
        const isGoodTiming = tackleProgress >= 0.55 && tackleProgress <= 0.85;
        const tacklingBonus = playerTackling / 150;
        const success = isGoodTiming && (Math.random() < 0.7 + tacklingBonus);

        if (success) {
          sound.play('kick');
          sound.play('cheer');
          setFeedback({ text: 'DESARME LIMPO E CIRÚRGICO!', success: true });
          setTimeout(() => {
            onResult({
              success: true,
              type: 'clean_tackle',
              rating: 8.4,
              commentary: `${playerName} deu um bote cirúrgico, roubou a bola do atacante e puxou o contra-ataque!`,
            });
          }, 1000);
        } else {
          sound.play('card');
          setFeedback({ text: 'FALTA PERIGOSA! RISCO DE CARTÃO', success: false });
          setTimeout(() => {
            onResult({
              success: false,
              type: 'foul',
              rating: 5.9,
              cardRisk: true,
              commentary: `${playerName} errou o tempo da dividida e cometeu falta perigosa na entrada da área!`,
            });
          }, 1000);
        }
      } else {
        setFeedback({ text: 'DRIBLADO! O ATACANTE PASSOU...', success: false });
        setTimeout(() => {
          onResult({
            success: false,
            type: 'beaten',
            rating: 5.5,
            commentary: `${playerName} hesitou na marcação e foi batido no drible pelo atacante adversário!`,
          });
        }, 1000);
      }
    } else if (variant === 'interception') {
      const isGoodTiming = tackleProgress >= 0.4 && tackleProgress <= 0.65;
      if (isGoodTiming) {
        sound.play('kick');
        sound.play('cheer');
        setFeedback({ text: 'INTERCEPTAÇÃO SALVADORA!', success: true });
        setTimeout(() => {
          onResult({
            success: true,
            type: 'interception',
            rating: 8.2,
            commentary: `Visão defensiva espetacular! ${playerName} leu o passe do adversário e cortou o perigo!`,
          });
        }, 1000);
      } else {
        setFeedback({ text: 'PASSE PASSOU... DEFESA EXPOSTA', success: false });
        setTimeout(() => {
          onResult({
            success: false,
            type: 'passed_through',
            rating: 6.0,
            commentary: `${playerName} tentou a interceptação, mas o passe encontrou o atacante livre!`,
          });
        }, 1000);
      }
    } else if (variant === 'aerial_duel') {
      const isPeak = tackleProgress >= 0.4 && tackleProgress <= 0.6;
      const aerialStats = (playerHeading + playerJumping) / 200;
      const success = isPeak && (Math.random() < 0.6 + aerialStats * 0.4);

      if (success) {
        sound.play('kick');
        sound.play('cheer');
        setFeedback({ text: 'GANHOU NO ALTO! CABECEIO FIRME', success: true });
        setTimeout(() => {
          onResult({
            success: true,
            type: 'header_won',
            rating: 8.3,
            commentary: `${playerName} subiu no terceiro andar com autoridade e afastou o perigo pelo alto!`,
          });
        }, 1000);
      } else {
        setFeedback({ text: 'PERDEU A DISPUTA AÉREA...', success: false });
        setTimeout(() => {
          onResult({
            success: false,
            type: 'header_lost',
            rating: 5.8,
            commentary: `${playerName} perdeu no alto e o adversário cabeceou com muito perigo contra a meta!`,
          });
        }, 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-emerald-500/40 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col items-center">
        {/* Topo */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-zinc-100">
                {variant === 'tackle_1v1' ? 'Desarme 1x1' : variant === 'interception' ? 'Interceptação de Passe' : 'Duelo Aéreo'}
              </h3>
              <p className="text-xs text-zinc-400">Defensor: <span className="text-emerald-400 font-semibold">{playerName}</span></p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition"
          >
            Pular Lance
          </button>
        </div>

        {/* Canvas */}
        <div className="relative my-4 w-full flex justify-center">
          <canvas
            ref={canvasRef}
            width={380}
            height={240}
            className="rounded-xl border border-zinc-700 shadow-inner bg-zinc-950 touch-none max-w-full"
          />

          {countdown > 0 && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-extrabold text-emerald-400 animate-pulse font-mono">
                {countdown}
              </span>
              <span className="text-xs text-zinc-300 mt-2 font-medium">Postura defensiva firme!</span>
            </div>
          )}

          {feedback && (
            <div className={`absolute inset-0 rounded-xl flex items-center justify-center font-bold text-base md:text-lg px-4 text-center ${
              feedback.success ? 'bg-emerald-950/85 text-emerald-300' : 'bg-red-950/85 text-red-300'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>

        {/* Controles de Ação */}
        {gameState === 'playing' && (
          <div className="w-full">
            {variant === 'tackle_1v1' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction('wait')}
                  className="py-3 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition"
                >
                  Recuar / Esperar 🛡️
                </button>
                <button
                  onClick={() => handleAction('tackle')}
                  className="py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg transition active:scale-95"
                >
                  DAR O BOTE AGORA! ⚡
                </button>
              </div>
            )}

            {variant === 'interception' && (
              <button
                onClick={() => handleAction('intercept')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition active:scale-95 text-xs md:text-sm"
              >
                INTERCEPTAR LINHA DE PASSE ⚡
              </button>
            )}

            {variant === 'aerial_duel' && (
              <button
                onClick={() => handleAction('jump')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition active:scale-95 text-xs md:text-sm"
              >
                SALTAR PARA O CABECEIO ⚽
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
