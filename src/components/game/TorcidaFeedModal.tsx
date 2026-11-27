'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { 
  MessageSquare, 
  Heart, 
  Repeat2, 
  Flame, 
  Sparkles, 
  Send, 
  X,
  Users,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TorcidaFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TorcidaFeedModal({ isOpen, onClose }: TorcidaFeedModalProps) {
  const fanPostsFeed = useGameStore((s) => s.fanPostsFeed) || [];
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);
  const mode = useGameStore((s) => s.mode);

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [playerReply, setPlayerReply] = useState<'humble' | 'confident' | 'focus' | null>(null);

  if (!isOpen) return null;

  const actorName = mode === 'player' 
    ? (playerProfile?.nickname || playerProfile?.name || 'Craque') 
    : (managerProfile?.name || 'Professor');

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSendResponse = (type: 'humble' | 'confident' | 'focus') => {
    setPlayerReply(type);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border-2 border-emerald-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Topo */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              📱
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Rede Social da Arquibancada
              </span>
              <h3 className="font-display text-base sm:text-lg font-black text-foreground">
                Feed de Reações da Torcida
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feed de Comentários */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {fanPostsFeed.length > 0 ? (
            fanPostsFeed.map((post) => {
              const isLiked = likedPosts[post.id];
              return (
                <div
                  key={post.id}
                  className="p-3.5 rounded-2xl bg-secondary/40 border border-border/70 space-y-2 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: post.avatarColor }}
                      >
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground">
                            {post.authorName}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {post.authorHandle}
                          </span>
                        </div>
                        {post.isDerby && (
                          <span className="text-[9px] font-black text-amber-400 uppercase bg-amber-500/10 px-1.5 py-0.2 rounded">
                            🔥 Dia de Clássico
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      Semana {post.createdAtWeek}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                        isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <div className="flex items-center gap-1 text-[11px]">
                      <Repeat2 className="w-3.5 h-3.5" />
                      <span>{post.retweets}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 rounded-2xl bg-secondary/30 text-center space-y-2">
              <span className="text-3xl block">🏟️</span>
              <p className="text-xs text-muted-foreground">
                A torcida está aguardando as próximas rodadas para comentar a sua atuação.
              </p>
            </div>
          )}
        </div>

        {/* Interação do Atleta: Responder à Torcida */}
        <div className="pt-3 mt-3 border-t border-border space-y-2">
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
            Publicar Pronunciamento para a Massa:
          </span>

          {playerReply ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-400 font-bold flex items-center justify-between">
              <span>✓ Pronunciamento publicado! Torcida e elenco vibraram com a sua postura.</span>
              <button 
                onClick={() => setPlayerReply(null)}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                Trocar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSendResponse('humble')}
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-[11px] text-foreground block">🙏 Humilde</span>
                <span className="text-[9px] text-muted-foreground block leading-tight mt-0.5">
                  &quot;O mérito é do grupo todo, pés no chão.&quot;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSendResponse('confident')}
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-[11px] text-amber-400 block">⚡ Confiante</span>
                <span className="text-[9px] text-muted-foreground block leading-tight mt-0.5">
                  &quot;Trabalho duro todo dia, ninguém segura!&quot;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSendResponse('focus')}
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-[11px] text-emerald-400 block">🎯 Foco Total</span>
                <span className="text-[9px] text-muted-foreground block leading-tight mt-0.5">
                  &quot;Já pensando na próxima rodada, foco na taça.&quot;
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}