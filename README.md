# ⚽ Bola na Rede: Carreira

> Simulador de Carreira de Futebol definitivo no navegador: viva a ascensão de um atleta da base Sub-20 ao estrelato mundial ou assuma a prancheta de treinador para erguer taças nacionais e a Champions League.

[![Deploy com Vercel](https://vercel.com/button)](https://bola-na-rede-psi.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_Turbopack-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Principais Funcionalidades

### 👤 1. Modo Jogador
* **Avatar Dinâmico em SVG:** Customização em 6 camadas estritas (tom de pele, corte de cabelo, cor, barba e estilo de vestimenta).
* **14 Atributos Oficiais de Jogo:** Velocidade, Drible, Desarme, Defesa, Ataque, Finalização, Passe, Posicionamento, Cabeceio, Cruzamento, Chute, Salto, Armador e Elasticidade.
* **5 PlayStyles de Ouro (Habilidades Lendárias):** Arrancada Foguete (Rapid+), Finalizador Letal (Finisher+), Maestro Teleguiado (PlayMaker+), Muralha Cirúrgica (Anticipate+) e Asas de Aço (Acrobatic+).
* **Minigames de Decisão com Física 2D:**
  - **Bola Parada:** Física de efeito na bola (chute embaixo sobe, no meio vai reto, na lateral ou topo aplica curva na barreira).
  - **Minigame de Passe:** Linha de impedimento dinâmica traçada em tempo real com revisão pelo VAR.
* **Vida Extracampo & Finanças:** Salários semanais, luvas, patrocinadores oficiais, compra de chuteiras com bônus de atributos e eventos de coletiva de imprensa.

### 🧠 2. Modo Treinador
* **Prancheta Tática Completa:** 6 formações táticas (`4-3-3`, `4-4-2`, `3-5-2`, `4-2-3-1`, `5-3-2`, `4-1-4-1`).
* **Instruções e Filosofias:** Posturas Ofensiva, Equilibrada ou Defensiva; Pressão Alta e gestão de entrosamento da equipe.
* **Gestão de Elenco Profissional (25 atletas) e Base Sub-20 (11 atletas):** Escalação titular automática ou manual, 5 substituições por partida e treinos semanais.
* **Capitão e Cobradores Oficiais:** Designe o capitão do time (©️), cobrador de pênalti (🎯) e cobrador de falta (☄️).

### 🏆 3. Competições & 92 Clubes Reais
* **Brasileirão Séries A, B, C e D:** 76 clubes brasileiros com cores oficiais, estádios reais e clássicos históricos (Fla-Flu, Derby Paulista, Gre-Nal, Choque-Rei, etc.).
* **Champions League • Europa:** 16 gigantes mundiais (Real Madrid, Barcelona, Man City, Arsenal, Liverpool, Bayern, PSG, Inter de Milão, Milan, Juventus, Leverkusen, Dortmund, etc.) com atributos de elite (81-94) e propostas de transferências milionárias.
* **Copa do Brasil & Copinha de Base Sub-20:** Mata-mata e torneios com premiações e troféus de fim de temporada.

### 🌐 4. Modo Online, Rankings & Editor Comunitário
* **Duelos Online P2P:** Desafios de bola parada multiplayer via WebRTC.
* **Ranking Nacional & The Best:** Eleição do Melhor do Mundo, Revelação e Treinador do Ano.
* **Editor Comunitário:** Crie, edite e exporte/importe pacotes de clubes e jogadores em formato JSON.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js 18+ (recomendado Node 20+)
* npm, pnpm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/davirian-dev/bola-na-rede.git
cd bola-na-rede

# Instale as dependências
npm install

# Copie as variáveis de ambiente (opcional para Supabase)
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📦 Build para Produção & Deploy

```bash
# Gerar build otimizado com Turbopack
npm run build

# Iniciar servidor em modo produção
npm run start
```

---

## 📄 Licença

Distribuído sob licença MIT. Desenvolvido com foco em alta performance e imersão para os amantes do futebol.
