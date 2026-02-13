import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Grid3X3, ArrowLeft, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/seo";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noindex />
      <Card className="max-w-md w-full">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
            <Grid3X3 className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="font-serif text-4xl font-semibold mb-3">404</h1>
          <h2 className="text-xl font-medium mb-2">{t('notFound.title')}</h2>
          <p className="text-muted-foreground mb-8">
            {t('notFound.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild data-testid="button-go-home">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                {t('notFound.goHome')}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} data-testid="button-go-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
