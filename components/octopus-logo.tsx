import { cn } from "@/lib/utils"

interface OctopusLogoProps {
  className?: string
}

export function OctopusLogo({ className }: OctopusLogoProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn("text-primary", className)} fill="currentColor">
      {/* Octopus head */}
      <ellipse cx="50" cy="35" rx="25" ry="20" className="animate-float" />

      {/* Eyes */}
      <circle cx="42" cy="30" r="3" fill="white" />
      <circle cx="58" cy="30" r="3" fill="white" />
      <circle cx="42" cy="30" r="1.5" fill="currentColor" />
      <circle cx="58" cy="30" r="1.5" fill="currentColor" />

      {/* Tentacles with leaf-like ends */}
      <g className="animate-tentacle">
        <path d="M30 50 Q25 60 20 70 Q18 75 22 78" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M35 52 Q28 65 25 75 Q23 80 27 82" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M65 52 Q72 65 75 75 Q77 80 73 82" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M70 50 Q75 60 80 70 Q82 75 78 78" stroke="currentColor" strokeWidth="3" fill="none" />
      </g>

      {/* Leaf decorations on tentacle ends */}
      <g fill="currentColor" opacity="0.7">
        <path d="M20 75 Q18 72 22 70 Q26 72 24 75 Q22 78 20 75" />
        <path d="M25 80 Q23 77 27 75 Q31 77 29 80 Q27 83 25 80" />
        <path d="M75 80 Q77 77 73 75 Q69 77 71 80 Q73 83 75 80" />
        <path d="M80 75 Q82 72 78 70 Q74 72 76 75 Q78 78 80 75" />
      </g>
    </svg>
  )
}
