const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://outsmart-hazel.vercel.app';
const RAW_DIR = path.join(__dirname, 'raw');

// Scene timings synced to voiceover (cumulative seconds)
const SCENES = [
  { name: 'hero',          url: '/',                    duration: 5,   actions: 'wait' },
  { name: 'arenas_scroll', url: '/',                    duration: 13,  actions: 'scroll_arenas' },
  { name: 'cipher_select', url: '/arena/cipher',        duration: 9,   actions: 'select_char' },
  { name: 'cipher_battle', url: '/arena/cipher',        duration: 15,  actions: 'battle_interact' },
  { name: 'interrogate',   url: '/arena/interrogate',   duration: 13,  actions: 'select_char_interrogate' },
  { name: 'negotiate',     url: '/arena/negotiate',     duration: 12,  actions: 'select_char_negotiate' },
  { name: 'duel',          url: '/arena/duel',          duration: 13,  actions: 'select_char_duel' },
  { name: 'battle_hud',    url: '/arena/cipher',        duration: 12,  actions: 'show_full_battle' },
  { name: 'cta',           url: '/',                    duration: 13,  actions: 'scroll_cta' },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function smoothScroll(page, distance, durationMs) {
  const steps = Math.max(Math.round(durationMs / 16), 1);
  const startY = await page.evaluate(() => window.scrollY);
  for (let i = 1; i <= steps; i++) {
    const eased = 1 - Math.pow(1 - (i / steps), 3);
    await page.evaluate(y => window.scrollTo(0, y), Math.round(startY + distance * eased));
    await sleep(16);
  }
}

async function typeHuman(page, selector, text, delay = 45) {
  const el = page.locator(selector).first();
  if (await el.count() > 0) {
    await el.click();
    await sleep(200);
    for (const ch of text) {
      await page.keyboard.type(ch, { delay });
    }
    return true;
  }
  return false;
}

async function safeClick(page, selector, timeout = 3000) {
  try {
    await page.locator(selector).first().click({ timeout });
    return true;
  } catch { return false; }
}

(async () => {
  fs.mkdirSync(RAW_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--test-type'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    recordVideo: { dir: RAW_DIR, size: { width: 1280, height: 720 } },
  });

  const page = await context.newPage();
  const startTime = Date.now();
  const elapsed = () => ((Date.now() - startTime) / 1000).toFixed(1);

  for (const scene of SCENES) {
    console.log(`[${elapsed()}s] Scene: ${scene.name} (${scene.duration}s)`);
    await page.goto(`${BASE_URL}${scene.url}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await sleep(1500);

    switch (scene.actions) {
      case 'hero':
        await sleep(scene.duration * 1000 - 1500);
        break;

      case 'scroll_arenas':
        await smoothScroll(page, 500, 2000);
        await sleep(2000);
        // Hover over each arena card
        for (const ref of ['Cipher Vault', 'The Interrogation', 'The Negotiation', 'The Final Duel']) {
          const card = page.locator('a').filter({ hasText: ref }).first();
          if (await card.count() > 0) {
            await card.hover();
            await sleep(800);
          }
        }
        await smoothScroll(page, 400, 1500);
        await sleep((scene.duration - 8) * 1000);
        break;

      case 'select_char':
        await sleep(1000);
        // Click Cipher Mage character card
        const cipherMage = page.locator('button').filter({ hasText: 'Cipher Mage' }).first();
        if (await cipherMage.count() > 0) {
          await cipherMage.click();
          await sleep(500);
        }
        // Click Enter Battle
        await sleep(500);
        const enterBtn = page.locator('button').filter({ hasText: 'Enter Battle' }).first();
        if (await enterBtn.count() > 0) {
          await enterBtn.click();
        }
        await sleep((scene.duration - 3) * 1000);
        break;

      case 'battle_interact':
        // Wait for puzzle to load
        await sleep(5000);
        // Type an answer
        await typeHuman(page, 'input[placeholder*="answer"]', 'Hello World', 50);
        await sleep(500);
        // Click send
        const sendBtn = page.locator('button[type="submit"]').first();
        if (await sendBtn.count() > 0) {
          await sendBtn.click();
        }
        // Wait for MiMo response
        await sleep(8000);
        break;

      case 'select_char_interrogate':
        await sleep(1000);
        const shadowAgent = page.locator('button').filter({ hasText: 'Shadow Agent' }).first();
        if (await shadowAgent.count() > 0) {
          await shadowAgent.click();
          await sleep(500);
        }
        const enterBtn2 = page.locator('button').filter({ hasText: 'Enter Battle' }).first();
        if (await enterBtn2.count() > 0) {
          await enterBtn2.click();
        }
        await sleep((scene.duration - 3) * 1000);
        break;

      case 'select_char_negotiate':
        await sleep(1000);
        const ironMind = page.locator('button').filter({ hasText: 'Iron Mind' }).first();
        if (await ironMind.count() > 0) {
          await ironMind.click();
          await sleep(500);
        }
        const enterBtn3 = page.locator('button').filter({ hasText: 'Enter Battle' }).first();
        if (await enterBtn3.count() > 0) {
          await enterBtn3.click();
        }
        await sleep((scene.duration - 3) * 1000);
        break;

      case 'select_char_duel':
        await sleep(1000);
        const trickster = page.locator('button').filter({ hasText: 'Trickster' }).first();
        if (await trickster.count() > 0) {
          await trickster.click();
          await sleep(500);
        }
        const enterBtn4 = page.locator('button').filter({ hasText: 'Enter Battle' }).first();
        if (await enterBtn4.count() > 0) {
          await enterBtn4.click();
        }
        await sleep((scene.duration - 3) * 1000);
        break;

      case 'show_full_battle':
        // Select Cipher Mage and enter battle again
        await sleep(1000);
        const cm2 = page.locator('button').filter({ hasText: 'Cipher Mage' }).first();
        if (await cm2.count() > 0) {
          await cm2.click();
          await sleep(500);
        }
        const eb5 = page.locator('button').filter({ hasText: 'Enter Battle' }).first();
        if (await eb5.count() > 0) {
          await eb5.click();
        }
        await sleep(5000);
        // Try clicking the ability button
        const abilityBtn = page.locator('button').filter({ hasText: /Decrypt|Cloak|Fortify|Bluff/ }).first();
        if (await abilityBtn.count() > 0) {
          await abilityBtn.click();
          await sleep(1000);
        }
        // Type answer and interact
        await typeHuman(page, 'input[placeholder*="answer"]', 'KHOOR ZRUOG is HELLO WORLD shifted by 3', 30);
        await sleep(300);
        const sendBtn2 = page.locator('button[type="submit"]').first();
        if (await sendBtn2.count() > 0) {
          await sendBtn2.click();
        }
        await sleep(5000);
        break;

      case 'scroll_cta':
        await smoothScroll(page, 800, 3000);
        await sleep(3000);
        await smoothScroll(page, 600, 2000);
        await sleep((scene.duration - 9) * 1000);
        break;
    }
  }

  console.log(`[${elapsed()}s] Recording complete`);
  await context.close();
  await browser.close();

  // Find the video file
  const videoFiles = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const src = path.join(RAW_DIR, videoFiles[videoFiles.length - 1]);
    const dst = path.join(RAW_DIR, 'outsmart-raw.webm');
    fs.renameSync(src, dst);
    console.log(`Video saved: ${dst}`);
  }
})();
