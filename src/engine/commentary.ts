// ==============================================================================
// BOLA NA REDE: CARREIRA - BANCO DE NARRAÇÃO DINÂMICA (PT-BR)
// Narrações plásticas, vibrantes e contextualizadas com Cooldown Anti-Repetição
// ==============================================================================

export type CommentaryCategory = 
  | 'dribble_chapeu'
  | 'dribble_caneta'
  | 'dribble_elastico'
  | 'dribble_plastico'
  | 'dribble_fail_tackle'
  | 'dribble_fail_foul'
  | 'shot_weak'
  | 'shot_power_goal'
  | 'shot_power_saved'
  | 'shot_woodwork'
  | 'shot_off_target_high'
  | 'shot_off_target_wide'
  | 'pass_assist'
  | 'pass_intercepted'
  | 'offside'
  | 'offside_goal_disallowed'
  | 'defense_tackle_success'
  | 'defense_tackle_fail'
  | 'defense_interception'
  | 'defense_aerial_won'
  | 'defense_aerial_lost'
  | 'goalkeeper_save_easy'
  | 'goalkeeper_save_spectacular'
  | 'goalkeeper_save_penalty'
  | 'goalkeeper_rush_success'
  | 'goalkeeper_rush_fail';

export interface CommentaryPhrase {
  id?: string;
  text: string;
  tone: 'epic' | 'disappointed' | 'exciting' | 'humorous';
}

export const COMMENTARY_BANK: Record<CommentaryCategory, CommentaryPhrase[]> = {
  // 1. Dribles: Chapéu (Lençol)
  dribble_chapeu: [
    { id: 'chap_1', text: 'QUE CHAPÉU DESCONCERTANTE! {player} encobriu o marcador do {opp} e deixou ele procurando a bola!', tone: 'epic' },
    { id: 'chap_2', text: 'LENÇOL HISTÓRICO! {player} deu um chapéu de cinema e arrancou aplausos até do adversário!', tone: 'epic' },
    { id: 'chap_3', text: 'POR CIMA! Que categoria absurda de {player}, humilhou a marcação com um chapéu clássico!', tone: 'exciting' },
    { id: 'chap_4', text: 'UM MONUMENTO DE DRIBLE! {player} encobriu o zagueirão do {opp} com uma calma de veterano!', tone: 'epic' },
  ],

  // 2. Dribles: Caneta (Rolinho)
  dribble_caneta: [
    { id: 'can_1', text: 'NO MEIO DAS PERNAS! Caneta humilhante de {player} pra cima da zaga do {opp}! A torcida vai à loucura!', tone: 'epic' },
    { id: 'can_2', text: 'CANETA DESMORALIZANTE! Passou por baixo das pernas como se nada fosse! Pintura de {player}!', tone: 'exciting' },
    { id: 'can_3', text: 'OLHA A JANELA! {player} meteu a bola entre as pernas do marcador e disparou livre!', tone: 'exciting' },
    { id: 'can_4', text: 'FECHA A PORTEIRA! {player} enfiou uma caneta desconcertante e desmontou a marcação!', tone: 'humorous' },
  ],

  // 3. Dribles: Elástico
  dribble_elastico: [
    { id: 'ela_1', text: 'ELÁSTICO DE CINEMA! {player} quebrou a cintura do lateral do {opp} e abriu espaço!', tone: 'epic' },
    { id: 'ela_2', text: 'VAI PRA LÁ QUE EU VOU PRA CÁ! O elástico de {player} entortou o marcador!', tone: 'humorous' },
    { id: 'ela_3', text: 'FALOU E DISSE! {player} aplicou um elástico desconcertante e limpou o lance!', tone: 'exciting' },
    { id: 'ela_4', text: 'ROMÁRIO PURINHO! {player} puxou de letra e deu o elástico mais bonito da rodada contra o {opp}!', tone: 'epic' },
  ],

  // 4. Dribles: Drible Plástico / Pedalada
  dribble_plastico: [
    { id: 'plas_1', text: 'Drible plástico! {player} limpou a marcação do {opp} com categoria absurda!', tone: 'exciting' },
    { id: 'plas_2', text: 'PEDALADA VELOZ! {player} sambou na frente da zaga e deixou todo mundo na saudade!', tone: 'epic' },
    { id: 'plas_3', text: 'MAGIA PURA! Que frieza e habilidade de {player} para desmontar a defesa adversária!', tone: 'epic' },
    { id: 'plas_4', text: 'PISOU, ROLOU E SAIU! {player} brincou com a bola e saiu costurando a intermediária do {opp}!', tone: 'exciting' },
  ],

  // 5. Falhas de Drible: Desarme
  dribble_fail_tackle: [
    { id: 'fail_t_1', text: '{player} tentou o drible de efeito, mas o zagueiro do {opp} foi cirúrgico no desarme!', tone: 'disappointed' },
    { id: 'fail_t_2', text: 'Travou o lance! A marcação do {opp} leu a finta de {player} e roubou a bola limpa.', tone: 'disappointed' },
    { id: 'fail_t_3', text: 'Exagerou no floreio... {player} prendeu demais e o marcador recuperou a posse.', tone: 'disappointed' },
  ],

  // 6. Falhas de Drible: Falta Sofrida
  dribble_fail_foul: [
    { id: 'fail_f_1', text: 'FALTA DURA! {player} ia passando de viagem e foi atropelado na entrada da área pelo zagueiro do {opp}!', tone: 'exciting' },
    { id: 'fail_f_2', text: 'PAROU NA MARRA! O zagueiro do {opp} perdeu no drible e foi obrigado a matar a jogada! Cartão amarelo!', tone: 'exciting' },
    { id: 'fail_f_3', text: 'PENALIZOU O DRIBLE! {player} aplicou a finta e recebeu a pancada! Lance perigoso!', tone: 'exciting' },
  ],

  // 7. Chute Fraco
  shot_weak: [
    { id: 'sh_w_1', text: 'Pegou mascado na bola... chute fraco de {player}, fácil para a defesa tranquila do goleiro.', tone: 'disappointed' },
    { id: 'sh_w_2', text: 'Faltou força no pé! Finalização rasteira e fraca, o goleiro do {opp} agarra sem problemas.', tone: 'disappointed' },
    { id: 'sh_w_3', text: 'Sem veneno nenhum. {player} bateu fraco e facilitou a vida do arqueiro do {opp}.', tone: 'disappointed' },
  ],

  // 8. Chute Forte: Gol (Bomba)
  shot_power_goal: [
    { id: 'sh_g_1', text: 'SOLTOU UMA BOMBA! A bola de {player} foi um foguete no ângulo sem chance de defesa pro {opp}!', tone: 'epic' },
    { id: 'sh_g_2', text: 'QUE TIRO DO MEIO DA RUA! Uma sapatada no ângulo de {player}! Estufou o barbante com violência!', tone: 'epic' },
    { id: 'sh_g_3', text: 'PANCADA INVIOLÁVEL! {player} encheu o pé e quase rasgou as redes!', tone: 'epic' },
    { id: 'sh_g_4', text: 'GOL DE PLACA! Um torpedo teleguiado de {player} no cantinho do goleiro!', tone: 'epic' },
  ],

  // 9. Chute Forte: Defesa Espetacular
  shot_power_saved: [
    { id: 'sh_s_1', text: 'Que pancada de {player}! O goleiro do {opp} voou espetacularmente e só conseguiu espalmar pra escanteio!', tone: 'exciting' },
    { id: 'sh_s_2', text: 'MILAGRE DO GOLEIRO! {player} soltou uma bomba e o arqueiro do {opp} operou uma defesa inacreditável!', tone: 'epic' },
    { id: 'sh_s_3', text: 'BUSCOU NO ÂNGULO! {player} mandou o míssil, mas o paredão do {opp} foi buscar com as pontas dos dedos!', tone: 'exciting' },
  ],

  // 10. Chute na Trave
  shot_woodwork: [
    { id: 'sh_wd_1', text: '💥 NA TRAAAAVE! O travessão do {opp} ainda está tremendo com a violência do chute de {player}!', tone: 'exciting' },
    { id: 'sh_wd_2', text: 'NO POSTE! A bola explodiu na trave com um estrondo! Quase o gol antológico de {player}!', tone: 'exciting' },
  ],

  // 11. Chute Fora: Por Cima
  shot_off_target_high: [
    { id: 'sh_h_1', text: 'Isolou! {player} pegou muito embaixo da bola e mandou direto na arquibancada!', tone: 'disappointed' },
    { id: 'sh_h_2', text: 'Passou longe! Finalização alta demais, sem perigo para a meta do {opp}.', tone: 'disappointed' },
  ],

  // 12. Chute Fora: Cruzado / Ao Lado
  shot_off_target_wide: [
    { id: 'sh_wd_1b', text: 'Tirou tinta da trave! O chute cruzado de {player} passou lambendo o poste do {opp}!', tone: 'exciting' },
    { id: 'sh_wd_2b', text: 'Tirou demais do goleiro... a bola se perdeu pela linha de fundo.', tone: 'disappointed' },
  ],

  // 13. Passe: Assistência
  pass_assist: [
    { id: 'p_ass_1', text: 'VISÃO DE CRAQUE! {player} enfiou uma bola milimétrica rasgando a linha defensiva do {opp}!', tone: 'epic' },
    { id: 'p_ass_2', text: 'PASSE AÇUCARADO! {player} deixou o companheiro com o gol aberto para empurrar!', tone: 'epic' },
  ],

  // 14. Passe Interceptado
  pass_intercepted: [
    { id: 'p_int_1', text: 'Leitura perfeita do zagueiro do {opp}! Cortou o passe de {player} no último instante.', tone: 'disappointed' },
    { id: 'p_int_2', text: 'Passe forçado demais... a defesa do {opp} antecipou e ficou com a bola.', tone: 'disappointed' },
  ],

  // 15. Impedimento Simples
  offside: [
    { id: 'off_1', text: 'BANDEIRA ERGUIDA! Impedimento claro marcado! {player} se precipitou e estava um corpo inteiro adiantado!', tone: 'disappointed' },
    { id: 'off_2', text: 'NÃO VALE! O assistente levantou o pano! A zaga do {opp} deu o passo à frente com maestria e pegou {player} na banheira!', tone: 'exciting' },
    { id: 'off_3', text: 'IMPEDIMENTO! {player} partiu antes da hora e o juizão paralisou o lance no apito!', tone: 'disappointed' },
    { id: 'off_4', text: 'POSIÇÃO IRREGULAR! Belo passe, mas {player} estava meio metro à frente da linha defensiva do {opp}!', tone: 'disappointed' },
  ],

  // 16. Gol Anulado pelo VAR por Impedimento
  offside_goal_disallowed: [
    { id: 'off_var_1', text: '⚽❌ GOL ANULADO PELO VAR! Traçaram as linhas na cabine e pegaram {player} milimetricamente impedido contra o {opp}!', tone: 'disappointed' },
    { id: 'off_var_2', text: 'FESTA INTERROMPIDA! O estádio explodiu em festa, mas o VAR revisou e confirmou impedimento no início da jogada! Gol anulado!', tone: 'disappointed' },
    { id: 'off_var_3', text: 'NÃO VALEU NADA! A bola estufou a rede do {opp}, mas o bandeira já apontava impedimento de {player}! Gol anulado!', tone: 'disappointed' },
    { id: 'off_var_4', text: 'REVISÃO DO VAR: IMPEDIMENTO! O ombro de {player} estava à frente do penúltimo defensor! O árbitro anula o tento!', tone: 'disappointed' },
  ],

  // 17. Desarme com Sucesso (Defesa)
  defense_tackle_success: [
    { id: 'def_t_1', text: 'DESARME CIRÚRGICO! {player} roubou a bola do atacante do {opp} sem fazer falta! Limpeza total!', tone: 'epic' },
    { id: 'def_t_2', text: 'Carrinho impecável de {player}! Tirou a bola do adversário e já saiu jogando!', tone: 'exciting' },
    { id: 'def_t_3', text: 'QUE DIVIDIDA! {player} meteu o pé firme e ganhou a bola na disputa contra o atacante do {opp}!', tone: 'exciting' },
    { id: 'def_t_4', text: 'MONSTRO NA MARCAÇÃO! {player} antecipou o drible e desarmou com precisão clínica!', tone: 'epic' },
  ],

  // 18. Falha no Desarme (Defesa)
  defense_tackle_fail: [
    { id: 'def_tf_1', text: 'Errou o bote! {player} se jogou no carrinho e o atacante do {opp} passou por cima!', tone: 'disappointed' },
    { id: 'def_tf_2', text: 'Dividida perigosa! {player} não conseguiu alcançar a bola e deixou o caminho livre!', tone: 'disappointed' },
    { id: 'def_tf_3', text: 'FALTA! {player} perdeu no lance e foi obrigado a derrubar! Pode ser cartão!', tone: 'exciting' },
  ],

  // 19. Interceptação de Passe
  defense_interception: [
    { id: 'def_i_1', text: 'LEITURA PERFEITA! {player} interceptou o passe e cortou o contra-ataque perigoso do {opp}!', tone: 'epic' },
    { id: 'def_i_2', text: 'Olho clínico de {player}! Antecipou a linha de passe e recuperou a posse com categoria!', tone: 'exciting' },
    { id: 'def_i_3', text: 'INTERCEPTAÇÃO SALVADORA! {player} se esticou todo e evitou que a bola chegasse livre ao atacante!', tone: 'epic' },
  ],

  // 20. Disputa Aérea Vencida (Cabeceio Defensivo)
  defense_aerial_won: [
    { id: 'def_a_1', text: 'SUBIU MAIS ALTO! {player} venceu a disputa aérea com autoridade contra o ataque do {opp}!', tone: 'epic' },
    { id: 'def_a_2', text: 'Cabeceio defensivo perfeito! {player} testou firme e afastou o perigo para longe da área!', tone: 'exciting' },
    { id: 'def_a_3', text: 'ZAGUEIRÃO DE RESPEITO! {player} ganhou no terceiro andar e cortou o cruzamento!', tone: 'epic' },
  ],

  // 21. Disputa Aérea Perdida
  defense_aerial_lost: [
    { id: 'def_al_1', text: '{player} perdeu a disputa aérea! O atacante do {opp} subiu mais alto e cabeceou com perigo!', tone: 'disappointed' },
    { id: 'def_al_2', text: 'Saltou, mas não alcançou! {player} ficou na saudade enquanto o rival testava firme!', tone: 'disappointed' },
  ],

  // 22. Goleiro: Defesa Segura / Fácil
  goalkeeper_save_easy: [
    { id: 'gk_e_1', text: 'Defesa segura! {player} encaixou no peito sem rebote! Rotina tranquila para o goleirão!', tone: 'exciting' },
    { id: 'gk_e_2', text: 'Bola firme nas mãos! {player} segurou com firmeza e esfriou o ataque do {opp}!', tone: 'exciting' },
  ],

  // 23. Goleiro: Defesa Espetacular / Milagre
  goalkeeper_save_spectacular: [
    { id: 'gk_s_1', text: 'DEFESAÇA DE {player}! Voou no ângulo e operou um milagre inacreditável! O estádio veio abaixo!', tone: 'epic' },
    { id: 'gk_s_2', text: 'QUE REFLEXO ABSURDO! {player} espalmou com as pontas dos dedos um tiro que parecia indefensável!', tone: 'epic' },
    { id: 'gk_s_3', text: 'PAREDÃO MONUMENTAL! {player} fechou o gol com uma defesa histórica contra o {opp}!', tone: 'epic' },
  ],

  // 24. Goleiro: Pênalti Defendido
  goalkeeper_save_penalty: [
    { id: 'gk_p_1', text: 'PEGOU O PÊNALTI! {player} adivinhou o canto e voou como um felino para espalmar a cobrança!', tone: 'epic' },
    { id: 'gk_p_2', text: 'HERÓI! {player} esperou até o último milissegundo e buscou a cobrança no canto direito!', tone: 'epic' },
  ],

  // 25. Goleiro: Saída do Gol 1x1 Bem-Sucedida
  goalkeeper_rush_success: [
    { id: 'gk_r_1', text: 'SAIU COM CORAGEM! {player} abafou a finalização cara a cara com o atacante do {opp}!', tone: 'exciting' },
    { id: 'gk_r_2', text: 'Fechou o ângulo! {player} avançou no momento exato e fez o bloqueio providencial!', tone: 'epic' },
  ],

  // 26. Goleiro: Saída em Falso / Falha
  goalkeeper_rush_fail: [
    { id: 'gk_rf_1', text: 'SAIU MAL! {player} se aventurou fora da área e foi driblado com facilidade pelo rival!', tone: 'disappointed' },
    { id: 'gk_rf_2', text: 'Falha do arqueiro! {player} hesitou na saída e o atacante do {opp} tocou por cima!', tone: 'disappointed' },
  ],
};

/**
 * Retorna uma narração formatada com cooldown anti-repetição de 10 frases
 */
export function getCommentary(
  category: CommentaryCategory,
  playerName: string = 'O Craque',
  oppClubName: string = 'Adversário',
  recentPhraseIds: string[] = []
): string {
  const list = COMMENTARY_BANK[category] || COMMENTARY_BANK.dribble_plastico;
  const blockedIds = new Set(recentPhraseIds.slice(-10));

  let candidatePool = list.filter((p) => p.id && !blockedIds.has(p.id));
  if (candidatePool.length === 0) candidatePool = list;

  const item = candidatePool[Math.floor(Math.random() * candidatePool.length)];
  return item.text
    .replace(/{player}/g, playerName)
    .replace(/{opp}/g, oppClubName);
}
