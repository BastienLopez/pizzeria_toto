# Mémoire du projet Le Verone

## Index
1. [Identité et données confirmées](#identité-et-données-confirmées)
2. [Architecture et sources](#architecture-et-sources)
3. [Pages et parcours](#pages-et-parcours)
4. [Direction artistique et thèmes](#direction-artistique-et-thèmes)
5. [Sincérité des contenus](#sincérité-des-contenus)
6. [SEO et mesure](#seo-et-mesure)
7. [Validation et autorisations](#validation-et-autorisations)

## Identité et données confirmées
- Pizzeria : Le Verone.
- Domaine canonique demandé : https://verone.fr, sans www.
- Adresse fournie par le propriétaire : 123 rue de Venise, 51100 Reims, France.
- Téléphone fourni : 0123456789, affiché 01 23 45 67 89.
- Horaires, identité juridique et e-mail professionnel réels non fournis. GitHub Pages a été choisi ; sa configuration distante reste non prouvée.
- Le 29 octobre 2026, le propriétaire a demandé des informations juridiques de démonstration : identité / immatriculation / contact fictifs explicitement signalés dans les mentions et la confidentialité. Ils ne doivent pas entrer dans les métadonnées ou le JSON-LD du restaurant ni être présentés comme validés pour publication professionnelle.

## Architecture et sources
- HTML statique, CSS et JavaScript natifs ; Node.js 22.12+ pour génération / serveur et outillage de test.
- Aucune dépendance npm de production ; aucun framework nécessaire à la vitrine.
- data/site.json centralise les coordonnées et le domaine ; telephone est l’unique numéro saisi. Le build en dérive l’affichage français et le format +33. Titres, descriptions, Open Graph et JSON-LD sont résolus depuis ces données ; data/menu.json contient la carte.
- src/layout.html et src/*.html sont les sources des pages ; src/styles.css fournit les tokens. La politique CSP partagée appartient à scripts/security-policy.mjs ; le bootstrap de thème est incorporé avant affichage et autorisé par son SHA-256 exact, avec normalisation Windows.
- scripts/build.mjs produit dist/ pour la production, .preview/ pour l’aperçu et .test-site/ pour les tests. Ces sorties sont isolées et régénérables. Le serveur local est dans scripts/serve.mjs.
- Images AVIF responsives avec fallback WebP et polices WOFF2 locales ; licences dans public/fonts/. Les WebP servent de sources aux variantes AVIF générées par scripts/create-brand-assets.py.
- Le dépôt n’est pas indexé dans Codebase Memory au moment de la vérification du 28 octobre 2026. Ne pas créer d’index implicitement.

## Pages et parcours
- Décision du 28 octobre 2026 : remplacer la one page par un site en plusieurs pages.
- L’accueil présente le restaurant, les photos culinaires disponibles, l’adresse, le téléphone et les accès à la carte / aux informations pratiques.
- /la-carte/ porte la carte complète et ses filtres ; /infos-pratiques/ porte coordonnées, horaires connus, accès et FAQ.
- Pages séparées pour mentions légales, confidentialité, CGU et crédits ; vraie réponse 404.
- Navigation active explicite et accès carte / appel faciles sur mobile.
- Filtres de base mutuellement exclusifs, combinables avec végétarien ; réinitialisation cohérente.
- Les fiches pizza utilisent un dialogue natif ; le picture responsive de la carte est repris uniquement à l’ouverture, avec AVIF et fallback WebP selon le navigateur. Aucune image du dialogue fermé ne doit être téléchargée. Préserver Échap, retour du focus, bon visuel et changement de recette.
- Le téléphone constitue le parcours de contact ; aucun faux panier, paiement ou réservation en ligne.

## Direction artistique et thèmes
- Modern Italian Trattoria : chaleureux, sobre, premium accessible.
- Palette claire obligatoire : rouge #B83B2D, crème #FFF8EF, vert #2F5D43, charbon #292522, beige #EDE0CD, or #D7A65A, cartes #FFFFFF.
- Fraunces pour les titres ; Manrope pour le texte et les interfaces.
- Rouge réservé surtout aux actions ; vert pour les accents secondaires ; arrondis modérés, espacements et photos généreux.
- Thèmes clair et sombre demandés ; conserver une seule structure de contenu et des tokens sémantiques.
- Mobile-first puis tablette / desktop ; contrastes AA visés, focus visible, cibles >= 44 px, reduced-motion.
- Aucune esthétique générique SaaS, faux compteur, glow, particule ou animation décorative systématique.

## Sincérité des contenus
- Huit recettes et photos provisoires référencées depuis les pages Del Arte demandées par le propriétaire.
- Prix fictifs de démonstration, clairement signalés. Les photos ne sont pas des prises de vue du restaurant.
- Aucun partenariat ou droit de publication commerciale revendiqué ; remplacement ou autorisation avant publication.
- Margherita et Quattro formaggi : options sans viande ni poisson dans la carte d’exemple. Fromages, allergènes et traces à confirmer auprès du professionnel.
- Pas de faux avis, histoire familiale, cuisson au feu de bois, fait maison, labels ou heures d’ouverture inventés.
- Les pages légales décrivent l’implémentation et le choix GitHub Pages, et distinguent les exemples juridiques fictifs des coordonnées fournies. L’e-mail example.invalid est volontairement non fonctionnel ; remplacer ces exemples par des informations validées avant publication professionnelle.

## SEO et mesure
- Marché : pizzeria à Reims ; contenu français utile, titre / description / H1 propres à chaque page.
- URL canoniques, liens internes, sitemap et données structurées préparés pour https://verone.fr.
- Données structurées limitées aux faits visibles et confirmés ; aucune note, prix réel ou offre inventé.
- Aperçu local non indexable ; version de production explicitement préparée à l’indexation après validation des contenus. Les ressources sont versionnées par leur contenu pour un cache long ; les pages gardent no-cache. Lighthouse se mesure en mode --audit sur loopback, dans les deux thèmes réellement vérifiés.
- Aucun dépôt DNS, envoi de sitemap, demande d’indexation ou accès GSC implicite.
- Search Console nécessite une propriété vérifiée et un accès autorisé. Ne pas simuler une validation de propriété.
- Lighthouse est une mesure de laboratoire ; CrUX / Core Web Vitals terrain, indexation et classement nécessitent des preuves distinctes.
- Rapports d’audit dans docs/ et .security-audit/ ; aucune promesse de visibilité.

## Validation et autorisations
- npm run check : syntaxe ; npm test : régressions ; npm run build : génération statique.
- npm run validate ajoute le contrôle du livrable et de ses budgets. 24 tests Node ; npm run test:e2e : 13 scénarios sur six profils Chromium / WebKit, mobile / desktop et clair / sombre, soit 78 vérifications. Le contrat des coordonnées est vérifié dans une copie temporaire, le réseau du dialogue et les cibles tablette dans le navigateur. Respecter le fallback WebP lorsque le navigateur ne décode pas l’AVIF.
- @playwright/test et @axe-core/playwright sont les seules dépendances directes de développement, épinglées ; aucune dépendance de production. Installer via npm ci --ignore-scripts, puis les navigateurs Playwright.
- GitHub Pages a été choisi le 28 octobre 2026. .github/workflows/ci.yml valide push / PR ; deploy-pages.yml est une livraison manuelle sur la branche par défaut, après réexécution de la CI. Aucun workflow distant exécuté pendant la préparation.
- La livraison exige l’URL Pages https://verone.fr sans sous-dossier. CNAME est généré depuis site.origin ; il ne configure pas le domaine distant. Les règles _headers / _redirects restent spécifiques aux hébergeurs qui les interprètent, et ne sont pas traitées par le workflow Pages.
- Procédure et limites dans docs/CI_CD.md ; améliorations restantes dans docs/AMELIORATIONS.md. La CI distante, les paramètres Pages, HTTPS et DNS restent à vérifier réellement.
- Après modification des routes : liens, redirections, 404, métadonnées, sitemap et parcours mobile à contrôler.
- Vérifier visuellement clair / sombre sur mobile et desktop ; tester navigation, filtres, dialogue, FAQ et choix de thème.
- Préserver le travail local préexistant ; aucun commit, push, fetch, déploiement ou mutation de service sans demande explicite.
- Les résultats locaux ne prouvent pas la production. Documenter ce qui est PASS, ÉCHEC, NON TESTÉ ou NON PROUVÉ.
