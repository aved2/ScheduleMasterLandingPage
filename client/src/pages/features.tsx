import { Button } from "@/components/ui/button";
import { 
  Calendar, Brain, Cloud, Users, Sparkles, 
  ArrowRight, Sun, Clock, Share2, BarChart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Activity Suggestions",
      icon: <Brain className="w-8 h-8 text-primary" />,
      description: "Our advanced AI engine learns from your preferences and schedule patterns to suggest the perfect activities.",
      benefits: [
        "Personalized recommendations based on past activities",
        "Smart time-slot detection for optimal scheduling",
        "Automatic adjustment to your daily routine",
        "Learning from your feedback and preferences"
      ],
      howTo: [
        "Connect your calendars",
        "Rate suggested activities",
        "Set your preferences",
        "Let AI optimize your schedule"
      ]
    },
    {
      title: "Weather-Aware Planning",
      icon: <Cloud className="w-8 h-8 text-primary" />,
      description: "Get activity suggestions that adapt to current and forecasted weather conditions.",
      benefits: [
        "Real-time weather integration",
        "Indoor/outdoor activity alternatives",
        "Weather-based rescheduling suggestions",
        "Seasonal activity recommendations"
      ],
      howTo: [
        "Enable location services",
        "Set weather preferences",
        "Choose activity types",
        "Review weather-smart suggestions"
      ]
    },
    {
      title: "Energy Level Matching",
      icon: <Sun className="w-8 h-8 text-primary" />,
      description: "Schedule activities that align with your natural energy patterns throughout the day.",
      benefits: [
        "Personal energy profile creation",
        "Activity intensity matching",
        "Productivity optimization",
        "Balanced daily schedule"
      ],
      howTo: [
        "Track your energy patterns",
        "Rate activity intensity",
        "Set peak productivity hours",
        "Get energy-optimized suggestions"
      ]
    },
    {
      title: "Social Planning & Sharing",
      icon: <Users className="w-8 h-8 text-primary" />,
      description: "Effortlessly coordinate activities with friends and colleagues.",
      benefits: [
        "Group activity scheduling",
        "Shared calendar coordination",
        "Social preference matching",
        "Collaborative event planning"
      ],
      howTo: [
        "Connect with friends",
        "Share your availability",
        "Create group activities",
        "Send invitations easily"
      ]
    },
    {
      title: "Work-Life Balance Tools",
      icon: <Clock className="w-8 h-8 text-primary" />,
      description: "Smart features to help you maintain a healthy balance between work and personal time.",
      benefits: [
        "Break time optimization",
        "Focus session scheduling",
        "Recovery period suggestions",
        "Productivity analytics"
      ],
      howTo: [
        "Set work hours",
        "Define break preferences",
        "Track productivity goals",
        "Review balance insights"
      ]
    },
    {
      title: "Activity Analytics",
      icon: <BarChart className="w-8 h-8 text-primary" />,
      description: "Gain insights into your time usage and activity patterns.",
      benefits: [
        "Time allocation analysis",
        "Activity impact tracking",
        "Progress visualization",
        "Habit formation metrics"
      ],
      howTo: [
        "Enable activity tracking",
        "Set tracking goals",
        "Review weekly insights",
        "Optimize your routine"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Powerful Features to Transform Your Time</h1>
        <p className="text-xl text-muted-foreground">
          Discover how GoLucky uses advanced technology to help you make the most of every moment
        </p>
      </div>

      <div className="grid gap-8">
        {features.map((feature, index) => (
          <Card key={feature.title} className="overflow-hidden">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-4">
                {feature.icon}
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-lg">
                {feature.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    How to Use
                  </h3>
                  <ol className="space-y-3 list-decimal list-inside">
                    {feature.howTo.map((step) => (
                      <li key={step} className="text-muted-foreground">
                        <span className="text-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button size="lg" className="gap-2">
          <Calendar className="w-5 h-5" />
          Try These Features Now
        </Button>
      </div>
    </div>
  );
}