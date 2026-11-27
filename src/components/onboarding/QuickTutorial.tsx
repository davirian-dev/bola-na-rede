'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Target, 
  Dumbbell, 
  ShieldCheck, 
  Flame 
} from 'lucide-react';

interface QuickTutorialProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const STEPS = [
  {
    title: 'Bem-vindo ao Bola na Rede: Carreira!',
    subtitle: 'Simulador autêntico do futebol brasileiro',
    icon: '⚽',
    text: 'Escolha entre Modo Jogador (do Sub-20 até se tornar lenda) ou Modo Treinador (da Série D até a glória na elite nacional).',
  },
  {
    title: 'Treinos, Moral e Disputa pela Vaga',
    subtitle: 'Sua rotina semanal define sua vaga de titular',
    icon: '🏃‍♂️',
    text: 'Todo jogador recém-chegado começa no banco de reservas. Treine forte, cuide da sua energia e aproveite as oportunidades nos minutos finais para virar titular e capitão!',
  },
  {
    title: 'Minigames com Efeito Curva Realista',
    subtitle: 'Você decide os lances cruciais da partida',
    icon: '🎯',
    text: 'Nos momentos de clímax, você assume o controle direto: escolha onde chutar na bola para dar efeito curva no New Star Soccer, desarmar atacantes ou fechar o gol como arqueiro!',
  },
  {
    title: 'Dicas de Ouro para a Glória',
    subtitle: 'Equipamentos e gestão de carreira',
    icon: '👑',
    text: 'Compre energéticos (NRG) no vestiário, equipe chuteiras de alta tração e cumpra as Missões Relâmpago para entrar no Modo On-Fire e subir no Ranking Geral!',
  },
];

export function QuickTutorial({ forceOpen = false, onClose }: QuickTutorialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = localStorage.getItem('bnr_tutorial_seen');
    if (!seen || forceOpen) {
      const timer = setTimeout(() => setIsOpen(true), 0);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bnr_tutorial_seen', 'true');
    }
    if (onClose) onClose();
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4">
        {/* Botão fechar */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          aria-label="Fechar tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Indicador de Passos */}
        <div className="flex gap-1.5 mb-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-6 bg-emerald-400' : 'w-2 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Ícone */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-lg">
          {step.icon}
        </div>

        {/* Textos */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
            Passo {currentStep + 1} de {STEPS.length}
          </span>
          <h2 className="text-lg md:text-xl font-bold text-zinc-100">{step.title}</h2>
          <p className="text-xs text-zinc-400 font-medium">{step.subtitle}</p>
        </div>

        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          {step.text}
        </p>

        {/* Navegação */}
        <div className="w-full flex items-center justify-between pt-2">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
          >
            {currentStep === STEPS.length - 1 ? 'Começar a Jogar!' : 'Próximo'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
