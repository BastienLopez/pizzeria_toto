# Tests, CI et livraison GitHub Pages

## Fonctionnement

`.github/workflows/ci.yml` s’exécute sur push, pull request ou lancement manuel. Il est aussi réutilisé par la livraison Pages pour tester le commit exact à publier.

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

Le build produit `.nojekyll` et, en production, `CNAME` depuis `data/site.json`. Le contrôle vérifie les fichiers attendus, mais ne remplace pas une recherche de secrets dans l’historique du dépôt.

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

La publication est **manuelle** : `.github/workflows/deploy-pages.yml` ne réagit pas aux push. Aucun workflow distant, paramètre Pages ou DNS n’a été modifié pendant l’implémentation.

Après validation des photos, des tarifs, des horaires et des mentions légales :

1. Faire intégrer ces fichiers au dépôt par son propriétaire, puis vérifier la première exécution réelle de CI.
2. Dans Settings > Pages, choisir GitHub Actions comme source. La disponibilité pour un dépôt privé dépend du plan GitHub.
3. Vérifier la propriété du domaine et configurer `verone.fr` dans Pages avant de modifier le DNS. Suivre la procédure officielle pour les enregistrements adaptés ; aucun propriétaire GitHub ou enregistrement DNS n’est inventé ici.
4. Activer HTTPS lorsque le certificat est prêt. Le contrôle de livraison exige la base HTTPS `https://verone.fr`, sans sous-dossier.
5. Restreindre l’environnement `github-pages` à la branche par défaut. Les protections et éventuelles approbations se règlent dans GitHub ; elles ne sont pas créées par ces fichiers.
6. Depuis Actions, lancer **Livraison GitHub Pages**, en sélectionnant la branche par défaut.

La livraison refuse les autres branches, rejoue toute la CI, récupère son artefact validé, compare l’URL annoncée par Pages au domaine canonique, recontrôle `dist/`, puis publie cet artefact. Un échec en amont empêche le job de publication. Les publications ne s’exécutent pas simultanément.

Le fichier CNAME ne configure pas à lui seul le domaine dans GitHub. Cette version cible la racine de `verone.fr` : l’URL provisoire `https://proprietaire.github.io/depot/` n’est pas une cible compatible avec les liens absolus du site.

Références : [workflows Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [source de publication et CNAME](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [domaine personnalisé](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Limites et contrôle après publication

Le workflow Pages ne traite pas `_headers` et `_redirects`. Les en-têtes HTTP et les redirections 301 contrôlés sur le serveur Node local ne constituent donc pas une preuve de leur présence sur Pages. La CSP HTML reste dans chaque page ; les protections nécessitant un en-tête HTTP, les règles de cache et les anciennes URL devront être vérifiées sur l’hôte réel.

Après publication, vérifier les trois pages principales, CSS / images / polices, canonical, robots, sitemap, réponse 404 et version HTTPS du domaine. Suivre ensuite [la procédure Search Console](SEO_REFERENCEMENT.md). Aucun test distant de cette version ni mesure de production n’a encore été effectué.

Résultats des correctifs du 29 octobre : syntaxe, 24 tests Node, 78 vérifications navigateur, build et contrôle des 56 fichiers publiables réussis ; npm audit à zéro. Le contrôle npm ci --ignore-scripts --dry-run passe, sans prétendre à une réinstallation complète. `actionlint` valide localement les deux workflows avec son contrôle ShellCheck désactivé sur Windows ; la CI Linux demande le contrôle shell complet. Les runners Linux / Node 22, GitHub Actions, les permissions du dépôt, le domaine et la publication effective restent **NON PROUVÉS** jusqu’à leur première exécution distante.

L’accessibilité automatique ne remplace pas une revue manuelle, un lecteur d’écran ou un téléphone physique. Douze Lighthouse ont été relancés après les corrections : performance 98–100, accessibilité / bonnes pratiques / SEO à 100 sur les pages principales. Voir CORRECTIONS_2026-10-29.md et lighthouse-corrections-2026-10-29.json pour le protocole et les limites.
