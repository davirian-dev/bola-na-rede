# Workflow de Desenvolvimento com IA (Adaptado para Bola na Rede)

Baseado na metodologia estruturada de criação de jogos com IA (Contexto -> Planejamento -> Execução Atômica -> Teste):

1. **Contexto Sempre Atualizado:**
   - Antes de iniciar uma feature grande, atualize o `docs/GDD.md` com a mecânica desejada.
   - O arquivo `AGENTS.md` na raiz aponta os agentes de IA diretamente para as regras e arquitetura do projeto.
2. **Prompts Atômicos (Diretor de Projeto):**
   - Evite pedir *"crie um sistema inteiro de X"*.
   - Peça em passos claros: *"Leia `src/engine/progression.ts` e adicione o cálculo de bônus Y mantendo os tipos de `src/types/game.ts`."*
3. **Validação Contínua:**
   - Sempre valide com `npm run lint` e `npm run build` após alterações.
   - Para mudanças visuais, teste no navegador (desktop e mobile).
