import { useParams, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Grid3X3,
  Heart,
  ListPlus,
  BookmarkPlus,
  Download,
  ExternalLink,
  ArrowLeft,
  Ruler,
  Scissors,
  BookOpen,
  ShoppingCart,
} from "lucide-react";
import type { Block, Project } from "@shared/schema";
import { SEO } from "@/components/seo";

export default function BlockDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: block, isLoading } = useQuery<Block>({
    queryKey: ["/api/blocks", id, i18n.language],
    queryFn: async () => {
      const res = await fetch(`/api/blocks/${id}?language=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to fetch block");
      return res.json();
    },
    enabled: !!id,
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects", "block", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects?blockId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: !!id,
  });

  const addToFavorites = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/favorites", {
        itemType: "block",
        itemId: id,
        itemName: block?.name,
        itemImage: block?.imageUrl,
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

  const addToQueue = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/queue", {
        patternId: id,
        patternName: block?.name,
        patternImage: block?.imageUrl,
      });
    },
    onSuccess: () => {
      toast({ title: "Added to queue!" });
      queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
    },
    onError: () => {
      toast({ title: "Failed to add to queue", variant: "destructive" });
    },
  });

  const addToLibrary = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/library", {
        patternId: id,
        patternName: block?.name,
        patternImage: block?.imageUrl,
        format: "pdf",
      });
    },
    onSuccess: () => {
      toast({ title: "Added to library!" });
      queryClient.invalidateQueries({ queryKey: ["/api/library"] });
    },
    onError: () => {
      toast({ title: "Failed to add to library", variant: "destructive" });
    },
  });

  const buyBlock = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/blocks/${id}/checkout`);
      return res.json();
    },
    onSuccess: (data: { url: string }) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({ title: "Failed to start checkout", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="Block Details" description="View quilt block details, construction guides, and variations." path="/blocks" />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="aspect-[4/3] rounded-lg" />
              <Skeleton className="h-32" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!block) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Grid3X3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Block not found</h1>
          <p className="text-muted-foreground mb-6">This block may have been removed or doesn't exist.</p>
          <Button asChild>
            <Link href="/blocks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blocks
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
          <Link href="/blocks" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="font-serif text-3xl font-semibold mb-2">{block.name}</h1>
                <p className="text-lg text-muted-foreground">{t('common.by')} {block.designerName}</p>
              </div>

              <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10 rounded-lg flex items-center justify-center overflow-hidden">
                {block.imageUrl ? (
                  <img src={block.imageUrl} alt={block.name} className="w-full h-full object-cover" />
                ) : (
                  <Grid3X3 className="h-24 w-24 text-teal-300" />
                )}
              </div>

              {projects && projects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Projects Using This Block ({projects.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {projects.slice(0, 6).map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`}>
                          <div className="group cursor-pointer">
                            <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                              {project.photos && project.photos[0] ? (
                                <img src={project.photos[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Grid3X3 className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{project.title}</p>
                            <p className="text-xs text-muted-foreground">{t('common.by')} {project.userName}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {block.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{block.description}</p>
                  </CardContent>
                </Card>
              )}

              {block.techniques && block.techniques.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scissors className="h-5 w-5" />
                      Techniques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {block.techniques.map((technique, i) => (
                        <Badge key={i} variant="secondary">{technique}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {block.sizes && block.sizes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="h-5 w-5" />
                      Available Sizes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {block.sizes.map((size, i) => (
                        <Badge key={i} variant="outline">{size}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">{block.difficulty}</Badge>
                    <Badge variant="outline">{block.blockType}</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {block.favoriteCount || 0} favorites
                      </span>
                      <span className="flex items-center gap-1">
                        <BookmarkPlus className="h-4 w-4" />
                        {block.projectCount || 0} projects
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {block.isFree ? (
                    <div className="text-center py-2">
                      <span className="text-2xl font-bold text-primary">{t('common.free')}</span>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-2xl font-bold">${((block.price || 0) / 100).toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Actions</h4>
                    
                    {block.isFree ? (
                      block.downloadUrl && (
                        <Button className="w-full" asChild>
                          <a href={block.downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download Block
                          </a>
                        </Button>
                      )
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => buyBlock.mutate()}
                        disabled={buyBlock.isPending || !isAuthenticated}
                        data-testid="button-buy-block"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {buyBlock.isPending ? "Processing..." : "Buy Block"}
                      </Button>
                    )}

                    {block.sourceLink && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={block.sourceLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Source
                        </a>
                      </Button>
                    )}
                  </div>

                  {isAuthenticated && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => addToFavorites.mutate()}
                          disabled={addToFavorites.isPending}
                          data-testid="button-add-favorite"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Add to Favorites
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => addToQueue.mutate()}
                          disabled={addToQueue.isPending}
                          data-testid="button-add-queue"
                        >
                          <ListPlus className="h-4 w-4 mr-2" />
                          Add to Queue
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => addToLibrary.mutate()}
                          disabled={addToLibrary.isPending}
                          data-testid="button-add-library"
                        >
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Add to Library
                        </Button>
                      </div>
                    </>
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
