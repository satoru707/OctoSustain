import { Waves } from "lucide-react"

export function PageHeader() {
  return (
    <div className="relative mb-8 p-6 bg-gradient-to-r from-primary/10 via-emerald-50 to-teal-50 dark:from-primary/20 dark:via-emerald-950 dark:to-teal-950 rounded-xl border border-primary/20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Waves className="h-6 w-6 text-primary animate-wave" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Ocean of Collaboration</h2>
          <p className="text-sm text-muted-foreground">Join or create pods to start your sustainability journey</p>
        </div>
      </div>
    </div>
  )
}
