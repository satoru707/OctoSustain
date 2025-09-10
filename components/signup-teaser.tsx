import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function SignupTeaser() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-emerald-50/50 to-teal-50/50 dark:from-primary/10 dark:via-emerald-950/50 dark:to-teal-950/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-xl bg-card/80 backdrop-blur">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Make an Impact?</h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Join thousands of eco-warriors already using OctoSustain to track their environmental impact and create
                positive change. Start your sustainability journey today!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    Start Your Eco Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 bg-transparent"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Join in 30 seconds</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
