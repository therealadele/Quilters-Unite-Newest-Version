import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Shield, Users, AlertTriangle, ThumbsUp } from "lucide-react";
import { SEO } from "@/components/seo";

export default function CommunityGuidelinesPage() {
  const { t } = useTranslation();

  const guidelines = [
    {
      title: t('guidelines.beRespectful'),
      icon: Heart,
      content: t('guidelines.beRespectfulDesc'),
    },
    {
      title: t('guidelines.keepConstructive'),
      icon: ThumbsUp,
      content: t('guidelines.keepConstructiveDesc'),
    },
    {
      title: t('guidelines.shareAuthentically'),
      icon: MessageCircle,
      content: t('guidelines.shareAuthenticDesc'),
    },
    {
      title: t('guidelines.beInclusive'),
      icon: Users,
      content: t('guidelines.beInclusiveDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Community Guidelines" description="Our community guidelines for respectful and constructive participation on Quilters Unite." path="/community-guidelines" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2" data-testid="heading-community-guidelines">
              {t('guidelines.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('guidelines.description')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {guidelines.map((guideline) => (
              <Card key={guideline.title} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <guideline.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{guideline.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {guideline.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">{t('guidelines.contactUs')}</h3>
              <p className="text-muted-foreground text-sm">
                <a href="mailto:hello@quiltersunite.com" className="text-primary hover:underline">
                  {t('guidelines.contactLink')}
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
