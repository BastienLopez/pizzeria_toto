# Modèle de menace final : Le Verone

28 octobre 2026. Périmètre : sources du site statique et outils locaux ; aucune cible de production testée.

## Architecture
data/site.json et data/menu.json + src/*.html → scripts/build.mjs → dist/ (production), .preview/ (aperçu) ou .test-site/ (tests). La liste des trois destinations est fermée, le parent absolu et le nom sont vérifiés avant remplacement.

Le serveur CLI sert uniquement des fichiers générés, écoute 127.0.0.1, autorise GET / HEAD et refuse les répertoires, chemins cachés, NUL, antislashs et sorties du préfixe résolu. Les redirections proviennent des routes constantes ; aucun paramètre visiteur ne choisit un hôte ou un dossier de génération.

## Frontières et contrôles
- Mainteneur → build : JSON / templates locaux de confiance opérateur ; texte et attributs échappés, identifiants et bases bornés, liens de recettes HTTPS / www.delarte.fr.
- Visiteur → fichiers publics : contrôles de chemins et méthodes, stat/isFile et racine générée fixe. Aucun upload, endpoint d’écriture ou exécution de commande exposée.
- Contenu → navigateur : texte de dialogue via textContent ; CSP partagée dans scripts/security-policy.mjs. Le seul script inline est le bootstrap exact autorisé par SHA-256, sans unsafe-inline. Les fins de ligne / BOM sont normalisés ; HTML, HTTP et _headers sont comparés par un test.
- Navigateur → tiers : ressources de même origine ; connect-src self. Les liens Maps, téléphone et documentaires sont activés par le visiteur ; aucun chargement automatique de carte ou suivi d’audience.
- Préférence de thème : localStorage verone-theme, valeurs light / dark uniquement, sans identité et sans transmission.
- Cache : ressources publiques versionnées par leur contenu ; HTML sans cache long. Brotli respecte q=0, Vary et ETag. L’hébergement final doit appliquer réellement les fichiers générés.
- Audit Lighthouse : cible HTTP initiale limitée à localhost / 127.0.0.1 ; Chrome de test séparé via chrome-launcher, fermeture en finally. Aucun profil utilisateur n’est demandé. Les dépendances d’outil viennent de Lighthouse 13.6.0 temporaire, pas des dépendances du site.

## Résultats et limites
Le scan Codex Security préalable n’a retenu aucun finding. Une revue indépendante ciblée a relu les changements de CSP, sorties, cache, bootstrap et outil Lighthouse ; aucune vulnérabilité étayée retenue. Les dernières adaptations AVIF et de niveaux de titres ont été relues par le parent et retestées.

17 tests passent, dont chemins / méthodes / en-têtes, profils séparés, CSP du bootstrap, normalisation Windows, données structurées et cache. Les navigateurs de contrôle ont effectivement exécuté le bootstrap dans les deux thèmes.

Aucun compte, session, formulaire, base, API métier, paiement, stockage de données client ou credential applicatif identifié. Historique Git, codecs natifs des images / polices, dépendances du runtime, appareil physique et hébergement futur hors preuve. L’absence de finding n’est pas une garantie exhaustive.

Les droits des photos, vrais prix, horaires et mentions professionnelles restent à finaliser. Robots / noindex ne sont pas des protections d’accès.
