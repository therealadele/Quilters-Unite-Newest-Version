import { Link, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageCircle, Pin, Lock, Eye, Plus, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ForumCategory, ForumThread } from "@shared/schema";
import { SEO } from "@/components/seo";

function formatDate(date: Date | string | null) {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ForumCategoryPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: category, isLoading: categoryLoading } = useQuery<ForumCategory>({
    queryKey: ["/api/forums", id],
    queryFn: async () => {
      const res = await fetch(`/api/forums`);
      if (!res.ok) throw new Error("Failed to fetch category");
      const categories = await res.json();
      return categories.find((c: ForumCategory) => c.id === id);
    },
  });

  const { data: threads, isLoading: threadsLoading } = useQuery<ForumThread[]>({
    queryKey: ["/api/forums", id, "threads"],
    queryFn: async () => {
      const res = await fetch(`/api/forums/${id}/threads`);
      if (!res.ok) throw new Error("Failed to fetch threads");
      return res.json();
    },
  });

  const createThread = useMutation({
    mutationFn: async (): Promise<ForumThread> => {
      const res = await apiRequest("POST", `/api/forums/${id}/threads`, {
        title: newThreadTitle,
      });
      return res.json();
    },
    onSuccess: async (thread: ForumThread) => {
      toast({ title: "Thread created!" });
      queryClient.invalidateQueries({ queryKey: ["/api/forums", id, "threads"] });
      setNewThreadTitle("");
      setNewThreadContent("");
      setIsDialogOpen(false);
      if (newThreadContent) {
        await apiRequest("POST", `/api/threads/${thread.id}/posts`, {
          content: newThreadContent,
        });
      }
    },
    onError: () => {
      toast({ title: "Failed to create thread", variant: "destructive" });
    },
  });

  const isLoading = categoryLoading || threadsLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Forum Category" description="Browse forum discussions in this category." path="/community/forums" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/community/forums">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold" data-testid="heading-forum-category">
                {category?.name || "Forum"}
              </h1>
              <p className="text-muted-foreground mt-1">{category?.description}</p>
            </div>
            {isAuthenticated && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="button-new-thread">
                    <Plus className="h-4 w-4" />
                    New Thread
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('forums.startNewThread')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">{t('forums.threadTitle')}</Label>
                      <Input
                        id="title"
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                        placeholder={t('forums.threadTitlePlaceholder')}
                        data-testid="input-thread-title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">{t('forums.firstPost')}</Label>
                      <Textarea
                        id="content"
                        value={newThreadContent}
                        onChange={(e) => setNewThreadContent(e.target.value)}
                        placeholder={t('forums.firstPostPlaceholder')}
                        rows={4}
                        data-testid="input-thread-content"
                      />
                    </div>
                    <Button 
                      onClick={() => createThread.mutate()} 
                      disabled={!newThreadTitle.trim() || createThread.isPending}
                      className="w-full"
                      data-testid="button-submit-thread"
                    >
                      {createThread.isPending ? "Creating..." : t('forums.postThread')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : threads && threads.length > 0 ? (
            <div className="space-y-3">
              {threads.map((thread) => (
                <Card 
                  key={thread.id} 
                  className="hover-elevate transition-all"
                  data-testid={`card-thread-${thread.id}`}
                >
                  <Link href={`/community/threads/${thread.id}`}>
                    <CardHeader className="flex flex-row items-center gap-4 py-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={thread.userImage || undefined} />
                        <AvatarFallback>{thread.userName?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {thread.isPinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
                          {thread.isLocked && <Lock className="h-4 w-4 text-muted-foreground shrink-0" />}
                          <CardTitle className="text-base truncate">{thread.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{t('common.by')} {thread.userName}</span>
                          <span>{formatDate(thread.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{thread.postCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{thread.viewCount || 0}</span>
                        </div>
                      </div>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No threads yet. Be the first to start a discussion!</p>
                {isAuthenticated && (
                  <Button onClick={() => setIsDialogOpen(true)}>Start a Thread</Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
