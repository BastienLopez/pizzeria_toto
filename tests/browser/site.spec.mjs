import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const site = JSON.parse(await readFile(new URL('../../data/site.json', import.meta.url), 'utf8'));
const basePath = new URL(site.siteUrl).pathname.replace(/\/+$/, '');
const sitePath = route => `${basePath}${route}`;
const routes = [sitePath('/'), sitePath('/la-carte/'), sitePath('/infos-pratiques/')];

test('la navigation mène aux pages et le menu mobile rend le focus après Échap', async ({ page, isMobile }) => {
  await page.goto(sitePath('/'));
  const navigation = page.getByRole('navigation', { name: 'Navigation principale', exact: true });
  if (isMobile) {
    const menu = page.locator('button[aria-controls="navigation"]');
    await menu.click();
    await expect(menu).toHaveAccessibleName('Fermer le menu');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(navigation.getByRole('link', { name: 'Le restaurant', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toHaveAccessibleName('Ouvrir le menu');
    await expect(menu).toBeFocused();
    await menu.click();
  }
  await navigation.getByRole('link', { name: 'La carte', exact: true }).click();
  await expect(page).toHaveURL(/\/la-carte\/$/);
  await expect(page.locator('#navigation [aria-current="page"]')).toHaveText('La carte');
  if (isMobile) await page.getByRole('button', { name: 'Ouvrir le menu', exact: true }).click();
  await navigation.getByRole('link', { name: 'Infos pratiques', exact: true }).click();
  await expect(page).toHaveURL(/\/infos-pratiques\/$/);
  await expect(page.locator('#navigation [aria-current="page"]')).toHaveText('Infos pratiques');
});

test('les filtres se combinent et la réinitialisation restaure les huit pizzas', async ({ page }) => {
  await page.goto(sitePath('/la-carte/'));
  const cards = page.locator('.pizza-card:visible');
  const vegetarian = page.getByRole('checkbox', { name: 'Végétariennes', exact: true });
  const all = page.getByRole('button', { name: 'Toutes les pizzas', exact: true });
  await expect(cards).toHaveCount(8);
  await page.getByRole('button', { name: 'Base tomate', exact: true }).click();
  await expect(cards).toHaveCount(4);
  await vegetarian.check();
  await expect(cards).toHaveCount(1);
  await expect(cards.getByRole('heading')).toHaveText('Margherita');
  await expect(page.getByRole('status')).toHaveText('1 pizza à découvrir');
  await page.getByRole('button', { name: 'Base crème', exact: true }).click();
  await expect(cards).toHaveCount(1);
  await expect(cards.getByRole('heading')).toHaveText('Quattro formaggi');
  await all.click();
  await expect(cards).toHaveCount(2);
  await page.getByRole('button', { name: /Réinitialiser les filtres/ }).click();
  await expect(cards).toHaveCount(8);
  await expect(vegetarian).not.toBeChecked();
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await expect(all).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('8 pizzas à découvrir');
  await expect(page.getByRole('button', { name: /Réinitialiser les filtres/ })).toBeHidden();
});

test('la fiche pizza est accessible au clavier, se ferme et rend le focus', async ({ page }) => {
  await page.goto(sitePath('/la-carte/'));
  const opener = page.getByRole('button', { name: 'Découvrir la pizza Regina', exact: true });
  await opener.focus();
  await opener.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Regina', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('#dialog-description')).toHaveText('Sauce tomate, mozzarella, jambon et champignons.');
  await expect(dialog.getByRole('link', { name: 'Appeler pour cette pizza' })).toHaveAttribute('href', 'tel:' + site.telephone);
  await expect(dialog.getByRole('button', { name: 'Fermer la fiche pizza' })).toBeFocused();
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await opener.press('Enter');
  await page.getByRole('button', { name: 'Fermer la fiche pizza' }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('la fiche fermée ne télécharge aucune image supplémentaire et affiche le bon visuel à l’ouverture', async ({ page }, testInfo) => {
  const requests = [];
  page.on('request', request => { if (/\/images\/[^?]+\.(?:avif|webp)(?:\?|$)/.test(request.url())) requests.push(request.url()); });
  await page.goto(sitePath('/la-carte/'));
  await expect(page.locator('[data-pizza-details]').first()).toBeVisible();
  const firstImage = page.locator('.pizza-card img').first();
  await expect.poll(() => firstImage.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  const selectedSource = await firstImage.evaluate(image => image.currentSrc);
  expect([...new Set(requests.filter(url => /\/margherita-/.test(url)))]).toEqual([selectedSource]);
  const format = selectedSource.includes('.avif') ? 'avif' : 'webp';
  const unnecessaryFallbacks = () => requests.filter(url => /\.webp(?:\?|$)/.test(url));
  if (format === 'avif') expect(unnecessaryFallbacks()).toEqual([]);
  await page.getByRole('button', { name: 'Découvrir la pizza Regina', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Regina', exact: true });
  const image = dialog.locator('img');
  await expect(image).toHaveAttribute('alt', /^Pizza Regina,/);
  await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  await expect.poll(() => image.evaluate(element => element.currentSrc)).toMatch(new RegExp(`regina-(360|600)\\.${format}`));
  if (format === 'avif') expect(unnecessaryFallbacks()).toEqual([]);
  await page.getByRole('button', { name: 'Fermer la fiche pizza' }).click();
  await page.getByRole('button', { name: 'Découvrir la pizza Quattro formaggi', exact: true }).click();
  const nextImage = page.getByRole('dialog', { name: 'Quattro formaggi', exact: true }).locator('img');
  await expect(nextImage).toHaveAttribute('alt', /^Pizza Quattro formaggi,/);
  await expect.poll(() => nextImage.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  await expect.poll(() => nextImage.evaluate(element => element.currentSrc)).toMatch(new RegExp(`quattro-formaggi-(360|600)\\.${format}`));
  if (format === 'avif') expect(unnecessaryFallbacks()).toEqual([]);
  await testInfo.attach('images-dialogue', { body: JSON.stringify({ format, selectedSource, requests }, null, 2), contentType: 'application/json' });
});

test('les liens de navigation gardent une cible tactile de 44 px sur tablette', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1000 });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const links = page.locator('#navigation > a:not(.button)');
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      await expect(link).toBeVisible();
      const rect = await link.boundingBox();
      // Tolérance sous-pixel uniquement ; une cible de 42 px échoue.
      expect(rect.width, await link.textContent()).toBeGreaterThanOrEqual(43.9);
      expect(rect.height, await link.textContent()).toBeGreaterThanOrEqual(43.9);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('le thème suit l’appareil puis conserve le choix explicite entre les pages', async ({ page }, testInfo) => {
  const initial = testInfo.project.use.colorScheme;
  const opposite = initial === 'dark' ? 'light' : 'dark';
  await page.goto(sitePath('/'));
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', initial);
  await page.emulateMedia({ colorScheme: opposite });
  await expect(html).toHaveAttribute('data-theme', opposite);
  await page.locator('[data-theme-toggle]').click();
  await expect(html).toHaveAttribute('data-theme', initial);
  await page.emulateMedia({ colorScheme: initial });
  await page.emulateMedia({ colorScheme: opposite });
  await expect(html).toHaveAttribute('data-theme', initial);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', initial);
  await page.goto(sitePath('/infos-pratiques/'));
  await expect(html).toHaveAttribute('data-theme', initial);
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute('aria-pressed', String(initial === 'dark'));
});

test('le stockage refusé ne casse ni le thème ni la carte', async ({ page, context }, testInfo) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Stockage refusé par le test', 'SecurityError'); } });
  });
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  await page.goto(sitePath('/la-carte/'));
  await expect(page.locator('html')).toHaveAttribute('data-theme', testInfo.project.use.colorScheme);
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', testInfo.project.use.colorScheme === 'dark' ? 'light' : 'dark');
  await page.getByRole('button', { name: 'Base crème', exact: true }).click();
  await expect(page.locator('.pizza-card:visible')).toHaveCount(4);
  expect(failures).toEqual([]);
});

test('les pages principales chargent sans erreur ni débordement horizontal', async ({ page }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-theme-toggle]')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
    expect(geometry.content, route).toBeLessThanOrEqual(geometry.width);
    const image = page.locator('main img').first();
    if (await image.count()) await expect.poll(() => image.evaluate(element => element.naturalWidth)).toBeGreaterThan(0);
  }
  expect(failures).toEqual([]);
});

test('la FAQ s’ouvre et se referme au clavier', async ({ page }) => {
  await page.goto(sitePath('/infos-pratiques/'));
  const question = page.locator('summary').filter({ hasText: 'Comment passer commande ?' });
  const answer = page.locator('details').filter({ has: question });
  await question.focus();
  await question.press('Enter');
  await expect(answer).toHaveAttribute('open', '');
  await expect(answer.locator('p')).toBeVisible();
  await question.press('Enter');
  await expect(answer).not.toHaveAttribute('open');
  await expect(question).toBeFocused();
});

for (const route of routes) {
  test(`accessibilité automatique WCAG A / AA : ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.locator('[data-theme-toggle]')).toBeVisible();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    await testInfo.attach('accessibilite', { body: JSON.stringify({ violations: result.violations, incomplete: result.incomplete }, null, 2), contentType: 'application/json' });
    expect(result.violations).toEqual([]);
  });
}

test.describe('consultation sans JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('la carte, la navigation et le téléphone restent accessibles', async ({ page }) => {
    await page.goto(sitePath('/la-carte/'));
    await expect(page.locator('.pizza-card:visible')).toHaveCount(8);
    await expect(page.getByRole('navigation', { name: 'Navigation principale', exact: true })).toBeVisible();
    await expect(page.locator('[data-menu-controls]')).toBeHidden();
    await expect(page.locator('[data-theme-toggle]')).toBeHidden();
    await expect(page.locator('[data-pizza-details]:visible')).toHaveCount(0);
    const phone = page.getByRole('navigation', { name: 'Navigation principale', exact: true }).getByRole('link', { name: 'On s’appelle ?', exact: true });
    await expect(phone).toBeVisible();
    await expect(phone).toHaveAttribute('href', 'tel:' + site.telephone);
  });
});
