# Design system — Phase 2

Direction : « halo ». Fond quasi noir, accent ambre chaud évoquant une lumière, détails bleu froid en secondaire.
Thème sombre par défaut (clair disponible). Langue : français.

## Tokens (`apps/web/app/globals.css`)
| Token | Sombre | Usage |
|---|---|---|
| bg | #0A0A0C | fond de page |
| surface / surface-2 | #131317 / #1C1C22 | cartes, zones secondaires |
| border / border-strong | #282830 / #42424E | séparateurs / contrôles |
| fg / muted | #F5F5F7 / #A1A1AC | texte / texte atténué |
| accent | #FFB547 | CTA, liens, halo |
| accent-2 | #7DD3FC | information secondaire |
| success / warning / danger | | états |

Les composants n'utilisent que ces tokens (pas de couleur en dur) : un changement de marque ou de produit = modifier les variables.

## Règles
- Rayons : 8 / 12 / 16 / 24 px. Ombres discrètes ; l'ombre « glow » est réservée aux CTA principaux et éléments mis en avant.
- Cibles tactiles ≥ 44 px ; champs en 16 px sur mobile (pas de zoom iOS).
- Animations : Framer Motion, courtes (≤ 0,5 s), désactivées par `prefers-reduced-motion`.
- Une note ou un ancien prix n'est affiché que s'il est réel (composants `Rating` et `Price`).

## Voir le rendu
`pnpm dev:web` puis http://localhost:3000/design-system (page indisponible en production).

## Adapter à un autre produit
Remplacer `placeholderProduct` et `RingLightIllustration` (Phase 3 : photos réelles + données API). L'accent ambre convient aux produits « lumière » ; pour un autre gadget, ajuster `--accent` et `--accent-2`.
