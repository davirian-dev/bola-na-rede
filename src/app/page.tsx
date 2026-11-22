'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { InstallAppModal } from '@/components/layout/InstallAppModal';
import { 
  Play, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  Trophy, 
  Users, 
  Zap,
  ArrowRight,
  Flame,
  Smartphone,
  Download
} from 'lucide-react';

export default function LandingAuthPage() {
  const router = useRouter();
  const setGuestMode = useGameStore((s) => s.setGuestMode);
  const initDatabaseIfEmpty = useGameStore((s) => s.initDatabaseIfEmpty);
  const playerProfile = useGameStore((s) => s.playerProfile);
  const managerProfile = useGameStore((s) => s.managerProfile);

  const [hasExistingSave, setHasExistingSave] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'guest'>('guest');
  const [isConfigured, setIsConfigured] = useState(true);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    initDatabaseIfEmpty();
    setIsConfigured(isSupabaseConfigured());
    if (playerProfile || managerProfile) {
      setHasExistingSave(true);
    }
  }, [initDatabaseIfEmpty, playerProfile, managerProfile]);

  // Ação: Jogar como Visitante
  const handlePlayAsGuest = () => {
    setGuestMode(true);
    if (hasExistingSave) {
      router.push('/dashboard');
    } else {
      router.push('/new-career');
    }
  };

  // Ação: Login com Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isConfigured) {
      setErrorMessage('Supabase ainda não configurado no servidor. Use o Modo Visitante.');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage('Erro ao inicializar conexão com o banco.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setGuestMode(false);
      setSuccessMessage('Login realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push(hasExistingSave ? '/dashboard' : '/new-career');
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  // Ação: Cadastro com Supabase
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isConfigured) {
      setErrorMessage('Supabase ainda não configurado no servidor. Use o Modo Visitante.');
      return;
    }

    if (!username.trim() || username.length < 3) {
      setErrorMessage('O apelido / username deve ter pelo menos 3 caracteres.');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMessage('Erro ao inicializar conexão com o banco.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
            plan: 'free',
          },
        },
      });

      if (error) throw error;

      // Criar perfil na tabela pública profiles se logado
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: username.trim(),
          plan: 'free',
          theme_pref: 'dark',
        });
      }

      setGuestMode(false);
      setSuccessMessage('Conta criada com sucesso! Redirecionando para o jogo...');
      setTimeout(() => {
        router.push(hasExistingSave ? '/dashboard' : '/new-career');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background text-foreground">
      {/* Background Video Teaser com Fallback em Poster */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-poster.webp"
          className="w-full h-full object-cover scale-105 opacity-25 dark:opacity-20 filter blur-[1px]"
        >
          <source src="/videos/hero-loop.webm" type="video/webm" />
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
        {/* Overlay em gradiente esportivo */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background z-10" />
      </div>

      {/* Header superior da Landing */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg">
            <Image
              src="/images/logo-icon.svg"
              alt="Bola na Rede Ícone"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-tight text-foreground block leading-none">
              BOLA NA <span className="text-emerald-500">REDE</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
              CARREIRA BRASIL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
            title="Baixar aplicativo oficial no Celular ou PC"
          >
            <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Baixar App Celular</span>
            <span className="sm:hidden">Baixar App</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Hero Headline */}
        <div className="text-center mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Séries A, B, C e D • Modo Jogador & Treinador
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[0.95] mb-3">
            O SEU NOME NA HISTÓRIA DO <span className="text-emerald-500">FUTEBOL</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Comece como uma promessa na base Sub-20 da Série D até a glória na Europa, ou comande seu clube como treinador na busca de títulos e dinastias.
          </p>
        </div>

        {/* Card Central de Acesso */}
        <div className="w-full max-w-md bg-card/90 backdrop-blur-md border border-border rounded-2xl p-6 shadow-2xl">
          {/* Seletor de Abas */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-secondary mb-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('guest')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'guest'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Visitante
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Feedback de Erro ou Sucesso */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-medium">
              {successMessage}
            </div>
          )}

          {/* ABA 1: MODO VISITANTE (Rápido e imediato) */}
          {activeTab === 'guest' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Jogue Agora Sem Cadastro
                </div>
                <p className="text-muted-foreground">
                  O progresso fica salvo na memória do seu navegador. Você pode testar todas as funcionalidades do jogo imediatamente.
                </p>
                {!isConfigured && (
                  <div className="flex items-start gap-1.5 pt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Supabase não configurado no servidor. O Modo Visitante está 100% ativo e pronto para jogar!</span>
                  </div>
                )}
              </div>

              {hasExistingSave ? (
                <button
                  onClick={handlePlayAsGuest}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Continuar Carreira Salva
                </button>
              ) : (
                <button
                  onClick={handlePlayAsGuest}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  Iniciar Nova Carreira Agora
                </button>
              )}
            </div>
          )}

          {/* ABA 2: ENTRAR */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Entrando...' : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar na Conta
                  </>
                )}
              </button>
            </form>
          )}

          {/* ABA 3: CADASTRAR */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                  Apelido / Treinador / Jogador
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: Fenomeno9, ReiDoGol"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                  Senha (mín. 6 dígitos)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Criando conta...' : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Criar Conta Gratuita
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Badges de Destaque */}
        <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-lg text-center">
          <div className="p-3 rounded-xl bg-card/60 border border-border backdrop-blur">
            <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <span className="text-xs font-bold block text-foreground">76 Clubes</span>
            <span className="text-[10px] text-muted-foreground">Séries A a D</span>
          </div>
          <div className="p-3 rounded-xl bg-card/60 border border-border backdrop-blur">
            <Users className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <span className="text-xs font-bold block text-foreground">2 Modos</span>
            <span className="text-[10px] text-muted-foreground">Jogador & Técnico</span>
          </div>
          <div className="p-3 rounded-xl bg-card/60 border border-border backdrop-blur">
            <ShieldCheck className="w-5 h-5 text-sky-400 mx-auto mb-1" />
            <span className="text-xs font-bold block text-foreground">Editor Livre</span>
            <span className="text-[10px] text-muted-foreground">Patches Comunitários</span>
          </div>
        </div>

        {/* Recursos em Destaque (Bola na Rede: Carreira) */}
        <div className="mt-12 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {/* Card 1: Modo Jogador */}
          <div className="p-5 rounded-2xl bg-card/85 border border-border backdrop-blur shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
              ⚽
            </div>
            <h4 className="font-display text-base font-black text-foreground">
              Modo Jogador & Dinastia
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Comece na base Sub-20 da Série D, suba ao profissional, feche patrocínios, compre carros e lanchas, enfrente coletivas polêmicas e passe a chuteira para o seu filho na 2ª geração.
            </p>
          </div>

          {/* Card 2: Modo Treinador */}
          <div className="p-5 rounded-2xl bg-card/85 border border-border backdrop-blur shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm">
              👔
            </div>
            <h4 className="font-display text-base font-black text-foreground">
              Modo Treinador Tático
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Escale no 4-3-3, 4-4-2 ou 3-5-2, gerencie titulares e reservas com substituições em tempo real, compre reforços no Mercado da Bola e expanda seu estádio.
            </p>
          </div>

          {/* Card 3: Motor de Partida Híbrido */}
          <div className="p-5 rounded-2xl bg-card/85 border border-border backdrop-blur shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
              ⚡
            </div>
            <h4 className="font-display text-base font-black text-foreground">
              Motor Híbrido 2D
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Minigames de pênalti, passes teleguiados e fintas de drible 1v1 estilo New Star Soccer, integrados a um radar de gramado em tempo real e narração plástica.
            </p>
          </div>

          {/* Card 4: Hall da Fama */}
          <div className="p-5 rounded-2xl bg-card/85 border border-border backdrop-blur shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm">
              🏆
            </div>
            <h4 className="font-display text-base font-black text-foreground">
              Hall da Fama & Recordes
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sistema oficial de pontuação baseado em títulos (Séries A a D, Copas e Mundiais), prêmios Bola de Ouro, artilharias e patrimônio acumulado.
            </p>
          </div>
        </div>

        {/* SEÇÃO VIP / PRO - TABELA COMPARATIVA (FREE vs VIP/PRO) */}
        <div className="mt-16 w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-card/90 border-2 border-emerald-500/30 backdrop-blur shadow-2xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 inline-block">
              Planos & Benefícios
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground">
              Escolha Sua Experiência: Grátis ou VIP/Pro
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Jogue 100% de graça ou desbloqueie liberdade total com a assinatura VIP para comandar qualquer gigante do futebol brasileiro.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-black uppercase tracking-wider">
                  <th className="py-3 px-3">Funcionalidade</th>
                  <th className="py-3 px-3 text-center">Grátis (Free)</th>
                  <th className="py-3 px-3 text-center text-amber-500 bg-amber-500/10 rounded-t-xl">
                    ⭐ VIP / PRO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="py-3 px-3 font-semibold text-foreground">76 Clubes Reais (Séries A, B, C e D)</td>
                  <td className="py-3 px-3 text-center text-emerald-500 font-black">✓ Incluso</td>
                  <td className="py-3 px-3 text-center text-emerald-500 font-black bg-amber-500/5">✓ Incluso</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-foreground">Modo Jogador Completo + Minigames 2D</td>
                  <td className="py-3 px-3 text-center text-emerald-500 font-black">✓ Incluso</td>
                  <td className="py-3 px-3 text-center text-emerald-500 font-black bg-amber-500/5">✓ Incluso</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-foreground">Modo Treinador Tático & Substituições</td>
                  <td className="py-3 px-3 text-center text-emerald-500 font-black">✓ Incluso</td>
                  <td className="py-3 px-3 text-center text-emerald-500 font-black bg-amber-500/5">✓ Incluso</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-foreground">Escolha Inicial de Divisão & Clube</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">Inicia na Série D</td>
                  <td className="py-3 px-3 text-center text-amber-400 font-black bg-amber-500/5">
                    Qualquer Clube (Série A, B, C ou D)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-foreground">Dinastia Familiar de Gerações</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">Até 2 Gerações</td>
                  <td className="py-3 px-3 text-center text-amber-400 font-black bg-amber-500/5">
                    Infinitas Gerações (Filho, Neto...)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-foreground">Editor Comunitário de Pacotes</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">Básico</td>
                  <td className="py-3 px-3 text-center text-amber-400 font-black bg-amber-500/5">
                    Downloads em 1 Clique + Ilimitado
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-foreground">Sincronização em Nuvem & Hall da Fama</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">Local no Navegador</td>
                  <td className="py-3 px-3 text-center text-emerald-500 font-black bg-amber-500/5">
                    Selo VIP + Nuvem Multi-Dispositivo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handlePlayAsGuest}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Jogar Grátis Agora
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Criar Conta e Conhecer o VIP
            </button>
          </div>
        </div>
      </main>

      {/* Rodapé da Landing com LGPD e Políticas */}
      <footer className="relative z-20 w-full py-6 text-center border-t border-border/50 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center justify-center gap-4 text-xs font-semibold">
          <Link href="/pontuacao" className="hover:text-foreground transition-colors">
            Sistema de Pontuação
          </Link>
          <span>•</span>
          <Link href="/ranking" className="hover:text-foreground transition-colors">
            Hall da Fama
          </Link>
          <span>•</span>
          <a href="/privacidade.html" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Privacidade & LGPD
          </a>
          <span>•</span>
          <a href="/termos.html" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Termos de Uso
          </a>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Bola na Rede: Carreira © 2026 • Inspirado no clássico futebol brasileiro (Brasfoot, Elifoot & New Star Soccer).
        </p>
      </footer>

      {/* Modal de Instalação PWA (Celular & PC) */}
      <InstallAppModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
    </div>
  );
}
