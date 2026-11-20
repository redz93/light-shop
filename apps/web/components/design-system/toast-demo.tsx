"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => toast.success("Produit ajouté au panier")}>
        Succès
      </Button>
      <Button variant="secondary" onClick={() => toast.error("Le paiement a échoué", { description: "Aucun montant n’a été débité." })}>
        Erreur
      </Button>
      <Button variant="secondary" onClick={() => toast("Code promo appliqué")}>
        Neutre
      </Button>
    </div>
  );
}
