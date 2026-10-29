const themeToggle = document.querySelector('[data-theme-toggle]');
if (themeToggle) {
  const syncThemeControl = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? 'Activer le thème clair' : 'Activer le thème sombre');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#1D211C' : '#FFF8EF';
  };
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themePreference = 'explicit';
    try { localStorage.setItem('verone-theme', theme); } catch { /* La navigation reste utilisable si le stockage est bloqué. */ }
    syncThemeControl();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (document.documentElement.dataset.themePreference === 'explicit') return;
    document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
    syncThemeControl();
  });
  syncThemeControl();
  themeToggle.hidden = false;
}

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (toggle && navigation) {
  toggle.hidden = false;
  const closeNavigation = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.sr-only').textContent = 'Ouvrir le menu';
    navigation.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    navigation.classList.toggle('is-open', open);
    if (open) navigation.querySelector('a')?.focus();
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeNavigation();
  });
}

const controls = document.querySelector('[data-menu-controls]');
if (controls) {
  const cards = [...document.querySelectorAll('.pizza-card')];
  const baseButtons = [...document.querySelectorAll('[data-base-filter]')];
  const vegetarian = document.querySelector('#vegetarian-filter');
  const reset = document.querySelector('.filter-reset');
  const count = document.querySelector('#pizza-count');
  const empty = document.querySelector('#menu-empty');
  let currentBase = 'all';

  const filterMenu = () => {
    let visible = 0;
    for (const card of cards) {
      card.hidden = !((currentBase === 'all' || card.dataset.base === currentBase)
        && (!vegetarian.checked || card.dataset.vegetarian === 'true'));
      if (!card.hidden) visible += 1;
    }
    for (const button of baseButtons) button.setAttribute('aria-pressed', String(button.dataset.baseFilter === currentBase));
    count.textContent = `${visible} pizza${visible === 1 ? '' : 's'} à découvrir`;
    reset.hidden = currentBase === 'all' && !vegetarian.checked;
    empty.hidden = visible !== 0;
  };
  for (const button of baseButtons) {
    button.addEventListener('click', () => {
      currentBase = button.dataset.baseFilter;
      filterMenu();
    });
  }
  vegetarian.addEventListener('change', filterMenu);
  reset.addEventListener('click', () => {
    currentBase = 'all';
    vegetarian.checked = false;
    filterMenu();
    baseButtons[0].focus();
  });
  // Certains navigateurs restaurent l’état des cases après un retour arrière.
  window.addEventListener('pageshow', filterMenu);
  filterMenu();
  controls.hidden = false;
}

const dialog = document.querySelector('#pizza-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  const close = dialog.querySelector('.dialog-close');
  for (const button of document.querySelectorAll('[data-pizza-details]')) {
    button.hidden = false;
    button.addEventListener('click', () => {
      const card = button.closest('.pizza-card');
      const picture = card.querySelector('picture').cloneNode(true);
      picture.className = 'dialog-photo';
      picture.removeAttribute('data-priority-image');
      for (const source of picture.querySelectorAll('[sizes]')) source.setAttribute('sizes', '(min-width: 760px) 450px, 92vw');
      const image = picture.querySelector('img');
      image.id = 'dialog-image';
      image.loading = 'eager';
      image.removeAttribute('fetchpriority');
      dialog.querySelector('.dialog-photo').replaceWith(picture);
      dialog.querySelector('#dialog-title').textContent = card.querySelector('.pizza-name').textContent;
      dialog.querySelector('#dialog-description').textContent = card.querySelector('.pizza-description').textContent;
      dialog.querySelector('#dialog-price').textContent = card.querySelector('.pizza-price').textContent;
      const badges = [...card.querySelectorAll('.pizza-badge')].map(badge => badge.textContent.trim());
      dialog.querySelector('#dialog-base').textContent = [card.querySelector('.pizza-base').textContent, ...badges].join(' · ');
      document.body.classList.add('dialog-open');
      dialog.showModal();
    });
  }
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
}
