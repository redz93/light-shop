"use client";

import { useEffect, useState } from "react";

/** Évite les écarts d'hydratation pour les valeurs issues de localStorage. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
