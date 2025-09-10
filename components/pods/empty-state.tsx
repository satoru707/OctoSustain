import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { AnimatedOctopus } from "@/components/animated-octopus"

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md mx-auto text-center border-2 border-dashed border-primary/30">
        <CardContent className="p-8">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32">
              <AnimatedOctopus />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2">No pods? Create your first! 🐙</h3>
          <p className="text-muted-foreground mb-6 text-pretty">
            Start your sustainability journey by creating a pod or joining an existing one. Collaborate with others to
            make a real environmental impact.
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Pod
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
