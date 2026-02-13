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
import type { Block } from "@shared/schema";
import { SEO } from "@/components/seo";

function BlockCard({ block }: { block: Block }) {
  const { t } = useTranslation();
  return (
    <Link href={`/blocks/${block.id}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-block-${block.id}`}>
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10 flex items-center justify-center relative">
            {block.imageUrl ? (
              <img src={block.imageUrl} alt={block.name} className="w-full h-full object-cover" />
            ) : (
              <Grid3X3 className="h-16 w-16 text-teal-300" />
            )}
            {block.isFree && (
              <Badge className="absolute top-3 right-3" variant="secondary">{t('common.free')}</Badge>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {block.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('common.by')} {block.designerName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs capitalize">{block.difficulty}</Badge>
              <Badge variant="outline" className="text-xs">{block.blockType}</Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {block.favoriteCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  {block.projectCount || 0}
                </span>
              </div>
              {!block.isFree && block.price && (
                <span className="font-medium text-primary">
                  ${(block.price / 100).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function BlockSkeleton() {
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

export default function BlocksPage() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [blockType, setBlockType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const difficulties = [
    { value: "All", label: t('common.all') },
    { value: "Beginner", label: t('patterns.beginner') },
    { value: "Intermediate", label: t('patterns.intermediate') },
    { value: "Advanced", label: t('patterns.advanced') },
  ];

  const blockTypes = [
    { value: "All", label: t('common.all') },
    { value: "Traditional", label: t('blocks.traditional') },
    { value: "Modern", label: t('blocks.modern') },
    { value: "Foundation", label: t('blocks.foundation') },
    { value: "Paper Pieced", label: t('blocks.paperPieced') },
    { value: "Appliqué", label: t('blocks.applique') },
  ];

  const sortOptions = [
    { value: "newest", label: t('patterns.newest') },
    { value: "popular", label: t('patterns.mostPopular') },
    { value: "projects", label: t('patterns.mostProjects') },
  ];

  const { data: blocks, isLoading } = useQuery<Block[]>({
    queryKey: ["/api/blocks", i18n.language],
    queryFn: async () => {
      const res = await fetch(`/api/blocks?language=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to fetch blocks");
      return res.json();
    },
  });

  const filteredBlocks = blocks?.filter((block) => {
    if (searchQuery && !block.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (difficulty !== "All" && block.difficulty?.toLowerCase() !== difficulty.toLowerCase()) {
      return false;
    }
    if (blockType !== "All" && block.blockType !== blockType) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Quilt Blocks" description="Explore a library of quilt block patterns from classic Log Cabin to modern designs. Learn techniques and find inspiration." path="/blocks" />
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-accent/5 via-background to-primary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl font-semibold mb-4">{t('blocks.title')}</h1>
              <p className="text-muted-foreground text-lg">
                {t('blocks.description')}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b bg-card sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('blocks.searchPlaceholder')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-blocks"
                />
              </div>

              <div className="flex flex-wrap gap-3">
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

                <Select value={blockType} onValueChange={setBlockType}>
                  <SelectTrigger className="w-[160px]" data-testid="select-block-type">
                    <SelectValue placeholder={t('blocks.blockType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {blockTypes.map((bt) => (
                      <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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

                <Link href="/blocks/new">
                  <Button data-testid="button-list-block">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('blocks.listBlock')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <BlockSkeleton key={i} />
                ))}
              </div>
            ) : filteredBlocks && filteredBlocks.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  {t('blocks.found', { count: filteredBlocks.length })}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredBlocks.map((block) => (
                    <BlockCard key={block.id} block={block} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Grid3X3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-xl mb-2">{t('blocks.noBlocks')}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || difficulty !== "All" || blockType !== "All"
                    ? t('common.tryAdjusting')
                    : t('blocks.willAppear')}
                </p>
                {(searchQuery || difficulty !== "All" || blockType !== "All") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setDifficulty("All");
                      setBlockType("All");
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
