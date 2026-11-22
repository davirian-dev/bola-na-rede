// ==============================================================================
// BOLA NA REDE: CARREIRA - BANCO DE NARRAÇÃO DINÂMICA (PT-BR)
// Narrações plásticas, vibrantes e contextualizadas para lances de drible, chute e gols
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
  | 'offside_goal_disallowed';

export interface CommentaryPhrase {
  text: string;
  tone: 'epic' | 'disappointed' | 'exciting' | 'humorous';
}

export const COMMENTARY_BANK: Record<CommentaryCategory, CommentaryPhrase[]> = {
  // 1. Dribles: Chapéu (Lençol)
  dribble_chapeu: [
    { text: 'QUE CHAPÉU DESCONCERTANTE! {player} encobriu o marcador e deixou ele procurando a bola!', tone: 'epic' },
    { text: 'LENÇOL HISTÓRICO! {player} deu um chapéu de cinema e arrancou aplausos até do adversário!', tone: 'epic' },
    { text: 'POR CIMA! Que categoria absurda de {player}, humilhou a marcação com um chapéu clássico!', tone: 'exciting' },
    { text: 'UM MONUMENTO DE DRIBLE! {player} encobriu o zagueirão com uma calma de veterano!', tone: 'epic' },
  ],

  // 2. Dribles: Caneta (Rolinho)
  dribble_caneta: [
    { text: 'NO MEIO DAS PERNAS! Caneta humilhante de {player} pra cima do zagueiro! A torcida vai à loucura!', tone: 'epic' },
    { text: 'CANETA DESMORALIZANTE! Passou por baixo das pernas como se nada fosse! Pintura de {player}!', tone: 'exciting' },
    { text: 'OLHA A JANELA! {player} meteu a bola entre as pernas do marcador e disparou livre!', tone: 'exciting' },
    { text: 'FECHA A PORTEIRA! {player} enfiou uma caneta desconcertante e desmontou a marcação!', tone: 'humorous' },
  ],

  // 3. Dribles: Elástico
  dribble_elastico: [
    { text: 'ELÁSTICO DE CINEMA! {player} quebrou a cintura do lateral e abriu espaço!', tone: 'epic' },
    { text: 'VAI PRA LÁ QUE EU VOU PRA CÁ! O elástico de {player} entortou o marcador!', tone: 'humorous' },
    { text: 'FALOU E DISSE! {player} aplicou um elástico desconcertante e limpou o lance!', tone: 'exciting' },
    { text: 'ROMÁRIO PURINHO! {player} puxou de letra e deu o elástico mais bonito da rodada!', tone: 'epic' },
  ],

  // 4. Dribles: Drible Plástico / Pedalada
  dribble_plastico: [
    { text: 'Drible plástico! {player} limpou a marcação com categoria absurda!', tone: 'exciting' },
    { text: 'PEDALADA VELOZ! {player} sambou na frente da zaga e deixou todo mundo na saudade!', tone: 'epic' },
    { text: 'MAGIA PURA! Que frieza e habilidade de {player} para desmontar a defesa adversária!', tone: 'epic' },
    { text: 'PISOU, ROLOU E SAIU! {player} brincou com a bola e saiu costurando a intermediária!', tone: 'exciting' },
  ],

  // 5. Falhas de Drible: Desarme
  dribble_fail_tackle: [
    { text: '{player} tentou o drible de efeito, mas o zagueiro foi cirúrgico no desarme!', tone: 'disappointed' },
    { text: 'Travou o lance! A marcação adversária leu a finta de {player} e roubou a bola limpa.', tone: 'disappointed' },
    { text: 'Exagerou no floreio... {player} prendeu demais e o marcador recuperou a posse.', tone: 'disappointed' },
  ],

  // 6. Falhas de Drible: Falta Sofrida
  dribble_fail_foul: [
    { text: 'FALTA DURA! {player} ia passando de viagem e foi atropelado na entrada da área!', tone: 'exciting' },
    { text: 'PAROU NA MARRA! O zagueiro perdeu no drible e foi obrigado a matar a jogada! Cartão amarelo!', tone: 'exciting' },
    { text: 'PENALIZOU O DRIBLE! {player} aplicou a finta e recebeu a pancada! Lance perigoso!', tone: 'exciting' },
  ],

  // 7. Chute Fraco
  shot_weak: [
    { text: 'Pegou mascado na bola... chute fraco, fácil para a defesa tranquila do goleiro.', tone: 'disappointed' },
    { text: 'Faltou força no pé! Finalização rasteira e fraca, o goleiro agarra sem problemas.', tone: 'disappointed' },
    { text: 'Sem veneno nenhum. {player} bateu fraco e facilitou a vida do arqueiro.', tone: 'disappointed' },
  ],

  // 8. Chute Forte: Gol (Bomba)
  shot_power_goal: [
    { text: 'SOLTOU UMA BOMBA! A bola foi um foguete no ângulo sem chance de defesa!', tone: 'epic' },
    { text: 'QUE TIRO DO MEIO DA RUA! Uma sapatada no ângulo! Estufou o barbante com violência!', tone: 'epic' },
    { text: 'PANCADA INVIOLÁVEL! {player} encheu o pé e quase rasgou as redes!', tone: 'epic' },
    { text: 'GOL DE PLACA! Um torpedo teleguiado de {player} no cantinho!', tone: 'epic' },
  ],

  // 9. Chute Forte: Defesa Espetacular
  shot_power_saved: [
    { text: 'Que pancada! O goleiro voou espetacularmente e só conseguiu espalmar pra escanteio!', tone: 'exciting' },
    { text: 'MILAGRE DO GOLEIRO! {player} soltou uma bomba e o arqueiro operou uma defesa inacreditável!', tone: 'epic' },
    { text: 'BUSCOU NO ÂNGULO! {player} mandou o míssil, mas o paredão foi buscar com as pontas dos dedos!', tone: 'exciting' },
  ],

  // 10. Chute na Trave
  shot_woodwork: [
    { text: '💥 NA TRAAAAVE! O travessão ainda está tremendo com a violência do chute de {player}!', tone: 'exciting' },
    { text: 'EXPLODIU NO POSTE! Que azar de {player}! A bola carimbou o poste e não entrou por milímetros!', tone: 'exciting' },
  ],

  // 11. Chute para Fora: Por Cima
  shot_off_target_high: [
    { text: 'Isolou! Chutou forte demais e mandou a bola lá na arquibancada!', tone: 'humorous' },
    { text: 'Mandou na lua! {player} pegou muito embaixo da bola e isolou por cima do travessão!', tone: 'humorous' },
    { text: 'TENTOU A GAVETA MAS ERROU O ALVO! A bola saiu zunindo por cima do gol!', tone: 'disappointed' },
  ],

  // 12. Chute para Fora: Ao Lado da Trave
  shot_off_target_wide: [
    { text: 'Passou tirando tinta da trave! Chutou pra fora por muito pouco!', tone: 'exciting' },
    { text: 'UUUUH! {player} bateu cruzado com veneno e a bola lambeu a trave direita!', tone: 'exciting' },
    { text: 'Caprichou demais no efeito e a bola fez a curva saindo pela linha de fundo!', tone: 'disappointed' },
  ],

  // 13. Assistência / Passe
  pass_assist: [
    { text: 'VISÃO DE CRAQUE! {player} enfiou uma bola milimétrica rasgando a linha defensiva!', tone: 'epic' },
    { text: 'PASSE AÇUCARADO! Deixou o companheiro com o gol aberto para empurrar!', tone: 'epic' },
  ],

  // 14. Passe Interceptado
  pass_intercepted: [
    { text: 'Leitura perfeita do zagueiro! Cortou o passe de {player} no último instante.', tone: 'disappointed' },
    { text: 'Passe forçado demais... a defesa antecipou e ficou com a bola.', tone: 'disappointed' },
  ],

  // 15. Impedimento Simples
  offside: [
    { text: 'BANDEIRA ERGUIDA! Impedimento claro marcado! {player} se precipitou e estava um corpo inteiro adiantado!', tone: 'disappointed' },
    { text: 'NÃO VALE! O assistente levantou o pano! A zaga do {opp} deu o passo à frente com maestria e pegou {player} na banheira!', tone: 'exciting' },
    { text: 'IMPEDIMENTO! {player} partiu antes da hora e o juizão paralisou o lance no apito!', tone: 'disappointed' },
    { text: 'POSIÇÃO IRREGULAR! Belo passe, mas {player} estava meio metro à frente da linha defensiva!', tone: 'disappointed' },
  ],

  // 16. Gol Anulado pelo VAR por Impedimento
  offside_goal_disallowed: [
    { text: '⚽❌ GOL ANULADO PELO VAR! Traçaram as linhas na cabine e pegaram {player} milimetricamente impedido! Segue o jogo!', tone: 'disappointed' },
    { text: 'FESTA INTERROMPIDA! O estádio explodiu em festa, mas o VAR revisou e confirmou impedimento no início da jogada! Gol anulado!', tone: 'disappointed' },
    { text: 'NÃO VALEU NADA! A bola estufou a rede, mas o bandeira já apontava impedimento de {player}! Gol anulado!', tone: 'disappointed' },
    { text: 'REVISÃO DO VAR: IMPEDIMENTO! O ombro de {player} estava à frente do penúltimo defensor! O árbitro anula o tento!', tone: 'disappointed' },
  ],
};

/**
 * Retorna uma narração formatada com o nome do jogador e do adversário.
 */
export function getCommentary(
  category: CommentaryCategory,
  playerName: string = 'O Craque',
  oppClubName: string = 'Adversário'
): string {
  const list = COMMENTARY_BANK[category] || COMMENTARY_BANK.dribble_plastico;
  const item = list[Math.floor(Math.random() * list.length)];
  return item.text
    .replace(/{player}/g, playerName)
    .replace(/{opp}/g, oppClubName);
}
