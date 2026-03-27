import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect, error, message } = await searchParams;

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to track your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-md">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-md">
              {message}
            </div>
          )}

          <OAuthButtons redirectTo={redirect} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <LoginForm redirectTo={redirect} />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
