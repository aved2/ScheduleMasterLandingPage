import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { SiZoom, SiGooglecalendar, SiGoogle, SiZapier } from "react-icons/si";
import { BiLogoMicrosoft } from "react-icons/bi";

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

        {/* Integrations Section */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">Pass data between your favorite tools. Connect all of your calendars.</h2>

          {/* Platform integrations */}
          <div className="mb-8">
            <p className="text-muted-foreground mb-4">GoLucky integrates with...</p>
            <div className="flex justify-center items-center gap-8 mb-8">
              <SiZapier className="w-12 h-12 text-primary" title="Zapier" />
              <SiZoom className="w-12 h-12 text-primary" title="Zoom" />
              <SiGoogle className="w-12 h-12 text-primary" title="Google Meet" />
              <SiGoogle className="w-12 h-12 text-primary" title="Gmail" />
              <BiLogoMicrosoft className="w-12 h-12 text-primary" title="Outlook" />
            </div>
          </div>

          {/* Calendar connections */}
          <div>
            <p className="text-muted-foreground mb-4">GoLucky connects to these calendars...</p>
            <div className="flex justify-center items-center gap-8">
              <SiGooglecalendar className="w-12 h-12 text-primary" title="Google Calendar" />
              <BiLogoMicrosoft className="w-12 h-12 text-primary" title="Outlook Calendar" />
              <SiGoogle className="w-12 h-12 text-primary" title="Apple Calendar" />
            </div>
          </div>
        </div>

        {/* New AI Assistant Section */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Just Ask What You Want To Do</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Use your voice, email, or type to tell GoLucky what you want to do. Our AI handles the rest.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Siri-like interface mockup */}
            <div className="relative">
              <div className="bg-black rounded-[40px] p-6 aspect-[9/19] shadow-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-3xl" />
                <div className="h-full bg-background rounded-[28px] p-4 flex flex-col">
                  <div className="text-sm font-medium mb-2">Siri</div>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <p className="text-sm">"I see you have some free time right now, would you like to do anything?"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button variant="outline" className="w-full">Bored</Button>
                    <Button variant="outline" className="w-full">Hungry</Button>
                    <Button variant="outline" className="w-full">Learn</Button>
                    <Button variant="outline" className="w-full">Activity</Button>
                  </div>
                  <div className="mt-auto flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email interface mockup */}
            <div className="relative">
              <div className="bg-card rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary" />
                  <div>
                    <div className="font-medium">GoLucky Assistant</div>
                    <div className="text-sm text-muted-foreground">assistant@golucky.ai</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm">I see you have some free time right now, would you like to do anything?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">Bored</Button>
                    <Button variant="outline" size="sm" className="w-full">Hungry</Button>
                    <Button variant="outline" size="sm" className="w-full">Learn</Button>
                    <Button variant="outline" size="sm" className="w-full">Activity</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="bg-primary/10 rounded-lg p-4 max-w-lg">
              <p className="text-sm">
                GoLucky's AI automatically fills in the details - finding the perfect time, location, and duration based on your preferences and schedule.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}