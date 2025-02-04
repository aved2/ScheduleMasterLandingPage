import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CalendarView from "@/components/calendar/calendar-view";
import ActivityCard from "@/components/suggestions/activity-card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { location } = useGeolocation();

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["/api/suggestions", location?.latitude, location?.longitude],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarView 
              events={events || []}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              isLoading={eventsLoading}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Suggested Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {suggestionsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : suggestions?.map((suggestion) => (
              <ActivityCard 
                key={suggestion.id}
                suggestion={suggestion}
                className="mb-4"
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
