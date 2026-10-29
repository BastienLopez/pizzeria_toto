# Tests, CI et livraison GitHub Pages

## Fonctionnement

`.github/workflows/ci.yml` s’exécute sur chaque push, pull request ou lancement manuel. `.github/workflows/deploy-pages.yml` s’exécute sur chaque push à `main` et appelle la CI réutilisable pour valider l’artefact exact avant la livraison ; un push à `main` a donc une CI de vérification et la validation liée à la livraison.

- `actionlint` valide les workflows ; son archive est épinglée en version 1.7.12 et vérifiée par SHA-256.
- La matrice Node couvre Linux 22 / 24 et Windows 24 : installation verrouillée, syntaxe, 24 tests Node, génération et contrôle du livrable.
- L’audit npm inclut les dépendances de test et bloque à partir du niveau Moderate.
- Playwright lance 13 scénarios sur six profils : Chromium desktop, Chromium mobile et WebKit mobile, chacun en clair et sombre, soit 78 vérifications. Aucun retry automatique ; `test.only` est interdit en CI.
- Les scénarios couvrent navigation, filtres combinés, dialogue au clavier, retour du focus, thème système / persistance / stockage refusé, chargement, FAQ, consultation sans JavaScript et accessibilité automatique axe A / AA. Ils vérifient aussi les téléchargements de la fiche pizza, ses variantes AVIF / WebP et les cibles de navigation de 44 px à 768 px.
- Le test Node du contrat des coordonnées reconstruit une copie temporaire avec d’autres nom, adresse, domaine et téléphone ; tous les appels et les métadonnées doivent suivre cette configuration. Les exemples juridiques fictifs restent hors des données structurées.
- Le site validé est conservé dans l’artefact `verone-dist` pendant 7 jours. Le rapport Playwright, les résultats axe et les traces / captures d’échec sont conservés pendant 14 jours dans `verone-playwright`.

Les actions GitHub officielles sont épinglées sur leur SHA de commit. La CI utilise uniquement `contents: read` et ne conserve pas les credentials de checkout. Les droits Pages et OIDC d’écriture sont limités au job de publication. Aucun PAT ou secret manuel n’est nécessaire.

## Contrôle du livrable

`scripts/check-dist.mjs` refuse une version d’aperçu, un domaine incorrect, un fichier inattendu, un fichier `.env`, un lien symbolique et les dépassements suivants :

| Ressource | Plafond |
| --- | ---: |
| CSS | 45 Kio |
| JavaScript navigateur | 12 Kio |
| Une image AVIF | 100 Kio |
| Dossier publié complet | 3 Mio |

Ces limites gardent une marge au-dessus du site actuel et détectent une régression de poids. Elles ne mesurent pas les Core Web Vitals. Une évolution justifiant un nouveau plafond doit être examinée avec son effet réel sur le chargement.

Le build produit `.nojekyll` et ne génère pas de `CNAME` : le site utilise l’URL standard d’un dépôt GitHub Pages de projet. Le contrôle vérifie les fichiers attendus, mais ne remplace pas une recherche de secrets dans l’historique du dépôt.

## Exécuter localement

Node.js >= 22.12 ; validation locale effectuée avec Node.js 24.22.1 sous Windows.

~~~sh
npm ci --ignore-scripts
npx --no-install playwright install chromium webkit
npm run validate
npm run test:e2e
~~~

Sur Linux, utiliser `playwright install --with-deps chromium webkit` si les bibliothèques système manquent. La CI le fait explicitement. Les navigateurs sont ceux verrouillés par Playwright 1.64.1 ; axe est verrouillé en 4.14.0. Ces outils sont des dépendances de développement ; le site n’a aucune dépendance npm de production.

Playwright démarre son propre serveur sur `127.0.0.1:4175` et refuse de réutiliser un serveur déjà présent. L’aperçu utilisateur reste sur 4173. Ne pas lancer deux suites navigateur en même temps sur ce port, ni `npm run build` pendant une suite qui utilise `dist/`.

Pour consulter les résultats après un run :

~~~sh
npm run test:e2e:report
~~~

## Activer la livraison

La publication est automatique sur chaque push à `main` : `.github/workflows/deploy-pages.yml` appelle la CI, vérifie l’artefact de ce run et publie seulement si toutes les étapes réussissent. La CI indépendante reste visible pour le push. `workflow_dispatch` reste disponible pour relancer une livraison manuellement. Les pull requests et les autres branches ne sont pas publiées.

Le site contient encore des photos temporaires, des tarifs fictifs et des exemples juridiques. Ils seront publiés avec chaque push à `main` jusqu’à leur remplacement.

1. Pousser les modifications sur `main`. Le dépôt utilise déjà le workflow GitHub Actions ; la première livraison réelle doit confirmer ses permissions et sa configuration.
2. Dans Settings > Pages, garder GitHub Actions comme source. La disponibilité pour un dépôt privé dépend du plan GitHub.
3. Retirer le domaine personnalisé `verone.fr` s’il est encore renseigné. Le livrable et le contrôle Pages exigent `https://bastienlopez.github.io/pizzeria_toto`, sans slash final.
4. Vérifier que l’environnement `github-pages` autorise la branche par défaut. Des restrictions ou approbations configurées dans GitHub peuvent bloquer ou mettre en attente le job ; elles ne sont pas modifiées par ces fichiers.
5. Pour une relance manuelle, ouvrir Actions > **Livraison GitHub Pages** > Run workflow sur `main`.

La livraison refuse les autres branches, exécute toute la CI sur le commit poussé, récupère son artefact, compare l’URL annoncée par Pages à `siteUrl`, recontrôle `dist/`, puis publie cet artefact. Un échec en amont empêche le job de publication. Les publications ne s’exécutent pas simultanément.

Le build adapte liens, images, polices, canonicals, données structurées et sitemap au préfixe `/pizzeria_toto/`. Le site demeure à l’URL GitHub Pages de projet ; il ne configure pas de domaine DNS personnalisé.

Références : [workflows Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [source de publication et CNAME](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [domaine personnalisé](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Limites et contrôle après publication

Le workflow Pages ne traite pas `_headers` et `_redirects`. Les en-têtes HTTP et les redirections 301 contrôlés sur le serveur Node local ne constituent donc pas une preuve de leur présence sur Pages. La CSP HTML reste dans chaque page ; les protections nécessitant un en-tête HTTP, les règles de cache et les anciennes URL devront être vérifiées sur l’hôte réel.

Après la première publication, vérifier les trois pages principales sous `/pizzeria_toto/`, CSS / images / polices, canonical, sitemap, réponse 404 et HTTPS. `robots.txt` est sous le chemin du projet ; les règles robots à la racine de `bastienlopez.github.io` ne sont pas configurées par ce dépôt. Suivre ensuite [la procédure Search Console](SEO_REFERENCEMENT.md). Aucun test distant de cette nouvelle version ni mesure de production n’a encore été effectué.

Résultats des correctifs du 29 octobre : syntaxe, 24 tests Node, 78 vérifications navigateur, build et contrôle des 56 fichiers publiables réussis ; npm audit à zéro. Le contrôle npm ci --ignore-scripts --dry-run passe, sans prétendre à une réinstallation complète. `actionlint` valide localement les deux workflows avec son contrôle ShellCheck désactivé sur Windows ; la CI Linux demande le contrôle shell complet. Les runners Linux / Node 22, GitHub Actions, les permissions du dépôt, le domaine et la publication effective restent **NON PROUVÉS** jusqu’à leur première exécution distante.

L’accessibilité automatique ne remplace pas une revue manuelle, un lecteur d’écran ou un téléphone physique. Douze Lighthouse ont été relancés après les corrections : performance 98–100, accessibilité / bonnes pratiques / SEO à 100 sur les pages principales. Voir CORRECTIONS_2026-10-29.md et lighthouse-corrections-2026-10-29.json pour le protocole et les limites.
