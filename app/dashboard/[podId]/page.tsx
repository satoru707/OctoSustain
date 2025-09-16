import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { OctopusVisualization } from "@/components/dashboard/octopus-visualization";
import { TentacleTracker } from "@/components/dashboard/tentacle-tracker";
import { GamificationSidebar } from "@/components/dashboard/gamification-sidebar";

interface DashboardPageProps {
  params: {
    podId: string;
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader podId={params.podId} />

      <div className="grid lg:grid-cols-4 gap-8 mt-8">
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Central octopus visualization */}
          <div className="flex justify-center">
            <OctopusVisualization />
          </div>

          {/* Tentacle tracker sections */}
          <TentacleTracker podId={params.podId} />
        </div>

        {/* Gamification sidebar */}
        <div className="lg:col-span-1">
          <GamificationSidebar podId={params.podId} />
        </div>
      </div>
    </div>
  );
}
