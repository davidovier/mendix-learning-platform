import Link from "next/link";
import { Suspense } from "react";
import { GraduationCap } from "lucide-react";
import { UserNav } from "./user-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";

function UserNavSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-full" />;
}

export function Header() {
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
          <span className="font-semibold text-lg tracking-tight hidden sm:block">
            Mendix Prep
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLinks />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* User Nav */}
          <Suspense fallback={<UserNavSkeleton />}>
            <UserNav />
          </Suspense>

          {/* Mobile menu button */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
