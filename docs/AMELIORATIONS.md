# Axes d’amélioration du Verone

Revue du 28 octobre 2026, après l’audit initial et l’ajout des tests / CI. Priorités fondées sur les sources actuelles ; aucun résultat commercial ou de référencement n’est inventé.

## Priorités avant publication professionnelle

| Priorité | Constat | Action utile |
| --- | --- | --- |
| P1 | Les visuels sont des références Del Arte ; aucun cliché réel du restaurant n’est disponible. | Photographier les pizzas et le lieu, obtenir les droits, puis remplacer toutes les variantes WebP / AVIF et l’image de partage. C’est le principal gain de crédibilité et d’identité locale. |
| P1 | Les tarifs sont fictifs ; horaires et modalités de retrait restent à confirmer. | Valider la carte, les compositions / allergènes, les vrais horaires, le téléphone et le fonctionnement des commandes. Mettre ensuite les informations utiles près des actions carte / appel et dans la page pratique. |
| P1 | Identité juridique, contact professionnel et hébergeur sont incomplets. | Finaliser les pages légales avec les informations réelles avant de présenter le site comme une vitrine professionnelle finalisée. |
| P1 | Pages et le domaine ne sont pas configurés ou testés dans ce travail. | Suivre le guide CI/CD, vérifier le domaine, HTTPS, les accès directs aux pages et la vraie 404. Conserver une preuve de la première livraison réussie. |

## Améliorations techniques suivantes

| Priorité | Preuve / limite actuelle | Suite proposée |
| --- | --- | --- |
| P2 | Dans `src/app.mjs`, la fiche pizza reçoit encore le `src` WebP de la carte, alors que celle-ci possède une source AVIF. Le dialogue contient aussi une image initiale sans chargement différé. | Utiliser une image AVIF / WebP responsive dans le dialogue et mesurer les requêtes avant / après ouverture. Gain à mesurer ; ce changement visuel n’est pas inclus dans les ajouts de CI. |
| P2 | Les règles HTTP du serveur Node ne sont pas interprétées par le workflow Pages. | Mesurer les en-têtes et redirections sur le site réellement publié ; choisir un hébergement ou une couche HTTP adaptée si des règles personnalisées deviennent indispensables. |
| P2 | Aucun smoke test automatisé du site public, aucune propriété Search Console vérifiée et aucune donnée terrain n’ont été établis. | Après la première publication autorisée, contrôler les routes et ressources publiques, activer Search Console et suivre les pages réellement indexées / Core Web Vitals. |
| P3 | Les contrôles actuels couvrent Chromium / WebKit émulés, clavier et axe ; aucun appareil physique ni lecteur d’écran n’a été testé. | Faire une recette sur iPhone / Android réels et avec lecteur d’écran, notamment menu, filtres, fiche et barre d’appel. |

## Réalisé dans cette évolution

- Tests navigateur reproductibles : 11 scénarios, six profils, 66 vérifications réussies en clair et sombre.
- 22 tests Node, dont des preuves négatives sur fichier privé, aperçu non indexable, CSS hors budget et URL Pages incompatible.
- CI Linux / Windows avec versions verrouillées, audit npm, vérification des workflows et rapports de test conservés.
- Livraison automatique GitHub Pages sur push à `main`, après validation du même commit ; artefact public contrôlé, URL canonique du projet exigée et permissions limitées.
- Budgets de ressources automatiques ; aucune dépendance npm de production ajoutée.

La préparation locale ne vaut pas preuve d’exécution GitHub. Voir [CI/CD et activation](CI_CD.md), [audit initial](AUDIT_COMPLET.md) et [référencement](SEO_REFERENCEMENT.md).
