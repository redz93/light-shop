# Contenu et honnêteté commerciale — Phase 3

Tout le contenu actuel est de la **démonstration** (`isDemo: true` dans `apps/web/lib/catalog.ts`).
Pour passer en réel : remplacer les données du produit (Phase 4 : depuis l'admin/API), puis les photos.

| Élément | Règle |
|---|---|
| Note / nombre d'avis | Calculés depuis les avis approuvés. Aucun avis → « Aucun avis pour le moment », jamais de note. |
| Témoignages | `testimonials` vide ⇒ section masquée. N'ajouter que de vrais témoignages, avec l'accord de leur auteur. |
| Avant / après | `beforeAfter: null` ⇒ section masquée. N'activer que si les résultats sont vérifiables. |
| Ancien prix / badge « −X % » | Affichés uniquement si `compareAt > prix` (promotion réelle). |
| Stock bas | Affiché uniquement si `stock <= lowStockAt` (stock réel). Aucune fausse rareté. |
| Délai de livraison | `storeConfig.shipping.estimateDays = null` ⇒ aucun délai affiché. Renseigner un délai réaliste avant d'en afficher un. |
| Droit de rétractation 14 jours | Délai légal UE pour la vente à distance ; à confirmer avec vos CGV. |
| Spécifications du produit | Valeurs de démonstration : à remplacer par celles de la fiche du fournisseur, vérifiées sur un échantillon. |

## Panier (état Phase 3)
- Le panier (Zustand + localStorage) ne stocke que `variantId` et `quantité`.
- Les montants affichés sont indicatifs ; le serveur recalculera tout au paiement (Phases 6-7).
- « Acheter maintenant » ajoute au panier et ouvre le tiroir. Le bouton « Passer la commande » est désactivé tant que `NEXT_PUBLIC_CHECKOUT_ENABLED` n'est pas `true`.
