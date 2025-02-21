import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { AuthProvider } from "@/hooks/use-auth";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import Features from "@/pages/features";
import Roadmap from "@/pages/roadmap";
import Form from "@/pages/form";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navbar />
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/features" component={Features} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/form" component={Form} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}