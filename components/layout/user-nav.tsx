import Link from "next/link";
import { User, Sparkles, CreditCard, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/supabase/actions";
import { isProUser } from "@/lib/stripe/subscription";
import { LogoutButton } from "@/components/auth/logout-button";

export async function UserNav() {
  const user = await getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const isPro = await isProUser(user.id);

  return (
    <div className="flex items-center gap-3">
      {isPro && (
        <Badge variant="secondary" className="gap-1 hidden sm:flex">
          <Sparkles className="h-3 w-3" />
          Pro
        </Badge>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium hover:bg-muted transition-colors gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline-block max-w-[150px] truncate">
            {user.email}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href="/progress" className="w-full">My Progress</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/account" className="w-full flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          {!isPro && (
            <DropdownMenuItem>
              <Link href="/pricing" className="w-full flex items-center gap-2 text-primary">
                <CreditCard className="h-4 w-4" />
                Upgrade to Pro
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
