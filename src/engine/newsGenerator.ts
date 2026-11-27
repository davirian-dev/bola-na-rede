// ==============================================================================
// BOLA NA REDE: CARREIRA - DYNAMIC NEWS GENERATOR (src/engine/newsGenerator.ts)
// Motor Anti-Tédio: Narrativa Contextualizada, Clássicos Reais, Sequência "Em Chamas" e Cooldown de 10 Eventos
// ==============================================================================

import { Fixture, NewsItem, GameState, Division } from '@/types/game';

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
 * Analisa os resultados da rodada e gera manchetes dinâmicas com fotos reais, sem repetições
 */
export function generateWeeklyNews(
  state: GameState,
  weekFixtures: Fixture[],
  promotedPlayerName?: string
): { news: NewsItem[]; updatedRecentTemplates: string[] } {
  const news: NewsItem[] = [];
  const week = state.currentWeek;
  const year = state.seasonYear;

  // Fila de Memória Anti-Tédio: Cooldown de no mínimo 10 templates recentes
  const recentTemplates = state.recentNewsTemplates || [];
  const blockedTemplates = new Set(recentTemplates.slice(-10));
  const newUsedTemplates: string[] = [];

  const isTemplateAllowed = (tplKey: string) => !blockedTemplates.has(tplKey);
  const markTemplateUsed = (tplKey: string) => {
    newUsedTemplates.push(tplKey);
  };

  // 1. Notícia de Promoção do Jogador (se ocorreu nesta semana)
  if (promotedPlayerName && isTemplateAllowed('tpl_youth_promotion')) {
    markTemplateUsed('tpl_youth_promotion');
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

  // 2. Notícia de Clássico Regional da Rodada (Derby)
  const derbyFixture = weekFixtures.find((f) => {
    if (!f.isPlayed) return false;
    const h = state.clubs[f.homeClubId];
    const a = state.clubs[f.awayClubId];
    return (h?.rivalClubIds && h.rivalClubIds.includes(f.awayClubId)) ||
           (a?.rivalClubIds && a.rivalClubIds.includes(f.homeClubId));
  });

  if (derbyFixture && isTemplateAllowed('tpl_derby_epic')) {
    const home = state.clubs[derbyFixture.homeClubId];
    const away = state.clubs[derbyFixture.awayClubId];
    if (home && away) {
      markTemplateUsed('tpl_derby_epic');
      const derbyTitle = home.derbyName || away.derbyName || `Clássico ${home.shortName} x ${away.shortName}`;
      const hGoals = derbyFixture.homeGoals || 0;
      const aGoals = derbyFixture.awayGoals || 0;
      const eng = randomEngagements();

      const headline = hGoals === aGoals
        ? `TUDO IGUAL NO ${derbyTitle.toUpperCase()}! ${home.name} e ${away.name} empatam por ${hGoals} a ${aGoals} em jogo eletrizante!`
        : (hGoals > aGoals
          ? `DONOS DO CLÁSSICO! ${home.name} supera o ${away.name} por ${hGoals} a ${aGoals} e cala a torcida rival!`
          : `FESTA VISITANTE NO ${derbyTitle.toUpperCase()}! ${away.name} bate o ${home.name} por ${aGoals} a ${hGoals}!`);

      news.push({
        id: `news-derby-${week}-${Date.now()}`,
        week,
        seasonYear: year,
        category: 'destaque',
        headline,
        body: `Em atmosfera incandescente nas arquibancadas, o clássico entregou lances plásticos, divididas ríspidas e emoção até o apito final na rodada ${week}.`,
        imageUrl: '/images/news/estadio.webp',
        portalName: 'Lance!',
        authorName: 'Mauro Cezar',
        likesCount: eng.likesCount * 3,
        commentsCount: eng.commentsCount * 3,
      });
    }
  }

  // 3. Busca por Goleadas (diferença >= 3 gols)
  const goleada = weekFixtures.find((f) => 
    f.isPlayed && Math.abs((f.homeGoals || 0) - (f.awayGoals || 0)) >= 3
  );

  if (goleada && isTemplateAllowed('tpl_goleada_atropelo')) {
    const winnerClub = (goleada.homeGoals || 0) > (goleada.awayGoals || 0)
      ? state.clubs[goleada.homeClubId]
      : state.clubs[goleada.awayClubId];
    const loserClub = (goleada.homeGoals || 0) > (goleada.awayGoals || 0)
      ? state.clubs[goleada.awayClubId]
      : state.clubs[goleada.homeClubId];

    const hScore = Math.max(goleada.homeGoals || 0, goleada.awayGoals || 0);
    const lScore = Math.min(goleada.homeGoals || 0, goleada.awayGoals || 0);

    if (winnerClub && loserClub) {
      markTemplateUsed('tpl_goleada_atropelo');
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

  // 4. Busca por Hat-Trick (jogador com 3 ou mais gols no mesmo jogo)
  if (isTemplateAllowed('tpl_hat_trick')) {
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
          markTemplateUsed('tpl_hat_trick');
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
  }

  // 5. Zebra na Copa do Brasil
  const copaFixture = weekFixtures.find((f) => 
    f.competition === 'copa_brasil' && f.isPlayed
  );

  if (copaFixture && isTemplateAllowed('tpl_copa_zebra')) {
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
        markTemplateUsed('tpl_copa_zebra');
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

  // 6. Notícia padrão da rodada se nenhuma especial tiver sido criada
  if (news.length === 0) {
    const standardTemplates = [
      {
        key: 'tpl_std_fever',
        headline: `Rodada ${week} agita torcidas com equilíbrio em todas as divisões do país`,
        body: `A disputa segue intensa no topo da tabela e na briga contra o rebaixamento. Os elencos iniciam preparação com treinos intensivos para os próximos desafios.`,
      },
      {
        key: 'tpl_std_tactics',
        headline: `Equilíbrio tático marca a rodada ${week}: defesas sólidas e gols nos acréscimos`,
        body: `Treinadores apostam em linhas compactas e transições velozes. A corrida pelos pontos da temporada ganha contornos dramáticos.`,
      },
      {
        key: 'tpl_std_table',
        headline: `Classificação embolada: cada ponto na rodada ${week} vale ouro na temporada`,
        body: `Com confrontos diretos decididos no detalhe, os clubes brasileiros mostram que a temporada 2026 será uma das mais disputadas da década.`,
      },
    ];

    const pick = standardTemplates.find((t) => isTemplateAllowed(t.key)) || standardTemplates[0];
    markTemplateUsed(pick.key);
    const eng = randomEngagements();
    news.push({
      id: `news-standard-${week}-${Date.now()}`,
      week,
      seasonYear: year,
      category: 'rodada',
      headline: pick.headline,
      body: pick.body,
      imageUrl: '/images/news/torcida.webp',
      imageCaption: 'Torcedores lotam as arenas pelo Brasil afora na rodada',
      portalName: 'GE Globo Esporte',
      authorName: 'Redação GE',
      likesCount: eng.likesCount,
      commentsCount: eng.commentsCount,
    });
  }

  // Atualiza a fila recente de templates (mantendo no máximo 10 elementos)
  const updatedRecentTemplates = [...recentTemplates, ...newUsedTemplates].slice(-10);

  return { news, updatedRecentTemplates };
}
