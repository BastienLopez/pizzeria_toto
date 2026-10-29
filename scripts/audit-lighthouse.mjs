import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const target = new URL(process.env.AUDIT_URL ?? 'http://127.0.0.1:4174');
if (!['127.0.0.1', 'localhost'].includes(target.hostname) || target.protocol !== 'http:') throw new Error('Cet audit doit cibler un serveur HTTP local.');

// npm exec fournit Lighthouse dans son PATH, sans dépendance ajoutée au site.
let lighthouseDirectory;
for (const entry of (process.env.PATH ?? '').split(path.delimiter)) {
  const candidate = path.resolve(entry, '..', 'lighthouse');
  try {
    const metadata = JSON.parse(await readFile(path.join(candidate, 'package.json'), 'utf8'));
    if (metadata.name === 'lighthouse' && metadata.version === '13.6.0') { lighthouseDirectory = candidate; break; }
  } catch { /* Les autres entrées du PATH ne sont pas des installations Lighthouse. */ }
}
if (!lighthouseDirectory) throw new Error('Lancer : npm exec --yes --package=lighthouse@13.6.0 -- node scripts/audit-lighthouse.mjs');

const require = createRequire(path.join(lighthouseDirectory, 'package.json'));
const { default: lighthouse } = await import(pathToFileURL(require.resolve('lighthouse')).href);
const { default: puppeteer } = await import(pathToFileURL(require.resolve('puppeteer-core')).href);
const launcher = await import(pathToFileURL(require.resolve('chrome-launcher')).href);
const { default: desktopConfig } = await import(pathToFileURL(path.join(lighthouseDirectory, 'core/config/desktop-config.js')).href);
const directory = path.join(root, '.codex/qa/lighthouse');
await mkdir(directory, { recursive: true });

const site = JSON.parse(await readFile(path.join(root, 'data/site.json'), 'utf8'));
const basePath = new URL(site.siteUrl).pathname.replace(/\/+$/, '');
const pages = [{ name: 'accueil', route: `${basePath}/` }, { name: 'carte', route: `${basePath}/la-carte/` }, { name: 'infos', route: `${basePath}/infos-pratiques/` }];
const summary = [];
for (const theme of ['light', 'dark']) {
  for (const device of ['mobile', 'desktop']) {
    for (const pageInfo of pages) {
      const name = `${pageInfo.name}-${device}-${theme === 'dark' ? 'sombre' : 'clair'}`;
      console.log(`Lighthouse : ${name}`);
      const chrome = await launcher.launch({ chromeFlags: ['--headless=new'], logLevel: 'silent' });
      let browser;
      try {
        browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}`, defaultViewport: null });
        const page = await browser.newPage();
        await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
        const url = new URL(pageInfo.route, target).href;
        const result = await lighthouse(url, { port: chrome.port, output: ['json', 'html'], onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], locale: 'fr', logLevel: 'error', enableErrorReporting: false }, device === 'desktop' ? desktopConfig : undefined, page);
        if (!result?.lhr || result.lhr.runtimeError) throw new Error(result?.lhr?.runtimeError?.message ?? 'Rapport Lighthouse absent.');
        const actualTheme = await page.evaluate(() => document.documentElement.dataset.theme);
        if (actualTheme !== theme) throw new Error(`Thème mesuré ${actualTheme}, thème demandé ${theme}.`);
        await writeFile(path.join(directory, `${name}.report.json`), result.report[0]);
        await writeFile(path.join(directory, `${name}.report.html`), result.report[1]);
        const row = {
          name, url, theme: actualTheme, device, version: result.lhr.lighthouseVersion, date: result.lhr.fetchTime,
          scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)])),
          metrics: { lcpMs: result.lhr.audits['largest-contentful-paint'].numericValue, cls: result.lhr.audits['cumulative-layout-shift'].numericValue, tbtMs: result.lhr.audits['total-blocking-time'].numericValue },
          warnings: result.lhr.runWarnings,
        };
        summary.push(row);
        await writeFile(path.join(directory, 'summary.json'), JSON.stringify(summary, null, 2));
        console.log(JSON.stringify(row));
      } finally {
        if (browser) await browser.disconnect();
        await chrome.kill();
      }
    }
  }
}
console.log(`Audit terminé : ${summary.length} mesures dans .codex/qa/lighthouse/.`);
