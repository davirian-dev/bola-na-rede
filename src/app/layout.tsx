import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { PWARegistration } from '@/components/layout/PWARegistration';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bola-na-rede-psi.vercel.app'),
  alternates: {
    canonical: 'https://bola-na-rede-psi.vercel.app',
  },
  title: 'Bola na Rede: Carreira | Simulador de Futebol Brasileiro',
  description: 'Modo Jogador (Sub-20 ao estrelato) e Modo Treinador com base brasileira, editor comunitário e suporte a PWA.',
  applicationName: 'Bola na Rede: Carreira',
  authors: [{ name: 'Bola na Rede Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Bola na Rede: Carreira | Simulador de Futebol',
    description: 'Comece na base Sub-20 ou comande um clube da Série D até a glória nacional!',
    url: 'https://bola-na-rede-psi.vercel.app',
    siteName: 'Bola na Rede: Carreira',
    images: [
      {
        url: '/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Bola na Rede: Carreira',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c1510',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="darkreader-lock" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bola na Rede" />
        <meta name="application-name" content="Bola na Rede: Carreira" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'VideoGame',
              name: 'Bola na Rede: Carreira',
              url: 'https://bola-na-rede-psi.vercel.app',
              description: 'Modo Jogador (Sub-20 ao estrelato) e Modo Treinador com base brasileira, editor comunitário e suporte a PWA.',
              genre: ['Sports', 'Simulation', 'Management'],
              gamePlatform: 'Web Browser',
              applicationCategory: 'Game',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'BRL',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen overflow-x-hidden selection:bg-emerald-500 selection:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PWARegistration />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
