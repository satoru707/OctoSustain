import { BarChart3, TrendingUp, Award } from "lucide-react"

interface ReportsHeaderProps {
  podId: string
}

export function ReportsHeader({ podId }: ReportsHeaderProps) {
  return (
    <div className="relative mb-8 p-6 bg-gradient-to-r from-primary/10 via-emerald-50 to-teal-50 dark:from-primary/20 dark:via-emerald-950 dark:to-teal-950 rounded-xl border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Environmental Impact Reports</h2>
          <p className="text-sm text-muted-foreground">Track your pod's sustainability progress and achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <div>
            <div className="text-lg font-bold text-foreground">2.4 tons</div>
            <div className="text-xs text-muted-foreground">CO2 Saved This Month</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Award className="h-5 w-5 text-primary" />
          <div>
            <div className="text-lg font-bold text-foreground">15</div>
            <div className="text-xs text-muted-foreground">Reports Generated</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-lg font-bold text-foreground">92%</div>
            <div className="text-xs text-muted-foreground">Goal Achievement</div>
          </div>
        </div>
      </div>
    </div>
  )
}
