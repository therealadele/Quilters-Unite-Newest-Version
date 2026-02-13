import { useParams, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import {
  BookOpen,
  Heart,
  MessageCircle,
  ArrowLeft,
  Grid3X3,
  Send,
} from "lucide-react";
import type { Project, Comment } from "@shared/schema";
import { SEO } from "@/components/seo";

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json();
    },
    enabled: !!id,
  });

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["/api/projects", id, "comments"],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: !!id,
  });

  const likeProject = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/projects/${id}/like`, {});
    },
    onSuccess: () => {
      toast({ title: "Liked!" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
    },
    onError: () => {
      toast({ title: "Failed to like", variant: "destructive" });
    },
  });

  const addComment = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/projects/${id}/comments`, {
        content: commentText,
        userName: user?.firstName || "Anonymous",
        userImage: user?.profileImageUrl,
      });
    },
    onSuccess: () => {
      setCommentText("");
      toast({ title: "Comment added!" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
    },
    onError: () => {
      toast({ title: "Failed to add comment", variant: "destructive" });
    },
  });

  const addToFavorites = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/favorites", {
        itemType: "project",
        itemId: id,
        itemName: project?.title,
        itemImage: project?.photos?.[0],
      });
    },
    onSuccess: () => {
      toast({ title: "Added to favorites!" });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: () => {
      toast({ title: "Failed to add to favorites", variant: "destructive" });
    },
  });

  const photos = project?.photos || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="Project Details" description="View project details, photos, and comments from the quilting community." path="/projects" />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex gap-4">
              <div className="w-20 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))}
              </div>
              <Skeleton className="flex-1 aspect-square rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Project not found</h1>
          <p className="text-muted-foreground mb-6">This project may have been removed or is private.</p>
          <Button asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-3xl font-semibold">{project.title}</h1>
            <Badge 
              className="capitalize"
              variant={project.status === "finished" ? "default" : "secondary"}
            >
              {project.status?.replace("_", " ")}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex gap-4">
                <div className="w-20 space-y-2 flex-shrink-0 max-h-[500px] overflow-y-auto">
                  {photos.length > 0 ? (
                    photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhotoIndex(index)}
                        className={`w-full aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                          selectedPhotoIndex === index 
                            ? "border-primary" 
                            : "border-transparent hover:border-muted-foreground/30"
                        }`}
                      >
                        <img 
                          src={photo} 
                          alt={`${project.title} thumbnail ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))
                  ) : (
                    [...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-full aspect-square rounded-md bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10 flex items-center justify-center"
                      >
                        <BookOpen className="h-6 w-6 text-teal-300" />
                      </div>
                    ))
                  )}
                </div>

                <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10 flex items-center justify-center">
                  {photos.length > 0 && photos[selectedPhotoIndex] ? (
                    <img 
                      src={photos[selectedPhotoIndex]} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-24 w-24 text-teal-300" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={project.userImage || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {project.userName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{project.userName || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground">Quilter</p>
                </div>
              </div>

              {project.notes && (
                <p className="text-muted-foreground">{project.notes}</p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {project.patternName && (
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1 mb-1">
                      <Grid3X3 className="h-3.5 w-3.5" />
                      Pattern
                    </p>
                    {project.patternId ? (
                      <Link href={`/patterns/${project.patternId}`} className="font-medium hover:text-primary transition-colors">
                        {project.patternName}
                      </Link>
                    ) : (
                      <p className="font-medium">{project.patternName}</p>
                    )}
                  </div>
                )}
                {project.quiltSize && (
                  <div>
                    <p className="text-muted-foreground mb-1">Size</p>
                    <p className="font-medium">{project.quiltSize}</p>
                  </div>
                )}
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full gap-2"
                    onClick={() => likeProject.mutate()}
                    disabled={likeProject.isPending || !isAuthenticated}
                    data-testid="button-like"
                  >
                    <Heart className="h-4 w-4" />
                    Like ({project.likeCount || 0})
                  </Button>
                  
                  {isAuthenticated ? (
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => addToFavorites.mutate()}
                      disabled={addToFavorites.isPending}
                      data-testid="button-add-favorite"
                    >
                      <Heart className="h-4 w-4" />
                      Add to Favorites
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/login">{t('common.signIn')}</a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Comments ({project.commentCount || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAuthenticated && (
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user?.firstName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="min-h-[60px] text-sm"
                          data-testid="input-comment"
                        />
                        <Button 
                          size="sm"
                          className="mt-2"
                          disabled={!commentText.trim() || addComment.isPending}
                          onClick={() => addComment.mutate()}
                          data-testid="button-submit-comment"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Post
                        </Button>
                      </div>
                    </div>
                  )}

                  {comments && comments.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="h-7 w-7 flex-shrink-0">
                            <AvatarImage src={comment.userImage || undefined} />
                            <AvatarFallback className="bg-muted text-xs">
                              {comment.userName?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-medium text-sm">{comment.userName || "Anonymous"}</span>
                              <span className="text-xs text-muted-foreground">
                                {comment.createdAt && new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-2">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
