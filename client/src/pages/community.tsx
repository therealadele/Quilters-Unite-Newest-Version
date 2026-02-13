import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, UserPlus, UsersRound, Mail, Calendar, FolderOpen, Store, BookOpen, PenLine } from "lucide-react";
import { SEO } from "@/components/seo";

export default function CommunityPage() {
  const { t } = useTranslation();

  const communityTiles = [
    {
      title: t('community.forums'),
      description: t('community.forumsDesc'),
      icon: MessageCircle,
      href: "/community/forums",
      color: "primary",
    },
    {
      title: t('community.messages'),
      description: t('community.messagesDesc'),
      icon: Mail,
      href: "/community/messages",
      color: "accent",
    },
    {
      title: t('community.people'),
      description: t('community.peopleDesc'),
      icon: Users,
      href: "/community/people",
      color: "primary",
    },
    {
      title: t('community.friends'),
      description: t('community.friendsDesc'),
      icon: UserPlus,
      href: "/community/friends",
      color: "accent",
    },
    {
      title: t('community.groups'),
      description: t('community.groupsDesc'),
      icon: UsersRound,
      href: "/community/groups",
      color: "primary",
    },
    {
      title: t('community.events'),
      description: t('community.eventsDesc'),
      icon: Calendar,
      href: "/community/events",
      color: "accent",
    },
    {
      title: t('community.shops'),
      description: t('community.shopsDesc'),
      icon: Store,
      href: "/community/shops",
      color: "accent",
    },
    {
      title: "Blog",
      description: "Read tips, tutorials, and stories from the quilting community.",
      icon: PenLine,
      href: "/community/blog",
      color: "primary",
    },
    {
      title: "Projects",
      description: "See what others are making and share your own creations.",
      icon: FolderOpen,
      href: "/projects",
      color: "accent",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Community" description="Join the Quilters Unite community. Participate in forums, find groups, connect with fellow quilters, and attend events." path="/community" />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="max-w-2xl">
                <h1 className="font-serif text-4xl font-semibold mb-4" data-testid="heading-community">
                  {t('community.title')}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {t('community.description')}
                </p>
              </div>
              <Button asChild data-testid="button-community-guidelines">
                <Link href="/community-guidelines">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t('support.communityGuidelines')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Tiles */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {communityTiles.map((tile) => (
                <Link key={tile.title} href={tile.href} className="w-[calc(50%-1rem)] md:w-[calc(25%-1rem)] lg:w-[calc(20%-1rem)] max-w-[240px]">
                  <Card className="text-center flex flex-col items-center justify-center aspect-square hover-elevate cursor-pointer p-3" data-testid={`tile-${tile.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader className="pb-1 p-2">
                      <div className={`mx-auto mb-2 h-10 w-10 rounded-full ${tile.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'} flex items-center justify-center`}>
                        <tile.icon className={`h-5 w-5 ${tile.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                      </div>
                      <CardTitle className="text-base font-bold leading-tight">{tile.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                      <CardDescription className="text-sm leading-snug">
                        {tile.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
