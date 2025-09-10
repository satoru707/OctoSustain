import { ChallengesHeader } from "@/components/challenges/challenges-header"
import { ChallengesList } from "@/components/challenges/challenges-list"

export default function ChallengesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ChallengesHeader />
      <ChallengesList />
    </div>
  )
}
