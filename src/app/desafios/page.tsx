'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Play, 
  ArrowLeft, 
  CheckCircle2, 
  Award,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScenarioDef {
  id: string;
  title: string;
  tag: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Lendário';
  diffColor: string;
  clubName: string;
  division: string;
  description: string;
  startingSituation: string;
  winCondition: string;
  rewardPoints: number;
}

const SCENARIOS: ScenarioDef[] = [
  {
    id: 'degola-serie-a',
    title: 'Milagre Contra a Degola',
    tag: 'Série A • Salvação Épica',
    difficulty: 'Difícil',
    diffColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    clubName: 'Vasco da Gama',
    division: 'Série A',
    description: 'O clube está afundado na 18ª posição a apenas 8 rodadas do fim do Brasileirão, com a torcida em desespero.',
    startingSituation: 'Semana 40 de 48 • 31 Pontos (Z4)',
    winCondition: 'Conquistar pelo menos 13 pontos nos 8 jogos restantes e terminar fora do Z4.',
    rewardPoints: 120,
  },
  {
    id: 'virada-final-copa',
    title: 'Virada Histórica na Final',
    tag: 'Copa do Brasil • Decisão',
    difficulty: 'Lendário',
    diffColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    clubName: 'Flamengo',
    division: 'Copa do Brasil',
    description: 'Fim do primeiro tempo no Maracanã lotado e o time adversário vence por 2 a 0. Você entra no intervalo para comandar a virada!',
    startingSituation: 'Intervalo (45 minutos) • Placar: 0 x 2',
    winCondition: 'Virar a partida para 3 x 2 ou vencer na disputa de pênaltis.',
    rewardPoints: 200,
  },
  {
    id: 'garoto-copinha',
    title: 'O Garoto de Ouro da Copinha',
    tag: 'Base Sub-20 • Oportunidade',
    difficulty: 'Médio',
    diffColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    clubName: 'Palmeiras Sub-20',
    division: 'Base Sub-20',
    description: 'Com apenas 16 anos, você ganha a chance de ser titular nas últimas 3 rodadas do torneio de base.',
    startingSituation: 'Últimas 3 semanas do torneio Sub-20',
    winCondition: 'Marcar 4 gols e dar 2 assistências para garantir promoção direta aos profissionais.',
    rewardPoints: 90,
  },
  {
    id: 'g4-serie-b',
    title: 'Arrancada do Acesso',
    tag: 'Série B • Batalha da Subida',
    difficulty: 'Médio',
    diffColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    clubName: 'Sport Recife',
    division: 'Série B',
    description: 'O time está a 4 pontos do G4 com 5 rodadas restantes. Não há margem para tropeços em casa!',
    startingSituation: 'Semana 43 de 48 • 5º Lugar',
    winCondition: 'Alcançar a 4ª colocação e carimbar a vaga na Série A de 2027.',
    rewardPoints: 110,
  },
];

export default function DesafiosPage() {
  const router = useRouter();
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [activeModalScenario, setActiveModalScenario] = useState<ScenarioDef | null>(null);

  const handleStartScenario = (scenario: ScenarioDef) => {
    setActiveModalScenario(scenario);
  };

  const handleCompleteScenario = () => {
    if (!activeModalScenario) return;
    setCompletedScenarios((prev) => [...prev, activeModalScenario.id]);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    setActiveModalScenario(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 md:pb-8 max-w-5xl mx-auto w-full space-y-6">
          
          {/* Header da Página */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/dashboard"
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Modo de Jogo Rápido
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                Cenários & Desafios Históricos
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Supere situações dramáticas do futebol brasileiro, ganhe medalhas raras e suba no ranking mundial.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                {completedScenarios.length}/{SCENARIOS.length} Concluídos
              </span>
            </div>
          </div>

          {/* Grid dos Cenários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIOS.map((sc) => {
              const isCompleted = completedScenarios.includes(sc.id);

              return (
                <div
                  key={sc.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                    isCompleted
                      ? 'bg-secondary/60 border-emerald-500/40'
                      : 'bg-card border-border hover:border-emerald-500/30 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        {sc.tag}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${sc.diffColor}`}>
                        {sc.difficulty}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-black text-foreground mb-1">
                      {sc.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {sc.description}
                    </p>

                    <div className="p-3 rounded-2xl bg-secondary/50 border border-border space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Clube:</span>
                        <strong className="text-foreground">{sc.clubName}</strong>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Situação Inicial:</span>
                        <span className="text-amber-400 font-semibold">{sc.startingSituation}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Missão:</span>
                        <span className="text-emerald-400 font-semibold truncate max-w-[200px]">{sc.winCondition}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/80 flex items-center justify-between gap-3">
                    <span className="text-xs font-mono font-black text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      +{sc.rewardPoints} pts
                    </span>

                    {isCompleted ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-black text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Desafio Superado!
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartScenario(sc)}
                        className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Jogar Desafio
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Modal de Detalhes e Início do Desafio */}
      {activeModalScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-card text-foreground border-2 border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-black uppercase text-emerald-400">
                Briefing Tático do Cenário
              </span>
              <button
                onClick={() => setActiveModalScenario(null)}
                className="p-1 rounded-full hover:bg-secondary text-muted-foreground"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="font-display text-xl font-black text-foreground">
                {activeModalScenario.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activeModalScenario.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clube Designado:</span>
                <span className="font-bold text-foreground">{activeModalScenario.clubName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Condição de Vitória:</span>
                <span className="font-bold text-emerald-400">{activeModalScenario.winCondition}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModalScenario(null)}
                className="py-2.5 px-4 rounded-xl bg-secondary text-foreground text-xs font-bold"
              >
                Voltar
              </button>
              <button
                onClick={handleCompleteScenario}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simular e Concluir Desafio
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}