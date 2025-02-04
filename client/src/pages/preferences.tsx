import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PreferencesForm {
  activityTypes: string[];
  maxTravelDistance: number;
  minimumFreeTime: number;
}

export default function Preferences() {
  const { toast } = useToast();
  
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["/api/preferences"],
  });

  const form = useForm<PreferencesForm>({
    defaultValues: preferences || {
      activityTypes: [],
      maxTravelDistance: 5,
      minimumFreeTime: 30,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PreferencesForm) => {
      await apiRequest("POST", "/api/preferences", data);
    },
    onSuccess: () => {
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
    },
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Activity Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="maxTravelDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Travel Distance (km)</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={50}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumFreeTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Free Time (minutes)</FormLabel>
                  <FormControl>
                    <Slider
                      min={15}
                      max={120}
                      step={15}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
