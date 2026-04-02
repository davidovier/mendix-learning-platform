"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Sparkles, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/supabase/actions";

interface UserNavClientProps {
  user: { email: string } | null;
  isPro: boolean;
}

export function UserNavClient({ user, isPro }: UserNavClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : "U";

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isPro
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        <span>{initials}</span>
        {isPro && (
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-background rounded-full flex items-center justify-center shadow-sm border border-border">
            <Sparkles className="w-2 h-2 text-primary" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover p-1 shadow-lg z-50">
          {/* Header */}
          <div className="px-2 py-1.5 border-b border-border mb-1">
            <p className="text-sm font-medium truncate">{user.email}</p>
            {isPro ? (
              <p className="text-xs text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Pro Lifetime
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Free plan</p>
            )}
          </div>

          {/* Menu Items */}
          <button
            onClick={() => {
              router.push("/progress");
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            <User className="h-4 w-4" />
            My Progress
          </button>
          <button
            onClick={() => {
              router.push("/account");
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            <Settings className="h-4 w-4" />
            Account
          </button>

          {!isPro && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => {
                  router.push("/pricing");
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary hover:bg-muted transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </button>
            </>
          )}

          <div className="my-1 h-px bg-border" />
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
