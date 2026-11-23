import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Bola na Rede: Carreira',
  description: 'Política de privacidade e proteção de dados pessoais (LGPD) do Bola na Rede: Carreira.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://bola-na-rede-psi.vercel.app/privacidade' },
};

export default function PrivacidadePage() {
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
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Política de Privacidade</h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-0.5">Conformidade com a LGPD (Lei nº 13.709/2018) • Novembro/2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-6 md:p-8 rounded-2xl border border-zinc-800/80 shadow-xl">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">1.</span> Dados Pessoais Coletados
            </h2>
            <p>
              Em conformidade com o princípio da necessidade e minimização de dados, coletamos apenas:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-zinc-400 text-xs md:text-sm">
              <li><strong>Identificador de Acesso:</strong> Endereço de e-mail e ID de autenticação seguro providos pelo Supabase Auth.</li>
              <li><strong>Dados de Progresso do Jogo:</strong> Saves locais (armazenados no `localStorage` do seu navegador) e cópias em nuvem no Supabase contendo estatísticas, histórico de temporadas e configurações do perfil.</li>
              <li><strong>Dados de Transação:</strong> Registros das solicitações de pagamento via Pix para validação de pedidos. Não armazenamos senhas bancárias ou dados de cartão de crédito.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">2.</span> Finalidade e Base Legal do Tratamento
            </h2>
            <p>
              Os dados são tratados com base na <strong>execução de contrato e prestação do serviço interativo</strong> (Art. 7º, V da LGPD) e no <strong>legítimo interesse</strong> para garantir a segurança da infraestrutura e prevenção a fraudes no ranking online.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">3.</span> Compartilhamento de Dados
            </h2>
            <p>
              Nenhum dado pessoal é vendido, alugado ou repassado a terceiros para fins de publicidade comportamental ou marketing invasivo. O compartilhamento ocorre exclusivamente com os provedores essenciais de infraestrutura:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-zinc-400 text-xs md:text-sm">
              <li><strong>Vercel Inc.:</strong> Hospedagem e CDN de borda da aplicação web.</li>
              <li><strong>Supabase Inc.:</strong> Banco de dados relacional e infraestrutura de autenticação criptografada.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">4.</span> Armazenamento Local e Cookies
            </h2>
            <p>
              Utilizamos tecnologias de armazenamento local do navegador (`localStorage`) para persistir o seu save offline, preferências de tema e volume de som. Você tem autonomia total para apagar esses dados a qualquer momento limpando o cache do navegador.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">5.</span> Direitos do Titular (Art. 18 da LGPD)
            </h2>
            <p>
              Você pode, a qualquer tempo, solicitar a confirmação da existência de tratamento, o acesso aos seus dados salvos em nuvem, a correção de dados incompletos ou a exclusão definitiva do seu save e conta através do nosso canal de suporte.
            </p>
          </section>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-zinc-800/80">
          <span>Bola na Rede: Carreira &copy; 2026</span>
          <Link href="/termos" className="text-emerald-400 hover:underline">
            Ver Termos de Uso
          </Link>
        </div>
      </div>
    </div>
  );
}
