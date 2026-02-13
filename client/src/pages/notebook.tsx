import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  Heart,
  ListPlus,
  Library,
  Plus,
  Grid3X3,
  Palette,
  ArrowRight,
  Store,
} from "lucide-react";
import type { Project, Favorite, QueueItem, LibraryItem, ShopFavorite, QuiltShop } from "@shared/schema";
import { SEO } from "@/components/seo";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/notebook/projects/${project.id}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-project-${project.id}`}>
        <CardContent className="p-0">
          <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10 flex items-center justify-center relative">
            {project.photos?.[0] ? (
              <img src={project.photos[0]} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="h-12 w-12 text-teal-300" />
            )}
            <Badge 
              className="absolute top-2 right-2 capitalize"
              variant={project.status === "finished" ? "default" : "secondary"}
            >
              {project.status?.replace("_", " ")}
            </Badge>
          </div>
          <div className="p-3 space-y-1">
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            {project.patternName && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {project.patternName}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface DisplayFavorite {
  id: string;
  itemType: string;
  itemId: string;
  itemName: string | null;
  itemImage: string | null;
}

function FavoriteCard({ favorite }: { favorite: DisplayFavorite }) {
  const { t } = useTranslation();
  const getHref = () => {
    switch (favorite.itemType) {
      case "pattern": return `/patterns/${favorite.itemId}`;
      case "fabric": return `/fabrics/${favorite.itemId}`;
      case "project": return `/projects/${favorite.itemId}`;
      case "shop": return `/community/shops`;
      default: return "#";
    }
  };

  const getIcon = () => {
    switch (favorite.itemType) {
      case "pattern": return <Grid3X3 className="h-10 w-10 text-rose-300" />;
      case "fabric": return <Palette className="h-10 w-10 text-amber-300" />;
      case "project": return <BookOpen className="h-10 w-10 text-teal-300" />;
      case "shop": return <Store className="h-10 w-10 text-teal-300" />;
      default: return <Heart className="h-10 w-10 text-muted-foreground" />;
    }
  };

  const getBgClass = () => {
    switch (favorite.itemType) {
      case "pattern": return "from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/10";
      case "fabric": return "from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10";
      case "project": return "from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10";
      case "shop": return "from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10";
      default: return "from-gray-100 to-gray-50 dark:from-gray-900/20 dark:to-gray-800/10";
    }
  };
  
  const getTypeLabel = () => {
    switch (favorite.itemType) {
      case "shop": return t('notebook.quiltShop');
      default: return favorite.itemType;
    }
  };

  return (
    <Link href={getHref()}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-favorite-${favorite.id}`}>
        <CardContent className="p-0">
          <div className={`aspect-square bg-gradient-to-br ${getBgClass()} flex items-center justify-center`}>
            {favorite.itemImage ? (
              <img src={favorite.itemImage} alt={favorite.itemName || ""} className="w-full h-full object-cover" />
            ) : (
              getIcon()
            )}
          </div>
          <div className="p-3 space-y-1">
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {favorite.itemName || t('common.untitled')}
            </h3>
            <Badge variant="outline" className="capitalize text-xs">
              {getTypeLabel()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function QueueCard({ item }: { item: QueueItem }) {
  const { t } = useTranslation();
  return (
    <Link href={`/patterns/${item.patternId}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-queue-${item.id}`}>
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/20 dark:to-violet-800/10 flex items-center justify-center">
            {item.patternImage ? (
              <img src={item.patternImage} alt={item.patternName || ""} className="w-full h-full object-cover" />
            ) : (
              <ListPlus className="h-10 w-10 text-violet-300" />
            )}
          </div>
          <div className="p-3 space-y-1">
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {item.patternName || t('common.untitledPattern')}
            </h3>
            {item.notes && (
              <p className="text-sm text-muted-foreground line-clamp-1">{item.notes}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function LibraryCard({ item }: { item: LibraryItem }) {
  const { t } = useTranslation();
  return (
    <Link href={`/patterns/${item.patternId}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-library-${item.id}`}>
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10 flex items-center justify-center">
            {item.patternImage ? (
              <img src={item.patternImage} alt={item.patternName || ""} className="w-full h-full object-cover" />
            ) : (
              <Library className="h-10 w-10 text-amber-300" />
            )}
          </div>
          <div className="p-3 space-y-1">
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {item.patternName || t('common.untitledPattern')}
            </h3>
            {item.format && (
              <Badge variant="outline" className="capitalize text-xs">{item.format}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  actionLabel?: string; 
  actionHref?: string;
}) {
  return (
    <Card className="p-8 text-center">
      <Icon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-square" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function NotebookPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [location] = useLocation();

  const getDefaultTab = () => {
    if (location.includes("/projects")) return "projects";
    if (location.includes("/queue")) return "queue";
    if (location.includes("/favorites")) return "favorites";
    if (location.includes("/library")) return "library";
    return "projects";
  };

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/notebook/projects"],
    enabled: isAuthenticated,
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery<Favorite[]>({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });

  const { data: shopFavorites, isLoading: shopFavoritesLoading } = useQuery<ShopFavorite[]>({
    queryKey: ["/api/shops/favorites/my"],
    enabled: isAuthenticated,
  });

  const { data: shops } = useQuery<QuiltShop[]>({
    queryKey: ["/api/shops"],
    enabled: isAuthenticated && !!shopFavorites?.length,
  });

  const { data: queueItems, isLoading: queueLoading } = useQuery<QueueItem[]>({
    queryKey: ["/api/queue"],
    enabled: isAuthenticated,
  });

  const { data: libraryItems, isLoading: libraryLoading } = useQuery<LibraryItem[]>({
    queryKey: ["/api/library"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="My Notebook" description="Your personal quilting notebook. Manage projects, queue, favorites, and pattern library." path="/notebook" noindex />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <LoadingSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">{t('notebook.signInRequired')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('notebook.signInDescription')}
          </p>
          <Button asChild>
            <a href="/login">{t('common.signIn')}</a>
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
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-semibold mb-2">{t('notebook.title')}</h1>
                <p className="text-muted-foreground">
                  {t('notebook.description')}
                </p>
              </div>
              <Button asChild data-testid="button-new-project">
                <Link href="/notebook/projects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('notebook.newProject')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue={getDefaultTab()} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="projects" className="gap-2" data-testid="tab-projects">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('notebook.tabs.projects')}</span>
                </TabsTrigger>
                <TabsTrigger value="queue" className="gap-2" data-testid="tab-queue">
                  <ListPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('notebook.tabs.queue')}</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2" data-testid="tab-favorites">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('notebook.tabs.favorites')}</span>
                </TabsTrigger>
                <TabsTrigger value="library" className="gap-2" data-testid="tab-library">
                  <Library className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('notebook.tabs.library')}</span>
                </TabsTrigger>
              </TabsList>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('notebook.myProjects')}</h2>
                  <span className="text-sm text-muted-foreground">{projects?.length || 0} {t('common.projects')}</span>
                </div>
                
                {projectsLoading ? (
                  <LoadingSkeleton />
                ) : projects && projects.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={BookOpen}
                    title={t('notebook.noProjectsYet')}
                    description={t('notebook.startTracking')}
                    actionLabel={t('notebook.startAProject')}
                    actionHref="/notebook/projects/new"
                  />
                )}
              </TabsContent>

              {/* Queue Tab */}
              <TabsContent value="queue" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('notebook.myQueue')}</h2>
                  <span className="text-sm text-muted-foreground">{queueItems?.length || 0} {t('common.patterns')}</span>
                </div>
                
                {queueLoading ? (
                  <LoadingSkeleton />
                ) : queueItems && queueItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {queueItems.map((item) => (
                      <QueueCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ListPlus}
                    title={t('notebook.queueEmpty')}
                    description={t('notebook.addToQueue')}
                    actionLabel={t('home.browsePatterns')}
                    actionHref="/patterns"
                  />
                )}
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6">
                {(() => {
                  const shopMap = new Map(shops?.map(s => [s.id, s]) || []);
                  const shopFavDisplayItems: DisplayFavorite[] = (shopFavorites || []).map(sf => {
                    const shop = shopMap.get(sf.shopId);
                    return {
                      id: `shop-${sf.id}`,
                      itemType: "shop",
                      itemId: sf.shopId,
                      itemName: shop?.name || t('notebook.quiltShop'),
                      itemImage: shop?.imageUrl || null,
                    };
                  });
                  const regularFavDisplayItems: DisplayFavorite[] = (favorites || []).map(f => ({
                    id: f.id,
                    itemType: f.itemType,
                    itemId: f.itemId,
                    itemName: f.itemName,
                    itemImage: f.itemImage,
                  }));
                  const allFavorites = [...regularFavDisplayItems, ...shopFavDisplayItems];
                  const isLoadingFavorites = favoritesLoading || shopFavoritesLoading;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{t('notebook.myFavorites')}</h2>
                        <span className="text-sm text-muted-foreground">{allFavorites.length} {t('common.items')}</span>
                      </div>
                      
                      {isLoadingFavorites ? (
                        <LoadingSkeleton />
                      ) : allFavorites.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {allFavorites.map((favorite) => (
                            <FavoriteCard key={favorite.id} favorite={favorite} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={Heart}
                          title={t('notebook.noFavoritesYet')}
                          description={t('notebook.saveFavorites')}
                          actionLabel={t('notebook.explore')}
                          actionHref="/patterns"
                        />
                      )}
                    </>
                  );
                })()}
              </TabsContent>

              {/* Library Tab */}
              <TabsContent value="library" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('notebook.myLibrary')}</h2>
                  <span className="text-sm text-muted-foreground">{libraryItems?.length || 0} {t('common.patterns')}</span>
                </div>
                
                {libraryLoading ? (
                  <LoadingSkeleton />
                ) : libraryItems && libraryItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {libraryItems.map((item) => (
                      <LibraryCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Library}
                    title={t('notebook.libraryEmpty')}
                    description={t('notebook.trackPatterns')}
                    actionLabel={t('home.browsePatterns')}
                    actionHref="/patterns"
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
