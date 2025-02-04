
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function Calendars() {
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
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={() => window.open("/auth/google", "_blank")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Connect Google Calendar
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.open("/auth/outlook", "_blank")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Connect Outlook Calendar
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.open("/auth/apple", "_blank")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Connect Apple Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
