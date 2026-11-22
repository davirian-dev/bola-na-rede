'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BOOTS_CATALOG, STAFF_CATALOG, SPONSOR_OFFERS, NRG_DRINKS_CATALOG } from '@/data/nssCatalogSeed';
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
  const buyAndEquipBoot = useGameStore((s) => s.buyAndEquipBoot);
  const buyEnergyDrink = useGameStore((s) => s.buyEnergyDrink);
  const drinkEnergyCan = useGameStore((s) => s.drinkEnergyCan);
  const hireStaffMember = useGameStore((s) => s.hireStaffMember);
  const signSponsorContract = useGameStore((s) => s.signSponsorContract);

  const [activeTab, setActiveTab] = useState<'boots' | 'nrg' | 'staff' | 'sponsors'>('boots');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !playerProfile) return null;

  const showFeedbackMessage = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

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

        {/* Abas da Loja (Chuteiras, Energéticos, Staff, Patrocinadores) */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-secondary mb-5 text-xs font-bold">
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
          {/* ABA 1: CHUTEIRAS COM DESGASTE E BÔNUS                    */}
          {/* ======================================================== */}
          {activeTab === 'boots' && (
            <div className="space-y-4">
              {/* Chuteira Atual Equipada */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{playerProfile.activeBoot?.icon || '👟'}</span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider block">
                      Chuteira em Uso
                    </span>
                    <h4 className="font-display text-base font-black text-foreground">
                      {playerProfile.activeBoot?.name || 'NS-Basic Padrão'}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      Durabilidade restante: <strong className="text-foreground">{playerProfile.activeBoot?.matchesRemaining || 15} partidas</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {playerProfile.activeBoot?.bonus.shooting && (
                    <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                      Chute +{playerProfile.activeBoot.bonus.shooting}
                    </span>
                  )}
                  {playerProfile.activeBoot?.bonus.pace && (
                    <span className="px-2 py-0.5 rounded bg-card border border-border text-emerald-400">
                      Ritmo +{playerProfile.activeBoot.bonus.pace}
                    </span>
                  )}
                </div>
              </div>

              {/* Catálogo de Chuteiras Estilo New Star Soccer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {BOOTS_CATALOG.map((boot) => {
                  const isEquipped = playerProfile.activeBoot?.id === boot.id;
                  const canAfford = playerProfile.bankBalance >= boot.price;

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
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{boot.icon}</span>
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-inner" 
                              style={{ backgroundColor: boot.color || '#18181b' }}
                              title={`Cor: ${boot.name}`}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-muted-foreground bg-card/80 px-2 py-0.5 rounded-md border border-border">
                            {boot.durabilityMatches} partidas
                          </span>
                        </div>

                        <h5 className="font-display text-sm font-black text-foreground mb-2">
                          {boot.name}
                        </h5>

                        {/* Barras de Atributos do NSS (Pace, Power, Technique) */}
                        <div className="space-y-1.5 mb-3 bg-card/60 p-2.5 rounded-xl border border-border/80">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground">⚡ Ritmo (Pace):</span>
                            <span className="text-emerald-400 font-mono">+{boot.bonus.pace || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground">💥 Força/Chute (Power):</span>
                            <span className="text-emerald-400 font-mono">+{boot.bonus.shooting || boot.bonus.power || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground">🎯 Técnica/Passe (Technique):</span>
                            <span className="text-emerald-400 font-mono">+{boot.bonus.passing || boot.bonus.technique || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-foreground">
                          {formatCurrency(boot.price)}
                        </span>
                        {isEquipped ? (
                          <span className="text-xs font-black text-emerald-500 flex items-center gap-1 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Equipada
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => {
                              const res = buyAndEquipBoot(boot);
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
                      <span className="text-3xl">{spon.logo}</span>
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
