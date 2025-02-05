import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import { SiGoogle, SiApple, SiZoom, SiGooglecalendar } from "react-icons/si";
import { BiLogoMicrosoft } from "react-icons/bi";

export default function Calendars() {
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);
  const [isOutlookDialogOpen, setIsOutlookDialogOpen] = useState(false);
  const [isAppleDialogOpen, setIsAppleDialogOpen] = useState(false);

  const calendarPlatforms = [
    {
      name: "Google Calendar",
      icon: <SiGooglecalendar className="h-12 w-12 text-primary" />,
      description: "Sync with your Google Calendar",
      features: ["Events sync", "Free/busy time", "Meeting scheduling"]
    },
    {
      name: "Outlook Calendar",
      icon: <BiLogoMicrosoft className="h-12 w-12 text-primary" />,
      description: "Connect with Microsoft Outlook",
      features: ["Calendar sync", "Availability sharing", "Teams integration"]
    },
    {
      name: "Apple Calendar",
      icon: <SiApple className="h-12 w-12 text-primary" />,
      description: "Link your Apple Calendar",
      features: ["iCloud sync", "Event management", "Reminders integration"]
    }
  ];

  const meetingPlatforms = [
    {
      name: "Google Meet",
      icon: <SiGoogle className="h-12 w-12 text-primary" />,
      description: "Quick Google Meet integration",
      features: ["One-click meetings", "Calendar events", "Smart scheduling"]
    },
    {
      name: "Microsoft Teams",
      icon: <BiLogoMicrosoft className="h-12 w-12 text-primary" />,
      description: "Seamless Teams connection",
      features: ["Meeting creation", "Channel events", "Outlook sync"]
    },
    {
      name: "Zoom",
      icon: <SiZoom className="h-12 w-12 text-primary" />,
      description: "Integrate with Zoom",
      features: ["Meeting scheduling", "Calendar sync", "Automatic links"]
    }
  ];

  const handleGoogleAuth = () => {
    window.open("/auth/google", "_blank", "width=500,height=600");
  };

  const handleOutlookAuth = () => {
    window.open("/auth/outlook", "_blank", "width=500,height=600");
  };

  const handleAppleAuth = () => {
    window.open("/auth/apple", "_blank", "width=500,height=600");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Calendar Management</h1>

      <div className="grid gap-8">
        {/* Calendar Platforms Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Calendar Platforms</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {calendarPlatforms.map((platform) => (
              <Card key={platform.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {platform.icon}
                  </div>
                  <CardTitle className="text-center">{platform.name}</CardTitle>
                  <CardDescription className="text-center">
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {platform.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Meeting Platforms Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Meeting Platforms</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {meetingPlatforms.map((platform) => (
              <Card key={platform.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {platform.icon}
                  </div>
                  <CardTitle className="text-center">{platform.name}</CardTitle>
                  <CardDescription className="text-center">
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {platform.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Connection Buttons Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Connect Your Calendars</CardTitle>
            <CardDescription>
              Link your external calendars to enable smart scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Dialog open={isGoogleDialogOpen} onOpenChange={setIsGoogleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start w-full">
                  <SiGoogle className="mr-2 h-4 w-4" />
                  Connect Google Calendar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Google Calendar</DialogTitle>
                  <DialogDescription className="space-y-4">
                    <p>
                      You'll be redirected to Google to authorize access to your calendar.
                      This allows GoLucky to:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>View your calendar events</li>
                      <li>Create new events based on your preferences</li>
                      <li>Update event details</li>
                    </ul>
                    <p className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      Your calendar data will never be shared without your permission
                    </p>
                    <Button onClick={handleGoogleAuth} className="w-full">
                      Continue with Google
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog open={isOutlookDialogOpen} onOpenChange={setIsOutlookDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start w-full">
                  <BiLogoMicrosoft className="mr-2 h-4 w-4" />
                  Connect Outlook Calendar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Outlook Calendar</DialogTitle>
                  <DialogDescription className="space-y-4">
                    <p>
                      You'll be redirected to Microsoft to authorize access to your calendar.
                      This allows GoLucky to:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>View your calendar events</li>
                      <li>Create new events based on your preferences</li>
                      <li>Update event details</li>
                    </ul>
                    <p className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      Your calendar data will never be shared without your permission
                    </p>
                    <Button onClick={handleOutlookAuth} className="w-full">
                      Continue with Microsoft
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog open={isAppleDialogOpen} onOpenChange={setIsAppleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start w-full">
                  <SiApple className="mr-2 h-4 w-4" />
                  Connect Apple Calendar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Apple Calendar</DialogTitle>
                  <DialogDescription className="space-y-4">
                    <p>
                      You'll be redirected to Apple to authorize access to your calendar.
                      This allows GoLucky to:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>View your calendar events</li>
                      <li>Create new events based on your preferences</li>
                      <li>Update event details</li>
                    </ul>
                    <p className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      Your calendar data will never be shared without your permission
                    </p>
                    <Button onClick={handleAppleAuth} className="w-full">
                      Continue with Apple
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}