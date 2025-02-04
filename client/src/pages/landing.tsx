import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function Landing() {
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

  const sampleEvents = [
    {
      title: "Morning Yoga",
      time: "7:00 AM",
      image: "🧘‍♀️",
      type: "wellness"
    },
    {
      title: "Team Standup",
      time: "9:30 AM",
      image: "👥",
      type: "work"
    },
    {
      title: "Local Art Gallery",
      time: "12:00 PM",
      image: "🎨",
      type: "leisure"
    },
    {
      title: "Park Run",
      time: "5:30 PM",
      image: "🏃‍♂️",
      type: "exercise"
    }
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            GoLucky: Your AI Calendar Assistant
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            World's First AI-Powered Recommendation System Built Around Your Personal and Work Calendars
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              Get Started Free
            </Button>
          </div>
        </div>

        {/* Calendar Preview Section */}
        <div className="mb-16 bg-muted rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Your Day, Enhanced</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sampleEvents.map((event) => (
              <div 
                key={event.title}
                className="bg-background rounded-lg p-6 shadow-sm transition-transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{event.image}</div>
                <h3 className="font-semibold mb-2">{event.title}</h3>
                <p className="text-muted-foreground">{event.time}</p>
                <span className="inline-block mt-2 text-sm px-2 py-1 bg-primary/10 rounded-full">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">What Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.author} 
                className="bg-muted p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="mb-4 text-lg italic">{testimonial.text}</p>
                <p className="font-semibold text-primary">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}