import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, UserCheck, UserX, ArrowLeft, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Friendship } from "@shared/schema";
import { SEO } from "@/components/seo";

export default function FriendsPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: friends, isLoading: friendsLoading } = useQuery<Friendship[]>({
    queryKey: ["/api/friends"],
    queryFn: async () => {
      const res = await fetch("/api/friends");
      if (!res.ok) throw new Error("Failed to fetch friends");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const { data: requests, isLoading: requestsLoading } = useQuery<Friendship[]>({
    queryKey: ["/api/friends/requests"],
    queryFn: async () => {
      const res = await fetch("/api/friends/requests");
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const respondToRequest = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/friends/${id}`, { status });
    },
    onSuccess: () => {
      toast({ title: "Friend request updated!" });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
    },
    onError: () => {
      toast({ title: "Failed to respond to request", variant: "destructive" });
    },
  });

  const removeFriend = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/friends/${id}`, {});
    },
    onSuccess: () => {
      toast({ title: "Friend removed" });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
    },
    onError: () => {
      toast({ title: "Failed to remove friend", variant: "destructive" });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="Friends" description="Manage your quilting friends and connections." path="/community/friends" noindex />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Sign in to manage your friends</p>
              <Button asChild>
                <a href="/login">{t('common.signIn')}</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold" data-testid="heading-friends">{t('friends.title')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('friends.description')}
              </p>
            </div>
            <Link href="/community">
              <Button data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="friends">
            <TabsList className="mb-6">
              <TabsTrigger value="friends" className="gap-2" data-testid="tab-friends">
                <UserCheck className="h-4 w-4" />
                {t('friends.friends')} ({friends?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2" data-testid="tab-requests">
                <UserPlus className="h-4 w-4" />
                {t('friends.requests')} ({requests?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends">
              {friendsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : friends && friends.length > 0 ? (
                <div className="space-y-3">
                  {friends.map((friendship) => {
                    const isRequester = friendship.requesterId === user?.id;
                    const friendName = isRequester ? friendship.receiverName : friendship.requesterName;
                    const friendImage = isRequester ? friendship.receiverImage : friendship.requesterImage;
                    
                    return (
                      <Card key={friendship.id} data-testid={`card-friend-${friendship.id}`}>
                        <CardContent className="flex items-center gap-4 py-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={friendImage || undefined} />
                            <AvatarFallback>{friendName?.[0] || "?"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{friendName || "Quilter"}</p>
                            <p className="text-sm text-muted-foreground">Friends since recently</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFriend.mutate(friendship.id)}
                            disabled={removeFriend.isPending}
                            data-testid="button-remove-friend"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            {t('friends.remove')}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">{t('friends.noFriendsYet')}</p>
                    <Link href="/community/people">
                      <Button>{t('friends.findPeople')}</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="requests">
              {requestsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : requests && requests.length > 0 ? (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <Card key={request.id} data-testid={`card-request-${request.id}`}>
                      <CardContent className="flex items-center gap-4 py-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.requesterImage || undefined} />
                          <AvatarFallback>{request.requesterName?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{request.requesterName || "Quilter"}</p>
                          <p className="text-sm text-muted-foreground">Wants to be your friend</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => respondToRequest.mutate({ id: request.id, status: "accepted" })}
                            disabled={respondToRequest.isPending}
                            data-testid="button-accept-request"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {t('friends.accept')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => respondToRequest.mutate({ id: request.id, status: "blocked" })}
                            disabled={respondToRequest.isPending}
                            data-testid="button-decline-request"
                          >
                            <X className="h-4 w-4 mr-1" />
                            {t('friends.decline')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t('friends.noRequests')}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
