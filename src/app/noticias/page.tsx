'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { ControversyModal } from '@/components/game/ControversyModal';
import { 
  Newspaper, 
  Search, 
  Flame, 
  Sparkles, 
  Trophy, 
  Calendar, 
  Filter,
  Mic,
  Tv,
  MessageSquareQuote,
  Heart,
  MessageCircle,
  Share2,
  Video,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function NoticiasPage() {
  const newsFeed = useGameStore((s) => s.newsFeed);
  const currentWeek = useGameStore((s) => s.currentWeek);
  const seasonYear = useGameStore((s) => s.seasonYear);
  const triggerRandomControversy = useGameStore((s) => s.triggerRandomControversy);
  const pendingControversy = useGameStore((s) => s.pendingControversy);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isControversyModalOpen, setIsControversyModalOpen] = useState(false);
  const [likedNews, setLikedNews] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'Todas as Manchetes' },
    { id: 'drama', label: 'Polêmicas & Coletivas 🎙️' },
    { id: 'destaque', label: 'Destaques & Craques ⭐' },
    { id: 'rodada', label: 'Rodada & Lances ⚽' },
    { id: 'base', label: 'Categorias de Base 🌟' },
    { id: 'titulo', label: 'Títulos & Taças 🏆' },
    { id: 'club', label: 'Bastidores & Mercado 💼' },
  ];

  const filteredNews = newsFeed.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.portalName && item.portalName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (newsId: string) => {
    setLikedNews((prev) => ({ ...prev, [newsId]: !prev[newsId] }));
  };

  const mainHighlight = filteredNews[0];
  const otherNews = filteredNews.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GuestBanner />
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <DesktopSidebar />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-24 md:pb-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Topo do Diário */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-emerald-500" />
                <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                  Diário da Bola • Central de Notícias
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cobertura multimídia em tempo real do futebol brasileiro com fotos oficiais e replays em vídeo • Temporada {seasonYear}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (!pendingControversy) triggerRandomControversy();
                  setIsControversyModalOpen(true);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0 shadow-md shadow-rose-500/20"
              >
                <Mic className="w-4 h-4" />
                <span>{pendingControversy ? 'Responder Coletiva 🔴' : 'Simular Coletiva 🎙️'}</span>
              </button>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar notícia, clube ou portal..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filteredNews.length === 0 ? (
            <div className="py-20 text-center text-xs text-muted-foreground bg-card rounded-3xl border border-border">
              Nenhuma notícia encontrada para esta categoria ou busca.
            </div>
          ) : (
            <div className="space-y-6">
              {/* MANCHETE PRINCIPAL DE CAPA (COM FOTO GRANDE OU VÍDEO TEASER) */}
              {mainHighlight && (
                <article className="rounded-3xl border border-emerald-500/40 bg-card overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Mídia da Capa (Vídeo Loop ou Imagem WebP) */}
                    <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] bg-zinc-950 flex items-center justify-center overflow-hidden">
                      {mainHighlight.videoTeaserUrl ? (
                        <div className="relative w-full h-full min-h-[260px] sm:min-h-[340px]">
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          >
                            <source src={mainHighlight.videoTeaserUrl} type="video/mp4" />
                          </video>
                          <div className="absolute top-3 left-3 bg-rose-600/90 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Video className="w-3 h-3" />
                            REPLAY EM VÍDEO
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full min-h-[260px] sm:min-h-[340px]">
                          <Image
                            src={mainHighlight.imageUrl || '/images/news/estadio.webp'}
                            alt={mainHighlight.headline}
                            fill
                            loading="lazy"
                            decoding="async"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent lg:hidden" />
                    </div>

                    {/* Conteúdo Textual da Capa */}
                    <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-zinc-950 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {mainHighlight.portalName || 'GE Globo Esporte'}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Semana {mainHighlight.week} • {mainHighlight.seasonYear}
                          </span>
                        </div>

                        <h2 className="font-display font-black text-xl sm:text-2xl text-foreground leading-tight hover:text-emerald-400 transition-colors">
                          {mainHighlight.headline}
                        </h2>

                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {mainHighlight.body}
                        </p>

                        {mainHighlight.imageCaption && (
                          <span className="text-[11px] text-muted-foreground/80 italic block border-l-2 border-emerald-500 pl-2">
                            📷 {mainHighlight.imageCaption}
                          </span>
                        )}

                        {mainHighlight.quote && (
                          <div className="p-3.5 rounded-xl bg-secondary/80 border border-border text-xs italic text-foreground flex items-start gap-2">
                            <MessageSquareQuote className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <span>&quot;{mainHighlight.quote}&quot;</span>
                          </div>
                        )}
                      </div>

                      {/* Rodapé da Matéria */}
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Por: <strong className="text-foreground">{mainHighlight.authorName || 'Redação GE'}</strong>
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleLike(mainHighlight.id)}
                            className={`flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${
                              likedNews[mainHighlight.id] ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${likedNews[mainHighlight.id] ? 'fill-rose-500' : ''}`} />
                            <span>{(mainHighlight.likesCount || 1200) + (likedNews[mainHighlight.id] ? 1 : 0)}</span>
                          </button>

                          <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                            <MessageCircle className="w-4 h-4" />
                            <span>{mainHighlight.commentsCount || 184}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* GRID DAS DEMAIS NOTÍCIAS COM FOTOS EM MINIATURA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {otherNews.map((news) => {
                  const isDrama = news.category === 'drama';
                  const isLiked = !!likedNews[news.id];

                  return (
                    <article
                      key={news.id}
                      className={`rounded-3xl border p-5 flex flex-col justify-between transition-all bg-card ${
                        isDrama 
                          ? 'border-rose-500/40 shadow-sm hover:border-rose-500' 
                          : 'border-border shadow-sm hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="space-y-3.5">
                        {/* Imagem da Notícia */}
                        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-zinc-950">
                          {news.videoTeaserUrl ? (
                            <video
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            >
                              <source src={news.videoTeaserUrl} type="video/mp4" />
                            </video>
                          ) : (
                            <Image
                              src={news.imageUrl || (isDrama ? '/images/news/coletiva.webp' : '/images/news/estadio.webp')}
                              alt={news.headline}
                              fill
                              loading="lazy"
                              decoding="async"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                            {news.portalName || (isDrama ? 'Coletiva Ao Vivo' : 'Diário da Bola')}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            isDrama ? 'bg-rose-500/15 text-rose-400' : 'bg-secondary text-emerald-500'
                          }`}>
                            {isDrama ? 'Polêmica 🎙️' : news.category}
                          </span>
                          <span>Semana {news.week} • {news.seasonYear}</span>
                        </div>

                        <h3 className="font-display font-black text-base text-foreground leading-snug hover:text-emerald-400 transition-colors">
                          {news.headline}
                        </h3>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {news.body}
                        </p>

                        {news.quote && (
                          <div className="p-3 rounded-xl bg-secondary/80 border border-border text-xs italic text-foreground flex items-start gap-2">
                            <MessageSquareQuote className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">&quot;{news.quote}&quot;</span>
                          </div>
                        )}
                      </div>

                      {/* Rodapé da Notícia */}
                      <div className="pt-3.5 border-t border-border mt-4 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {news.authorName || 'Plantão Esportivo'}
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleLike(news.id)}
                            className={`flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                              isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                            <span className="text-[11px]">{(news.likesCount || 450) + (isLiked ? 1 : 0)}</span>
                          </button>

                          <div className="flex items-center gap-1 font-bold text-muted-foreground">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="text-[11px]">{news.commentsCount || 52}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Coletiva Polêmica */}
      <ControversyModal
        isOpen={isControversyModalOpen}
        onClose={() => setIsControversyModalOpen(false)}
      />

      <MobileBottomNav />
    </div>
  );
}
