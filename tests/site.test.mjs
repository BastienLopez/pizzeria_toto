import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat, writeFile, unlink, mkdtemp, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { build, root, escapeHtml, pageDefinitions } from '../scripts/build.mjs';
import { createSiteServer } from '../scripts/serve.mjs';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
import { contentSecurityPolicy } from '../scripts/security-policy.mjs';
import { checkDist } from '../scripts/check-dist.mjs';

let server;
let address;
let menu;
let productionServer;
let productionAddress;
let site;
const output = path.join(root, '.test-site');
before(async () => {
  await build({ destination: '.test-site' });
  menu = JSON.parse(await readFile(path.join(root, 'data/menu.json'), 'utf8'));
  site = JSON.parse(await readFile(path.join(root, 'data/site.json'), 'utf8'));
  server = createSiteServer({ directory: '.test-site' });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  address = `http://127.0.0.1:${server.address().port}`;
  productionServer = createSiteServer({ preview: false, directory: '.test-site' });
  await new Promise(resolve => productionServer.listen(0, '127.0.0.1', resolve));
  productionAddress = `http://127.0.0.1:${productionServer.address().port}`;
});
after(async () => { for (const current of [server, productionServer]) if (current) await new Promise(resolve => current.close(resolve)); });

test('la carte et ses huit descriptions sont dans le HTML sans JavaScript', async () => {
  const response = await fetch(address + '/la-carte/');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal((html.match(/class="pizza-card"/g) ?? []).length, menu.length);
  for (const pizza of menu) {
    assert.ok(html.includes(escapeHtml(pizza.name)));
    assert.ok(html.includes(escapeHtml(pizza.description)));
    assert.ok(html.includes(`data-pizza="${pizza.id}" data-base="${pizza.base}" data-vegetarian="${pizza.vegetarian}"`));
  }
  assert.ok(html.includes('Carte d’exemple · Tarifs fictifs'));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(!html.includes('{{'));
});

test('chaque combinaison de base et végétarien possède les bons candidats', () => {
  assert.equal(menu.filter(p => p.base === 'tomate').length, 4);
  assert.equal(menu.filter(p => p.base === 'creme').length, 4);
  assert.deepEqual(menu.filter(p => p.vegetarian).map(p => p.id), ['margherita', 'quattro-formaggi']);
  for (const base of ['tomate', 'creme']) assert.equal(menu.filter(p => p.base === base && p.vegetarian).length, 1);
  assert.equal(menu.find(p => p.id === 'chevre-miel-speck').vegetarian, false);
});

test('les sept pages utiles ont un titre distinct, un H1 et les bons liens actifs', async () => {
  const titles = new Set();
  for (const page of pageDefinitions.filter(page => page.file !== '404')) {
    const route = page.route;
    const response = await fetch(address + route);
    assert.equal(response.status, 200);
    const html = await response.text();
    titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
    assert.ok(html.includes('lang="fr"'));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, route);
    assert.ok(html.includes(`<link rel="canonical" href="https://verone.fr${route}">`));
    assert.ok(html.includes('href="/la-carte/"'));
    assert.ok(html.includes('href="/infos-pratiques/"'));
    assert.ok(!html.includes('/#carte'));
    if (page.indexable) assert.ok(html.includes(`<a href="${route}" aria-current="page">`));
    assert.ok(html.includes(page.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'));
  }
  assert.equal(titles.size, 7);
  const missing = await fetch(address + '/pizza-introuvable');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Cette part/);
});

test('aucun lien local ou média généré ne pointe vers un fichier absent', async () => {
  const files = (await readdir(output, { recursive: true })).filter(name => name.endsWith('.html'));
  for (const file of files) {
    const html = await readFile(path.join(output, file), 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) {
      const pathname = new URL(match[1], site.origin).pathname;
      const target = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
      assert.ok((await stat(path.join(output, target))).isFile(), `${file} -> ${target}`);
    }
    for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of match[1].split(',')) {
        const pathname = new URL(candidate.trim().split(/\s+/)[0], site.origin).pathname;
        assert.ok((await stat(path.join(output, pathname))).isFile(), `${file} -> ${pathname}`);
      }
    }
  }
});

test('l’accueil présente le restaurant à Reims et donne accès à la carte séparée', async () => {
  const html = await (await fetch(address)).text();
  assert.match(html, /123 rue de Venise/);
  assert.match(html, /51100 Reims/);
  assert.match(html, /href="\/la-carte\/"/);
  assert.ok(!html.includes('id="vegetarian-filter"'));
  assert.ok(!html.includes('id="pizza-dialog"'));
  assert.equal((html.match(/class="pizza-card"/g) ?? []).length, 3);
});

test('les anciennes URL et les variantes sans slash redirigent vers la route canonique', async () => {
  for (const [from, to] of [['/index.html', '/'], ['/la-carte', '/la-carte/'], ['/la-carte.html', '/la-carte/'], ['/la-carte/index.html', '/la-carte/'], ['/infos-pratiques.html', '/infos-pratiques/'], ['/mentions-legales.html', '/mentions-legales/']]) {
    const response = await fetch(address + from + '?source=test', { redirect: 'manual' });
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('location'), to + '?source=test');
  }
});

test('sitemap et robots de production exposent uniquement les trois pages indexables', async () => {
  const sitemap = await (await fetch(productionAddress + '/sitemap.xml')).text();
  const expected = ['https://verone.fr/', 'https://verone.fr/la-carte/', 'https://verone.fr/infos-pratiques/'];
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), expected);
  const robots = await (await fetch(productionAddress + '/robots.txt')).text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/verone.fr\/sitemap.xml/);
  assert.equal((await fetch(productionAddress)).headers.get('x-robots-tag'), null);
  assert.match(await (await fetch(address + '/robots.txt')).text(), /Disallow: \//);
  assert.match((await fetch(address)).headers.get('x-robots-tag'), /noindex/);
});

test('les données structurées utilisent les coordonnées fournies sans inventer de prix, avis ou horaires', async () => {
  for (const page of pageDefinitions.filter(page => page.file !== '404')) {
    const html = await (await fetch(address + page.route)).text();
    const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const restaurant = json['@graph'].find(entity => entity['@type'] === 'Restaurant');
    assert.equal(restaurant.name, 'Le Verone');
    assert.deepEqual(restaurant.address, { '@type': 'PostalAddress', ...site.address });
    assert.equal(restaurant.telephone, '+33' + site.telephone.slice(1));
    for (const invented of ['aggregateRating', 'review', 'openingHours', 'priceRange', 'offers', 'geo']) assert.equal(restaurant[invented], undefined);
    assert.equal(json['@graph'].find(entity => entity['@type'] === 'WebPage' || entity['@type'] === 'CollectionPage').url, site.origin + page.route);
  }
});

test('modifier les coordonnées met à jour tous les appels et les métadonnées du HTML construit', { timeout: 30_000 }, async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'verone-contract-'));
  try {
    for (const directory of ['scripts', 'src', 'data', 'public']) {
      await cp(path.join(root, directory), path.join(fixture, directory), { recursive: true });
    }
    const changed = {
      ...site, name: 'Pizza & Exemple "Test"', origin: 'https://pizzeria.example', telephone: '0987654321',
      address: { ...site.address, streetAddress: '456 rue d’Essai', postalCode: '69001', addressLocality: 'Lyon' },
    };
    await writeFile(path.join(fixture, 'data/site.json'), JSON.stringify(changed));
    await promisify(execFile)(process.execPath, [path.join(fixture, 'scripts/build.mjs')]);
    for (const page of pageDefinitions) {
      const file = page.file === '404' ? '404.html' : page.route === '/' ? 'index.html' : path.join(page.route.slice(1), 'index.html');
      const html = await readFile(path.join(fixture, 'dist', file), 'utf8');
      const calls = [...html.matchAll(/href="tel:([^"]+)"/g)].map(match => match[1]);
      assert.ok(calls.length > 0, page.route);
      assert.deepEqual([...new Set(calls)], ['0987654321'], page.route);
      assert.ok(html.includes('09 87 65 43 21'), page.route);
      for (const stale of ['0123456789', '01 23 45 67 89', '+33123456789']) assert.ok(!html.includes(stale), `${page.route}: ${stale}`);
      assert.ok(html.includes(`rel="canonical" href="https://pizzeria.example${page.route}"`));
      assert.match(html, /<title>[^<]*Pizza &amp; Exemple &quot;Test&quot;/);
      assert.match(html, /property="og:title" content="[^"]*Pizza &amp; Exemple &quot;Test&quot;/);
      assert.ok(html.includes('property="og:site_name" content="Pizza &amp; Exemple &quot;Test&quot;"'));
      if (page.file === '404') continue;
      const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
      const restaurant = graph.find(entity => entity['@type'] === 'Restaurant');
      assert.equal(restaurant.name, changed.name);
      assert.equal(restaurant.telephone, '+33987654321');
      assert.deepEqual(restaurant.address, { '@type': 'PostalAddress', ...changed.address });
      const webpage = graph.find(entity => ['WebPage', 'CollectionPage'].includes(entity['@type']));
      assert.ok(html.includes(`<title>${escapeHtml(webpage.name)}</title>`));
      assert.ok(html.includes(`name="description" content="${escapeHtml(webpage.description)}"`));
      assert.ok(html.includes(`property="og:description" content="${escapeHtml(webpage.description)}"`));
      if (['index', 'infos-pratiques'].includes(page.file)) {
        assert.ok(webpage.description.includes('09 87 65 43 21'));
        assert.ok(webpage.description.includes('456 rue d’Essai'));
        assert.ok(webpage.description.includes('Lyon'));
      }
    }
  } finally {
    if (path.dirname(fixture) !== path.resolve(tmpdir()) || !path.basename(fixture).startsWith('verone-contract-')) throw new Error('Fixture hors du dossier temporaire attendu.');
    await rm(fixture, { recursive: true, force: true });
  }
});

test('les mentions légales identifient les données fictives sans les injecter dans le SEO du restaurant', async () => {
  const legal = await (await fetch(address + '/mentions-legales/')).text();
  assert.match(legal, /Informations fictives de démonstration/);
  assert.match(legal, /Le Verone Démo SAS/);
  assert.match(legal, /contact@example\.invalid/);
  assert.match(legal, /GitHub Pages/);
  assert.match(legal, /name="robots" content="noindex, follow"/);
  for (const page of pageDefinitions.filter(page => page.file !== '404')) {
    const html = await (await fetch(address + page.route)).text();
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
    assert.ok(!/Le Verone Démo SAS|Camille Exemple|example\.invalid/.test(json), page.route);
  }
});

test('le thème respecte le choix enregistré, la préférence système et le stockage bloqué', async () => {
  const source = await readFile(path.join(root, 'src/theme-init.js'), 'utf8');
  for (const [saved, system, blocked, expected] of [[null, false, false, 'light'], [null, true, false, 'dark'], ['light', true, false, 'light'], ['dark', false, false, 'dark'], ['invalide', true, false, 'dark'], [null, true, true, 'dark']]) {
    const classes = new Set();
    const document = { documentElement: { dataset: {}, classList: { add(value) { classes.add(value); } } } };
    runInNewContext(source, { document, localStorage: { getItem() { if (blocked) throw new Error('Storage denied'); return saved; } }, window: { matchMedia() { return { matches: system }; } } });
    assert.equal(document.documentElement.dataset.theme, expected);
    assert.equal(classes.has('js'), true);
    assert.equal(document.documentElement.dataset.themePreference, ['light', 'dark'].includes(saved) ? 'explicit' : 'system');
  }
});

test('le script de thème précède le contenu et sa CSP autorise uniquement son empreinte exacte', async () => {
  const response = await fetch(productionAddress);
  const html = await response.text();
  const bootstrap = html.match(/<script data-theme-init>([\s\S]*?)<\/script>/)[1];
  const hash = createHash('sha256').update(bootstrap).digest('base64');
  assert.ok(html.indexOf('<script data-theme-init>') < html.indexOf('<body>'));
  assert.ok(response.headers.get('content-security-policy').includes(`'sha256-${hash}'`));
  assert.ok(!response.headers.get('content-security-policy').includes('unsafe-inline'));
  assert.ok(!html.includes('src="/theme-init.js'));
  const meta = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1].replaceAll('&#39;', "'");
  assert.equal(response.headers.get('content-security-policy'), meta + "; frame-ancestors 'none'");
  assert.ok((await readFile(path.join(output, '_headers'), 'utf8')).includes(response.headers.get('content-security-policy')));
});

test('la CSP conserve la même empreinte après normalisation Windows des fins de ligne', () => {
  const script = "document.documentElement.dataset.theme = 'dark';\n";
  assert.deepEqual(contentSecurityPolicy(script), contentSecurityPolicy('\uFEFF' + script.replaceAll('\n', '\r\n')));
});

test('la carte et les informations conservent une hiérarchie de titres sans saut', async () => {
  const menuHtml = await (await fetch(productionAddress + '/la-carte/')).text();
  assert.equal((menuHtml.match(/<h2 class="pizza-name">/g) ?? []).length, 8);
  assert.ok(!menuHtml.includes('<h3'));
  const information = await (await fetch(productionAddress + '/infos-pratiques/')).text();
  assert.ok(information.includes('<h2>Nous trouver</h2>'));
  assert.ok(!information.includes('<h3'));
});

test('les réponses statiques acceptent le cache conditionnel et compressent les textes', async () => {
  const response = await fetch(productionAddress + '/styles.css', { headers: { 'Accept-Encoding': 'br' } });
  assert.equal(response.headers.get('content-encoding'), 'br');
  assert.ok((await response.text()).includes('--color-background'));
  const cached = await fetch(productionAddress + '/styles.css', { headers: { 'Accept-Encoding': 'br', 'If-None-Match': response.headers.get('etag') } });
  assert.equal(cached.status, 304);
  assert.equal(await cached.text(), '');
  const refused = await fetch(productionAddress + '/styles.css', { headers: { 'Accept-Encoding': 'gzip, br;q=0' } });
  assert.equal(refused.headers.get('content-encoding'), null);
  assert.match(await refused.text(), /--color-background/);
});

test('les assets sont versionnés, alignés entre HTML et CSS et mis en cache sans figer les pages', async () => {
  const response = await fetch(productionAddress);
  assert.equal(response.headers.get('cache-control'), 'no-cache');
  const html = await response.text();
  const cssUrl = html.match(/href="(\/styles\.css\?v=([a-f0-9]{12}))"/);
  assert.ok(cssUrl);
  assert.ok(html.includes('/app.mjs?v=' + cssUrl[2]));
  const css = await fetch(productionAddress + cssUrl[1]);
  assert.match(css.headers.get('cache-control'), /max-age=31536000, immutable/);
  assert.ok((await css.text()).includes('/fonts/fraunces-normal.woff2?v=' + cssUrl[2]));
});

test('la génération de l’aperçu ne peut plus écraser les robots et métadonnées du build testé', async () => {
  await build({ preview: true });
  const previewHtml = await readFile(path.join(root, '.preview/index.html'), 'utf8');
  assert.match(previewHtml, /name="robots" content="noindex, follow"/);
  assert.match(await (await fetch(productionAddress)).text(), /name="robots" content="index, follow, max-image-preview:large"/);
  assert.match(await (await fetch(productionAddress + '/robots.txt')).text(), /Allow: \//);
  await assert.rejects(build({ destination: '../autre-dossier' }), /non autorisé/);
  assert.throws(() => createSiteServer({ directory: '../autre-dossier' }), /non autorisé/);
});

test('le serveur isole le site, interdit les mutations et applique les en-têtes de sécurité', async () => {
  for (const route of ['/package.json', '/src/layout.html', '/.git/config', '/%2e%2e%2fpackage.json', '/%5c..%5cpackage.json', '/%00', '/%ZZ', '/images/']) {
    assert.equal((await fetch(address + route)).status, 404, route);
  }
  assert.equal((await fetch(address, { method: 'POST', body: 'test' })).status, 405);
  const response = await fetch(address);
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(response.headers.get('content-security-policy'), /connect-src 'self'/);
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(response.headers.get('set-cookie'), null);
  const head = await fetch(address + '/styles.css', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.match(head.headers.get('content-type'), /text\/css/);
});

test('les contenus injectés au build sont échappés en texte', () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)"> & \'test\''), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;test&#39;');
});

test('le livrable contient le domaine Pages et respecte les budgets de ressources', async () => {
  const result = await checkDist(output);
  assert.ok(result.files > 0);
  assert.ok(result.bytes < result.budgets.total);
  assert.equal(await readFile(path.join(output, 'CNAME'), 'utf8'), 'verone.fr\n');
  assert.equal((await stat(path.join(output, '.nojekyll'))).isFile(), true);
});

test('le contrôle du livrable rejette réellement un fichier privé ajouté par erreur', async () => {
  const fixture = path.join(output, '.env');
  await writeFile(fixture, 'VERONE_TEST_FIXTURE=not-a-secret\n', { flag: 'wx' });
  try { await assert.rejects(checkDist(output), /Fichier non public/); }
  finally { await unlink(fixture); }
});

test('la livraison Pages accepte le domaine canonique et refuse un domaine ou un chemin incompatible', async () => {
  for (const pagesUrl of ['https://verone.fr', 'https://verone.fr/']) await checkDist(output, { pagesUrl });
  for (const pagesUrl of ['', 'http://verone.fr', 'https://exemple.github.io/pizzeria_toto', 'https://autre.fr']) {
    await assert.rejects(checkDist(output, { pagesUrl }), /Settings > Pages/);
  }
});

test('le contrôle du livrable rejette réellement une page d’aperçu non indexable', async () => {
  const fixture = path.join(output, 'index.html');
  const original = await readFile(fixture, 'utf8');
  const preview = original.replace('name="robots" content="index, follow, max-image-preview:large"', 'name="robots" content="noindex, follow"');
  assert.notEqual(preview, original);
  await writeFile(fixture, preview);
  try { await assert.rejects(checkDist(output), /Livrable non indexable/); }
  finally { await writeFile(fixture, original); }
});

test('le contrôle du livrable rejette réellement une feuille de style hors budget', async () => {
  const fixture = path.join(output, 'styles.css');
  const original = await readFile(fixture);
  const { budgets } = await checkDist(output);
  await writeFile(fixture, Buffer.alloc(budgets.css + 1, ' '));
  try { await assert.rejects(checkDist(output), /Budget dépassé : styles\.css/); }
  finally { await writeFile(fixture, original); }
});
