"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryImage } from "@/lib/catalog";
import { Dialog, DialogClose, DialogDescription, DialogTitle, ModalContent } from "@/components/ui/dialog";
import { Halo } from "@/components/ui/halo";
import { Button } from "@/components/ui/button";
import { GalleryVisual } from "./gallery-visual";
import { cn } from "@/lib/cn";

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const count = images.length;
  const current = images[index];

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, go]);

  if (!current) return null;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label={`Agrandir l’image : ${current.alt}`}
        className="group relative isolate block aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border bg-surface"
      >
        <Halo />
        <GalleryVisual image={current} sizes="(min-width: 1024px) 50vw, 100vw" priority />
        <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg/80 text-fg backdrop-blur transition-colors group-hover:bg-bg">
          <Expand className="h-4 w-4" aria-hidden />
        </span>
      </button>

      {count > 1 && (
        <ul className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Voir l’image ${i + 1} sur ${count}`}
                aria-current={i === index}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-md border bg-surface transition-colors",
                  i === index ? "border-accent" : "hover:border-border-strong",
                )}
              >
                <GalleryVisual image={img} sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={zoom} onOpenChange={setZoom}>
        <ModalContent>
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <DialogDescription className="sr-only">{current.alt}</DialogDescription>
          <div className="relative isolate aspect-square max-h-[85dvh] w-full overflow-hidden rounded-xl border bg-surface">
            <Halo />
            <GalleryVisual image={current} sizes="100vw" />
            <DialogClose asChild>
              <Button variant="secondary" size="icon" aria-label="Fermer" className="absolute right-3 top-3">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
            {count > 1 && (
              <>
                <Button variant="secondary" size="icon" aria-label="Image précédente" className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => go(-1)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" aria-label="Image suivante" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => go(1)}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </ModalContent>
      </Dialog>
    </div>
  );
}
