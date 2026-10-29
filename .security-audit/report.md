# Security Audit Report

## Scope

- Project root: `C:\Users\UTILISATEUR\Documents\GitHub\pizzeria_toto`
- Detected ecosystems: node
- Local/private target: `http://127.0.0.1:4173`

## Findings summary

| Severity | Count |
|---|---:|
| CRITICAL | 0 |
| HIGH | 0 |
| MEDIUM | 0 |
| LOW | 0 |
| INFO | 0 |

| Validation | Count |
|---|---:|
| CONFIRMED | 0 |
| LIKELY | 0 |
| POTENTIAL | 0 |
| FALSE_POSITIVE | 0 |

## Tools

- npm-audit: return code `0`; timed out `False`
- Optional missing tools: semgrep, trivy
- Basic local DAST: target `http://127.0.0.1:4173`, status `200`, observations `0`

## Findings

No normalized reportable findings are currently present in `.security-audit/findings.json`.

## Coverage gaps and remaining risk

- Périmètre final : Le Verone, site statique en plusieurs pages, production dist/, aperçu .preview/ et tests .test-site/ isolés. Actif : localhost uniquement.
- Scan Codex Security préalable achevé sans finding ; revue indépendante ciblée des changements de CSP, cache, sorties et audit. Modèle final dans .security-audit/threat-model.md et rapport global docs/AUDIT_COMPLET.md.
- 17 tests Node passent, dont confinement des fichiers, redirections, GET/HEAD, refus POST, CSP / SHA exact / CRLF-BOM, cache versionné, négociation Brotli et séparation des profils.
- CSP commune : ressources et connect-src self, seul bootstrap inline autorisé par SHA-256, aucun unsafe-inline. Comparaison HTML / HTTP / _headers testée.
- Douze Lighthouse réels en deux thèmes, mobile et desktop : SEO / accessibilité automatique / bonnes pratiques 100 partout ; performance mobile 99–100 et desktop 100 ; CLS 0.
- npm audit : aucune vulnérabilité signalée et aucune dépendance npm du site. Lighthouse 13.6.0 est un outil temporaire distinct, ses dépendances et les runtimes natifs ne constituent pas une couverture de cet audit npm.
- Observations HTTP locales : statut 200, aucune observation négative. Aucun compte, API métier, base, session, formulaire, paiement, upload ou secret applicatif identifié.
- Semgrep, Trivy et pip-audit indisponibles. Aucune attaque intrusive, cible de production, historique Git ou codec natif audité. HTTPS, hébergeur et production restent non prouvés.
- Photos / prix provisoires, horaires et identité juridique à finaliser. Aucun déploiement, DNS ou changement Search Console effectué.

> This report describes the tested scope and evidence; it is not a guarantee of complete security.
