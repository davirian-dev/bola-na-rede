'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { 
  HelpCircle, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  LifeBuoy,
  FileQuestion,
  AlertTriangle
} from 'lucide-react';

interface TicketItem {
  id: string;
  category: string;
  orderId?: string;
  message: string;
  createdAt: string;
  status: 'aberto' | 'resolvido';
}

export default function SuportePage() {
  const [category, setCategory] = useState<'pix_vip' | 'bug' | 'sugestao'>('pix_vip');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bnr_support_tickets');
      if (saved) {
        try {
          setTickets(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newTicket: TicketItem = {
      id: `TCK-${Date.now().toString().slice(-5)}`,
      category: category === 'pix_vip' ? 'Pix / Plano VIP' : category === 'bug' ? 'Relato de Bug' : 'Sugestão',
      orderId: orderId.trim() || undefined,
      message: message.trim(),
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'aberto',
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bnr_support_tickets', JSON.stringify(updated));
    }

    setMessage('');
    setOrderId('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AppHeader />
      <GuestBanner />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row pb-24 md:pb-8">
        <DesktopSidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-6 h-6 text-emerald-400" />
                <h1 className="text-xl md:text-2xl font-black">Central de Ajuda & Suporte</h1>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 mt-1">
                Tire dúvidas, relate instabilidades ou peça suporte para suas compras Pix.
              </p>
            </div>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Início
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de Ticket */}
            <div className="lg:col-span-2 bg-zinc-900/70 p-6 rounded-2xl border border-zinc-800/80 space-y-5">
              <h2 className="text-sm md:text-base font-bold text-zinc-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Abrir Novo Chamado de Suporte
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Categoria do Problema</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="pix_vip">Dúvida ou Problema com Pix / VIP</option>
                    <option value="bug">Reportar Bug / Quebra no Jogo</option>
                    <option value="sugestao">Sugestão de Nova Funcionalidade</option>
                  </select>
                </div>

                {category === 'pix_vip' && (
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">ID do Pedido (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: PIX-123456"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Descreva a Situação com Detalhes</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explique o que aconteceu, a rodada em que estava ou o comprovante do Pix..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4 fill-zinc-950" />
                  Enviar Chamado
                </button>

                {submitted && (
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Chamado registrado com sucesso! Nosso time responderá em breve.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Dúvidas Frequentes & Histórico */}
            <div className="space-y-4">
              <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/80 space-y-3">
                <h3 className="text-xs md:text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-amber-400" />
                  Perguntas Frequentes
                </h3>
                <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
                  <p><strong>Quanto tempo demora o Pix?</strong><br />A ativação geralmente é automática em até 5 minutos após a compensação.</p>
                  <p><strong>Perco meus itens se trocar de celular?</strong><br />Se sua conta estiver sincronizada na nuvem com o Supabase, seus itens e saves permanecem intactos.</p>
                </div>
              </div>

              {tickets.length > 0 && (
                <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/80 space-y-2">
                  <h3 className="text-xs font-bold text-zinc-300">Seus Chamados Anteriores</h3>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {tickets.map((t) => (
                      <div key={t.id} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-zinc-400">
                          <span className="font-mono text-emerald-400">{t.id}</span>
                          <span>{t.createdAt}</span>
                        </div>
                        <p className="text-zinc-200 line-clamp-1">{t.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
