import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, pageDefinitions } from './build.mjs';

// Marges explicites : ces plafonds détectent les ajouts lourds sans dépendre
// des variations de CPU ou de réseau d’un runner Lighthouse.
const budgets = { css: 45 * 1024, javascript: 12 * 1024, avif: 100 * 1024, total: 3 * 1024 * 1024 };

export async function checkDist(directory = path.join(root, 'dist'), { pagesUrl } = {}) {
  const site = JSON.parse(await readFile(path.join(root, 'data/site.json'), 'utf8'));
  const configuredUrl = new URL(site.siteUrl);
  const expectedPagesUrl = `${configuredUrl.origin}${configuredUrl.pathname.replace(/\/+$/, '')}`;
  if (pagesUrl !== undefined) assert.equal(pagesUrl.replace(/\/+$/, ''), expectedPagesUrl, `Configurez ${expectedPagesUrl} dans Settings > Pages avant de publier.`);
  const homepage = await readFile(path.join(directory, 'index.html'), 'utf8');
  assert.match(homepage, /name="robots" content="index, follow, max-image-preview:large"/, 'Livrable non indexable : aperçu interdit.');
  assert.equal((await stat(path.join(directory, '.nojekyll'))).isFile(), true, 'Marqueur statique absent.');

  const publicFiles = (await readdir(path.join(root, 'public'), { recursive: true, withFileTypes: true }))
    .filter(entry => entry.isFile()).map(entry => path.relative(path.join(root, 'public'), path.join(entry.parentPath, entry.name)).replaceAll('\\', '/'));
  const htmlFiles = pageDefinitions.map(page => page.file === '404' ? '404.html' : page.route === '/' ? 'index.html' : page.route.slice(1) + 'index.html');
  const expected = new Set([...publicFiles, ...htmlFiles, 'styles.css', 'app.mjs', 'robots.txt', 'sitemap.xml', '_headers', '_redirects', '.nojekyll']);
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  const present = new Set();
  let bytes = 0;
  for (const entry of entries) {
    const absolute = path.join(entry.parentPath, entry.name);
    const relative = path.relative(directory, absolute).replaceAll('\\', '/');
    assert.ok(!entry.isSymbolicLink(), `Lien symbolique interdit dans le livrable : ${relative}`);
    if (!entry.isFile()) continue;
    assert.ok(!/(^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|node_modules(?:\/|$))/.test(relative), `Fichier non public dans le livrable : ${relative}`);
    assert.ok(expected.has(relative), `Fichier non public dans le livrable : ${relative}`);
    const size = (await stat(absolute)).size;
    const limit = relative === 'styles.css' ? budgets.css : relative === 'app.mjs' ? budgets.javascript : relative.endsWith('.avif') ? budgets.avif : Infinity;
    assert.ok(size <= limit, `Budget dépassé : ${relative} (${size} > ${limit} octets).`);
    present.add(relative);
    bytes += size;
  }
  for (const relative of expected) assert.ok(present.has(relative), `Fichier attendu absent : ${relative}`);
  assert.ok(bytes <= budgets.total, `Budget total dépassé : ${bytes} > ${budgets.total} octets.`);
  return { files: present.size, bytes, budgets };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await checkDist(undefined, { pagesUrl: process.env.PAGES_URL });
  console.log(`Livrable contrôlé : ${result.files} fichiers, ${result.bytes} octets ; domaine, indexation et budgets conformes.`);
}
