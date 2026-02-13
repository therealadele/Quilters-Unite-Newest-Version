import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MapPin, ArrowLeft } from "lucide-react";
import type { UserProfile } from "@shared/schema";
import { SEO } from "@/components/seo";

function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}

export default function PeoplePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { data: profiles, isLoading } = useQuery<UserProfile[]>({
    queryKey: ["/api/people", search],
    queryFn: async () => {
      const url = search ? `/api/people?search=${encodeURIComponent(search)}` : "/api/people";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch people");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="People" description="Find and connect with quilters from around the world." path="/community/people" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold" data-testid="heading-people">{t('people.title')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('people.description')}
              </p>
            </div>
            <Link href="/community">
              <Button data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>

          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('people.searchPlaceholder')}
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-people"
            />
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : profiles && profiles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <Card key={profile.id} className="hover-elevate" data-testid={`card-person-${profile.id}`}>
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {profile.displayName?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{profile.displayName || "Quilter"}</CardTitle>
                    {profile.location && (
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="text-center">
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{profile.bio}</p>
                    )}
                    {profile.quiltingExperience && (
                      <Badge variant="secondary">{profile.quiltingExperience}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {search ? t('people.noPeopleFound') : "No public profiles yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
