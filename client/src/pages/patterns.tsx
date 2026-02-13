import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Grid3X3, Search, Filter, Heart, BookmarkPlus, Plus } from "lucide-react";
import type { Pattern } from "@shared/schema";
import { SEO } from "@/components/seo";

function PatternCard({ pattern }: { pattern: Pattern }) {
  const { t } = useTranslation();
  return (
    <Link href={`/patterns/${pattern.id}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-pattern-${pattern.id}`}>
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/10 flex items-center justify-center relative">
            {pattern.imageUrl ? (
              <img src={pattern.imageUrl} alt={pattern.name} className="w-full h-full object-cover" />
            ) : (
              <Grid3X3 className="h-16 w-16 text-rose-300" />
            )}
            {pattern.isFree && (
              <Badge className="absolute top-3 right-3" variant="secondary">{t('common.free')}</Badge>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {pattern.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('common.by')} {pattern.designerName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs capitalize">{pattern.difficulty}</Badge>
              <Badge variant="outline" className="text-xs">{pattern.quiltType}</Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {pattern.favoriteCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  {pattern.projectCount || 0}
                </span>
              </div>
              {!pattern.isFree && pattern.price && (
                <span className="font-medium text-primary">
                  ${(pattern.price / 100).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function PatternSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="aspect-square" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PatternsPage() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [quiltType, setQuiltType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const difficulties = [
    { value: "All", label: t('common.all') },
    { value: "Beginner", label: t('patterns.beginner') },
    { value: "Intermediate", label: t('patterns.intermediate') },
    { value: "Advanced", label: t('patterns.advanced') },
  ];

  const quiltTypes = [
    { value: "All", label: t('common.all') },
    { value: "Bed Quilt", label: t('patterns.bedQuilt') },
    { value: "Wall Quilt", label: t('patterns.wallQuilt') },
    { value: "Table Runner", label: t('patterns.tableRunner') },
    { value: "Baby Quilt", label: t('patterns.babyQuilt') },
    { value: "Throw", label: t('patterns.throw') },
  ];

  const sortOptions = [
    { value: "newest", label: t('patterns.newest') },
    { value: "popular", label: t('patterns.mostPopular') },
    { value: "projects", label: t('patterns.mostProjects') },
  ];

  const { data: patterns, isLoading } = useQuery<Pattern[]>({
    queryKey: ["/api/patterns", i18n.language],
    queryFn: async () => {
      const res = await fetch(`/api/patterns?language=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to fetch patterns");
      return res.json();
    },
  });

  const filteredPatterns = patterns?.filter((pattern) => {
    if (searchQuery && !pattern.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (difficulty !== "All" && pattern.difficulty?.toLowerCase() !== difficulty.toLowerCase()) {
      return false;
    }
    if (quiltType !== "All" && pattern.quiltType !== quiltType) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Quilt Patterns" description="Browse hundreds of quilt patterns from traditional to modern designs. Filter by difficulty, style, and technique to find your next project." path="/patterns" />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl font-semibold mb-4">{t('patterns.title')}</h1>
              <p className="text-muted-foreground text-lg">
                {t('patterns.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b bg-card sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('patterns.searchPlaceholder')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-patterns"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Difficulty */}
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-[140px]" data-testid="select-difficulty">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t('patterns.difficulty')} />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Quilt Type */}
                <Select value={quiltType} onValueChange={setQuiltType}>
                  <SelectTrigger className="w-[160px]" data-testid="select-quilt-type">
                    <SelectValue placeholder={t('patterns.quiltType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {quiltTypes.map((qt) => (
                      <SelectItem key={qt.value} value={qt.value}>{qt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]" data-testid="select-sort">
                    <SelectValue placeholder={t('common.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* List a Pattern */}
                <Link href="/patterns/new">
                  <Button data-testid="button-list-pattern">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('patterns.listPattern')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PatternSkeleton key={i} />
                ))}
              </div>
            ) : filteredPatterns && filteredPatterns.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  {t('patterns.found', { count: filteredPatterns.length })}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredPatterns.map((pattern) => (
                    <PatternCard key={pattern.id} pattern={pattern} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Grid3X3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-xl mb-2">{t('patterns.noPatterns')}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || difficulty !== "All" || quiltType !== "All"
                    ? t('common.tryAdjusting')
                    : t('patterns.willAppear')}
                </p>
                {(searchQuery || difficulty !== "All" || quiltType !== "All") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setDifficulty("All");
                      setQuiltType("All");
                    }}
                    data-testid="button-clear-filters"
                  >
                    {t('common.clearFilters')}
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
