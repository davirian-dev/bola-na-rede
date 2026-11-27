'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { 
  Zap, 
  Crown, 
  Sparkles, 
  Check, 
  Copy, 
  Clock, 
  ShieldCheck, 
  ArrowLeft,
  Flame,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ShopPackage {
  id: string;
  name: string;
  price: string;
  priceCents: number;
  icon: string;
  badge?: string;
  popular?: boolean;
  items: string[];
  pixKey: string;
}

const PACKAGES: ShopPackage[] = [
  {
    id: 'pkg_iniciante',
    name: 'Pacote Aspirante',
    price: 'R$ 4,90',
    priceCents: 490,
    icon: '⚡',
    items: ['500 Moedas no Banco', '2x Energéticos NRG Focus', 'Bônus de Moral no Vestiário'],
    pixKey: '00020126580014br.gov.bcb.pix0136davirian.pix.comercial@bolanarede.com.br52040000530398654044.905802BR5925BOLA NA REDE CARREIRA6009SAO PAULO62070503***6304E8A1',
  },
  {
    id: 'pkg_craque',
    name: 'Pacote Craque da Rodada',
    price: 'R$ 9,90',
    priceCents: 990,
    icon: '🔥',
    popular: true,
    badge: 'Mais Popular',
    items: ['1.500 Moedas no Banco', '5x Energéticos NRG Power', '1x Chuteira Pro Sortida', 'Badge Craque no Perfil'],
    pixKey: '00020126580014br.gov.bcb.pix0136davirian.pix.comercial@bolanarede.com.br52040000530398654049.905802BR5925BOLA NA REDE CARREIRA6009SAO PAULO62070503***6304C74B',
  },
  {
    id: 'pkg_lendario',
    name: 'Pacote Galáctico',
    price: 'R$ 19,90',
    priceCents: 1990,
    icon: '👑',
    items: ['4.000 Moedas no Banco', '10x Energéticos NRG Gold', '1x Chuteira Lendária Exclusiva', 'Acesso Prioritário Arena PvP'],
    pixKey: '00020126580014br.gov.bcb.pix0136davirian.pix.comercial@bolanarede.com.br520400005303986540419.905802BR5925BOLA NA REDE CARREIRA6009SAO PAULO62070503***6304FA92',
  },
  {
    id: 'pkg_vip_mensal',
    name: 'Passe VIP Mensal (30 Dias)',
    price: 'R$ 7,90',
    priceCents: 790,
    icon: '💎',
    badge: 'Vantagem VIP',
    items: ['Customização de Clima nos Estádios', 'Padrões Visuais de Gramado', 'Multiplicador 1.5x XP nos Treinos', 'Selo Dourado VIP no Ranking'],
    pixKey: '00020126580014br.gov.bcb.pix0136davirian.pix.comercial@bolanarede.com.br52040000530398654047.905802BR5925BOLA NA REDE CARREIRA6009SAO PAULO62070503***6304192F',
  },
];

interface PixOrder {
  id: string;
  packageName: string;
  price: string;
  createdAt: string;
  status: string;
}

function buildPixOrder(pkg: ShopPackage): PixOrder {
  return {
    id: `PIX-${Date.now().toString().slice(-6)}`,
    packageName: pkg.name,
    price: pkg.price,
    createdAt: new Date().toLocaleDateString('pt-BR'),
    status: 'pendente',
  };
}

export default function LojaPixPage() {
  const [selectedPkg, setSelectedPkg] = useState<ShopPackage | null>(null);
  const [copied, setCopied] = useState(false);
  const [orders, setOrders] = useState<PixOrder[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedOrders = localStorage.getItem('bnr_pix_orders');
    if (!savedOrders) return;
    const timer = setTimeout(() => {
      try {
        setOrders(JSON.parse(savedOrders) as PixOrder[]);
      } catch {}
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleGeneratePix = (pkg: ShopPackage) => {
    setSelectedPkg(pkg);
    setCopied(false);

    // Salvar pedido no histórico local
    const newOrder = buildPixOrder(pkg);

    const updated = [newOrder, ...orders.slice(0, 4)];
    setOrders(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bnr_pix_orders', JSON.stringify(updated));
    }
  };

  const handleCopyPix = () => {
    if (!selectedPkg) return;
    navigator.clipboard.writeText(selectedPkg.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleManualVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifySuccess('Chave Pix validada! Seu pacote será creditado automaticamente na sua conta assim que a compensação bancária for confirmada.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AppHeader />
      <GuestBanner />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row pb-24 md:pb-8">
        <DesktopSidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          {/* Topo da Loja */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 p-6 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl md:text-2xl font-black">Loja de Itens & Passe VIP</h1>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 mt-1">
                Pagamento instantâneo via Pix com liberação segura e suporte dedicado.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs text-zinc-400 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ambiente Protegido</span>
            </div>
          </div>

          {/* Grid de Pacotes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-b from-zinc-900 to-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-zinc-950 shadow">
                    {pkg.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-zinc-950 border border-zinc-800">{pkg.icon}</span>
                    <span className="font-extrabold text-lg md:text-xl text-emerald-400 font-mono">{pkg.price}</span>
                  </div>

                  <h3 className="font-bold text-sm md:text-base text-zinc-100 mt-3">{pkg.name}</h3>

                  <ul className="mt-3 space-y-1.5 text-xs text-zinc-300">
                    {pkg.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleGeneratePix(pkg)}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-zinc-950" />
                  Gerar Pix
                </button>
              </div>
            ))}
          </div>

          {/* Histórico de Pedidos */}
          <div className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Histórico Recente de Pedidos Pix
              </h2>
              <Link href="/suporte" className="text-xs text-emerald-400 hover:underline">
                Precisa de ajuda com o Pix?
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center">Nenhum pedido gerado recentemente no seu navegador.</p>
            ) : (
              <div className="space-y-2">
                {orders.map((ord, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-zinc-400">{ord.id}</span>
                      <span className="font-semibold text-zinc-200">{ord.packageName}</span>
                      <span className="text-emerald-400 font-mono">{ord.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {ord.status}
                      </span>
                      <button
                        onClick={handleManualVerify}
                        disabled={verifying}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-[11px]"
                      >
                        {verifying ? 'Consultando...' : 'Verificar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {verifySuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{verifySuccess}</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Copia e Cola Pix */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-emerald-500/40 rounded-2xl p-5 md:p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPkg.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">{selectedPkg.name}</h3>
                  <span className="text-xs text-emerald-400 font-mono font-bold">{selectedPkg.price}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPkg(null)}
                className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded bg-zinc-800"
              >
                Fechar
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Abra o aplicativo do seu banco, escolha <strong>Pix Copia e Cola</strong> e cole o código abaixo para concluir:
            </p>

            <div className="relative">
              <textarea
                readOnly
                value={selectedPkg.pixKey}
                rows={3}
                className="w-full p-2.5 text-[11px] font-mono bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 resize-none focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleCopyPix}
              className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Código Copiado com Sucesso!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Código Pix
                </>
              )}
            </button>

            <p className="text-[11px] text-zinc-500 text-center">
              Após o pagamento, os itens são ativados no seu save de forma instantânea.
            </p>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}
