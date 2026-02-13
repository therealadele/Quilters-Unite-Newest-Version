import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  UsersRound, 
  Users, 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  Palette, 
  Hexagon, 
  Trophy, 
  Globe, 
  Heart, 
  Scissors, 
  Settings, 
  Hand, 
  Paintbrush, 
  Shirt, 
  Leaf 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Group, GroupMembership } from "@shared/schema";
import { SEO } from "@/components/seo";

interface StarterGroup {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  memberCount: number;
}

const starterGroups: StarterGroup[] = [
  {
    id: "beginners-circle",
    name: "Beginners' Circle",
    description: "New quilters share first projects, ask basic questions, and get mentor matches.",
    icon: Sparkles,
    memberCount: 1245
  },
  {
    id: "modern-quilting-club",
    name: "Modern Quilting Club",
    description: "Focus on minimalist designs, improv piecing, and bold prints.",
    icon: Palette,
    memberCount: 892
  },
  {
    id: "english-paper-piecing",
    name: "English Paper Piecing Lovers",
    description: "Discuss new projects, techniques, and share your EPP journey with fellow enthusiasts.",
    icon: Hexagon,
    memberCount: 567
  },
  {
    id: "quilt-along-central",
    name: "Quilt-Along Central",
    description: "Promote and discuss quilt-a-longs. Join community sew-alongs and share your progress.",
    icon: Trophy,
    memberCount: 1034
  },
  {
    id: "quilting-guilds",
    name: "Quilting Guilds",
    description: "Learn more about quilting guilds around the globe. Connect with local and international groups.",
    icon: Globe,
    memberCount: 423
  },
  {
    id: "applique-enthusiasts",
    name: "Appliqué Enthusiasts",
    description: "Discuss new projects, techniques, and share your appliqué creations with the community.",
    icon: Heart,
    memberCount: 678
  },
  {
    id: "scrappy-quilters",
    name: "Scrappy Quilters",
    description: "Trade stash scraps, swap leaders, and tackle \"use what you have\" projects.",
    icon: Scissors,
    memberCount: 1567
  },
  {
    id: "machine-mastery",
    name: "Machine Mastery",
    description: "Longarm users and free-motion fans exchange setups, tension tweaks, and ruler work.",
    icon: Settings,
    memberCount: 456
  },
  {
    id: "hand-quilters",
    name: "Hand Quilters",
    description: "Lovers of needle-turn appliqué and hand-stitching gather for slow-craft chats and meets.",
    icon: Hand,
    memberCount: 345
  },
  {
    id: "art-quilt-artists",
    name: "Art Quilt Artists",
    description: "Experimental, abstract, and story quilts with critiques, exhibits, and dye techniques.",
    icon: Paintbrush,
    memberCount: 289
  },
  {
    id: "clothes-quilting",
    name: "Clothes Quilting",
    description: "Patterns, sizing tips, and ideas for clothing makers. Create wearable quilted art.",
    icon: Shirt,
    memberCount: 234
  },
  {
    id: "eco-quilters",
    name: "Eco-Quilters",
    description: "Sustainable fabrics, low-waste piecing, and upcycling ideas. Quilt with the planet in mind.",
    icon: Leaf,
    memberCount: 512
  }
];

function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
  );
}

export default function GroupsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: groups, isLoading: groupsLoading } = useQuery<Group[]>({
    queryKey: ["/api/groups", search],
    queryFn: async () => {
      const url = search ? `/api/groups?search=${encodeURIComponent(search)}` : "/api/groups";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch groups");
      return res.json();
    },
  });

  const { data: myGroups, isLoading: myGroupsLoading } = useQuery<GroupMembership[]>({
    queryKey: ["/api/my-groups"],
    queryFn: async () => {
      const res = await fetch("/api/my-groups");
      if (!res.ok) throw new Error("Failed to fetch my groups");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const createGroup = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/groups", {
        name: newGroupName,
        description: newGroupDescription,
        isPublic: true,
      });
    },
    onSuccess: () => {
      toast({ title: "Group created!" });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-groups"] });
      setNewGroupName("");
      setNewGroupDescription("");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to create group", variant: "destructive" });
    },
  });

  const joinGroup = useMutation({
    mutationFn: async (groupId: string) => {
      return apiRequest("POST", `/api/groups/${groupId}/join`, {});
    },
    onSuccess: () => {
      toast({ title: "Joined group!" });
      queryClient.invalidateQueries({ queryKey: ["/api/my-groups"] });
    },
    onError: () => {
      toast({ title: "Failed to join group", variant: "destructive" });
    },
  });

  const myGroupIds = new Set(myGroups?.map(m => m.groupId) || []);

  const filteredStarterGroups = starterGroups.filter(group => {
    return search === "" || 
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.description.toLowerCase().includes(search.toLowerCase());
  });

  const allGroups = [...filteredStarterGroups, ...(groups || []).map(g => ({
    id: g.id,
    name: g.name,
    description: g.description || "",
    icon: UsersRound,
    memberCount: g.memberCount || 0
  }))];

  const displayGroups = search ? allGroups.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  ) : allGroups;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Groups" description="Join quilting groups based on interests, techniques, and styles." path="/community/groups" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold" data-testid="heading-groups">{t('groups.title')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('groups.description')}
              </p>
            </div>
            <div className="flex gap-2">
              {isAuthenticated && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" data-testid="button-create-group">
                      <Plus className="h-4 w-4" />
                      {t('groups.createGroup')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('groups.createNewGroup')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('groups.groupName')}</Label>
                        <Input
                          id="name"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder={t('groups.groupNamePlaceholder')}
                          data-testid="input-group-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">{t('groups.groupDescription')}</Label>
                        <Textarea
                          id="description"
                          value={newGroupDescription}
                          onChange={(e) => setNewGroupDescription(e.target.value)}
                          placeholder={t('groups.groupDescPlaceholder')}
                          rows={4}
                          data-testid="input-group-description"
                        />
                      </div>
                      <Button 
                        onClick={() => createGroup.mutate()} 
                        disabled={!newGroupName.trim() || createGroup.isPending}
                        className="w-full"
                        data-testid="button-submit-group"
                      >
                        {createGroup.isPending ? "Creating..." : t('groups.create')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Link href="/community">
                <Button data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Community
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="discover">
            <TabsList className="mb-6">
              <TabsTrigger value="discover" className="gap-2" data-testid="tab-discover">
                <UsersRound className="h-4 w-4" />
                {t('groups.discover')}
              </TabsTrigger>
              {isAuthenticated && (
                <TabsTrigger value="my-groups" className="gap-2" data-testid="tab-my-groups">
                  <Users className="h-4 w-4" />
                  {t('groups.myGroups')} ({myGroups?.length || 0})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="discover">
              <div className="mb-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search groups..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-testid="input-search-groups"
                  />
                </div>
              </div>

              {filteredStarterGroups.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredStarterGroups.map((group) => {
                    const IconComponent = group.icon;
                    const isMember = myGroupIds.has(group.id);
                    return (
                      <Card 
                        key={group.id} 
                        className="hover-elevate transition-all"
                        data-testid={`card-group-${group.id}`}
                      >
                        <Link href={`/community/groups/${group.id}`}>
                          <CardHeader className="flex flex-row items-start gap-4 pb-2">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg mb-1 line-clamp-1">{group.name}</CardTitle>
                              <CardDescription className="line-clamp-2 text-sm">{group.description}</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 pl-20">
                            <div className="flex items-center justify-between">
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  {group.memberCount} {t('groups.members')}
                                </span>
                              </div>
                              {isAuthenticated && (
                                isMember ? (
                                  <Badge variant="outline">Joined</Badge>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      joinGroup.mutate(group.id);
                                    }}
                                    disabled={joinGroup.isPending}
                                    data-testid="button-join-group"
                                  >
                                    {t('groups.join')}
                                  </Button>
                                )
                              )}
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
                    <UsersRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No groups match your search.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearch("")}
                    >
                      Clear search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="my-groups">
              {myGroupsLoading ? (
                <LoadingSkeleton />
              ) : myGroups && myGroups.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {myGroups.map((membership) => {
                    const group = groups?.find(g => g.id === membership.groupId);
                    const starterGroup = starterGroups.find(g => g.id === membership.groupId);
                    const groupData = group || starterGroup;
                    const IconComponent = starterGroup?.icon || UsersRound;
                    
                    return (
                      <Card key={membership.id} className="hover-elevate" data-testid={`card-my-group-${membership.id}`}>
                        <CardHeader className="flex flex-row items-start gap-4 pb-2">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg mb-1">{groupData?.name || "Group"}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {groupData?.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 pl-20">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{membership.role}</Badge>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              {starterGroup?.memberCount || group?.memberCount || 0} {t('groups.members')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">{t('groups.noGroupsYet')}</p>
                    <Button onClick={() => document.querySelector('[data-testid="tab-discover"]')?.dispatchEvent(new Event('click'))}>
                      {t('groups.discoverGroups')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
