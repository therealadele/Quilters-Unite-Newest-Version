import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Search, Filter, Heart, MessageCircle, Plus, Users } from "lucide-react";
import { ProjectCard, ProjectSkeleton } from "@/components/projects/project-card";
import type { Project } from "@shared/schema";
import { SEO } from "@/components/seo";

const statusOptions = ["All", "Planned", "In Progress", "Finished"];

const viewOptions = ["All", "Friends"];
const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "liked", label: "Most Liked" },
  { value: "commented", label: "Most Commented" },
];

const userGroups = [
  { id: "all", name: "All Groups" },
  { id: "1", name: "Modern Quilters" },
  { id: "2", name: "Traditional Patterns" },
  { id: "3", name: "Scrap Busters" },
];

export default function ProjectsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [viewFilter, setViewFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const filteredProjects = projects?.filter((project) => {
    if (!project.isPublic) return false;
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (status !== "All") {
      const projectStatus = project.status?.replace("_", " ").toLowerCase();
      if (projectStatus !== status.toLowerCase()) {
        return false;
      }
    }
    // viewFilter and groupFilter would filter based on friends/groups when implemented
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Community Projects" description="See what quilters are making! Browse finished quilts, works in progress, and get inspired by the community." path="/projects" />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-50 via-background to-primary/5 dark:from-teal-900/10 dark:via-background py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="max-w-2xl">
                <h1 className="font-serif text-4xl font-semibold mb-4">Projects</h1>
                <p className="text-muted-foreground text-lg">
                  Get inspired by quilting projects from the community. 
                  See what others are making and share your own creations.
                </p>
              </div>
              {isAuthenticated && (
                <Button asChild data-testid="button-new-project">
                  <Link href="/notebook/projects/new">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('home.newProject')}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b bg-card sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search with Group dropdown */}
              <div className="flex flex-1 max-w-xl gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-projects"
                  />
                </div>
                {isAuthenticated && (
                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger className="w-[180px]" data-testid="select-group">
                      <Users className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {userGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {/* View Filter: All / Friends */}
                {isAuthenticated && (
                  <Select value={viewFilter} onValueChange={setViewFilter}>
                    <SelectTrigger className="w-[120px]" data-testid="select-view">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      {viewOptions.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Status */}
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[140px]" data-testid="select-status">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ProjectSkeleton key={i} />
                ))}
              </div>
            ) : filteredProjects && filteredProjects.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-xl mb-2">{t('common.noResults')}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || status !== "All"
                    ? t('common.tryAdjusting')
                    : t('home.beFirstToShare')}
                </p>
                {isAuthenticated ? (
                  <Button asChild>
                    <Link href="/notebook/projects/new">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('home.startProject')}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <a href="/login">{t('common.signIn')}</a>
                  </Button>
                )}
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
