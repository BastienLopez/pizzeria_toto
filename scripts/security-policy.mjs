import { createHash } from 'node:crypto';

// Une seule politique pour le HTML, le serveur et le fichier d’hébergement.
export function contentSecurityPolicy(bootstrap = '') {
  const normalized = bootstrap.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const hash = normalized ? ` 'sha256-${createHash('sha256').update(normalized).digest('base64')}'` : '';
  const meta = `default-src 'self'; script-src 'self'${hash}; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'`;
  return { meta, header: `${meta}; frame-ancestors 'none'` };
}

export function policyForDocument(bytes) {
  const bootstrap = bytes.toString('utf8').match(/<script data-theme-init>([\s\S]*?)<\/script>/)?.[1] ?? '';
  return contentSecurityPolicy(bootstrap).header;
}
