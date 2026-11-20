import Image from "next/image";
import type { GalleryImage } from "@/lib/catalog";
import { RingLightIllustration } from "@/components/brand/ring-light-illustration";

/** Affiche la vraie photo si `src` existe, sinon l'illustration provisoire. */
export function GalleryVisual({
  image,
  sizes,
  priority = false,
}: {
  image: GalleryImage;
  sizes: string;
  priority?: boolean;
}) {
  if (image.src) {
    return <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />;
  }
  return (
    <div className="absolute inset-0 p-6 sm:p-8">
      <RingLightIllustration view={image.view} label={image.alt} />
    </div>
  );
}
