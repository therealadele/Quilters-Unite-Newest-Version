import { Link, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Pin, Lock, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ForumThread, ForumPost } from "@shared/schema";
import { SEO } from "@/components/seo";

function formatDate(date: Date | string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [replyContent, setReplyContent] = useState("");

  const { data: thread, isLoading: threadLoading } = useQuery<ForumThread>({
    queryKey: ["/api/threads", id],
    queryFn: async () => {
      const res = await fetch(`/api/threads/${id}`);
      if (!res.ok) throw new Error("Failed to fetch thread");
      return res.json();
    },
  });

  const { data: posts, isLoading: postsLoading } = useQuery<ForumPost[]>({
    queryKey: ["/api/threads", id, "posts"],
    queryFn: async () => {
      const res = await fetch(`/api/threads/${id}/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/threads/${id}/posts`, {
        content: replyContent,
      });
    },
    onSuccess: () => {
      toast({ title: "Reply posted!" });
      queryClient.invalidateQueries({ queryKey: ["/api/threads", id, "posts"] });
      setReplyContent("");
    },
    onError: () => {
      toast({ title: "Failed to post reply", variant: "destructive" });
    },
  });

  const isLoading = threadLoading || postsLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Forum Thread" description="Read and participate in this forum discussion." path="/community/forums" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href={thread ? `/community/forums/${thread.categoryId}` : "/community/forums"}>
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              {threadLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    {thread?.isPinned && <Pin className="h-4 w-4 text-primary" />}
                    {thread?.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                    <h1 className="font-serif text-2xl font-bold" data-testid="heading-thread">
                      {thread?.title}
                    </h1>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Started by {thread?.userName} on {formatDate(thread?.createdAt || null)}
                  </p>
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {posts && posts.length > 0 ? (
                posts.map((post, index) => (
                  <Card key={post.id} data-testid={`card-post-${post.id}`}>
                    <CardHeader className="flex flex-row items-start gap-4 pb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.userImage || undefined} />
                        <AvatarFallback>{post.userName?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{post.userName}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(post.createdAt)}
                            {post.isEdited && " (edited)"}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pl-16">
                      <p className="whitespace-pre-wrap">{post.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-8">
                  <CardContent>
                    <p className="text-muted-foreground">No posts yet. Be the first to reply!</p>
                  </CardContent>
                </Card>
              )}

              {isAuthenticated && !thread?.isLocked && (
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="font-medium">Reply to this thread</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      data-testid="input-reply"
                    />
                    <Button 
                      onClick={() => createPost.mutate()} 
                      disabled={!replyContent.trim() || createPost.isPending}
                      className="gap-2"
                      data-testid="button-submit-reply"
                    >
                      <Send className="h-4 w-4" />
                      {createPost.isPending ? "Posting..." : "Post Reply"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {thread?.isLocked && (
                <Card className="bg-muted/50">
                  <CardContent className="py-4 flex items-center gap-2 justify-center text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>This thread is locked. No new replies can be added.</span>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
