"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { UserNav } from "./user-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/study", label: "Study" },
  { href: "/practice", label: "Practice" },
  { href: "/exam", label: "Exam" },
  { href: "/progress", label: "Progress" },
];

function UserNavSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-full" />;
}

function NavLinks({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={cn(
            "relative px-3 py-2 text-sm font-medium transition-all duration-200",
            "hover:text-foreground",
            pathname.startsWith(item.href)
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.label}
          {pathname.startsWith(item.href) && (
            <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0" />
          )}
        </Link>
      ))}
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-lg tracking-tight hidden xs:block">
            Mendix Prep
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLinks pathname={pathname} />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* User Nav */}
          <Suspense fallback={<UserNavSkeleton />}>
            <UserNav />
          </Suspense>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-border/50",
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <nav className="flex flex-col py-2 px-4 bg-background/95 backdrop-blur-xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                pathname.startsWith(item.href)
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
