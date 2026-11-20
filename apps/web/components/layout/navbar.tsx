"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CartButton, CartDrawer } from "@/components/cart/cart-drawer";
import { Container } from "./container";
import { getMessages } from "@/lib/i18n";

export function Navbar({ productSlug }: { productSlug: string | null }) {
  const t = getMessages();
  const [open, setOpen] = useState(false);
  const links = [
    ...(productSlug ? [{ href: `/produit/${productSlug}`, label: t.nav.product }] : []),
    { href: "/#avantages", label: t.nav.benefits },
    { href: "/#faq", label: t.nav.faq },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b bg-bg/80 backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav aria-label={t.nav.main} className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Button key={l.href} asChild variant="ghost">
              <Link href={l.href}>{l.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <CartButton />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={t.nav.main}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] border-t bg-bg md:hidden"
          >
            <Container className="flex flex-col gap-1 py-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-4 font-display text-2xl font-semibold hover:bg-surface-2"
                >
                  {l.label}
                </Link>
              ))}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>

      <CartDrawer />
    </header>
  );
}
