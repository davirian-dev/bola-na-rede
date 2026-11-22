'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { STAFF_CATALOG, SPONSOR_OFFERS, NRG_DRINKS_CATALOG } from '@/data/nssCatalogSeed';
import { OFFICIAL_BOOTS_CATALOG, getBootById } from '@/data/boots';
import { OFFICIAL_BALLS_CATALOG, getBallById } from '@/data/balls';
import { formatCurrency } from '@/lib/calculations';
import { NRGType } from '@/types/game';
import { 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  Coins, 
  Users, 
  Flame, 
  CheckCircle2, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface NSSPlayerShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NSSPlayerShopModal({ isOpen, onClose }: NSSPlayerShopModalProps) {
  const playerProfile = useGameStore((s) => s.playerProfile);
  const buyBoot = useGameStore((s) => s.buyBoot);
  const equipBoot = useGameStore((s) => s.equipBoot);
  const buyBall = useGameStore((s) => s.buyBall);
  const equipBall = useGameStore((s) => s.equipBall);
  const globalEquippedBallId = useGameStore((s) => s.equippedBallId);
  const globalOwnedBallIds = useGameStore((s) => s.ownedBallIds);
  const buyEnergyDrink = useGameStore((s) => s.buyEnergyDrink);
  const drinkEnergyCan = useGameStore((s) => s.drinkEnergyCan);
  const hireStaffMember = useGameStore((s) => s.hireStaffMember);
  const signSponsorContract = useGameStore((s) => s.signSponsorContract);

  const [activeTab, setActiveTab] = useState<'boots' | 'balls' | 'nrg' | 'staff' | 'sponsors'>('boots');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !playerProfile) return null;

  const showFeedbackMessage = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const equippedBootId = playerProfile.equippedBootId || 'classic_black';
  const ownedBootIds = playerProfile.ownedBootIds || ['classic_black'];
  const activeBoot = getBootById(equippedBootId) || OFFICIAL_BOOTS_CATALOG[0];

  const equippedBallId = playerProfile.equippedBallId || globalEquippedBallId || 'classic_capotao';
  const ownedBallIds = playerProfile.ownedBallIds || globalOwnedBallIds || ['classic_capotao'];
  const activeBall = getBallById(equippedBallId) || OFFICIAL_BALLS_CATALOG[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-foreground border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow decorativo de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Topo do Modal */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl">
              🛍️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block">
                Loja Oficial do Atleta • Estilo NSS
              </span>
              <h3 className="font-display text-xl font-black text-foreground">
                Equipamentos, Energéticos & Staff
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-xl border border-border">
              <Coins className="w-4 h-4 text-emerald-500" />
              <span className="font-mono text-xs font-black text-foreground">
                {formatCurrency(playerProfile.bankBalance)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alerta de Feedback */}
        {feedback && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center animate-in fade-in duration-200">
            {feedback}
          </div>
        )}

        {/* Abas da Loja (Chuteiras, Bolas, Energéticos, Staff, Patrocinadores) */}
        <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-secondary mb-5 text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('boots')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'boots'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            👟 Chuteiras
          </button>
          <button
            onClick={() => setActiveTab('balls')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'balls'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⚽ Bolas
          </button>
          <button
            onClick={() => setActiveTab('nrg')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'nrg'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⚡ NRG Drinks
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            👥 Staff
          </button>
          <button
            onClick={() => setActiveTab('sponsors')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'sponsors'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⭐ Patrocínio
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {/* ======================================================== */}
          {/* ABA 1: CHUTEIRAS OFICIAIS COM ATRIBUTOS REAIS           */}
          {/* ======================================================== */}
          {activeTab === 'boots' && (
            <div className="space-y-4">
              {/* Chuteira Atual Equipada */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeBoot.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                        Chuteira em Uso
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        {activeBoot.rarity}
                      </span>
                    </div>
                    <h4 className="font-display text-base font-black text-foreground">
                      {activeBoot.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {activeBoot.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-1.5 text-xs font-bold max-w-xs">
                  {(() => {
                    const bAttrs = (activeBoot.bonusAttributes || {}) as any;
                    return (
                      <>
                        {bAttrs.pace && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Ritmo +{bAttrs.pace}
                          </span>
                        )}
                        {bAttrs.finishing && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Finalização +{bAttrs.finishing}
                          </span>
                        )}
                        {bAttrs.passing && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Passe +{bAttrs.passing}
                          </span>
                        )}
                        {bAttrs.dribbling && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Drible +{bAttrs.dribbling}
                          </span>
                        )}
                        {bAttrs.defending && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Defesa +{bAttrs.defending}
                          </span>
                        )}
                        {bAttrs.physical && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Físico +{bAttrs.physical}
                          </span>
                        )}
                        {bAttrs.vision && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Visão +{bAttrs.vision}
                          </span>
                        )}
                        {bAttrs.shooting && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Chute +{bAttrs.shooting}
                          </span>
                        )}
                        {bAttrs.positioning && (
                          <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                            Posicionamento +{bAttrs.positioning}
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Catálogo Oficial com as 9 Chuteiras */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {OFFICIAL_BOOTS_CATALOG.map((boot) => {
                  const isEquipped = equippedBootId === boot.id;
                  const isOwned = ownedBootIds.includes(boot.id);
                  const canAfford = (playerProfile.bankBalance ?? playerProfile.money ?? 0) >= boot.price;

                  return (
                    <div
                      key={boot.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isEquipped
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                          : 'border-border bg-secondary/50 hover:border-emerald-500/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {boot.image ? (
                              <img
                                src={boot.image}
                                alt={boot.name}
                                loading="lazy"
                                decoding="async"
                                className="w-14 h-9 object-contain drop-shadow-md shrink-0"
                              />
                            ) : (
                              <span className="text-2xl">{boot.icon}</span>
                            )}
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-inner" 
                              style={{ backgroundColor: boot.color }}
                              title={`Cor: ${boot.name}`}
                            />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            boot.rarity === 'Lendária'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : boot.rarity === 'Elite'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : boot.rarity === 'Pro'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}>
                            {boot.rarity}
                          </span>
                        </div>

                        <h5 className="font-display text-sm font-black text-foreground mb-1">
                          {boot.name}
                        </h5>
                        <p className="text-[11px] text-muted-foreground mb-2.5">
                          {boot.description}
                        </p>

                        {/* Bônus Reais Aplicados */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {boot.bonusAttributes && Object.entries(boot.bonusAttributes).map(([attr, val]) => (
                            <span key={attr} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card/80 border border-border text-emerald-400">
                              +{val} {attr === 'pace' ? 'Ritmo' : attr === 'finishing' ? 'Finalização' : attr === 'passing' ? 'Passe' : attr === 'dribbling' ? 'Drible' : attr === 'defending' ? 'Defesa' : attr === 'physical' ? 'Físico' : attr === 'shooting' ? 'Chute' : attr === 'vision' ? 'Visão' : attr === 'composure' ? 'Compostura' : attr === 'positioning' ? 'Posicionamento' : attr}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-foreground">
                          {boot.price === 0 ? 'Grátis / Inicial' : formatCurrency(boot.price)}
                        </span>

                        {isEquipped ? (
                          <span className="text-xs font-black text-emerald-500 flex items-center gap-1 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Equipada
                          </span>
                        ) : isOwned ? (
                          <button
                            type="button"
                            onClick={() => {
                              equipBoot(boot.id);
                              showFeedbackMessage(`Chuteira "${boot.name}" equipada!`);
                            }}
                            className="py-1.5 px-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-zinc-950 transition shadow-sm cursor-pointer"
                          >
                            Equipar
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => {
                              const res = buyBoot(boot.id);
                              showFeedbackMessage(res.message);
                            }}
                            className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm active:scale-95'
                                : 'bg-secondary text-muted-foreground opacity-50 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? 'Comprar' : 'Sem Saldo'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 2: BOLAS OFICIAIS COM FÍSICA E EFEITOS NO CANVAS     */}
          {/* ======================================================== */}
          {activeTab === 'balls' && (
            <div className="space-y-4">
              {/* Bola Atual em Uso */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {activeBall.image ? (
                    <img
                      src={activeBall.image}
                      alt={activeBall.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0"
                    />
                  ) : (
                    <span className="text-3xl">{activeBall.icon}</span>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                        Bola Oficial da Partida
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        {activeBall.rarity}
                      </span>
                    </div>
                    <h4 className="font-display text-base font-black text-foreground">
                      {activeBall.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {activeBall.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-1.5 text-xs font-bold max-w-xs">
                  <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                    Curva {(activeBall.physics.curveMultiplier * 100).toFixed(0)}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                    Velocidade {(activeBall.physics.speedMultiplier * 100).toFixed(0)}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                    Rastro: {activeBall.physics.trailType}
                  </span>
                </div>
              </div>

              {/* Catálogo Oficial com as 8 Bolas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {OFFICIAL_BALLS_CATALOG.map((ball) => {
                  const isEquipped = equippedBallId === ball.id;
                  const isOwned = ownedBallIds.includes(ball.id);
                  const canAfford = (playerProfile.bankBalance ?? playerProfile.money ?? 0) >= ball.price;

                  return (
                    <div
                      key={ball.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isEquipped
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                          : 'border-border bg-secondary/50 hover:border-emerald-500/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {ball.image ? (
                              <img
                                src={ball.image}
                                alt={ball.name}
                                loading="lazy"
                                decoding="async"
                                className="w-10 h-10 object-contain drop-shadow-md shrink-0"
                              />
                            ) : (
                              <span className="text-2xl">{ball.icon}</span>
                            )}
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-inner" 
                              style={{ backgroundColor: ball.secondaryColor }}
                              title={`Cor: ${ball.name}`}
                            />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            ball.rarity === 'Lendária'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : ball.rarity === 'Especial'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : ball.rarity === 'Rara'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}>
                            {ball.rarity}
                          </span>
                        </div>

                        <h5 className="font-display text-sm font-black text-foreground mb-0.5">
                          {ball.name}
                        </h5>
                        <span className="text-[10px] font-semibold text-emerald-400 block mb-1.5">
                          {ball.subtitle}
                        </span>
                        <p className="text-[11px] text-muted-foreground mb-2.5">
                          {ball.description}
                        </p>

                        {/* Modificadores de Física Real */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {ball.physics.curveMultiplier !== 1.0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card/80 border border-border text-cyan-400">
                              Curva {ball.physics.curveMultiplier > 1.0 ? `+${((ball.physics.curveMultiplier - 1) * 100).toFixed(0)}%` : `${((ball.physics.curveMultiplier - 1) * 100).toFixed(0)}%`}
                            </span>
                          )}
                          {ball.physics.speedMultiplier !== 1.0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card/80 border border-border text-yellow-400">
                              Velocidade {ball.physics.speedMultiplier > 1.0 ? `+${((ball.physics.speedMultiplier - 1) * 100).toFixed(0)}%` : `${((ball.physics.speedMultiplier - 1) * 100).toFixed(0)}%`}
                            </span>
                          )}
                          {ball.physics.frictionMultiplier !== 1.0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card/80 border border-border text-amber-400">
                              Atrito {ball.physics.frictionMultiplier > 1.0 ? `+${((ball.physics.frictionMultiplier - 1) * 100).toFixed(0)}%` : `${((ball.physics.frictionMultiplier - 1) * 100).toFixed(0)}%`}
                            </span>
                          )}
                          {ball.physics.precisionBonus > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card/80 border border-border text-emerald-400">
                              Precisão +{(ball.physics.precisionBonus * 100).toFixed(0)}%
                            </span>
                          )}
                          {ball.physics.dribbleBonus > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card/80 border border-border text-purple-400">
                              Controle +{(ball.physics.dribbleBonus * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-foreground">
                          {ball.price === 0 ? 'Grátis / Inicial' : formatCurrency(ball.price)}
                        </span>

                        {isEquipped ? (
                          <span className="text-xs font-black text-emerald-500 flex items-center gap-1 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Bola da Partida
                          </span>
                        ) : isOwned ? (
                          <button
                            type="button"
                            onClick={() => {
                              equipBall(ball.id);
                              showFeedbackMessage(`Bola "${ball.name}" definida como bola oficial de partida!`);
                            }}
                            className="py-1.5 px-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-zinc-950 transition shadow-sm cursor-pointer"
                          >
                            Usar na Partida
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => {
                              const res = buyBall(ball.id);
                              showFeedbackMessage(res.message);
                            }}
                            className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm active:scale-95'
                                : 'bg-secondary text-muted-foreground opacity-50 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? 'Comprar' : 'Sem Saldo'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 2: ENERGÉTICOS NRG DRINKS (4 LATINHAS FIÉIS AO NSS)  */}
          {/* ======================================================== */}
          {activeTab === 'nrg' && (
            <div className="space-y-4">
              {/* Barra de Energia Atual */}
              <div className="p-4 rounded-2xl bg-secondary/80 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center text-xl font-black">
                    ❤️
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                      Condição Física do Atleta
                    </span>
                    <h4 className="font-display text-base font-black text-foreground flex items-center gap-2">
                      Energia Atual: <span className="text-emerald-400 font-mono">{playerProfile.energy}%</span>
                    </h4>
                  </div>
                </div>
                <div className="w-36 h-3 bg-secondary rounded-full overflow-hidden border border-border">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${playerProfile.energy}%` }}
                  />
                </div>
              </div>

              {/* As 4 Latinhas do New Star Soccer (Imagem 1 & 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NRG_DRINKS_CATALOG.map((drink) => {
                  const inv = playerProfile.nrgInventory || { classic: playerProfile.energyDrinksCount || 0, power: 0, focus: 0, gold: 0 };
                  const stock = inv[drink.id] || 0;
                  const canAffordSingle = playerProfile.bankBalance >= drink.price;
                  const packPrice = Math.round(drink.price * 3 * 0.88); // 12% off no pack 3
                  const canAffordPack = playerProfile.bankBalance >= packPrice;

                  return (
                    <div 
                      key={drink.id}
                      className="p-4 rounded-2xl border border-border bg-secondary/50 flex flex-col justify-between space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${drink.bgGradient} text-white flex items-center justify-center text-xl shadow-md`}>
                            {drink.icon}
                          </div>
                          <div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${drink.badgeColor}`}>
                              {drink.colorName} • +{drink.energyBonus}% NRG
                            </span>
                            <h5 className="font-display text-sm font-black text-foreground mt-1">
                              {drink.name}
                            </h5>
                          </div>
                        </div>

                        {/* Contador de Latinhas em Estoque */}
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Estoque</span>
                          <span className="font-mono text-sm font-black text-foreground">
                            {stock} {stock === 1 ? 'lata' : 'latas'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {drink.description}
                      </p>

                      {/* Botões: Beber Agora vs Comprar */}
                      <div className="pt-2 border-t border-border flex items-center gap-2">
                        {/* Botão de Beber Imediato */}
                        <button
                          type="button"
                          disabled={stock <= 0 || playerProfile.energy >= 100}
                          onClick={() => {
                            const res = drinkEnergyCan(drink.id);
                            showFeedbackMessage(res.message);
                          }}
                          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            stock > 0 && playerProfile.energy < 100
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm active:scale-95'
                              : 'bg-secondary text-muted-foreground opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Beber ({stock})
                        </button>

                        {/* Botão de Compra Unitária */}
                        <button
                          type="button"
                          disabled={!canAffordSingle}
                          onClick={() => {
                            const res = buyEnergyDrink(1, drink.price, drink.id);
                            showFeedbackMessage(res.message);
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            canAffordSingle
                              ? 'border-border bg-card hover:border-emerald-500 hover:text-emerald-400 text-foreground active:scale-95'
                              : 'border-border bg-secondary text-muted-foreground opacity-40 cursor-not-allowed'
                          }`}
                          title={`Comprar 1 unidade por ${formatCurrency(drink.price)}`}
                        >
                          +1 ({formatCurrency(drink.price)})
                        </button>

                        {/* Botão Pack de 3 */}
                        <button
                          type="button"
                          disabled={!canAffordPack}
                          onClick={() => {
                            const res = buyEnergyDrink(3, packPrice, drink.id);
                            showFeedbackMessage(res.message);
                          }}
                          className={`py-2 px-2.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                            canAffordPack
                              ? 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 active:scale-95'
                              : 'border-border bg-secondary text-muted-foreground opacity-40 cursor-not-allowed'
                          }`}
                          title={`Pack 3 unidades com 12% OFF: ${formatCurrency(packPrice)}`}
                        >
                          Pack 3
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 3: STAFF & EQUIPE PESSOAL                            */}
          {/* ======================================================== */}
          {activeTab === 'staff' && (
            <div className="space-y-3">
              {STAFF_CATALOG.map((member) => {
                const isHired = playerProfile.staff[member.role]?.id === member.id;
                const canAfford = playerProfile.bankBalance >= member.weeklyCost;

                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl border border-border bg-secondary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-display text-base font-black text-foreground">{member.name}</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-muted-foreground">
                          {member.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{member.perkDescription}</p>
                      <span className="text-xs font-mono font-bold text-amber-500 block mt-1">
                        Custo: {formatCurrency(member.weeklyCost)}/semana
                      </span>
                    </div>

                    {isHired ? (
                      <span className="text-xs font-black text-emerald-500 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Contratado
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          hireStaffMember(member);
                          showFeedbackMessage(`${member.name} foi contratado para sua equipe!`);
                        }}
                        className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                          canAfford
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                            : 'bg-secondary text-muted-foreground opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Contratar' : 'Sem Saldo'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 4: PATROCINADORES (SPONSORS)                         */}
          {/* ======================================================== */}
          {activeTab === 'sponsors' && (
            <div className="space-y-3">
              {SPONSOR_OFFERS.map((spon) => {
                const isSigned = playerProfile.sponsors.some((s) => s.id === spon.id);

                return (
                  <div
                    key={spon.id}
                    className="p-4 rounded-2xl border border-border bg-secondary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {spon.image ? (
                        <div className="w-12 h-12 rounded-xl bg-secondary/80 border border-border p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                          <img
                            src={spon.image}
                            alt={spon.brandName}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-3xl">{spon.logo}</span>
                      )}
                      <div>
                        <h5 className="font-display text-base font-black text-foreground">{spon.brandName}</h5>
                        <p className="text-xs text-muted-foreground">
                          Paga <strong className="text-emerald-400 font-mono">{formatCurrency(spon.weeklyPay)}/sem</strong> + <strong className="text-amber-400 font-mono">{formatCurrency(spon.goalBonus)}</strong> por gol marcado!
                        </p>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          Contrato de {spon.weeksRemaining} semanas
                        </span>
                      </div>
                    </div>

                    {isSigned ? (
                      <span className="text-xs font-black text-emerald-500 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Patrocinador Ativo
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          signSponsorContract(spon);
                          showFeedbackMessage(`Contrato assinado com ${spon.brandName}!`);
                        }}
                        className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-all cursor-pointer shrink-0 shadow-md shadow-amber-500/20"
                      >
                        Assinar Patrocínio
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
