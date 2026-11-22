'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { Club, Division, Player, CommunityPack } from '@/types/game';
import { ClubBadge } from '@/components/game/ClubBadge';
import { OverallBadge } from '@/components/game/OverallBadge';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { 
  Database, 
  Download, 
  Upload, 
  Check, 
  Search, 
  Edit3, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export default function EditorPage() {
  const clubs = useGameStore((s) => s.clubs);
  const updateClub = useGameStore((s) => s.updateClub);
  const updatePlayer = useGameStore((s) => s.updatePlayer);
  const exportCommunityPack = useGameStore((s) => s.exportCommunityPack);
  const importCommunityPack = useGameStore((s) => s.importCommunityPack);

  const [editorTab, setEditorTab] = useState<'editor' | 'gallery'>('editor');
  const [selectedDivision, setSelectedDivision] = useState<Division>('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string>('fla');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pacotes Prontos da Galeria da Comunidade
  const communityGalleryPacks = [
    {
      id: 'pack-anos-2000',
      title: 'Patch Brasileirão Clássico 2000s',
      author: 'Comunidade Raiz BNR',
      downloads: 4820,
      likes: 985,
      version: 'v2.4',
      badge: '🔥 Mais Baixado',
      description: 'Reviva as lendas dos anos 2000 com elencos clássicos, rivalidade acirrada e camisas retrô.',
    },
    {
      id: 'pack-promessas-2026',
      title: 'Jovens Promessas Brasileiras 2026/27',
      author: 'Scouting Brasil Lab',
      downloads: 3140,
      likes: 740,
      version: 'v1.8',
      badge: '⚡ Atualizado',
      description: 'Potenciais refinados para os jovens de 16 a 19 anos da base de todos os 76 clubes do país.',
    },
    {
      id: 'pack-lendas-classicos',
      title: 'Lendas Históricas dos Maiores Clássicos',
      author: 'Arquivo do Futebol',
      downloads: 6400,
      likes: 1450,
      version: 'v3.0',
      badge: '⭐ Nota 5.0',
      description: 'Zico, Roberto Dinamite, Rivellino, Ademir da Guia e Tostão com atributos lendários.',
    },
  ];

  const handleInstallGalleryPack = (packTitle: string) => {
    setStatusMessage({
      type: 'success',
      text: `Pacote "${packTitle}" instalado com sucesso com 1 clique!`,
    });
  };

  // Filtra clubes pela divisão e busca
  const divisionClubs = Object.values(clubs).filter(
    (c) => c.division === selectedDivision && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeClub = clubs[selectedClubId] || divisionClubs[0];

  // Ação: Exportar Pacote JSON da Comunidade
  const handleExport = () => {
    const pack = exportCommunityPack(
      'Meu Patch do Futebol Brasileiro',
      'Comunidade Bola na Rede',
      'Clubes e jogadores atualizados'
    );
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pack, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `patch-bola-na-rede-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setStatusMessage({ type: 'success', text: 'Pacote JSON exportado com sucesso!' });
  };

  // Ação: Importar Pacote JSON da Comunidade
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const result = importCommunityPack(json);
        if (result.success) {
          setStatusMessage({ type: 'success', text: result.message });
        } else {
          setStatusMessage({ type: 'error', text: result.message });
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Falha ao processar arquivo: JSON mal formatado.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GuestBanner />
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 md:pb-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Topo do Editor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-500" />
                <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  Editor & Importador da Comunidade
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Edite clubes, escudos, orçamentos e elencos. Exporte ou instale patches da comunidade.
              </p>
            </div>

            {/* Ações de Importar e Exportar */}
            <div className="flex items-center gap-2">
              <label className="py-2 px-3.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-500" />
                Importar Patch (JSON)
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExport}
                className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                Exportar Patch
              </button>
            </div>
          </div>

          {/* Alternador de Abas do Editor */}
          <div className="flex items-center gap-2 border-b border-border pb-1">
            <button
              onClick={() => setEditorTab('editor')}
              className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                editorTab === 'editor'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              🛠️ Editor de Clubes & Elencos
            </button>
            <button
              onClick={() => setEditorTab('gallery')}
              className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                editorTab === 'gallery'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              🌟 Galeria da Comunidade (1 Clique)
            </button>
          </div>

          {/* Mensagem de Feedback */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500'
                  : 'bg-destructive/10 border-destructive/25 text-destructive'
              }`}
            >
              <span>{statusMessage.text}</span>
              <button
                onClick={() => setStatusMessage(null)}
                className="hover:opacity-75 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Conteúdo da Galeria de Pacotes (1 Clique) */}
          {editorTab === 'gallery' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border">
                <h3 className="font-display text-base font-black text-foreground">
                  Pacotes Criados pela Comunidade Bola na Rede
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Baixe e ative patches de elencos, ligas históricas e jovens promessas com apenas um clique, sem precisar editar arquivo por arquivo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {communityGalleryPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full bg-emerald-500/15 text-emerald-400">
                          {pack.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          {pack.version}
                        </span>
                      </div>

                      <h4 className="font-display text-base font-black text-foreground">
                        {pack.title}
                      </h4>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {pack.description}
                      </p>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Por: <strong className="text-foreground">{pack.author}</strong></span>
                        <div className="flex items-center gap-3">
                          <span>📥 {pack.downloads}</span>
                          <span>❤️ {pack.likes}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInstallGalleryPack(pack.title)}
                      className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Ativar com 1 Clique
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Seletor de Divisões (Série A, B, C, D) e Busca */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary text-xs font-bold">
                  {(['A', 'B', 'C', 'D', 'EUROPA'] as Division[]).map((div) => (
                    <button
                      key={div}
                      onClick={() => {
                        setSelectedDivision(div);
                        const firstInDiv = Object.values(clubs).find((c) => c.division === div);
                        if (firstInDiv) setSelectedClubId(firstInDiv.id);
                      }}
                      className={`py-1.5 px-3.5 rounded-lg transition-all cursor-pointer ${
                        selectedDivision === div
                          ? div === 'EUROPA'
                            ? 'bg-amber-400 text-zinc-950 font-black shadow-sm'
                            : 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {div === 'EUROPA' ? '👑 Europa' : `Série ${div}`}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar clube..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

          {/* Grid do Editor: Lista de Clubes à esquerda + Formulário à direita */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lista de Clubes da Divisão */}
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-2 max-h-[600px] overflow-y-auto">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Clubes ({divisionClubs.length})
              </span>
              <div className="space-y-1.5">
                {divisionClubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClubId(club.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      selectedClubId === club.id
                        ? 'border-emerald-500 bg-emerald-500/15'
                        : 'border-border bg-secondary/40 hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <ClubBadge
                        primaryColor={club.primaryColor}
                        secondaryColor={club.secondaryColor}
                        shortName={club.shortName}
                        size="sm"
                      />
                      <span className="text-xs font-bold text-foreground truncate">
                        {club.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                      Rep {club.reputation}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulário de Edição do Clube Selecionado */}
            {activeClub && (
              <div className="md:col-span-2 space-y-6">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <ClubBadge
                        primaryColor={activeClub.primaryColor}
                        secondaryColor={activeClub.secondaryColor}
                        shortName={activeClub.shortName}
                        size="md"
                      />
                      <div>
                        <h3 className="font-display text-xl font-black text-foreground">
                          {activeClub.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          Série {activeClub.division} • {activeClub.shortName}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      Modo Edição
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-muted-foreground mb-1 uppercase">
                        Nome do Clube
                      </label>
                      <input
                        type="text"
                        value={activeClub.name}
                        onChange={(e) => updateClub(activeClub.id, { name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-muted-foreground mb-1 uppercase">
                        Sigla / Monograma (3 letras)
                      </label>
                      <input
                        type="text"
                        maxLength={3}
                        value={activeClub.shortName}
                        onChange={(e) => updateClub(activeClub.id, { shortName: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-muted-foreground mb-1 uppercase">
                        Cor Primária (Hex)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeClub.primaryColor}
                          onChange={(e) => updateClub(activeClub.id, { primaryColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border border-border bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={activeClub.primaryColor}
                          onChange={(e) => updateClub(activeClub.id, { primaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-xl border border-border bg-secondary text-foreground font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-muted-foreground mb-1 uppercase">
                        Cor Secundária (Hex)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeClub.secondaryColor}
                          onChange={(e) => updateClub(activeClub.id, { secondaryColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border border-border bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={activeClub.secondaryColor}
                          onChange={(e) => updateClub(activeClub.id, { secondaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-xl border border-border bg-secondary text-foreground font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-muted-foreground mb-1 uppercase">
                        Nome do Estádio
                      </label>
                      <input
                        type="text"
                        value={activeClub.stadiumName}
                        onChange={(e) => updateClub(activeClub.id, { stadiumName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-muted-foreground mb-1 uppercase">
                        Capacidade do Estádio
                      </label>
                      <input
                        type="number"
                        value={activeClub.stadiumCapacity}
                        onChange={(e) => updateClub(activeClub.id, { stadiumCapacity: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Elenco do Clube */}
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                  <h4 className="font-display text-lg font-black text-foreground">
                    Elenco Profissional ({activeClub.roster.length} Atletas)
                  </h4>

                  <div className="overflow-x-auto max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border text-muted-foreground uppercase sticky top-0 bg-card">
                        <tr>
                          <th className="py-2 px-2">OVR</th>
                          <th className="py-2 px-3">Nome</th>
                          <th className="py-2 px-2">Pos</th>
                          <th className="py-2 px-2">Idade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {activeClub.roster.map((player) => (
                          <tr key={player.id} className="hover:bg-secondary/40">
                            <td className="py-2 px-2">
                              <OverallBadge overall={player.overall} size="sm" />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={player.name}
                                onChange={(e) =>
                                  updatePlayer(activeClub.id, player.id, false, { name: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded bg-secondary/80 border border-border font-bold text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="py-2 px-2 font-mono font-bold text-emerald-500">
                              {player.position}
                            </td>
                            <td className="py-2 px-2 text-muted-foreground">
                              {player.age}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
