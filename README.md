# Maison — boutique mono-produit premium

> Phase 1/14 : architecture, schéma de données, seed. Les apps `web` et `api` sont créées aux phases 2 et 4.
> Le contenu produit du seed est une **démonstration** (`isDemo = true`).

## Prérequis
- Node.js ≥ 20.11, pnpm ≥ 9, Docker (PostgreSQL local) ou une base PostgreSQL hébergée.

## Démarrage (depuis la racine du projet)
```bash
pnpm install
cp .env.example .env            # puis renseigner JWT_* et SEED_ADMIN_PASSWORD
docker compose up -d            # PostgreSQL local
pnpm db:generate                # génère le client Prisma
pnpm db:migrate -- --create-only --name init   # crée la migration sans l'appliquer
# → ajouter les CHECK de docs/ARCHITECTURE.md dans la migration SQL générée
pnpm db:migrate                 # applique la migration
pnpm db:seed                    # données de démonstration
pnpm db:studio                  # inspection
```

## Variables nécessitant des clés externes
Stripe, Resend, CJdropshipping, Cloudinary : voir `.env.example`. Sans clés, le projet démarre en mode
dégradé (`SUPPLIER_MODE=simulation`, e-mails journalisés).

## Frontend (Phase 2)
```bash
pnpm install
pnpm dev:web          # http://localhost:3000  ·  /design-system pour la référence des composants
pnpm --filter @maison/web typecheck
pnpm --filter @maison/web lint
```
Voir `docs/DESIGN_SYSTEM.md`.

## Pages (Phase 3)
- `/` : landing page (hero, avantages, caractéristiques, fonctionnement, galerie, avis, FAQ, livraison/garanties, CTA final).
- `/produit/ring-light-aura` : fiche produit (galerie avec zoom, variantes, quantité, panier, partage, JSON-LD Product).
- Voir `docs/CONTENT.md` pour les règles de contenu.

## Backend (Phase 4)
```bash
# 1. Base : appliquer le schéma (la Phase 4 ajoute summary/steps à ProductTranslation)
pnpm db:generate
pnpm db:migrate --name phase4       # si vous n'aviez encore rien migré : --name init
pnpm db:seed

# 2. Lancer API + web
pnpm dev:api        # http://localhost:4000/api/v1/health
pnpm dev:web        # http://localhost:3000

# 3. Qualité
pnpm --filter @maison/api typecheck
pnpm --filter @maison/api lint
pnpm --filter @maison/api test      # nécessite `pnpm db:generate` au préalable
```
> Si vous aviez déjà seedé la Phase 1 (produit « produit-demo »), repartez d'une base propre :
> `pnpm --filter @maison/database exec dotenv -e ../../.env -- prisma migrate reset` puis `pnpm db:seed`.

Voir `docs/API.md`. Le fichier `.env` reste unique, à la racine : Prisma, l'API et Next.js le lisent désormais tous.
