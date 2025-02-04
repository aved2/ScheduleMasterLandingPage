import { Event } from "@db/schema";

export function findFreeTimeSlots(
  events: Event[],
  date: Date,
  minimumDuration: number
): Array<{ start: Date; end: Date; duration: number }> {
  const dayStart = new Date(date.setHours(9, 0, 0, 0));
  const dayEnd = new Date(date.setHours(21, 0, 0, 0));
  
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const freeSlots: Array<{ start: Date; end: Date; duration: number }> = [];
  let currentTime = dayStart;

  sortedEvents.forEach(event => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);

    // If there's a gap between current time and event start
    if (currentTime < eventStart) {
      const duration = (eventStart.getTime() - currentTime.getTime()) / (1000 * 60);
      if (duration >= minimumDuration) {
        freeSlots.push({
          start: new Date(currentTime),
          end: new Date(eventStart),
          duration
        });
      }
    }
    
    currentTime = eventEnd > currentTime ? eventEnd : currentTime;
  });

  // Check for free time after last event
  if (currentTime < dayEnd) {
    const duration = (dayEnd.getTime() - currentTime.getTime()) / (1000 * 60);
    if (duration >= minimumDuration) {
      freeSlots.push({
        start: new Date(currentTime),
        end: new Date(dayEnd),
        duration
      });
    }
  }

  return freeSlots;
}
