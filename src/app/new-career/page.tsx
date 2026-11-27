'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { 
  Position, 
  PlayerStyle, 
  ManagerTacticsPhilosophy, 
  TacticalFormation,
  PreferredFoot,
  PlayerSpecialty,
  PlayerAttributes,
  CareerLength,
  MatchSimSystem,
  ManagerArchetype,
  Division,
  Club
} from '@/types/game';
import { ClubBadge } from '@/components/game/ClubBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { ProModal } from '@/components/game/ProModal';
import { AvatarDisplay } from '@/components/game/AvatarDisplay';
import { AvatarCreatorModal } from '@/components/game/AvatarCreatorModal';
import { formatCurrency } from '@/lib/calculations';
import { CharacterAvatar, PlayStyleGoldId, ManagerPlayStyleGoldId, LegendArchetypeId } from '@/types/game';
import { PLAYSTYLES_GOLD } from '@/data/playStylesSeed';
import { MANAGER_PLAYSTYLES_GOLD, getManagerPlayStyleGoldById } from '@/data/managerPlayStylesSeed';
import { LEGEND_ARCHETYPES, getLegendArchetype } from '@/data/legendArchetypesSeed';
import { 
  User, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Flame,
  Award,
  Crown,
  Users,
  Shield,
  Target,
  Dumbbell,
  Compass,
  Footprints,
  Info,
  ChevronRight,
  TrendingUp,
  Globe,
  Lock,
  Shirt
} from 'lucide-react';

const COUNTRIES = [
  { name: 'Brasil', flag: '🇧🇷' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Uruguai', flag: '🇺🇾' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Colômbia', flag: '🇨🇴' },
  { name: 'Espanha', flag: '🇪🇸' },
  { name: 'França', flag: '🇫🇷' },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Itália', flag: '🇮🇹' },
  { name: 'Japão', flag: '🇯🇵' },
  { name: 'Alemanha', flag: '🇩🇪' },
  { name: 'Nigéria', flag: '🇳🇬' },
];

const SKIN_TONES = [
  { id: 1, label: 'Marfim Claro', color: '#fde5d2', border: '#e2ba99' },
  { id: 2, label: 'Clara Natural', color: '#f5cba7', border: '#d9a377' },
  { id: 3, label: 'Média / Parda', color: '#c68b59', border: '#9e673a' },
  { id: 4, label: 'Morena / Bronze', color: '#9e673a', border: '#784920' },
  { id: 5, label: 'Negra', color: '#6a3b1f', border: '#482410' },
  { id: 6, label: 'Negra Retinta', color: '#3a1e12', border: '#200e06' },
];

export default function NewCareerPage() {
  const router = useRouter();
  const clubs = useGameStore((s) => s.clubs);
  const startPlayerCareer = useGameStore((s) => s.startPlayerCareer);
  const startManagerCareer = useGameStore((s) => s.startManagerCareer);
  const syncWithSupabase = useGameStore((s) => s.syncWithSupabase);
  const isGuest = useGameStore((s) => s.isGuest);
  const planTier = useGameStore((s) => s.planTier);
  const setPlanTier = useGameStore((s) => s.setPlanTier);

  // Controle de Etapa e Modal Pro
  const [step, setStep] = useState<1 | 2>(1);
  const [playerSubStep, setPlayerSubStep] = useState<'profile' | 'playstyle_club'>('profile');
  const [chosenMode, setChosenMode] = useState<'player' | 'manager'>('player');
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatar, setAvatar] = useState<CharacterAvatar>({
    skinTone: '#c68b59',
    hairStyle: 'undercut',
    hairColor: '#18181b',
    facialHair: 'none',
    clothingStyle: 'jersey',
    jerseyNumber: 10,
  });

  // -------------------------------------------------------------
  // FORMULÁRIO DO JOGADOR
  // -------------------------------------------------------------
  const [playerName, setPlayerName] = useState('Davi Gabriel');
  const [playerNickname, setPlayerNickname] = useState('Davi');
  const [playerAge, setPlayerAge] = useState<number>(17);
  const [playerPosition, setPlayerPosition] = useState<Position>('PE');
  const [playerStyle, setPlayerStyle] = useState<PlayerStyle>('artilheiro');
  const [playerHeight, setPlayerHeight] = useState<number>(178); // cm
  const [playerWeight, setPlayerWeight] = useState<number>(73);  // kg
  const [preferredFoot, setPreferredFoot] = useState<PreferredFoot>('right');
  const [jerseyNumber, setJerseyNumber] = useState<number>(10);
  const [autoJerseyNumber, setAutoJerseyNumber] = useState(false);
  const [nationality, setNationality] = useState('Brasil');
  const [skinTone, setSkinTone] = useState<number>(3);
  const [preferredKit, setPreferredKit] = useState<'home' | 'away'>('home');
  const [selectedSpecialties, setSelectedSpecialties] = useState<PlayerSpecialty[]>([
    'finishing',
    'speed',
    'dribbling'
  ]);
  const [selectedGoldPlayStyle, setSelectedGoldPlayStyle] = useState<PlayStyleGoldId>('rapid_gold');
  const [selectedLegendArchetype, setSelectedLegendArchetype] = useState<LegendArchetypeId>('neymar_joy');
  const [careerLength, setCareerLength] = useState<CareerLength>(12);
  const [matchSimSystem, setMatchSimSystem] = useState<MatchSimSystem>('instant');

  // -------------------------------------------------------------
  // FORMULÁRIO DO TREINADOR
  // -------------------------------------------------------------
  const [managerName, setManagerName] = useState('Professor Rian');
  const [managerAge, setManagerAge] = useState<number>(38);
  const [managerArchetype, setManagerArchetype] = useState<ManagerArchetype>('strategist');
  const [managerPhilosophy, setManagerPhilosophy] = useState<ManagerTacticsPhilosophy>('attacking');
  const [managerFormation, setManagerFormation] = useState<TacticalFormation>('4-3-3');
  const [selectedManagerGoldPlayStyle, setSelectedManagerGoldPlayStyle] = useState<ManagerPlayStyleGoldId>('mastermind_gold');
  const [selectedDivisionTab, setSelectedDivisionTab] = useState<Division>('D');

  // Clubes agrupados por divisão (Brasil e Ligas Europeias Oficiais)
  const allClubsList = Object.values(clubs);
  const clubsByDivision: Record<Division, Club[]> = useMemo(() => {
    return {
      A: allClubsList.filter((c) => c.division === 'A'),
      B: allClubsList.filter((c) => c.division === 'B'),
      C: allClubsList.filter((c) => c.division === 'C'),
      D: allClubsList.filter((c) => c.division === 'D'),
      PL: allClubsList.filter((c) => c.division === 'PL'),
      CHAMPIONSHIP: allClubsList.filter((c) => c.division === 'CHAMPIONSHIP'),
      LALIGA: allClubsList.filter((c) => c.division === 'LALIGA'),
      SEGUNDA_ESP: allClubsList.filter((c) => c.division === 'SEGUNDA_ESP'),
      SERIE_A_ITA: allClubsList.filter((c) => c.division === 'SERIE_A_ITA'),
      SERIE_B_ITA: allClubsList.filter((c) => c.division === 'SERIE_B_ITA'),
      BUNDESLIGA: allClubsList.filter((c) => c.division === 'BUNDESLIGA'),
      BUNDESLIGA_2: allClubsList.filter((c) => c.division === 'BUNDESLIGA_2'),
      LIGUE_1: allClubsList.filter((c) => c.division === 'LIGUE_1'),
      LIGUE_2: allClubsList.filter((c) => c.division === 'LIGUE_2'),
      MLS: allClubsList.filter((c) => c.division === 'MLS'),
      SAUDI_PRO: allClubsList.filter((c) => c.division === 'SAUDI_PRO'),
      EUROPA: allClubsList.filter((c) => c.division === 'EUROPA'),
    };
  }, [allClubsList]);

  // Clube Selecionado
  const [selectedClubId, setSelectedClubId] = useState<string>(
    clubsByDivision.D[0]?.id || 'agu_mar'
  );

  const selectedClub = clubs?.[selectedClubId] || clubsByDivision?.D?.[0] || allClubsList?.[0];

  // Alternar Habilidade Especial (Máximo 3)
  const toggleSpecialty = (spec: PlayerSpecialty) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      if (selectedSpecialties.length < 3) {
        setSelectedSpecialties([...selectedSpecialties, spec]);
      }
    }
  };

  // Configuração dos 14 Atributos Oficiais de Jogo
  const ATTRIBUTES_CONFIG = [
    { key: 'pace', label: 'Velocidade', icon: '⚡' },
    { key: 'dribbling', label: 'Drible', icon: '🪄' },
    { key: 'finishing', label: 'Finalização', icon: '🎯' },
    { key: 'shooting', label: 'Chute', icon: '⚽' },
    { key: 'passing', label: 'Passe', icon: '👟' },
    { key: 'playmaker', label: 'Armador', icon: '🧠' },
    { key: 'attacking', label: 'Ataque', icon: '🏹' },
    { key: 'defending', label: 'Defesa', icon: '🛡️' },
    { key: 'tackling', label: 'Desarme', icon: '⚔️' },
    { key: 'heading', label: 'Cabeceio', icon: '💥' },
    { key: 'positioning', label: 'Posicionamento', icon: '📍' },
    { key: 'crossing', label: 'Cruzamento', icon: '📐' },
    { key: 'jumping', label: 'Salto', icon: '🦘' },
    { key: 'elasticity', label: 'Elasticidade', icon: '🧤', isGkHighlight: true },
  ] as const;

  // Cálculo Dinâmico em Tempo Real dos 14 Atributos Oficiais do Jogador
  const livePlayerAttributes = useMemo<PlayerAttributes>(() => {
    const ageDelta = Math.round((playerAge - 18) * 2.8);

    const attrs: PlayerAttributes = {
      pace: Math.min(92, Math.max(38, 58 + ageDelta)),
      dribbling: Math.min(92, Math.max(38, 56 + ageDelta)),
      tackling: Math.min(92, Math.max(38, 48 + ageDelta)),
      defending: Math.min(92, Math.max(38, 48 + ageDelta)),
      attacking: Math.min(92, Math.max(38, 54 + ageDelta)),
      finishing: Math.min(92, Math.max(38, 54 + ageDelta)),
      passing: Math.min(92, Math.max(38, 54 + ageDelta)),
      positioning: Math.min(92, Math.max(38, 52 + ageDelta)),
      heading: Math.min(92, Math.max(38, 50 + ageDelta)),
      crossing: Math.min(92, Math.max(38, 52 + ageDelta)),
      shooting: Math.min(92, Math.max(38, 54 + ageDelta)),
      jumping: Math.min(92, Math.max(38, 52 + ageDelta)),
      playmaker: Math.min(92, Math.max(38, 53 + ageDelta)),
      elasticity: playerPosition === 'GOL' ? Math.min(94, Math.max(45, 62 + ageDelta)) : Math.min(80, Math.max(35, 48 + ageDelta)),
    };

    // Impacto Físico (Altura & Peso)
    if (playerHeight >= 188) {
      attrs.heading += 6;
      attrs.jumping += 5;
      attrs.pace = Math.max(36, attrs.pace - 4);
      attrs.dribbling = Math.max(36, attrs.dribbling - 4);
    } else if (playerHeight <= 172) {
      attrs.pace += 5;
      attrs.dribbling += 6;
      attrs.heading = Math.max(35, attrs.heading - 4);
      attrs.jumping = Math.max(35, attrs.jumping - 4);
    }

    if (playerWeight >= 82) {
      attrs.tackling += 3;
      attrs.defending += 3;
    } else if (playerWeight <= 66) {
      attrs.pace += 3;
      attrs.dribbling += 3;
    }

    // Impacto Tático do Pé Dominante x Posição
    if (playerPosition === 'PE') {
      if (preferredFoot === 'right') {
        attrs.finishing += 6;
        attrs.shooting += 4;
        attrs.dribbling += 3;
        attrs.crossing = Math.max(35, attrs.crossing - 6);
        attrs.pace = Math.max(35, attrs.pace - 3);
      } else if (preferredFoot === 'left') {
        attrs.crossing += 6;
        attrs.pace += 4;
        attrs.passing += 3;
        attrs.finishing = Math.max(35, attrs.finishing - 6);
        attrs.shooting = Math.max(35, attrs.shooting - 5);
      } else {
        attrs.finishing += 6;
        attrs.crossing += 6;
        attrs.dribbling += 5;
        attrs.passing += 4;
      }
    } else if (playerPosition === 'PD') {
      if (preferredFoot === 'left') {
        attrs.finishing += 6;
        attrs.shooting += 4;
        attrs.dribbling += 3;
        attrs.crossing = Math.max(35, attrs.crossing - 6);
        attrs.pace = Math.max(35, attrs.pace - 3);
      } else if (preferredFoot === 'right') {
        attrs.crossing += 6;
        attrs.pace += 4;
        attrs.passing += 3;
        attrs.finishing = Math.max(35, attrs.finishing - 6);
        attrs.shooting = Math.max(35, attrs.shooting - 5);
      } else {
        attrs.finishing += 6;
        attrs.crossing += 6;
        attrs.dribbling += 5;
        attrs.passing += 4;
      }
    } else if (preferredFoot === 'both') {
      attrs.passing += 5;
      attrs.crossing += 5;
      attrs.finishing += 5;
    }

    // Boost do PlayStyle de Ouro Selecionado
    const gold = PLAYSTYLES_GOLD.find(g => g.id === selectedGoldPlayStyle);
    if (gold?.initialBoost) {
      const attrsMap = attrs as unknown as Record<string, number>;
      for (const [key, val] of Object.entries(gold.initialBoost)) {
        if (key in attrsMap && typeof val === 'number') {
          attrsMap[key] = Math.min(99, (attrsMap[key] || 50) + val);
        }
      }
    }

    return attrs;
  }, [playerAge, playerPosition, playerHeight, playerWeight, preferredFoot, selectedGoldPlayStyle]);

  // Cálculo Dinâmico do Overall Inicial Ponderado pela Posição
  const estimatedOverall = useMemo(() => {
    const a = livePlayerAttributes;
    let ovr = 60;
    if (playerPosition === 'GOL') {
      ovr = Math.round(a.elasticity * 0.45 + a.defending * 0.25 + a.jumping * 0.15 + a.passing * 0.15);
    } else if (playerPosition === 'ZAG') {
      ovr = Math.round(a.defending * 0.35 + a.tackling * 0.3 + a.heading * 0.15 + a.jumping * 0.1 + a.pace * 0.1);
    } else if (playerPosition === 'LD' || playerPosition === 'LE') {
      ovr = Math.round(a.pace * 0.25 + a.crossing * 0.25 + a.defending * 0.25 + a.passing * 0.15 + a.dribbling * 0.1);
    } else if (playerPosition === 'VOL') {
      ovr = Math.round(a.defending * 0.3 + a.tackling * 0.25 + a.passing * 0.25 + a.pace * 0.1 + a.playmaker * 0.1);
    } else if (playerPosition === 'MEI') {
      ovr = Math.round(a.playmaker * 0.3 + a.passing * 0.25 + a.dribbling * 0.2 + a.shooting * 0.15 + a.pace * 0.1);
    } else if (playerPosition === 'PE' || playerPosition === 'PD') {
      ovr = Math.round(a.pace * 0.3 + a.dribbling * 0.25 + a.finishing * 0.2 + a.crossing * 0.15 + a.shooting * 0.1);
    } else {
      ovr = Math.round(a.finishing * 0.35 + a.shooting * 0.25 + a.attacking * 0.15 + a.heading * 0.15 + a.pace * 0.1);
    }
    return Math.min(88, Math.max(54, ovr));
  }, [livePlayerAttributes, playerPosition]);

  const estimatedPotential = useMemo(() => {
    return Math.min(98, Math.max(80, 96 - (playerAge - 16) * 2));
  }, [playerAge]);

  // Diagnóstico Tático de Posição x Pé Dominante (Pontos Positivos & Negativos)
  const tacticalDiagnosis = useMemo(() => {
    if (preferredFoot === 'both') {
      return {
        title: '👑 Ambidestria Suprema (Benefício Total PRO)',
        tag: 'Pé Esquerdo & Direito 5★',
        color: 'text-amber-400',
        isAmbidextrous: true,
        pros: [
          'Domínio 100% calibrado de ambas as pernas (+5 Finalização, +5 Cruzamento, +5 Passe)',
          'Sem ângulo cego: corta para finalizar ou vai ao fundo cruzar com a mesma facilidade',
          'Imprevisível para a marcação: zagueiros nunca sabem para qual lado você vai sair'
        ],
        cons: [] // Zero pontos negativos
      };
    }

    if (playerPosition === 'PE') {
      if (preferredFoot === 'right') {
        return {
          title: '🔥 Ponta Esquerda de Pé Invertido',
          tag: 'Estilo Vini Jr / Neymar / CR7',
          color: 'text-emerald-400',
          pros: [
            'Corte seco para o meio e finalização colocada no ângulo oposto (+6 Finalização, +4 Chute)',
            'Facilidade para tabelar e triangular por dentro com os meias (+3 Drible)'
          ],
          cons: [
            'Dificuldade para descer até a linha de fundo e cruzar de primeira (-6 Cruzamento)',
            'Menor velocidade ao correr rente à linha lateral de cal (-3 Arrancada)'
          ]
        };
      } else {
        return {
          title: '⚡ Ponta Esquerda Clássico (Linha de Cal & Fundo)',
          tag: 'Estilo Ponta Raiz / Assistências',
          color: 'text-sky-400',
          pros: [
            'Arrancada imparável pela linha lateral com cruzamento aberto na cabeça dos atacantes (+6 Cruzamento, +4 Velocidade)',
            'Ganha no arranque do lateral adversário e empilha assistências (+3 Passe)'
          ],
          cons: [
            'Ângulo fechado para cortar pro meio e finalizar com a perna direita fraca (-6 Finalização, -5 Chute a gol)',
            'Dificuldade em arriscar chutes colocados de fora da área'
          ]
        };
      }
    }

    if (playerPosition === 'PD') {
      if (preferredFoot === 'left') {
        return {
          title: '🔥 Ponta Direita de Pé Invertido',
          tag: 'Estilo Messi / Salah / Robben',
          color: 'text-emerald-400',
          pros: [
            'Corte seco da direita para o meio e canhota fatal na gaveta (+6 Finalização, +4 Chute)',
            'Especialista em finalizações com curva na entrada da grande área (+3 Drible)'
          ],
          cons: [
            'Linha de fundo travada para cruzar de perna direita fraca (-6 Cruzamento)',
            'Previsível caso a zaga feche o corredor central'
          ]
        };
      } else {
        return {
          title: '⚡ Ponta Direita Clássico (Linha de Fundo & Garçom)',
          tag: 'Estilo Ponta Raiz / Cruzamentos',
          color: 'text-sky-400',
          pros: [
            'Velocidade fulminante na linha lateral e cruzamentos teleguiados de direita (+6 Cruzamento, +4 Passe)',
            'Arrancada profunda que quebra a linha de impedimento (+3 Velocidade)'
          ],
          cons: [
            'Finalização muito prejudicada ao cortar para o meio com a perna esquerda (-6 Finalização, -5 Chute a gol)',
            'Pouco volume de finalização direta'
          ]
        };
      }
    }

    if (playerPosition === 'LE') {
      if (preferredFoot === 'left') {
        return {
          title: '🛡️ Lateral Esquerdo Natural',
          tag: 'Apoio e Corredor Aberto',
          color: 'text-emerald-400',
          pros: ['Cruzamentos de primeira na linha de fundo calibrados (+5 Cruzamento, +3 Posicionamento)'],
          cons: []
        };
      } else {
        return {
          title: '🧱 Lateral Esquerdo Invertido (Pé Direito)',
          tag: 'Construtor Interior',
          color: 'text-amber-400',
          pros: ['Passe por dentro e combate defensivo reforçado (+4 Passe, +3 Defesa)'],
          cons: ['Dificuldade para cruzar bolas rápidas na linha de fundo (-6 Cruzamento)']
        };
      }
    }

    if (playerPosition === 'LD') {
      if (preferredFoot === 'right') {
        return {
          title: '🛡️ Lateral Direito Natural',
          tag: 'Apoio e Corredor Aberto',
          color: 'text-emerald-400',
          pros: ['Cruzamentos de primeira na linha de fundo calibrados (+5 Cruzamento, +3 Posicionamento)'],
          cons: []
        };
      } else {
        return {
          title: '🧱 Lateral Direito Invertido (Pé Esquerdo)',
          tag: 'Construtor Interior',
          color: 'text-amber-400',
          pros: ['Passe por dentro e combate defensivo reforçado (+4 Passe, +3 Defesa)'],
          cons: ['Dificuldade para cruzar bolas rápidas na linha de fundo (-6 Cruzamento)']
        };
      }
    }

    return {
      title: preferredFoot === 'right' ? '🦵 Atleta Destro' : '🦶 Atleta Canhoto',
      tag: 'Especialista',
      color: 'text-muted-foreground',
      pros: [preferredFoot === 'right' ? 'Pé direito dominante preciso para passes e finalizações' : 'Canhota refinada para cobranças de falta e lançamentos'],
      cons: ['Uso limitado da perna ruim em bolas rápidas']
    };
  }, [playerPosition, preferredFoot]);

  // Diagnóstico Físico Dinâmico (Altura e Peso)
  const physicalProfileDiagnosis = useMemo(() => {
    let heightDesc = 'Altura Equilibrada';
    let weightDesc = 'Porte Atlético';

    if (playerHeight >= 188) heightDesc = 'Alto / Pivô Imponente (+6 Físico, +4 Cabeceio, -3 Agilidade)';
    else if (playerHeight <= 172) heightDesc = 'Baixo / Centro de Gravidade Baixo (+5 Aceleração, +5 Drible, Maior Curva)';

    if (playerWeight >= 82) weightDesc = 'Físico Robusto (+Compostura e Proteção)';
    else if (playerWeight <= 66) weightDesc = 'Leve e Veloz (+Arrancada)';

    return `${heightDesc} · ${weightDesc}`;
  }, [playerHeight, playerWeight]);

  // Handler de Criação de Carreira
  const handleCreateCareer = async () => {
    if (chosenMode === 'player') {
      const finalNumber = autoJerseyNumber
        ? (playerPosition === 'GOL' ? 1 :
           playerPosition === 'ZAG' ? 4 :
           playerPosition === 'LD' ? 2 :
           playerPosition === 'LE' ? 6 :
           playerPosition === 'VOL' ? 5 :
           playerPosition === 'MEI' ? 10 :
           playerPosition === 'PE' ? 11 :
           playerPosition === 'PD' ? 7 :
           playerPosition === 'ATA' ? 9 : 8)
        : jerseyNumber;

      startPlayerCareer({
        name: playerName.trim() || 'Davi Gabriel',
        nickname: playerNickname.trim() || 'Davi',
        age: playerAge,
        position: playerPosition,
        style: playerStyle,
        clubId: selectedClubId,
        height: playerHeight,
        weight: playerWeight,
        preferredFoot,
        jerseyNumber: finalNumber,
        specialties: selectedSpecialties,
        careerLength,
        matchSimSystem,
        nationality,
        skinTone,
        preferredKit,
        avatar,
        goldPlayStyle: selectedGoldPlayStyle,
        legendArchetype: selectedLegendArchetype,
      });
    } else {
      startManagerCareer({
        name: managerName.trim() || 'Treinador',
        age: managerAge,
        archetype: managerArchetype,
        philosophy: managerPhilosophy,
        formation: managerFormation,
        clubId: selectedClubId,
        careerLength,
        matchSimSystem,
        goldPlayStyle: selectedManagerGoldPlayStyle,
        avatar: {
          ...avatar,
          clothingStyle: 'suit',
        },
      });
    }

    try {
      if (!isGuest) {
        await syncWithSupabase();
      }
    } catch (err) {
      console.warn('Sincronização com nuvem em background:', err);
    }

    router.push('/dashboard');
  };

  // Posições
  const positionsList: { id: Position; label: string }[] = [
    { id: 'GOL', label: 'Goleiro (GOL)' },
    { id: 'ZAG', label: 'Zagueiro Central (ZAG)' },
    { id: 'LE', label: 'Lateral Esquerdo (LE)' },
    { id: 'LD', label: 'Lateral Direito (LD)' },
    { id: 'VOL', label: 'Volante Marcador (VOL)' },
    { id: 'MC', label: 'Meia Central (MC)' },
    { id: 'MEI', label: 'Meia Armador / Camisa 10 (MEI)' },
    { id: 'PE', label: 'Ponta Esquerda (PE)' },
    { id: 'PD', label: 'Ponta Direita (PD)' },
    { id: 'ATA', label: 'Centroavante Matador (ATA)' },
  ];

  // Habilidades de Ouro
  const availableSpecialties: { id: PlayerSpecialty; label: string; icon: string; desc: string }[] = [
    { id: 'speed', label: 'Velocidade', icon: '⚡', desc: '+Explosão e corridas nas costas da zaga' },
    { id: 'dribbling', label: 'Drible', icon: '⚽', desc: '+Controle de bola e fintas em espaço curto' },
    { id: 'tackling', label: 'Desarme', icon: '🛡️', desc: '+Botes precisos e recuperação limpa' },
    { id: 'defending', label: 'Defesa', icon: '🧱', desc: '+Leitura de linha e bloqueio de chutes' },
    { id: 'attacking', label: 'Ataque', icon: '⚔️', desc: '+Presença de área e oportunismo' },
    { id: 'finishing', label: 'Finalização', icon: '🎯', desc: '+Pontaria nos chutes a gol e frieza' },
    { id: 'passing', label: 'Passe', icon: '👟', desc: '+Precisão em passes curtos e triangulações' },
    { id: 'positioning', label: 'Posicionamento', icon: '📍', desc: '+Aparece sempre no lugar certo' },
    { id: 'heading', label: 'Cabeceio', icon: '👤', desc: '+Gols de cabeça em bolas paradas' },
    { id: 'crossing', label: 'Cruzamento', icon: '↗️', desc: '+Bolas açucaradas na área para os atacantes' },
    { id: 'jumping', label: 'Salto', icon: '🦘', desc: '+Impulsão e domínio das jogadas aéreas' },
    { id: 'playmaker', label: 'Armador', icon: '🪄', desc: '+Visão de jogo privilegiada e assistências' },
  ];

  // 5 Arquétipos de Treinador
  const managerArchetypesList: {
    id: ManagerArchetype;
    title: string;
    icon: string;
    tagline: string;
    focus: string;
    perks: { label: string; positive: boolean }[];
  }[] = [
    {
      id: 'strategist',
      title: 'Estrategista',
      icon: '♟️',
      tagline: 'Time mais entrosado e instruções individuais mais eficientes.',
      focus: 'Partidas e Tática',
      perks: [
        { label: 'Ganho de entrosamento por jogo +50%', positive: true },
        { label: 'XP do treino tático +25%', positive: true },
        { label: 'Instruções individuais +25% mais fortes', positive: true },
        { label: 'Equipe técnica +1 nível (custos)', positive: false },
      ],
    },
    {
      id: 'motivator',
      title: 'Motivador',
      icon: '🔥',
      tagline: 'Elenco com moral alto, capitão mais forte e poder de reação.',
      focus: 'Moral e Pressão',
      perks: [
        { label: 'Moral após vitória +25%', positive: true },
        { label: 'Moral perdido na derrota -30%', positive: true },
        { label: 'Efeito do capitão +25%', positive: true },
        { label: '2º tempo perdendo +1,5% de ataque', positive: true },
      ],
    },
    {
      id: 'talent_developer',
      title: 'Formador de Talentos',
      icon: '👥',
      tagline: 'Evolução acelerada dos atletas e base mais rica.',
      focus: 'Evolução e Base',
      perks: [
        { label: 'XP do treino individual +30%', positive: true },
        { label: 'XP do treino coletivo (até 23 anos) +20%', positive: true },
        { label: 'Vagas na base +1', positive: true },
        { label: 'Evolução anual até 21 anos +1 ponto possível', positive: true },
      ],
    },
    {
      id: 'pragmatic',
      title: 'Pragmático',
      icon: '🧱',
      tagline: 'Defesa sólida e diretoria mais paciente com os resultados.',
      focus: 'Defesa e Estabilidade',
      perks: [
        { label: 'Defesa do time +1,5%', positive: true },
        { label: 'Queda de confiança da diretoria -15%', positive: true },
        { label: 'Pedir mais tempo à diretoria +10 p.p. de chance', positive: true },
      ],
    },
    {
      id: 'financial_manager',
      title: 'Gestor Financeiro',
      icon: '💼',
      tagline: 'Foco nos negócios do clube: tudo que entra no caixa rende mais.',
      focus: 'Finanças e Bilheteria',
      perks: [
        { label: 'Receita total +5%', positive: true },
        { label: 'Bônus para bilheteria, TV, patrocínio e vendas', positive: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================================ */}
        {/* ETAPA 1: ESCOLHA DE MODO DE CARREIRA */}
        {/* ============================================================ */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-500">
                Início de Jornada
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
                Escolha o seu Modo de Carreira
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Você prefere criar um atleta do zero rumo à Europa ou comandar a prancheta tática à beira do gramado?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Card Modo Jogador */}
              <div
                onClick={() => {
                  setChosenMode('player');
                  setStep(2);
                }}
                className="group relative p-6 sm:p-8 rounded-3xl bg-card border-2 border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🧤
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                      Futebol Real & New Star Soccer
                    </span>
                    <h3 className="font-display text-2xl font-black text-foreground mt-0.5">
                      Modo Jogador
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Crie seu atleta customizado com altura, peso, pé dominante, PlayStyles de ouro e comece na base Sub-20 ou direto na Série A/B/C/D.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-black text-emerald-500">
                  <span>Jogar como Atleta</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card Modo Treinador */}
              <div
                onClick={() => {
                  setChosenMode('manager');
                  setStep(2);
                }}
                className="group relative p-6 sm:p-8 rounded-3xl bg-card border-2 border-border hover:border-emerald-500 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary text-foreground flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    👔
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                      Estilo Brasfoot & Football Manager
                    </span>
                    <h3 className="font-display text-2xl font-black text-foreground mt-0.5">
                      Modo Treinador
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Escolha seu arquétipo de técnico (Estrategista, Motivador, Formador de Talentos, Pragmático ou Gestor), escale o time e conquiste títulos.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-black text-foreground group-hover:text-emerald-500 transition-colors">
                  <span>Entrar como Treinador</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ETAPA 2: CONFIGURAÇÃO DO PERSONAGEM E CLUBE */}
        {/* ============================================================ */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para escolha de modo
            </button>

            {/* SE MODO JOGADOR */}
            {chosenMode === 'player' ? (
              <div className="space-y-6">
                {/* Seletor Visual das 2 Sub-Etapas */}
                <div className="flex items-center gap-2 p-1.5 bg-secondary/80 rounded-2xl border border-border/80 w-full max-w-xl mx-auto shadow-sm">
                  <button
                    type="button"
                    onClick={() => setPlayerSubStep('profile')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      playerSubStep === 'profile'
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>1. Ficha & Estilo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerSubStep('playstyle_club')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      playerSubStep === 'playstyle_club'
                        ? 'bg-amber-500 text-zinc-950 shadow-sm font-black'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>2. PlayStyle & Clube</span>
                  </button>
                </div>

                {playerSubStep === 'profile' ? (
                  /* ========================================================== */
                  /* SUB-ETAPA 1: FICHA DE IDENTIDADE & ESTILO DE JOGO          */
                  /* ========================================================== */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Coluna Esquerda: Formulário do Atleta */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Card 1: Identidade, Origem e Tom de Pele */}
                      <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
                    <h3 className="font-display text-xl font-black text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      Ficha de Identidade & Visual
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Ex: Davi Gabriel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                          Apelido na Camisa
                        </label>
                        <input
                          type="text"
                          value={playerNickname}
                          onChange={(e) => setPlayerNickname(e.target.value)}
                          placeholder="Ex: Davi"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      {/* País de Origem com Bandeiras */}
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                          País de Origem
                        </label>
                        <select
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          style={{ colorScheme: 'dark' }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-zinc-900 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 [&>option]:bg-zinc-900 [&>option]:text-white cursor-pointer"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.name} value={c.name} className="bg-zinc-900 text-white py-1">
                              {c.flag} {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Prévia e Personalização do Avatar SVG */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border">
                      <div 
                        className="relative group cursor-pointer shrink-0" 
                        onClick={() => setIsAvatarModalOpen(true)}
                        title="Clique para editar visual do avatar"
                      >
                        <AvatarDisplay 
                          avatar={avatar} 
                          size="md" 
                          className="ring-2 ring-emerald-500/50 hover:ring-emerald-400 transition-all rounded-full shadow-md" 
                        />
                        <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-zinc-950 p-1 rounded-full shadow text-[10px]">
                          ✏️
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm font-black text-foreground">
                          Aparência Visual do Personagem
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Personalize corte de cabelo, cor, barba e estilo de uniforme.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsAvatarModalOpen(true)}
                          className="mt-2 py-1 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs hover:bg-emerald-500/25 transition-colors cursor-pointer"
                        >
                          Personalizar Cabelo & Rosto →
                        </button>
                      </div>
                    </div>

                    {/* Tom de Pele do Atleta */}
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">
                        Tom de Pele do Boneco (Avatar & Minigames)
                      </label>
                      <div className="flex items-center gap-3">
                        {SKIN_TONES.map((tone) => (
                          <button
                            key={tone.id}
                            type="button"
                            onClick={() => {
                              setSkinTone(tone.id);
                              setAvatar(prev => ({ ...prev, skinTone: tone.color }));
                            }}
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                              skinTone === tone.id ? 'ring-2 ring-emerald-500 scale-110 shadow-md' : 'opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: tone.color, border: `2px solid ${tone.border}` }}
                            title={tone.label}
                          >
                            {skinTone === tone.id && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-950 font-black drop-shadow" />
                            )}
                          </button>
                        ))}
                        <span className="text-xs font-semibold text-muted-foreground ml-2">
                          {SKIN_TONES.find((t) => t.id === skinTone)?.label}
                        </span>
                      </div>
                    </div>

                    {/* Idade Inicial Calibrando o Overall */}
                    <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground uppercase flex items-center gap-1.5">
                          <span>Idade de Início:</span>
                          <span className="text-emerald-500 font-black">{playerAge} anos</span>
                        </label>
                        <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          OVR Inicial: ~{estimatedOverall} · Potencial: {estimatedPotential} ⭐
                        </span>
                      </div>

                      <input
                        type="range"
                        min={16}
                        max={24}
                        value={playerAge}
                        onChange={(e) => setPlayerAge(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />

                      <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                        <span>16a (Menor Over, Máximo Potencial)</span>
                        <span>20a (Equilibrado)</span>
                        <span>24a (Over Alto Imediato)</span>
                      </div>
                    </div>

                    {/* Posição em Campo */}
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                        Posição em Campo
                      </label>
                      <select
                        value={playerPosition}
                        onChange={(e) => setPlayerPosition(e.target.value as Position)}
                        style={{ colorScheme: 'dark' }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-zinc-900 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 [&>option]:bg-zinc-900 [&>option]:text-white cursor-pointer"
                      >
                        {positionsList.map((p) => (
                          <option key={p.id} value={p.id} className="bg-zinc-900 text-white py-1">
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Físico: Altura e Peso */}
                    <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-foreground flex items-center gap-1.5">
                          <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
                          Perfil Físico
                        </span>
                        <span className="text-[11px] text-emerald-500 font-bold">
                          {playerHeight} cm · {playerWeight} kg
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] text-muted-foreground mb-1 font-bold">
                            Altura: {playerHeight} cm
                          </label>
                          <input
                            type="range"
                            min={160}
                            max={205}
                            value={playerHeight}
                            onChange={(e) => setPlayerHeight(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-muted-foreground mb-1 font-bold">
                            Peso: {playerWeight} kg
                          </label>
                          <input
                            type="range"
                            min={55}
                            max={105}
                            value={playerWeight}
                            onChange={(e) => setPlayerWeight(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="text-[11px] text-muted-foreground bg-card p-2 rounded-xl border border-border/80 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{physicalProfileDiagnosis}</span>
                      </div>
                    </div>

                    {/* Pé Dominante com Diagnóstico Tático e Regra Ambidestro PRO */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-muted-foreground uppercase">
                          Pé Dominante
                        </label>
                        {planTier !== 'pro' && (
                          <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                            <Crown className="w-3 h-3" /> Ambidestro exclusivo no Passe PRO
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'right', label: '🦵 Destro', isProOnly: false },
                          { id: 'left', label: '🦶 Canhoto', isProOnly: false },
                          { id: 'both', label: '⚡ Ambidestro (5★)', isProOnly: true },
                        ].map((foot) => {
                          const isSelected = preferredFoot === foot.id;
                          const isLocked = foot.isProOnly && planTier !== 'pro';

                          return (
                            <button
                              key={foot.id}
                              type="button"
                              onClick={() => {
                                if (isLocked) {
                                  setIsProModalOpen(true);
                                  return;
                                }
                                setPreferredFoot(foot.id as PreferredFoot);
                              }}
                              className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer relative flex flex-col items-center justify-center gap-0.5 ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-sm'
                                  : isLocked
                                  ? 'border-amber-500/30 bg-amber-500/5 text-muted-foreground hover:border-amber-500/60'
                                  : 'border-border bg-secondary text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <span>{foot.label}</span>
                                {isLocked && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                              </div>
                              {foot.isProOnly && (
                                <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/20 px-1.5 rounded">
                                  Exclusivo PRO
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Box de Diagnóstico Tático da Ponta x Pé (Pontos Positivos & Negativos) */}
                      <div className="p-3.5 rounded-2xl bg-card border border-border text-xs space-y-2.5 shadow-sm">
                        <div className="flex items-center justify-between border-b border-border/80 pb-2">
                          <span className={`font-black ${tacticalDiagnosis.color} flex items-center gap-1.5`}>
                            {tacticalDiagnosis.title}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                            {tacticalDiagnosis.tag}
                          </span>
                        </div>

                        {/* Pontos Positivos */}
                        {tacticalDiagnosis.pros && tacticalDiagnosis.pros.length > 0 && (
                          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {tacticalDiagnosis.isAmbidextrous ? 'Benefício Total PRO (Zero Pontos Negativos)' : 'Pontos Positivos (+)'}
                            </span>
                            <ul className="space-y-0.5">
                              {tacticalDiagnosis.pros.map((pro, idx) => (
                                <li key={idx} className="text-[11px] text-emerald-300 font-medium leading-snug">
                                  • {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Pontos Negativos */}
                        {tacticalDiagnosis.cons && tacticalDiagnosis.cons.length > 0 && (
                          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              Pontos Negativos da Combinação (-)
                            </span>
                            <ul className="space-y-0.5">
                              {tacticalDiagnosis.cons.map((con, idx) => (
                                <li key={idx} className="text-[11px] text-rose-300 font-medium leading-snug">
                                  • {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Uniforme e Número da Camisa */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                          Uniforme Preferido
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreferredKit('home')}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              preferredKit === 'home'
                                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                                : 'border-border bg-secondary text-muted-foreground'
                            }`}
                          >
                            <span>👕 Titular</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreferredKit('away')}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              preferredKit === 'away'
                                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                                : 'border-border bg-secondary text-muted-foreground'
                            }`}
                          >
                            <span>🎽 Reserva</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                          Camisa #
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={jerseyNumber}
                          onChange={(e) => setJerseyNumber(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botão de Avançar para Sub-Etapa 2 */}
                  <button
                    type="button"
                    onClick={() => {
                      setPlayerSubStep('playstyle_club');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Avançar para PlayStyle & Clube</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Coluna Direita: Card FUT do Atleta com 14 Atributos */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Card do Atleta Estilo FUT / NSS */}
                  <div className="p-6 rounded-3xl bg-gradient-to-b from-card to-secondary border border-border shadow-xl text-center relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <span className="text-2xl font-black font-display text-emerald-500">
                        {estimatedOverall}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block -mt-1">
                        OVR
                      </span>
                    </div>

                    {/* Avatar Oficial do Jogador com Envelhecimento e Personalização */}
                    <div className="mx-auto flex justify-center mb-3 relative">
                      <AvatarDisplay
                        avatar={avatar}
                        size="xl"
                        clubPrimaryColor={selectedClub?.primaryColor}
                        clubSecondaryColor={selectedClub?.secondaryColor}
                        className="ring-2 ring-emerald-500/50 shadow-lg"
                      />
                      <span className="absolute bottom-0 right-1/2 translate-x-10 text-sm bg-card p-0.5 rounded-full border border-border shadow">
                        {COUNTRIES.find((c) => c.name === nationality)?.flag || '🇧🇷'}
                      </span>
                    </div>

                    <h4 className="font-display text-2xl font-black text-foreground">
                      {playerNickname || playerName}
                    </h4>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-500">
                      {playerPosition} · Camisa #{jerseyNumber} · {nationality}
                    </span>

                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center text-xs font-bold">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Altura</span>
                        <span>{playerHeight} cm</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Pé</span>
                        <span>{preferredFoot === 'right' ? 'Destro' : preferredFoot === 'left' ? 'Canhoto' : 'Ambidestro'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Idade</span>
                        <span>{playerAge} anos</span>
                      </div>
                    </div>

                    {/* Painel Completo dos 14 Atributos de Jogo em Tempo Real */}
                    <div className="mt-5 pt-4 border-t border-border text-left space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          Atributos Iniciais (14 Oficiais)
                        </span>
                        <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Potencial: {estimatedPotential} ⭐
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {ATTRIBUTES_CONFIG.map((attr) => {
                          const attrsMap = livePlayerAttributes as unknown as Record<string, number | undefined>;
                          const val = attrsMap[attr.key] || 50;
                          const isGkAttr = attr.key === 'elasticity';
                          const goldBoostMap = PLAYSTYLES_GOLD.find(g => g.id === selectedGoldPlayStyle)?.initialBoost as Record<string, number | undefined> | undefined;
                          const goldBoost = goldBoostMap?.[attr.key];

                          return (
                            <div
                              key={attr.key}
                              className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                isGkAttr && playerPosition === 'GOL'
                                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm'
                                  : goldBoost
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                  : 'bg-secondary/40 border-border/70 text-foreground'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-xs shrink-0">{attr.icon}</span>
                                <span className="text-[11px] font-bold truncate">
                                  {attr.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {goldBoost && (
                                  <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-1 py-0.2 rounded">
                                    +{goldBoost}
                                  </span>
                                )}
                                <span className={`font-mono font-black text-xs ${
                                  val >= 75 ? 'text-emerald-400' : val >= 65 ? 'text-amber-400' : 'text-zinc-300'
                                }`}>
                                  {val}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================================================== */
              /* SUB-ETAPA 2: HABILIDADES DE OURO & CLUBE DE INÍCIO        */
              /* ========================================================== */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Coluna Esquerda: 5 Habilidades de Ouro (PlayStyles) */}
                <div className="lg:col-span-7 space-y-6">
                  <button
                    type="button"
                    onClick={() => {
                      setPlayerSubStep('profile');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-xl bg-secondary border border-border"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Voltar para Ficha de Identidade
                  </button>

                  {/* Card 2: 5 Habilidades de Ouro (PlayStyles) */}
                  <div className="p-6 rounded-3xl bg-card border-2 border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            ★ 5 Estilos Lendários
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-black text-foreground mt-0.5">
                          Habilidades de Ouro (PlayStyles)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Cada PlayStyle possui seu valor financeiro e você já começa o jogo com esses atributos aumentados.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PLAYSTYLES_GOLD.map((style, idx) => {
                        const isSelected = selectedGoldPlayStyle === style.id;
                        const isLast = idx === PLAYSTYLES_GOLD.length - 1 && PLAYSTYLES_GOLD.length % 2 !== 0;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setSelectedGoldPlayStyle(style.id)}
                            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                              isLast ? 'sm:col-span-2' : ''
                            } ${
                              isSelected
                                ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/10'
                                : 'border-border bg-secondary/40 hover:bg-secondary'
                            }`}
                          >
                            {/* Topo do Card: Ícone, Título, Tagline e Valor */}
                            <div className="flex items-start justify-between gap-2 w-full">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-xl p-2 rounded-xl bg-card border border-border shrink-0 shadow-sm">
                                  {style.icon}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-display text-xs sm:text-sm font-black text-foreground truncate">
                                      {style.name}
                                    </h4>
                                    {isSelected && (
                                      <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500 text-zinc-950 px-1.5 py-0.2 rounded-full">
                                        Ativo
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] font-semibold text-amber-400/90 block mt-0.5 truncate">
                                    {style.tagline}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                                {formatCurrency(style.value)}
                              </span>
                            </div>

                            {/* Meio: Descrição */}
                            <p className="text-[11px] text-muted-foreground line-clamp-2">
                              {style.description}
                            </p>

                            {/* Rodapé Fluido: Badges dos Atributos Aumentados */}
                            <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-1.5 w-full">
                              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded shrink-0">
                                ⚡ Inicia:
                              </span>
                              <div className="flex items-center gap-1 flex-wrap min-w-0">
                                {Object.entries(style.initialBoost).map(([k, val]) => (
                                  <span
                                    key={k}
                                    className="text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded shadow-sm"
                                  >
                                    +{val} {k === 'pace' ? 'Vel' :
                                           k === 'dribbling' ? 'Dri' :
                                           k === 'finishing' ? 'Fin' :
                                           k === 'shooting' ? 'Chu' :
                                           k === 'passing' ? 'Pas' :
                                           k === 'playmaker' ? 'Arm' :
                                           k === 'tackling' ? 'Des' :
                                           k === 'defending' ? 'Def' :
                                           k === 'crossing' ? 'Cru' :
                                           k === 'heading' ? 'Cab' :
                                           k === 'jumping' ? 'Sal' :
                                           k === 'elasticity' ? 'Ela' : k}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* SELEÇÃO DO ARQUÉTIPO LENDÁRIO (MESSI, CR7, NEYMAR, IBRA, VINI JR) */}
                    <div className="mt-6 pt-5 border-t border-border/80">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center font-black shadow-md">
                          ⭐
                        </div>
                        <div>
                          <h3 className="font-display text-base font-black text-foreground">
                            Personalidade de Craque Lendário
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Defina o temperamento do seu atleta, inspirado nos maiores craques mundiais.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {LEGEND_ARCHETYPES.map((arch) => {
                          const isSelected = selectedLegendArchetype === arch.id;
                          return (
                            <button
                              key={arch.id}
                              type="button"
                              onClick={() => setSelectedLegendArchetype(arch.id)}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                isSelected
                                  ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                                  : 'bg-secondary/40 border-border hover:bg-secondary'
                              }`}
                            >
                              <span className="text-2xl p-1.5 rounded-xl bg-card border border-border shrink-0">
                                {arch.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-xs sm:text-sm font-black text-foreground">
                                      {arch.name}
                                    </h4>
                                    <span className="text-[10px] text-amber-400 font-extrabold">
                                      • {arch.inspiration}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500 text-zinc-950 px-1.5 py-0.2 rounded-full">
                                      Selecionado
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                  {arch.description}
                                </p>
                                <span className="text-[10px] italic text-zinc-400 mt-1 block">
                                  {arch.quote}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Seleção do Clube com Abas das 15 Divisões e Iniciar */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Mini Resumo do Atleta com PlayStyle */}
                  <div className="p-4 rounded-2xl bg-secondary/60 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AvatarDisplay
                        avatar={avatar}
                        size="md"
                        clubPrimaryColor={selectedClub?.primaryColor}
                        clubSecondaryColor={selectedClub?.secondaryColor}
                      />
                      <div>
                        <h4 className="text-sm font-black text-foreground">{playerNickname || playerName}</h4>
                        <span className="text-xs text-emerald-400 font-bold">
                          OVR: {estimatedOverall} · {PLAYSTYLES_GOLD.find(g => g.id === selectedGoldPlayStyle)?.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-1 rounded-xl border border-amber-500/20">
                      ⭐ Ouro Ativo
                    </span>
                  </div>

                  {/* Seleção do Clube com Abas Oficiais das 15 Divisões */}
                  <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-xl font-black text-foreground">
                          Escolha o Clube de Início
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {planTier === 'pro' 
                            ? '👑 Vantagem PRO: Comece em qualquer gigante do Brasil ou da Europa!' 
                            : 'Início na Série D. Séries A, B, C e Europa exclusivas para PRO.'}
                        </p>
                      </div>

                      {planTier === 'free' ? (
                        <button
                          type="button"
                          onClick={() => setIsProModalOpen(true)}
                          className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 hover:bg-amber-500/25 transition-colors cursor-pointer"
                        >
                          <Crown className="w-3 h-3" />
                          Seja PRO
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-[10px] uppercase tracking-wider">
                          👑 PRO Ativo
                        </span>
                      )}
                    </div>

                    {/* Abas das Divisões (Brasil e Europa) */}
                    <div className="flex items-center gap-1 p-1 bg-secondary rounded-2xl text-[11px] sm:text-xs font-bold overflow-x-auto no-scrollbar">
                      {([
                        { id: 'D', label: 'Série D (Grátis)' },
                        { id: 'C', label: 'Série C' },
                        { id: 'B', label: 'Série B' },
                        { id: 'A', label: 'Série A' },
                        { id: 'PL', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier' },
                        { id: 'CHAMPIONSHIP', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Ch\'ship' },
                        { id: 'LALIGA', label: '🇪🇸 La Liga' },
                        { id: 'SEGUNDA_ESP', label: '🇪🇸 La Liga 2' },
                        { id: 'SERIE_A_ITA', label: '🇮🇹 Serie A' },
                        { id: 'SERIE_B_ITA', label: '🇮🇹 Serie B' },
                        { id: 'BUNDESLIGA', label: '🇩🇪 Bundesliga' },
                        { id: 'BUNDESLIGA_2', label: '🇩🇪 2. Bundes' },
                        { id: 'LIGUE_1', label: '🇫🇷 Ligue 1' },
                        { id: 'LIGUE_2', label: '🇫🇷 Ligue 2' },
                        { id: 'MLS', label: '🇺🇸 MLS (Messi)' },
                        { id: 'SAUDI_PRO', label: '🇸🇦 Saudita (CR7)' },
                        { id: 'EUROPA', label: '👑 Champions' },
                      ] as { id: Division; label: string }[]).map((tab) => {
                        const div = tab.id;
                        const isLocked = planTier === 'free' && div !== 'D';
                        const isSelected = selectedDivisionTab === div;

                        return (
                          <button
                            key={div}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                setIsProModalOpen(true);
                              } else {
                                setSelectedDivisionTab(div);
                                const firstClub = clubsByDivision[div]?.[0];
                                if (firstClub) setSelectedClubId(firstClub.id);
                              }
                            }}
                            className={`py-2 px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                              isSelected
                                ? ['EUROPA', 'PL', 'LALIGA', 'MLS', 'SAUDI_PRO'].includes(div)
                                  ? 'bg-amber-400 text-zinc-950 font-black shadow-sm'
                                  : 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                                : isLocked
                                ? 'text-muted-foreground opacity-60 hover:opacity-100'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <span>{tab.label}</span>
                            {isLocked && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Clube Selecionado em Destaque */}
                    <div className="p-4 rounded-2xl bg-secondary border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClubBadge
                          primaryColor={preferredKit === 'home' ? selectedClub.primaryColor : selectedClub.secondaryColor}
                          secondaryColor={preferredKit === 'home' ? selectedClub.secondaryColor : selectedClub.primaryColor}
                          shortName={selectedClub.shortName}
                          size="md"
                        />
                        <div>
                          <h4 className="text-sm font-black text-foreground">{selectedClub.name}</h4>
                          <span className="text-xs text-muted-foreground block">
                            Estádio {selectedClub.stadiumName}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-black text-emerald-500">
                        {selectedClub.countryFlag ? `${selectedClub.countryFlag} ` : ''}{selectedClub.division}
                      </span>
                    </div>

                    {/* Lista dos Clubes da Divisão Ativa */}
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {clubsByDivision[selectedDivisionTab]?.map((club) => (
                        <button
                          key={club.id}
                          type="button"
                          onClick={() => setSelectedClubId(club.id)}
                          className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            selectedClubId === club.id
                              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold'
                              : 'border-border bg-secondary/50 text-foreground hover:bg-secondary'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ClubBadge
                              primaryColor={club.primaryColor}
                              secondaryColor={club.secondaryColor}
                              shortName={club.shortName}
                              size="sm"
                            />
                            <span className="text-xs font-bold">{club.name}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            Rep: {club.reputation}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Botão Oficial de Iniciar Carreira */}
                    <button
                      type="button"
                      onClick={handleCreateCareer}
                      className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer mt-4"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      Iniciar Carreira Oficial
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
              /* SE MODO TREINADOR */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-6">
                  <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
                    <h3 className="font-display text-xl font-black text-foreground flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-500" />
                      Ficha do Comandante Técnico
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">
                        Nome do Treinador
                      </label>
                      <input
                        type="text"
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        placeholder="Ex: Professor Rian"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-muted-foreground uppercase">
                            Idade do Treinador
                          </label>
                          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            {managerAge} anos
                          </span>
                        </div>
                        <input
                          type="range"
                          min={30}
                          max={80}
                          value={managerAge}
                          onChange={(e) => setManagerAge(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                          <span>30a</span>
                          <span className="text-emerald-500 font-bold">
                            {managerAge < 40
                              ? '🌟 Jovem Promessa'
                              : managerAge < 55
                              ? '🧠 Auge Tático'
                              : managerAge < 70
                              ? '🎖️ Mestre Experiente'
                              : '🏛️ Lenda Histórica'}
                          </span>
                          <span>80a</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">
                          Formação Tática Inicial
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: '4-3-3', label: '4-3-3 Clássico' },
                            { id: '4-4-2', label: '4-4-2 Tradicional' },
                            { id: '4-2-3-1', label: '4-2-3-1 Europeu' },
                            { id: '3-5-2', label: '3-5-2 Ofensivo' },
                            { id: '5-3-2', label: '5-3-2 Retranca' },
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setManagerFormation(f.id as TacticalFormation)}
                              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center truncate ${
                                managerFormation === f.id
                                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-black shadow-sm'
                                  : 'border-border bg-secondary/60 hover:bg-secondary text-zinc-300'
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">
                        Filosofia Tática de Jogo
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        {[
                          { id: 'attacking', label: 'Ofensiva', desc: 'Pressão alta' },
                          { id: 'possession', label: 'Posse de Bola', desc: 'Controle de jogo' },
                          { id: 'balanced', label: 'Equilibrada', desc: 'Transições rápidas' },
                          { id: 'defensive', label: 'Retranca', desc: 'Contra-ataques' },
                        ].map((phil) => (
                          <button
                            key={phil.id}
                            type="button"
                            onClick={() => setManagerPhilosophy(phil.id as ManagerTacticsPhilosophy)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-w-0 ${
                              managerPhilosophy === phil.id
                                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-black shadow-sm'
                                : 'border-border bg-secondary/60 hover:bg-secondary text-muted-foreground'
                            }`}
                          >
                            <span className="text-xs font-bold block truncate">{phil.label}</span>
                            <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{phil.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 5 Arquétipos de Treinador */}
                  <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
                    <div>
                      <h3 className="font-display text-xl font-black text-foreground">
                        Arquétipo de Liderança
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Seu perfil confere vantagens permanentes na gestão do elenco e nos jogos.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {managerArchetypesList.map((arch) => {
                        const isSelected = managerArchetype === arch.id;
                        return (
                          <div
                            key={arch.id}
                            onClick={() => setManagerArchetype(arch.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                                : 'border-border bg-secondary/50 hover:bg-secondary'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{arch.icon}</span>
                                <h4 className="font-display text-base font-black text-foreground">
                                  {arch.title}
                                </h4>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                {arch.focus}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground">{arch.tagline}</p>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {arch.perks.map((p, idx) => (
                                <span
                                  key={idx}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    p.positive
                                      ? 'bg-emerald-500/15 text-emerald-400'
                                      : 'bg-rose-500/15 text-rose-400'
                                  }`}
                                >
                                  {p.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6 Habilidades de Ouro do Treinador (Tactical MasterStyles) */}
                  <div className="p-6 rounded-3xl bg-card border-2 border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            ★ 6 Estilos Táticos Lendários
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-black text-foreground mt-0.5">
                          Habilidades de Ouro do Treinador (MasterStyles)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Cada estilo define a identidade da sua equipe e confere bônus reais nas partidas e na evolução do elenco.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MANAGER_PLAYSTYLES_GOLD.map((style) => {
                        const isSelected = selectedManagerGoldPlayStyle === style.id;
                        return (
                          <div
                            key={style.id}
                            onClick={() => setSelectedManagerGoldPlayStyle(style.id)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                                : 'border-border bg-secondary/40 hover:bg-secondary/80'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{style.icon}</span>
                                  <h4 className="font-display text-sm font-black text-foreground">
                                    {style.name}
                                  </h4>
                                </div>
                                {isSelected && (
                                  <span className="text-[10px] font-black bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full uppercase">
                                    Ativo
                                  </span>
                                )}
                              </div>

                              <span className="text-[11px] font-bold text-amber-400 block">
                                {style.tagline}
                              </span>

                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {style.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-border/50 mt-3 flex flex-wrap gap-1">
                              {style.badgeLabels.map((badge, bIdx) => (
                                <span
                                  key={bIdx}
                                  className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* SELEÇÃO DO ARQUÉTIPO LENDÁRIO (MESSI, CR7, NEYMAR, IBRA, VINI JR) */}
                    <div className="mt-6 pt-5 border-t border-border/80">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center font-black shadow-md">
                          ⭐
                        </div>
                        <div>
                          <h3 className="font-display text-base font-black text-foreground">
                            Personalidade de Craque Lendário
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Defina o temperamento do seu atleta, inspirado nos maiores craques mundiais.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {LEGEND_ARCHETYPES.map((arch) => {
                          const isSelected = selectedLegendArchetype === arch.id;
                          return (
                            <button
                              key={arch.id}
                              type="button"
                              onClick={() => setSelectedLegendArchetype(arch.id)}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                isSelected
                                  ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                                  : 'bg-secondary/40 border-border hover:bg-secondary'
                              }`}
                            >
                              <span className="text-2xl p-1.5 rounded-xl bg-card border border-border shrink-0">
                                {arch.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-xs sm:text-sm font-black text-foreground">
                                      {arch.name}
                                    </h4>
                                    <span className="text-[10px] text-amber-400 font-extrabold">
                                      • {arch.inspiration}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500 text-zinc-950 px-1.5 py-0.2 rounded-full">
                                      Selecionado
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                  {arch.description}
                                </p>
                                <span className="text-[10px] italic text-zinc-400 mt-1 block">
                                  {arch.quote}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Seleção de Clube do Treinador */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 self-start max-h-[calc(100vh-6rem)] lg:overflow-y-auto no-scrollbar pb-6">
                  <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-xl font-black text-foreground">
                          Clube para Assumir
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {planTier === 'pro' 
                            ? '👑 Vantagem PRO: Assuma qualquer gigante nacional!' 
                            : 'Início na Série D. Séries A, B e C exclusivas para PRO.'}
                        </p>
                      </div>

                      {planTier === 'free' && (
                        <button
                          type="button"
                          onClick={() => setIsProModalOpen(true)}
                          className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Crown className="w-3 h-3" />
                          PRO
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-secondary rounded-2xl text-[11px] sm:text-xs font-bold overflow-x-auto no-scrollbar">
                      {([
                        { id: 'D', label: 'Série D (Grátis)' },
                        { id: 'C', label: 'Série C' },
                        { id: 'B', label: 'Série B' },
                        { id: 'A', label: 'Série A' },
                        { id: 'PL', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier' },
                        { id: 'CHAMPIONSHIP', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Ch\'ship' },
                        { id: 'LALIGA', label: '🇪🇸 La Liga' },
                        { id: 'SEGUNDA_ESP', label: '🇪🇸 La Liga 2' },
                        { id: 'SERIE_A_ITA', label: '🇮🇹 Serie A' },
                        { id: 'SERIE_B_ITA', label: '🇮🇹 Serie B' },
                        { id: 'BUNDESLIGA', label: '🇩🇪 Bundesliga' },
                        { id: 'BUNDESLIGA_2', label: '🇩🇪 2. Bundes' },
                        { id: 'LIGUE_1', label: '🇫🇷 Ligue 1' },
                        { id: 'LIGUE_2', label: '🇫🇷 Ligue 2' },
                        { id: 'MLS', label: '🇺🇸 MLS (Messi)' },
                        { id: 'SAUDI_PRO', label: '🇸🇦 Saudita (CR7)' },
                        { id: 'EUROPA', label: '👑 Champions' },
                      ] as { id: Division; label: string }[]).map((tab) => {
                        const div = tab.id;
                        const isLocked = planTier === 'free' && div !== 'D';
                        const isSelected = selectedDivisionTab === div;

                        return (
                          <button
                            key={div}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                setIsProModalOpen(true);
                              } else {
                                setSelectedDivisionTab(div);
                                const firstClub = clubsByDivision[div]?.[0];
                                if (firstClub) setSelectedClubId(firstClub.id);
                              }
                            }}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
                              isSelected
                                ? ['EUROPA', 'PL', 'LALIGA', 'SERIE_A_ITA', 'BUNDESLIGA', 'LIGUE_1', 'MLS', 'SAUDI_PRO'].includes(div)
                                  ? 'bg-amber-400 text-zinc-950 font-black shadow-sm'
                                  : 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                                : isLocked
                                ? 'text-muted-foreground opacity-60 hover:opacity-100'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <span>{tab.label}</span>
                            {isLocked && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary border border-border flex items-center gap-3">
                      <ClubBadge
                        primaryColor={selectedClub.primaryColor}
                        secondaryColor={selectedClub.secondaryColor}
                        shortName={selectedClub.shortName}
                        size="md"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-foreground">{selectedClub.name}</h4>
                        <span className="text-xs text-muted-foreground block">
                          Orçamento: {formatCurrency(selectedClub.budget)}
                        </span>
                      </div>
                    </div>

                    {/* Resumo do Estilo de Ouro Ativo do Treinador */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getManagerPlayStyleGoldById(selectedManagerGoldPlayStyle)?.icon || '🧠'}
                        </span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                            Estilo Tático MasterStyle
                          </span>
                          <span className="text-xs font-black text-white">
                            {getManagerPlayStyleGoldById(selectedManagerGoldPlayStyle)?.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        {formatCurrency(getManagerPlayStyleGoldById(selectedManagerGoldPlayStyle)?.value || 4200000)}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {(clubsByDivision[selectedDivisionTab] || []).map((club) => (
                        <button
                          key={club.id}
                          type="button"
                          onClick={() => setSelectedClubId(club.id)}
                          className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            selectedClubId === club.id
                              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold'
                              : 'border-border bg-secondary/50 text-foreground hover:bg-secondary'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ClubBadge
                              primaryColor={club.primaryColor}
                              secondaryColor={club.secondaryColor}
                              shortName={club.shortName}
                              size="sm"
                            />
                            <span className="text-xs font-bold">{club.name}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            Rep: {club.reputation}
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateCareer}
                      className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer mt-4"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      Assumir Clube & Iniciar Carreira
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal PRO Esportivo */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />

      {/* Modal Editor do Avatar SVG */}
      <AvatarCreatorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        initialAvatar={avatar}
        onSave={(newAvatar) => setAvatar(newAvatar)}
        characterName={chosenMode === 'player' ? (playerNickname || playerName || 'Davi') : (managerName || 'Professor Rian')}
        clubName={selectedClub?.name || 'Clube Profissional'}
        clubPrimaryColor={selectedClub?.primaryColor}
        clubSecondaryColor={selectedClub?.secondaryColor}
      />
    </div>
  );
}