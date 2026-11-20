import { z } from "zod";
import { CURRENCIES, LOCALES, MAX_QUANTITY_PER_LINE } from "./constants";

export const localeSchema = z.enum(LOCALES);
export const currencySchema = z.enum(CURRENCIES);

export const emailSchema = z.string().trim().toLowerCase().email().max(254);

export const passwordSchema = z
  .string()
  .min(10, "10 caractères minimum")
  .max(128)
  .regex(/[a-z]/, "Une minuscule requise")
  .regex(/[A-Z]/, "Une majuscule requise")
  .regex(/[0-9]/, "Un chiffre requis");

export const addressSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  line1: z.string().trim().min(3).max(160),
  line2: z.string().trim().max(160).optional(),
  postalCode: z.string().trim().min(2).max(12),
  city: z.string().trim().min(1).max(80),
  region: z.string().trim().max(80).optional(),
  countryCode: z.string().length(2).toUpperCase(),
  phone: z.string().trim().min(6).max(24),
});
export type AddressInput = z.infer<typeof addressSchema>;

/** Le client n'envoie JAMAIS de prix : uniquement des identifiants et quantités. */
export const cartLineSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_LINE),
});

export const checkoutRequestSchema = z.object({
  email: emailSchema,
  items: z.array(cartLineSchema).min(1).max(20),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  couponCode: z.string().trim().toUpperCase().max(32).optional(),
  locale: localeSchema.default("fr"),
  currency: currencySchema.default("EUR"),
  acceptedTerms: z.literal(true),
});
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const cartQuoteRequestSchema = z.object({
  items: z
    .array(cartLineSchema)
    .max(20)
    .refine((items) => new Set(items.map((i) => i.variantId)).size === items.length, {
      message: "Une variante ne peut apparaître qu'une fois",
    }),
  currency: currencySchema.default("EUR"),
  locale: localeSchema.default("fr"),
  country: z.string().length(2).toUpperCase().optional(),
});
export type CartQuoteRequest = z.infer<typeof cartQuoteRequestSchema>;
