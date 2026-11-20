import type { Prisma } from "@maison/database";
import { AppError } from "../../utils/app-error";

/**
 * Gestion du stock concurrent. À appeler DANS une transaction (prisma.$transaction).
 * Chaque opération est un UPDATE conditionnel atomique : deux clients simultanés ne peuvent pas
 * réserver le même dernier exemplaire. Utilisé par le checkout (Phase 6-7).
 *
 *   disponible = onHand − reserved
 *   réserver   : reserved += q           (si disponible ≥ q)
 *   libérer    : reserved −= q           (paiement échoué / commande expirée)
 *   confirmer  : onHand −= q, reserved −= q   (paiement confirmé)
 */
type Tx = Prisma.TransactionClient;
export interface StockItem {
  variantId: string;
  quantity: number;
}

// Ordre déterministe => pas d'interblocage entre transactions concurrentes.
const ordered = (items: StockItem[]) => [...items].sort((a, b) => a.variantId.localeCompare(b.variantId));

export async function reserveStock(tx: Tx, items: StockItem[]): Promise<void> {
  for (const { variantId, quantity } of ordered(items)) {
    const updated = await tx.$executeRaw`
      UPDATE "Inventory"
      SET "reserved" = "reserved" + ${quantity}, "updatedAt" = NOW()
      WHERE "variantId" = ${variantId} AND "onHand" - "reserved" >= ${quantity}`;
    if (updated === 0) throw new AppError(409, "INSUFFICIENT_STOCK", "Stock insuffisant", { variantId });
  }
}

export async function releaseStock(tx: Tx, items: StockItem[]): Promise<void> {
  for (const { variantId, quantity } of ordered(items)) {
    await tx.$executeRaw`
      UPDATE "Inventory"
      SET "reserved" = GREATEST("reserved" - ${quantity}, 0), "updatedAt" = NOW()
      WHERE "variantId" = ${variantId}`;
  }
}

export async function commitStock(tx: Tx, items: StockItem[]): Promise<void> {
  for (const { variantId, quantity } of ordered(items)) {
    const updated = await tx.$executeRaw`
      UPDATE "Inventory"
      SET "onHand" = "onHand" - ${quantity}, "reserved" = "reserved" - ${quantity}, "updatedAt" = NOW()
      WHERE "variantId" = ${variantId} AND "reserved" >= ${quantity} AND "onHand" >= ${quantity}`;
    if (updated === 0) throw new AppError(409, "STOCK_COMMIT_FAILED", "Impossible de confirmer le stock", { variantId });
  }
}
