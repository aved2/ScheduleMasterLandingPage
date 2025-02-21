import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  reason: z.string().min(1, "Reason is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function FormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      reason: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formBody = new URLSearchParams(data as any).toString(); // Convert data to form-urlencoded
  
      const response = await fetch("https://script.google.com/macros/s/AKfycbx-ZXQpG1ZH_ci9SpRMBsgUOMTilkHI99UoQ7q6hkppCQ1W_MKlOflRM5eKwcMlDwYZfQ/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Plain text
        body: formBody,
        redirect: "follow",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.text();
      console.log("Server Response:", result);
      
      // Reset the form fields
      form.reset();
      // Set the submission status to true
      setIsSubmitted(true);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Get Early Access</CardTitle>
            <CardDescription>
              Sign up to be among the first to experience our AI-powered calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} placeholder="John Doe" />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">What brings you here?</Label>
                <select id="reason" {...form.register("reason")} className="w-full p-2 border rounded">
                  <option value="">Select a reason</option>
                  <option value="option1">Personal Use</option>
                  <option value="option2">Business/Organization</option>
                  <option value="option4">Other</option>
                </select>
                {form.formState.errors.reason && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.reason.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
            {isSubmitted && (
              <p className="text-green-500 mt-4">You've been placed on the waitlist!</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="hidden md:flex flex-col justify-center p-8 bg-muted">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-4xl font-bold">GoLucky</h1>
          <p className="text-xl text-muted-foreground">
            Your AI-powered calendar assistant that helps you make the most of your time.
          </p>
        </div>
      </div>
    </div>
  );
}