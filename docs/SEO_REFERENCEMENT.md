# SEO de verone.fr et mise en service Google

## Ce qui est implémenté
- Site statique en français ; contenu utile visible dans le HTML sans attendre JavaScript.
- Trois URL commerciales distinctes : https://verone.fr/, https://verone.fr/la-carte/ et https://verone.fr/infos-pratiques/.
- Un H1 et un titre / une description propres à chaque page ; navigation interne et fil d’Ariane.
- Canonical HTTPS sans www, Open Graph / Twitter et image de partage 1200 × 630.
- JSON-LD Restaurant, WebSite et WebPage / CollectionPage, avec BreadcrumbList sur les sous-pages.
- Nom, adresse et téléphone issus des informations fournies : Le Verone, 123 rue de Venise, 51100 Reims, 01 23 45 67 89.
- Aucun avis, note, coordonnée GPS, horaire, prix réel ou offre inventé dans les données structurées.
- Sitemap avec les trois pages principales ; robots.txt autorisant le crawl en production.
- Pages légales encore provisoires et 404 en noindex, follow ; elles restent accessibles aux visiteurs.
- Anciennes URL .html et variantes sans slash redirigées vers les URL canoniques.
- AVIF avec fallback WebP, dimensions réservées, préchargement de l’image principale, cache versionné, polices locales, styles responsive et CLS corrigé.

L’aperçu utilise .preview/ et noindex ; le build de production utilise dist/. Cette séparation est testée. Ne pas publier .preview/.

GitHub Pages a ensuite été choisi pour la livraison. Le [guide CI/CD](CI_CD.md) décrit le workflow manuel, le contrôle du domaine canonique et les réglages à effectuer par le propriétaire. Le workflow ne traite pas les fichiers _headers / _redirects : les preuves HTTP du serveur Node local ne démontrent pas les mêmes en-têtes ou redirections sur Pages.

## Ce qui n’est pas prouvé
Aucun déploiement de cette version n’a été effectué. L’ouverture de https://verone.fr par l’outil web n’a pas abouti ; cela ne démontre pas à elle seule une panne du domaine.

Aucun accès à une propriété Search Console vérifiée n’est établi. Aucun changement DNS, ajout de propriété, dépôt de sitemap ou demande d’indexation n’a été exécuté. Aucun jeton de validation fictif n’a été ajouté au code.

Lighthouse est un test de laboratoire local. Ses scores ne prouvent ni un classement, ni une indexation, ni les Core Web Vitals de vrais visiteurs. L’INP terrain n’est pas mesuré par cette série ; le TBT de laboratoire est indiqué séparément.

## Ordre de mise en service
1. Valider les vraies informations du restaurant, les prix et les droits des photos. Finaliser les mentions légales et l’hébergement.
2. Exécuter npm run check, npm test et npm run build.
3. Publier dist/ uniquement après autorisation, sur un hébergement HTTPS pour verone.fr. Vérifier effectivement ses en-têtes, redirections et règles de cache ; _headers et _redirects ne fonctionnent que si l’hôte reconnaît ce format.
4. Choisir https://verone.fr comme version canonique. Configurer les redirections HTTP → HTTPS et www → sans www sur l’hébergement / DNS concerné, puis vérifier leur absence de boucle. Le générateur seul ne peut pas configurer un domaine.
5. Contrôler les trois pages en HTTP 200, une URL absente en 404, les canonical, robots.txt, sitemap.xml et l’absence de noindex sur les trois pages publiques.

## Search Console
La procédure doit être effectuée par un compte autorisé.

1. Ouvrir Search Console et choisir une propriété de type Domaine : verone.fr.
2. Copier le TXT fourni par Google dans la zone DNS du domaine, puis lancer la validation lorsque la propagation le permet. Utiliser uniquement la valeur donnée par Google ; ne pas réutiliser un jeton d’un autre site.
3. Si une propriété existe déjà, obtenir un accès à cette propriété au lieu d’inventer une nouvelle configuration.
4. Après publication et validation, soumettre https://verone.fr/sitemap.xml dans Sitemaps.
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
