import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Scale, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos de Uso | Bola na Rede: Carreira',
  description: 'Termos de uso e condições gerais do jogo Bola na Rede: Carreira.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://bola-na-rede-psi.vercel.app/termos' },
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-3xl space-y-8 my-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Início
        </Link>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Termos de Uso</h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-0.5">Última atualização: 22 de Novembro de 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-6 md:p-8 rounded-2xl border border-zinc-800/80 shadow-xl">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">1.</span> Natureza do Serviço e Jogo Virtual
            </h2>
            <p>
              O <strong>Bola na Rede: Carreira</strong> é um simulador interativo de carreira futebolística gratuito com compras opcionais no modelo Freemium/Pro. Todas as moedas, energéticos (NRG), chuteiras, bolas e troféus conquistados no jogo constituem ativos estritamente virtuais, sem valor monetário, de troca ou resgate no mundo real.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">2.</span> Plano VIP & Transações Digitais via Pix
            </h2>
            <p>
              As assinaturas ou aquisições de créditos (via chave Pix processada com integridade de gateway) desbloqueiam recursos cosméticos e utilitários adicionais, como personalização climática dos estádios, remoção de limites de simulação instantânea e slots de saves adicionais. As compras digitais são definitivas e vinculadas à conta do usuário.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">3.</span> Idade Mínima e Contas
            </h2>
            <p>
              O acesso é recomendado para usuários a partir de 13 anos. Para compras ou transações por menores de 18 anos, é necessária a supervisão ou autorização expressa dos responsáveis legais.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">4.</span> Conduta no Ranking Online e PvP
            </h2>
            <p>
              É estritamente vedado o uso de scripts maliciosos, exploração de brechas de rede ou engenharia reversa para manipulação de pontuação de ELO ou do placar na Arena PvP. Violações resultarão em reinicialização do cartel online ou suspensão permanente do acesso.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">5.</span> Propriedade Intelectual e Isenção de Marcas
            </h2>
            <p>
              Os nomes de clubes, atletas e marcas fictícias inseridos no projeto destinam-se ao contexto lúdico de simulação esportiva sob os preceitos de uso justo. Nomes de equipamentos como chuteiras utilizam identificadores autorais e autônomos.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">6.</span> Foro de Resolução de Conflitos
            </h2>
            <p>
              Estes termos são regidos pelas leis da República Federativa do Brasil, elegendo-se o foro da comarca de São Paulo/SP para dirimir eventuais controvérsias.
            </p>
          </section>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-zinc-800/80">
          <span>Bola na Rede: Carreira &copy; 2026</span>
          <Link href="/privacidade" className="text-emerald-400 hover:underline">
            Ver Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
}
