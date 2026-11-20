import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/layout/container";
import { getMessages } from "@/lib/i18n";

export default function NotFound() {
  const t = getMessages();
  return (
    <Section>
      <Container className="flex flex-col items-center gap-6 text-center">
        <p className="text-eyebrow">404</p>
        <h1 className="text-headline">{t.notFound.title}</h1>
        <p className="text-lead max-w-md">{t.notFound.text}</p>
        <Button asChild size="lg">
          <Link href="/">{t.notFound.back}</Link>
        </Button>
      </Container>
    </Section>
  );
}
