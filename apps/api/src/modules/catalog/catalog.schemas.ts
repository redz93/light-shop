import { z } from "zod";
import { currencySchema, localeSchema } from "@maison/shared";

export const catalogQuerySchema = z.object({
  locale: localeSchema.default("fr"),
  currency: currencySchema.default("EUR"),
});
export type CatalogQuery = z.infer<typeof catalogQuerySchema>;

export const slugParamSchema = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,100}$/) });

// Les colonnes Json sont validées à la lecture : une donnée mal formée ne fait jamais planter l'API.
export const benefitsSchema = z.array(z.object({ title: z.string(), text: z.string(), icon: z.string() }));
export const specsSchema = z.array(z.object({ label: z.string(), value: z.string() }));
export const stepsSchema = z.array(z.object({ title: z.string(), text: z.string() }));
export const faqSchema = z.array(z.object({ q: z.string(), a: z.string() }));
