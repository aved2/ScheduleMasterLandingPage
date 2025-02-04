
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Preferences from "@/pages/preferences";
import NotFound from "@/pages/not-found";
import Features from "@/pages/features";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/features" component={Features} />
        <Route path="/app" component={Home} />
        <Route path="/preferences" component={Preferences} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}
