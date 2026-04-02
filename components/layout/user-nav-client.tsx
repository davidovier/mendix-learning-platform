"use client";

import Link from "next/link";
import { User, Sparkles, Settings, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

interface UserNavClientProps {
  user: { email: string } | null;
  isPro: boolean;
}

export function UserNavClient({ user, isPro }: UserNavClientProps) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isPro
            ? "bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        <span>{initials}</span>
        {isPro && (
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-background rounded-full flex items-center justify-center shadow-sm">
            <Crown className="w-2.5 h-2.5 text-amber-500" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {user.email}
            </p>
            {isPro ? (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Pro Lifetime
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Free plan</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/progress" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              My Progress
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account
            </Link>
          }
        />
        {!isPro && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 text-amber-600 dark:text-amber-400"
                >
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Pro
                </Link>
              }
            />
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
