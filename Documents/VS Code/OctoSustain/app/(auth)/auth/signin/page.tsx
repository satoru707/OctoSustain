import { SignInForm } from "@/components/auth/signin-form";
import { EcoWaveBackground } from "@/components/auth/eco-wave-background";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <EcoWaveBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue your eco journey
          </p>
        </div>

        <SignInForm />

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
