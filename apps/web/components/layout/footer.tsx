import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "./container";
import { getMessages } from "@/lib/i18n";
import { site } from "@/lib/site";

export function Footer() {
  const t = getMessages();
  return (
    <footer className="mt-auto border-t bg-surface">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted">{t.footer.tagline}</p>
        </div>
        {site.legalLinks.length > 0 && (
          <ul className="space-y-2 text-sm">
            {site.legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
      <div className="border-t py-5">
        <Container>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
        </Container>
      </div>
    </footer>
  );
}
