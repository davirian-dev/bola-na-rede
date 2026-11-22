'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { 
  Crown, 
  Sparkles, 
  Check, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Wind, 
  Lock,
  Eye
} from 'lucide-react';
import { MatchWeatherType, PitchPatternType } from '@/types/game';

interface VIPStadiumWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProModal?: () => void;
}

export function VIPStadiumWeatherModal({
  isOpen,
  onClose,
  onOpenProModal,
}: VIPStadiumWeatherModalProps) {
  const planTier = useGameStore((s) => s.planTier);
  const customPitchPattern = useGameStore((s) => s.customPitchPattern) || 'striped';
  const customWeather = useGameStore((s) => s.customWeather) || 'sunny';
  const setGameState = useGameStore.setState;

  const isPro = planTier === 'pro';

  const [selectedPattern, setSelectedPattern] = useState<PitchPatternType>(customPitchPattern);
  const [selectedWeather, setSelectedWeather] = useState<MatchWeatherType>(customWeather);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const PITCH_PATTERNS = [
    {
      id: 'striped' as PitchPatternType,
      name: 'Listrado Clássico',
      description: 'Corte horizontal perfeito com faixas verde-claro e verde-escuro.',
      icon: '🟩',
      bgPreview: 'from-emerald-700 to-emerald-900',
    },
    {
      id: 'checkered' as PitchPatternType,
      name: 'Xadrez Europeu (Champions)',
      description: 'Padrão geométrico impecável dos maiores palcos da Champions League.',
      icon: '🏁',
      bgPreview: 'from-emerald-800 to-emerald-950',
    },
    {
      id: 'circles' as PitchPatternType,
      name: 'Círculos Concêntricos',
      description: 'Desenho circular moderno centralizado no círculo central e na grande área.',
      icon: '🎯',
      bgPreview: 'from-teal-800 to-emerald-900',
    },
    {
      id: 'varzea' as PitchPatternType,
      name: 'Várzea Raiz (Terra Batida)',
      description: 'Gramado rústico com manchas de terra, poeira e estilo futebol raiz brasileiro.',
      icon: '🪵',
      bgPreview: 'from-amber-800 to-amber-950',
    },
    {
      id: 'futuristic' as PitchPatternType,
      name: 'Futurista Neon (Cyber Arena)',
      description: 'Linhas brilhantes em verde neon e iluminação espetacular estilo eSports.',
      icon: '⚡',
      bgPreview: 'from-emerald-900 to-cyan-950',
    },
  ];

  const WEATHERS = [
    {
      id: 'sunny' as MatchWeatherType,
      name: 'Ensolarado / Dia Claro',
      description: 'Condições ideais de jogo. Máxima visibilidade e grama firme.',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      badge: 'Padrão',
    },
    {
      id: 'rainy' as MatchWeatherType,
      name: 'Chuva Torrencial',
      description: 'Partículas de água, bola rápida no solo molhado e mais rebotes de goleiros.',
      icon: <CloudRain className="w-5 h-5 text-blue-400" />,
      badge: '+Rebotes',
    },
    {
      id: 'snowy' as MatchWeatherType,
      name: 'Neve Fria de Inverno',
      description: 'Gramado esbranquiçado, bola laranja e maior exigência de resistência física.',
      icon: <Snowflake className="w-5 h-5 text-cyan-300" />,
      badge: 'Frio Extremo',
    },
    {
      id: 'windy' as MatchWeatherType,
      name: 'Vento Forte & Rajadas',
      description: 'Ventos laterais reais que desviam a curva e altura de lançamentos e faltas.',
      icon: <Wind className="w-5 h-5 text-teal-300" />,
      badge: 'Desvio Aéreo',
    },
  ];

  const handleSave = () => {
    if (!isPro) {
      if (onOpenProModal) onOpenProModal();
      return;
    }

    setGameState({
      customPitchPattern: selectedPattern,
      customWeather: selectedWeather,
    });

    setFeedback('Configurações visuais salvas com sucesso para todas as suas partidas!');
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card border border-amber-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-5 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-black text-foreground flex items-center gap-2">
                Personalização de Estádio & Clima
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold uppercase border border-amber-500/30">
                  VIP / PRO
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Escolha o desenho do gramado do seu clube e o clima atmosférico das partidas.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 1. SELEÇÃO DO PADRÃO DO GRAMADO */}
        <div className="mb-6">
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span>🏟️</span> Padrão de Corte do Gramado:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PITCH_PATTERNS.map((pattern) => {
              const isSelected = selectedPattern === pattern.id;
              return (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setSelectedPattern(pattern.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/70 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-secondary/40 border-border/70 hover:border-border'
                  }`}
                >
                  <span className="text-2xl">{pattern.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-foreground">{pattern.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SELEÇÃO DE CLIMA / ATMOSFERA */}
        <div className="mb-6">
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span>🌦️</span> Condições Climáticas da Partida:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {WEATHERS.map((w) => {
              const isSelected = selectedWeather === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWeather(w.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/70 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-secondary/40 border-border/70 hover:border-border'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-background/80 border border-border">
                    {w.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-foreground">{w.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-bold">
                        {w.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {w.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback ou Aviso VIP */}
        {feedback && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
            {feedback}
          </div>
        )}

        {!isPro && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-amber-300 font-semibold">
                Personalizações de Estádio e Clima são recursos do <strong>Passaporte PRO</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenProModal}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs whitespace-nowrap cursor-pointer shadow"
            >
              Virar PRO 👑
            </button>
          </div>
        )}

        {/* Botão de Salvar */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground font-bold text-xs hover:text-foreground cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isPro ? 'Aplicar ao Meu Estádio' : 'Salvar no Modo Teste'}
          </button>
        </div>
      </div>
    </div>
  );
}
