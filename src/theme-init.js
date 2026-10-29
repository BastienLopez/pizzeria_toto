// Petit script synchrone : appliquer le thème avant l’affichage des styles.
(() => {
  document.documentElement.classList.add('js');
  let saved;
  try { saved = localStorage.getItem('verone-theme'); } catch { /* Stockage refusé : préférence système. */ }
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved === 'dark' || saved === 'light' ? saved : systemDark ? 'dark' : 'light';
  document.documentElement.dataset.themePreference = saved === 'dark' || saved === 'light' ? 'explicit' : 'system';
})();
