# API REST — Phase 4

Base : `http://localhost:4000/api/v1`. Montants en centimes. Erreurs normalisées :
`{ "error": { "code", "message", "details?", "requestId" } }`.

| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Liveness |
| GET | `/health/ready` | Readiness (ping base de données) |
| GET | `/products/primary?locale=fr&currency=EUR` | Produit vedette (variantes, prix, stock disponible) |
| GET | `/products/:slug` | Produit par slug |
| GET | `/products/:slug/reviews/summary` | Moyenne, nombre, répartition (avis approuvés uniquement) |
| GET | `/products/:slug/reviews?page=1` | Avis approuvés, paginés |
| GET | `/store/settings` | Réglages publics (livraison, rétractation, devises) |
| POST | `/cart/quote` | Devis serveur : `{ items:[{variantId,quantity}], currency, locale, country? }` |

## Principes
- **Le client n'envoie jamais de prix.** `/cart/quote` recalcule tout depuis la base : prix, stock disponible (`onHand − reserved`), livraison, pays desservi.
- `quote.ok` n'est `true` que si le panier est payable tel quel (stock suffisant, devise tarifée, livraison configurée).
- Stock : `modules/inventory/stock.service.ts` fournit `reserveStock` / `releaseStock` / `commitStock` (UPDATE conditionnel atomique, ordre déterministe anti-interblocage). Ils seront appelés dans une transaction par le checkout (Phases 6-7).
- Sécurité en place : Helmet, CORS strict (FRONTEND_URL + CORS_ORIGINS), rate limiting global (240/min) et sur `/cart/quote` (60/min), corps JSON limité à 100 Ko, validation Zod, erreurs internes masquées en production, `X-Request-Id` propagé dans les logs, secrets masqués dans les logs.
- Les colonnes JSON (avantages, FAQ, specs…) sont validées à la lecture : une donnée mal formée ne casse pas l'API.
- Hors périmètre de cette phase : authentification (Phase 5), commandes et paiement (Phases 6-7), écriture des avis (Phase 8), administration (Phase 9).
