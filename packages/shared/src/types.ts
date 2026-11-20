/** Contrats API partagés entre apps/api (producteur) et apps/web (consommateur). Montants en centimes. */

export type GalleryView = "full" | "ring" | "tripod" | "detail";

export interface GalleryImage {
  id: string;
  alt: string;
  /** null => visuel provisoire (illustration). Sinon URL de l'image. */
  src: string | null;
  view: GalleryView;
}

export interface Variant {
  id: string;
  sku: string;
  name: string;
  options: Record<string, string>;
  price: number;
  compareAt: number | null;
  /** Stock disponible = en main − réservé. */
  stock: number;
  lowStockAt: number;
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string[];
  benefits: { title: string; text: string; icon: string }[];
  specs: { label: string; value: string }[];
  steps: { title: string; text: string }[];
  usageTips: string[];
  careTips: string[];
  faq: { q: string; a: string }[];
  currency: string;
  variants: Variant[];
  images: GalleryImage[];
  videoUrl: string | null;
  testimonials: Testimonial[];
  beforeAfter: null | { beforeSrc: string; afterSrc: string; caption: string };
  isDemo: boolean;
}

export type LineIssue = "UNKNOWN_VARIANT" | "UNAVAILABLE_CURRENCY" | "OUT_OF_STOCK" | "QUANTITY_REDUCED";
export type QuoteIssue = "EMPTY_CART" | "COUNTRY_NOT_SERVED" | "SHIPPING_UNAVAILABLE";

export interface QuoteLine {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  imageUrl: string | null;
  unitAmount: number;
  requestedQuantity: number;
  /** Quantité réellement acceptée (plafonnée au stock et au maximum par ligne). */
  quantity: number;
  maxQuantity: number;
  lineTotal: number;
  issues: LineIssue[];
}

export interface CartQuote {
  currency: string;
  lines: QuoteLine[];
  subtotal: number;
  /** null = aucun tarif configuré pour cette devise. */
  shipping: number | null;
  total: number;
  /** true uniquement si le panier peut être payé tel quel. */
  ok: boolean;
  issues: QuoteIssue[];
}

export interface StoreSettings {
  name: string;
  defaultCurrency: string;
  currencies: string[];
  shipping: {
    flatRate: Record<string, number>;
    freeThreshold: Record<string, number>;
    countries: string[];
    estimateDays: { min: number; max: number } | null;
  };
  withdrawalDays: number;
}

export interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface ReviewSummary {
  average: number | null;
  count: number;
  /** distribution[0] = avis 1 étoile … distribution[4] = 5 étoiles */
  distribution: [number, number, number, number, number];
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
