// ==============================================================================
// BOLA NA REDE: CARREIRA - SISTEMA DE PATCH DE ELENCOS 2026 (src/data/rosterPatch2026.ts)
// Atualização Oficial de Elencos 2026 - Neymar Jr no Santos e Transferências Oficiais
// ==============================================================================

import { Club, Player, Position, PlayerAttributes } from '@/types/game';
import { calculateOverall, calculateMarketValue, calculateWeeklyWage } from '@/lib/calculations';
import { organizeRosterForFormation } from '@/engine/positionEngine';

export interface RosterMove {
  playerName: string;
  nickname?: string;
  toClub: string;            // ID do clube (ex: 'san' para Santos)
  fromClub?: string;          // ID do clube de onde está saindo (opcional)
  shirtNumber?: number;       // Número da camisa
  position: Position;         // Posição tática
  overall: number;           // Overall calibrado para 2026
  age?: number;               // Idade em 2026
  isStarter?: boolean;        // Se deve ser forçado como titular
  attrs?: Partial<PlayerAttributes>;
}

export interface RosterDeparture {
  playerName: string;
  fromClub: string;           // Clube de onde saiu
  reason: string;             // Motivo (aposentadoria ou transferência exterior)
}

export const ROSTER_PATCH_2026 = {
  version: "2026.11-official-v5",
  updatedAt: "2026-11-25",
  description: "Patch Oficial Novembro/2026: Calibração de Overall das Ligas Internacionais & Escalação por Setor/Posição Real sem improvisar atacantes na zaga",
  
  // ============================================================================
  // TRANSFERÊNCIAS ATIVAS (NOVEMBRO / 2026)
  // ============================================================================
  moves: [
    // --------------------------------------------------------------------------
    // 1. SANTOS FC - TRIO ESTELAR 2026 (NEYMAR JR, GABIGOL E PHILIPPE COUTINHO)
    // --------------------------------------------------------------------------
    {
      playerName: "Neymar da Silva Santos Jr",
      nickname: "Neymar Jr 👑⚪⚫",
      toClub: "san",
      fromClub: "hil", // Removido do Al-Hilal
      shirtNumber: 10,
      position: "MEI" as Position,
      overall: 83,
      age: 33,
      isStarter: true,
      attrs: {
        pace: 74, dribbling: 90, tackling: 36, defending: 36, attacking: 88, finishing: 82,
        passing: 88, positioning: 86, heading: 62, crossing: 85, shooting: 82, jumping: 68,
        playmaker: 90, elasticity: 50,
      },
    },
    {
      playerName: "Gabriel Barbosa",
      nickname: "Gabigol 🏹⚪⚫",
      toClub: "san",
      fromClub: "cru", // Emprestado pelo Cruzeiro em 2026
      shirtNumber: 99,
      position: "ATA" as Position,
      overall: 81,
      age: 29,
      isStarter: true,
      attrs: {
        pace: 80, dribbling: 81, tackling: 35, defending: 34, attacking: 83, finishing: 84,
        passing: 75, positioning: 85, heading: 75, crossing: 72, shooting: 83, jumping: 78,
        playmaker: 77, elasticity: 45
      }
    },
    {
      playerName: "Philippe Coutinho",
      nickname: "Coutinho 🪄⚪⚫",
      toClub: "san",
      fromClub: "vas", // Rescindiu com o Vasco e atua pelo Peixe
      shirtNumber: 11,
      position: "MEI" as Position,
      overall: 80,
      age: 32,
      isStarter: true,
      attrs: {
        pace: 75, dribbling: 84, tackling: 42, defending: 40, attacking: 82, finishing: 80,
        passing: 84, positioning: 82, heading: 58, crossing: 82, shooting: 84, jumping: 66,
        playmaker: 86, elasticity: 46
      }
    },
    {
      playerName: "Guilherme Augusto",
      nickname: "Guilherme ⚡⚪⚫",
      toClub: "san",
      shirtNumber: 7,
      position: "PE" as Position,
      overall: 78,
      age: 29,
      isStarter: true,
      attrs: {
        pace: 84, dribbling: 80, tackling: 42, defending: 40, attacking: 79, finishing: 78,
        passing: 75, positioning: 79, heading: 68, crossing: 78, shooting: 79, jumping: 74,
        playmaker: 76, elasticity: 45
      }
    },
    {
      playerName: "Giuliano Victor de Paula",
      nickname: "Giuliano 🎯⚪⚫",
      toClub: "san",
      shirtNumber: 20,
      position: "MC" as Position,
      overall: 77,
      age: 34,
      isStarter: true,
      attrs: {
        pace: 68, dribbling: 78, tackling: 58, defending: 56, attacking: 78, finishing: 76,
        passing: 82, positioning: 80, heading: 66, crossing: 79, shooting: 78, jumping: 66,
        playmaker: 82, elasticity: 44
      }
    },
    {
      playerName: "Carlos Gilberto Silva (Gil)",
      nickname: "Gil 🛡️⚪⚫",
      toClub: "san",
      shirtNumber: 4,
      position: "ZAG" as Position,
      overall: 77,
      age: 37,
      isStarter: true,
      attrs: {
        pace: 62, dribbling: 55, tackling: 82, defending: 82, attacking: 48, finishing: 42,
        passing: 68, positioning: 83, heading: 85, crossing: 45, shooting: 52, jumping: 80,
        playmaker: 62, elasticity: 48
      }
    },
    {
      playerName: "Gabriel Brazão",
      nickname: "Brazão 🧤⚪⚫",
      toClub: "san",
      shirtNumber: 1,
      position: "GOL" as Position,
      overall: 76,
      age: 24,
      isStarter: true,
      attrs: {
        pace: 60, dribbling: 45, tackling: 40, defending: 78, attacking: 40, finishing: 30,
        passing: 70, positioning: 78, heading: 45, crossing: 40, shooting: 30, jumping: 80,
        playmaker: 55, elasticity: 80
      }
    },

    // --------------------------------------------------------------------------
    // 2. PALMEIRAS - PAULINHO (CONTRATAÇÃO DE PESO NO ATAQUE DO VERDÃO)
    // --------------------------------------------------------------------------
    {
      playerName: "Paulinho",
      nickname: "Paulinho 🏹🟢",
      toClub: "pal",
      fromClub: "cam", // Contratado do Atlético-MG
      shirtNumber: 10,
      position: "ATA" as Position,
      overall: 81,
      age: 25,
      isStarter: true,
      attrs: {
        pace: 84, dribbling: 82, tackling: 42, defending: 40, attacking: 83, finishing: 83,
        passing: 77, positioning: 84, heading: 75, crossing: 76, shooting: 82, jumping: 79,
        playmaker: 78, elasticity: 46
      }
    },

    // --------------------------------------------------------------------------
    // 3. SÃO PAULO - CAULY (EMPRESTADO PELO BAHIA ATÉ O FIM DE 2026)
    // --------------------------------------------------------------------------
    {
      playerName: "Cauly Oliveira Souza",
      nickname: "Cauly 🎯🔴⚪⚫",
      toClub: "sao",
      fromClub: "bah", // Emprestado pelo Bahia
      shirtNumber: 8,
      position: "MEI" as Position,
      overall: 80,
      age: 29,
      isStarter: true,
      attrs: {
        pace: 78, dribbling: 83, tackling: 50, defending: 48, attacking: 81, finishing: 77,
        passing: 83, positioning: 81, heading: 60, crossing: 82, shooting: 79, jumping: 68,
        playmaker: 84, elasticity: 46
      }
    },

    // --------------------------------------------------------------------------
    // 4. BARCELONA - JOÃO CANCELO (RETORNO EM DEFINITIVO AO BARÇA EM 2026)
    // --------------------------------------------------------------------------
    {
      playerName: "João Cancelo",
      nickname: "Cancelo 🪄🔵🔴",
      toClub: "bar",
      fromClub: "hil", // Retornou do Al-Hilal em definitivo
      shirtNumber: 2,
      position: "LD" as Position,
      overall: 84,
      age: 31,
      isStarter: true,
      attrs: {
        pace: 83, dribbling: 86, tackling: 79, defending: 78, attacking: 84, finishing: 72,
        passing: 85, positioning: 82, heading: 68, crossing: 87, shooting: 75, jumping: 74,
        playmaker: 85, elasticity: 48
      }
    },

    // --------------------------------------------------------------------------
    // 5. ATHLETIC BILBAO - AYMERIC LAPORTE (RETORNO À LA LIGA ESPANHOLA)
    // --------------------------------------------------------------------------
    {
      playerName: "Aymeric Laporte",
      nickname: "Laporte 🛡️🇪🇸",
      toClub: "ath",
      fromClub: "aln", // Voltou para a Espanha vindo do Al-Nassr
      shirtNumber: 4,
      position: "ZAG" as Position,
      overall: 83,
      age: 31,
      isStarter: true,
      attrs: {
        pace: 68, dribbling: 68, tackling: 85, defending: 86, attacking: 55, finishing: 45,
        passing: 79, positioning: 86, heading: 85, crossing: 58, shooting: 56, jumping: 82,
        playmaker: 75, elasticity: 50
      }
    },

    // --------------------------------------------------------------------------
    // 6. CRUZEIRO - CÁSSIO E MATHEUS PEREIRA
    // --------------------------------------------------------------------------
    {
      playerName: "Cássio Ramos",
      nickname: "Cássio 🧤🔵",
      toClub: "cru",
      shirtNumber: 1,
      position: "GOL" as Position,
      overall: 80,
      age: 37,
      isStarter: true,
      attrs: {
        pace: 55, dribbling: 40, tackling: 45, defending: 83, attacking: 35, finishing: 25,
        passing: 68, positioning: 84, heading: 50, crossing: 35, shooting: 25, jumping: 81,
        playmaker: 55, elasticity: 83
      }
    },
    {
      playerName: "Matheus Pereira",
      nickname: "Matheus Pereira 🪄🔵",
      toClub: "cru",
      shirtNumber: 10,
      position: "MEI" as Position,
      overall: 81,
      age: 28,
      isStarter: true,
      attrs: {
        pace: 78, dribbling: 83, tackling: 52, defending: 50, attacking: 82, finishing: 78,
        passing: 84, positioning: 82, heading: 64, crossing: 83, shooting: 80, jumping: 70,
        playmaker: 85, elasticity: 46
      }
    },

    // --------------------------------------------------------------------------
    // 7. FLUMINENSE - THIAGO SILVA E GANSO
    // --------------------------------------------------------------------------
    {
      playerName: "Thiago Silva",
      nickname: "Monstro 🛡️🇭🇺",
      toClub: "flu",
      shirtNumber: 3,
      position: "ZAG" as Position,
      overall: 81,
      age: 40,
      isStarter: true,
      attrs: {
        pace: 64, dribbling: 65, tackling: 85, defending: 86, attacking: 50, finishing: 45,
        passing: 76, positioning: 88, heading: 84, crossing: 60, shooting: 54, jumping: 82,
        playmaker: 72, elasticity: 50
      }
    },
    {
      playerName: "Paulo Henrique Ganso",
      nickname: "Ganso 🪄🇭🇺",
      toClub: "flu",
      shirtNumber: 10,
      position: "MEI" as Position,
      overall: 79,
      age: 35,
      isStarter: true,
      attrs: {
        pace: 58, dribbling: 82, tackling: 48, defending: 46, attacking: 80, finishing: 74,
        passing: 88, positioning: 81, heading: 65, crossing: 84, shooting: 76, jumping: 65,
        playmaker: 89, elasticity: 45
      }
    },

    // --------------------------------------------------------------------------
    // 8. CORINTHIANS - HUGO SOUZA NO GOL
    // --------------------------------------------------------------------------
    {
      playerName: "Hugo de Souza Nogueira",
      nickname: "Hugo Souza 🧤⚫⚪",
      toClub: "cor",
      shirtNumber: 1,
      position: "GOL" as Position,
      overall: 79,
      age: 26,
      isStarter: true,
      attrs: {
        pace: 62, dribbling: 45, tackling: 40, defending: 81, attacking: 40, finishing: 30,
        passing: 72, positioning: 81, heading: 45, crossing: 40, shooting: 30, jumping: 84,
        playmaker: 58, elasticity: 84
      }
    },

    // --------------------------------------------------------------------------
    // 9. GRÊMIO - MARTIN BRAITHWAITE
    // --------------------------------------------------------------------------
    {
      playerName: "Martin Braithwaite",
      nickname: "Braithwaite 🇩🇰🔵",
      toClub: "gre",
      shirtNumber: 22,
      position: "ATA" as Position,
      overall: 80,
      age: 33,
      isStarter: true,
      attrs: {
        pace: 80, dribbling: 79, tackling: 42, defending: 40, attacking: 82, finishing: 82,
        passing: 74, positioning: 83, heading: 78, crossing: 72, shooting: 81, jumping: 79,
        playmaker: 75, elasticity: 45
      }
    },

    // --------------------------------------------------------------------------
    // 10. INTERNACIONAL - RAFAEL BORRÉ
    // --------------------------------------------------------------------------
    {
      playerName: "Rafael Santos Borré",
      nickname: "Borré 🇨🇴🏹",
      toClub: "int",
      shirtNumber: 19,
      position: "ATA" as Position,
      overall: 80,
      age: 29,
      isStarter: true,
      attrs: {
        pace: 81, dribbling: 79, tackling: 44, defending: 42, attacking: 82, finishing: 81,
        passing: 74, positioning: 83, heading: 76, crossing: 70, shooting: 80, jumping: 78,
        playmaker: 76, elasticity: 46
      }
    },

    // --------------------------------------------------------------------------
    // 11. BAHIA - EVERTON RIBEIRO
    // --------------------------------------------------------------------------
    {
      playerName: "Everton Ribeiro",
      nickname: "E. Ribeiro 🪄🔵🔴",
      toClub: "bah",
      shirtNumber: 10,
      position: "MEI" as Position,
      overall: 79,
      age: 35,
      isStarter: true,
      attrs: {
        pace: 72, dribbling: 82, tackling: 54, defending: 52, attacking: 80, finishing: 75,
        passing: 84, positioning: 81, heading: 62, crossing: 83, shooting: 78, jumping: 66,
        playmaker: 85, elasticity: 45
      }
    },

    // --------------------------------------------------------------------------
    // 12. SÃO PAULO - LUCAS MOURA E CALLERI
    // --------------------------------------------------------------------------
    {
      playerName: "Lucas Rodrigues Moura da Silva",
      nickname: "Lucas Moura ⚡🔴⚪⚫",
      toClub: "sao",
      shirtNumber: 7,
      position: "PD" as Position,
      overall: 81,
      age: 32,
      isStarter: true,
      attrs: {
        pace: 85, dribbling: 84, tackling: 48, defending: 46, attacking: 82, finishing: 79,
        passing: 79, positioning: 82, heading: 68, crossing: 80, shooting: 81, jumping: 76,
        playmaker: 81, elasticity: 48
      }
    },
    {
      playerName: "Jonathan Calleri",
      nickname: "Calleri 🇦🇷🏹",
      toClub: "sao",
      shirtNumber: 9,
      position: "ATA" as Position,
      overall: 80,
      age: 31,
      isStarter: true,
      attrs: {
        pace: 75, dribbling: 76, tackling: 44, defending: 46, attacking: 83, finishing: 83,
        passing: 72, positioning: 84, heading: 85, crossing: 64, shooting: 82, jumping: 82,
        playmaker: 73, elasticity: 45
      }
    },

    // --------------------------------------------------------------------------
    // 13. ATLÉTICO MINEIRO - HULK
    // --------------------------------------------------------------------------
    {
      playerName: "Givanildo Vieira de Sousa (Hulk)",
      nickname: "Hulk 💪🏿⚫⚪",
      toClub: "cam",
      shirtNumber: 7,
      position: "ATA" as Position,
      overall: 82,
      age: 38,
      isStarter: true,
      attrs: {
        pace: 76, dribbling: 81, tackling: 48, defending: 46, attacking: 85, finishing: 85,
        passing: 79, positioning: 84, heading: 78, crossing: 80, shooting: 88, jumping: 80,
        playmaker: 81, elasticity: 46
      }
    },

    // --------------------------------------------------------------------------
    // 14. AL-HILAL - MARCOS LEONARDO NO COMANDO DO ATAQUE
    // --------------------------------------------------------------------------
    {
      playerName: "Marcos Leonardo Santos Almeida",
      nickname: "Marcos Leonardo 🎯🇸🇦",
      toClub: "hil",
      shirtNumber: 99,
      position: "ATA" as Position,
      overall: 80,
      age: 21,
      isStarter: true,
      attrs: {
        pace: 82, dribbling: 80, tackling: 35, defending: 34, attacking: 83, finishing: 83,
        passing: 72, positioning: 84, heading: 78, crossing: 68, shooting: 82, jumping: 78,
        playmaker: 75, elasticity: 44
      }
    }
  ],

  // ============================================================================
  // REMOÇÕES / APOSENTADORIAS / TRANSFERÊNCIAS PARA FORA DA BASE (NOVEMBRO / 2026)
  // ============================================================================
  departures: [
    {
      playerName: "Pablo Vegetti",
      fromClub: "vas",
      reason: "Negociado com o Cerro Porteño (futebol paraguaio)"
    },
    {
      playerName: "Aleksandar Mitrovic",
      fromClub: "hil",
      reason: "Transferido para o Al-Rayyan (futebol do Catar)"
    },
    {
      playerName: "Roberto Firmino",
      fromClub: "ahl",
      reason: "Transferido para o Al-Sadd (futebol do Catar desde 2025)"
    },
    {
      playerName: "Sergio Busquets",
      fromClub: "mia",
      reason: "Aposentado do futebol profissional ao fim da temporada 2025"
    },
    {
      playerName: "Jordi Alba",
      fromClub: "mia",
      reason: "Aposentado do futebol profissional ao fim da temporada 2025"
    }
  ] as RosterDeparture[]
};

/**
 * Normaliza nomes para busca comparativa limpa
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Verifica se dois nomes representam o mesmo atleta evitando falsos positivos com sobrenomes comuns
 */
function isPlayerNameMatch(nameA: string, nameB: string): boolean {
  const a = normalizeName(nameA);
  const b = normalizeName(nameB);
  if (!a || !b) return false;
  if (a === b) return true;

  // Casos especiais diretos
  if (a.includes('neymar') && b.includes('neymar')) return true;
  if ((a.includes('gabigol') || a.includes('gabrielbarbosa')) && (b.includes('gabigol') || b.includes('gabrielbarbosa'))) return true;
  if (a.includes('coutinho') && b.includes('coutinho')) return true;
  if (a.includes('vegetti') && b.includes('vegetti')) return true;
  if (a.includes('paulinho') && b.includes('paulinho')) return true;
  if (a.includes('cauly') && b.includes('cauly')) return true;
  if (a.includes('busquets') && b.includes('busquets')) return true;
  if ((a.includes('jordialba') || a.includes('alba')) && (b.includes('jordialba') || b.includes('alba'))) return true;
  if (a.includes('cancelo') && b.includes('cancelo')) return true;
  if (a.includes('mitrovic') && b.includes('mitrovic')) return true;
  if (a.includes('laporte') && b.includes('laporte')) return true;
  if (a.includes('firmino') && b.includes('firmino')) return true;
  if (a.includes('thiagosilva') && b.includes('thiagosilva')) return true;
  if (a.includes('braithwaite') && b.includes('braithwaite')) return true;
  if (a.includes('depay') && b.includes('depay')) return true;
  if (a.includes('marcosleonardo') && b.includes('marcosleonardo')) return true;

  // Comparação de substring segura (mínimo 8 caracteres e não pode ser apenas sobrenome genérico)
  const common = ['silva', 'santos', 'oliveira', 'souza', 'pereira', 'costa', 'alves', 'junior', 'rodrigues'];
  if (common.includes(a) || common.includes(b)) return false;

  if (a.length >= 8 && b.length >= 8) {
    if (a.includes(b) || b.includes(a)) return true;
  }

  return false;
}

/**
 * Aplica o patch oficial de elencos 2026 em uma coleção de clubes.
 * Garante idempotência, remoção de duplicatas e elencos válidos (mín. 18 jogadores com goleiro).
 */
export function applyRosterPatch2026(clubs: Record<string, Club>): Record<string, Club> {
  if (!clubs || Object.keys(clubs).length === 0) return clubs;

  const patchedClubs: Record<string, Club> = { ...clubs };
  const appliedPatchIds = new Set<string>();

  // 1. Processa cada movimentação do Patch 2026
  ROSTER_PATCH_2026.moves.forEach((move) => {
    const targetClubId = move.toClub;
    const targetClub = patchedClubs[targetClubId];
    if (!targetClub) return;

    const normTargetName = normalizeName(move.playerName);

    // 1.1 Remove o jogador de QUALQUER OUTRO CLUBE para evitar duplicatas
    Object.keys(patchedClubs).forEach((clubId) => {
      if (clubId === targetClubId) return; // Não remove do clube destino
      const club = patchedClubs[clubId];
      if (!club || !club.roster) return;

      const filteredRoster = club.roster.filter((p) => {
        const matchName = isPlayerNameMatch(p.name, move.playerName);
        const matchNick = p.nickname ? isPlayerNameMatch(p.nickname, move.playerName) : false;
        return !matchName && !matchNick;
      });

      // Se removeu alguém, ajusta o lineup e garante que o clube mantenha pelo menos 18 jogadores
      if (filteredRoster.length !== club.roster.length) {
        const removedIds = new Set(club.roster.filter(p => !filteredRoster.includes(p)).map(p => p.id));
        const updatedLineup = (club.lineup || []).filter(id => !removedIds.has(id));

        // Se faltar titular no lineup, repõe com o primeiro reserva disponível
        while (updatedLineup.length < 11 && filteredRoster.length > updatedLineup.length) {
          const nextReserve = filteredRoster.find(p => !updatedLineup.includes(p.id));
          if (nextReserve) updatedLineup.push(nextReserve.id);
          else break;
        }

        patchedClubs[clubId] = {
          ...club,
          roster: filteredRoster,
          lineup: updatedLineup,
        };
      }
    });

    // 1.2 Insere ou atualiza o jogador no clube de destino
    const destRoster = [...(patchedClubs[targetClubId]?.roster || [])];
    const existingIndex = destRoster.findIndex((p) => {
      const matchName = isPlayerNameMatch(p.name, move.playerName);
      const matchNick = p.nickname ? isPlayerNameMatch(p.nickname, move.playerName) : false;
      return matchName || matchNick;
    });

    const attrs = move.attrs as PlayerAttributes;
    const rawOverall = move.overall || calculateOverall(move.position, attrs);
    const overall = Math.min(99, Math.max(40, rawOverall));
    const age = Math.min(48, Math.max(16, move.age || 28));
    const potential = Math.min(99, Math.max(overall, overall + 2));
    const marketValue = calculateMarketValue(overall, age, potential);
    const wage = calculateWeeklyWage(overall, false);
    const shirtNumber = move.shirtNumber ? Math.min(99, Math.max(1, move.shirtNumber)) : undefined;

    const patchedPlayer: Player = {
      id: existingIndex >= 0 ? destRoster[existingIndex].id : `${targetClubId}-patch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: move.playerName,
      nickname: move.nickname || move.playerName,
      age,
      position: move.position,
      attributes: attrs,
      overall,
      potential,
      energy: 100,
      morale: 95,
      contractWeeks: 104,
      marketValue,
      wage,
      isYouth: false,
      jerseyNumber: shirtNumber,
    };

    appliedPatchIds.add(patchedPlayer.id);

    if (existingIndex >= 0) {
      // Atualiza os dados do jogador já existente
      destRoster[existingIndex] = {
        ...destRoster[existingIndex],
        ...patchedPlayer,
      };
    } else {
      // Substitui um jogador genérico da mesma posição ou reserva não modificado
      const replaceIndex = destRoster.findIndex(
        (p, i) => i >= 10 && p.position === move.position && !appliedPatchIds.has(p.id)
      );

      if (replaceIndex >= 0) {
        destRoster[replaceIndex] = patchedPlayer;
      } else {
        const anyReplaceIndex = destRoster.findIndex(
          (p, i) => i >= 10 && !appliedPatchIds.has(p.id)
        );
        if (anyReplaceIndex >= 0) {
          destRoster[anyReplaceIndex] = patchedPlayer;
        } else {
          destRoster.push(patchedPlayer);
        }
      }
    }

    // 1.3 Se for titular, garante que esteja nos primeiros 11 jogadores do elenco e no lineup
    if (move.isStarter) {
      const playerCurrentIndex = destRoster.findIndex((p) => p.id === patchedPlayer.id);
      if (playerCurrentIndex > 10) {
        // Encontra o titular da mesma posição para trocar, ou o titular de menor overall (exceto goleiro)
        let swapTargetIndex = destRoster.findIndex(
          (p, i) => i < 11 && i > 0 && p.position === move.position && !appliedPatchIds.has(p.id)
        );

        if (swapTargetIndex === -1) {
          // Pega o jogador de menor overall entre os titulares de linha (índices 1 a 10)
          let lowestOvr = 999;
          swapTargetIndex = 10;
          for (let i = 1; i < 11; i++) {
            if (!appliedPatchIds.has(destRoster[i].id) && destRoster[i].overall < lowestOvr) {
              lowestOvr = destRoster[i].overall;
              swapTargetIndex = i;
            }
          }
        }

        // Troca o jogador do banco para os titulares
        const temp = destRoster[swapTargetIndex];
        destRoster[swapTargetIndex] = destRoster[playerCurrentIndex];
        destRoster[playerCurrentIndex] = temp;
      }
    }

    // Inicializa ou atualiza o lineup oficial com os 11 primeiros jogadores
    const updatedLineup = destRoster.slice(0, 11).map((p) => p.id);

    patchedClubs[targetClubId] = {
      ...patchedClubs[targetClubId],
      roster: destRoster,
      lineup: updatedLineup,
    };
  });

  // 1.4 Processa saídas, transferências para o exterior e aposentadorias oficiais
  (ROSTER_PATCH_2026.departures || []).forEach((dep) => {
    const fromClub = patchedClubs[dep.fromClub];
    if (!fromClub || !fromClub.roster) return;

    const filteredRoster = fromClub.roster.filter((p) => {
      const matchName = isPlayerNameMatch(p.name, dep.playerName);
      const matchNick = p.nickname ? isPlayerNameMatch(p.nickname, dep.playerName) : false;
      return !matchName && !matchNick;
    });

    if (filteredRoster.length !== fromClub.roster.length) {
      const removedIds = new Set(fromClub.roster.filter((p) => !filteredRoster.includes(p)).map((p) => p.id));
      const updatedLineup = (fromClub.lineup || []).filter((id) => !removedIds.has(id));

      while (updatedLineup.length < 11 && filteredRoster.length > updatedLineup.length) {
        const nextReserve = filteredRoster.find((p) => !updatedLineup.includes(p.id));
        if (nextReserve) updatedLineup.push(nextReserve.id);
        else break;
      }

      patchedClubs[dep.fromClub] = {
        ...fromClub,
        roster: filteredRoster,
        lineup: updatedLineup,
      };
    }
  });

  // 2. Validação geral e sanitização de todos os clubes
  Object.keys(patchedClubs).forEach((clubId) => {
    const club = patchedClubs[clubId];
    if (!club) return;

    let roster = [...(club.roster || [])];

    const realFirstNames = ['Lucas', 'Mateo', 'Alex', 'Liam', 'Noah', 'Gabriel', 'Julian', 'Marco', 'Diego', 'Carlos', 'David', 'Felipe', 'Arthur', 'Rodrigo', 'Leo', 'Enzo', 'Thiago', 'Matheus', 'Bruno'];
    const realLastNames = ['Silva', 'Santos', 'Johnson', 'Smith', 'Al-Dawsari', 'Gomez', 'Fernandez', 'Miller', 'Williams', 'Oliveira', 'Rodriguez', 'Brown', 'Davis', 'Martinez', 'Costa', 'Ribeiro'];

    // Auto-cura de qualquer nome genérico residual do tipo "Atleta [CLUBE] [NUMERO]"
    roster = roster.map((p, idx) => {
      if (p.name && (p.name.startsWith('Atleta ') || /^Atleta [A-Z]{2,5} \d+$/i.test(p.name))) {
        const fn = realFirstNames[(club.name.charCodeAt(0) + idx) % realFirstNames.length];
        const ln = realLastNames[(club.name.charCodeAt(1) + idx * 3) % realLastNames.length];
        return {
          ...p,
          name: `${fn} ${ln}`,
          nickname: ln,
        };
      }
      return p;
    });

    // Garante que haja pelo menos 18 jogadores com nomes reais e posições distribuídas
    if (roster.length < 18) {
      const needed = 18 - roster.length;
      const fillerPositions: Position[] = ['ZAG', 'MC', 'ATA', 'VOL', 'LE', 'LD', 'MEI', 'PE', 'PD', 'GOL'];
      const realFirstNames = ['Lucas', 'Mateo', 'Alex', 'Liam', 'Noah', 'Gabriel', 'Julian', 'Marco', 'Diego', 'Carlos', 'David', 'Felipe', 'Arthur', 'Rodrigo', 'Leo', 'Enzo'];
      const realLastNames = ['Silva', 'Santos', 'Johnson', 'Smith', 'Al-Dawsari', 'Gomez', 'Fernandez', 'Miller', 'Williams', 'Oliveira', 'Rodriguez', 'Brown', 'Davis', 'Martinez'];

      for (let i = 0; i < needed; i++) {
        const assignedPos = fillerPositions[i % fillerPositions.length];
        const fn = realFirstNames[(club.name.charCodeAt(0) + i) % realFirstNames.length];
        const ln = realLastNames[(club.name.charCodeAt(1) + i * 2) % realLastNames.length];
        const baseOvr = club.reputation >= 85 ? 74 : club.reputation >= 80 ? 70 : 66;

        const filler: Player = {
          id: `${clubId}-filler-${Date.now()}-${i}`,
          name: `${fn} ${ln}`,
          nickname: `${ln}`,
          age: 20 + ((i * 3) % 12),
          position: assignedPos,
          attributes: {
            pace: baseOvr - 2,
            dribbling: baseOvr - 1,
            tackling: assignedPos === 'ZAG' || assignedPos === 'VOL' ? baseOvr + 4 : baseOvr - 8,
            defending: assignedPos === 'ZAG' || assignedPos === 'VOL' || assignedPos === 'GOL' ? baseOvr + 5 : baseOvr - 8,
            attacking: assignedPos === 'ATA' || assignedPos === 'MEI' ? baseOvr + 5 : baseOvr - 6,
            finishing: assignedPos === 'ATA' ? baseOvr + 6 : baseOvr - 7,
            passing: baseOvr,
            positioning: baseOvr,
            heading: assignedPos === 'ZAG' || assignedPos === 'ATA' ? baseOvr + 4 : baseOvr - 4,
            crossing: baseOvr - 2,
            shooting: assignedPos === 'ATA' || assignedPos === 'MEI' ? baseOvr + 4 : baseOvr - 6,
            jumping: baseOvr,
            playmaker: assignedPos === 'MEI' || assignedPos === 'MC' ? baseOvr + 5 : baseOvr - 5,
            elasticity: assignedPos === 'GOL' ? baseOvr + 8 : 45,
          },
          overall: baseOvr,
          potential: baseOvr + 6,
          energy: 100,
          morale: 85,
          contractWeeks: 52,
          marketValue: baseOvr * 30000,
          wage: baseOvr * 350,
          isYouth: false,
        };
        roster.push(filler);
      }
    }

    // Recalibra atletas genéricos de ligas internacionais/Série A que caíram na faixa baixa (OVR < esperado)
    const minDivisionOvr =
      ['EUROPA'].includes(club.division) ? 80 :
      ['PL', 'LALIGA', 'SERIE_A_ITA', 'BUNDESLIGA', 'LIGUE_1'].includes(club.division) ? 74 :
      ['A', 'MLS', 'SAUDI_PRO', 'CHAMPIONSHIP', 'SEGUNDA_ESP', 'SERIE_B_ITA', 'BUNDESLIGA_2', 'LIGUE_2'].includes(club.division) ? 68 :
      0;

    if (minDivisionOvr > 0) {
      const targetBase = club.reputation >= 90 ? Math.max(minDivisionOvr + 5, 79) : club.reputation >= 84 ? minDivisionOvr + 3 : minDivisionOvr;
      roster = roster.map((p, idx) => {
        const isGeneric = !p.id.includes('-star-') && !p.id.startsWith('player-user-') && !p.id.startsWith('patch2026-');
        if (isGeneric && p.overall < minDivisionOvr) {
          const boost = targetBase + ((idx * 3) % 6) - p.overall;
          const boostedAttrs = { ...p.attributes };
          (Object.keys(boostedAttrs) as (keyof PlayerAttributes)[]).forEach((k) => {
            const val = boostedAttrs[k];
            if (typeof val === 'number') {
              boostedAttrs[k] = Math.min(92, Math.max(40, val + boost));
            }
          });
          const newOvr = calculateOverall(p.position, boostedAttrs);
          const newPot = Math.max(p.potential, Math.min(94, newOvr + 4));
          return {
            ...p,
            attributes: boostedAttrs,
            overall: newOvr,
            potential: newPot,
            marketValue: calculateMarketValue(newOvr, newPot, p.age),
            wage: calculateWeeklyWage(newOvr, p.isYouth),
          };
        }
        return p;
      });
    }

    // Garante que haja pelo menos um goleiro no elenco e no lineup
    const hasGk = roster.some((p) => p.position === 'GOL');
    if (!hasGk && roster.length > 0) {
      roster[0].position = 'GOL';
      roster[0].attributes.elasticity = 75;
      roster[0].attributes.defending = 75;
    }

    // Organiza os 11 titulares em suas posições táticas ideais e mantém os melhores reservas no banco
    const formation = club.tactics?.formation || '4-3-3';
    const organizedRoster = organizeRosterForFormation(roster, formation);
    const lineup = organizedRoster.slice(0, 11).map((p) => p.id);

    patchedClubs[clubId] = {
      ...club,
      roster: organizedRoster,
      lineup,
      captainPlayerId: club.captainPlayerId && lineup.includes(club.captainPlayerId) ? club.captainPlayerId : organizedRoster[2]?.id || organizedRoster[0]?.id,
      penaltyTakerPlayerId: club.penaltyTakerPlayerId && lineup.includes(club.penaltyTakerPlayerId) ? club.penaltyTakerPlayerId : organizedRoster[9]?.id || organizedRoster[0]?.id,
      freeKickTakerPlayerId: club.freeKickTakerPlayerId && lineup.includes(club.freeKickTakerPlayerId) ? club.freeKickTakerPlayerId : organizedRoster[7]?.id || organizedRoster[0]?.id,
    };
  });

  return patchedClubs;
}
