import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { useState } from "react";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function Auth() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  if (user) {
    return <Redirect to="/app" />;
  }

  const onSubmit = async (data: AuthFormData) => {
    if (isRegistering) {
      await registerMutation.mutateAsync(data);
    } else {
      await loginMutation.mutateAsync(data);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isRegistering ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isRegistering
                ? "Sign up to start organizing your time better"
                : "Login to access your smart calendar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...form.register("username")}
                  placeholder="johndoe"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                {isRegistering ? "Sign Up" : "Login"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {isRegistering
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden md:flex flex-col justify-center p-8 bg-muted">
        <div className="max-w-md mx-auto space-y-6">
          <Calendar className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">GoLucky</h1>
          <p className="text-xl text-muted-foreground">
            Your AI-powered calendar assistant that helps you make the most of your time.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations for your free time
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-semibold mb-2">Calendar Sync</h3>
              <p className="text-sm text-muted-foreground">
                Connect all your calendars in one place
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}