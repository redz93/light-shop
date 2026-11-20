/** Les montants sont toujours des entiers en centimes (EUR, USD, GBP : 2 décimales). */
export function formatPrice(amountInCents: number, currency = "EUR", locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amountInCents / 100);
}
