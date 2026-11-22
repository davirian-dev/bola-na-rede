const puppeteer = require('puppeteer-core');

async function runPlaytest() {
  console.log('🚀 Iniciando Playtest Real com Puppeteer e Google Chrome...');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  
  const consoleErrors = [];
  const consoleWarnings = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
      console.log('🔴 [Console Error]:', text);
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(text);
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
    console.log('💥 [Page Error]:', err.toString());
  });

  // TESTE 1: Acessar /dashboard direto sem save (Desktop 1440x900)
  console.log('\n--- TESTE 1: Acesso direto a /dashboard sem save (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  const currentUrl1 = page.url();
  console.log('URL após acesso direto a /dashboard:', currentUrl1);
  const redirected1 = currentUrl1.includes('/new-career');
  console.log('Redirecionou para /new-career com sucesso?', redirected1 ? '✅ SIM' : '❌ NÃO');

  // TESTE 2: Acessar /dashboard direto sem save no Mobile (390x844)
  console.log('\n--- TESTE 2: Acesso direto no Mobile (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  const currentUrl2 = page.url();
  console.log('URL mobile após acesso direto:', currentUrl2);

  // TESTE 3: Criação de Atleta e Playtest de 8 Semanas no Modo Jogador
  console.log('\n--- TESTE 3: Criação de Carreira (Modo Jogador) e 8 Semanas ---');
  await page.goto('http://localhost:3000/new-career', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  // Inspeciona botões e formulário
  const pageTitle = await page.title();
  console.log('Título da página /new-career:', pageTitle);

  // Vamos inspecionar se conseguimos criar o jogador via UI ou via store evaluation
  const storeStateBefore = await page.evaluate(() => {
    const raw = localStorage.getItem('bola-na-rede-storage');
    return raw ? JSON.parse(raw) : null;
  });
  console.log('Estado persistido inicial:', storeStateBefore ? 'Encontrado' : 'Vazio');

  await browser.close();
  console.log('\nPlaytest de inicialização concluído.');
  console.log('Erros de console:', consoleErrors.length);
  console.log('Erros de página:', pageErrors.length);
}

runPlaytest().catch((err) => {
  console.error('Erro no playtest:', err);
  process.exit(1);
});
