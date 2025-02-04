
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface PreferencesForm {
  dietaryRestrictions: string[];
  interests: string[];
  activityTypes: string[];
}

export default function Preferences() {
  const { toast } = useToast();
  
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["/api/preferences"],
  });

  const form = useForm<PreferencesForm>({
    defaultValues: preferences || {
      dietaryRestrictions: [],
      interests: [],
      activityTypes: [],
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

  const addItem = (field: keyof PreferencesForm, value: string) => {
    const currentValues = form.getValues(field);
    if (value && !currentValues.includes(value)) {
      form.setValue(field, [...currentValues, value]);
    }
    const input = document.getElementById(`${field}-input`) as HTMLInputElement;
    if (input) input.value = '';
  };

  const removeItem = (field: keyof PreferencesForm, value: string) => {
    const currentValues = form.getValues(field);
    form.setValue(field, currentValues.filter(item => item !== value));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Restrictions</FormLabel>
                  <FormDescription>Add any dietary restrictions or preferences</FormDescription>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="dietaryRestrictions-input"
                          placeholder="E.g., Vegetarian, Gluten-free"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addItem('dietaryRestrictions', e.currentTarget.value);
                            }
                          }}
                        />
                        <Button 
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('dietaryRestrictions-input') as HTMLInputElement;
                            addItem('dietaryRestrictions', input.value);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((item) => (
                          <Badge key={item} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeItem('dietaryRestrictions', item)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormDescription>Add your interests and hobbies</FormDescription>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="interests-input"
                          placeholder="E.g., Hiking, Photography"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addItem('interests', e.currentTarget.value);
                            }
                          }}
                        />
                        <Button 
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('interests-input') as HTMLInputElement;
                            addItem('interests', input.value);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((item) => (
                          <Badge key={item} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeItem('interests', item)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
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
