import { SignUpForm } from "@/components/auth/signup-form"
import { EcoWaveBackground } from "@/components/auth/eco-wave-background"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <EcoWaveBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Join OctoSustain</h1>
          <p className="text-muted-foreground">Start tracking your eco-impact today</p>
        </div>

        <SignUpForm />

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
