# Maintenance du projet Le Verone

## Vérifications usuelles
Depuis la racine du dépôt :
- npm run check : syntaxe JavaScript.
- npm test : tests de comportement et de génération.
- npm run build : fichiers statiques de production.
- npm run dev : aperçu local et surveillance des sources.

Voir README.md pour les options et PROJECT_MEMORY.md pour les contraintes durables. Ne pas exécuter une commande absente de package.json par supposition.

## Après une modification
Tester la frontière concernée : pages et navigation, carte et filtres, thèmes et contrastes, métadonnées et robots, ou serveur et en-têtes. Pour une migration ou un audit complet demandé, vérifier toutes les routes pertinentes.

## Outils
Codebase Memory uniquement si le dépôt est déjà indexé. RTK pour les commandes prises en charge. L’absence de hook RTK n’autorise pas à installer un hook global. Les outils manquants doivent être signalés, sans les présenter comme une validation réussie.

Ce dépôt ne définit ni le nombre de MCP, ni la configuration globale de Codex. Aucun token, secret, diagnostic global, mise à jour de plugin ou suppression de cache n’est nécessaire pour construire le site.
