#!/usr/bin/env python3
"""
Gerador de Assets de Alta Fidelidade Visual (Vetor SVG -> PNG -> WebP Otimizado)
Gera todos os 42 assets oficiais do jogo Bola na Rede: Carreira
"""

import os
import math
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, 'public', 'images')
TMP_DIR = '/tmp/game_assets_gen'

os.makedirs(TMP_DIR, exist_ok=True)
for sub in ['brands', 'sponsors', 'boots', 'balls', 'trophies']:
    os.makedirs(os.path.join(IMG_DIR, sub), exist_ok=True)

def render_svg_to_webp(svg_content: str, rel_path: str):
    svg_file = os.path.join(TMP_DIR, 'temp.svg')
    png_file = os.path.join(TMP_DIR, 'temp.png')
    webp_path = os.path.join(IMG_DIR, rel_path)

    with open(svg_file, 'w') as f:
        f.write(svg_content)
    
    # Renderizar com inkscape em 512x512
    os.system(f"inkscape {svg_file} -o {png_file} -w 512 -h 512 >/dev/null 2>&1")
    
    # Otimizar com Pillow para WebP qualidade 85
    if os.path.exists(png_file):
        img = Image.open(png_file)
        img.save(webp_path, 'WEBP', quality=85, method=6)
        print(f"✓ Gerado: {rel_path} ({os.path.getsize(webp_path)} bytes)")
    else:
        print(f"✗ Falha ao renderizar {rel_path}")

# ==============================================================================
# MARCAS ESPORTIVAS (BRANDS)
# ==============================================================================
def gen_brands():
    # 1. Nike
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#38bdf8" flood-opacity="0.3"/></filter>
      </defs>
      <path d="M70,300 C130,370 230,400 340,360 C460,310 475,200 480,180 C440,240 340,330 230,335 C150,335 100,285 70,300 Z" fill="#ffffff" filter="url(#glow)"/>
    </svg>''', 'brands/nike.webp')

    # 2. Adidas
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#ffffff" flood-opacity="0.2"/></filter>
      </defs>
      <g fill="#ffffff" filter="url(#glow)">
        <polygon points="120,380 180,380 250,260 190,260"/>
        <polygon points="210,380 270,380 350,200 290,200"/>
        <polygon points="300,380 360,380 450,140 390,140"/>
      </g>
    </svg>''', 'brands/adidas.webp')

    # 3. Puma
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <path d="M410,330 C380,280 330,240 250,230 C180,220 120,200 90,170 C120,165 170,185 220,195 C290,205 360,200 400,220 C420,260 430,320 410,330 Z" fill="#ffffff"/>
      <polygon points="90,170 50,210 70,225 110,185" fill="#ffffff"/>
      <polygon points="410,330 380,370 360,350 390,320" fill="#ffffff"/>
    </svg>''', 'brands/puma.webp')

    # 4. Mizuno
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <g fill="#ffffff">
        <path d="M100,280 C200,230 320,230 412,280 C320,250 200,250 100,280 Z"/>
        <path d="M140,310 C220,270 300,270 372,310 C300,285 220,285 140,310 Z"/>
        <polygon points="246,160 266,160 260,360 252,360"/>
      </g>
    </svg>''', 'brands/mizuno.webp')

    # 5. Umbro
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <polygon points="256,100 440,256 256,412 72,256" fill="#ffffff"/>
      <polygon points="256,160 370,256 256,352 142,256" fill="#09090b"/>
      <polygon points="256,190 330,256 256,322 182,256" fill="#ffffff"/>
      <polygon points="256,220 286,256 256,292 226,256" fill="#09090b"/>
    </svg>''', 'brands/umbro.webp')

    # 6. Under Armour
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <path d="M160,200 C160,130 352,130 352,200 L300,200 C300,165 212,165 212,200 Z" fill="#ffffff"/>
      <path d="M160,312 C160,382 352,382 352,312 L300,312 C300,347 212,347 212,312 Z" fill="#ffffff"/>
      <rect x="236" y="180" width="40" height="152" fill="#ffffff"/>
    </svg>''', 'brands/under-armour.webp')

# ==============================================================================
# PATROCINADORES OFICIAIS (SPONSORS)
# ==============================================================================
def gen_sponsors():
    # 1. Betano
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg"><stop offset="0%" stop-color="#ff6b00"/><stop offset="100%" stop-color="#ea580c"/></radialGradient>
      </defs>
      <circle cx="256" cy="256" r="220" fill="url(#bg)"/>
      <rect x="180" y="140" width="40" height="232" rx="10" fill="#ffffff"/>
      <circle cx="280" cy="285" r="70" fill="none" stroke="#ffffff" stroke-width="40"/>
    </svg>''', 'sponsors/betano.webp')

    # 2. Pixbet
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="130" width="432" height="252" rx="40" fill="#090d16" stroke="#10b981" stroke-width="6"/>
      <polygon points="150,256 210,196 270,256 210,316" fill="#10b981"/>
      <polygon points="175,256 210,221 245,256 210,291" fill="#090d16"/>
      <path d="M310,200 L400,200 M310,256 L370,256 M310,312 L400,312" stroke="#38bdf8" stroke-width="26" stroke-linecap="round"/>
    </svg>''', 'sponsors/pixbet.webp')

    # 3. Emirates
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="110" width="432" height="292" rx="36" fill="#dc2626"/>
      <text x="256" y="220" font-family="sans-serif" font-size="64" font-weight="900" fill="#ffffff" text-anchor="middle">Fly</text>
      <text x="256" y="320" font-family="sans-serif" font-size="76" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">Emirates</text>
    </svg>''', 'sponsors/emirates.webp')

    # 4. Red Bull
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="120" fill="#facc15"/>
      <path d="M80,310 C140,260 220,240 250,220 C220,270 160,330 80,310 Z" fill="#e11d48"/>
      <line x1="220" y1="240" x2="245" y2="190" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
      <path d="M432,310 C372,260 292,240 262,220 C292,270 352,330 432,310 Z" fill="#e11d48"/>
      <line x1="292" y1="240" x2="267" y2="190" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    </svg>''', 'sponsors/redbull.webp')

    # 5. Mastercard
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="190" cy="256" r="130" fill="#eb001b"/>
      <circle cx="322" cy="256" r="130" fill="#f79e1b" fill-opacity="0.85"/>
    </svg>''', 'sponsors/mastercard.webp')

    # 6. Heineken
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="120" width="432" height="272" rx="40" fill="#007236"/>
      <polygon points="256,160 278,228 350,228 292,270 314,338 256,296 198,338 220,270 162,228 234,228" fill="#e11d48" stroke="#ffffff" stroke-width="4"/>
    </svg>''', 'sponsors/heineken.webp')

    # 7. Spotify
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="220" fill="#1ed760"/>
      <path d="M120,200 C200,160 320,160 400,200" stroke="#121212" stroke-width="36" stroke-linecap="round" fill="none"/>
      <path d="M140,250 C210,215 310,215 380,250" stroke="#121212" stroke-width="30" stroke-linecap="round" fill="none"/>
      <path d="M165,300 C220,275 300,275 355,300" stroke="#121212" stroke-width="24" stroke-linecap="round" fill="none"/>
    </svg>''', 'sponsors/spotify.webp')

    # 8. Guaraná Antarctica
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="210" fill="#166534" stroke="#eab308" stroke-width="8"/>
      <circle cx="256" cy="256" r="90" fill="#dc2626"/>
      <circle cx="256" cy="256" r="50" fill="#ffffff"/>
      <circle cx="256" cy="256" r="26" fill="#0f172a"/>
    </svg>''', 'sponsors/guarana.webp')

    # 9. Itaú
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="60" width="392" height="392" rx="70" fill="#ec7014" stroke="#0e3591" stroke-width="18"/>
      <rect x="130" y="210" width="252" height="92" rx="20" fill="#0e3591"/>
      <text x="256" y="278" font-family="sans-serif" font-size="56" font-weight="900" fill="#ec7014" text-anchor="middle">Itaú</text>
    </svg>''', 'sponsors/itau.webp')

    # 10. Brahma
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,210 472,170 472,302 40,342" fill="#b91c1c" stroke="#f59e0b" stroke-width="8"/>
      <text x="256" y="275" font-family="sans-serif" font-size="64" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">BRAHMA</text>
    </svg>''', 'sponsors/brahma.webp')

# ==============================================================================
# CHUTEIRAS (BOOTS)
# ==============================================================================
def gen_boot(rel_path, primary_grad, brand_type, accent_color, extra_elements=''):
    svg = f'''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {primary_grad}
        <radialGradient id="soleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="{accent_color}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="{accent_color}" stop-opacity="0" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="{accent_color}" flood-opacity="0.5"/>
        </filter>
      </defs>

      <!-- Brilho de Apoio -->
      <ellipse cx="256" cy="350" rx="210" ry="50" fill="url(#soleGlow)" />

      <!-- Travas Profissionais -->
      <polygon points="120,350 145,350 138,400 115,400" fill="{accent_color}" />
      <polygon points="170,350 195,350 188,400 165,400" fill="{accent_color}" />
      <polygon points="320,350 345,350 338,400 315,400" fill="{accent_color}" />
      <polygon points="370,350 395,350 388,400 365,400" fill="{accent_color}" />
      <polygon points="415,340 435,340 430,385 412,385" fill="{accent_color}" />

      <!-- Placa de Solado -->
      <path d="M85,340 C140,355 240,355 310,345 C380,335 430,330 455,335 C458,345 440,360 400,362 C300,368 180,368 95,358 C75,355 78,342 85,340 Z" fill="#0f172a" stroke="#334155" stroke-width="2" />
      <path d="M110,356 L440,352" stroke="{accent_color}" stroke-width="4" stroke-linecap="round" />

      <!-- Cabedal Anatômico -->
      <path d="M90,340 C80,300 82,230 115,200 C140,175 185,185 220,195 C260,205 320,240 375,270 C420,295 460,318 455,335 C420,330 350,335 310,345 C230,355 140,355 90,340 Z" fill="url(#bootGrad)" stroke="rgba(255,255,255,0.4)" stroke-width="2" />

      <!-- Calcanhar -->
      <path d="M90,340 C80,300 82,230 115,200 C125,225 130,280 135,348 Z" fill="#0f172a" opacity="0.4" />
      <path d="M100,230 C120,250 125,300 120,345" stroke="{accent_color}" stroke-width="4" fill="none" />

      <!-- Cadarço -->
      <line x1="185" y1="195" x2="210" y2="220" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />
      <line x1="205" y1="205" x2="230" y2="230" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />
      <line x1="225" y1="215" x2="250" y2="240" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />

      <!-- Marca Estilizada -->
      {brand_type}

      <!-- Detalhes Extras Específicos -->
      {extra_elements}
    </svg>'''
    render_svg_to_webp(svg, rel_path)

def gen_all_boots():
    # 1. Nike Mercurial Pro
    gen_boot('boots/mercurial-pro.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>',
             '<path d="M190,270 C240,285 300,280 380,240 C350,270 280,305 220,300 C195,298 185,285 190,270 Z" fill="#fde047" filter="url(#glow)"/>',
             '#fde047')

    # 2. Adidas Predator Accuracy
    gen_boot('boots/predator-accuracy.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#18181b"/><stop offset="100%" stop-color="#09090b"/></linearGradient>',
             '''<g fill="#ffffff" filter="url(#glow)">
                  <polygon points="220,220 240,225 210,310 190,305"/>
                  <polygon points="250,230 270,235 240,315 220,310"/>
                  <polygon points="280,240 300,245 270,320 250,315"/>
                </g>''',
             '#e11d48',
             '''<g fill="#e11d48">
                  <polygon points="340,265 350,260 355,275"/>
                  <polygon points="360,275 370,270 375,285"/>
                  <polygon points="380,285 390,280 395,295"/>
                  <polygon points="400,295 410,290 415,305"/>
                </g>''')

    # 3. Puma Future Ultimate
    gen_boot('boots/future-ultimate.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#3730a3"/></linearGradient>',
             '<path d="M210,290 C260,310 330,270 360,250 C320,290 260,320 210,290 Z" fill="#f97316" filter="url(#glow)"/>',
             '#f97316',
             '<path d="M260,205 C290,235 300,295 300,345" stroke="#f97316" stroke-width="8" fill="none"/>')

    # 4. Mizuno Morelia Neo IV
    gen_boot('boots/morelia-neo.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#e4e4e7"/></linearGradient>',
             '<polygon points="230,280 280,250 330,280 280,265" fill="#dc2626" filter="url(#glow)"/>',
             '#dc2626',
             '<path d="M140,250 C240,240 340,270 420,310" stroke="#d4d4d8" stroke-width="2" fill="none"/>')

    # 5. Umbro Speciali Clássica
    gen_boot('boots/speciali-classica.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#27272a"/><stop offset="100%" stop-color="#09090b"/></linearGradient>',
             '<polygon points="250,275 285,255 320,275 285,295" fill="#ffffff" filter="url(#glow)"/>',
             '#ffffff',
             '<path d="M120,230 L160,200 L180,240 Z" fill="#ffffff"/>')

    # 6. Fênix Carbono Elite
    gen_boot('boots/fenix-carbono.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#27272a"/><stop offset="50%" stop-color="#18181b"/><stop offset="100%" stop-color="#09090b"/></linearGradient>',
             '<path d="M180,310 Q250,240 330,270 Q260,280 200,320 Z" fill="#f59e0b" filter="url(#glow)"/>',
             '#f59e0b',
             '''<g stroke="#f59e0b" stroke-width="2" opacity="0.6">
                  <line x1="200" y1="230" x2="350" y2="300"/>
                  <line x1="220" y1="210" x2="370" y2="280"/>
                </g>''')

    # 7. Coroa Imperial Dourada (Lendária)
    gen_boot('boots/coroa-imperial.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#eab308"/><stop offset="100%" stop-color="#ca8a04"/></linearGradient>',
             '<polygon points="220,290 250,250 270,270 290,250 320,290" fill="#ffffff" filter="url(#glow)"/>',
             '#fef08a',
             '<circle cx="270" cy="240" r="12" fill="#ffffff" filter="url(#glow)"/>')

    # 8. Canhão PowerStrike
    gen_boot('boots/canhao-powerstrike.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></linearGradient>',
             '<path d="M190,270 C240,285 300,280 380,240 C350,270 280,305 220,300 Z" fill="#ffffff"/>',
             '#f87171',
             '<rect x="360" y="270" width="70" height="40" rx="10" fill="#7f1d1d" opacity="0.8"/>')

    # 9. Relâmpago Speed
    gen_boot('boots/relampago-speed.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#facc15"/><stop offset="100%" stop-color="#eab308"/></linearGradient>',
             '<polygon points="260,220 230,270 270,270 240,320 310,260 270,260" fill="#a855f7" filter="url(#glow)"/>',
             '#a855f7')

    # 10. Ginga Street
    gen_boot('boots/ginga-street.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>',
             '<path d="M190,270 Q280,240 370,280 Q280,300 200,290 Z" fill="#10b981" filter="url(#glow)"/>',
             '#f43f5e',
             '<circle cx="340" cy="270" r="16" fill="#f43f5e"/>')

    # 11. Paredão GK
    gen_boot('boots/paredao-gk.webp',
             '<linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#065f46"/></linearGradient>',
             '<polygon points="210,260 260,240 310,270 270,290" fill="#cbd5e1" filter="url(#glow)"/>',
             '#10b981',
             '<rect x="320" y="260" width="80" height="50" rx="8" fill="#334155" opacity="0.7"/>')

# ==============================================================================
# BOLAS COM FÍSICA E TEXTURAS (BALLS)
# ==============================================================================
def gen_all_balls():
    # 1. Capotão Clássica
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sphere" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="70%" stop-color="#e4e4e7"/>
          <stop offset="100%" stop-color="#71717a"/>
        </radialGradient>
      </defs>
      <circle cx="256" cy="256" r="200" fill="url(#sphere)" stroke="#27272a" stroke-width="4"/>
      <!-- Pentágono Preto Central -->
      <polygon points="256,180 320,230 295,305 217,305 192,230" fill="#18181b"/>
      <!-- Gomos conectados -->
      <line x1="256" y1="180" x2="256" y2="80" stroke="#18181b" stroke-width="6"/>
      <line x1="320" y1="230" x2="410" y2="190" stroke="#18181b" stroke-width="6"/>
      <line x1="295" y1="305" x2="360" y2="390" stroke="#18181b" stroke-width="6"/>
      <line x1="217" y1="305" x2="152" y2="390" stroke="#18181b" stroke-width="6"/>
      <line x1="192" y1="230" x2="102" y2="190" stroke="#18181b" stroke-width="6"/>
    </svg>''', 'balls/capotao-classica.webp')

    # 2. Jabulani (Caos 2010)
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sphere" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="80%" stop-color="#f4f4f5"/><stop offset="100%" stop-color="#a1a1aa"/>
        </radialGradient>
      </defs>
      <circle cx="256" cy="256" r="200" fill="url(#sphere)" stroke="#3f3f46" stroke-width="4"/>
      <!-- Painéis Triangulares Aerodinâmicos da Jabulani -->
      <path d="M256,100 C320,160 320,250 256,310 C192,250 192,160 256,100 Z" fill="#eab308"/>
      <circle cx="256" cy="205" r="30" fill="#dc2626"/>
      <path d="M120,256 C180,320 270,320 330,256 C270,192 180,192 120,256 Z" fill="#2563eb" opacity="0.8"/>
      <path d="M256,200 C350,250 350,350 256,410 C162,350 162,250 256,200 Z" fill="#16a34a" opacity="0.8"/>
    </svg>''', 'balls/jabulani.webp')

    # 3. Brazuca (Brasilidade Pro)
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sphere" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="80%" stop-color="#f4f4f5"/><stop offset="100%" stop-color="#a1a1aa"/>
        </radialGradient>
      </defs>
      <circle cx="256" cy="256" r="200" fill="url(#sphere)" stroke="#1e293b" stroke-width="4"/>
      <path d="M100,200 C150,120 300,120 380,220 C320,320 200,320 120,400" stroke="#2563eb" stroke-width="26" fill="none" stroke-linecap="round"/>
      <path d="M140,160 C220,100 350,150 410,260 C360,350 250,380 180,430" stroke="#16a34a" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M170,130 C250,80 380,130 430,240" stroke="#eab308" stroke-width="16" fill="none" stroke-linecap="round"/>
    </svg>''', 'balls/brazuca.webp')

    # 4. Bola Laranja Neve
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="orangeSphere" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#fb923c"/><stop offset="70%" stop-color="#ea580c"/><stop offset="100%" stop-color="#9a3412"/>
        </radialGradient>
      </defs>
      <circle cx="256" cy="256" r="200" fill="url(#orangeSphere)" stroke="#7c2d12" stroke-width="4"/>
      <polygon points="256,180 320,230 295,305 217,305 192,230" fill="#18181b"/>
      <circle cx="256" cy="256" r="40" fill="#fde047"/>
    </svg>''', 'balls/laranja-neve.webp')

    # 5. Meteoro de Fogo
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="magma" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#fef08a"/><stop offset="40%" stop-color="#f97316"/><stop offset="80%" stop-color="#dc2626"/><stop offset="100%" stop-color="#450a0a"/>
        </radialGradient>
        <filter id="fireGlow"><feGaussianBlur stdDeviation="8" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
      </defs>
      <circle cx="256" cy="256" r="200" fill="url(#magma)" filter="url(#fireGlow)"/>
      <path d="M120,200 Q220,180 256,256 Q300,320 400,280" stroke="#fef08a" stroke-width="12" fill="none"/>
      <path d="M180,340 Q256,300 320,380" stroke="#fdba74" stroke-width="8" fill="none"/>
    </svg>''', 'balls/meteoro-fogo.webp')

    # 6. Cyber Neon
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cyber" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#18181b"/><stop offset="100%" stop-color="#09090b"/>
        </radialGradient>
      </defs>
      <circle cx="256" cy="256" r="200" fill="url(#cyber)" stroke="#06b6d4" stroke-width="6"/>
      <circle cx="256" cy="256" r="140" fill="none" stroke="#ec4899" stroke-width="6" stroke-dasharray="16,8"/>
      <polygon points="256,180 320,230 295,305 217,305 192,230" fill="none" stroke="#06b6d4" stroke-width="8"/>
      <line x1="256" y1="56" x2="256" y2="456" stroke="#06b6d4" stroke-width="4"/>
      <line x1="56" y1="256" x2="456" y2="256" stroke="#ec4899" stroke-width="4"/>
    </svg>''', 'balls/cyber-neon.webp')

    # 7. Bola de Ouro (Ballon d'Or)
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="goldSphere" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#fde047"/><stop offset="70%" stop-color="#ca8a04"/><stop offset="100%" stop-color="#713f12"/>
        </radialGradient>
      </defs>
      <circle cx="256" cy="256" r="200" fill="url(#goldSphere)" stroke="#ca8a04" stroke-width="4"/>
      <polygon points="256,170 325,220 300,305 212,305 187,220" fill="none" stroke="#fef08a" stroke-width="6"/>
      <circle cx="200" cy="180" r="30" fill="#ffffff" opacity="0.6"/>
    </svg>''', 'balls/bola-de-ouro.webp')

    # 8. Bola de Várzea
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="leather" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#92400e"/><stop offset="80%" stop-color="#78350f"/><stop offset="100%" stop-color="#451a03"/>
        </radialGradient>
      </defs>
      <circle cx="256" cy="256" r="200" fill="url(#leather)" stroke="#451a03" stroke-width="6"/>
      <!-- Costuras cruzadas clássicas -->
      <path d="M160,180 L352,180 M140,256 L372,256 M160,332 L352,332" stroke="#b45309" stroke-width="8" stroke-dasharray="14,10"/>
      <line x1="256" y1="120" x2="256" y2="392" stroke="#451a03" stroke-width="6"/>
    </svg>''', 'balls/bola-de-varzea.webp')

# ==============================================================================
# TROFÉUS OFICIAIS (TROPHIES)
# ==============================================================================
def gen_all_trophies():
    # 1. Copa do Mundo
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#eab308"/><stop offset="100%" stop-color="#a16207"/>
        </linearGradient>
      </defs>
      <!-- Base com malaquita -->
      <rect x="170" y="420" width="172" height="50" rx="8" fill="#ca8a04"/>
      <rect x="170" y="435" width="172" height="10" fill="#15803d"/>
      <rect x="170" y="455" width="172" height="10" fill="#15803d"/>
      <!-- Corpo espiralado -->
      <polygon points="200,420 220,210 292,210 312,420" fill="url(#gold)"/>
      <!-- Globo terrestre -->
      <circle cx="256" cy="150" r="70" fill="url(#gold)" stroke="#ca8a04" stroke-width="4"/>
      <path d="M200,150 Q256,110 312,150 Q256,190 200,150" fill="none" stroke="#ca8a04" stroke-width="6"/>
    </svg>''', 'trophies/copa-do-mundo.webp')

    # 2. Champions League
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#e4e4e7"/><stop offset="100%" stop-color="#a1a1aa"/>
        </linearGradient>
      </defs>
      <rect x="180" y="430" width="152" height="40" rx="6" fill="#71717a"/>
      <rect x="236" y="370" width="40" height="60" fill="url(#silver)"/>
      <polygon points="160,150 352,150 320,370 192,370" fill="url(#silver)" stroke="#71717a" stroke-width="4"/>
      <!-- Orelhas grandes -->
      <path d="M160,170 C80,180 80,310 192,330" fill="none" stroke="url(#silver)" stroke-width="20" stroke-linecap="round"/>
      <path d="M352,170 C432,180 432,310 320,330" fill="none" stroke="url(#silver)" stroke-width="20" stroke-linecap="round"/>
    </svg>''', 'trophies/champions-league.webp')

    # 3. Libertadores
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect x="170" y="250" width="172" height="220" rx="10" fill="#78350f" stroke="#451a03" stroke-width="4"/>
      <!-- Placas douradas dos campeões -->
      <g fill="#facc15">
        <rect x="185" y="270" width="35" height="25" rx="3"/>
        <rect x="238" y="270" width="35" height="25" rx="3"/>
        <rect x="291" y="270" width="35" height="25" rx="3"/>
        <rect x="185" y="320" width="35" height="25" rx="3"/>
        <rect x="238" y="320" width="35" height="25" rx="3"/>
        <rect x="291" y="320" width="35" height="25" rx="3"/>
        <rect x="185" y="370" width="35" height="25" rx="3"/>
        <rect x="238" y="370" width="35" height="25" rx="3"/>
        <rect x="291" y="370" width="35" height="25" rx="3"/>
      </g>
      <!-- Bojo prateado e estatueta -->
      <circle cx="256" cy="180" r="70" fill="#e4e4e7" stroke="#a1a1aa" stroke-width="4"/>
      <circle cx="256" cy="70" r="16" fill="#facc15"/>
      <line x1="256" y1="86" x2="256" y2="110" stroke="#facc15" stroke-width="8"/>
    </svg>''', 'trophies/libertadores.webp')

    # 4. Brasileirão Série A
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect x="170" y="420" width="172" height="50" rx="8" fill="#27272a"/>
      <!-- Arco dourado -->
      <path d="M150,420 C150,120 362,120 362,420" fill="none" stroke="#eab308" stroke-width="32" stroke-linecap="round"/>
      <!-- Esfera verde e amarela -->
      <circle cx="256" cy="230" r="50" fill="#16a34a" stroke="#eab308" stroke-width="8"/>
      <circle cx="256" cy="230" r="24" fill="#eab308"/>
    </svg>''', 'trophies/brasileirao-serie-a.webp')

    # 5. Copa do Brasil
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect x="180" y="420" width="152" height="50" rx="6" fill="#71717a"/>
      <polygon points="170,150 342,150 290,420 222,420" fill="#e4e4e7" stroke="#ca8a04" stroke-width="4"/>
      <path d="M185,250 L327,250" stroke="#16a34a" stroke-width="18"/>
      <path d="M185,275 L327,275" stroke="#eab308" stroke-width="12"/>
    </svg>''', 'trophies/copa-do-brasil.webp')

    # 6. Ballon d'Or / The Best
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gold" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="40%" stop-color="#fde047"/><stop offset="80%" stop-color="#ca8a04"/><stop offset="100%" stop-color="#713f12"/>
        </radialGradient>
      </defs>
      <!-- Base de rocha escura -->
      <polygon points="140,470 170,330 342,330 372,470" fill="#18181b" stroke="#ca8a04" stroke-width="4"/>
      <!-- Grande esfera de ouro -->
      <circle cx="256" cy="190" r="110" fill="url(#gold)" stroke="#ca8a04" stroke-width="4"/>
      <circle cx="220" cy="150" r="26" fill="#ffffff" opacity="0.6"/>
    </svg>''', 'trophies/bola-de-ouro.webp')

    # 7. Copinha Sub-20
    render_svg_to_webp('''<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect x="180" y="420" width="152" height="50" rx="6" fill="#d4d4d8"/>
      <polygon points="160,160 352,160 300,380 212,380" fill="#f59e0b" stroke="#b45309" stroke-width="4"/>
      <polygon points="256,220 268,255 305,255 275,277 286,312 256,290 226,312 237,277 207,255 244,255" fill="#ffffff"/>
    </svg>''', 'trophies/copinha-sub20.webp')

def main():
    print("Gerando Marcas Esportivas...")
    gen_brands()
    print("Gerando Patrocinadores...")
    gen_sponsors()
    print("Gerando Chuteiras de Alta Performance...")
    gen_all_boots()
    print("Gerando Bolas com Texturas Realistas...")
    gen_all_balls()
    print("Gerando Troféus Oficiais...")
    gen_all_trophies()
    print("CONCLUÍDO COM SUCESSO!")

if __name__ == '__main__':
    main()
