import type { StoreSettings } from "@maison/shared";
import { apiGet } from "./api";

/** Réglages publics (livraison, rétractation…) lus depuis l'API. null si indisponible. */
export async function getStoreSettings(): Promise<StoreSettings | null> {
  try {
    return await apiGet<StoreSettings>("/store/settings");
  } catch {
    return null;
  }
}

/** Active « Passer la commande » (Phases 6-7). */
export const checkoutEnabled = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";
