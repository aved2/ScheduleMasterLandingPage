import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { UserPlus, Users, Check, X, Loader2, User as UserIcon } from "lucide-react";
import type { User, UserConnection } from "@db/schema";

type ConnectionWithUser = UserConnection & {
  user: User;
};

export default function Connections() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Query for searching users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["/api/users/search", searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 3) return [];
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to search users');
      return res.json();
    },
    enabled: searchQuery.length >= 3,
  });

  // Query for getting user's connections
  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["/api/users/connections"],
    queryFn: async () => {
      const res = await fetch('/api/users/connections');
      if (!res.ok) throw new Error('Failed to fetch connections');
      return res.json();
    },
  });

  // Mutation for sending connection request
  const sendConnectionMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("POST", "/api/users/connections", { userId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/connections"] });
    },
  });

  // Mutation for accepting/rejecting connection requests
  const updateConnectionMutation = useMutation({
    mutationFn: async ({ connectionId, status }: { connectionId: number; status: 'accepted' | 'rejected' }) => {
      const res = await apiRequest("PATCH", `/api/users/connections/${connectionId}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/connections"] });
    },
  });

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Connections</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search users by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.length >= 3 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Find and connect with other users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : searchResults?.length ? (
              <div className="space-y-4">
                {searchResults.map((result: User) => (
                  <div key={result.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">{result.username}</p>
                        {result.location && (
                          <p className="text-sm text-muted-foreground">{result.location}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendConnectionMutation.mutate(result.id)}
                      disabled={sendConnectionMutation.isPending}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No users found</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Requests */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            Connection requests waiting for your response
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConnections ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : connections?.pending?.length ? (
            <div className="space-y-4">
              {connections.pending.map((connection: ConnectionWithUser) => (
                <div key={connection.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <p className="font-medium">{connection.user.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateConnectionMutation.mutate({ 
                        connectionId: connection.id, 
                        status: 'accepted' 
                      })}
                      disabled={updateConnectionMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateConnectionMutation.mutate({ 
                        connectionId: connection.id, 
                        status: 'rejected' 
                      })}
                      disabled={updateConnectionMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No pending requests</p>
          )}
        </CardContent>
      </Card>

      {/* Connected Users */}
      <Card>
        <CardHeader>
          <CardTitle>Your Connections</CardTitle>
          <CardDescription>
            People you're connected with
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConnections ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : connections?.accepted?.length ? (
            <div className="space-y-4">
              {connections.accepted.map((connection: ConnectionWithUser) => (
                <div key={connection.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{connection.user.username}</p>
                      {connection.user.location && (
                        <p className="text-sm text-muted-foreground">{connection.user.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No connections yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}