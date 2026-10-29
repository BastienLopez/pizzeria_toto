import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { brotliCompressSync, constants } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { build, root, pageDefinitions } from './build.mjs';
import { contentSecurityPolicy, policyForDocument } from './security-policy.mjs';

export const securityHeaders = {
  'Content-Security-Policy': contentSecurityPolicy().header,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };

function acceptsBrotli(header = '') {
  return String(header).split(',').some(part => {
    const [encoding, ...parameters] = part.trim().split(';').map(value => value.trim());
    if (encoding.toLowerCase() !== 'br') return false;
    const qualityParameter = parameters.find(value => /^q\s*=/i.test(value));
    const quality = qualityParameter === undefined ? 1 : Number(qualityParameter.split('=')[1]);
    return Number.isFinite(quality) && quality > 0 && quality <= 1;
  });
}

export function createSiteServer({ preview = true, directory = preview ? '.preview' : 'dist' } = {}) {
  if (!['dist', '.preview', '.test-site'].includes(directory)) throw new Error('Dossier servi non autorisé.');
  const output = path.join(root, directory);
  return createServer(async (request, response) => {
    const headers = { ...securityHeaders, 'Cache-Control': 'no-cache' };
    if (preview) headers['X-Robots-Tag'] = 'noindex, follow';
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { ...headers, Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Méthode non autorisée.');
      return;
    }
    try {
      const url = new URL(request.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if (pathname.includes('\0') || pathname.includes('\\') || /(^|\/)\./.test(pathname)) throw new Error('Invalid path');
      const legacy = pageDefinitions.find(page => page.file !== '404' && (pathname === `/${page.file}.html` || pathname === `${page.route}index.html`));
      const withoutSlash = pageDefinitions.find(page => page.route !== '/' && page.route.endsWith('/') && pathname === page.route.slice(0, -1));
      const redirect = legacy?.route ?? withoutSlash?.route;
      if (redirect) { response.writeHead(301, { ...headers, Location: redirect + url.search }); response.end(); return; }
      if (preview && pathname === '/robots.txt') { response.writeHead(200, { ...headers, 'Content-Type': mime['.txt'] }); response.end(request.method === 'HEAD' ? undefined : 'User-agent: *\nDisallow: /\n'); return; }
      const page = pageDefinitions.find(page => page.route === pathname);
      const relative = page ? page.file === '404' ? '/404.html' : `${page.route}index.html` : pathname;
      const file = path.resolve(output, `.${relative}`);
      if (!file.startsWith(output + path.sep)) throw new Error('Invalid path');
      if (!(await stat(file)).isFile()) throw new Error('Not a file');
      let bytes = await readFile(file);
      const extension = path.extname(file);
      const type = mime[extension] ?? 'application/octet-stream';
      if (extension === '.html') headers['Content-Security-Policy'] = policyForDocument(bytes);
      if (['.webp', '.avif', '.jpg', '.png', '.woff2'].includes(extension)) headers['Cache-Control'] = 'public, max-age=86400';
      if (['.css', '.mjs', '.js', '.webp', '.avif', '.jpg', '.png', '.woff2', '.svg'].includes(extension) && /^[a-f0-9]{12}$/.test(url.searchParams.get('v') ?? '')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
      if (/^(text\/|application\/xml)/.test(type)) {
        headers.Vary = 'Accept-Encoding';
        if (acceptsBrotli(request.headers['accept-encoding'])) {
          bytes = brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } });
          headers['Content-Encoding'] = 'br';
        }
      }
      headers.ETag = `"${createHash('sha256').update(bytes).digest('hex').slice(0, 20)}"`;
      if (request.headers['if-none-match'] === headers.ETag) { response.writeHead(304, headers); response.end(); return; }
      response.writeHead(200, { ...headers, 'Content-Type': type, 'Content-Length': bytes.length });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      const body = await readFile(path.join(output, '404.html')).catch(() => Buffer.from('Page introuvable.'));
      headers['Content-Security-Policy'] = policyForDocument(body);
      response.writeHead(404, { ...headers, 'X-Robots-Tag': 'noindex, follow', 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': body.length });
      response.end(request.method === 'HEAD' ? undefined : body);
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const preview = !process.argv.includes('--audit');
  await build({ preview });
  const port = Number(process.env.PORT ?? 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT doit être un entier de 1 à 65535.');
  const server = createSiteServer({ preview });
  server.listen(port, '127.0.0.1', () => console.log(`Le Verone — http://127.0.0.1:${port}`));
  if (process.argv.includes('--watch')) {
    let timer;
    let building = false;
    let pending = false;
    const rebuild = async () => {
      if (building) { pending = true; return; }
      building = true;
      try { await build({ preview }); console.log('Site actualisé. Rechargez la page.'); }
      catch (error) { console.error('Génération interrompue :', error.message); }
      finally { building = false; if (pending) { pending = false; await rebuild(); } }
    };
    for (const directory of ['src', 'data', 'public']) {
      watch(path.join(root, directory), { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(rebuild, 120);
      });
    }
  }
}
