<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Regras do Projeto — Bola na Rede

- **Contexto e Arquitetura:** Antes de implementar novas mecânicas ou refatorações, consulte `docs/GDD.md` e `docs/WORKFLOW-IA.md`.
- **Separação de Camadas:**
  - Lógica pura de simulação e regras de jogo fica em `src/engine/`.
  - Estado global fica em `src/store/gameStore.ts`.
  - Tipos principais ficam em `src/types/game.ts`.
  - Dados estáticos/seeds ficam em `src/data/`.
  - Componentes visuais ficam em `src/components/` separados por domínio (`game/`, `match/`, `manager/`, `online/`, `editor/`, `avatar/`, `layout/`).
- **Verificação:** Após alterações de código, execute `npm run lint` e `npm run build` para garantir integridade de tipos e build.

## Padrões de Qualidade & Engenharia (Antigravity Suite)
- **Rigor Técnico (Gravitas)**: Ler os componentes e seus chamadores antes de mutações; validar integridade com testes e checagem de sintaxe (
ode --check ou 
pm run build).
- **Design & UI Anti-Slop (Impeccable)**:
  - Usar /impeccable critique ou /impeccable polish antes de fechar alterações de interface.
  - Evitar gradientes genéricos roxo/violeta sem motivo, manter contraste WCAG AA (mínimo 4.5:1) e hierarquia tipográfica com saltos mínimos de 1.25x entre títulos.
  - Não aninhar cards dentro de cards desnecessariamente.
- **Arquitetura (Graphify)**: O projeto possui grafo AST indexado em graphify-out/. Para navegar por dependências ou refatorações de alto impacto, consulte o grafo ou execute graphify query.
