import Link from "next/link";
import { User, Sparkles, Settings, LogOut, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUser } from "@/lib/supabase/actions";
import { isProUser } from "@/lib/stripe/subscription";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

export async function UserNav() {
  const user = await getUser();

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

  const isPro = await isProUser(user.id);
  const initials = user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
        <div
          className={cn(
            "relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all cursor-pointer",
            isPro
              ? "bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {initials}
          {isPro && (
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-background rounded-full flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-amber-500" />
            </div>
          )}
        </div>
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
