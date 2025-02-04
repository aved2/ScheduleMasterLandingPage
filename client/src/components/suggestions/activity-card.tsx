import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ActivitySuggestion } from "@db/schema";
import { Clock, MapPin } from "lucide-react";
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

  const declineMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/suggestions/${suggestion.id}/decline`, {});
    },
  });

  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">{suggestion.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {suggestion.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {suggestion.duration} mins
          </div>
          {suggestion.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {suggestion.location}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          variant="default"
          onClick={() => acceptMutation.mutate()}
          disabled={acceptMutation.isPending || declineMutation.isPending}
        >
          Accept
        </Button>
        <Button
          variant="outline"
          onClick={() => declineMutation.mutate()}
          disabled={acceptMutation.isPending || declineMutation.isPending}
        >
          Decline
        </Button>
      </CardFooter>
    </Card>
  );
}
