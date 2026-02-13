import { Link, useLocation } from "wouter";
import { Search, Menu, Heart, BookOpen, Grid3X3, Users, HelpCircle, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Header() {
  const { user, isAuthenticated, logout, hasActiveSubscription } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const navigation = [
    { name: t('nav.patterns'), href: "/patterns", icon: Grid3X3 },
    { name: t('nav.blocks'), href: "/blocks", icon: Grid3X3 },
    { name: t('nav.community'), href: "/community", icon: Users },
    { name: t('nav.support'), href: "/support", icon: HelpCircle },
  ];

  const trialDaysLeft = (() => {
    if (!user || !user.trialEndsAt || user.subscriptionStatus !== "trial") return null;
    const diff = new Date(user.trialEndsAt).getTime() - new Date().getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  const showTrialWarning = isAuthenticated && trialDaysLeft !== null && trialDaysLeft > 0 && trialDaysLeft <= 3;
  const showExpiredBanner = isAuthenticated && !hasActiveSubscription && user?.subscriptionStatus !== "active";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {showExpiredBanner && trialDaysLeft === 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm">
          <Link href="/subscription" className="inline-flex items-center gap-1.5 text-destructive font-medium hover:underline">
            <AlertCircle className="h-3.5 w-3.5" />
            Subscribe to unlock all features
          </Link>
        </div>
      )}
      {showTrialWarning && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-center text-sm">
          <Link href="/subscription" className="inline-flex items-center gap-1.5 text-amber-800 dark:text-amber-200 font-medium hover:underline">
            <AlertCircle className="h-3.5 w-3.5" />
            Trial ends in {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} – Subscribe now
          </Link>
        </div>
      )}
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Grid3X3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">{t('common.appName')}</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"} 
                  className="gap-2"
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('nav.searchPlaceholder')}
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />
          
          {isAuthenticated && user ? (
            <>
              <Link href="/notebook">
                <Button variant="ghost" size="icon" data-testid="button-notebook">
                  <BookOpen className="h-5 w-5" />
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.firstName?.[0] || user.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.firstName && (
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      )}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer flex items-center gap-2" data-testid="menu-profile">
                      <User className="h-4 w-4" />
                      {t('nav.myProfile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notebook" className="w-full cursor-pointer" data-testid="menu-notebook">
                      {t('nav.myNotebook')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notebook/projects" className="w-full cursor-pointer" data-testid="menu-projects">
                      {t('nav.myProjects')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notebook/favorites" className="w-full cursor-pointer" data-testid="menu-favorites">
                      {t('nav.favorites')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="cursor-pointer text-destructive"
                    data-testid="button-logout"
                  >
                    {t('common.logOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild data-testid="button-login">
              <Link href="/login">{t('common.signIn')}</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navigation.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="w-full cursor-pointer">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
