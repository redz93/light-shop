"use client";

import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/layout/container";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-headline">Une erreur est survenue</h1>
        <p className="text-lead max-w-md">Le service est momentanément indisponible. Réessayez dans un instant.</p>
        <Button size="lg" onClick={reset}>
          Réessayer
        </Button>
      </Container>
    </Section>
  );
}
