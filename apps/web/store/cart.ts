"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Le panier ne stocke QUE des identifiants et des quantités : jamais de prix.
 * Les montants affichés sont dérivés du catalogue ; le backend recalcule tout au paiement.
 */
export interface CartLine {
  variantId: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  /** `limit` = min(stock, quantité max par ligne). Retourne la quantité réellement ajoutée. */
  add: (variantId: string, quantity: number, limit: number) => number;
  setQuantity: (variantId: string, quantity: number, limit: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

const isLine = (v: unknown): v is CartLine =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as CartLine).variantId === "string" &&
  Number.isInteger((v as CartLine).quantity) &&
  (v as CartLine).quantity > 0;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      add: (variantId, quantity, limit) => {
        const existing = get().lines.find((l) => l.variantId === variantId);
        const current = existing?.quantity ?? 0;
        const next = Math.min(current + quantity, limit);
        const added = next - current;
        if (added <= 0) return 0;
        set((s) => ({
          lines: existing
            ? s.lines.map((l) => (l.variantId === variantId ? { ...l, quantity: next } : l))
            : [...s.lines, { variantId, quantity: next }],
        }));
        return added;
      },
      setQuantity: (variantId, quantity, limit) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.variantId !== variantId)
              : s.lines.map((l) =>
                  l.variantId === variantId ? { ...l, quantity: Math.min(quantity, limit) } : l,
                ),
        })),
      remove: (variantId) => set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "maison-cart",
      version: 1,
      partialize: (s) => ({ lines: s.lines }),
      // Nettoie toute donnée corrompue ou modifiée à la main dans localStorage.
      merge: (persisted, current) => {
        const raw = (persisted as { lines?: unknown } | undefined)?.lines;
        return { ...current, lines: Array.isArray(raw) ? raw.filter(isLine) : [] };
      },
    },
  ),
);
