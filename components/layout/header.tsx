import Link from "next/link";
import { Suspense } from "react";
import { GraduationCap } from "lucide-react";
import { Nav } from "./nav";
import { UserNav } from "./user-nav";
import { Skeleton } from "@/components/ui/skeleton";

// Lightweight fallback while UserNav loads
function UserNavSkeleton() {
  return <Skeleton className="h-8 w-20 rounded-lg" />;
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-12 sm:h-14 items-center justify-between px-4 max-w-2xl">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity">
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="font-semibold text-base sm:text-lg tracking-tight whitespace-nowrap">Mendix Prep</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Nav />
          {/* Suspense prevents UserNav from blocking page render */}
          <Suspense fallback={<UserNavSkeleton />}>
            <UserNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
