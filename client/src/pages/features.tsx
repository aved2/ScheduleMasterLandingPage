
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";

export default function Features() {
  const features = [
    "Smart calendar scheduling",
    "AI-powered activity suggestions",
    "Multi-calendar integration",
    "Location-aware planning",
    "Collaborative scheduling",
  ];

  const exampleEvents = [
    { title: "Team Standup", time: "9:00 AM", type: "work" },
    { title: "Client Meeting", time: "11:00 AM", type: "work" },
    { title: "Museum Visit", time: "2:00 PM", type: "leisure", location: "Metropolitan Museum" },
    { title: "Park Run", time: "5:30 PM", type: "fitness", location: "Central Park" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Features & Examples</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>
          <ul className="space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle className="text-primary h-5 w-5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-muted rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Example Schedule</h3>
          {exampleEvents.map((event) => (
            <div 
              key={event.title}
              className="flex justify-between items-center p-3 bg-background rounded mb-2"
            >
              <div>
                <span className="font-medium">{event.title}</span>
                {event.location && (
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                )}
              </div>
              <span className="text-muted-foreground">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
