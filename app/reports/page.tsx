import { AllReportsGallery } from "@/components/reports/all-reports-gallery";

export default function AllReportsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Reports</h1>
        <p className="text-muted-foreground mt-2">
          View all generated sustainability reports across your pods
        </p>
      </div>

      <AllReportsGallery />
    </div>
  );
}
