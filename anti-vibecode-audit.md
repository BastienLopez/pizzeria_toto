# Revue anti-vibecode et design du Verone

29 octobre 2026 — audit et corrections après le retour du propriétaire sur l’aspect trop « généré ». Périmètre : sources et artefact de production, rendus locaux mobile / desktop, thèmes clair / sombre, parcours et contrôles anti-slop. Le déploiement public n’a pas été modifié.

Preuves actuelles : `npm run validate` (24 tests Node, 8 pages, 55 fichiers et 1 550 547 octets), `npm run test:e2e` (78/78 dans six profils Chromium / WebKit, mobile / desktop, clair / sombre) et `npm audit --audit-level=moderate` (zéro vulnérabilité signalée). Les rendus locaux de l’accueil, de la carte, des informations pratiques et des mentions légales ont été inspectés ; les parcours navigateur ne signalent pas d’erreur.

États : PASS = vérifié dans le périmètre décrit ; FAIL = défaut observé ; JUSTIFIED = choix intentionnel de la démonstration ; N/A = mécanisme absent ; UNKNOWN = information ou preuve manquante.

94 contrôles : 59 PASS, 0 FAIL, 8 JUSTIFIED, 21 N/A, 6 UNKNOWN. Ce décompte n’est pas un score de conformité.

## Retest des constats précédents

| ID | État après correction | Retest |
|---|---|---|
| D05 | PASS | Les contrôles ont un rayon de 2 px, les photos et le dialogue 4 px ; les fiches pizza sont des lignes séparées par des règles fines, sans cartes encadrées. Les captures mobiles et desktop confirment la hiérarchie par l’espace, le texte et la photo. |
| D06 | PASS | Les surtitres répétés ont disparu de l’accueil et des pages. Le libellé discret de la base reste uniquement dans la fiche pizza ouverte, où il décrit la recette. |
| P20 | PASS | Les slogans génériques ont été remplacés par l’adresse, les horaires à confirmer, le téléphone et les informations de démonstration. La recherche ciblée ne retrouve plus ces phrases dans les sources ou le générateur de l’aperçu social. |
| D02 | PASS | Le sceau flottant a été supprimé. Le wordmark est typographique et les icônes d’application n’utilisent plus l’anneau décoratif répété. |

La palette approuvée et Fraunces / Manrope restent en place. L’accueil est plus court et factuel, la carte passe en liste éditoriale ; les photos Del Arte et les prix fictifs sont encore des éléments de démonstration à remplacer ou à autoriser avant toute publication commerciale.

## Avant publication

- Remplacer les photos temporaires ou établir les droits ; confirmer recettes, tarifs et horaires réels.
- Remplacer les exemples juridiques et l’e-mail example.invalid par des informations validées.
- Vérifier les paramètres réels Pages, DNS, HTTPS, redirections et en-têtes.
- Search Console, Google Business Profile, indexation, données terrain et visibilité IA restent hors preuve.

## Copie : W01–W10

| ID | État | Preuve / raison |
| --- | --- | --- |
| W01 | PASS | Pas de dépendance aux tirets longs dans la copie |
| W02 | PASS | Pas de formule répétée « pas X, mais Y » |
| W03 | PASS | Pas de ponctuation par emojis |
| W04 | PASS | Textes de restaurant en paragraphes courts |
| W05 | PASS | Pas de slogans artificiellement regroupés par trois |
| W06 | JUSTIFIED | Réserves limitées aux faits réellement non fournis |
| W07 | PASS | Longueurs adaptées aux sections et aux recettes |
| W08 | PASS | Les réponses FAQ répondent directement |
| W09 | PASS | Copie spécifique à la pizza, sans vocabulaire SaaS |
| W10 | PASS | Typographie française cohérente avec la trattoria |

## Crédibilité : P01–P20

| ID | État | Preuve / raison |
| --- | --- | --- |
| P01 | JUSTIFIED | URL de projet GitHub Pages demandée par le propriétaire ; le domaine personnalisé verone.fr n’est plus la cible de cet artefact |
| P02 | PASS | Palette du brief, aucun dégradé violet / bleu |
| P03 | JUSTIFIED | Photos culinaires Del Arte réelles et créditées, utilisées comme exemples ; elles ne prouvent pas les produits du restaurant ni des droits commerciaux |
| P04 | PASS | Aucun avis ni témoignage |
| P05 | PASS | Navigation, filtre tomate / crème + végétarien, réinitialisation, dialogue, FAQ et liens tel vérifiés ; aucun faux panier |
| P06 | PASS | Aucun reveal généralisé |
| P07 | PASS | Accueil restaurant, carte et informations pratiques séparés, plus les pages légales |
| P08 | JUSTIFIED | Monogramme V et mot-symbole créés pour cette identité |
| P09 | PASS | Favicon SVG et icône Apple fournis |
| P10 | PASS | Rouge uni sur le titre, aucun effet animé |
| P11 | UNKNOWN | Exemples juridiques explicitement fictifs, hébergement Pages renseigné et traitements IP décrits ; identité et contact réels restent à valider |
| P12 | PASS | CGU écrites pour les fonctions réelles de la démonstration |
| P13 | PASS | Aucun compteur de visiteurs |
| P14 | PASS | Aucun nombre de clients inventé |
| P15 | PASS | Aucun KPI ou résultat commercial inventé |
| P16 | PASS | Petits SVG cohérents, aucun emoji fonctionnel |
| P17 | PASS | Pizza et carte identifiables au premier écran |
| P18 | JUSTIFIED | Fraunces italique du brief, sans police manuscrite ajoutée |
| P19 | PASS | Aucun badge de générateur |
| P20 | PASS | Copie d’accueil factuelle, slogans génériques retirés des pages et de l’image sociale |

## Design : D01–D24

| ID | État | Preuve / raison |
| --- | --- | --- |
| D01 | PASS | Aucun dégradé agressif |
| D02 | PASS | Pas de sceau flottant ; wordmark et icônes simplifiés |
| D03 | PASS | Rendus clair / sombre inspectés sur l’accueil, la carte et les informations pratiques ; axe A / AA repasse dans les parcours actuels. Cela ne constitue pas une certification WCAG exhaustive |
| D04 | PASS | Tokens de la palette obligatoire |
| D05 | PASS | Rayons limités à 2 px pour les contrôles et 4 px pour les images / dialogue ; contenu en lignes sans cadres de carte |
| D06 | PASS | Surtitres retirés des sections ; un seul libellé descriptif reste dans le dialogue de recette |
| D07 | PASS | Pas de glassmorphism |
| D08 | JUSTIFIED | Fraunces et Manrope explicitement demandées |
| D09 | JUSTIFIED | Fine séparation typographique liée à la voix italienne |
| D10 | PASS | Pas de bento |
| D11 | N/A | Aucun terminal décoratif |
| D12 | PASS | Pas de liste automatique de coches |
| D13 | N/A | Aucun abonnement ou grille de forfaits |
| D14 | JUSTIFIED | Compositions lisibles et photographies appétissantes ; références provisoires de démonstration à remplacer avant usage commercial |
| D15 | PASS | CSS natif et tokens maison, sans kit de composants tiers |
| D16 | PASS | Aucun thème IA violet / noir |
| D17 | N/A | Aucun chargement de données ou envoi asynchrone |
| D18 | PASS | Aucun halo ou orb |
| D19 | PASS | Pas de texture CSS ajoutée ; bois issu de la photographie |
| D20 | PASS | SVG simples pour feuille, téléphone, menu et informations utiles |
| D21 | PASS | Aucun curseur, particule ou gimmick de défilement |
| D22 | PASS | États de survol réservés aux actions, sans affaiblissement visuel |
| D23 | PASS | Aucun néon |
| D24 | PASS | Accents rouge et vert hiérarchisés sur la palette chaude |

## Complétude : L01–L20

| ID | État | Preuve / raison |
| --- | --- | --- |
| L01 | PASS | 404 personnalisée, statut local 404 et noindex ; réponse réelle de Pages à vérifier |
| L02 | PASS | CTA desktop visible ; accès fixe carte / appel mobile |
| L03 | PASS | Huit titres distincts |
| L04 | PASS | Huit descriptions distinctes |
| L05 | PASS | Image sociale 1200 × 630 et métadonnées absolues dans le build ; disponibilité publique non prouvée |
| L06 | PASS | Favicon SVG, icône Apple 180 × 180 |
| L07 | PASS | Aperçu noindex / robots bloquant ; production autorisant les trois pages commerciales |
| L08 | PASS | Sitemap construit avec trois URL canoniques sous https://bastienlopez.github.io/pizzeria_toto/ ; aucune soumission GSC ni indexation prouvée |
| L09 | PASS | Alt sur les photos, SVG décoratifs masqués aux lecteurs d’écran |
| L10 | PASS | Les 78 parcours couvrent six profils mobile / desktop et clair / sombre ; les pages principales ne débordent pas. Captures manuelles à 320 × 780, 390 × 844 et 1440 × 1000. Les cibles de navigation tablette et filtres restent à 44 px minimum |
| L11 | PASS | Barre mobile fixe carte / appel, marge de pied de page |
| L12 | N/A | Aucun formulaire, transaction ou récupération API |
| L13 | N/A | Aucun formulaire |
| L14 | N/A | Aucune soumission ou transaction simulée |
| L15 | PASS | Préférence de thème, fonctions locales et collecte IP de GitHub Pages décrites ; identité juridique fictive signalée, informations réelles à valider |
| L16 | UNKNOWN | CGU de la démo présentes ; conditions commerciales réelles à établir par l’éditeur |
| L17 | N/A | Aucun suivi non essentiel ; seule préférence de thème locale, divulguée dans la confidentialité |
| L18 | N/A | Aucune statistique de visite, décision volontaire |
| L19 | UNKNOWN | Tous les appels et métadonnées dérivent du numéro canonique ; contre-exemple de changement de coordonnées devenu PASS. Ligne réelle non appelée |
| L20 | PASS | Aucune image du dialogue avant ouverture ; picture responsive repris depuis la carte, AVIF ou WebP selon le navigateur. Le test navigateur confirme le chargement de la variante sélectionnée sans fallback superflu |

## Sécurité : S01–S20

| ID | État | Preuve / raison |
| --- | --- | --- |
| S01 | PASS | Aucun secret observé dans les sources courantes revues ou le livrable ; résultat limité au périmètre, pas à l’historique |
| S02 | UNKNOWN | Historique Git complet non audité |
| S03 | N/A | Aucun identifiant de service |
| S04 | N/A | Aucune base ou donnée privée |
| S05 | N/A | Aucun stockage de données sensibles |
| S06 | N/A | Aucune authentification |
| S07 | N/A | Aucun objet privé accessible par identifiant |
| S08 | N/A | Aucune API d’écriture |
| S09 | N/A | Aucune session ou cookie |
| S10 | N/A | Aucun mot de passe |
| S11 | N/A | Aucun accès authentifié |
| S12 | N/A | Aucun formulaire public |
| S13 | N/A | Aucune base SQL |
| S14 | PASS | Chemins et méthodes contrôlés côté serveur ; métadonnées de carte contrôlées au build |
| S15 | PASS | Données échappées au build et texte du dialogue via textContent |
| S16 | N/A | Aucun upload |
| S17 | N/A | Aucun sérialiseur ou réponse API métier |
| S18 | UNKNOWN | En-têtes restrictifs et CSP hashée observés sur localhost ; les fichiers _headers ne prouvent pas les réponses de GitHub Pages |
| S19 | UNKNOWN | HTTPS, DNS, domaine et configuration Pages réels non vérifiés ; échec d’ouverture par l’outil web sans diagnostic de panne |
| S20 | PASS | `npm audit --audit-level=moderate` : zéro vulnérabilité déclarée ; aucune dépendance de production ; pas une preuve d’absence de faille |

## Mesures et limites

Le sitemap et les métadonnées construits pointent vers `bastienlopez.github.io/pizzeria_toto`. Le livrable passe ses budgets à 1 550 547 octets, soit 23 001 octets de moins que la construction de référence avant cette refonte. Les 78 parcours navigateur couvrent six profils et axe A / AA sur les pages principales. `npm audit` rapporte zéro vulnérabilité connue au moment du contrôle.

Aucun Lighthouse n’a été relancé dans cet audit ; les scores et Core Web Vitals ponctuels des rapports précédents ne sont pas présentés comme une mesure de cette version. Les captures visuelles restent locales dans le répertoire QA ignoré par Git. Le scanner statique anti-slop fournit des pistes seulement : ses faux négatifs sur le sitemap et le favicon ont été contredits par l’artefact construit, et ses motifs d’interpolation ne prouvent aucune vulnérabilité.

Le déploiement GitHub Pages, le DNS, HTTPS, les en-têtes réels, Search Console, l’indexation, Google Business Profile, CrUX / INP terrain, lecteurs d’écran et appareils physiques restent NON PROUVÉS ou NON TESTÉS. Les informations juridiques réelles, horaires, droits des photos et prix sont aussi à confirmer avant la publication commerciale.
