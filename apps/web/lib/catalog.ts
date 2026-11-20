import type { GalleryImage, Product } from "@maison/shared";
import { ApiError, apiGet } from "./api";

export type { GalleryImage, GalleryView, Product, Variant, Testimonial } from "@maison/shared";

const QUERY = "locale=fr&currency=EUR";

/** Visuels provisoires tant qu'aucune photo n'est téléversée pour le produit. */
const placeholderImages: GalleryImage[] = [
  { id: "p1", view: "full", src: null, alt: "Ring light sur trépied, vue d’ensemble (visuel provisoire)" },
  { id: "p2", view: "ring", src: null, alt: "Anneau lumineux et support smartphone (visuel provisoire)" },
  { id: "p3", view: "tripod", src: null, alt: "Trépied déployé (visuel provisoire)" },
  { id: "p4", view: "detail", src: null, alt: "Détail du support smartphone (visuel provisoire)" },
];

const withImages = (p: Product): Product => (p.images.length > 0 ? p : { ...p, images: placeholderImages });

async function fetchProduct(path: string): Promise<Product | null> {
  try {
    return withImages(await apiGet<Product>(path));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export const getPrimaryProduct = () => fetchProduct(`/products/primary?${QUERY}`);
export const getProductBySlug = (slug: string) => fetchProduct(`/products/${encodeURIComponent(slug)}?${QUERY}`);

/** Utilisé par la navigation : ne fait jamais planter la page si l'API est indisponible. */
export async function getPrimarySlug(): Promise<string | null> {
  try {
    return (await getPrimaryProduct())?.slug ?? null;
  } catch {
    return null;
  }
}
