/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/usr/bin/google-chrome';
const BASE_URL = 'http://localhost:3000';

async function diagnoseNewCareer() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  await page.goto(`${BASE_URL}/new-career`, { waitUntil: 'networkidle2' });
  console.log('Passo 1 URL:', page.url());

  // Clica no Modo Jogador
  const clickPlayer = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3'));
    const h = headings.find(el => el.innerText.includes('Modo Jogador'));
    if (h) {
      const card = h.closest('div[class*="cursor-pointer"]');
      if (card) {
        card.click();
        return true;
      }
    }
    return false;
  });
  console.log('Passo 2 Clicou Modo Jogador:', clickPlayer);
  await new Promise(r => setTimeout(r, 600));

  // Verifica botões disponíveis
  const buttonsSub1 = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()));
  console.log('Passo 3 Botões na tela:', buttonsSub1.filter(b => b.length > 0));

  // Clica em Avançar
  const clickNext = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const next = buttons.find(b => b.innerText.toLowerCase().includes('avançar'));
    if (next) {
      next.click();
      return true;
    }
    return false;
  });
  console.log('Passo 4 Clicou Avançar:', clickNext);
  await new Promise(r => setTimeout(r, 600));

  // Verifica botões disponíveis após avançar
  const buttonsSub2 = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()));
  console.log('Passo 5 Botões na sub-etapa 2:', buttonsSub2.filter(b => b.length > 0));

  // Clica em Iniciar Carreira Oficial
  const clickStart = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const start = buttons.find(b => b.innerText.toLowerCase().includes('iniciar carreira'));
    if (start) {
      start.click();
      return true;
    }
    return false;
  });
  console.log('Passo 6 Clicou Iniciar Carreira Oficial:', clickStart);

  await new Promise(r => setTimeout(r, 2000));
  console.log('Passo 7 URL final:', page.url());

  // Checa localStorage
  const storage = await page.evaluate(() => localStorage.getItem('bola-na-rede-storage'));
  console.log('Passo 8 LocalStorage gravado:', storage ? storage.slice(0, 150) + '...' : 'VAZIO');

  await browser.close();
}

diagnoseNewCareer().catch(console.error);
