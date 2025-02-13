import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Building2, Briefcase, Target, Rocket, Gift, Shield } from "lucide-react";

export default function Roadmap() {
  const phases = [
    {
      title: "Phase 1: Smart Calendar & Event Planning",
      description: "Where we are now - Building the foundation",
      icon: Calendar,
      features: [
        "AI-powered calendar management",
        "Smart activity recommendations",
        "Collaborative event planning",
        "Multi-calendar integration"
      ]
    },
    {
      title: "Phase 2: Business Suite Launch",
      description: "Q2 2025 - Expanding into business solutions",
      icon: Building2,
      features: [
        "Team calendar management",
        "Client meeting scheduler",
        "Resource booking system",
        "Business analytics dashboard"
      ]
    },
    {
      title: "Phase 3: Advanced CRM Features",
      description: "Q3 2025 - Full CRM capabilities",
      icon: Users,
      features: [
        "Client relationship tracking",
        "Lead management system",
        "Sales pipeline integration",
        "Automated follow-ups"
      ]
    },
    {
      title: "Phase 4: Enterprise Solutions",
      description: "Q4 2025 - Scaling for larger organizations",
      icon: Briefcase,
      features: [
        "Custom workflow automation",
        "Advanced reporting & analytics",
        "Enterprise-grade security",
        "API & integration marketplace"
      ]
    }
  ];

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Product Roadmap</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From smart calendar to comprehensive business solution - our journey to revolutionize how businesses manage time and relationships.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute right-4 top-4 opacity-10">
                <Icon className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle>{phase.title}</CardTitle>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {phase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              GoLucky aims to become the all-in-one solution for businesses to manage their time, relationships, and growth. By combining AI-powered scheduling with robust CRM features, we're building a platform that helps businesses:
            </p>
            <ul className="grid gap-4 md:grid-cols-3">
              <li className="flex items-start gap-2">
                <Rocket className="h-5 w-5 mt-1 text-primary" />
                <span>Streamline operations and boost productivity</span>
              </li>
              <li className="flex items-start gap-2">
                <Gift className="h-5 w-5 mt-1 text-primary" />
                <span>Enhance customer relationships and satisfaction</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-5 w-5 mt-1 text-primary" />
                <span>Make data-driven decisions with confidence</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
