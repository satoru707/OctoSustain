"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OctopusLogo } from "@/components/octopus-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/pods", label: "Pods" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/challenges", label: "Challenges" },
    { href: "/reports", label: "Reports" },
  ];

  const handleGetStarted = () => {
    router.push("/auth/signup");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <OctopusLogo className="h-8 w-8 animate-wave" />
            <span className="text-xl font-bold text-primary">OctoSustain</span>
            <span className="text-lg">🐙🌱</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                onClick={handleGetStarted}
                variant="default"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Get Started
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-fit border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={handleGetStarted}
                  variant="default"
                  size="sm"
                  className="mt-2 w-fit"
                >
                  Get Started
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
