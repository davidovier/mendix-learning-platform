import Link from "next/link";
import { Flame, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUser, signOut } from "@/lib/supabase/actions";
import { getUserStreak } from "@/lib/db/queries";

export async function UserNav() {
  // Fetch user first (required for auth check)
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

  // Fetch streak data (only after confirming user exists)
  // This is now the only blocking call after auth
  const streak = await getUserStreak(user.id);

  return (
    <div className="flex items-center gap-3">
      {streak && streak.current_streak > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Flame className="h-4 w-4 text-orange-500" />
          <span>{streak.current_streak}</span>
        </div>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action={async () => { "use server"; await signOut(); }}>
              <button type="submit" className="flex items-center gap-2 w-full">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
