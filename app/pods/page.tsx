import { PodsGrid } from "@/components/pods/pods-grid"
import { CreatePodButton } from "@/components/pods/create-pod-button"
import { PageHeader } from "@/components/pods/page-header"

export default function PodsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Eco Pods</h1>
          <p className="text-muted-foreground mt-2">
            Collaborate with teams to track and improve your environmental impact
          </p>
        </div>
        <CreatePodButton />
      </div>

      <PodsGrid />
    </div>
  )
}
