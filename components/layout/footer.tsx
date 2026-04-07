import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getUser } from "@/lib/supabase/actions";

export async function Footer() {
  const user = await getUser();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">Mendix Prep</span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
            <Link href="/study" className="text-muted-foreground hover:text-foreground transition-colors">
              Study
            </Link>
            <Link href="/practice" className="text-muted-foreground hover:text-foreground transition-colors">
              Practice
            </Link>
            <Link href="/exam" className="text-muted-foreground hover:text-foreground transition-colors">
              Exam
            </Link>
            {user ? (
              <>
                <Link href="/progress" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Progress
                </Link>
                <Link href="/cheatsheet" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cheatsheet
                </Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign in
                </Link>
                <Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </nav>

          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Not affiliated with Mendix or Siemens
          </p>
        </div>
      </div>
    </footer>
  );
}
