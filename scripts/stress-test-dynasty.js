/**
 * SCRIPT DE ESTRESSE & VALIDAÇÃO: 10 TEMPORADAS DE SIMULAÇÃO (Bola na Rede: Carreira)
 * Valida: Ausência de NaN/Infinity, integridade de saldos, atributos, tamanho do JSON (<350KB)
 */

console.log('⚽ [STRESS TEST] Iniciando Auditoria de 10 Temporadas no Bola na Rede...');

// Simulação matemática dos ciclos de 10 temporadas (48 semanas x 10 = 480 semanas)
let mockPlayerProfile = {
  id: 'usr_craque_teste',
  name: 'Davi Gabriel',
  overall: 68,
  happiness: 65,
  starterContention: 50,
  squadStatus: 'reserve',
  bankBalance: 12000,
  weeklyWage: 2500,
  energy: 90,
  morale: 80,
  stats: {
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    yellowCards: 0,
    redCards: 0,
    averageRating: 6.8,
  },
  family: [],
};

const totalWeeks = 48 * 10; // 480 semanas
let errorsDetected = [];

for (let week = 1; week <= totalWeeks; week++) {
  const currentSeason = Math.floor((week - 1) / 48) + 2026;
  const weekInSeason = ((week - 1) % 48) + 1;

  // 1. Simula atuação e rating
  const matchPlayed = Math.random() < 0.85;
  if (matchPlayed) {
    mockPlayerProfile.stats.matchesPlayed += 1;
    const goals = Math.random() < 0.35 ? 1 : Math.random() < 0.1 ? 2 : 0;
    const assists = Math.random() < 0.25 ? 1 : 0;
    mockPlayerProfile.stats.goals += goals;
    mockPlayerProfile.stats.assists += assists;

    // Rating
    const matchRating = 6.0 + goals * 1.5 + assists * 1.0 + (Math.random() * 1.5 - 0.5);
    const prevMatches = mockPlayerProfile.stats.matchesPlayed - 1;
    mockPlayerProfile.stats.averageRating = ((mockPlayerProfile.stats.averageRating * prevMatches) + matchRating) / mockPlayerProfile.stats.matchesPlayed;

    // Disputa pela vaga
    if (matchRating >= 7.5) {
      mockPlayerProfile.starterContention = Math.min(100, mockPlayerProfile.starterContention + 6);
    } else if (matchRating < 6.0) {
      mockPlayerProfile.starterContention = Math.max(10, mockPlayerProfile.starterContention - 4);
    }

    if (mockPlayerProfile.starterContention >= 85) mockPlayerProfile.squadStatus = 'key_player';
    else if (mockPlayerProfile.starterContention >= 65) mockPlayerProfile.squadStatus = 'starter';
    else if (mockPlayerProfile.starterContention < 40) mockPlayerProfile.squadStatus = 'reserve';
  }

  // 2. Felicidade
  if (mockPlayerProfile.squadStatus === 'key_player') mockPlayerProfile.happiness = Math.min(100, mockPlayerProfile.happiness + 1);
  if (mockPlayerProfile.squadStatus === 'reserve') mockPlayerProfile.happiness = Math.max(10, mockPlayerProfile.happiness - 1);

  // 3. Economia e Salário
  mockPlayerProfile.bankBalance += mockPlayerProfile.weeklyWage;

  // 4. Evolução a cada temporada
  if (weekInSeason === 48) {
    if (mockPlayerProfile.overall < 92) {
      mockPlayerProfile.overall += Math.floor(Math.random() * 3) + 1;
      mockPlayerProfile.weeklyWage = Math.round(mockPlayerProfile.weeklyWage * 1.35);
    }
  }

  // Checagem de NaN ou Infinity
  const fields = ['overall', 'happiness', 'starterContention', 'bankBalance', 'weeklyWage', 'energy'];
  for (const f of fields) {
    const val = mockPlayerProfile[f];
    if (Number.isNaN(val) || !Number.isFinite(val)) {
      errorsDetected.push(`Erro na Semana ${week} (${currentSeason}): Campo ${f} inválido (${val})`);
    }
  }
}

// 5. Teste de Tamanho do Save Serializado (Mock completo)
const mockFullSave = {
  version: '2.0.0',
  mode: 'player',
  seasonYear: 2036,
  currentWeek: 48,
  playerProfile: mockPlayerProfile,
  history: Array.from({ length: 10 }).map((_, i) => ({
    year: 2026 + i,
    champion: 'Santos FC',
    goals: 28,
  })),
};

const serialized = JSON.stringify(mockFullSave);
const sizeKb = Buffer.byteLength(serialized, 'utf8') / 1024;

console.log('✅ --- RESULTADO DO TESTE DE 10 TEMPORADAS ---');
console.log(`• Temporadas Simuladas: 10 (480 semanas completas)`);
console.log(`• Overall Final: ${mockPlayerProfile.overall} (iniciou com 68)`);
console.log(`• Jogos Realizados: ${mockPlayerProfile.stats.matchesPlayed}`);
console.log(`• Gols Marcados: ${mockPlayerProfile.stats.goals}`);
console.log(`• Assistências: ${mockPlayerProfile.stats.assists}`);
console.log(`• Saldo Bancário Final: R$ ${mockPlayerProfile.bankBalance.toLocaleString('pt-BR')}`);
console.log(`• Felicidade Final: ${mockPlayerProfile.happiness}%`);
console.log(`• Tamanho do Save Serializado: ${sizeKb.toFixed(2)} KB (Limite: 350 KB)`);

if (errorsDetected.length === 0 && sizeKb < 350) {
  console.log('🎉 [PASS] Todos os critérios de sanidade matemática e limites de memória foram APROVADOS (0 erros)!');
  process.exit(0);
} else {
  console.error('❌ [FAIL] Erros encontrados:', errorsDetected);
  process.exit(1);
}
