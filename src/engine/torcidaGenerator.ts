import { FanPost, GameState, Fixture } from '@/types/game';

const PRAISE_TEMPLATES = [
  'Que partidaça do {name}! Joga de terno e gravata, uma frieza absurda em campo! 🔥👏',
  'Se o {name} continuar nesse ritmo, a Seleção Brasileira é questão de semanas! 🇧🇷⭐',
  'Simplesmente o dono do jogo. Toda bola que passa no pé dele vira perigo!',
  'Valeu cada centavo do ingresso hoje! Esse moleque tem o futebol brasileiro na veia.',
  'Quem tem {name} não precisa de medo de ninguém. Craque demais! ⚽🎯',
];

const DERBY_WIN_TEMPLATES = [
  'CLÁSSICO É GUERRA E A CIDADE É NOSSA! Chora rival, freguês histórico! 💥🔥',
  'Ganhar clássico com gol do {name} é bom demais! Segunda-feira vou trabalhar com o manto!',
  'Eles falaram a semana inteira na imprensa e tomaram um chocolate em campo! KKKKK 🍿',
  'Clássico não se joga, clássico se ganha! Que raça e entrega do elenco!',
];

const CRITICISM_TEMPLATES = [
  'O time hoje parecia que tinha almoçado feijoada antes de entrar em campo... que lentidão.',
  'Perderam chances inacreditáveis na pequena área. Falta capricho na finalização!',
  'Muito passe de lado e pouca agressividade. Tem que cobrar essa diretoria!',
  'A torcida canta os 90 minutos mas o elenco precisa acordar pra realidade da temporada.',
];

const FUNNY_TEMPLATES = [
  'Meu cardiologista pediu pra eu parar de torcer pra esse time ou eu não passo dos 30 anos 😂',
  'Se o VAR demorar mais um pouco pra checar lance, o jogo de volta começa junto!',
  'O lateral deles tá até agora procurando onde o {name} foi parar com aquele drible desconcertante 🌪️',
  'Acabei de quebrar o controle remoto no sofá mas valeu a emoção kkkkkk',
];

const FAN_HANDLES = [
  { handle: '@MantoSagradoFiel', name: 'Manto Fiel', color: '#dc2626' },
  { handle: '@ArquibancadaRaiz', name: 'Voz da Geral', color: '#10b981' },
  { handle: '@ResenhaTatica', name: 'Analista de Sofá', color: '#3b82f6' },
  { handle: '@CorneteiroOficial', name: 'Corneteiro Nato', color: '#f59e0b' },
  { handle: '@LoucosPeloClube', name: 'Fanático 1902', color: '#8b5cf6' },
  { handle: '@CamisaDezClassico', name: 'Malandragem FC', color: '#ec4899' },
];

export function generateFanPosts(
  state: GameState,
  userFixture?: Fixture
): FanPost[] {
  const currentWeek = state.currentWeek;
  const playerName = state.mode === 'player' 
    ? (state.playerProfile?.nickname || state.playerProfile?.name || 'Craque')
    : (state.managerProfile?.name || 'Professor');

  const posts: FanPost[] = [];
  const userClubId = state.mode === 'player' ? state.playerProfile?.clubId : state.managerProfile?.clubId;
  const userClub = userClubId ? state.clubs[userClubId] : undefined;

  let isWin = false;
  let isLoss = false;
  let isDerby = false;

  if (userFixture && userClub) {
    const isHome = userFixture.homeClubId === userClub.id;
    const myScore = isHome ? (userFixture.homeGoals ?? 0) : (userFixture.awayGoals ?? 0);
    const oppScore = isHome ? (userFixture.awayGoals ?? 0) : (userFixture.homeGoals ?? 0);
    const oppClubId = isHome ? userFixture.awayClubId : userFixture.homeClubId;

    isWin = myScore > oppScore;
    isLoss = myScore < oppScore;

    if (userClub.rivalClubIds && userClub.rivalClubIds.includes(oppClubId)) {
      isDerby = true;
    }
  }

  // Sorteia 4 a 6 posts variados
  const pool = isDerby && isWin 
    ? [...DERBY_WIN_TEMPLATES, ...PRAISE_TEMPLATES]
    : isWin 
    ? [...PRAISE_TEMPLATES, ...FUNNY_TEMPLATES]
    : isLoss 
    ? [...CRITICISM_TEMPLATES, ...FUNNY_TEMPLATES]
    : [...FUNNY_TEMPLATES, ...PRAISE_TEMPLATES];

  for (let i = 0; i < 4; i++) {
    const fan = FAN_HANDLES[(currentWeek + i) % FAN_HANDLES.length];
    const rawText = pool[(currentWeek * 3 + i) % pool.length];
    const content = rawText.replace('{name}', playerName);

    posts.push({
      id: `fan-post-${currentWeek}-${i}-${Date.now()}`,
      authorHandle: fan.handle,
      authorName: fan.name,
      avatarColor: fan.color,
      content,
      sentiment: isWin ? 'praise' : isLoss ? 'criticism' : 'funny',
      likes: Math.floor(120 + Math.random() * 850),
      retweets: Math.floor(25 + Math.random() * 220),
      isDerby,
      createdAtWeek: currentWeek,
    });
  }

  return posts;
}