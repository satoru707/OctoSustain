import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsGallery } from "@/components/reports/reports-gallery"
import { GenerateReportButton } from "@/components/reports/generate-report-button"

interface ReportsPageProps {
  params: {
    podId: string
  }
}

export default function ReportsPage({ params }: ReportsPageProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ReportsHeader podId={params.podId} />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Impact Reports</h1>
          <p className="text-muted-foreground mt-2">Track your pod's environmental progress and achievements</p>
        </div>
        <GenerateReportButton podId={params.podId} />
      </div>

      <ReportsGallery podId={params.podId} />
    </div>
  )
}
