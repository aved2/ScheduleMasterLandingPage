
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ActivitySuggestion } from "@db/schema";
import { Clock, MapPin, Sun, Battery, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  suggestion: ActivitySuggestion;
  className?: string;
}

export default function ActivityCard({ suggestion, className }: ActivityCardProps) {
  const acceptMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/suggestions/${suggestion.id}/accept`, {});
    },
  });

  const rateMutation = useMutation({
    mutationFn: async (rating: number) => {
      await apiRequest("POST", `/api/suggestions/${suggestion.id}/rate`, { rating });
    },
  });

  return (
    <Card className={cn("relative", className)}>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{suggestion.title}</h3>
          <div className="flex items-center gap-1">
            <Battery className="w-4 h-4" />
            <span>Energy: {suggestion.energyLevel}/5</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{suggestion.duration} minutes</span>
          </div>
          {suggestion.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{suggestion.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <span>{suggestion.indoorActivity ? 'Indoor' : 'Outdoor'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant="ghost"
              size="sm"
              onClick={() => rateMutation.mutate(rating)}
              disabled={rateMutation.isPending}
            >
              <Star className={cn("w-4 h-4", suggestion.rating === rating && "fill-primary")} />
            </Button>
          ))}
        </div>
        <Button
          onClick={() => acceptMutation.mutate()}
          disabled={acceptMutation.isPending}
        >
          Schedule
        </Button>
      </CardFooter>
    </Card>
  );
}
