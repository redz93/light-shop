import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Halo } from "@/components/ui/halo";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { Container, Section } from "@/components/layout/container";
import { ToastDemo } from "@/components/design-system/toast-demo";

export const metadata: Metadata = { title: "Design system", robots: { index: false } };

const swatches = [
  { name: "bg", cls: "bg-bg" },
  { name: "surface", cls: "bg-surface" },
  { name: "surface-2", cls: "bg-surface-2" },
  { name: "border-strong", cls: "bg-border-strong" },
  { name: "fg", cls: "bg-fg" },
  { name: "muted", cls: "bg-muted" },
  { name: "accent", cls: "bg-accent" },
  { name: "accent-2", cls: "bg-accent-2" },
  { name: "success", cls: "bg-success" },
  { name: "warning", cls: "bg-warning" },
  { name: "danger", cls: "bg-danger" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="text-title border-b pb-3">{title}</h2>
      {children}
    </section>
  );
}

/** Page de référence : disponible uniquement en développement. */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Section>
      <Container className="space-y-14">
        <header className="space-y-3">
          <p className="text-eyebrow">Design system</p>
          <h1 className="text-headline">Tokens et composants</h1>
          <p className="text-lead max-w-2xl">
            Bascule le thème avec le bouton de la barre de navigation pour vérifier les deux modes.
          </p>
        </header>

        <Block title="Couleurs">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {swatches.map((s) => (
              <div key={s.name} className="space-y-2">
                <div className={`h-16 rounded-md border ${s.cls}`} />
                <p className="text-xs text-muted">{s.name}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typographie">
          <div className="space-y-4">
            <p className="text-eyebrow">Eyebrow</p>
            <p className="text-display">Display</p>
            <p className="text-headline">Headline</p>
            <p className="text-title">Title</p>
            <p className="text-lead max-w-xl">Lead — paragraphe d’introduction en texte atténué.</p>
            <p className="text-sm text-muted">Texte courant, petit et atténué.</p>
          </div>
        </Block>

        <Block title="Boutons">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <ShoppingBag className="h-4 w-4" /> Acheter maintenant
            </Button>
            <Button variant="secondary">Ajouter au panier</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Lien</Button>
            <Button size="icon" variant="outline" aria-label="Ajouter aux favoris">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Petit</Button>
            <Button size="lg">Grand</Button>
            <Button loading>Chargement</Button>
            <Button disabled>Désactivé</Button>
          </div>
        </Block>

        <Block title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Défaut</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">En stock</Badge>
            <Badge variant="danger">Rupture</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Block>

        <Block title="Formulaires">
          <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
            <Field label="E-mail" htmlFor="ds-email" hint="Pour la confirmation de commande.">
              <Input id="ds-email" type="email" placeholder="vous@exemple.fr" aria-describedby="ds-email-msg" />
            </Field>
            <Field label="Code postal" htmlFor="ds-zip" error="Code postal invalide.">
              <Input id="ds-zip" invalid defaultValue="7500" aria-describedby="ds-zip-msg" />
            </Field>
          </div>
        </Block>

        <Block title="Cartes, prix et avis">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="space-y-3">
              <p className="text-title">Carte standard</p>
              <Price amount={4990} />
              <Rating count={0} />
            </Card>
            <Card glow className="space-y-3">
              <p className="text-title">Carte « glow »</p>
              <Price amount={3990} compareAt={4990} />
              <Rating value={4.6} count={12} />
            </Card>
            <Card className="relative space-y-3 overflow-hidden">
              <Halo />
              <p className="text-title">Halo décoratif</p>
              <p className="text-sm text-muted">Signature lumineuse de la marque.</p>
            </Card>
          </div>
          <p className="text-xs text-muted">
            Les notes ci-dessus sont des valeurs d’exemple de ce catalogue de composants, pas des données de la boutique.
          </p>
        </Block>

        <Block title="Skeleton">
          <Card className="max-w-sm space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </Card>
        </Block>

        <Block title="Notifications">
          <ToastDemo />
        </Block>
      </Container>
    </Section>
  );
}
