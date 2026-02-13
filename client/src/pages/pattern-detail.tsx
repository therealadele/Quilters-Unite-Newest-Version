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
import type { Pattern, Project } from "@shared/schema";
import { SEO } from "@/components/seo";

export default function PatternDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: pattern, isLoading } = useQuery<Pattern>({
    queryKey: ["/api/patterns", id, i18n.language],
    queryFn: async () => {
      const res = await fetch(`/api/patterns/${id}?language=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to fetch pattern");
      return res.json();
    },
    enabled: !!id,
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects", "pattern", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects?patternId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: !!id,
  });

  const addToFavorites = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/favorites", {
        itemType: "pattern",
        itemId: id,
        itemName: pattern?.name,
        itemImage: pattern?.imageUrl,
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
        patternName: pattern?.name,
        patternImage: pattern?.imageUrl,
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
        patternName: pattern?.name,
        patternImage: pattern?.imageUrl,
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

  const buyPattern = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/patterns/${id}/checkout`);
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
        <SEO title="Pattern Details" description="View quilt pattern details, yardage requirements, and project photos from the community." path="/patterns" />
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

  if (!pattern) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Grid3X3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Pattern not found</h1>
          <p className="text-muted-foreground mb-6">This pattern may have been removed or doesn't exist.</p>
          <Button asChild>
            <Link href="/patterns">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const fabricReqs = pattern.fabricRequirements as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/patterns" className="hover:text-foreground transition-colors">
                {t('nav.patterns')}
              </Link>
              <span>/</span>
              <span className="text-foreground">{pattern.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery - 3x3 Grid (max 9 images) */}
              <div className="grid grid-cols-3 gap-2 rounded-lg overflow-hidden">
                {(() => {
                  const allImages: string[] = [];
                  if (pattern.imageUrl) allImages.push(pattern.imageUrl);
                  if (projects) {
                    projects.forEach(p => {
                      if (p.photos) {
                        p.photos.forEach(photo => {
                          if (allImages.length < 9) allImages.push(photo);
                        });
                      }
                    });
                  }
                  const tiles = [];
                  for (let i = 0; i < 9; i++) {
                    const image = allImages[i];
                    tiles.push(
                      <div 
                        key={i} 
                        className="aspect-square bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/10 flex items-center justify-center"
                      >
                        {image ? (
                          <img src={image} alt={`${pattern.name} ${i + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <Grid3X3 className="h-8 w-8 text-rose-300" />
                        )}
                      </div>
                    );
                  }
                  return tiles;
                })()}
              </div>

              {/* Projects using this pattern */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Projects Using This Pattern
                  </h3>
                  <span className="text-sm text-muted-foreground">{pattern.projectCount || 0} projects</span>
                </div>
                
                {projects && projects.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {projects.slice(0, 6).map((project) => (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="overflow-hidden hover-elevate cursor-pointer">
                          <CardContent className="p-0">
                            <div className="aspect-square bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10 flex items-center justify-center">
                              {project.photos?.[0] ? (
                                <img src={project.photos[0]} alt={project.title} className="w-full h-full object-cover" />
                              ) : (
                                <BookOpen className="h-8 w-8 text-teal-300" />
                              )}
                            </div>
                            <div className="p-3">
                              <p className="font-medium text-sm line-clamp-1">{project.title}</p>
                              <p className="text-xs text-muted-foreground">{t('common.by')} {project.userName || t('common.anonymous')}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-sm">No projects yet. Be the first to make this pattern!</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pattern Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="font-serif text-3xl font-semibold">{pattern.name}</h1>
                  {pattern.isFree ? (
                    <Badge variant="secondary" className="text-lg px-3 py-1 shrink-0">{t('common.free')}</Badge>
                  ) : pattern.price ? (
                    <Badge variant="default" className="text-lg px-3 py-1 shrink-0">
                      ${(pattern.price / 100).toFixed(2)}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-muted-foreground">
                  {t('common.by')} <span className="text-foreground font-medium">{pattern.designerName}</span>
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">{pattern.difficulty}</Badge>
                  <Badge variant="outline">{pattern.quiltType}</Badge>
                  {pattern.techniques?.map((tech) => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                </div>

                {pattern.description && (
                  <p className="text-muted-foreground leading-relaxed">{pattern.description}</p>
                )}

                {/* Sizes */}
                {pattern.sizes && pattern.sizes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-semibold flex items-center gap-2 text-sm">
                      <Ruler className="h-4 w-4" />
                      Available Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pattern.sizes.map((size) => (
                        <Badge key={size} variant="secondary">{size}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fabric Requirements */}
                {fabricReqs && Object.keys(fabricReqs).length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-semibold flex items-center gap-2 text-sm">
                      <Scissors className="h-4 w-4" />
                      Fabric Requirements
                    </h3>
                    <div className="grid gap-1">
                      {Object.entries(fabricReqs).map(([fabric, amount]) => (
                        <div key={fabric} className="flex justify-between items-center py-1.5 border-b last:border-0">
                          <span className="capitalize text-sm">{fabric}</span>
                          <span className="text-muted-foreground text-sm">{amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pattern.isFree || !pattern.price || pattern.price === 0 ? (
                    pattern.downloadUrl ? (
                      <Button className="w-full gap-2" asChild>
                        <a href={pattern.downloadUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          Download Free Pattern
                        </a>
                      </Button>
                    ) : (
                      <Button className="w-full gap-2" variant="secondary" disabled>
                        <Download className="h-4 w-4" />
                        Free Pattern
                      </Button>
                    )
                  ) : (
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => buyPattern.mutate()}
                      disabled={buyPattern.isPending}
                      data-testid="button-buy-pattern"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {buyPattern.isPending ? "Processing..." : `Buy Pattern - $${(pattern.price / 100).toFixed(2)}`}
                    </Button>
                  )}
                  
                  {isAuthenticated ? (
                    <>
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
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => addToQueue.mutate()}
                        disabled={addToQueue.isPending}
                        data-testid="button-add-queue"
                      >
                        <ListPlus className="h-4 w-4" />
                        Add to Queue
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => addToLibrary.mutate()}
                        disabled={addToLibrary.isPending}
                        data-testid="button-add-library"
                      >
                        <BookmarkPlus className="h-4 w-4" />
                        Add to Library
                      </Button>
                      <Separator />
                      <Button variant="secondary" className="w-full gap-2" asChild>
                        <Link href={`/notebook/projects/new?patternId=${pattern.id}`}>
                          <BookOpen className="h-4 w-4" />
                          Start a Project
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/login">{t('common.signIn')}</a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold">{pattern.favoriteCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold">{pattern.projectCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Projects</p>
                  </div>
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
