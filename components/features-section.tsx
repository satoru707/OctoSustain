import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Lightbulb, Leaf, BarChart3, Globe } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Live Collaboration",
      description: "Work together in real-time pods to track and improve your collective environmental impact.",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Trophy,
      title: "Gamified Challenges",
      description: "Earn ink points and compete in eco-friendly challenges that make sustainability fun and engaging.",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Lightbulb,
      title: "Predictive Tips",
      description: "Get AI-powered insights and personalized recommendations to optimize your eco-impact.",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Leaf,
      title: "Multi-Category Tracking",
      description: "Monitor energy, waste, transport, water, and food consumption with our tentacle-based system.",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: BarChart3,
      title: "Impact Analytics",
      description: "Visualize your progress with beautiful charts and comprehensive sustainability reports.",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with eco-warriors worldwide and contribute to a larger environmental movement.",
      color: "text-teal-600 dark:text-teal-400",
    },
  ]

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose OctoSustain?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our platform combines the intelligence of an octopus with cutting-edge technology to make environmental
            tracking intuitive, collaborative, and impactful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
