// ==============================================================================
// BOLA NA REDE: CARREIRA - DYNAMIC NEWS GENERATOR (src/engine/newsGenerator.ts)
// Notícias com Fotos Reais, Teasers em Vídeo, Portais Oficiais e Interações
// ==============================================================================

import { Fixture, NewsItem, Club, GameState, Division } from '@/types/game';

const PORTAIS = ['GE Globo Esporte', 'UOL Esporte', 'Lance!', 'ESPN Brasil', 'Gazeta Esportiva'] as const;
const AUTORES = ['Redação GE', 'André Rizek', 'Mauro Cezar', 'Ana Thaís Matos', 'Fábio Sormani', 'PVC'] as const;

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomEngagements() {
  return {
    likesCount: Math.floor(Math.random() * 4500) + 280,
    commentsCount: Math.floor(Math.random() * 850) + 45,
  };
}

/**
 * Analisa os resultados da rodada e gera manchetes dinâmicas com fotos reais e narrativa brasileira
 */
export function generateWeeklyNews(
  state: GameState,
  weekFixtures: Fixture[],
  promotedPlayerName?: string
): NewsItem[] {
  const news: NewsItem[] = [];
  const week = state.currentWeek;
  const year = state.seasonYear;

  // 1. Notícia de Promoção do Jogador (se ocorreu nesta semana)
  if (promotedPlayerName) {
    const eng = randomEngagements();
    news.push({
      id: `news-promo-${week}-${Date.now()}`,
      week,
      seasonYear: year,
      category: 'base',
      headline: `DA BASE AO PROFISSIONAL: ${promotedPlayerName} assina e é promovido!`,
      body: `Após se destacar com atuações de gala nos treinos e partidas da categoria Sub-20, a joia assinou seu primeiro contrato profissional com multa milionária e integrará o elenco principal.`,
      imageUrl: '/images/news/base.webp',
      imageCaption: 'Novo talento é apresentado na sala de imprensa com a camisa oficial',
      portalName: 'GE Globo Esporte',
      authorName: 'Redação Base GE',
      likesCount: eng.likesCount * 3,
      commentsCount: eng.commentsCount * 2,
    });
  }

  // 2. Busca por Goleadas (diferença >= 3 gols)
  const goleada = weekFixtures.find((f) => 
    f.isPlayed && Math.abs((f.homeGoals || 0) - (f.awayGoals || 0)) >= 3
  );

  if (goleada) {
    const winnerClub = (goleada.homeGoals || 0) > (goleada.awayGoals || 0)
      ? state.clubs[goleada.homeClubId]
      : state.clubs[goleada.awayClubId];
    const loserClub = (goleada.homeGoals || 0) > (goleada.awayGoals || 0)
      ? state.clubs[goleada.awayClubId]
      : state.clubs[goleada.homeClubId];

    const hScore = Math.max(goleada.homeGoals || 0, goleada.awayGoals || 0);
    const lScore = Math.min(goleada.homeGoals || 0, goleada.awayGoals || 0);

    if (winnerClub && loserClub) {
      const eng = randomEngagements();
      news.push({
        id: `news-goleada-${week}-${Date.now()}`,
        week,
        seasonYear: year,
        category: 'rodada',
        headline: `PASSEIO EM CAMPO! ${winnerClub.name} atropela o ${loserClub.name} por ${hScore} a ${lScore}!`,
        body: `Em partida avassaladora pela rodada ${week}, o ${winnerClub.name} dominou do início ao fim com futebol envolvente e impôs uma goleada histórica para delírio de sua torcida.`,
        clubId: winnerClub.id,
        imageUrl: '/images/news/gol.webp',
        videoTeaserUrl: '/videos/news/gol-loop.mp4',
        imageCaption: `Festa nas arquibancadas com a vitória maiúscula do ${winnerClub.name}`,
        portalName: randomElement(PORTAIS),
        authorName: randomElement(AUTORES),
        likesCount: eng.likesCount * 2,
        commentsCount: eng.commentsCount * 2,
      });
    }
  }

  // 3. Busca por Hat-Trick (jogador com 3 ou mais gols no mesmo jogo)
  weekFixtures.forEach((f) => {
    if (!f.scorers || f.scorers.length < 3) return;
    const countMap: Record<string, { count: number; name: string }> = {};
    f.scorers.forEach((s) => {
      if (!countMap[s.playerId]) {
        countMap[s.playerId] = { count: 0, name: s.playerName };
      }
      countMap[s.playerId].count++;
    });

    Object.values(countMap).forEach((scorer) => {
      if (scorer.count >= 3 && news.length < 4) {
        const eng = randomEngagements();
        news.push({
          id: `news-hattrick-${week}-${Date.now()}-${scorer.name}`,
          week,
          seasonYear: year,
          category: 'destaque',
          headline: `PEDE MÚSICA NO FANTÁSTICO! ${scorer.name} anota ${scorer.count} gols e comanda show!`,
          body: `Atuação de cinema! O atacante foi o grande nome da semana ao balançar as redes repetidas vezes com finalizações cirúrgicas e levar a bola do jogo para casa.`,
          imageUrl: '/images/news/drible.webp',
          videoTeaserUrl: '/videos/news/drible-loop.mp4',
          imageCaption: `${scorer.name} celebrou a tripleta com a torcida`,
          portalName: 'GE Globo Esporte',
          authorName: 'PVC',
          likesCount: eng.likesCount * 4,
          commentsCount: eng.commentsCount * 3,
        });
      }
    });
  });

  // 4. Zebra na Copa do Brasil
  const copaFixture = weekFixtures.find((f) => 
    f.competition === 'copa_brasil' && f.isPlayed
  );

  if (copaFixture) {
    const home = state.clubs[copaFixture.homeClubId];
    const away = state.clubs[copaFixture.awayClubId];

    if (home && away) {
      const divRank: Record<Division, number> = {
        A: 4, B: 3, C: 2, D: 1, EUROPA: 5,
        PL: 5, CHAMPIONSHIP: 4,
        LALIGA: 5, SEGUNDA_ESP: 4,
        SERIE_A_ITA: 5, SERIE_B_ITA: 4,
        BUNDESLIGA: 5, BUNDESLIGA_2: 4,
        LIGUE_1: 5, LIGUE_2: 4,
        MLS: 4, SAUDI_PRO: 5,
      };
      const homeRank = divRank[home.division] || 1;
      const awayRank = divRank[away.division] || 1;

      if ((copaFixture.homeGoals || 0) > (copaFixture.awayGoals || 0) && homeRank < awayRank) {
        const eng = randomEngagements();
        news.push({
          id: `news-zebra-${week}-${Date.now()}`,
          week,
          seasonYear: year,
          category: 'destaque',
          headline: `ZEBRA HISTÓRICA NA COPA DO BRASIL! ${home.name} derruba o ${away.name}!`,
          body: `O futebol brasileiro respira emoção pura! O ${home.name} da Série ${home.division} contrariou todos os prognósticos e venceu o favorito por ${copaFixture.homeGoals} a ${copaFixture.awayGoals} em noite épica de estádio lotado.`,
          clubId: home.id,
          imageUrl: '/images/news/estadio.webp',
          imageCaption: `Estádio em êxtase com a classificação histórica do ${home.name}`,
          portalName: 'ESPN Brasil',
          authorName: 'Mauro Cezar',
          likesCount: eng.likesCount * 3,
          commentsCount: eng.commentsCount * 3,
        });
      }
    }
  }

  // 5. Pênalti ou momento de tensão da rodada
  const penaltyMatch = weekFixtures.find((f) => f.isPlayed && (f.homeGoals === 1 && f.awayGoals === 0));
  if (penaltyMatch && news.length < 3) {
    const home = state.clubs[penaltyMatch.homeClubId];
    const away = state.clubs[penaltyMatch.awayClubId];
    if (home && away) {
      const eng = randomEngagements();
      news.push({
        id: `news-penalty-${week}-${Date.now()}`,
        week,
        seasonYear: year,
        category: 'rodada',
        headline: `DECISÃO NA MARCA DA CAL! ${home.name} bate o ${away.name} em duelo dramático!`,
        body: `Jogo tenso até os acréscimos! Uma penalidade cobrada com frieza selou os três pontos fundamentais para os mandantes na tabela.`,
        clubId: home.id,
        imageUrl: '/images/news/penalti.webp',
        imageCaption: 'Momento da cobrança decisiva que incendiou a partida',
        portalName: 'Lance!',
        authorName: 'Redação Lance',
        likesCount: eng.likesCount,
        commentsCount: eng.commentsCount,
      });
    }
  }

  // 6. Notícia de bastidores / tática do treinador
  if (state.mode === 'manager' && state.managerProfile && news.length < 3) {
    const eng = randomEngagements();
    news.push({
      id: `news-tactics-${week}-${Date.now()}`,
      week,
      seasonYear: year,
      category: 'destaque',
      headline: `PRANQUETA EM AÇÃO: ${state.managerProfile.name} inova na formação e recebe elogios`,
      body: `Especialistas destacam a leitura tática do comandante brasileiro, que tem ajustado transições rápidas e solidez defensiva no elenco.`,
      imageUrl: '/images/news/tatica.webp',
      imageCaption: 'Comissão técnica analisa prancheta tática e movimentações',
      portalName: 'UOL Esporte',
      authorName: 'Ana Thaís Matos',
      likesCount: eng.likesCount,
      commentsCount: eng.commentsCount,
    });
  }

  // 7. Notícia padrão da rodada se nenhuma especial tiver sido criada
  if (news.length === 0) {
    const eng = randomEngagements();
    news.push({
      id: `news-standard-${week}-${Date.now()}`,
      week,
      seasonYear: year,
      category: 'rodada',
      headline: `Rodada ${week} agita torcidas com equilíbrio em todas as divisões do país`,
      body: `A disputa segue intensa no topo da tabela e na briga contra o rebaixamento. Os elencos iniciam preparação com treinos intensivos para os próximos desafios.`,
      imageUrl: '/images/news/torcida.webp',
      imageCaption: 'Torcedores lotam as arenas pelo Brasil afora na rodada',
      portalName: 'GE Globo Esporte',
      authorName: 'Redação GE',
      likesCount: eng.likesCount,
      commentsCount: eng.commentsCount,
    });
  }

  return news;
}
