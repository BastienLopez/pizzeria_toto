# Validation locale finale du Verone

28 octobre 2026, Windows, Node.js 24.22.1.

- PASS : npm ci --ignore-scripts, npm run validate : syntaxe, npm test (22 tests), génération de 8 pages et contrôle des 56 fichiers du livrable.
- PASS : npm run test:e2e, 66 vérifications sur Chromium desktop / mobile et WebKit mobile, dans les deux thèmes ; aucun test ignoré ni retry. Filtres, focus, thème, stockage refusé, FAQ, absence d’erreur / débordement, mode sans JavaScript et axe A / AA.
- PASS : actionlint 1.7.12 valide les deux workflows localement (contrôle ShellCheck désactivé sur Windows). La CI est préparée pour Linux Node 22 / 24 et Windows Node 24 ; livraison Pages manuelle après les mêmes validations.
- PASS : catalogue dans le HTML, carte distincte de l’accueil, titres / canonical / JSON-LD, routes actives, redirections, vraie 404, liens et fichiers de srcset.
- PASS : filtres tomate / crème + végétarien, réinitialisation, dialogue au clavier et retour de focus, menu mobile et FAQ.
- PASS : 18 contrôles responsive des pages principales (375 / 768 / 1440 px) et 20 contrôles des pages légales / 404 (375 / 1440 px), dans les deux thèmes, sans débordement ni titre principal manquant.
- PASS : préférence de thème système, choix enregistré, stockage refusé et modes clair / sombre ; bootstrap appliqué avant le contenu.
- PASS : sorties d’aperçu, production et tests séparées ; rejet de toute autre destination.
- PASS : politique CSP identique dans HTML, HTTP et _headers, empreinte SHA-256 exacte, pas de unsafe-inline, normalisation CRLF / BOM.
- PASS : confinement des fichiers, GET / HEAD, refus de POST et des traversées, ETag, cache versionné et refus de Brotli q=0.
- PASS : 12 Lighthouse 13.6.0 ; performances mobiles 99–100 et desktop 100 ; accessibilité automatique, bonnes pratiques et SEO à 100 sur chaque run ; CLS 0, LCP mobile maximal environ 2,12 s.
- PASS : audit HTML statique de 8 pages ; seules les 5 pages volontairement noindex (légal et 404) sont signalées, aucun doublon de titre / description / canonical.
- PASS : npm audit à zéro vulnérabilité signalée ; aucun paquet npm de production.
- PASS : observations HTTP locales sans alerte ; revue de sécurité source indépendante puis ciblée après optimisation.
- NON TESTÉ / NON PROUVÉ : production, HTTPS réel, configuration du futur hébergeur, propriété Search Console, indexation, CrUX / INP terrain, lecteur d’écran, appareil physique et appel réel.
- NON PROUVÉ : première exécution GitHub Actions et publication Pages, protections de l’environnement et configuration du domaine. La suite locale ne prouve pas les règles HTTP de Pages ; voir docs/CI_CD.md.
- INDISPONIBLES : Semgrep, Trivy et pip-audit.

Les parcours du navigateur complètent les tests de données : un test de classification des pizzas seul ne prouverait pas les filtres. Lighthouse ne certifie pas une conformité WCAG globale.

Rapports détaillés et limites : [audit complet](AUDIT_COMPLET.md), [SEO / Search Console](SEO_REFERENCEMENT.md), [anti-vibecode](../anti-vibecode-audit.md), [sécurité locale](../.security-audit/report.md).

Les captures de travail et rapports Lighthouse JSON / HTML sont conservés dans .codex/qa/, ignoré par Git. Les rapports Playwright sont dans playwright-report/ et test-results/, également ignorés. Aucun secret, modification distante ou publication. Les douze Lighthouse ci-dessus datent de l’audit initial, avant cette évolution des tests / CI ; aucun nouveau Lighthouse n’est revendiqué.

## Mise à jour — 29 octobre 2026

La livraison cible désormais `https://bastienlopez.github.io/pizzeria_toto/` et le workflow GitHub Pages se déclenche sur les pushes de `main`, après ses contrôles de validation. Cette mise à jour locale ne publie rien.

- PASS : `npm run validate` ; artefact contrôlé : 55 fichiers, 1 573 548 octets.
- PASS : `npm test`, 24/24 tests ; `npm run test:e2e`, 78/78 parcours dans six profils Chromium / WebKit, mobile / desktop et clair / sombre.
- PASS : `PAGES_URL=https://bastienlopez.github.io/pizzeria_toto npm run check:dist` ; chemins et URL Pages conformes, sans `CNAME`.
- PASS : `actionlint` sur les workflows CI et Pages ; `git diff --check` (avertissements Git habituels de conversion LF / CRLF sous Windows).
- PASS : audit SEO statique hors ligne des 8 pages générées, sans doublon de titre, description ou canonical ; les notices `noindex` concernent les pages légales et la 404 prévues.
- NON PROUVÉ : exécution GitHub Actions, publication distante, configuration Pages (notamment l’absence d’un domaine personnalisé résiduel), DNS, HTTPS, Search Console, indexation et données CrUX. L’URL distante doit être vérifiée après le push et le succès du workflow.
