import { Button } from "@/components/ui/button";
import { Calendar, Play, ArrowRight, Sun, Cloud, Brain, Users, Sparkles, BarChart2, Quote } from "lucide-react";
import { SiZoom, SiGooglecalendar, SiGoogle } from "react-icons/si";
import { BiLogoMicrosoft } from "react-icons/bi";
import { Link } from "wouter";
import { Avatar } from "@/components/ui/avatar";

export default function Landing() {
  const userTypes = [
    {
      title: "Professionals",
      description: "Optimize your work-life balance with smart scheduling",
      icon: "👔",
      benefits: ["Automated break scheduling", "Meeting optimization", "Work-life balance tips"]
    },
    {
      title: "Students",
      description: "Balance study sessions with social activities",
      icon: "🎓",
      benefits: ["Study break reminders", "Social event planning", "Exam preparation time"]
    },
    {
      title: "Remote Workers",
      description: "Enhance your home-based work routine",
      icon: "🏠",
      benefits: ["Virtual meeting management", "Break time activities", "Productivity tracking"]
    },
    {
      title: "Fitness Enthusiasts",
      description: "Never miss a workout with smart scheduling",
      icon: "💪",
      benefits: ["Weather-based workout plans", "Exercise time optimization", "Activity tracking"]
    }
  ];

  const features = [
    {
      title: "AI-Powered Scheduling",
      description: "Our smart AI learns your preferences and fills your free time with meaningful activities",
      icon: <Brain className="w-12 h-12" />,
      color: "bg-blue-100 dark:bg-blue-950",
      link: "/features#ai-scheduling"
    },
    {
      title: "Weather-Aware",
      description: "Get activity suggestions that adapt to current weather conditions",
      icon: <Cloud className="w-12 h-12" />,
      color: "bg-yellow-100 dark:bg-yellow-950",
      link: "/features#weather"
    },
    {
      title: "Energy Matching",
      description: "Activities that align perfectly with your daily energy levels",
      icon: <Sun className="w-12 h-12" />,
      color: "bg-purple-100 dark:bg-purple-950",
      link: "/features#energy"
    },
    {
      title: "Social Planning",
      description: "Effortlessly coordinate activities with friends and colleagues",
      icon: <Users className="w-12 h-12" />,
      color: "bg-green-100 dark:bg-green-950",
      link: "/features#social"
    }
  ];

  const testimonials = [
    {
      title: "Work-Life Balance Transformation",
      subtitle: "How GoLucky helped a busy executive",
      author: "Sarah Chen",
      role: "Chief Technology Officer",
      quote: "GoLucky transformed how I manage my time. The AI-powered suggestions helped me find the perfect balance between work commitments and personal time.",
      impact: [
        "Reduced scheduling conflicts by 60%",
        "Found time for regular exercise",
        "Improved work-life satisfaction"
      ],
      avatar: "SC"
    },
    {
      title: "Staying Organized as a Freelancer",
      author: "Marcus Rodriguez",
      role: "Independent Designer",
      quote: "As a freelancer juggling multiple clients, GoLucky has become my personal assistant. It intelligently schedules my work and ensures I never miss important deadlines.",
      impact: [
        "Increased productivity by 40%",
        "Better client satisfaction",
        "More time for skill development"
      ],
      avatar: "MR"
    },
    {
      title: "Maximizing Student Productivity",
      author: "Emily Watson",
      role: "Graduate Student",
      quote: "GoLucky helped me balance my academic commitments with extracurricular activities. The energy-based scheduling is a game-changer for study sessions.",
      impact: [
        "Improved study-life balance",
        "Better grades through optimized study times",
        "Reduced stress levels"
      ],
      avatar: "EW"
    }
  ];

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="container mx-auto px-4 py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <div className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Introducing Smart Time Management
                </div>
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  Transform Free Time into 
                  <span className="text-primary"> Meaningful Experiences</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Our AI-powered calendar understands your schedule, preferences, and energy levels
                  to suggest perfect activities for your free time.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/form">
                      <Calendar className="w-5 h-5" />
                      Get Early Access
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" asChild>
                    <Link href="/features">
                      <Play className="w-5 h-5" />
                      See How It Works
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg" />
                <div className="relative bg-card rounded-lg p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-lg">
                      <Sparkles className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Smart Suggestions</h3>
                        <p className="text-sm text-muted-foreground">AI analyzing your perfect time slots</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-lg">
                      <BarChart2 className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Energy Tracking</h3>
                        <p className="text-sm text-muted-foreground">Matching activities to your energy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-lg">
                      <Cloud className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Weather-Aware</h3>
                        <p className="text-sm text-muted-foreground">Smart outdoor activity planning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-4">Powerful Features for Everyone</h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Experience the perfect blend of AI intelligence and intuitive design to make every moment count
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.link}>
                <div className="group relative cursor-pointer">
                  <div className={`${feature.color} rounded-lg p-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                    <div className="text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-muted py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Who Can Benefit?</h2>
            <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Designed for everyone who wants to make the most of their time
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {userTypes.map((type) => (
                <div key={type.title} className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-background py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Discover how GoLucky is helping professionals, freelancers, and students transform their time management
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.title} className="relative bg-card rounded-lg p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold">
                        {testimonial.avatar}
                      </div>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.author}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="absolute top-4 right-4 text-primary/10">
                      <Quote className="w-12 h-12" />
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <h4 className="font-semibold mb-2">Key Improvements:</h4>
                    <ul className="space-y-2">
                      {testimonial.impact.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-semibold mb-4">Works With Your Favorite Tools</h2>
          <p className="text-muted-foreground mb-8">Seamlessly integrate with the tools you already use</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <SiGooglecalendar className="w-12 h-12 text-primary opacity-75 hover:opacity-100 transition-opacity" title="Google Calendar" />
            <BiLogoMicrosoft className="w-12 h-12 text-primary opacity-75 hover:opacity-100 transition-opacity" title="Microsoft Calendar" />
            <SiZoom className="w-12 h-12 text-primary opacity-75 hover:opacity-100 transition-opacity" title="Zoom" />
            <SiGoogle className="w-12 h-12 text-primary opacity-75 hover:opacity-100 transition-opacity" title="Google Meet" />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Time?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the waitlist for early access to our beta release
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/form">
                  <Calendar className="w-5 h-5" />
                  Get Early Access
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}