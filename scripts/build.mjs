import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { contentSecurityPolicy } from './security-policy.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const output = path.join(root, 'dist');

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

const svg = (paths) => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
const icons = {
  PHONE_ICON: svg('<path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a12 12 0 0 1-6-6l2-2-2-5Z"/>'),
  ARROW_ICON: svg('<path d="M4 12h15M13 6l6 6-6 6"/>'),
  ARROW_LEFT_ICON: svg('<path d="M20 12H5m6-6-6 6 6 6"/>'),
  LEAF_ICON: svg('<path d="M20 3c-7 0-14 1-15 7-1 5 4 8 8 6 5-2 6-8 7-13Z"/><path d="M3 21c1-6 6-11 12-13"/>'),
  MENU_ICON: svg('<path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4V4Zm16 0h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3V4Z"/>'),
  PIN_ICON: svg('<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>'),
  CLOCK_ICON: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
};
const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

function menuCard(pizza, eager = false, heading = 3, basePath = '') {
  if (!/^[a-z0-9-]+$/.test(pizza.id) || !['tomate', 'creme'].includes(pizza.base)
      || typeof pizza.vegetarian !== 'boolean' || typeof pizza.spicy !== 'boolean'
      || !Number.isFinite(pizza.price) || pizza.price <= 0) throw new Error(`Pizza invalide : ${pizza.id}`);
  const id = escapeHtml(pizza.id);
  const name = escapeHtml(pizza.name);
  const imageUrl = size => `${basePath}/images/${id}-${size}`;
  const attributes = [pizza.vegetarian ? '<span class="pizza-attribute">Végétarienne</span>' : '',
    pizza.spicy ? '<span class="pizza-attribute">Relevée</span>' : ''].filter(Boolean).join('<span aria-hidden="true">·</span>');
  return `<article class="pizza-card" data-pizza="${id}" data-base="${pizza.base}" data-vegetarian="${pizza.vegetarian}">
  <div class="pizza-photo"><picture${eager ? ' data-priority-image' : ''}><source type="image/avif" srcset="${imageUrl('360.avif')} 360w, ${imageUrl('600.avif')} 600w" sizes="(min-width: 1100px) 148px, (min-width: 760px) 132px, 96px"><img src="${imageUrl('600.webp')}" srcset="${imageUrl('360.webp')} 360w, ${imageUrl('600.webp')} 600w" sizes="(min-width: 1100px) 148px, (min-width: 760px) 132px, 96px" alt="Pizza ${name}, ${escapeHtml(pizza.description.toLowerCase())}" width="600" height="600" loading="${eager ? 'eager' : 'lazy'}"${eager ? ' fetchpriority="high"' : ''} decoding="async"></picture></div>
  <div class="pizza-content"><div class="pizza-heading"><div><p class="pizza-base">Base ${pizza.base === 'creme' ? 'crème' : 'tomate'}</p><h${heading} class="pizza-name">${name}</h${heading}></div><span class="pizza-price">${euros.format(pizza.price)}</span></div><p class="pizza-description">${escapeHtml(pizza.description)}</p><div class="pizza-bottom"><p class="pizza-attributes">${attributes}</p><button class="pizza-info" type="button" data-pizza-details hidden><span aria-hidden="true">Voir les détails ↗</span><span class="sr-only">Découvrir la pizza ${name}</span></button></div></div>
</article>`;
}

export const pageDefinitions = [
  { file: 'index', route: '/', label: 'Le restaurant', title: '{{SITE_NAME}} | Pizzeria à {{CITY}}', description: '{{SITE_NAME}}, pizzeria au {{STREET}} à {{CITY}}. Découvrez la carte de pizzas, trouvez les informations pratiques et contactez-nous au {{PHONE_DISPLAY}}.', indexable: true },
  { file: 'la-carte', route: '/la-carte/', label: 'La carte', title: 'La carte des pizzas à {{CITY}} | {{SITE_NAME}}', description: '{{SITE_NAME}} à {{CITY}} : pizzas base tomate ou crème et sélection végétarienne. Consultez la carte d’exemple, avec photos temporaires et tarifs fictifs.', indexable: true },
  { file: 'infos-pratiques', route: '/infos-pratiques/', label: 'Infos pratiques', title: 'Adresse, téléphone et accès à {{CITY}} | {{SITE_NAME}}', description: 'Retrouvez {{SITE_NAME}} au {{ADDRESS}}. Téléphone : {{PHONE_DISPLAY}}. Itinéraire, renseignements et horaires à confirmer par téléphone.', indexable: true },
  { file: 'mentions-legales', route: '/mentions-legales/', label: 'Mentions légales', title: 'Mentions légales | {{SITE_NAME}}, {{CITY}}', description: 'Mentions de démonstration du site {{SITE_NAME}} : identité juridique fictive signalée, hébergement GitHub Pages et informations à valider avant publication professionnelle.', indexable: false },
  { file: 'confidentialite', route: '/confidentialite/', label: 'Confidentialité', title: 'Confidentialité et préférence de thème | {{SITE_NAME}}', description: 'Fonctionnement du site {{SITE_NAME}} : absence de publicité et de suivi d’audience, polices locales et mémorisation facultative du thème clair ou sombre.', indexable: false },
  { file: 'cgu', route: '/cgu/', label: 'CGU', title: 'Conditions d’utilisation | {{SITE_NAME}}', description: 'Conditions de consultation du site {{SITE_NAME}} : carte de démonstration, contact téléphonique et contenus provisoires.', indexable: false },
  { file: 'credits', route: '/credits/', label: 'Crédits', title: 'Crédits des photos et typographies | {{SITE_NAME}}', description: 'Sources des photographies et recettes provisoires Del Arte, licences Fraunces et Manrope et conditions de la démonstration du site {{SITE_NAME}}.', indexable: false },
  { file: '404', route: '/404.html', label: 'Page introuvable', title: 'Page introuvable | {{SITE_NAME}}', description: 'Cette page ne figure pas à la carte. Retrouvez {{SITE_NAME}}, ses pizzas et ses coordonnées à {{CITY}}.', indexable: false },
];

function structuredData(site, page, siteUrl) {
  const restaurantUrl = `${siteUrl}/`;
  const restaurantId = `${restaurantUrl}#restaurant`;
  const graph = [
    { '@type': 'Restaurant', '@id': restaurantId, name: site.name, url: restaurantUrl, telephone: site.telephoneInternational, address: { '@type': 'PostalAddress', ...site.address }, servesCuisine: ['Italienne', 'Pizza'], hasMenu: `${siteUrl}/la-carte/` },
    { '@type': 'WebSite', '@id': `${restaurantUrl}#website`, url: restaurantUrl, name: site.name, inLanguage: 'fr-FR', publisher: { '@id': restaurantId } },
    { '@type': page.file === 'la-carte' ? 'CollectionPage' : 'WebPage', '@id': `${siteUrl}${page.route}#webpage`, url: `${siteUrl}${page.route}`, name: page.title, description: page.description, inLanguage: 'fr-FR', isPartOf: { '@id': `${restaurantUrl}#website` }, about: { '@id': restaurantId } },
  ];
  if (page.route !== '/' && page.file !== '404') graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Le restaurant', item: restaurantUrl }, { '@type': 'ListItem', position: 2, name: page.label, item: `${siteUrl}${page.route}` }] });
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

export async function build({ preview = false, destination = preview ? '.preview' : 'dist' } = {}) {
  if (!['dist', '.preview', '.test-site'].includes(destination)) throw new Error('Dossier de génération non autorisé.');
  const output = path.join(root, destination);
  const menu = JSON.parse(await readFile(path.join(root, 'data/menu.json'), 'utf8'));
  if (!Array.isArray(menu) || !menu.length || new Set(menu.map(p => p.id)).size !== menu.length) throw new Error('Carte vide ou identifiants dupliqués.');
  const site = JSON.parse(await readFile(path.join(root, 'data/site.json'), 'utf8'));
  const configuredSiteUrl = new URL(site.siteUrl);
  const basePath = configuredSiteUrl.pathname === '/' ? '' : configuredSiteUrl.pathname.replace(/\/+$/, '');
  const siteUrl = `${configuredSiteUrl.origin}${basePath}`;
  if (configuredSiteUrl.protocol !== 'https:' || configuredSiteUrl.username || configuredSiteUrl.password || configuredSiteUrl.search || configuredSiteUrl.hash
      || site.siteUrl.replace(/\/+$/, '') !== siteUrl || basePath.includes('//') || !/^0\d{9}$/.test(site.telephone)) throw new Error('URL du site ou téléphone invalide.');
  const layout = await readFile(path.join(root, 'src/layout.html'), 'utf8');
  const bootstrap = (await readFile(path.join(root, 'src/theme-init.js'), 'utf8')).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  if (/<\/script/i.test(bootstrap)) throw new Error('Le script d’initialisation contient une fermeture HTML interdite.');
  const policy = contentSecurityPolicy(bootstrap);
  const publicFiles = (await readdir(path.join(root, 'public'), { recursive: true })).filter(file => /\.(woff2|webp|avif|jpg|png|svg)$/.test(file)).sort();
  const clientFiles = ['styles.css', 'app.mjs'];
  const fingerprint = createHash('sha256');
  fingerprint.update(siteUrl);
  fingerprint.update(bootstrap);
  for (const file of clientFiles) fingerprint.update(await readFile(path.join(root, 'src', file)));
  for (const file of publicFiles) fingerprint.update(await readFile(path.join(root, 'public', file)));
  const version = fingerprint.digest('hex').slice(0, 12);
  const assetPaths = [...clientFiles.map(file => `${basePath}/${file}`), ...publicFiles.map(file => `${basePath}/${file.replaceAll('\\', '/')}`)].sort((a, b) => b.length - a.length);
  const versionAssets = text => assetPaths.reduce((content, asset) => content.replaceAll(asset, asset + '?v=' + version), text);
  site.telephoneDisplay = site.telephone.match(/.{2}/g).join(' ');
  site.telephoneInternational = '+33' + site.telephone.slice(1);
  const address = `${site.address.streetAddress}, ${site.address.postalCode} ${site.address.addressLocality}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const siteTokens = { SITE_NAME: site.name, SITE_URL: siteUrl, BASE_PATH: basePath, PHONE: site.telephone, PHONE_DISPLAY: site.telephoneDisplay, ADDRESS: address, STREET: site.address.streetAddress, CITY: site.address.addressLocality, POSTAL_CODE: site.address.postalCode, DIRECTIONS_URL: directions };
  const resolveSiteTokens = text => text.replace(/\{\{([A-Z_]+)\}\}/g, (token, name) => Object.hasOwn(siteTokens, name) ? String(siteTokens[name]) : token);
  icons.MOON_ICON = svg('<path class="moon-icon" d="M20 15a8 8 0 0 1-11-11 9 9 0 1 0 11 11Z"/>');
  icons.SUN_ICON = svg('<g class="sun-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></g>');
  // dist/ est généré : ne pas conserver de fichiers retirés des sources.
  if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== destination) throw new Error('Dossier de sortie hors du projet.');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(root, 'public'), output, { recursive: true });
  for (const definition of pageDefinitions) {
    const page = { ...definition, title: resolveSiteTokens(definition.title), description: resolveSiteTokens(definition.description) };
    const { file, title, description } = page;
    let content = await readFile(path.join(root, `src/${file}.html`), 'utf8');
    content = content.replace('{{MENU}}', () => menu.map((pizza, i) => menuCard(pizza, i === 0, 2, basePath)).join('\n'));
    content = content.replace('{{MENU_PREVIEW}}', () => [menu[0], menu[2], menu[3]].filter(Boolean).map(pizza => menuCard(pizza, false, 3, basePath)).join('\n'));
    const prioritySource = content.match(/<picture data-priority-image>([\s\S]*?)<\/picture>/)?.[1].match(/<source\b[^>]*>/)?.[0];
    const prioritySrcset = prioritySource?.match(/srcset="([^"]+)"/)?.[1];
    const prioritySizes = prioritySource?.match(/sizes="([^"]+)"/)?.[1];
    const preload = prioritySrcset && prioritySizes ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${prioritySrcset}" imagesizes="${prioritySizes}" fetchpriority="high">` : '';
    content = content.replace('{{SOURCE_LINKS}}', () => menu.map(pizza => {
      const url = new URL(pizza.source);
      if (url.protocol !== 'https:' || url.hostname !== 'www.delarte.fr') throw new Error('Source de recette non autorisée.');
      return `<li><a href="${escapeHtml(url.href)}" rel="noreferrer">${escapeHtml(pizza.name)}</a></li>`;
    }).join('\n'));
    const navigation = pageDefinitions.filter(item => item.indexable).map(item => `<a href="${basePath}${item.route}"${page.route === item.route ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`).join('\n');
    const tokens = { ...siteTokens, TITLE: title, DESCRIPTION: description, ROBOTS: preview || !page.indexable ? 'noindex, follow' : 'index, follow, max-image-preview:large', CANONICAL: `${siteUrl}${page.route}`, MENU_COUNT: menu.length };
    let html = layout.replace('{{CONTENT}}', () => content).replace('{{NAVIGATION}}', () => navigation)
      .replace('{{THEME_INIT}}', () => bootstrap)
      .replace('{{LCP_PRELOAD}}', () => preload)
      .replace('{{STRUCTURED_DATA}}', () => file === '404' ? '' : structuredData(site, page, siteUrl));
    html = html.replace('{{CSP_META}}', () => escapeHtml(policy.meta));
    for (const [name, value] of Object.entries(tokens)) html = html.replaceAll(`{{${name}}}`, () => escapeHtml(value));
    for (const [name, icon] of Object.entries(icons)) html = html.replaceAll(`{{${name}}}`, icon);
    html = versionAssets(html);
    if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error(`Marqueur de génération non résolu dans ${file}.`);
    const filePath = page.route === '/' ? path.join(output, 'index.html') : file === '404' ? path.join(output, '404.html') : path.join(output, page.route.slice(1), 'index.html');
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, html);
  }
  const styles = (await readFile(path.join(root, 'src/styles.css'), 'utf8')).replaceAll('{{BASE_PATH}}', basePath);
  await writeFile(path.join(output, 'styles.css'), versionAssets(styles));
  await cp(path.join(root, 'src/app.mjs'), path.join(output, 'app.mjs'));
  await writeFile(path.join(output, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageDefinitions.filter(page => page.indexable).map(page => `<url><loc>${escapeHtml(siteUrl + page.route)}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(path.join(output, 'sitemap.xml'), sitemap);
  await writeFile(path.join(output, '.nojekyll'), '');
  const prefixPath = pathname => `${basePath}${pathname}`;
  const cacheRules = ['/images/*', '/fonts/*.woff2', '/styles.css', '/app.mjs'].map(pattern => `${prefixPath(pattern)}\n  Cache-Control: public, max-age=31536000, immutable\n`).join('\n');
  const pageCacheRules = pageDefinitions.map(page => `${prefixPath(page.route)}\n  Cache-Control: no-cache\n`).join('\n');
  await writeFile(path.join(output, '_headers'), `${prefixPath('/*')}\n  Content-Security-Policy: ${policy.header}\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: no-referrer\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n${preview ? '  X-Robots-Tag: noindex, follow\n' : ''}\n${cacheRules}\n${pageCacheRules}`);
  const redirects = pageDefinitions.filter(page => page.route.endsWith('/')).map(page => `${prefixPath(page.file === 'index' ? '/index.html' : `/${page.file}.html`)} ${prefixPath(page.route)} 301`).join('\n');
  await writeFile(path.join(output, '_redirects'), `${redirects}\n`);
  return { pages: pageDefinitions.length, pizzas: menu.length, preview, directory: output };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build();
  console.log(`Le Verone : ${result.pages} pages, ${result.pizzas} pizzas. Fichiers générés dans dist/.`);
}
