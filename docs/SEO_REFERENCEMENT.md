# SEO de l’URL GitHub Pages du projet et mise en service Google

## Ce qui est implémenté
- Site statique en français ; contenu utile visible dans le HTML sans attendre JavaScript.
- Trois URL commerciales distinctes : https://bastienlopez.github.io/pizzeria_toto/, https://bastienlopez.github.io/pizzeria_toto/la-carte/ et https://bastienlopez.github.io/pizzeria_toto/infos-pratiques/.
- Un H1 et un titre / une description propres à chaque page ; navigation interne et fil d’Ariane.
- Canonical HTTPS avec le préfixe `/pizzeria_toto/`, Open Graph / Twitter et image de partage 1200 × 630.
- JSON-LD Restaurant, WebSite et WebPage / CollectionPage, avec BreadcrumbList sur les sous-pages.
- Nom, adresse et téléphone issus des informations fournies : Le Verone, 123 rue de Venise, 51100 Reims, 01 23 45 67 89.
- Aucun avis, note, coordonnée GPS, horaire, prix réel ou offre inventé dans les données structurées.
- Sitemap avec les trois pages principales à `/pizzeria_toto/sitemap.xml`. `robots.txt` est lui aussi sous le préfixe du projet ; ce dépôt ne contrôle pas `https://bastienlopez.github.io/robots.txt`, qui se trouve à la racine de l’hôte.
- Pages légales encore provisoires et 404 en noindex, follow ; elles restent accessibles aux visiteurs.
- Le serveur local redirige les anciennes URL .html et variantes sans slash. GitHub Pages n’interprète pas `_redirects` ; ces redirections ne sont donc pas garanties en production.
- AVIF avec fallback WebP, dimensions réservées, préchargement de l’image principale, cache versionné, polices locales, styles responsive et CLS corrigé.

L’aperçu utilise .preview/ et noindex ; le build de production utilise dist/. Cette séparation est testée. Ne pas publier .preview/.

Le workflow GitHub Pages se lance sur chaque push à `main`, après validation du commit et de l’artefact. Le [guide CI/CD](CI_CD.md) détaille le contrôle de l’URL du projet. Pages n’interprète ni `_headers` ni `_redirects` : les preuves HTTP du serveur Node local ne démontrent pas les mêmes en-têtes ou redirections sur Pages.

## Ce qui n’est pas prouvé
Cette configuration locale n’a pas encore été poussée ni publiée. Le lien GitHub Pages renvoyait une 404 avant ce changement ; il faudra vérifier son état après le prochain push à `main` et la fin du workflow.

Aucun accès à une propriété Search Console vérifiée n’est établi. Aucun changement DNS, ajout de propriété, dépôt de sitemap ou demande d’indexation n’a été exécuté. Aucun jeton de validation fictif n’a été ajouté au code.

Lighthouse est un test de laboratoire local. Ses scores ne prouvent ni un classement, ni une indexation, ni les Core Web Vitals de vrais visiteurs. L’INP terrain n’est pas mesuré par cette série ; le TBT de laboratoire est indiqué séparément.

## Avant une mise en service professionnelle
1. Valider les vraies informations du restaurant, les prix et les droits des photos. Remplacer les exemples juridiques et confirmer les horaires.
2. Exécuter npm run check, npm test et npm run build.
3. Pousser à `main` et attendre la réussite de Livraison GitHub Pages. Dans Settings > Pages, garder GitHub Actions comme source et retirer tout domaine personnalisé si l’URL de base n’est pas celle du projet.
4. Vérifier les trois pages, les images / polices / CSS, le canonical sous `/pizzeria_toto/`, le sitemap, une URL absente en 404 et l’absence de noindex sur les trois pages publiques.
5. Garder à l’esprit que `_headers` et `_redirects` ne sont pas pris en charge par GitHub Pages ; contrôler les réponses réelles plutôt que les fichiers générés localement.

## Search Console
La procédure doit être effectuée par un compte autorisé.

1. Ouvrir Search Console et choisir une propriété de type Préfixe d’URL : `https://bastienlopez.github.io/pizzeria_toto/`.
2. Choisir une méthode de validation proposée par Google et utiliser seulement la valeur fournie pour cette propriété. Ne pas inventer ni réutiliser un jeton provenant d’un autre site.
3. Si une propriété existe déjà, obtenir un accès à cette propriété au lieu d’inventer une nouvelle configuration.
4. Après publication et validation, soumettre `https://bastienlopez.github.io/pizzeria_toto/sitemap.xml` dans Sitemaps.
5. Inspecter les trois URL : accès réel à la page, canonical déclaré / choisi par Google, dernier crawl et motif d’exclusion éventuel. Une demande d’indexation n’est pas une garantie d’inclusion.
6. Suivre les rapports Pages, Performances et Signaux Web essentiels quand des données existent. Comparer impressions, clics et pages d’entrée sur des fenêtres comparables ; ne pas attribuer automatiquement une variation à une modification récente.

Une propriété Domaine couvre les variantes et sous-domaines ; un préfixe d’URL est une alternative dont les méthodes de validation dépendent des accès disponibles. Aucun identifiant Google ou clé privée n’est nécessaire dans les fichiers publics du site.

## Référencement local
- Confirmer l’établissement et harmoniser nom / adresse / téléphone sur le site et la fiche Google Business Profile réelle.
- Renseigner les horaires véritables lorsqu’ils sont connus, puis les répercuter dans le site et le JSON-LD.
- Utiliser de vraies photos du lieu et des pizzas ; obtenir les autorisations de publication.
- Recueillir de vrais avis sans en inventer ni en transformer en note structurée autoattribuée.
- Garder une carte utile et des informations d’accès précises ; ne pas générer de pages de villes artificielles.

## Références officielles
- [Guide de démarrage SEO Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Validation de propriété Search Console](https://support.google.com/webmasters/answer/9008080?hl=fr)
- [Données structurées LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)

Ces fichiers préparent la visibilité technique du site. Ils ne peuvent garantir un positionnement ou une citation dans une réponse IA.
