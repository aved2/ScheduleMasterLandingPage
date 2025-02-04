
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";

export default function Landing() {
  const features = [
    "Smart calendar scheduling",
    "AI-powered activity suggestions",
    "Multi-calendar integration",
    "Location-aware planning",
    "Collaborative scheduling",
  ];

  const testimonials = [
    {
      text: "The app suggested a museum visit between my meetings - it was the perfect creative break I needed!",
      author: "Sarah J., Product Manager"
    },
    {
      text: "I love how it finds nearby parks for my running sessions based on my schedule gaps.",
      author: "Mike R., Entrepreneur"
    },
    {
      text: "It helped me discover local cafes for my work breaks. The location-aware suggestions are incredible!",
      author: "Emma L., Designer"
    },
    {
      text: "The AI perfectly balances my work meetings with leisure activities. It's like having a personal assistant.",
      author: "David K., Software Engineer"
    },
  ];

  const roadmap = [
    { title: "Team Calendar View", status: "Released" },
    { title: "Mobile Apps", status: "In Progress" },
    { title: "Natural Language Event Creation", status: "Planned" },
  ];

  const exampleEvents = [
    { title: "Team Standup", time: "9:00 AM", type: "work" },
    { title: "Client Meeting", time: "11:00 AM", type: "work" },
    { title: "Gym Session", time: "5:30 PM", type: "personal" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Intelligent Calendar Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Let AI help you plan your perfect day
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              Get Started Free
            </Button>
          </div>
        </div>

        

        {/* Features */}
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
                <span>{event.title}</span>
                <span className="text-muted-foreground">{event.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">What Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="bg-muted p-6 rounded-lg">
                <p className="mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center">Product Roadmap</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {roadmap.map((item) => (
              <div key={item.title} className="bg-muted p-6 rounded-lg text-center">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <span className="text-primary">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
