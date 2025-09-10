import { PodHeader } from "@/components/pods/pod-header"

interface PodPageProps {
  params: {
    id: string
  }
}

export default function PodPage({ params }: PodPageProps) {
  // This page shows pod info then redirects to dashboard
  // In a real app, you'd fetch pod data here

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PodHeader podId={params.id} />

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">Redirecting to pod dashboard...</p>
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>

      {/* Auto-redirect to dashboard */}
      <script
        dangerouslySetInnerHTML={{
          __html: `setTimeout(() => window.location.href = '/dashboard/${params.id}', 2000)`,
        }}
      />
    </div>
  )
}
