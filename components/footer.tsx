import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left side - Tagline */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground font-medium">
              Eco-impact starts with us 🌱
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by OctoSustain Platform
            </p>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/satoru707/OctoSustain"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://x.com/xlyla277615"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/thepraiseolaoye"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 OctoSustain. All rights reserved. Built with 💚 for the
            planet.
          </p>
        </div>
      </div>
    </footer>
  );
}
