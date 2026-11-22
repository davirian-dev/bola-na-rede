#!/usr/bin/env python3
"""
Gerador de Assets Oficiais do Bola na Rede: Carreira
Cria imagens .webp otimizadas (qualidade 85, 512x512) com transparência e alta fidelidade visual:
- Marcas Esportivas Oficiais (Nike, Adidas, Puma, Mizuno, Umbro, Under Armour)
- Patrocinadores Oficiais (Betano, Pixbet, Emirates, Red Bull, Mastercard, Heineken, Spotify, Guaraná, Itaú, Brahma)
- Chuteiras com design real e lendário (11 modelos)
- Bolas com texturas e efeitos 3D (8 modelos)
- Troféus Oficiais de Competições (7 taças)
"""

import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, 'public', 'images')

def ensure_dirs():
    for sub in ['brands', 'sponsors', 'boots', 'balls', 'trophies']:
        os.makedirs(os.path.join(IMG_DIR, sub), exist_ok=True)

def save_webp(image: Image.Image, rel_path: str):
    full_path = os.path.join(IMG_DIR, rel_path)
    image.save(full_path, 'WEBP', quality=85, method=6)
    print(f"Salvo: {rel_path} ({os.path.getsize(full_path)} bytes)")

# ==============================================================================
# 1. MARCAS ESPORTIVAS (BRANDS)
# ==============================================================================
def create_brand_nike():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Swoosh da Nike em curva suave e elegante
    points = [
        (90, 290), (140, 340), (220, 370), (320, 350), 
        (450, 200), (460, 185), (445, 195), (315, 305), 
        (220, 320), (145, 290), (90, 290)
    ]
    # Sombra
    shadow_pts = [(x, y + 8) for x, y in points]
    draw.polygon(shadow_pts, fill=(0, 0, 0, 120))
    # Swoosh branco sólido com leve degradê
    draw.polygon(points, fill=(255, 255, 255, 255))
    save_webp(img, 'brands/nike.webp')

def create_brand_adidas():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # 3 barras diagonais clássicas
    bars = [
        # (x, y, w, h)
        [(140, 330), (185, 330), (245, 220), (200, 220)], # Barra 1 (baixa)
        [(210, 330), (255, 330), (330, 160), (285, 160)], # Barra 2 (média)
        [(280, 330), (325, 330), (415, 100), (370, 100)], # Barra 3 (alta)
    ]
    for bar in bars:
        s_bar = [(x, y + 8) for x, y in bar]
        draw.polygon(s_bar, fill=(0, 0, 0, 120))
        draw.polygon(bar, fill=(255, 255, 255, 255))
    save_webp(img, 'brands/adidas.webp')

def create_brand_puma():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Felino Puma saltando para a esquerda
    pts = [
        (380, 350), (360, 300), (320, 270), (250, 250), (190, 230),
        (130, 210), (110, 180), (135, 175), (170, 195), (220, 205),
        (280, 215), (340, 210), (390, 225), (410, 270), (420, 340), (380, 350)
    ]
    draw.polygon([(x, y + 6) for x, y in pts], fill=(0, 0, 0, 100))
    draw.polygon(pts, fill=(255, 255, 255, 255))
    # Pata dianteira estendida
    draw.polygon([(110, 180), (70, 220), (85, 230), (125, 195)], fill=(255, 255, 255, 255))
    save_webp(img, 'brands/puma.webp')

def create_brand_mizuno():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Runbird da Mizuno (asas dinâmicas cruzadas)
    wing1 = [(120, 260), (260, 210), (400, 260), (260, 230)]
    wing2 = [(160, 290), (260, 240), (360, 290), (260, 255)]
    body = [(250, 170), (270, 170), (265, 340), (255, 340)]
    draw.polygon(wing1, fill=(255, 255, 255, 255))
    draw.polygon(wing2, fill=(255, 255, 255, 255))
    draw.polygon(body, fill=(255, 255, 255, 255))
    save_webp(img, 'brands/mizuno.webp')

def create_brand_umbro():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Duplo diamante clássico
    # Diamante externo
    ext = [(256, 120), (430, 256), (256, 392), (82, 256)]
    # Furo do diamante externo
    hole1 = [(256, 170), (370, 256), (256, 342), (142, 256)]
    # Diamante interno
    inte = [(256, 200), (330, 256), (256, 312), (182, 256)]
    # Furo interno
    hole2 = [(256, 230), (290, 256), (256, 282), (222, 256)]
    
    draw.polygon(ext, fill=(255, 255, 255, 255))
    draw.polygon(hole1, fill=(0, 0, 0, 0))
    draw.polygon(inte, fill=(255, 255, 255, 255))
    draw.polygon(hole2, fill=(0, 0, 0, 0))
    save_webp(img, 'brands/umbro.webp')

def create_brand_under_armour():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Monograma UA entrelaçado
    draw.arc([160, 140, 352, 332], start=180, end=0, fill=(255, 255, 255, 255), width=28)
    draw.arc([160, 180, 352, 372], start=0, end=180, fill=(255, 255, 255, 255), width=28)
    save_webp(img, 'brands/under-armour.webp')

# ==============================================================================
# 2. PATROCINADORES OFICIAIS (SPONSORS)
# ==============================================================================
def create_sponsor_betano():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Círculo laranja característico com o 'B' vazado
    draw.ellipse([80, 80, 432, 432], fill=(249, 115, 22, 255))
    # 'b' moderno estilizado
    draw.rectangle([180, 160, 220, 360], fill=(255, 255, 255, 255))
    draw.ellipse([180, 220, 330, 360], outline=(255, 255, 255, 255), width=36)
    save_webp(img, 'sponsors/betano.webp')

def create_sponsor_pixbet():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Fundo estilizado com losango e tipografia
    draw.rounded_rectangle([60, 140, 452, 372], radius=40, fill=(15, 23, 42, 255), outline=(16, 185, 129, 255), width=8)
    # Losango PIX verde
    pts = [(160, 256), (220, 196), (280, 256), (220, 316)]
    draw.polygon(pts, fill=(16, 185, 129, 255))
    pts_inner = [(185, 256), (220, 221), (255, 256), (220, 291)]
    draw.polygon(pts_inner, fill=(15, 23, 42, 255))
    # Barras 'BET' azul celeste
    draw.rectangle([310, 210, 410, 240], fill=(56, 189, 248, 255))
    draw.rectangle([310, 250, 380, 275], fill=(56, 189, 248, 255))
    draw.rectangle([310, 285, 410, 310], fill=(56, 189, 248, 255))
    save_webp(img, 'sponsors/pixbet.webp')

def create_sponsor_emirates():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Fundo vermelho Fly Emirates
    draw.rounded_rectangle([50, 120, 462, 392], radius=32, fill=(220, 38, 38, 255))
    # Tipografia branca representativa
    # 'Fly'
    draw.rectangle([100, 170, 130, 240], fill=(255, 255, 255, 255))
    draw.rectangle([130, 170, 180, 195], fill=(255, 255, 255, 255))
    draw.rectangle([130, 205, 165, 225], fill=(255, 255, 255, 255))
    # 'Emirates'
    draw.rectangle([100, 270, 412, 295], fill=(255, 255, 255, 255))
    draw.rectangle([100, 320, 412, 345], fill=(255, 255, 255, 255))
    save_webp(img, 'sponsors/emirates.webp')

def create_sponsor_redbull():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Sol dourado
    draw.ellipse([156, 156, 356, 356], fill=(250, 204, 21, 255))
    # Touro Esquerdo (vermelho)
    t1 = [(80, 320), (140, 270), (220, 250), (250, 230), (210, 290), (140, 340)]
    draw.polygon(t1, fill=(225, 29, 72, 255))
    # Chifre
    draw.line([(220, 250), (240, 200)], fill=(255, 255, 255, 255), width=6)
    # Touro Direito (vermelho)
    t2 = [(432, 320), (372, 270), (292, 250), (262, 230), (302, 290), (372, 340)]
    draw.polygon(t2, fill=(225, 29, 72, 255))
    # Chifre
    draw.line([(292, 250), (272, 200)], fill=(255, 255, 255, 255), width=6)
    save_webp(img, 'sponsors/redbull.webp')

def create_sponsor_mastercard():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Círculo Esquerdo Vermelho
    draw.ellipse([90, 136, 330, 376], fill=(235, 0, 27, 230))
    # Círculo Direito Amarelo / Dourado com blend
    overlay = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    d_over = ImageDraw.Draw(overlay)
    d_over.ellipse([182, 136, 422, 376], fill=(247, 158, 27, 230))
    img = Image.alpha_composite(img, overlay)
    save_webp(img, 'sponsors/mastercard.webp')

def create_sponsor_heineken():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Fundo verde icônico
    draw.rounded_rectangle([60, 130, 452, 382], radius=40, fill=(2, 114, 53, 255))
    # Estrela vermelha de cinco pontas
    cx, cy = 256, 256
    r_out, r_in = 75, 32
    pts = []
    for i in range(10):
        angle = i * (math.pi / 5) - math.pi / 2
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(pts, fill=(220, 38, 38, 255), outline=(255, 255, 255, 255), width=4)
    save_webp(img, 'sponsors/heineken.webp')

def create_sponsor_spotify():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Círculo verde Spotify
    draw.ellipse([80, 80, 432, 432], fill=(30, 215, 96, 255))
    # 3 ondas sonoras pretas
    draw.arc([130, 140, 390, 380], start=195, end=335, fill=(18, 18, 18, 255), width=32)
    draw.arc([150, 180, 370, 390], start=195, end=335, fill=(18, 18, 18, 255), width=28)
    draw.arc([170, 220, 350, 400], start=195, end=335, fill=(18, 18, 18, 255), width=24)
    save_webp(img, 'sponsors/spotify.webp')

def create_sponsor_guarana():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Folha verde
    draw.ellipse([120, 120, 392, 392], fill=(22, 101, 52, 255))
    # Baga do Guaraná (fruto vermelho)
    draw.ellipse([180, 180, 332, 332], fill=(220, 38, 38, 255))
    # Pupila/semente negra com branco (olho do guaraná)
    draw.ellipse([216, 216, 296, 296], fill=(255, 255, 255, 255))
    draw.ellipse([236, 236, 276, 276], fill=(15, 23, 42, 255))
    save_webp(img, 'sponsors/guarana.webp')

def create_sponsor_itau():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Cubo Itaú laranja com contorno azul
    draw.rounded_rectangle([70, 70, 442, 442], radius=60, fill=(236, 112, 20, 255), outline=(14, 53, 145, 255), width=18)
    # Faixa azul central
    draw.rounded_rectangle([130, 210, 382, 302], radius=20, fill=(14, 53, 145, 255))
    save_webp(img, 'sponsors/itau.webp')

def create_sponsor_brahma():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Faixa vermelha e dourada
    draw.polygon([(60, 200), (452, 160), (452, 312), (60, 352)], fill=(185, 28, 28, 255))
    draw.polygon([(80, 215), (432, 175), (432, 297), (80, 337)], outline=(245, 158, 11, 255), width=6)
    save_webp(img, 'sponsors/brahma.webp')

# ==============================================================================
# 3. CHUTEIRAS (BOOTS - 11 MODELOS)
# ==============================================================================
def draw_base_cleat(draw, upper_color, sole_color, accent_color, brand_style='nike'):
    # Sola e travas
    draw.polygon([(80, 350), (430, 350), (440, 365), (70, 365)], fill=sole_color)
    # 4 travas na frente, 2 atrás
    cleat_pts = [
        [(90, 365), (105, 365), (100, 395), (85, 395)],
        [(130, 365), (145, 365), (140, 395), (125, 395)],
        [(360, 365), (375, 365), (370, 395), (355, 395)],
        [(400, 365), (415, 365), (410, 395), (395, 395)],
    ]
    for cp in cleat_pts:
        draw.polygon(cp, fill=accent_color)
    
    # Cabedal aerodinâmico da chuteira
    cabedal = [
        (80, 350), (70, 300), (95, 240), (150, 230), (220, 220), 
        (300, 260), (380, 280), (440, 320), (430, 350)
    ]
    draw.polygon(cabedal, fill=upper_color)

    # Detalhe de calcanhar
    draw.polygon([(70, 300), (95, 240), (130, 250), (80, 350)], fill=accent_color)

    # Cadarço e língua
    draw.line([(150, 230), (240, 260)], fill=(255, 255, 255, 200), width=4)
    draw.line([(170, 235), (250, 270)], fill=(255, 255, 255, 200), width=4)
    draw.line([(190, 240), (260, 280)], fill=(255, 255, 255, 200), width=4)

    # Símbolo da marca estilizado na lateral
    if brand_style == 'nike':
        swoosh = [(180, 290), (260, 290), (340, 250), (280, 310), (180, 290)]
        draw.polygon(swoosh, fill=accent_color)
    elif brand_style == 'adidas':
        draw.line([(220, 260), (200, 330)], fill=accent_color, width=12)
        draw.line([(250, 260), (230, 330)], fill=accent_color, width=12)
        draw.line([(280, 260), (260, 330)], fill=accent_color, width=12)
    elif brand_style == 'puma':
        puma_line = [(150, 280), (230, 300), (330, 270), (280, 320)]
        draw.polygon(puma_line, fill=accent_color)
    elif brand_style == 'mizuno':
        draw.polygon([(200, 300), (260, 270), (310, 300), (260, 285)], fill=accent_color)
    elif brand_style == 'umbro':
        draw.polygon([(240, 285), (275, 265), (310, 285), (275, 305)], fill=accent_color)
    elif brand_style == 'fenix':
        draw.polygon([(180, 310), (270, 250), (330, 300), (270, 270)], fill=(245, 158, 11, 255))
    elif brand_style == 'gold':
        draw.polygon([(180, 290), (240, 240), (280, 270), (320, 240), (300, 320)], fill=(255, 255, 255, 255))

def create_all_boots():
    boots_data = [
        ('boots/mercurial-pro.webp', (2, 132, 199, 255), (15, 23, 42, 255), (250, 204, 21, 255), 'nike'),
        ('boots/predator-accuracy.webp', (24, 24, 27, 255), (225, 29, 72, 255), (255, 255, 255, 255), 'adidas'),
        ('boots/future-ultimate.webp', (79, 70, 229, 255), (249, 115, 22, 255), (249, 115, 22, 255), 'puma'),
        ('boots/morelia-neo.webp', (244, 244, 245, 255), (220, 38, 38, 255), (220, 38, 38, 255), 'mizuno'),
        ('boots/speciali-classica.webp', (18, 18, 18, 255), (244, 244, 245, 255), (244, 244, 245, 255), 'umbro'),
        ('boots/fenix-carbono.webp', (39, 39, 42, 255), (217, 119, 6, 255), (245, 158, 11, 255), 'fenix'),
        ('boots/coroa-imperial.webp', (234, 179, 8, 255), (202, 138, 4, 255), (254, 240, 138, 255), 'gold'),
        ('boots/canhao-powerstrike.webp', (185, 28, 28, 255), (15, 23, 42, 255), (254, 202, 202, 255), 'nike'),
        ('boots/relampago-speed.webp', (234, 179, 8, 255), (126, 34, 206, 255), (168, 85, 247, 255), 'nike'),
        ('boots/ginga-street.webp', (30, 41, 59, 255), (16, 185, 129, 255), (244, 63, 94, 255), 'puma'),
        ('boots/paredao-gk.webp', (5, 150, 105, 255), (71, 85, 105, 255), (203, 213, 225, 255), 'adidas'),
    ]
    for rel_path, upper, sole, accent, style in boots_data:
        img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw_base_cleat(draw, upper, sole, accent, style)
        save_webp(img, rel_path)

# ==============================================================================
# 4. BOLAS COM TEXTURAS E FÍSICA (BALLS - 8 MODELOS)
# ==============================================================================
def create_ball_capotao():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Esfera base
    draw.ellipse([56, 56, 456, 456], fill=(244, 244, 245, 255), outline=(24, 24, 27, 255), width=6)
    # Pentágono preto central
    cx, cy = 256, 256
    pts = []
    for i in range(5):
        ang = i * (2 * math.pi / 5) - math.pi / 2
        pts.append((cx + 70 * math.cos(ang), cy + 70 * math.sin(ang)))
    draw.polygon(pts, fill=(24, 24, 27, 255))
    # Linhas de gomos radiais
    for p in pts:
        dx = (p[0] - cx) * 1.8 + cx
        dy = (p[1] - cy) * 1.8 + cy
        draw.line([p, (dx, dy)], fill=(24, 24, 27, 255), width=5)
    save_webp(img, 'balls/capotao-classica.webp')

def create_ball_jabulani():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([56, 56, 456, 456], fill=(255, 255, 255, 255), outline=(39, 39, 42, 255), width=5)
    # Painéis triangulares coloridos da África do Sul 2010
    colors = [(234, 179, 8), (220, 38, 38), (37, 99, 235), (22, 163, 74)]
    for i, col in enumerate(colors):
        ang = i * (math.pi / 2)
        x = 256 + 110 * math.cos(ang)
        y = 256 + 110 * math.sin(ang)
        draw.ellipse([x - 50, y - 50, x + 50, y + 50], outline=col, width=14)
    save_webp(img, 'balls/jabulani.webp')

def create_ball_brazuca():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([56, 56, 456, 456], fill=(255, 255, 255, 255), outline=(30, 41, 59, 255), width=5)
    # Ondas curvas da Brazuca 2014 (verde, azul e ouro)
    draw.arc([80, 80, 432, 432], start=45, end=225, fill=(37, 99, 235, 255), width=24)
    draw.arc([100, 100, 412, 412], start=225, end=405, fill=(22, 163, 74, 255), width=24)
    draw.arc([130, 130, 382, 382], start=0, end=180, fill=(234, 179, 8, 255), width=18)
    save_webp(img, 'balls/brazuca.webp')

def create_ball_laranja():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([56, 56, 456, 456], fill=(249, 115, 22, 255), outline=(194, 65, 12, 255), width=6)
    # Gomos em preto e amarelo neon para jogo na chuva
    draw.arc([80, 80, 432, 432], start=30, end=150, fill=(24, 24, 27, 255), width=16)
    draw.arc([80, 80, 432, 432], start=210, end=330, fill=(250, 204, 21, 255), width=16)
    save_webp(img, 'balls/laranja-neve.webp')

def create_ball_meteoro():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Esfera de magma vulcânico
    draw.ellipse([56, 56, 456, 456], fill=(153, 27, 27, 255), outline=(245, 158, 11, 255), width=8)
    # Fissuras de fogo incandescente
    draw.line([(100, 160), (220, 240), (200, 350)], fill=(250, 204, 21, 255), width=10)
    draw.line([(220, 240), (380, 200), (420, 310)], fill=(251, 146, 60, 255), width=8)
    draw.line([(160, 380), (320, 340), (370, 410)], fill=(254, 240, 138, 255), width=6)
    save_webp(img, 'balls/meteoro-fogo.webp')

def create_ball_cyber():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Esfera preta cyber
    draw.ellipse([56, 56, 456, 456], fill=(9, 9, 11, 255), outline=(6, 182, 212, 255), width=8)
    # Circuitos neon ciano e magenta
    draw.ellipse([120, 120, 392, 392], outline=(6, 182, 212, 255), width=6)
    draw.ellipse([180, 180, 332, 332], outline=(236, 72, 153, 255), width=6)
    draw.line([(256, 56), (256, 456)], fill=(6, 182, 212, 255), width=4)
    draw.line([(56, 256), (456, 256)], fill=(236, 72, 153, 255), width=4)
    save_webp(img, 'balls/cyber-neon.webp')

def create_ball_ouro():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Esfera dourada metálica
    draw.ellipse([56, 56, 456, 456], fill=(234, 179, 8, 255), outline=(202, 138, 4, 255), width=8)
    # Gomos geométricos cinzelados em ouro reluzente
    cx, cy = 256, 256
    pts = []
    for i in range(5):
        ang = i * (2 * math.pi / 5) - math.pi / 2
        pts.append((cx + 80 * math.cos(ang), cy + 80 * math.sin(ang)))
    draw.polygon(pts, outline=(254, 240, 138, 255), width=6)
    # Brilho estelar
    draw.ellipse([140, 120, 200, 180], fill=(255, 255, 255, 220))
    save_webp(img, 'balls/bola-de-ouro.webp')

def create_ball_varzea():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Couro marrom rústico envelhecido
    draw.ellipse([56, 56, 456, 456], fill=(120, 53, 15, 255), outline=(69, 26, 3, 255), width=8)
    # Costuras grossas em X
    for y in [180, 256, 330]:
        for x in [160, 230, 300]:
            draw.line([(x - 12, y - 12), (x + 12, y + 12)], fill=(217, 119, 6, 255), width=5)
            draw.line([(x + 12, y - 12), (x - 12, y + 12)], fill=(217, 119, 6, 255), width=5)
    save_webp(img, 'balls/bola-de-varzea.webp')

# ==============================================================================
# 5. TROFÉUS OFICIAIS (TROPHIES - 7 TAÇAS)
# ==============================================================================
def create_trophy_copa_mundo():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Base circular dourada com faixas verdes de malaquita
    draw.rectangle([170, 420, 342, 470], fill=(202, 138, 4, 255))
    draw.rectangle([170, 435, 342, 445], fill=(22, 101, 52, 255))
    draw.rectangle([170, 455, 342, 465], fill=(22, 101, 52, 255))
    # Corpo espiralado de ouro
    draw.polygon([(200, 420), (220, 220), (292, 220), (312, 420)], fill=(234, 179, 8, 255))
    # Globo terrestre sustentado no topo
    draw.ellipse([186, 90, 326, 230], fill=(250, 204, 21, 255), outline=(202, 138, 4, 255), width=6)
    draw.arc([196, 100, 316, 220], start=30, end=150, fill=(202, 138, 4, 255), width=8)
    save_webp(img, 'trophies/copa-do-mundo.webp')

def create_trophy_champions():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # A "Orelhuda" prateada
    # Base
    draw.rectangle([180, 430, 332, 470], fill=(161, 161, 170, 255))
    # Haste
    draw.rectangle([236, 370, 276, 430], fill=(212, 212, 216, 255))
    # Bojo da taça
    draw.polygon([(160, 160), (352, 160), (320, 370), (192, 370)], fill=(244, 244, 245, 255), outline=(161, 161, 170, 255), width=6)
    # As grandes alças laterais ("orelhas")
    draw.arc([80, 150, 220, 320], start=90, end=270, fill=(212, 212, 216, 255), width=18)
    draw.arc([292, 150, 432, 320], start=270, end=90, fill=(212, 212, 216, 255), width=18)
    save_webp(img, 'trophies/champions-league.webp')

def create_trophy_libertadores():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Pedestal de madeira com plaquinhas dos campeões
    draw.rectangle([170, 260, 342, 470], fill=(120, 53, 15, 255), outline=(69, 26, 3, 255), width=6)
    # Placas douradas
    for y in [290, 340, 390, 440]:
        for x in [185, 240, 295]:
            draw.rectangle([x, y - 15, x + 35, y + 10], fill=(245, 158, 11, 255))
    # Bojo prateado
    draw.ellipse([196, 120, 316, 260], fill=(244, 244, 245, 255), outline=(161, 161, 170, 255), width=5)
    # Estatueta dourada no topo
    draw.ellipse([240, 60, 272, 92], fill=(245, 158, 11, 255))
    draw.line([(256, 92), (256, 120)], fill=(245, 158, 11, 255), width=8)
    save_webp(img, 'trophies/libertadores.webp')

def create_trophy_brasileirao():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Base
    draw.rectangle([170, 420, 342, 470], fill=(39, 39, 42, 255))
    # Arco dourado moderno
    draw.arc([130, 80, 382, 420], start=180, end=0, fill=(234, 179, 8, 255), width=28)
    # Esfera central verde/amarela
    draw.ellipse([206, 180, 306, 280], fill=(22, 163, 74, 255), outline=(234, 179, 8, 255), width=8)
    draw.ellipse([236, 210, 276, 250], fill=(234, 179, 8, 255))
    save_webp(img, 'trophies/brasileirao-serie-a.webp')

def create_trophy_copa_brasil():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Base prateada
    draw.rectangle([180, 420, 332, 470], fill=(161, 161, 170, 255))
    # Corpo taça com laço estilizado
    draw.polygon([(170, 160), (342, 160), (290, 420), (222, 420)], fill=(244, 244, 245, 255), outline=(234, 179, 8, 255), width=6)
    # Faixa verde e amarela
    draw.line([(180, 260), (332, 260)], fill=(22, 163, 74, 255), width=14)
    draw.line([(180, 280), (332, 280)], fill=(234, 179, 8, 255), width=10)
    save_webp(img, 'trophies/copa-do-brasil.webp')

def create_trophy_ballon_dor():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Base de pirita rochosa preta/dourada
    draw.polygon([(150, 470), (180, 340), (332, 340), (362, 470)], fill=(24, 24, 27, 255), outline=(202, 138, 4, 255), width=4)
    # A grande bola de ouro cinzelada
    draw.ellipse([146, 80, 366, 300], fill=(234, 179, 8, 255), outline=(202, 138, 4, 255), width=8)
    draw.ellipse([190, 110, 250, 170], fill=(254, 240, 138, 220))
    save_webp(img, 'trophies/bola-de-ouro.webp')

def create_trophy_copinha():
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Base de mármore
    draw.rectangle([180, 420, 332, 470], fill=(212, 212, 216, 255))
    # Taça clássica dourada
    draw.polygon([(160, 180), (352, 180), (300, 380), (212, 380)], fill=(245, 158, 11, 255), outline=(180, 83, 9, 255), width=6)
    # Estrela no centro
    draw.ellipse([236, 240, 276, 280], fill=(255, 255, 255, 255))
    save_webp(img, 'trophies/copinha-sub20.webp')

def main():
    ensure_dirs()
    print("Gerando Marcas Esportivas...")
    create_brand_nike()
    create_brand_adidas()
    create_brand_puma()
    create_brand_mizuno()
    create_brand_umbro()
    create_brand_under_armour()

    print("Gerando Patrocinadores Oficiais...")
    create_sponsor_betano()
    create_sponsor_pixbet()
    create_sponsor_emirates()
    create_sponsor_redbull()
    create_sponsor_mastercard()
    create_sponsor_heineken()
    create_sponsor_spotify()
    create_sponsor_guarana()
    create_sponsor_itau()
    create_sponsor_brahma()

    print("Gerando Chuteiras com Design Real...")
    create_all_boots()

    print("Gerando Bolas com Física e Efeitos...")
    create_ball_capotao()
    create_ball_jabulani()
    create_ball_brazuca()
    create_ball_laranja()
    create_ball_meteoro()
    create_ball_cyber()
    create_ball_ouro()
    create_ball_varzea()

    print("Gerando Troféus Oficiais...")
    create_trophy_copa_mundo()
    create_trophy_champions()
    create_trophy_libertadores()
    create_trophy_brasileirao()
    create_trophy_copa_brasil()
    create_trophy_ballon_dor()
    create_trophy_copinha()

    print("TODOS OS ASSETS GERADOS COM SUCESSO!")

if __name__ == '__main__':
    main()
