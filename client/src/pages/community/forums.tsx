import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  ArrowLeft, 
  Search, 
  Palette, 
  HelpCircle, 
  Grid3X3, 
  Lightbulb, 
  Camera, 
  Settings, 
  Package, 
  Trophy, 
  Wrench, 
  BookOpen,
  Heart
} from "lucide-react";
import { SEO } from "@/components/seo";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  threadCount: number;
  postCount: number;
}

const forumCategories: ForumCategory[] = [
  {
    id: "general-chat",
    name: "General Quilting Chat",
    description: "Discuss anything quilting-related, from daily inspiration to casual chit-chat.",
    icon: MessageCircle,
    threadCount: 245,
    postCount: 1892
  },
  {
    id: "fabric-selection",
    name: "Fabric Selection",
    description: "Share tips on choosing fabrics, organizing your stash, and where to buy.",
    icon: Palette,
    threadCount: 156,
    postCount: 1245
  },
  {
    id: "beginner-quilting",
    name: "Beginner Quilting",
    description: "Help new quilters with basics like tools, first projects, and easy patterns.",
    icon: HelpCircle,
    threadCount: 312,
    postCount: 2156
  },
  {
    id: "block-patterns",
    name: "Block Patterns",
    description: "Post and swap quilt block ideas, tutorials, and designs.",
    icon: Grid3X3,
    threadCount: 189,
    postCount: 1567
  },
  {
    id: "techniques-tips",
    name: "Techniques & Tips",
    description: "Debate hand vs. machine quilting, appliqué, or free-motion tips.",
    icon: Lightbulb,
    threadCount: 278,
    postCount: 2034
  },
  {
    id: "show-tell",
    name: "Show & Tell",
    description: "Members share finished quilts with photos for feedback.",
    icon: Camera,
    threadCount: 423,
    postCount: 3567
  },
  {
    id: "machine-talk",
    name: "Machine Talk",
    description: "Advice on sewing machines, longarms, frames, and maintenance.",
    icon: Settings,
    threadCount: 134,
    postCount: 987
  },
  {
    id: "batting-supplies",
    name: "Batting and Supplies",
    description: "Compare batting types, threads, and stabilizers.",
    icon: Package,
    threadCount: 98,
    postCount: 756
  },
  {
    id: "quilting-challenges",
    name: "Quilting Challenges",
    description: "Host BOMs, swaps, or monthly themes.",
    icon: Trophy,
    threadCount: 67,
    postCount: 1234
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    description: "Fix issues like tension problems, puckering, or marking removal.",
    icon: Wrench,
    threadCount: 189,
    postCount: 1456
  },
  {
    id: "quilt-history",
    name: "Quilt History and Inspiration",
    description: "Explore vintage quilts, designers, or trends.",
    icon: BookOpen,
    threadCount: 78,
    postCount: 567
  },
  {
    id: "fabric-notion-advice",
    name: "Notion Advice",
    description: "Favorite quilting notions and reviews. Seek advice about certain notions to use (and not use).",
    icon: Heart,
    threadCount: 145,
    postCount: 1123
  }
];

export default function ForumsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredForums = forumCategories.filter(forum => {
    return searchQuery === "" || 
      forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Forums" description="Discuss quilting techniques, share tips, and get help from experienced quilters in our community forums." path="/community/forums" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold" data-testid="heading-forums">{t('forums.title')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('forums.description')}
              </p>
            </div>
            <Link href="/community">
              <Button data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('forums.searchPlaceholder')}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-forums"
              />
            </div>
          </div>

          {filteredForums.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredForums.map((forum) => {
                const IconComponent = forum.icon;
                return (
                  <Card 
                    key={forum.id} 
                    className="hover-elevate transition-all"
                    data-testid={`card-forum-${forum.id}`}
                  >
                    <Link href={`/community/forums/${forum.id}`}>
                      <CardHeader className="flex flex-row items-start gap-4 pb-2">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-1 line-clamp-1">{forum.name}</CardTitle>
                          <CardDescription className="line-clamp-2 text-sm">{forum.description}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pl-20">
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{forum.threadCount} {t('forums.threads')}</span>
                          <span>{forum.postCount} {t('forums.posts')}</span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('forums.noForumsMatch')}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  {t('common.clearFilters')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
