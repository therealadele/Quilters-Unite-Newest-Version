import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { Store, Search, Plus, MapPin, Phone, Globe, Clock, Heart, Mail, ExternalLink, Trash2, ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { QuiltShop, ShopFavorite } from "@shared/schema";
import { SEO } from "@/components/seo";

function ShopCard({ shop, isFavorited, onToggleFavorite, onDelete, isOwner, onClick }: { 
  shop: QuiltShop; 
  isFavorited: boolean; 
  onToggleFavorite: () => void; 
  onDelete?: () => void;
  isOwner: boolean;
  onClick: () => void;
}) {
  const { isAuthenticated } = useAuth();
  
  const fullAddress = [shop.address, shop.city, shop.state, shop.postalCode, shop.country].filter(Boolean).join(", ");
  
  return (
    <Card 
      className="hover-elevate h-full cursor-pointer" 
      data-testid={`card-shop-${shop.id}`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-lg line-clamp-2 flex-1">
            {shop.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {isOwner && onDelete && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                data-testid={`button-delete-shop-${shop.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {isAuthenticated && (
              <Button
                size="icon"
                variant="ghost"
                className={`h-8 w-8 ${isFavorited ? 'text-red-500' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                data-testid={`button-favorite-shop-${shop.id}`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>
        </div>
        
        {fullAddress && shop.shopType !== "online" && (
          <p className="text-sm text-muted-foreground line-clamp-2">{fullAddress}</p>
        )}
        
        {shop.phone && (
          <p className="text-sm text-muted-foreground">{shop.phone}</p>
        )}
        
        {shop.website && (
          <p className="text-sm text-primary truncate">{shop.website.replace(/^https?:\/\//, '')}</p>
        )}
      </CardContent>
    </Card>
  );
}

function ShopDetailDialog({ shop, open, onOpenChange, isFavorited, onToggleFavorite }: { 
  shop: QuiltShop | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}) {
  const { isAuthenticated } = useAuth();
  
  if (!shop) return null;
  
  const fullAddress = [shop.address, shop.city, shop.state, shop.postalCode, shop.country].filter(Boolean).join(", ");
  
  const getMapUrl = () => {
    if (shop.googleMapsUrl) {
      return shop.googleMapsUrl;
    }
    if (shop.latitude && shop.longitude) {
      return `https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`;
    }
    if (fullAddress) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    }
    return null;
  };
  
  const getEmbedUrl = () => {
    if (shop.latitude && shop.longitude) {
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${shop.longitude}!3d${shop.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1234567890`;
    }
    if (fullAddress) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(fullAddress)}`;
    }
    return null;
  };
  
  const mapUrl = getMapUrl();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Store className="h-5 w-5 text-teal-600" />
            {shop.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="capitalize">
              {shop.shopType === "both" ? "Online & Physical" : shop.shopType === "online" ? "Online" : "Physical Store"}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {shop.favoriteCount || 0} favorites
            </span>
            {isAuthenticated && (
              <Button
                size="sm"
                variant={isFavorited ? "default" : "outline"}
                onClick={onToggleFavorite}
                data-testid="button-favorite-shop-dialog"
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
            )}
          </div>
          
          {shop.description && (
            <p className="text-muted-foreground">{shop.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Contact Information</h4>
              
              <div className="space-y-3 text-sm">
                {fullAddress && shop.shopType !== "online" && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>{fullAddress}</span>
                  </div>
                )}
                
                {shop.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`tel:${shop.phone}`} className="text-primary hover:underline">{shop.phone}</a>
                  </div>
                )}
                
                {shop.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${shop.email}`} className="text-primary hover:underline">{shop.email}</a>
                  </div>
                )}
                
                {shop.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a 
                      href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {shop.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                
                {shop.hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>{shop.hours}</span>
                  </div>
                )}
              </div>
            </div>
            
            {shop.shopType !== "online" && mapUrl && (
              <div className="space-y-3">
                <h4 className="font-medium">Location</h4>
                <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
                  {shop.latitude && shop.longitude ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${shop.latitude},${shop.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      title="Shop location map"
                    />
                  ) : fullAddress ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      title="Shop location map"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShopSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export default function QuiltShopsPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [shopType, setShopType] = useState("all");
  const [distance, setDistance] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedShop, setSelectedShop] = useState<QuiltShop | null>(null);

  const shopTypeOptions = [
    { value: "all", label: t('shops.allTypes') },
    { value: "physical", label: t('shops.physicalStore') },
    { value: "online", label: t('shops.onlineShop') },
  ];

  const distanceOptions = [
    { value: "all", label: t('shops.anyDistance') },
    { value: "25", label: t('shops.within25') },
    { value: "50", label: t('shops.within50') },
    { value: "100", label: t('shops.within100') },
    { value: "250", label: t('shops.within250') },
  ];

  const { data: shops, isLoading } = useQuery<QuiltShop[]>({
    queryKey: ["/api/shops", { shopType }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (shopType !== "all") params.set("shopType", shopType);
      const res = await fetch(`/api/shops?${params}`);
      if (!res.ok) throw new Error("Failed to fetch shops");
      return res.json();
    },
  });

  const { data: favorites } = useQuery<ShopFavorite[]>({
    queryKey: ["/api/shops/favorites/my"],
    enabled: isAuthenticated,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (shopId: string) => {
      return apiRequest("POST", `/api/shops/${shopId}/favorite`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shops/favorites/my"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (shopId: string) => {
      return apiRequest("DELETE", `/api/shops/${shopId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      setSelectedShop(null);
    },
  });

  const favoriteShopIds = new Set(favorites?.map(f => f.shopId) || []);

  const filteredShops = shops?.filter((shop) => {
    if (searchQuery && !shop.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      const location = [shop.city, shop.state, shop.country].filter(Boolean).join(" ").toLowerCase();
      if (!location.includes(searchQuery.toLowerCase())) {
        return false;
      }
    }
    if (showFavoritesOnly && !favoriteShopIds.has(shop.id)) {
      return false;
    }
    return true;
  });

  const sortedShops = filteredShops?.sort((a, b) => {
    const aFav = favoriteShopIds.has(a.id) ? 1 : 0;
    const bFav = favoriteShopIds.has(b.id) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;
    return (b.favoriteCount || 0) - (a.favoriteCount || 0);
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Quilt Shops" description="Discover local and online quilt shops, fabric stores, and quilting supply retailers." path="/community/shops" />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-50 via-background to-primary/5 dark:from-teal-900/10 dark:via-background py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="max-w-2xl">
                <h1 className="font-serif text-4xl font-semibold mb-4">{t('shops.title')}</h1>
                <p className="text-muted-foreground text-lg">
                  {t('shops.description')}
                </p>
              </div>
              <div className="flex gap-3">
                {isAuthenticated && (
                  <Button asChild data-testid="button-add-shop">
                    <Link href="/community/shops/new">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('shops.addShop')}
                    </Link>
                  </Button>
                )}
                <Link href="/community">
                  <Button data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Community
                  </Button>
                </Link>
              </div>
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
                  placeholder="Search shops by name or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-shops"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Shop Type */}
                <Select value={shopType} onValueChange={setShopType}>
                  <SelectTrigger className="w-[160px]" data-testid="select-shop-type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Distance */}
                <Select value={distance} onValueChange={setDistance}>
                  <SelectTrigger className="w-[160px]" data-testid="select-distance">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Distance" />
                  </SelectTrigger>
                  <SelectContent>
                    {distanceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Favorites Filter */}
                {isAuthenticated && (
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    data-testid="button-filter-favorites"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                    Favorites
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ShopSkeleton key={i} />
                ))}
              </div>
            ) : sortedShops && sortedShops.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  {sortedShops.length} shop{sortedShops.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {sortedShops.map((shop) => (
                    <ShopCard 
                      key={shop.id} 
                      shop={shop} 
                      isFavorited={favoriteShopIds.has(shop.id)}
                      onToggleFavorite={() => favoriteMutation.mutate(shop.id)}
                      onDelete={() => deleteMutation.mutate(shop.id)}
                      isOwner={user?.id === shop.submittedById}
                      onClick={() => setSelectedShop(shop)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Store className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-xl mb-2">{t('shops.noShopsFound')}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || shopType !== "all"
                    ? t('common.tryAdjusting')
                    : t('shops.noShopsDesc')}
                </p>
                {isAuthenticated && (
                  <Button asChild>
                    <Link href="/community/shops/new">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('shops.addShop')}
                    </Link>
                  </Button>
                )}
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
      
      <ShopDetailDialog
        shop={selectedShop}
        open={!!selectedShop}
        onOpenChange={(open) => !open && setSelectedShop(null)}
        isFavorited={selectedShop ? favoriteShopIds.has(selectedShop.id) : false}
        onToggleFavorite={() => selectedShop && favoriteMutation.mutate(selectedShop.id)}
      />
    </div>
  );
}
