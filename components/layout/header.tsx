import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Nav } from "./nav";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto grid grid-cols-3 h-14 items-center px-4 max-w-2xl">
        <Nav />
        <Link href="/" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg tracking-tight">Mendix Prep</span>
        </Link>
        <div className="flex justify-end">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
