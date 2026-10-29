# Audit global du site Le Verone

**29 octobre 2026 — audit des sources courantes et du site construit localement, sans correction applicative ni publication.**

Le site possède une base technique et visuelle solide pour une démonstration : parcours courts, véritable contenu HTML, deux thèmes cohérents, tests utiles et livraison préparée avec des permissions limitées. La publication professionnelle doit attendre les contenus réels et les vérifications de l’hébergement. Aucun résultat local ne prouve l’indexation ou le fonctionnement de verone.fr.

## Résultats vérifiés

| Domaine | Résultat actuel | Limite |
| --- | --- | --- |
| Sécurité | Aucun finding confirmé après revue source indépendante, revue du transfert CI / artefact et contrôles locaux | Absence de vulnérabilité non garantie ; production et historique Git exclus |
| Tests et livrable | PASS : 22/22 tests Node, 66/66 tests Playwright, build de huit pages et huit pizzas, contrôle des budgets | Runners GitHub et matrice Linux / Node 22 non exécutés pendant cet audit |
| Mobile, tablette, desktop | 54 contrôles de géométrie sans débordement ; deux thèmes | Une cible de navigation tablette d’environ 42 × 44 px à élargir |
| Lighthouse, pages principales | 12 runs : performance 97–100 ; accessibilité, bonnes pratiques et SEO 100 | Mesures de laboratoire localhost |
| Lighthouse, pages légales et crédits | 16 runs : performance 99–100 ; accessibilité et bonnes pratiques 100 ; SEO 66 | Le noindex intentionnel explique le score SEO |
| SEO technique | Titres, descriptions et canonicals distincts ; sitemap de trois URL ; contenu HTML présent sans JS | Publication, exploration et indexation non prouvées |
| SEO local / GEO | Nom, adresse et téléphone fournis cohérents dans le build actuel ; données structurées sans faux avis | Horaires et activité réelle non vérifiés ; GSC, GBP et résultats IA non mesurés |

Le scan Standard est terminé. Son rapport généré est l’entrée de référence pour la sécurité :

- [Rapport Codex Security](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/report.md).
- [Modèle de menace](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/threatmodel.md).
- [Matrice anti-vibecode, 94 contrôles](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/anti-vibecode-audit.md) : 58 PASS, 1 FAIL, 8 JUSTIFIED, 21 N/A et 6 UNKNOWN. Ce décompte n’est pas une note de conformité.

PASS désigne une vérification réussie dans le périmètre annoncé. ÉCHEC désigne un défaut reproduit. NON TESTÉ désigne une vérification non exécutée. NON PROUVÉ désigne une affirmation que les preuves disponibles ne permettent pas d’établir.

## Périmètre et méthode

Les huit pages, le layout, les deux thèmes, les données, le générateur, le serveur local, le JavaScript navigateur, les tests, les manifests et les deux workflows ont été examinés. La revue source de sécurité couvre 46 chemins textuels ; 37 médias binaires ont été considérés pour le rendu et les poids, sans audit de leurs codecs. Les sources des dépendances et des actions externes n’ont pas été auditées.

Skills appliqués dans leur périmètre : long-horizon-execution, anti-vibecode-slop, design-taste-codex, seo-geo-codex, web-security-audit, repo-security-threat-model-lite, codex-security:security-scan et computer-use. Les outils sans rapport avec ce site, installateurs et générateurs d’images n’ont pas été invoqués. Codebase Memory ne disposait pas d’un index de ce dépôt ; aucun index n’a été créé.

Les commandes et mesures ont été exécutées sur une copie jetable des fichiers courants, avec les dépendances de test déjà verrouillées. Le serveur de mesure écoutait uniquement sur 127.0.0.1:4176. Les données fictives d’un contre-exemple ont été limitées à cette copie et restaurées à l’octet. Aucun appel téléphonique réel, changement distant, demande d’indexation ou déploiement n’a été réalisé.

Le HEAD c73ec4296b9731b03bd03cb2984cb56c4f9fec3f ne représente pas seul le site : de nombreux fichiers du site sont non suivis. Le scan conserve l’instantané initial. L’outil a signalé une modification de l’arbre de travail pendant l’audit ; les empreintes des 83 fichiers initiaux étaient pourtant identiques avant la rédaction des rapports. Le checkpoint opérationnel avait été ajouté pendant l’audit. Les seuls livrables modifiés ensuite sont les rapports listés à la fin.

## Actions prioritaires

Les priorités ci-dessous concernent la mise en ligne et la qualité produit ; elles ne représentent pas des sévérités de vulnérabilité.

| ID / priorité | Constat et preuve | Action proposée | Critère de validation |
| --- | --- | --- | --- |
| A01 · P1 avant publication | Photos et recettes Del Arte provisoires ; tarifs explicitement fictifs. [data/menu.json](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/data/menu.json) et [src/credits.html](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/credits.html) | Remplacer les médias par des photos autorisées, confirmer les recettes et prix du Verone, puis adapter les mentions de démonstration | Chaque produit affiché correspond à la carte validée et chaque média possède une provenance / un droit établi |
| A02 · P1 avant publication | Horaires non fournis ; identité juridique et contact professionnel manquants. [data/site.json](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/data/site.json) et [src/mentions-legales.html:4](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/mentions-legales.html:4) | Faire confirmer les faits par le professionnel, vérifier le numéro réellement utilisé, compléter les mentions selon le statut applicable | Informations visibles et données structurées concordent ; aucun horaire ou avis inventé |
| A03 · P1 avant publication | Mentions et confidentialité affirment encore que l’hébergeur n’est pas choisi, alors que GitHub Pages a été retenu. [src/mentions-legales.html:7](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/mentions-legales.html:7) et [src/confidentialite.html:9](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/confidentialite.html:9) | Actualiser le nom / les informations de l’hébergement et les traitements effectivement applicables ; identifier le responsable | Les pages correspondent au service réellement utilisé ; données de contact et informations obligatoires complètes |
| A04 · P1 recette de publication | Pages, DNS, HTTPS, redirections et en-têtes réels non prouvés ; le serveur Node local n’est pas le serveur Pages. [.github/workflows/deploy-pages.yml](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/.github/workflows/deploy-pages.yml) | Après une publication explicitement autorisée, contrôler le domaine canonique, HTTP / HTTPS, www, les routes et l’artefact réellement servi | Mesures HTTP et paramètres Pages constatés, 404 réelle, trois pages principales indexables, sitemap accessible |
| A05 · P2 optimisation | Le dialogue fermé possède une image WebP chargée immédiatement ; la même pizza charge déjà en AVIF sur la carte. [src/la-carte.html:25](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/la-carte.html:25), [src/app.mjs:105](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/app.mjs:105) | Affecter la source au premier usage et réutiliser des variantes AVIF / WebP adaptées ; garder le dialogue et les dimensions stables | Sur une visite à froid, aucune image propre au dialogue n’est téléchargée avant son ouverture ; fiche et clavier fonctionnent toujours |
| A06 · P2 fiabilité | Le téléphone n’est centralisé qu’en partie : des tel et descriptions sont écrits en dur. [src/la-carte.html:21](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/la-carte.html:21), [src/infos-pratiques.html](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/infos-pratiques.html), [scripts/build.mjs:41](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/scripts/build.mjs:41) | Générer tous les numéros visibles, liens tel et descriptions depuis data/site.json ; réutiliser le générateur existant | Un numéro de test modifié dans une copie se répercute partout, sans ancien numéro ; ajouter un test de contrat du HTML construit |
| A07 · P3 confort tactile | À 768 px, le lien de navigation « La carte » mesure environ 41,87 × 43,99 px. [src/styles.css:95](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/styles.css:95) | Prévoir une largeur ou un padding horizontal assurant au moins 44 px | Mesure ≥ 44 × 44 px, sans débordement et dans les deux thèmes |
| A08 · P3 documentation | README généralise l’isolation .test-site à tous les tests alors que Playwright construit et sert dist ; PROJECT_MEMORY dit encore que l’hébergeur n’est pas fourni. [README.md:30](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/README.md:30) et [PROJECT_MEMORY.md:16](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/PROJECT_MEMORY.md:16) | Distinguer tests Node / navigateur et actualiser la décision Pages, sans présenter sa configuration comme faite | La procédure décrit les répertoires réellement utilisés et les limites distantes |

### Preuves des deux optimisations reproduites

**Image du dialogue :** le rapport Lighthouse à froid de `/la-carte/`, mobile clair, contient deux téléchargements Margherita alors qu’aucune fiche n’a été ouverte : AVIF de 37 108 octets de ressource, puis WebP de 74 166 octets. Les transferts avec en-têtes sont respectivement de 37 717 et 74 775 octets. Environ 74 Ko de ressource sont donc évitables sur cette visite. Le JavaScript reprend ensuite l’attribut src de l’image de carte, qui est le fallback WebP. Il s’agit d’un gaspillage mesuré, sans échec actuel du budget ou du score de performance.

Preuve : [28 rapports Lighthouse JSON / HTML](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/lighthouse-reports.zip) → carte-mobile-clair.report.json, audit network-requests.

**Téléphone :** le numéro actuel reste cohérent avec celui demandé. Pour tester le contrat de configuration, seuls les champs téléphone de la copie jetable ont été remplacés par 0000000000, puis le site reconstruit. L’accueil utilise ce nouveau tel mais conserve l’ancien dans sa description ; la carte et les informations pratiques contiennent à la fois le nouveau et l’ancien tel. Les descriptions d’accueil et d’informations pratiques conservent aussi l’ancien numéro. Cette preuve concerne une future modification de configuration ; les appels actuels ne sont pas déclarés cassés.

Preuves : [résultat du contre-exemple](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/contact-config-probe.json) et [script limité à la copie jetable](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/probe-contact-config.mjs). La restauration exacte des données a été vérifiée.

## Revue page par page

| Page | Contrôles réussis | Réserve ou amélioration |
| --- | --- | --- |
| / | Restaurant, photo, accès carte, adresse et téléphone visibles ; H1 unique, contenu HTML, canonical et métadonnées propres ; deux thèmes et responsive | Photos culinaires d’exemple ; informations réelles et droits à finaliser ; description avec téléphone écrit en dur |
| /la-carte/ | Huit pizzas lisibles, bases tomate / crème exclusives combinables avec végétarien, compteur et réinitialisation cohérents ; dialogue et navigation clavier testés | Prix fictifs, compositions et allergènes à confirmer ; image du dialogue préchargée inutilement ; tel partiellement écrit en dur |
| /infos-pratiques/ | Adresse fournie, téléphone, lien d’itinéraire et FAQ ; réponse honnête concernant les horaires ; contenu et métadonnées propres | Horaires manquants et ligne réelle non appelée ; pas d’annonce d’ouverture inventée ; tel et description partiellement écrits en dur |
| /mentions-legales/ | Page accessible, structurée et explicite sur le statut de démonstration ; noindex intentionnel | Identité et contact du professionnel manquants ; hébergement déclaré non choisi à actualiser |
| /confidentialite/ | Décrit la préférence de thème locale, l’absence de compte / formulaire / suivi dans ce code et les liens externes | Responsable, contact et traitements de l’hébergement réel à préciser ; texte de choix d’hébergeur périmé |
| /cgu/ | Décrit la consultation, les filtres et l’appel ; aucun faux paiement / réservation ni fausses CGV | À adapter au fonctionnement commercial confirmé ; ne prouve pas une conformité juridique globale |
| /credits/ | Sources Del Arte et licences des polices identifiées ; statut temporaire et absence de droit commercial revendiqué clairement signalés | Les crédits ne remplacent pas une autorisation de réutilisation ; remplacement avant publication |
| 404 | H1 unique, message utile, retour accueil, vrai statut local 404 et noindex ; deux thèmes et absence de débordement | Statut et rendu réels sur Pages à vérifier après publication ; pas de score Lighthouse demandé à une URL volontairement en erreur |

Les quatre pages légales / crédits restent consultables et liées au footer malgré leur noindex. La 404 constitue la cinquième page non indexable. Les trois URL du sitemap sont l’accueil, la carte et les informations pratiques.

## Design, thèmes et accessibilité

Le thème Modern Italian Trattoria est reconnaissable : crème, tomate, basilic, charbon et beige, hiérarchie Fraunces / Manrope, photos larges, monogramme V, ombres limitées et absence d’effets SaaS décoratifs. La palette du brief et les tokens de thème sont conservés. Le sombre garde les mêmes parcours et contenus, avec des surfaces et couleurs de texte cohérentes.

Le téléphone et la carte sont accessibles rapidement. Le menu mobile, le retour du focus, Échap, le dialogue natif, la FAQ, la préférence système / le choix explicite de thème, le stockage refusé et la consultation sans JavaScript font partie des parcours automatisés. Les filtres ont été exercés dans un navigateur, au-delà de la seule validation des données.

Contrôle responsive : huit pages × trois largeurs (375, 768 et 1440 px) × deux thèmes, plus les trois principales à 320 px dans les deux thèmes, soit 54 passages. Aucun débordement horizontal, H1 unique et aucune image visible manquante dans les contrôles complets. Les six passages à 320 portent sur le H1 et le débordement. Les captures ne sont pas des tests sur appareils physiques.

Le dialogue sombre a été inspecté sur une fenêtre de 375 × 812 : contenu dans le viewport, fermeture et appel visibles. Les captures longues conservent la barre mobile fixe à la position de capture ; sa présence au milieu d’une image pleine page ne démontre pas un masquage permanent du contenu.

La petite cible de navigation à 768 px est un écart au minimum projet de 44 × 44, pas une conclusion automatique de non-conformité WCAG AA. Les audits automatiques sont verts : axe sur les trois pages principales dans la suite navigateur, Lighthouse accessibilité 100 sur les sept pages mesurées. Un audit WCAG exhaustif, un lecteur d’écran, le zoom à 200 % et des appareils physiques restent NON TESTÉS.

Pour renforcer davantage l’identité, la priorité éditoriale est d’ajouter de vraies photos de pizzas, du lieu et de l’équipe lorsque disponibles, avec des textes factuels sur le restaurant. Ajouter des avis, labels, une ancienneté ou des promesses artisanales sans preuve dégraderait la crédibilité.

Captures : [archive des vues des huit pages et du dialogue](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/ui-reports.zip), [mesures des 54 passages](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/responsive.json), [accueil clair desktop](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/accueil-desktop-clair.png), [carte sombre desktop](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/carte-desktop-sombre.png), [fiche pizza mobile sombre](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/dialogue-mobile-sombre.png).

## Sécurité et frontières de confiance

Le modèle distingue les visiteurs et leurs URL non fiables, les sources / données modifiables par un mainteneur, le build local ou CI, l’artefact public et le job Pages privilégié. La vitrine n’a ni compte, ni session, ni paiement, ni formulaire de collecte, ni API métier, ni base de données. Les classes de risque qui dépendent de ces mécanismes ne sont pas déclarées testées par des scanners sans objet.

| Surface | Conclusion étayée |
| --- | --- |
| Rendu HTML et DOM | Données échappées au build ; texte du dialogue injecté par textContent. Aucun chemin XSS exploitable confirmé dans les sources actuelles. [scripts/build.mjs](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/scripts/build.mjs) et [src/app.mjs:107](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/src/app.mjs:107) |
| Fichiers HTTP locaux | Méthodes GET / HEAD bornées et confinement des chemins ; tests de traversée, méthodes, 404 et protections locaux réussis. L’exécutable serveur est lié à 127.0.0.1 ; un consommateur du serveur exporté reste responsable de son bind. [scripts/serve.mjs](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/scripts/serve.mjs) |
| CSP et en-têtes | Politique commune et hash du bootstrap normalisé ; meta CSP dans le HTML, en-tête avec frame-ancestors sur le serveur local, nosniff et anti-framing observés localement. [scripts/security-policy.mjs](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/scripts/security-policy.mjs) |
| Secrets et données privées | Aucun secret identifié dans les sources courantes revues ou le livrable. L’historique Git et les credentials de compte n’ont pas été lus |
| Dépendances | npm audit : zéro vulnérabilité déclarée ; cinq paquets de développement installés et aucune dépendance npm de production déclarée. Le paquet racine peut être compté dans les métadonnées npm |
| Exposition distante | Aucun test offensif distant. En-têtes, TLS, DNS et paramètres effectifs de Pages non prouvés |

La CSP meta reste une protection embarquée dans le HTML pour les directives compatibles. Elle ne remplace pas les protections qui nécessitent un en-tête HTTP, notamment frame-ancestors. Les résultats du serveur Node et les fichiers _headers / _redirects ne prouvent pas leur application par GitHub Pages ; le README rappelle déjà cette limite. Les redirections automatiques de domaine / HTTPS offertes par Pages constituent un mécanisme distinct des anciennes routes .html à vérifier.

Le contenu de public/ est réputé publiable par le mainteneur. check-dist limite les fichiers attendus, chemins privés, liens symboliques et budgets, mais ne sait pas reconnaître le contenu sensible d’un fichier ordinaire volontairement ajouté à public/. Aucun fichier sensible actuel ni exploitation de cette frontière n’a été démontré. Une consigne de revue des ajouts de médias suffit ici ; aucun dispositif lourd ou finding artificiel n’est proposé.

Semgrep et Trivy ne sont pas disponibles. Le DAST léger n’a relevé ni observation ni erreur sur la requête locale contrôlée ; il ne remplace pas une revue source ou un test de production. Les codecs, sources des dépendances et actions tierces, historique Git et protections de compte demeurent hors périmètre.

Preuves conservées : [npm audit](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/npm-audit.json), [observations HTTP locales](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/dast-basic.json) et [contrôles statiques disponibles](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/static-summary.json).

## SEO technique, local et GEO

### Ce qui est en place

- Contenu complet dans les pages HTML construites : accueil, carte, coordonnées et FAQ restent accessibles aux robots sans exécution JavaScript.
- Huit titres et descriptions distincts, canonicals distincts, langue française, métadonnées sociales et liens entre pages.
- Trois URL canoniques https://verone.fr dans le sitemap ; production préparée à l’indexation de ces trois pages, aperçu local bloqué à l’indexation.
- Cinq noindex intentionnels : quatre pages légales / crédits et la 404. Le signal est explicite ; il ne faut pas bloquer les pages légales dans robots.txt uniquement pour améliorer une note.
- Sept blocs JSON-LD analysables, avec identité Restaurant, site / pages et éléments associés ; aucune fausse note, faux avis, horaire ou offre commerciale inventée.
- Nom, adresse fournie et numéro actuel cohérents ; aucune contradiction actuelle démontrée entre données structurées et texte visible.

Preuve statique : [audit du HTML construit](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/seo-static.json). Il ne signale que les cinq noindex dont l’intention a été vérifiée ; zéro doublon de titre, description ou canonical.

### Ce qu’il reste à mesurer ou compléter

| Sujet | État / action utile |
| --- | --- |
| Domaine et indexabilité réelle | NON PROUVÉS. Un essai d’ouverture de verone.fr par l’outil web n’a pas abouti ; cela ne démontre ni panne ni absence de DNS. Contrôler les réponses réelles après mise en ligne autorisée |
| Horaires et NAP local | Adresse et téléphone viennent de la demande, sans vérification externe de l’établissement. Confirmer les coordonnées utilisées publiquement et les horaires ; ajouter openingHoursSpecification seulement ensuite |
| Données structurées Google | Analyse syntaxique locale réussie ; test Rich Results et éligibilité sur l’URL déployée NON TESTÉS. Ajouter seulement les propriétés correspondant à des faits visibles et vérifiés |
| Search Console | Aucune propriété ni statistique consultée. Après autorisation : vérifier la propriété, soumettre le sitemap de production et inspecter les trois URL ; suivre couverture, requêtes, clics et pages |
| Google Business Profile | Accès, existence, vérification, doublons et performances NON PROUVÉS. Faire concorder nom, adresse, téléphone, horaires, catégories pertinentes et URL de la carte avec l’établissement réel |
| Visibilité locale | Ajouter photos réelles, horaires et renseignements utiles ; pas de pages de villes artificielles, répétitions de mots-clés ou faux avis pour remplir le site |
| CrUX / Core Web Vitals | NON MESURÉS. LCP / CLS de laboratoire disponibles ; INP et données terrain nécessitent une mesure distincte. TBT ne vaut pas une mesure INP |
| GEO / recherches IA | Le contenu statique, les faits locaux explicites et la FAQ facilitent la compréhension. Citations et présence dans les réponses IA NON TESTÉES ; aucun classement garanti |

Les bonnes pratiques SEO habituelles restent pertinentes pour les fonctionnalités IA de Google ; aucun fichier spécial ni ajout de balisage IA n’est requis selon la documentation Google consultée. L’absence de llms.txt n’est donc pas retenue comme défaut. L’action utile consiste à rendre les faits réels, cohérents, accessibles et suffisamment précis, puis mesurer les résultats.

## Performance : mesures actuelles

Protocole : 29 octobre 2026, de 15:27 à 15:32 UTC, Lighthouse 13.6.0, HeadlessChrome 156.0.0.0, Windows, profils mobile simulé et desktop, HTML de production sur 127.0.0.1:4176. Les thèmes ont été réellement sélectionnés et vérifiés. Aucun avertissement de run. Les 28 résultats sont des passages ponctuels, pas des médianes répétées ni une mesure terrain.

| Page / profil | Performance clair | Performance sombre | Accessibilité / bonnes pratiques / SEO |
| --- | --- | --- | --- |
| Accueil mobile | 99 | 98 | 100 / 100 / 100 |
| Accueil desktop | 100 | 100 | 100 / 100 / 100 |
| Carte mobile | 97 | 98 | 100 / 100 / 100 |
| Carte desktop | 100 | 100 | 100 / 100 / 100 |
| Informations pratiques mobile | 100 | 99 | 100 / 100 / 100 |
| Informations pratiques desktop | 100 | 100 | 100 / 100 / 100 |
| Mentions légales mobile | 99 | 100 | 100 / 100 / 66 |
| Mentions légales desktop | 100 | 100 | 100 / 100 / 66 |
| Confidentialité mobile | 100 | 99 | 100 / 100 / 66 |
| Confidentialité desktop | 100 | 100 | 100 / 100 / 66 |
| CGU mobile | 99 | 99 | 100 / 100 / 66 |
| CGU desktop | 100 | 100 | 100 / 100 / 66 |
| Crédits mobile | 99 | 99 | 100 / 100 / 66 |
| Crédits desktop | 100 | 100 | 100 / 100 / 66 |

Maximum sur les 28 passages : LCP 2 129,892 ms (2,13 s), CLS 0,000647952, TBT 65 ms. Le CLS est très faible mais pas strictement nul dans tous les runs. Le score SEO 66 des seize mesures légales / crédits vient du contrôle is-crawlable lié au noindex volontaire ; aucune correction de cette intention n’est recommandée.

Le livrable fait 56 fichiers et 1 564 700 octets, sous le budget total de 3 Mio. Budgets de contrôle : CSS 45 Kio, JS 12 Kio et AVIF 100 Kio par image. Polices locales, images AVIF responsives / fallback WebP, dimensions explicites, préchargement du visuel principal et ressources versionnées sont de bons choix. Le cache effectif de Pages reste à mesurer ; l’optimisation A05 réduit un téléchargement évitable sans ajouter de framework.

Données et protocole conservés : [synthèse JSON du dépôt](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/docs/lighthouse-2026-10-29.json), [28 rapports détaillés JSON / HTML](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/lighthouse-reports.zip) et [runner d’audit des sept pages](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/audit-global-lighthouse.mjs). Les anciennes mesures du 28 octobre ne sont pas utilisées pour conclure sur l’état actuel.

## Tests, CI et livraison

Les 66 tests correspondent à onze scénarios × six profils : Chromium desktop, Chromium mobile et WebKit mobile, chacun en clair et sombre. Ils couvrent navigation / menu mobile, filtres combinés et reset, dialogue et focus, thème entre pages, stockage refusé, erreurs / débordements des pages principales, FAQ, axe sur trois pages principales et fonctionnement sans JavaScript. Aucun test en échec, ignoré ou relancé pendant cette exécution.

Les 22 tests Node et la validation du livrable exercent génération, routes, contrat d’indexation, fichiers, budgets et protections du serveur. actionlint 1.7.12 valide les deux workflows ; l’option locale -shellcheck= désactive ShellCheck sous Windows. Le contrôle shell du runner Linux n’est pas une preuve locale.

La CI prévoit Node 22 et 24 sous Ubuntu, Node 24 sous Windows, npm ci --ignore-scripts, validation, audit de dépendances et navigateur, puis un artefact. Les actions sont épinglées par SHA, les credentials de checkout ne sont pas persistés et contents:read est le droit par défaut.

La livraison est manuelle, exige la branche par défaut et réutilise la CI dans le même run. L’artefact téléchargé n’est pas sélectionné depuis un autre run ou dépôt. Le contrôle du domaine attendu et la préparation précèdent le job privilégié Pages. Ce dernier ne contient ni checkout ni exécution de shell ; pages:write et id-token:write y sont limités. Aucun chemin d’injection de référence de branche dans le shell n’a été confirmé.

Restent à prouver sur GitHub : exécution des workflows, protections de branche, environnement github-pages et éventuels approbateurs, source Pages, domaine personnalisé, DNS, HTTPS et contrôle du site réellement publié. La présence du CNAME local ne réalise pas ces réglages.

Les ajouts de tests les plus utiles après correction sont ciblés :

1. Contrat de configuration du téléphone : modifier un numéro dans une copie et vérifier tous les tel, textes et métadonnées générés. Le contre-exemple actuel prouve qu’un tel test échouerait aujourd’hui.
2. Parcours de fiche avec collecte des téléchargements : aucune image du dialogue avant ouverture, puis bon visuel et fermeture / focus inchangés.
3. Mesure des cibles tactiles partagées aux largeurs tablette, dont le lien La carte, après ajustement.
4. Recette HTTP après première publication autorisée : routes, 404, redirections, canonicals, robots, sitemap et ressources. Garder cette vérification distincte de la CI locale.

Ces tests ne sont pas ajoutés pendant cette demande d’audit. Ajouter une application de commande, du suivi publicitaire ou une base de données sans besoin réel augmenterait inutilement la surface et la maintenance.

Preuve d’exécution navigateur : [journal de la suite 66/66](C:/Users/UTILISATEUR/.codex/state/plugins/codex-security/scans/pizzeria_toto/c73ec4296b9731b03bd03cb2984cb56c4f9fec3f_20261029T145408Z_9sx8lwvz/artifacts/playwright.log).

## Références officielles consultées

- [Fonctionnalités IA et site web — Google Search Central](https://developers.google.com/search/docs/appearance/ai-features) : pas d’exigence spéciale de fichier IA ni de balisage additionnel.
- [Données structurées LocalBusiness — Google](https://developers.google.com/search/docs/appearance/structured-data/local-business) : informations de l’établissement et horaires à aligner sur les faits réels.
- [Mentions obligatoires d’un site professionnel — Service Public Entreprendre](https://entreprendre.service-public.gouv.fr/vosdroits/F37351?lang=fr) : informations de l’éditeur et de l’hébergeur à compléter selon le statut applicable.
- [Domaines personnalisés GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) et [HTTPS Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) : réglages et redirections de domaine / HTTPS distincts du serveur Node.

## Livrables et limites finales

Fichiers d’audit créés ou actualisés :

- [docs/AUDIT_GLOBAL_2026-10-29.md](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/docs/AUDIT_GLOBAL_2026-10-29.md) : présent diagnostic, preuves et priorités.
- [anti-vibecode-audit.md](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/anti-vibecode-audit.md) : matrice de 94 contrôles actualisée.
- [docs/lighthouse-2026-10-29.json](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/docs/lighthouse-2026-10-29.json) : 28 mesures du jour avec URL, date, version, profil, thème et métriques.

Les sources applicatives, données, tests, workflows et ressources publiques restent identiques à l’instantané initial. Les anciens rapports sont conservés. Aucun correctif, commit, push, réglage GitHub / DNS / GSC ou déploiement n’a été effectué.

Usage mesuré retourné à la clôture Codex Security : 21 966 121 tokens au total, 21 850 867 en entrée, dont 21 095 808 en cache ; couverture de mesure complète selon l’outil, sur cinq threads. Ces nombres sont la télémétrie retournée, sans estimation de coût.

La validation locale est satisfaisante pour poursuivre la finalisation. La décision de publication professionnelle dépend encore des faits du restaurant, des droits sur les contenus et de la recette effective de l’hébergement.

