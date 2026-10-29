# Consignes du projet Le Verone

## Périmètre
Ce dépôt contient le site vitrine de la pizzeria **Le Verone à Reims**, destiné au domaine **https://verone.fr**. Répondre en français, directement et sans surpromesse.

Commencer par l’index de PROJECT_MEMORY.md puis lire les sections utiles. Les fichiers sources et les tests décrivent l’implémentation actuelle ; la demande utilisateur et les décisions validées définissent le comportement attendu.

## Découverte
- Fichier connu : lecture ciblée. Architecture / impact : Codebase Memory si ce projet est déjà indexé.
- Si le projet n’est pas indexé, le dire puis lire les sources pertinentes ; ne pas créer d’index sans demande.
- Comportement sans fichier connu : Semble. Motif syntaxique : ast-grep. Documentation récente d’une bibliothèque : Context7.
- Utiliser RTK pour les commandes prises en charge. Sorties importantes : Context Mode si disponible, sinon résumés bornés sans exposer de données sensibles.
- Expliquer le besoin avant de lire plus de cinq fichiers pour comprendre une tâche. Un audit complet explicitement demandé autorise une revue transversale proportionnée.

## Sources et architecture
- HTML / CSS / JavaScript natifs ; génération et serveur local Node.js 22.12+, sans dépendance de production.
- data/site.json : identité, domaine et coordonnées confirmées.
- data/menu.json : noms, descriptions, bases, classement végétarien, tarifs et références des pizzas.
- src/layout.html : structure partagée ; src/*.html : contenus des pages ; src/styles.css : tokens / thèmes / responsive. scripts/security-policy.mjs est la source commune de CSP ; préserver le hash exact du bootstrap et sa normalisation des fins de ligne.
- scripts/build.mjs génère dist/ (production), .preview/ (aperçu) ou .test-site/ (tests). Les destinations sont fermées et isolées. Modifier les sources puis régénérer ; ne pas patcher ces sorties directement.
- Réutiliser les primitives et données existantes ; ne pas introduire de framework ou abstraction sans besoin démontré.

## Expérience et direction artistique
- Site en plusieurs pages : accueil restaurant, carte, informations pratiques, pages légales et crédits.
- Préserver les liens entre pages, la route active et les redirections des anciennes URL.
- Mobile-first, puis tablette et desktop ; boutons tactiles de 44 px minimum, navigation clavier et focus visibles.
- Palette du brief : rouge #B83B2D, crème #FFF8EF, vert #2F5D43, charbon #292522, beige #EDE0CD, or #D7A65A, cartes blanches.
- Fraunces pour les titres, Manrope pour le texte ; grands visuels culinaires, arrondis 12–16 px, animations discrètes et reduced-motion.
- Thèmes clair et sombre via tokens partagés ; vérifier les contrastes et états dans les deux thèmes.
- Conserver les filtres tomate / crème combinables avec végétarien, le dialogue natif et les liens tel:0123456789.

## Sincérité et SEO
- Ne pas inventer horaires, avis, ancienneté, fabrication, labels, photos réelles du restaurant, prix ou garanties sur les allergènes.
- Les photos Del Arte sont temporaires ; les tarifs de démonstration sont fictifs et signalés. Ne pas présenter les crédits comme une licence commerciale.
- Adresse fournie : 123 rue de Venise, 51100 Reims. Horaires encore à confirmer.
- Préparer canonical, sitemap, métadonnées, données structurées et liens internes pour verone.fr sans inventer d’offre ou d’avis.
- Distinguer aperçu local non indexable, fichiers de production, site déployé et résultats Search Console / CrUX.
- Aucun engagement sur le classement, l’indexation ou les citations IA.

## Autorisations et préservation
- Préserver les changements préexistants ; ne pas les écraser ou les annuler.
- Aucun commit, push, pull, fetch, merge, rebase, déploiement, publication, DNS, mutation GSC / base / API distante sans demande explicite.
- Une demande d’audit seule n’autorise pas à modifier ; une demande d’implémentation autorise les changements locaux nécessaires.
- Ne jamais afficher de secret ou lire des credentials sans nécessité autorisée.
- Les suppressions doivent être bornées et justifiées ; dist/ est un résultat régénérable, jamais une source de contenu.

## Skills et validations
- Visuel : design-taste-codex. Revue complète de crédibilité / produit : anti-vibecode-slop.
- SEO / local / performances : seo-geo-codex. Sécurité applicative : web-security-audit ; architecture : repo-security-threat-model-lite.
- Travail long : long-horizon-execution avec un seul jalon dépendant actif.
- Les autres skills ne s’appliquent que dans leur périmètre réel ; ne pas lancer d’installateur ou d’outil sans rapport.
- Tests ciblés d’abord ; pour une migration de pages ou un audit complet, vérifier toutes les routes et les composants partagés.
- npm run check, npm test, npm run build ; contrôler le rendu mobile et desktop, les deux thèmes, filtres, clavier, liens, 404, canonical, robots et sitemap.
- npm run validate vérifie aussi le livrable et les budgets ; npm run test:e2e exerce les parcours Chromium / WebKit. Les dépendances de test sont verrouillées ; ne pas ajouter de dépendance de production pour cette vitrine sans besoin démontré.
- Préserver la CI et la livraison manuelle GitHub Pages, leurs permissions minimales et leurs actions épinglées. Une CI locale verte ne prouve pas l’exécution des runners GitHub. Ne pas modifier les paramètres Pages / DNS ni lancer de publication sans demande.
- Lighthouse : conserver mode, version, URL, profil, date, rapports et scores réellement obtenus. Un score local n’est pas une mesure CrUX ou une preuve de production.
- Les tests de données seuls ne prouvent pas les filtres ; vérifier le parcours dans le navigateur.
- Relire le diff indépendamment avant de conclure. Rapporter PASS / ÉCHEC / NON TESTÉ / NON PROUVÉ et les limites pertinentes.
- Mettre PROJECT_MEMORY.md à jour pour les décisions durables confirmées, sans y recopier les logs.
