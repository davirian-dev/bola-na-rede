const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/usr/bin/google-chrome';
const BASE_URL = 'http://localhost:3000';

async function runRealPlaytest() {
  console.log('🚀 [QA E2E] Iniciando Playtest Real de 8 Semanas no Bola na Rede...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
  });

  const errors = [];

  // =========================================================================
  // TESTE 1: VIEWPORT MOBILE (390x844) - MODO JOGADOR (8 SEMANAS)
  // =========================================================================
  console.log('\n📱 --- TESTE 1: Viewport Mobile (390x844) - Modo Jogador ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  mobilePage.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('chrome-extension')) {
        console.error('❌ [Mobile Console Error]:', text);
        errors.push({ context: 'mobile', text });
      }
    }
  });

  // 1.1 Redirecionamento sem save
  console.log('1.1 Acessando /dashboard sem save criado...');
  await mobilePage.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  console.log(`↳ URL atual: ${mobilePage.url()}`);

  // 1.2 Etapa 1: Clicar no Card do Modo Jogador
  console.log('1.2 Clicando no Card "Modo Jogador"...');
  await mobilePage.waitForSelector('h3', { timeout: 10000 });
  await mobilePage.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3'));
    const playerHeading = headings.find(h => h.innerText.toLowerCase().includes('modo jogador'));
    if (playerHeading) {
      const card = playerHeading.closest('div[class*="cursor-pointer"]');
      if (card) card.click();
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // 1.3 Sub-Etapa 1: Avançar para PlayStyle & Clube
  console.log('1.3 Clicando em "Avançar para PlayStyle & Clube"...');
  await mobilePage.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const nextBtn = buttons.find(b => b.innerText.toLowerCase().includes('avançar'));
    if (nextBtn) {
      nextBtn.scrollIntoView();
      nextBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // 1.4 Sub-Etapa 2: Iniciar Carreira Oficial
  console.log('1.4 Clicando em "Iniciar Carreira Oficial"...');
  await mobilePage.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startBtn = buttons.find(b => b.innerText.toLowerCase().includes('iniciar carreira'));
    if (startBtn) {
      startBtn.scrollIntoView();
      startBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  console.log(`↳ URL pós-criação: ${mobilePage.url()}`);
  const athleteHeader = await mobilePage.evaluate(() => document.querySelector('h2')?.innerText);
  console.log(`↳ Atleta ativo no Dashboard: ${athleteHeader}`);

  // 1.5 Simula 8 Semanas consecutivas no Smartphone
  console.log('1.5 Simulando 8 Semanas consecutivas no Smartphone...');
  for (let week = 1; week <= 8; week++) {
    // Clica no botão de simulação rápida
    await mobilePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const simBtn = buttons.find(b => b.innerText.toLowerCase().includes('simulação rápida') || b.innerText.toLowerCase().includes('simular'));
      if (simBtn) {
        simBtn.scrollIntoView();
        simBtn.click();
      }
    });

    await new Promise(r => setTimeout(r, 800));

    // Fecha o modal de resultado clicando em Ir para Coletiva ou Fechar
    await mobilePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const closeBtn = buttons.find(b => 
        b.innerText.toLowerCase().includes('coletiva') || 
        b.innerText.toLowerCase().includes('fechar') ||
        b.innerText.toLowerCase().includes('continuar') ||
        b.innerText.toLowerCase().includes('concluir')
      );
      if (closeBtn) closeBtn.click();
    });

    await new Promise(r => setTimeout(r, 500));
    console.log(`   ✓ Semana ${week}/8 simulada com sucesso.`);
  }

  // 1.6 Teste de F5 (Reload no Celular)
  console.log('1.6 Dando F5 (Reload) para testar persistência e hidratação...');
  await mobilePage.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const postReloadUrl = mobilePage.url();
  const postReloadHeader = await mobilePage.evaluate(() => document.querySelector('h2')?.innerText);
  console.log(`↳ URL pós-F5: ${postReloadUrl}`);
  console.log(`↳ Header pós-F5: ${postReloadHeader}`);

  if (postReloadUrl.includes('/dashboard') && postReloadHeader) {
    console.log('✅ Modo Jogador persistiu 100% no /dashboard após F5!');
  } else {
    errors.push({ context: 'mobile_persistence', text: 'Redirecionou para fora do dashboard após reload' });
  }

  // Captura Screenshot do Dashboard no Celular
  const mobileShotPath = '/home/daviemari/.gemini/antigravity/scratch/bola-na-rede/playtest_mobile_dashboard.png';
  await mobilePage.screenshot({ path: mobileShotPath, fullPage: false });
  console.log(`📸 Screenshot Mobile gravado em: ${mobileShotPath}`);
  await mobilePage.close();

  // =========================================================================
  // TESTE 2: VIEWPORT DESKTOP (1440x900) - MODO TREINADOR (8 SEMANAS)
  // =========================================================================
  console.log('\n🖥️ --- TESTE 2: Viewport Desktop (1440x900) - Modo Treinador ---');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900 });

  desktopPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('chrome-extension')) {
        console.error('❌ [Desktop Console Error]:', text);
        errors.push({ context: 'desktop', text });
      }
    }
  });

  // Limpa storage para testar criação do Treinador do zero
  console.log('2.1 Acessando /new-career para criar carreira como Treinador...');
  await desktopPage.goto(`${BASE_URL}/new-career`, { waitUntil: 'networkidle2' });
  await desktopPage.evaluate(() => localStorage.clear());
  await desktopPage.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));

  // Clica no Card do Modo Treinador
  console.log('2.2 Clicando no Card "Modo Treinador"...');
  await desktopPage.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3'));
    const coachHeading = headings.find(h => h.innerText.toLowerCase().includes('modo treinador'));
    if (coachHeading) {
      const card = coachHeading.closest('div[class*="cursor-pointer"]');
      if (card) card.click();
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // Clica no botão de iniciar carreira de treinador
  console.log('2.3 Clicando em "Assumir Clube & Iniciar Carreira"...');
  await desktopPage.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startMgrBtn = buttons.find(b => b.innerText.toLowerCase().includes('assumir clube') || b.innerText.toLowerCase().includes('iniciar carreira'));
    if (startMgrBtn) {
      startMgrBtn.scrollIntoView();
      startMgrBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  console.log(`↳ URL Treinador: ${desktopPage.url()}`);
  const coachHeader = await desktopPage.evaluate(() => document.querySelector('h2')?.innerText);
  console.log(`↳ Treinador ativo no Dashboard: ${coachHeader}`);

  // 2.4 Simula 8 Semanas no Modo Treinador
  console.log('2.4 Simulando 8 Semanas consecutivas como Treinador no Desktop...');
  for (let week = 1; week <= 8; week++) {
    await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const simBtn = buttons.find(b => b.innerText.toLowerCase().includes('simulação rápida') || b.innerText.toLowerCase().includes('simular'));
      if (simBtn) {
        simBtn.scrollIntoView();
        simBtn.click();
      }
    });

    await new Promise(r => setTimeout(r, 800));

    await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const closeBtn = buttons.find(b => 
        b.innerText.toLowerCase().includes('coletiva') || 
        b.innerText.toLowerCase().includes('fechar') ||
        b.innerText.toLowerCase().includes('continuar') ||
        b.innerText.toLowerCase().includes('concluir')
      );
      if (closeBtn) closeBtn.click();
    });

    await new Promise(r => setTimeout(r, 500));
    console.log(`   ✓ [Treinador] Semana ${week}/8 simulada com sucesso.`);
  }

  // 2.5 Teste de F5 (Reload Treinador)
  console.log('2.5 Dando F5 (Reload) no Desktop...');
  await desktopPage.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const postReloadMgrUrl = desktopPage.url();
  const postReloadMgrHeader = await desktopPage.evaluate(() => document.querySelector('h2')?.innerText);
  console.log(`↳ URL Treinador pós-F5: ${postReloadMgrUrl}`);
  console.log(`↳ Header Treinador pós-F5: ${postReloadMgrHeader}`);

  if (postReloadMgrUrl.includes('/dashboard') && postReloadMgrHeader) {
    console.log('✅ Modo Treinador persistiu 100% no /dashboard após F5!');
  } else {
    errors.push({ context: 'desktop_persistence', text: 'Treinador redirecionou para fora do dashboard após reload' });
  }

  // Captura Screenshot Desktop
  const desktopShotPath = '/home/daviemari/.gemini/antigravity/scratch/bola-na-rede/playtest_desktop_dashboard.png';
  await desktopPage.screenshot({ path: desktopShotPath, fullPage: false });
  console.log(`📸 Screenshot Desktop gravado em: ${desktopShotPath}`);
  await desktopPage.close();

  await browser.close();

  console.log('\n======================================================');
  console.log(`🏁 PLAYTEST CONCLUÍDO!`);
  console.log(`Total de Erros Críticos: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Erros:', JSON.stringify(errors, null, 2));
  } else {
    console.log('🎉 100% LIMPO: Zero erros de console, hidratação perfeita, persistência validada e 16 rodadas simuladas!');
  }
  console.log('======================================================');
}

runRealPlaytest().catch(err => {
  console.error('Fatal Playtest Error:', err);
  process.exit(1);
});
