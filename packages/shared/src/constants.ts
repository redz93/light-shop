export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const CURRENCIES = ["EUR", "USD", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Tous les montants sont des entiers en plus petite unité (centimes). */
export const MAX_QUANTITY_PER_LINE = 10;
export const STOCK_RESERVATION_MINUTES = 30;
export const REVIEWS_PAGE_SIZE = 10;
