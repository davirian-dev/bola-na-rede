// ==============================================================================
// BOLA NA REDE: CARREIRA - BANCO OFICIAL DE DILEMAS E ENTREVISTAS (src/data/dilemmas.ts)
// 40+ Cenários Interativos: Coletivas de Imprensa, Vestiário, Vida Pessoal & Diretoria
// ==============================================================================

import { DilemmaEvent } from '@/types/game';

export const DILEMMAS_DATABASE: DilemmaEvent[] = [
  // ============================================================================
  // MODO JOGADOR: COLETIVAS DE IMPRENSA PÓS-JOGO (1 a 10)
  // ============================================================================
  {
    id: 'p_press_classic_win',
    title: 'Coletiva Pós-Clássico: Vitória Histórica',
    category: 'press',
    speaker: 'André Rizek (SporTV)',
    speakerRole: 'Repórter na Zona Mista',
    speakerAvatar: '🎙️',
    situation: 'Você destruiu no clássico com atuação de gala e a torcida está em êxtase. O repórter pergunta sobre a superioridade do time e se o rival virou freguês.',
    forMode: 'player',
    triggerMoment: 'post_match',
    options: [
      {
        id: 'opt_1',
        text: '"Vitória do coletivo. Clássico se ganha com suor e humildade. Segunda-feira já é foco no próximo jogo."',
        tone: 'humble',
        impactPreview: 'Técnico +15 🟢 | Elenco +12 🟢 | Torcida +8 🟢',
        consequences: {
          coachTrust: 15,
          squadChemistry: 12,
          fanApproval: 8,
          morale: 5,
        },
      },
      {
        id: 'opt_2',
        text: '"Freguês é freguês! Viemos aqui no estádio deles pra calar a boca de quem duvidou e mostrar quem manda na cidade!"',
        tone: 'cocky',
        impactPreview: 'Torcida +25 🟢 | Reputação +15 🟢 | Técnico -10 🔴',
        consequences: {
          fanApproval: 25,
          reputation: 15,
          coachTrust: -10,
          squadChemistry: -5,
          newsHeadline: 'PROVOCAÇÃO HISTÓRICA! Craque dispara: "Freguês é freguês, mostramos quem manda!"',
          newsBody: 'A entrevista incendiou os bastidores do futebol nacional e viralizou nas redes sociais com a fúria da torcida rival.',
          isBreakingNews: true,
        },
      },
      {
        id: 'opt_3',
        text: '"Eu sabia que ia decidir. Quando a bola chega no meu pé em jogo grande, o resultado não podia ser outro."',
        tone: 'cocky',
        impactPreview: 'Torcida +12 🟢 | Elenco -15 🔴 | Técnico -8 🔴',
        consequences: {
          fanApproval: 12,
          squadChemistry: -15,
          coachTrust: -8,
        },
      },
    ],
  },
  {
    id: 'p_press_goal_drought',
    title: 'Coletiva: Seca de Gols em Fase Difícil',
    category: 'press',
    speaker: 'Mauro Cezar Pereira',
    speakerRole: 'Comentarista Esportivo',
    speakerAvatar: '🎤',
    situation: 'Já são 4 partidas consecutivas sem balançar as redes. A imprensa questiona se você sente o peso da camisa e se merece continuar como titular.',
    forMode: 'player',
    triggerMoment: 'slump',
    options: [
      {
        id: 'opt_1',
        text: '"O atacante vive de fases. Estou trabalhando em dois turnos e sei que o gol vai sair naturalmente."',
        tone: 'calm',
        impactPreview: 'Técnico +12 🟢 | Elenco +10 🟢 | Torcida +5 🟢',
        consequences: {
          coachTrust: 12,
          squadChemistry: 10,
          fanApproval: 5,
          morale: 5,
        },
      },
      {
        id: 'opt_2',
        text: '"A bola não está chegando! Estou me desdobrando na marcação, mas preciso que o meio de campo crie mais chances."',
        tone: 'aggressive',
        impactPreview: 'Elenco -25 🔴 | Técnico -18 🔴 | Torcida -10 🔴',
        consequences: {
          squadChemistry: -25,
          coachTrust: -18,
          fanApproval: -10,
          isBenched: true,
          newsHeadline: 'CRISE NO VESTIÁRIO! Atacante detona meio de campo em entrevista explosiva',
          newsBody: 'Declarações geraram mal-estar profundo no elenco e o comandante decidiu barrar o atleta.',
          isBreakingNews: true,
        },
      },
      {
        id: 'opt_3',
        text: '"Quem fala demais do lado de fora não entende nada de futebol. Podem criticar, vou responder dentro de campo."',
        tone: 'cocky',
        impactPreview: 'Torcida +15 🟢 | Imprensa -15 🔴 | Técnico -5 🔴',
        consequences: {
          fanApproval: 15,
          coachTrust: -5,
          morale: 8,
        },
      },
    ],
  },
  {
    id: 'p_press_red_card',
    title: 'Zona Mista: Expulsão Infantil no Final',
    category: 'press',
    speaker: 'Ana Thaís Matos (TV Globo)',
    speakerRole: 'Repórter de Campo',
    speakerAvatar: '📺',
    situation: 'Você tomou cartão vermelho direto por reclamação acintosa no finalzinho, desfalcando a equipe para a semifinal.',
    forMode: 'player',
    triggerMoment: 'post_match',
    options: [
      {
        id: 'opt_1',
        text: '"Errei e assumo total responsabilidade. Peço perdão aos meus companheiros, ao professor e à nossa torcida."',
        tone: 'humble',
        impactPreview: 'Técnico +10 🟢 | Elenco +15 🟢 | Torcida +5 🟢',
        consequences: {
          coachTrust: 10,
          squadChemistry: 15,
          fanApproval: 5,
          morale: -5,
        },
      },
      {
        id: 'opt_2',
        text: '"A arbitragem foi uma vergonha! Fui roubado na cara dura e não me arrependo de falar a verdade na cara do juiz!"',
        tone: 'aggressive',
        impactPreview: 'Torcida +20 🟢 | Técnico -20 🔴 | Multa R$ 8.000 🔴',
        consequences: {
          fanApproval: 20,
          coachTrust: -20,
          money: -8000,
          newsHeadline: 'DENÚNCIA PESADA! Atleta detona arbitragem e será julgado pelo STJD',
          newsBody: 'Comentários causaram revolta na comissão de arbitragem e geraram multa ao clube.',
          isBreakingNews: true,
        },
      },
      {
        id: 'opt_3',
        text: '"Faz parte do calor do jogo. Prefiro não comentar sobre o árbitro para não tomar mais jogos de gancho."',
        tone: 'calm',
        impactPreview: 'Técnico +5 🟢 | Torcida +0',
        consequences: {
          coachTrust: 5,
        },
      },
    ],
  },
  {
    id: 'p_press_transfer_rumors',
    title: 'Especulação de Transferência para a Europa',
    category: 'press',
    speaker: 'Fabrizio Romano (X / Sky Sports)',
    speakerRole: 'Insider de Mercado',
    speakerAvatar: '🚨',
    situation: 'Jornais europeus noticiam que Real Madrid e Man City preparam proposta de 40 milhões de euros pelo seu passe.',
    forMode: 'player',
    triggerMoment: 'transfer_window',
    options: [
      {
        id: 'opt_1',
        text: '"Fico honrado com o interesse de gigantes, mas minha cabeça está 100% no meu clube e em levantar taças aqui."',
        tone: 'humble',
        impactPreview: 'Torcida +20 🟢 | Técnico +15 🟢 | Diretoria +10 🟢',
        consequences: {
          fanApproval: 20,
          coachTrust: 15,
          morale: 10,
        },
      },
      {
        id: 'opt_2',
        text: '"Todo jogador sonha com a Champions League. Se a proposta for boa para mim e pro clube, está na hora de dar o salto."',
        tone: 'rational',
        impactPreview: 'Torcida -15 🔴 | Reputação +15 🟢 | Família +10 🟢',
        consequences: {
          fanApproval: -15,
          reputation: 15,
          familyHappiness: 10,
        },
      },
      {
        id: 'opt_3',
        text: '"Meu empresário cuida disso. Eu só quero jogar futebol e deixar as negociações na mesa."',
        tone: 'calm',
        impactPreview: 'Neutro (Equilibrado)',
        consequences: {
          coachTrust: 5,
        },
      },
    ],
  },
  {
    id: 'p_press_penalties_controversy',
    title: 'Disputa de Batedor Oficial de Pênaltis',
    category: 'press',
    speaker: 'Fábio Sormani',
    speakerRole: 'Debatedor Esportivo',
    speakerAvatar: '📻',
    situation: 'No último jogo, você pediu para bater o pênalti mas o cobrador oficial não cedeu a bola. A imprensa pergunta se houve racha no vestiário.',
    forMode: 'player',
    triggerMoment: 'post_match',
    options: [
      {
        id: 'opt_1',
        text: '"Hierarquia é sagrada. Ele é o batedor número 1 e tem minha total confiança. O importante é a bola na rede."',
        tone: 'humble',
        impactPreview: 'Técnico +18 🟢 | Elenco +20 🟢 | Torcida +10 🟢',
        consequences: {
          coachTrust: 18,
          squadChemistry: 20,
          fanApproval: 10,
        },
      },
      {
        id: 'opt_2',
        text: '"Eu estava mais confiante e no ritmo do jogo. Da próxima vez, vou pegar a bola e bater de qualquer jeito."',
        tone: 'aggressive',
        impactPreview: 'Elenco -25 🔴 | Técnico -20 🔴 | Torcida +10 🟢',
        consequences: {
          squadChemistry: -25,
          coachTrust: -20,
          fanApproval: 10,
          newsHeadline: 'EGO NO VESTIÁRIO! Atacante desafia batedor oficial de pênaltis do time',
          newsBody: 'Declarações geraram racha entre medalhões e cobrança da diretoria.',
        },
      },
    ],
  },

  // ============================================================================
  // MODO JOGADOR: VESTIÁRIO & PRELEÇÃO (11 a 20)
  // ============================================================================
  {
    id: 'p_locker_night_out',
    title: 'Tentação Noturna na Véspera de Decisão',
    category: 'locker',
    speaker: 'Davi Cardoso (Líder da Resenha)',
    speakerRole: 'Companheiro de Elenco',
    speakerAvatar: '🎉',
    situation: 'Dois colegas influentes te convidam para uma festa VIP fechada com influencers na véspera de uma partida decisiva.',
    forMode: 'player',
    triggerMoment: 'weekly_random',
    options: [
      {
        id: 'opt_1',
        text: 'Recusar com firmeza: "Sem chance, rapaziada. Amanhã é o jogo da nossa vida. Vou jantar e dormir cedo."',
        tone: 'firm',
        impactPreview: 'Técnico +15 🟢 | Família +15 🟢 | Energia +10 🟢 | Elenco -5 🔴',
        consequences: {
          coachTrust: 15,
          familyHappiness: 15,
          energy: 10,
          squadChemistry: -5,
        },
      },
      {
        id: 'opt_2',
        text: 'Ir escondido até de madrugada: "Só uma horinha para relaxar o estresse da concentração..."',
        tone: 'cocky',
        impactPreview: 'Energia -25 🔴 | Risco de Flagrante | Elenco +10 🟢',
        consequences: {
          energy: -25,
          squadChemistry: 10,
          familyHappiness: -15,
          coachTrust: -20,
          newsHeadline: 'FLAGRADO NA BALADA! Torcida encontra jogadores em festa às 3h da manhã',
          newsBody: 'Vídeos vazaram nas redes sociais revoltando a comissão técnica.',
          isBreakingNews: true,
        },
      },
      {
        id: 'opt_3',
        text: 'Avisar o capitão para conversar com o grupo e evitar que eles se prejudiquem.',
        tone: 'rational',
        impactPreview: 'Técnico +20 🟢 | Elenco -10 🔴 | Capitania Próxima',
        consequences: {
          coachTrust: 20,
          squadChemistry: -10,
          isCaptain: true,
        },
      },
    ],
  },
  {
    id: 'p_locker_tactical_disagreement',
    title: 'Cobrança Tática do Professor no Vestiário',
    category: 'locker',
    speaker: 'Comandante Técnico',
    speakerRole: 'Treinador do Clube',
    speakerAvatar: '📋',
    situation: 'No intervalo de um jogo duro, o técnico te cobra duramente na frente do grupo por não acompanhar o lateral adversário.',
    forMode: 'player',
    triggerMoment: 'post_match',
    options: [
      {
        id: 'opt_1',
        text: 'Ouvir e acatar: "Entendido, professor! No segundo tempo vou morder e fechar o corredor até o fim."',
        tone: 'humble',
        impactPreview: 'Técnico +20 🟢 | Elenco +10 🟢 | +3 Atributos no 2º tempo',
        consequences: {
          coachTrust: 20,
          squadChemistry: 10,
          morale: 10,
          matchAttributeBonus: { pace: 3, tackling: 3 },
        },
      },
      {
        id: 'opt_2',
        text: 'Bater de frente: "Professor, se eu ficar marcando lateral, quem vai fazer o gol lá na frente?"',
        tone: 'aggressive',
        impactPreview: 'Técnico -30 🔴 (BANCO) | Elenco -15 🔴',
        consequences: {
          coachTrust: -30,
          squadChemistry: -15,
          isBenched: true,
          newsHeadline: 'BATE-BOCA NO INTERVALO! Jogador peita treinador e esquenta o clima',
          newsBody: 'O treinador perdeu a paciência e mandou o atleta para o banco de reservas.',
          isBreakingNews: true,
        },
      },
    ],
  },
  {
    id: 'p_locker_youth_advice',
    title: 'Garoto da Base Sub-20 Pede Conselho',
    category: 'locker',
    speaker: 'Kaio Silva (17 anos)',
    speakerRole: 'Promessa da Base',
    speakerAvatar: '👦',
    situation: 'Um jovem da base recém-promovido está tremendo na véspera da sua estreia no time profissional e pede sua ajuda.',
    forMode: 'player',
    triggerMoment: 'weekly_random',
    options: [
      {
        id: 'opt_1',
        text: 'Chamar para almoçar, dar conselhos práticos e garantir que vai protegê-lo dentro de campo.',
        tone: 'humble',
        impactPreview: 'Elenco +20 🟢 | Técnico +10 🟢 | Moral +10 🟢',
        consequences: {
          squadChemistry: 20,
          coachTrust: 10,
          morale: 10,
        },
      },
      {
        id: 'opt_2',
        text: '"Futebol profissional não é escolinha, garoto. Se vira aí que ninguém teve pena de mim."',
        tone: 'aggressive',
        impactPreview: 'Elenco -15 🔴 | Torcida -5 🔴',
        consequences: {
          squadChemistry: -15,
          fanApproval: -5,
        },
      },
    ],
  },

  // ============================================================================
  // MODO JOGADOR: VIDA PESSOAL, FAMÍLIA & PATROCÍNIOS (21 a 25)
  // ============================================================================
  {
    id: 'p_personal_family_drama',
    title: 'Aniversário do Filho vs Concentração Decisiva',
    category: 'personal',
    speaker: 'Mariana (Esposa)',
    speakerRole: 'Família',
    speakerAvatar: '💍',
    situation: 'O aniversário de 3 anos do seu filho coincide com a concentração para o jogo de volta da Copa. Sua família pede para você passar a noite em casa.',
    forMode: 'player',
    triggerMoment: 'weekly_random',
    options: [
      {
        id: 'opt_1',
        text: 'Ficar na concentração: "Prometo comemorar no dia seguinte com a taça de presente para ele."',
        tone: 'rational',
        impactPreview: 'Técnico +15 🟢 | Família -15 🔴 | Foco 100%',
        consequences: {
          coachTrust: 15,
          familyHappiness: -15,
          morale: 5,
        },
      },
      {
        id: 'opt_2',
        text: 'Pedir liberação especial ao técnico para comparecer por duas horas e voltar à meia-noite.',
        tone: 'calm',
        impactPreview: 'Família +20 🟢 | Técnico +0 | Energia -5 🔴',
        consequences: {
          familyHappiness: 20,
          energy: -5,
          morale: 10,
        },
      },
      {
        id: 'opt_3',
        text: 'Fugir da concentração sem autorização para comemorar em família.',
        tone: 'cocky',
        impactPreview: 'Família +25 🟢 | Técnico -35 🔴 (MULTA PESADA)',
        consequences: {
          familyHappiness: 25,
          coachTrust: -35,
          money: -15000,
          isBenched: true,
        },
      },
    ],
  },
  {
    id: 'p_lifestyle_borrow_car',
    title: 'Companheiro Pede Carro Esportivo Emprestado',
    category: 'personal',
    speaker: 'Paulinho (Companheiro de Time)',
    speakerRole: 'Atacante do Elenco',
    speakerAvatar: '🏎️',
    situation: 'Seu companheiro de time viu seu carro esportivo no estacionamento do CT e pediu a chave emprestada para ir a uma festa na véspera do jogo: "Pô irmão, quebra esse galho! É rapidinho, amanhã cedo te devolvo com tanque cheio!"',
    forMode: 'player',
    triggerMoment: 'weekly_random',
    options: [
      {
        id: 'opt_1',
        text: 'Emprestar a chave: "Pode levar, irmão! Cuida bem da máquina que amanhã tem treino."',
        tone: 'calm',
        impactPreview: 'Ele bateu o carro! 💥 Prejuízo de -R$ 80.000 🔴 | Relação Azeda no Elenco -15 🔴',
        consequences: {
          money: -80000,
          squadChemistry: -15,
          morale: -20,
          coachTrust: -10,
          newsHeadline: 'ACIDENTE NA MADRUGADA! Superesportivo do craque bate na volta de festa conduzido por companheiro!',
          newsBody: 'A colisão causou estrago milionário na lataria do veículo e gerou cobrança dura do treinador na reapresentação.',
          isBreakingNews: true,
        },
      },
      {
        id: 'opt_2',
        text: 'Negar com firmeza: "Nem pensar. Meu carro ninguém pilota, pega um táxi ou vai com o seu."',
        tone: 'rational',
        impactPreview: 'Carro 100% Protegido 🟢 | Colega chateado no Vestiário -12 🔴',
        consequences: {
          squadChemistry: -12,
          morale: -5,
        },
      },
      {
        id: 'opt_3',
        text: 'Pagar um carro executivo Black para ele: "Toma aqui R$ 300 pra você ir de motorista VIP."',
        tone: 'humble',
        impactPreview: '-R$ 300 | Elenco +15 🟢 | Técnico +5 🟢 | Solução Diplomática Perfeita',
        consequences: {
          money: -300,
          squadChemistry: 15,
          coachTrust: 5,
          morale: 10,
        },
      },
    ],
  },
  {
    id: 'p_personal_sponsor_deal',
    title: 'Proposta Milionária de Marca Concorrente',
    category: 'sponsor',
    speaker: 'Agente de Marketing',
    speakerRole: 'Empresário',
    speakerAvatar: '💼',
    situation: 'Uma multinacional oferece R$ 250.000 para você usar a chuteira deles, mas o clube tem contrato de exclusividade com a marca rival.',
    forMode: 'player',
    triggerMoment: 'weekly_random',
    options: [
      {
        id: 'opt_1',
        text: 'Recusar para respeitar os patrocinadores e as diretrizes do clube.',
        tone: 'rational',
        impactPreview: 'Diretoria +20 🟢 | Técnico +10 🟢',
        consequences: {
          coachTrust: 10,
          reputation: 10,
        },
      },
      {
        id: 'opt_2',
        text: 'Assinar o contrato e pintar a marca da chuteira para disfarçar em campo.',
        tone: 'cocky',
        impactPreview: '+R$ 250.000 🟢 | Risco de Processo e Multa',
        consequences: {
          money: 250000,
          fanApproval: 10,
          coachTrust: -15,
          newsHeadline: 'GUERRA DE MARCAS! Atleta dribla contrato do clube com chuteira personalizada',
          newsBody: 'A manobra comercial gerou atrito entre o departamento jurídico e o estafe do jogador.',
        },
      },
    ],
  },

  // ============================================================================
  // MODO TREINADOR: COLETIVAS & IMPRENSA (26 a 33)
  // ============================================================================
  {
    id: 'm_press_derby_loss',
    title: 'Coletiva Pós-Clássico: Derrota Dolorosa',
    category: 'press',
    speaker: 'PVC (UOL Esporte)',
    speakerRole: 'Jornalista Tático',
    speakerAvatar: '📊',
    situation: 'Seu time perdeu o clássico em casa por 2x0 sem finalizar no alvo no segundo tempo. A torcida pede sua cabeça na porta do vestiário.',
    forMode: 'manager',
    triggerMoment: 'post_match',
    options: [
      {
        id: 'opt_1',
        text: '"A responsabilidade é toda minha. A estratégia não funcionou e peço desculpas ao torcedor. Vamos corrigir já."',
        tone: 'humble',
        impactPreview: 'Elenco +15 🟢 | Diretoria +10 🟢 | Torcida +5 🟢',
        consequences: {
          squadMorale: 15,
          boardTrust: 10,
          fanApproval: 5,
        },
      },
      {
        id: 'opt_2',
        text: '"Faltou atitude e raça aos jogadores. Não adianta desenhar na prancheta se em campo perdem dividida de graça."',
        tone: 'aggressive',
        impactPreview: 'Elenco -30 🔴 | Diretoria -15 🔴 | Torcida +10 🟢',
        consequences: {
          squadMorale: -30,
          boardTrust: -15,
          fanApproval: 10,
          newsHeadline: 'PROFESSOR DETONA ELENCO: "Faltou atitude e raça aos jogadores"',
          newsBody: 'Vestiário rachou após o treinador expor os atletas na coletiva oficial.',
          isBreakingNews: true,
        },
      },
      {
        id: 'opt_3',
        text: '"O clássico foi condicionado pelo pênalti mandrake que o juiz marcou no primeiro tempo. Contra o sistema é difícil."',
        tone: 'cocky',
        impactPreview: 'Torcida +20 🟢 | Imprensa -20 🔴 | Multa STJD',
        consequences: {
          fanApproval: 20,
          mediaReputation: -20,
          boardTrust: -5,
        },
      },
    ],
  },
  {
    id: 'm_press_champions_qualification',
    title: 'Classificação Épica na Champions League',
    category: 'press',
    speaker: 'Gian Oddi (ESPN)',
    speakerRole: 'Apresentador',
    speakerAvatar: '🏆',
    situation: 'Você levou o time à semifinal da Champions League calando o estádio adversário na Europa.',
    forMode: 'manager',
    triggerMoment: 'post_match',
    options: [
      {
        id: 'opt_1',
        text: '"Esse grupo tem coração de aço. Mostramos a força da nossa camisa para o planeta inteiro."',
        tone: 'firm',
        impactPreview: 'Diretoria +25 🟢 | Torcida +30 🟢 | Elenco +25 🟢',
        consequences: {
          boardTrust: 25,
          fanApproval: 30,
          squadMorale: 25,
          mediaReputation: 25,
        },
      },
      {
        id: 'opt_2',
        text: '"O trabalho tático foi impecável. Neutralizamos cada virtude do time deles do primeiro ao último minuto."',
        tone: 'rational',
        impactPreview: 'Reputação Tática +30 🟢 | Diretoria +20 🟢',
        consequences: {
          mediaReputation: 30,
          boardTrust: 20,
          squadMorale: 15,
        },
      },
    ],
  },

  // ============================================================================
  // MODO TREINADOR: VESTIÁRIO, PRELEÇÃO & CRISE (34 a 40)
  // ============================================================================
  {
    id: 'm_locker_halftime_slump',
    title: 'Preleção de Intervalo: Perdendo de 2x0',
    category: 'locker',
    speaker: 'Capitão da Equipe',
    speakerRole: 'Líder do Vestiário',
    speakerAvatar: '⏱️',
    situation: 'Fim do primeiro tempo e o time está sendo dominado. O vestiário está em silêncio fúnebre com cabeças baixas.',
    forMode: 'manager',
    triggerMoment: 'post_match',
    options: [
      {
        id: 'opt_1',
        text: 'Cobrar com fogo e garra: chutar o lixo, olhar nos olhos de cada um e exigir sangue no olho.',
        tone: 'aggressive',
        impactPreview: 'Moral +20 🟢 | +4 Ritmo e Físico no 2º tempo',
        consequences: {
          squadMorale: 20,
          matchAttributeBonus: { pace: 4, physical: 4 },
        },
      },
      {
        id: 'opt_2',
        text: 'Calmaria e Ajuste Tático na Prancheta: mudar a marcação para pressionar a saída deles.',
        tone: 'rational',
        impactPreview: 'Moral +15 🟢 | +4 Passe e Posicionamento no 2º tempo',
        consequences: {
          squadMorale: 15,
          matchAttributeBonus: { passing: 4, positioning: 4 },
        },
      },
      {
        id: 'opt_3',
        text: 'Ameaçar dispensar titulares no vestiário se não virarem o jogo.',
        tone: 'cocky',
        impactPreview: 'Moral -25 🔴 | Vestiário Nervoso',
        consequences: {
          squadMorale: -25,
        },
      },
    ],
  },
  {
    id: 'm_board_ultimatum',
    title: 'Reunião de Emergência com a Diretoria',
    category: 'board',
    speaker: 'Presidente do Clube',
    speakerRole: 'Alta Cúpula',
    speakerAvatar: '👔',
    situation: 'Três jogos sem vitória derrubaram o time para o meio da tabela. O presidente convoca reunião com ultimato.',
    forMode: 'manager',
    triggerMoment: 'slump',
    options: [
      {
        id: 'opt_1',
        text: '"Confiem no projeto. Os números mostram que estamos criando e a vitória virá já na próxima rodada."',
        tone: 'rational',
        impactPreview: 'Diretoria +10 🟢 | Moral +5 🟢',
        consequences: {
          boardTrust: 10,
          squadMorale: 5,
        },
      },
      {
        id: 'opt_2',
        text: '"Se a diretoria quer título, precisa abrir o cofre e trazer o zagueiro e atacante que pedi há dois meses."',
        tone: 'aggressive',
        impactPreview: 'Torcida +15 🟢 | Diretoria -25 🔴 (RISCO DEMISSÃO)',
        consequences: {
          fanApproval: 15,
          boardTrust: -25,
          newsHeadline: 'ULTIMATO NO COMANDO! Técnico cobra reforços publicamente do presidente',
          newsBody: 'Clima ficou tenso nos bastidores com ameaça de quebra contratual.',
        },
      },
    ],
  },
  {
    id: 'm_locker_player_mutiny',
    title: 'Medalhão Insatisfeito com a Reserva',
    category: 'locker',
    speaker: 'Camisa 10 Veterano',
    speakerRole: 'Estrela do Elenco',
    speakerAvatar: '⭐',
    situation: 'O camisa 10 veterano do time te procura irritado após ser colocado no banco por duas rodadas seguidas.',
    forMode: 'manager',
    triggerMoment: 'weekly_random',
    options: [
      {
        id: 'opt_1',
        text: 'Conversar em particular: explicar que o plano é usá-lo descansado para decidir na reta final.',
        tone: 'calm',
        impactPreview: 'Elenco +15 🟢 | Jogador Recuperado',
        consequences: {
          squadMorale: 15,
          boardTrust: 10,
        },
      },
      {
        id: 'opt_2',
        text: '"Aqui joga quem treina e produz. Quem não estiver satisfeito, a porta da rua é a serventia da casa."',
        tone: 'firm',
        impactPreview: 'Autoridade +20 🟢 | Elenco -10 🔴',
        consequences: {
          boardTrust: 15,
          squadMorale: -10,
        },
      },
    ],
  },
];
