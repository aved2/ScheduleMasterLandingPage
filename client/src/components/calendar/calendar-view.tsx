import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Event } from "@db/schema";

interface CalendarViewProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isLoading: boolean;
}

export default function CalendarView({
  events,
  selectedDate,
  onDateSelect,
  isLoading,
}: CalendarViewProps) {
  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-md border"
        />
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">
            Events for {selectedDate.toLocaleDateString()}
          </h3>
          
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-2 rounded-md border",
                      "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.startTime).toLocaleTimeString()} - 
                      {new Date(event.endTime).toLocaleTimeString()}
                    </p>
                    {event.location && (
                      <p className="text-sm text-muted-foreground">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                ))}
                
                {selectedDateEvents.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No events scheduled for this day
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
