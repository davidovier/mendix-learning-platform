import Link from "next/link";
import { Nav } from "./nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="font-bold text-xl">Mendix Prep</span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
