import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { Grid3X3, Plus, Heart, BookOpen, ArrowRight, FolderOpen, Library, Users, Mail } from "lucide-react";
import type { Pattern, Project } from "@shared/schema";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/seo";

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function PatternCard({ pattern }: { pattern: Pattern }) {
  return (
    <Link href={`/patterns/${pattern.id}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-pattern-${pattern.id}`}>
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/10 flex items-center justify-center relative">
            {pattern.imageUrl ? (
              <img src={pattern.imageUrl} alt={pattern.name} className="w-full h-full object-cover" />
            ) : (
              <Grid3X3 className="h-12 w-12 text-rose-300" />
            )}
            {pattern.isFree && (
              <Badge className="absolute top-2 right-2" variant="secondary">Free</Badge>
            )}
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {pattern.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              by {pattern.designerName}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{capitalize(pattern.difficulty)}</Badge>
              <Badge variant="outline" className="text-xs">{capitalize(pattern.quiltType)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-project-${project.id}`}>
        <CardContent className="p-0">
          <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10 flex items-center justify-center">
            {project.photos && project.photos[0] ? (
              <img src={project.photos[0]} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="h-12 w-12 text-teal-300" />
            )}
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              by {project.userName || "Anonymous"}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs capitalize">{project.status?.replace("_", " ")}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Heart className="h-3 w-3" />
                <span>{project.likeCount || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function SectionSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-square" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const { data: patterns, isLoading: patternsLoading } = useQuery<Pattern[]>({
    queryKey: ["/api/patterns", i18n.language],
    queryFn: async () => {
      const res = await fetch(`/api/patterns?sort=newest&language=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to fetch patterns");
      return res.json();
    },
  });

  const { data: userProjects } = useQuery<Project[]>({
    queryKey: ["/api/notebook/projects"],
    queryFn: async () => {
      const res = await fetch("/api/notebook/projects");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: library } = useQuery<any[]>({
    queryKey: ["/api/library"],
    queryFn: async () => {
      const res = await fetch("/api/library");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: favorites } = useQuery<any[]>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Placeholder counts for friends and messages - would connect to real endpoints
  const pendingFriendRequests = 0;
  const unreadMessages = 0;

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects?sort=recent");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Home" description="Your personalized quilting dashboard. Track projects, browse patterns, and connect with the quilting community." path="/home" noindex />
      <Header />
      
      <main className="flex-1">
        {/* Welcome Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="font-serif text-3xl md:text-4xl font-semibold">
                  {t('home.welcomeBack', { name: user?.firstName || t('home.welcomeDefault') })}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {t('home.whatWillYouCreate')}
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild data-testid="button-new-project">
                  <Link href="/notebook/projects/new">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('home.newProject')}
                  </Link>
                </Button>
                <Button variant="outline" asChild data-testid="button-browse-patterns">
                  <Link href="/patterns">
                    {t('home.browsePatterns')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link href="/notebook/projects">
                <Card className="hover-elevate cursor-pointer" data-testid="stat-projects">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{userProjects?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">{t('home.projects')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/notebook/library">
                <Card className="hover-elevate cursor-pointer" data-testid="stat-library">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Library className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{library?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">{t('home.patternsInLibrary')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/notebook/favorites">
                <Card className="hover-elevate cursor-pointer" data-testid="stat-favorites">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{favorites?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">{t('home.favorites')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/community/friends">
                <Card className="hover-elevate cursor-pointer" data-testid="stat-friends">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center relative">
                      <Users className="h-5 w-5 text-teal-500" />
                      {pendingFriendRequests > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                          {pendingFriendRequests}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">0</p>
                      <p className="text-sm text-muted-foreground">{t('home.friends')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/community/messages">
                <Card className="hover-elevate cursor-pointer" data-testid="stat-messages">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center relative">
                      <Mail className="h-5 w-5 text-amber-500" />
                      {unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                          {unreadMessages}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">0</p>
                      <p className="text-sm text-muted-foreground">{t('home.messages')}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Newest Patterns */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-semibold">{t('home.newestPatterns')}</h2>
                <p className="text-muted-foreground">{t('home.freshDesigns')}</p>
              </div>
              <Button variant="ghost" asChild className="gap-2" data-testid="link-all-patterns">
                <Link href="/patterns">
                  {t('common.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {patternsLoading ? (
              <SectionSkeleton />
            ) : patterns && patterns.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {patterns.slice(0, 5).map((pattern) => (
                  <PatternCard key={pattern.id} pattern={pattern} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Grid3X3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-medium mb-2">{t('home.noPatternsYet')}</h3>
                <p className="text-muted-foreground text-sm">{t('home.patternsWillAppear')}</p>
              </Card>
            )}
          </div>
        </section>

        {/* Recent Projects */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-semibold">{t('home.recentProjects')}</h2>
                <p className="text-muted-foreground">{t('home.seeWhatCommunity')}</p>
              </div>
              <Button variant="ghost" asChild className="gap-2" data-testid="link-all-projects">
                <Link href="/projects">
                  {t('common.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {projectsLoading ? (
              <SectionSkeleton />
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {projects.slice(0, 5).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-medium mb-2">{t('home.noProjectsYet')}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t('home.beFirstToShare')}</p>
                <Button asChild>
                  <Link href="/notebook/projects/new">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('home.startProject')}
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
