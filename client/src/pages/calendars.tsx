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
import { SiGoogle, SiMicrosoftoutlook, SiApple } from "react-icons/si";

export default function Calendars() {
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);
  const [isOutlookDialogOpen, setIsOutlookDialogOpen] = useState(false);
  const [isAppleDialogOpen, setIsAppleDialogOpen] = useState(false);

  const handleGoogleAuth = () => {
    // Open the Google OAuth window
    window.open("/auth/google", "_blank", "width=500,height=600");
  };

  const handleOutlookAuth = () => {
    // Open the Outlook OAuth window
    window.open("/auth/outlook", "_blank", "width=500,height=600");
  };

  const handleAppleAuth = () => {
    // Open the Apple OAuth window
    window.open("/auth/apple", "_blank", "width=500,height=600");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Calendar Management</h1>

      <div className="grid gap-6">
        <Card>
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
                  <SiMicrosoftoutlook className="mr-2 h-4 w-4" />
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