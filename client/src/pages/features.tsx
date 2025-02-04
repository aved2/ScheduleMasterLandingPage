import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, MapPin, Brain, Users, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Activity Suggestions",
      icon: <Brain className="w-8 h-8 text-primary" />,
      description: "Our advanced AI analyzes your schedule, preferences, and past activities to suggest personalized activities that fit perfectly into your free time.",
      benefits: [
        "Personalized recommendations based on your interests",
        "Activities that fit your available time slots",
        "Suggestions adapt to your location and time of day",
        "Learn from your feedback to improve future recommendations"
      ],
      howTo: [
        "Set up your preferences in the settings",
        "Connect your calendars",
        "Rate activities to improve suggestions",
        "Accept or decline recommendations"
      ]
    },
    {
      title: "Smart Calendar Integration",
      icon: <Calendar className="w-8 h-8 text-primary" />,
      description: "Seamlessly integrate with multiple calendar providers to get a comprehensive view of your schedule and find the perfect time for activities.",
      benefits: [
        "Support for Google, Outlook, and Apple calendars",
        "Automatic free time detection",
        "Real-time calendar synchronization",
        "Smart conflict detection"
      ],
      howTo: [
        "Go to Calendar Settings",
        "Choose your calendar provider",
        "Authorize access",
        "Select calendars to sync"
      ]
    },
    {
      title: "Location-Aware Planning",
      icon: <MapPin className="w-8 h-8 text-primary" />,
      description: "Find activities and places near you that match your interests and available time slots.",
      benefits: [
        "Discover local activities and venues",
        "Get travel time estimates",
        "Weather-aware outdoor suggestions",
        "Radius-based search customization"
      ],
      howTo: [
        "Enable location services",
        "Set your preferred activity radius",
        "Choose activity types you enjoy",
        "Get local suggestions automatically"
      ]
    },
    {
      title: "Time Management Tools",
      icon: <Clock className="w-8 h-8 text-primary" />,
      description: "Advanced tools to help you make the most of your free time and maintain a healthy work-life balance.",
      benefits: [
        "Visual time blocking",
        "Automatic buffer time calculation",
        "Duration-based activity matching",
        "Priority-based scheduling"
      ],
      howTo: [
        "Review your daily timeline",
        "Set preferred activity durations",
        "Define buffer times between events",
        "Use quick-add shortcuts for common activities"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Powerful Features to Enhance Your Day</h1>
        <p className="text-xl text-muted-foreground">
          Discover how GoLucky makes activity planning effortless and enjoyable with our smart features
        </p>
      </div>

      <div className="grid gap-12">
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
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-primary" />
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
          Try It Now
        </Button>
      </div>
    </div>
  );
}