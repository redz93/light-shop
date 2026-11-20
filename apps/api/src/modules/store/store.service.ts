import { prisma } from "@maison/database";
import { z } from "zod";
import type { StoreSettings } from "@maison/shared";

const amounts = z.record(z.string(), z.number().int().nonnegative());

const FALLBACK: StoreSettings = {
  name: "Maison",
  defaultCurrency: "EUR",
  currencies: ["EUR"],
  shipping: { flatRate: {}, freeThreshold: {}, countries: [], estimateDays: null },
  withdrawalDays: 14,
};

let cache: { value: StoreSettings; expiresAt: number } | null = null;

/** À appeler après toute modification des réglages depuis l'administration. */
export function invalidateSettingsCache() {
  cache = null;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (cache && cache.expiresAt > Date.now()) return cache.value;

  const rows = await prisma.siteSetting.findMany();
  const read = <T>(key: string, schema: z.ZodType<T>, fallback: T): T => {
    const row = rows.find((r) => r.key === key);
    const parsed = schema.safeParse(row?.value);
    return parsed.success ? parsed.data : fallback;
  };

  const value: StoreSettings = {
    name: read("store.name", z.string(), FALLBACK.name),
    defaultCurrency: read("store.defaultCurrency", z.string().length(3), FALLBACK.defaultCurrency),
    currencies: read("store.currencies", z.array(z.string().length(3)), FALLBACK.currencies),
    shipping: {
      flatRate: read("shipping.flatRate", amounts, {}),
      freeThreshold: read("shipping.freeThreshold", amounts, {}),
      countries: read("shipping.countries", z.array(z.string().length(2)), []),
      estimateDays: read(
        "shipping.estimateDays",
        z.object({ min: z.number().int().positive(), max: z.number().int().positive() }).nullable(),
        null,
      ),
    },
    withdrawalDays: read("store.withdrawalDays", z.number().int().positive(), FALLBACK.withdrawalDays),
  };

  cache = { value, expiresAt: Date.now() + 60_000 };
  return value;
}
