# Revue produit du Verone

29 octobre 2026, mise à jour après les correctifs demandés. La revue globale initiale reste dans docs/AUDIT_GLOBAL_2026-10-29.md ; cette matrice actualise les constats concernés par les corrections et leurs retests. La démonstration est fonctionnelle ; les faits et droits réels restent à finaliser avant publication professionnelle.

Preuves des correctifs : 24 tests Node, 78 tests navigateur, 54 contrôles responsive et douze Lighthouse 13.6.0 sur les trois pages principales, mobile / desktop et clair / sombre. Rapport : [corrections et validation](C:/Users/UTILISATEUR/Documents/GitHub/pizzeria_toto/docs/CORRECTIONS_2026-10-29.md). Les 28 Lighthouse du précédent audit restent des mesures historiques.

États : PASS = vérifié dans le périmètre décrit ; FAIL = défaut observé ; JUSTIFIED = choix intentionnel de la démonstration ; N/A = mécanisme absent ; UNKNOWN = information ou preuve manquante.

94 contrôles : 59 PASS, 0 FAIL, 8 JUSTIFIED, 21 N/A, 6 UNKNOWN. Ce décompte n’est pas un score de conformité.

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
| P01 | PASS | Canonicals et identité verone.fr contrôlés dans le HTML construit ; domaine réellement servi non prouvé |
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
| P20 | PASS | Copie française spécifique au restaurant |

## Design : D01–D24

| ID | État | Preuve / raison |
| --- | --- | --- |
| D01 | PASS | Aucun dégradé agressif |
| D02 | JUSTIFIED | Un cachet italien lié à la photo, pas d’icônes flottantes répétées |
| D03 | PASS | Deux thèmes inspectés ; axe sur trois pages principales et dialogue, Lighthouse accessibilité 100 sur douze runs des principales ; certification exhaustive hors preuve |
| D04 | PASS | Tokens de la palette obligatoire |
| D05 | PASS | Cartes réservées aux pizzas et informations pratiques ; pas d’ombres accumulées |
| D06 | PASS | Hero partagé, grille de carte, photo éditoriale, contact et FAQ distincts |
| D07 | PASS | Pas de glassmorphism |
| D08 | JUSTIFIED | Fraunces et Manrope explicitement demandées |
| D09 | JUSTIFIED | Fine séparation typographique liée à la voix italienne |
| D10 | PASS | Pas de bento |
| D11 | N/A | Aucun terminal décoratif |
| D12 | PASS | Pas de liste automatique de coches |
| D13 | N/A | Aucun abonnement ou grille de forfaits |
| D14 | JUSTIFIED | Compositions lisibles et photographies appétissantes ; références provisoires de démonstration à remplacer avant usage commercial |
| D15 | PASS | Aucun kit de composants ou thème préfabriqué |
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
| L08 | PASS | Sitemap de trois URL canoniques https://verone.fr dans le livrable ; aucune soumission GSC |
| L09 | PASS | Alt sur les photos, SVG décoratifs masqués aux lecteurs d’écran |
| L10 | PASS | 54 contrôles après correctifs : huit pages à 375 / 768 / 1440, deux thèmes ; trois principales aussi à 320. Aucun débordement ; lien tablette La carte désormais 44 × 44 px CSS (arrondi mesuré 43,992) |
| L11 | PASS | Barre mobile fixe carte / appel, marge de pied de page |
| L12 | N/A | Aucun formulaire, transaction ou récupération API |
| L13 | N/A | Aucun formulaire |
| L14 | N/A | Aucune soumission ou transaction simulée |
| L15 | PASS | Préférence de thème, fonctions locales et collecte IP de GitHub Pages décrites ; identité juridique fictive signalée, informations réelles à valider |
| L16 | UNKNOWN | CGU de la démo présentes ; conditions commerciales réelles à établir par l’éditeur |
| L17 | N/A | Aucun suivi non essentiel ; seule préférence de thème locale, divulguée dans la confidentialité |
| L18 | N/A | Aucune statistique de visite, décision volontaire |
| L19 | UNKNOWN | Tous les appels et métadonnées dérivent du numéro canonique ; contre-exemple de changement de coordonnées devenu PASS. Ligne réelle non appelée |
| L20 | PASS | Aucune image du dialogue avant ouverture ; picture responsive repris depuis la carte, AVIF ou WebP selon le navigateur. Plus de WebP Margherita supplémentaire dans Lighthouse à froid |

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
| S20 | PASS | npm audit actuel : zéro vulnérabilité déclarée, cinq paquets de développement et aucune dépendance de production ; pas une preuve d’absence de faille |

## Mesures et limites

Après correction du dialogue : douze Lighthouse des pages principales, performance 98–100, accessibilité / bonnes pratiques / SEO à 100. LCP maximal 2,124 s, CLS maximal 0,062014 et TBT maximal 52 ms. Le CLS n’est pas nul ; ces passages ponctuels ne prouvent pas des Core Web Vitals terrain. Les pages légales gardent leur noindex intentionnel.

Le scan Codex Security du précédent audit porte sur l’instantané avant correction ; il n’a pas été relancé. Les tests de sécurité / échappement Node et l’audit npm ont été réexécutés après les modifications ; npm audit reste à zéro. Aucun déploiement ni test offensif distant.

Lecteur d’écran, appareils physiques, audit WCAG exhaustif, CrUX / INP terrain, indexation, GSC / GBP et citations IA : NON TESTÉS ou NON PROUVÉS. Les comptes, paramètres et en-têtes de production ne sont pas validés par les tests locaux.
