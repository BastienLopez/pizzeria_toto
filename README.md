# Le Verone

Site vitrine en français de la pizzeria Le Verone, 123 rue de Venise, 51100 Reims, préparé pour https://bastienlopez.github.io/pizzeria_toto/. HTML, CSS et JavaScript natifs, générateur Node.js : aucune dépendance npm de production.

## Pages
- / : présentation du restaurant, photos culinaires, adresse, téléphone et aperçu de la carte.
- /la-carte/ : huit pizzas, filtres tomate / crème combinables avec végétarien et fiches détaillées.
- /infos-pratiques/ : adresse, itinéraire, téléphone, horaires à confirmer et FAQ.
- /mentions-legales/, /confidentialite/, /cgu/, /credits/ : informations de la démonstration.
- Une vraie réponse 404 avec page personnalisée. Le serveur local redirige les anciennes URL .html vers les routes canoniques ; ce comportement reste à vérifier sur GitHub Pages.

## Démarrer
Node.js 22.12 ou supérieur ; testé sous Windows avec Node.js 24.22.1. Aucun npm install nécessaire pour lancer le site ; les tests navigateur utilisent les dépendances de développement verrouillées.

~~~sh
npm run dev
~~~

Ouvrir http://127.0.0.1:4173/pizzeria_toto/. Les sources sont surveillées ; recharger le navigateur après modification. Arrêter avec Ctrl+C.

~~~sh
npm run check
npm test
npm run build
npm run preview
~~~

- dev et preview génèrent dans .preview/ et restent non indexables.
- build génère dans dist/ une version préparée à l’indexation pour https://bastienlopez.github.io/pizzeria_toto/ : trois pages principales indexables, pages légales provisoires et 404 en noindex.
- Les tests Node génèrent dans .test-site/ et utilisent une copie temporaire pour le contrat des coordonnées. Les tests navigateur construisent et servent dist/ ; ne pas lancer un autre build en même temps. L’aperçu utilise .preview/.
- Ces trois dossiers sont générés et remplaçables. Ne pas les modifier ni y conserver de contenu source.
- Le serveur fourni écoute uniquement sur 127.0.0.1 ; il sert à la prévisualisation, pas à héberger publiquement le restaurant.
- Redémarrer le serveur après une modification des scripts de génération ou de politique HTTP.

## Sources canoniques

| Fichier | Rôle |
| --- | --- |
| data/site.json | Nom, URL de base incluant le chemin du dépôt, téléphone, adresse et état des informations fournies |
| data/menu.json | Identifiants, noms, descriptions, bases, classement végétarien, prix d’exemple et sources |
| src/layout.html | Navigation commune, pied de page et métadonnées |
| src/index.html, src/la-carte.html, src/infos-pratiques.html | Contenus des trois pages principales |
| src/styles.css | Tokens, palette, thèmes, responsive et états |
| src/theme-init.js | Initialisation du thème et du mode JS avant le premier affichage |
| src/app.mjs | Menu mobile, choix du thème, filtres et dialogue |
| scripts/build.mjs | Routes, rendu, SEO, sitemap, robots, empreintes des assets et configuration d’hébergement |
| scripts/security-policy.mjs | Politique CSP partagée et empreinte SHA-256 du bootstrap |
| scripts/serve.mjs | Serveur local, redirections, confinement des fichiers, cache et Brotli |
| scripts/audit-lighthouse.mjs | Audit local reproductible des trois pages, dans les deux thèmes et profils |
| scripts/check-dist.mjs | Contrôle du livrable, domaine Pages et budgets de ressources |
| tests/site.test.mjs | 24 tests Node.js |
| playwright.config.mjs, tests/browser/site.spec.mjs | 78 vérifications Chromium / WebKit, clair / sombre |
| .github/workflows/ | CI Linux / Windows et livraison automatique GitHub Pages sur push à main |
| public/images/, public/fonts/ | Photos AVIF / WebP, aperçu social, polices locales et licences |

La préférence clair / sombre est la seule donnée conservée dans localStorage, sous verone-theme. Aucun compte, formulaire, cookie, paiement, panier, publicité ou outil de mesure d’audience. Sans choix, le thème suit l’appareil ; le stockage refusé n’empêche pas la navigation.

## Remplacer les photos
Les WebP sont les sources actuelles. Pour chaque identifiant de data/menu.json, remplacer les fichiers public/images/identifiant-360.webp et identifiant-600.webp, puis régénérer les AVIF correspondants :

~~~sh
python scripts/create-brand-assets.py --avif-only
npm run build
~~~

La régénération nécessite un Pillow avec prise en charge AVIF ; elle est facultative pour lancer ou construire le site puisque les variantes sont fournies. Les navigateurs compatibles choisissent AVIF, les autres conservent WebP. Ne pas conserver d’anciennes variantes AVIF après un remplacement des WebP : elles seraient encore sélectionnées par le navigateur.

Margherita apparaît dans le hero et la carte ; Parma e bufala apparaît dans la section restaurant. Adapter les alt si la photographie ou la composition change. Le script sans --avif-only régénère aussi l’icône Apple et l’image sociale. Le build versionne les URL des assets d’après leur contenu ; les fichiers HTML restent sans cache long.

## Lighthouse
Dans un premier terminal PowerShell :

~~~powershell
$env:PORT='4174'
node scripts/serve.mjs --audit
~~~

Dans un second terminal :

~~~sh
npm exec --yes --package=lighthouse@13.6.0 -- node scripts/audit-lighthouse.mjs
~~~

Chrome doit être installé ; CHROME_PATH permet de désigner son exécutable si nécessaire. L’outil lance un navigateur headless de test, force chaque préférence clair / sombre et vérifie le thème réellement obtenu. Rapports JSON / HTML et résumé : .codex/qa/lighthouse/. Ces fichiers restent locaux et sont ignorés par Git.

Le mode --audit sert le build de production sur loopback sans noindex HTTP, pour mesurer les métadonnées destinées à la production. Il ne publie rien. Les mesures sont séquentielles pour éviter la contention entre audits.

## Données de démonstration et lancement professionnel
Photos Del Arte temporaires et tarifs fictifs clairement annoncés. Ni partenariat ni licence commerciale des photos revendiqués. Aucun cliché réel de l’intérieur du restaurant, témoignage, label, historique ou garantie d’allergènes inventé.

À finaliser : droits / remplacement des photos, recettes et tarifs réels, composition des fromages et allergènes, horaires, identité juridique et e-mail professionnel. Les mentions contiennent des exemples juridiques explicitement fictifs demandés pour la maquette. GitHub Pages a été choisi ; ses paramètres réels et les informations contractuelles restent à vérifier. L’adresse et le domaine ont été fournis par le propriétaire ; ils ne remplacent pas ces informations.

Le dossier dist/ est préparé pour https://bastienlopez.github.io/pizzeria_toto/, avec canonical, Open Graph absolu, JSON-LD Restaurant et sitemap pour les trois pages principales. `robots.txt` est publié sous le chemin du projet ; ce dépôt ne contrôle pas le fichier robots à la racine de l’hôte. Cette préparation ne prouve pas un déploiement, une propriété Search Console ni une indexation.

Aucun commit, push, fetch, déploiement, DNS ou changement distant effectué.

## Tests et CI/CD
La CI vérifie chaque push et pull request : syntaxe, 24 tests Node, build, budgets, audit npm et 78 vérifications navigateur. Les deux dépendances de test sont épinglées et n’ajoutent rien au JavaScript livré.

~~~sh
npm ci --ignore-scripts
npx --no-install playwright install chromium webkit
npm run validate
npm run test:e2e
~~~

Chaque push sur `main` déclenche **Livraison GitHub Pages**. Le workflow réexécute la CI sur le commit poussé et ne publie que l’artefact validé ; un lancement manuel reste disponible dans Actions. Il exige l’URL Pages `https://bastienlopez.github.io/pizzeria_toto`. Dans Settings > Pages, la source doit être GitHub Actions et aucun domaine personnalisé ne doit remplacer cette URL. Les présentes modifications sont locales : elles ne seront utilisées qu’après leur push ; aucune publication n’a été déclenchée ici.

Voir [déclencheurs, droits, tests et limites Pages](docs/CI_CD.md). Aucun fichier CNAME n’est généré pour ce site de projet. Les règles _headers / _redirects du serveur local ne sont pas appliquées par ce workflow Pages.

## Rapports
- [Axes d’amélioration prioritaires](docs/AMELIORATIONS.md)
- [Tests et CI/CD GitHub Pages](docs/CI_CD.md)
- [Audit complet et résultats](docs/AUDIT_COMPLET.md)
- [Validation locale](docs/VALIDATION.md)
- [SEO et procédure Search Console](docs/SEO_REFERENCEMENT.md)
- [Matrice anti-vibecode de 94 contrôles](anti-vibecode-audit.md)
- [Modèle de menace local](.security-audit/threat-model.md)
- [Rapport local web-security-audit](.security-audit/report.md)
