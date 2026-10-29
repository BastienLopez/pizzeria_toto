# Audit complet du site Le Verone

Date : 28 octobre 2026. Périmètre : sources actuelles, HTML construit et serveur local. Domaine préparé : https://verone.fr. Adresse fournie : 123 rue de Venise, 51100 Reims.

Évolution après cet audit : les tests et la CI/CD ont été ajoutés. Voir [CI/CD](CI_CD.md) et [axes d’amélioration](AMELIORATIONS.md) : 22 tests Node et 66 vérifications navigateur passent désormais localement. Les chiffres Lighthouse et le scan de sécurité ci-dessous restent ceux de l’audit initial ; ils ne sont pas présentés comme une nouvelle mesure des workflows ou de GitHub Pages.

## Résultat
Le site fonctionne en plusieurs pages, sur mobile et desktop, dans les deux thèmes. Les parcours de consultation et de téléphone sont implémentés. Lors de l’audit initial, les 17 tests passaient et les douze Lighthouse finaux n’indiquaient aucun échec dans les catégories accessibilité automatique, bonnes pratiques et SEO.

La publication professionnelle reste à finaliser : photos provisoires, prix fictifs, horaires et identité juridique manquants. Le résultat local ne prouve ni un déploiement, ni une indexation ou un classement Google.

## Ce qui fonctionne

| Domaine | Résultat | Preuve |
| --- | --- | --- |
| Instructions du projet | PASS | AGENTS.md, PROJECT_MEMORY.md et guides .codex adaptés au Verone ; anciennes règles portfolio / INDIGO supprimées |
| Architecture | PASS | Accueil restaurant, carte et informations pratiques séparés ; 4 pages d’information et 404 |
| Navigation | PASS | Routes actives, menu mobile, liens entre pages, accès carte / appel, redirections des anciennes URL |
| Carte | PASS | 8 pizzas ; tomate 4, crème 4, végétariennes 2 ; combinaisons une pizza par base ; réinitialisation 8 |
| Clavier | PASS ciblé | Menu, dialogue avec Échap et retour du focus, FAQ au clavier |
| Clair / sombre | PASS | Préférence système puis choix mémorisé ; aucune duplication du contenu ; contrôle de stockage refusé |
| Responsive | PASS | 18 combinaisons des pages principales à 375, 768 et 1440 px ; 20 contrôles complémentaires des pages légales et 404 à 375 et 1440 px ; deux thèmes, aucun débordement |
| Images / polices | PASS | AVIF + WebP local, alt, dimensions, priorité de l’image principale, polices locales et licences |
| SEO source / build | PASS | 8 titres, descriptions et canonical distincts ; 1 H1 par page ; sitemap des 3 pages principales ; JSON-LD cohérent |
| Sécurité locale | PASS dans le périmètre | Aucune vulnérabilité étayée retenue ; revue source indépendante, retests et observations HTTP |
| Dépendances du site | PASS | Aucune dépendance npm de production ; npm audit signale zéro vulnérabilité |
| État distant | NON PROUVÉ | Aucun déploiement de cette version ni propriété GSC vérifiée |

## Lighthouse final

Mesures séquentielles avec Lighthouse 13.6.0 sur http://127.0.0.1:4174. Chrome headless de test, profil mobile simulé ou preset desktop ; préférence de couleur imposée et thème réellement lu dans le document. Aucun audit actif sur un site public. Les fichiers JSON / HTML de chaque run sont dans .codex/qa/lighthouse/ et le résumé dans summary.json.

| Mesure | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| accueil-mobile-clair | 99 | 100 | 100 | 100 | 2.11 s | 0 |
| carte-mobile-clair | 99 | 100 | 100 | 100 | 2.11 s | 0 |
| infos-mobile-clair | 100 | 100 | 100 | 100 | 0.98 s | 0 |
| accueil-desktop-clair | 100 | 100 | 100 | 100 | 0.43 s | 0 |
| carte-desktop-clair | 100 | 100 | 100 | 100 | 0.47 s | 0 |
| infos-desktop-clair | 100 | 100 | 100 | 100 | 0.21 s | 0 |
| accueil-mobile-sombre | 99 | 100 | 100 | 100 | 2.11 s | 0 |
| carte-mobile-sombre | 99 | 100 | 100 | 100 | 2.11 s | 0 |
| infos-mobile-sombre | 100 | 100 | 100 | 100 | 0.76 s | 0 |
| accueil-desktop-sombre | 100 | 100 | 100 | 100 | 0.43 s | 0 |
| carte-desktop-sombre | 100 | 100 | 100 | 100 | 0.47 s | 0 |
| infos-desktop-sombre | 100 | 100 | 100 | 100 | 0.21 s | 0 |

Les 12 runs ont CLS = 0. LCP mobile maximal : environ 2,12 s ; TBT maximal : 15 ms. LCP / TBT de laboratoire ne remplacent pas les mesures CrUX / INP de vrais visiteurs. Un score accessibilité 100 ne certifie pas une conformité WCAG exhaustive. Les valeurs peuvent varier avec le poste et les conditions de mesure.

## Problèmes confirmés puis corrigés

1. **Consignes étrangères au projet.** Les règles de portfolio, catégories de projets, références React / Tailwind et chemins d’autres dépôts ont été remplacés par la vraie architecture et les contraintes du Verone.
2. **One page remplacée.** Accueil restaurant, carte et informations pratiques ont des routes et métadonnées propres. La navigation mobile et desktop reflète ces pages.
3. **Thème sombre absent.** Tokens sombres, bouton nommé, état ARIA, préférence système, persistance locale et confidentialité adaptée.
4. **Course entre builds locaux.** Aperçu et tests pouvaient réécrire le même dist et modifier les directives robots pendant une mesure. Sorties .preview / .test-site / dist séparées, destinations fermées et test de non-régression.
5. **Lecture robots bloquée par CSP.** robots.txt répondait 200 et était syntaxiquement correct ; connect-src none bloquait le fetch de Lighthouse. connect-src self autorise les lectures de même origine sans ouvrir les connexions aux tiers. SEO du premier run : 92 ; final : 100.
6. **Décalage de chargement.** La classe JS masquait la navigation après le premier affichage. Le bootstrap est désormais dans head, autorisé seulement par son SHA-256 exact ; pas de unsafe-inline. Un run intermédiaire avait CLS 0,109 ; tous les runs finaux ont CLS 0.
7. **Nom du logo et titres.** Nom accessible rendu cohérent avec le libellé visible ; carte et informations ne sautent plus H1 → H3. Les deux pages passaient à 98 en accessibilité automatique ; elles sont à 100 après correction.
8. **Cache et compression.** URL des ressources versionnées d’après leur contenu, cache long limité aux assets publics, HTML sans cache long. Brotli refuse q=0, avec test qui détecte l’ancien comportement.
9. **Images trop lourdes pour la cible mobile.** La recompression WebP sans gain significatif a été retirée. Les variantes AVIF ont été comparées visuellement ; 16 AVIF totalisent 343 730 octets contre 801 028 pour les WebP conservés. Hero Margherita : environ 37 ko en AVIF contre 74 ko en WebP. Préchargement responsive de la photo principale ; LCP mobile ramené autour de 2,11 s pour accueil / carte.
10. **CSP et Windows.** Une seule politique partagée pour HTML, serveur et configuration d’hébergement, normalisation CRLF / BOM et tests de correspondance des empreintes.

Les rapports initiaux et intermédiaires sont conservés dans .codex/qa/lighthouse/, notamment baseline-mobile.report.json, step-csp-before-boot.json et summary-before-headings-avif.json.

## Ce qui reste à finaliser

| Priorité | Point | État / effet |
| --- | --- | --- |
| P1 avant publication | Droits / remplacement des photos Del Arte | NON PROUVÉS ; photos culinaires de référence, aucun cliché réel de l’intérieur du restaurant inventé |
| P1 avant publication | Identité juridique, e-mail et hébergeur | NON FINALISÉS ; pages légales honnêtes mais impropres à être présentées comme une conformité professionnelle complète |
| P1 commercial | Prix, recettes et allergènes réels | Tarifs fictifs signalés ; classement végétarien sans garantie sur présure / traces ; validation du professionnel nécessaire |
| P2 informations pratiques | Horaires | NON FOURNIS ; appel proposé au lieu d’un faux état « ouvert » |
| P2 mise en ligne | HTTPS, DNS, redirections et en-têtes de l’hôte | NON TESTÉS ; _headers / _redirects dépendent de l’hébergeur |
| P2 mesure SEO | Search Console, indexation, CrUX / INP terrain | NON PROUVÉS ; aucun compte ou jeton de propriété établi, aucune action distante effectuée |
| P3 validation élargie | Lecteur d’écran et appareil physique | NON TESTÉS ; navigation clavier et émulation responsive contrôlées |

L’ouverture de https://verone.fr via l’outil web n’a pas abouti. Cela ne prouve pas une panne du domaine. Les résultats décrivent le site local créé ici, pas un HTML de production vérifié.

## Sécurité : méthode et portée

Le [rapport canonique Codex Security](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261028T171523Z_u9yq_15a/report.md) est un scan local source préalable aux dernières optimisations. Il conserve le modèle indépendant, les surfaces relues et les limites. Aucun finding retenu. Il est scellé et n’a pas été réécrit.

Après les optimisations, une revue indépendante ciblée a relu les huit fichiers de build / serveur / CSP / navigateur / audit / tests modifiés, sans finding étayé. Le parent a ensuite vérifié les derniers changements de normalisation, AVIF et titres, ainsi que les tests et les exécutions réelles des deux thèmes.

Le [rapport web-security-audit courant](../.security-audit/report.md) et le [modèle local final](../.security-audit/threat-model.md) couvrent cette validation finale. Pas de compte, session, formulaire, base de données, upload, API métier ou paiement.

Cibles actives : localhost uniquement. Aucun DoS, brute force, extraction de données, utilisation de credential, test intrusif ou cible de production. Semgrep, Trivy et pip-audit indisponibles. Historique Git, codecs natifs et configuration future d’hébergement hors preuve.

## Skills appliqués

Design-taste-codex pour la construction et la critique ; anti-vibecode-slop pour la matrice complète de 94 contrôles ; long-horizon-execution pour les jalons ; seo-geo-codex pour technique / local / performances ; web-security-audit et repo-security-threat-model-lite pour les frontières et retests ; Codex Security Standard pour la revue indépendante. Sites utilisé uniquement dans son parcours local.

External-skill-auditor : aucun skill externe à installer ou à auditer. Les autres skills sans rapport avec cette vitrine ne sont pas activés artificiellement. Lighthouse / Puppeteer temporaires servent uniquement à la mesure demandée ; aucune dépendance de production, plugin ou hook global ajouté.

## Mise en service

Voir [SEO / Search Console](SEO_REFERENCEMENT.md) pour l’ordre : valider les contenus, publier sur autorisation, contrôler la version HTTPS, faire vérifier le domaine par son propriétaire, puis soumettre le sitemap et suivre les vraies mesures. Aucun classement, délai d’indexation ou citation IA garanti.

## Compteur retourné par Codex Security

Mesure codex_rollout déclarée complète par l’outil : total 11 667 405 tokens ; entrée 11 617 648, dont 11 363 584 en cache ; sortie 49 757 ; cinq contextes de chat comptés. Ce compteur n’est pas une estimation monétaire.

Aucun commit, push, fetch, déploiement, modification DNS, inscription de service ou mutation Search Console.
