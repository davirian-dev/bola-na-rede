'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Smartphone, 
  Monitor, 
  Download, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Zap, 
  WifiOff, 
  QrCode 
} from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useIsMounted } from '@/hooks/useIsMounted';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallAppModal({ isOpen, onClose }: InstallAppModalProps) {
  const { isInstallable, isInstalled, isIOS, isStandalone, promptInstall } = usePWAInstall();
  const mounted = useIsMounted();
  const appUrl = mounted ? window.location.origin : 'https://bola-na-rede-psi.vercel.app';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      onClose();
    }
  };

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&color=10-185-129&bgcolor=9-19-13`;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        style={{ backgroundColor: '#09130d', opacity: 1 }}
        className="text-foreground border border-emerald-500/30 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-[0_0_60px_rgba(16,185,129,0.15)] relative flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Topo / Cabeçalho */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              App Oficial PWA
            </span>
            <h3 className="font-display text-xl font-black text-foreground mt-0.5">
              Baixar Bola na Rede
            </h3>
            <p className="text-xs text-muted-foreground">
              Instale no seu Celular ou PC para jogar em tela cheia e sem travas
            </p>
          </div>
        </div>

        {/* Status: Já Instalado */}
        {isStandalone || isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 my-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
            <div>
              <h4 className="text-sm font-black">Aplicativo Já Instalado!</h4>
              <p className="text-xs text-emerald-300/80">
                Você já está rodando a versão otimizada em tela cheia com aceleração gráfica ativa.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 my-2">
            {/* Bloco 1: Instalação Automática (Android / Chrome / Edge / PC) */}
            {isInstallable && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase text-emerald-400">
                      Instalação Rápida em 1 Clique
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                    Android & PC
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  Adicione o ícone oficial à sua tela inicial sem precisar de Google Play ou App Store.
                </p>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Instalar Aplicativo Agora
                </button>
              </div>
            )}

            {/* Bloco 2: Guia Exclusivo para iPhone / iPad (iOS Safari) */}
            {isIOS && (
              <div className="p-4 rounded-2xl bg-secondary/80 border border-border space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-black uppercase">
                    Como Instalar no iPhone / iPad (iOS):
                  </span>
                </div>
                <ol className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <span>No Safari, toque no botão <strong>Compartilhar</strong> (ícone <Share2 className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> na barra inferior).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-1 text-amber-400" />).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <span>Confirme em <strong>Adicionar</strong>. O app abrirá como jogo nativo!</span>
                  </li>
                </ol>
              </div>
            )}

            {/* Bloco 3: Se estiver no PC ou navegador genérico, oferecer QR Code para abrir no celular */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/80 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 bg-zinc-950 p-2 rounded-xl border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
                {/* QR Code Imagem com fallback limpo */}
                <img
                  src={qrApiUrl}
                  alt="QR Code Bola na Rede"
                  className="w-full h-full object-contain rounded"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-xs font-black text-foreground flex items-center justify-center sm:justify-start gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  Abrir Direto no Celular
                </span>
                <p className="text-xs text-muted-foreground">
                  Aponte a câmera do seu smartphone para o QR Code para abrir e jogar diretamente no seu celular.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 break-all select-all bg-zinc-950/80 px-2 py-1 rounded-lg border border-border">
                  {appUrl}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vantagens da Versão Otimizada */}
        <div className="pt-3 border-t border-border/80 mt-2">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Vantagens do Jogo Otimizado:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60 text-center">
              <Zap className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[11px] font-bold block text-foreground">Zero Lag (60 FPS)</span>
              <span className="text-[10px] text-muted-foreground block">Renderização 2D acelerada</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60 text-center">
              <Smartphone className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[11px] font-bold block text-foreground">Tela Cheia</span>
              <span className="text-[10px] text-muted-foreground block">Sem barra de navegador</span>
            </div>
            <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60 text-center">
              <WifiOff className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[11px] font-bold block text-foreground">Modo Offline</span>
              <span className="text-[10px] text-muted-foreground block">Economia máxima de dados</span>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
