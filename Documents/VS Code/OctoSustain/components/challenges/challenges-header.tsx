import { Trophy, Target, Users } from "lucide-react"

export function ChallengesHeader() {
  return (
    <div className="relative mb-8 p-6 bg-gradient-to-r from-primary/10 via-emerald-50 to-teal-50 dark:from-primary/20 dark:via-emerald-950 dark:to-teal-950 rounded-xl border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Trophy className="h-6 w-6 text-primary animate-bounce" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sustainability Challenges</h2>
          <p className="text-sm text-muted-foreground">Join challenges to earn points and make a bigger impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Target className="h-5 w-5 text-primary" />
          <div>
            <div className="text-lg font-bold text-foreground">12</div>
            <div className="text-xs text-muted-foreground">Active Challenges</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <div className="text-lg font-bold text-foreground">1,247</div>
            <div className="text-xs text-muted-foreground">Participants</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Trophy className="h-5 w-5 text-primary" />
          <div>
            <div className="text-lg font-bold text-foreground">8</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
