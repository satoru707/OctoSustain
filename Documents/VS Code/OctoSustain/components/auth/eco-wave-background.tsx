"use client"

export function EcoWaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950" />

      {/* Animated waves */}
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none" fill="none">
          {/* Wave 1 */}
          <path d="M0,400 C300,300 600,500 1200,400 L1200,800 L0,800 Z" fill="url(#wave1)" className="animate-wave" />

          {/* Wave 2 */}
          <path
            d="M0,500 C400,400 800,600 1200,500 L1200,800 L0,800 Z"
            fill="url(#wave2)"
            className="animate-wave"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          />

          {/* Wave 3 */}
          <path
            d="M0,600 C200,550 400,650 600,600 C800,550 1000,650 1200,600 L1200,800 L0,800 Z"
            fill="url(#wave3)"
            className="animate-wave"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          />

          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 107, 0.1)" />
              <stop offset="100%" stopColor="rgba(59, 130, 107, 0.3)" />
            </linearGradient>

            <linearGradient id="wave2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(116, 198, 157, 0.1)" />
              <stop offset="100%" stopColor="rgba(116, 198, 157, 0.2)" />
            </linearGradient>

            <linearGradient id="wave3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.05)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.15)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating eco particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-green-400 rounded-full animate-float opacity-60" />
        <div
          className="absolute top-40 right-20 w-4 h-4 bg-emerald-300 rounded-full animate-float opacity-40"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-2 h-2 bg-teal-400 rounded-full animate-float opacity-50"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-5 h-5 bg-green-500 rounded-full animate-float opacity-30"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
    </div>
  )
}
