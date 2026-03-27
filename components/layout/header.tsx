import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Nav } from "./nav";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-12 sm:h-14 items-center justify-between px-4 max-w-2xl">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity">
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="font-semibold text-base sm:text-lg tracking-tight">Mendix Prep</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Nav />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
