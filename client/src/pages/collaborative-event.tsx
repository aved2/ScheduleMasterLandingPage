import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

const collaborativeEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  votingDeadline: z.string().min(1, "Voting deadline is required"),
  category: z.string().default("social"),
});

type CollaborativeEventForm = z.infer<typeof collaborativeEventSchema>;

export default function CollaborativeEvent() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<CollaborativeEventForm>({
    resolver: zodResolver(collaborativeEventSchema),
    defaultValues: {
      category: "social",
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: CollaborativeEventForm) => {
      const response = await apiRequest("POST", "/api/collaborative-events", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Collaborative event created successfully",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CollaborativeEventForm) => {
    createEventMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Collaborative Event</CardTitle>
          <CardDescription>
            Plan an event together with your friends or colleagues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Team Lunch, Project Meeting, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional details about the event..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="votingDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voting Deadline</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      When should voting for time slots and locations end?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={createEventMutation.isPending}
                className="w-full"
              >
                {createEventMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Collaborative Event
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
