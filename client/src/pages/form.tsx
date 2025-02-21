import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  reason: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function FormPage() {
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
      const response = await fetch(`https://api.airtable.com/v0/app9L2oMC0VaAvod5/tblKJzaH8jncCAEzT`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer patYgwPxmwCgdJZeK.b2263de1d1939a5c53a3b1eef7558cfd78c234be7a77c260c8fc9c831f313f5a`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          fields: {
            Name: data.name,
            Email: data.email,
            Reason: data.reason,
            Timestamp: new Date().toISOString()
          } 
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Server Response:", result);
    } catch (error) {
      console.error("Fetch Error:", error.message);
    }
  }

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
                  <option value="option2">Business/Oringinization</option>
                  <option value="option4">Other</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
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