import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, BookOpen, Shield, FileText, Info } from "lucide-react";
import { SEO } from "@/components/seo";

export default function SupportPage() {
  const { t } = useTranslation();

  const supportTiles = [
    {
      title: t('support.gettingStarted'),
      description: t('support.gettingStartedDesc'),
      icon: BookOpen,
      href: "/getting-started",
      color: "primary",
    },
    {
      title: t('support.communityForums'),
      description: t('support.communityForumsDesc'),
      icon: MessageCircle,
      href: "/community/forums",
      color: "accent",
    },
    {
      title: t('support.emailSupport'),
      description: t('support.emailSupportDesc'),
      icon: Mail,
      href: "/contact",
      color: "primary",
    },
    {
      title: t('support.privacyPolicy'),
      description: t('support.privacyPolicyDesc'),
      icon: Shield,
      href: "/privacy-policy",
      color: "accent",
    },
    {
      title: t('support.termsOfService'),
      description: t('support.termsOfServiceDesc'),
      icon: FileText,
      href: "/terms-of-service",
      color: "primary",
    },
    {
      title: "About Us",
      description: "Learn about our mission, values, and the team behind Quilters Unite.",
      icon: Info,
      href: "/about",
      color: "accent",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Support" description="Get help with Quilters Unite. Find guides, FAQs, and contact our support team." path="/support" />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-accent/5 via-background to-primary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl font-semibold mb-4" data-testid="heading-support">
                {t('support.title')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t('support.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Tiles */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {supportTiles.map((tile) => (
                <Link key={tile.title} href={tile.href} className="w-[calc(50%-1rem)] md:w-[calc(25%-1rem)] lg:w-[calc(20%-1rem)] max-w-[245px]">
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
