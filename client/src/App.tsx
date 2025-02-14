import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Preferences from "@/pages/preferences";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import Features from "@/pages/features";
import Roadmap from "@/pages/roadmap";
import Calendars from "@/pages/calendars";
import Auth from "@/pages/auth";
import CollaborativeEvent from "@/pages/collaborative-event";
import Connections from "@/pages/connections";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navbar />
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/features" component={Features} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/auth" component={Auth} />
          <ProtectedRoute path="/app" component={Home} />
          <ProtectedRoute path="/preferences" component={Preferences} />
          <ProtectedRoute path="/calendars" component={Calendars} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/connections" component={Connections} />
          <ProtectedRoute path="/collaborative-event" component={CollaborativeEvent} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}