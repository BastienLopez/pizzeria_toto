# Correctifs et validation — Le Verone

29 octobre 2026. Modifications locales demandées après l’audit global. Aucun commit, push, workflow distant ou déploiement.

## Correctifs réalisés

| Demande | Réalisation | Preuve |
| --- | --- | --- |
| Image de la fiche fermée | Suppression de l’image initiale du dialogue. Le picture responsive de la pizza est repris seulement à l’ouverture ; formats AVIF / WebP, dimensions et versions de ressources conservés | Lighthouse à froid ne demande plus margherita-600.webp en plus de l’AVIF ; environ 74 166 octets de ressource évités sur la visite Chromium mesurée |
| Téléphone et métadonnées | data/site.json contient un seul numéro. Le build dérive l’affichage et le format international +33. Tous les tel, titres, descriptions, Open Graph et données structurées reprennent la configuration | Test d’intégration dans une copie temporaire : changement de nom, domaine, adresse et téléphone correctement répercuté dans huit pages ; métadonnées HTML et JSON-LD cohérentes |
| Cible tablette | Largeur minimale de 44 px ajoutée aux liens de navigation, hauteur minimale existante conservée | À 768 px, La carte mesure 44 × 44 px CSS dans les deux thèmes ; mesure CUA 43,992 due à l’arrondi sous-pixel, tolérance du test 0,1 px |
| Informations légales de démonstration | Société, statut, capital, immatriculation, direction et e-mail fictifs affichés avec une mention explicite ; GitHub Pages renseigné ; confidentialité mise à jour pour le choix d’hébergement et la collecte IP annoncée par GitHub | Les pages légales gardent noindex. Les exemples juridiques ne sont pas injectés dans les données structurées du restaurant |

Les coordonnées fournies du restaurant restent 123 rue de Venise, 51100 Reims et 0123456789. L’identité Le Verone Démo SAS, Camille Exemple, les identifiants à zéro et contact@example.invalid sont des exemples affichés comme fictifs. Ils ne constituent pas des informations professionnelles validées ni un contact réel. Horaires, prix réels et droits des photos restent à finaliser.

## Tests et contrôles

| Vérification | Résultat |
| --- | --- |
| npm run validate | PASS : syntaxe, 24 tests Node, build de huit pages / huit pizzas, contrôle du livrable |
| npm run test:e2e | PASS : 78/78, aucun retry ou test ignoré, Chromium desktop / mobile et WebKit mobile, clair / sombre |
| Tests de régression avant correction | Les nouveaux tests échouaient sur les anciennes sources : coordonnées / métadonnées, exemples légaux, image supplémentaire et cible tablette. Les deux tests navigateur finaux ont aussi été exécutés contre une copie des anciens composants : deux échecs attendus |
| Responsive | PASS : 54 passages, huit pages à 375 / 768 / 1440 px dans les deux thèmes et trois principales à 320 px dans les deux thèmes ; aucun débordement, H1 unique et cibles visibles contrôlées |
| Inspection visuelle | Fiches pizza sombre mobile et claire desktop, mentions, confidentialité et navigation tablette inspectées ; image adaptée, fermeture et appel accessibles |
| npm audit | PASS : zéro vulnérabilité déclarée ; aucune dépendance de production ajoutée |
| npm ci --ignore-scripts --dry-run | PASS : cohérence de l’installation verrouillée ; ne prouve pas une réinstallation complète |
| actionlint 1.7.12 | PASS sur les deux workflows ; ShellCheck désactivé localement sous Windows |
| Livrable final | PASS : 56 fichiers, 1 566 789 octets, sous les budgets ; aucune nouvelle dépendance |

La première suite complète a donné 76/78 : le nouveau test imposait à tort l’AVIF au WebKit de test, qui choisit le fallback WebP. L’exigence réelle porte sur l’absence de téléchargement supplémentaire et la bonne image dans le format pris en charge. Le test a été corrigé sur cette base, repassé sur les six profils et exécuté contre les anciennes sources pour vérifier qu’il détecte toujours la régression. La suite finale passe à 78/78. Cela ne constitue pas une conclusion sur les capacités d’un iPhone physique.

## SEO / GEO et données

- Huit pages construites contrôlées, sans doublon de titre, description ou canonical et sans marqueur non résolu.
- Trois pages principales indexables ; quatre pages légales / crédits et la 404 en noindex intentionnel ; sitemap limité aux trois URL canoniques https://verone.fr.
- Tous les liens tel utilisent le numéro configuré, y compris dialogue, allergies, FAQ, navigation et footer.
- Titres et descriptions sont résolus avant leur insertion dans le HTML, Open Graph, Twitter et JSON-LD. L’échappement et la cohérence sont testés avec des guillemets et une esperluette dans le nom d’exemple.
- Données Restaurant conformes aux coordonnées fournies ; pas de faux avis, note, horaire ou offre commerciale ajoutée. Les noms et contacts juridiques fictifs restent hors du JSON-LD.
- Pages statiques consultables sans JavaScript, liens internes et vraie 404 locale préservés.
- GSC, Google Business Profile, indexation, classement, citations IA et données CrUX / INP terrain restent NON PROUVÉS ; aucun réglage distant effectué.

## Mesures Lighthouse

Douze mesures complètes : Lighthouse 13.6.0, HeadlessChrome 156.0.0.0 sous Windows, serveur de production local 127.0.0.1:4176, profils mobile simulé / desktop et thèmes effectivement vérifiés. Passages du 29 octobre entre 16:21 et 16:25 UTC, sans avertissement de run.

| Page | Mobile clair / sombre | Desktop clair / sombre | Accessibilité / bonnes pratiques / SEO |
| --- | --- | --- | --- |
| Accueil | 99 / 98 | 100 / 100 | 100 / 100 / 100 |
| Carte | 99 / 99 | 100 / 100 | 100 / 100 / 100 |
| Informations pratiques | 99 / 100 | 100 / 100 | 100 / 100 / 100 |

Maximum mesuré : LCP 2,124 s, CLS 0,062014 et TBT 52 ms. Le CLS n’est pas nul ; il reste sous 0,1 dans ces passages de laboratoire. Les résultats sont ponctuels, pas des médianes répétées ni des mesures terrain.

Sur la carte mobile claire, le réseau ne contient plus que margherita-600.avif (37 108 octets de ressource ; 37 717 transférés), là où l’audit précédent relevait en plus margherita-600.webp (74 166 octets de ressource ; 74 775 transférés). La suppression du téléchargement est prouvée ; une variation de score Lighthouse seule ne démontre pas son effet causal.

Trois descriptions ont ensuite reçu une retouche de formulation. Le build final, le contrat de métadonnées et l’inventaire SEO ont été revalidés après cette retouche ; les douze mesures ci-dessus restent les mesures datées du build des correctifs techniques. Un contrôle Lighthouse SEO ciblé sur la carte finale, après retouche, obtient aussi 100 (carte-seo-final.report.json).

Mesures : [synthèse JSON](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/docs/lighthouse-corrections-2026-10-29.json), [rapports complets](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/lighthouse-reports.zip).

## CI / CD

Les workflows sont inchangés et valides avec actionlint. Ils appellent les commandes de test existantes et prendront donc les 24 tests Node et 78 tests navigateur après intégration des fichiers. Les deux dépendances de test et les actions restent épinglées.

La livraison Pages reste manuelle, limitée à la branche par défaut, après la CI du même run et contrôle du domaine attendu. L’artefact validé passe par prepare avant deploy ; les permissions pages:write et id-token:write sont réservées au job de publication. La configuration respecte les prérequis documentés par [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

NON PROUVÉS : exécution sur GitHub, runners Linux / Node 22, ShellCheck Linux, protections de branche / environnement, Pages / DNS / HTTPS et en-têtes distants. Les fichiers _headers / _redirects du serveur local ne prouvent pas leur application par Pages. Aucun workflow distant n’a été déclenché.

La confidentialité décrit désormais la collecte d’IP indiquée par [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection), sans inventer une durée de conservation ou prétendre valider la configuration de production.

## Fichiers modifiés

- data/site.json, scripts/build.mjs : numéro canonique unique et génération des métadonnées à partir des données du restaurant.
- src/layout.html, src/la-carte.html, src/infos-pratiques.html : métadonnées de marque et appels centralisés.
- src/app.mjs, src/styles.css : photo créée à l’ouverture du dialogue, présentation responsive conservée et cibles tactiles élargies.
- src/mentions-legales.html, src/confidentialite.html : exemples fictifs signalés et choix Pages documenté.
- tests/site.test.mjs, tests/browser/site.spec.mjs : contrat des coordonnées, séparation des exemples juridiques et du JSON-LD, réseau / image du dialogue et cibles tablette.
- README.md, PROJECT_MEMORY.md, docs/CI_CD.md, anti-vibecode-audit.md : procédures, décisions durables et constats actualisés ; rapports historiques conservés.
- docs/CORRECTIONS_2026-10-29.md et docs/lighthouse-corrections-2026-10-29.json : bilan et mesures de cette intervention.

Journaux : [24 tests et build](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/validate-final.log), [78 tests navigateur](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/browser-final.log), [preuve des échecs sur les anciens composants](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/red-final-tests.log), [SEO final](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/seo-static-final.json), [responsive](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/ui/responsive.json).

Captures : [mobile sombre](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/ui/dialogue-dark-375.png), [desktop clair](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/ui/dialogue-light-1440.png), [mentions](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/ui/mentions-light-375.png), [confidentialité](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/ui/confidentialite-dark-375.png), [navigation tablette](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.codex/qa/corrections-2026-10-29/ui/carte-light-768.png).

Les changements préexistants ont été préservés. Les ressources publiques, recettes, scripts de thème / CSP / serveur et les workflows n’ont pas été modifiés. Le contrôle local est satisfaisant ; les données fictives de la maquette ne constituent pas une validation légale pour une publication professionnelle.

