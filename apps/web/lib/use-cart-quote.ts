"use client";

import { useCallback, useEffect, useState } from "react";
import type { CartQuote } from "@maison/shared";
import type { CartLine } from "@/store/cart";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface State {
  quote: CartQuote | null;
  loading: boolean;
  error: boolean;
}

/** Demande au serveur le devis du panier : prix, stock et livraison viennent de la base. */
export function useCartQuote(lines: CartLine[], enabled: boolean) {
  const [state, setState] = useState<State>({ quote: null, loading: false, error: false });
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify(lines);

  useEffect(() => {
    if (!enabled) return;
    const items = JSON.parse(key) as CartLine[];
    if (items.length === 0) {
      setState({ quote: null, loading: false, error: false });
      return;
    }

    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: false }));
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/v1/cart/quote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, currency: "EUR", locale: "fr" }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        setState({ quote: (await res.json()) as CartQuote, loading: false, error: false });
      } catch {
        if (!controller.signal.aborted) setState({ quote: null, loading: false, error: true });
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, enabled, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
