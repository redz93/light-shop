# Architecture — Phase 1

## Principes
- Monorepo pnpm : `apps/web` (Next.js), `apps/api` (Express), `packages/database` (Prisma), `packages/shared` (Zod + constantes).
- Le **backend est la seule source de vérité** pour prix, stock, remises, statuts de commande.
- Montants en **entiers (centimes)**, avec devise explicite.
- Mono-produit aujourd'hui (`Product.isPrimary`), multi-produits sans refonte (modèle Product/Variant complet).
- Fournisseur dropshipping derrière une interface `SupplierProvider` (CJ, AliExpress, simulation).

## Flux de paiement (cible)
1. `POST /checkout` : validation Zod → recalcul des prix en base → réservation atomique du stock → création `Order(PENDING_PAYMENT)` → Stripe Checkout Session (idempotency key) → URL.
2. Stripe → `POST /webhooks/stripe` : vérification de signature (corps brut) → insertion `WebhookEvent(provider, eventId)` unique → traitement.
3. `checkout.session.completed` / `payment_intent.succeeded` : `Order=PAID`, `Payment=SUCCEEDED`, e-mail de confirmation, création `SupplierOrder`.
4. Expédition : `Shipment.shippedAt` renseigné uniquement après confirmation du fournisseur (job de synchronisation).
5. Jobs : expiration des commandes impayées (libération du stock), retry fournisseur, relance panier (avec consentement).

## Stock concurrent
Réservation par UPDATE conditionnel atomique :
`UPDATE "Inventory" SET reserved = reserved + $qty WHERE "variantId" = $id AND "onHand" - reserved >= $qty` ; 0 ligne affectée = stock insuffisant.

## Contraintes SQL à ajouter à la première migration
Prisma ne génère pas les CHECK. Après `migrate dev --create-only`, ajouter dans le `migration.sql` :

```sql
ALTER TABLE "Review"    ADD CONSTRAINT review_rating_range CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE "Inventory" ADD CONSTRAINT inventory_non_negative CHECK ("onHand" >= 0 AND reserved >= 0 AND reserved <= "onHand");
ALTER TABLE "CartItem"  ADD CONSTRAINT cartitem_qty_positive CHECK (quantity > 0);
ALTER TABLE "OrderItem" ADD CONSTRAINT orderitem_qty_positive CHECK (quantity > 0);
ALTER TABLE "Coupon"    ADD CONSTRAINT coupon_value_positive CHECK (value >= 0);
```

## Sécurité (choix)
- Argon2id pour les mots de passe.
- Access token JWT court (15 min) + refresh token opaque stocké **haché** (SHA-256), rotation avec détection de réutilisation (`familyId`), cookies HttpOnly/Secure/SameSite.
- Auth par cookie ⇒ protection CSRF (SameSite + en-tête personnalisé/double-submit sur les routes mutantes).
- Suivi de commande invité : numéro + e-mail + jeton de consultation haché.
