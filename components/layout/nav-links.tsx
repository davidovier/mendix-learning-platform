"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/study", label: "Study" },
  { href: "/practice", label: "Practice" },
  { href: "/exam", label: "Exam" },
  { href: "/progress", label: "Progress" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
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
