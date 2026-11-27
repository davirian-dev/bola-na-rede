# Bola na Rede — Game Design Document (GDD) & Arquitetura

> Documento vivo em Markdown (compatível com Obsidian e agentes de IA) para manter contexto estruturado do jogo.

## 1. Visão Geral
- **Nome:** Bola na Rede
- **Gênero:** Simulador de Carreira & Manager de Futebol (Web / PWA)
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Zustand (`src/store/gameStore.ts`), Supabase (`src/lib/supabase/`).

## 2. Estrutura do Projeto (`src/`)
- `src/app/` — Páginas e rotas (Dashboard, Arena 2D `/arena-2d`, Calendário, Competições, Desafios, Editor, Loja Pix, Nova Carreira, Notícias, Online PvP, Ranking, Transferências).
- `src/engine/` — Motores puros de simulação e regras de negócio:
  - Partida & Física: `ballPhysics.ts`, `quickSim.ts`, `scoringEngine.ts`, `positionEngine.ts`, `commentary.ts`, `minigameBalance.ts` (balanceamento dinâmico por OVR do atleta, força da liga e adversário)
  - Carreira & Progressão: `progression.ts`, `calendar.ts`, `seasonEnd.ts`, `awardsEngine.ts`, `streakEngine.ts`
  - Eventos & Narrativa: `dilemmaEngine.ts`, `missionEngine.ts`, `newsGenerator.ts`, `rivalryEngine.ts`, `specialEventsEngine.ts`, `torcidaGenerator.ts`
- `src/store/gameStore.ts` — Estado global do jogo (Zustand).
- `src/types/game.ts` — Contratos e tipos principais do jogo.
- `src/data/` — Seeds e catálogos (ligas, elencos, chuteiras, bolas, estilos de jogo, dilemas, conquistas).
- `src/components/` — Interface organizada por domínio (`game/`, `match/`, `manager/`, `online/`, `editor/`, `avatar/`, `layout/`).
  - `src/lib/minigameCanvas.ts` — Utilitários compartilhados de renderização Canvas 2D (gramado, trave com rede, bonequinhos de jogadores/goleiro, bola com rastro e toque responsivo).
  - `src/components/game/DifficultyBadge.tsx` — Indicador visual de dificuldade dinâmica (`Fácil`, `Equilibrado`, `Difícil`, `Elite`).
  - `src/components/match/PhaserPitchMinigame.tsx` — Arena 2D interativa em **Phaser 3** (toque/arraste no celular, opção de **Chutar** ou **Tocar** para companheiro de equipe, **Linha de Impedimento** dinâmica no último zagueiro, goleiro e 2 zagueiros, sistema de **Combo 🔥** e **Modo Desafio 5 Chutes**), integrada ao `LiveMatchModal`, Centro de Treinamento no `dashboard` e rota `/arena-2d` (com seletor de nível de liga).

## 3. Regras de Ouro para Desenvolvimento com IA
1. **Separação Engine vs UI:** Toda lógica de cálculo, simulação e regra de partida deve ficar em `src/engine/` (funções puras sempre que possível), nunca misturada dentro de componentes React.
2. **Estado Centralizado:** Alterações de estado persistente passam por `src/store/gameStore.ts` e respeitam `src/types/game.ts`.
3. **Tarefas Atômicas:** Ao pedir novas mecânicas ou correções para a IA, quebre em etapas pequenas (ex.: 1. Tipo em `types/game.ts` -> 2. Regra em `engine/` -> 3. Ação no `gameStore.ts` -> 4. UI em `components/`).
4. **Verificação Obrigatória:** Após cada bloco de alteração, rodar `npm run lint` e `npm run build` para garantir zero erros de TypeScript/Next.js.
