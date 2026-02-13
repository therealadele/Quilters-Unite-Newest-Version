import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Store, ArrowLeft, MapPin, Phone, Globe, Clock, Mail, Building } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertQuiltShop } from "@shared/schema";
import { SEO } from "@/components/seo";

const shopTypeOptions = [
  { value: "physical", label: "Physical Store" },
  { value: "online", label: "Online Shop" },
  { value: "both", label: "Both (Physical & Online)" },
];

export default function AddQuiltShopPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    shopType: "physical",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    hours: "",
  });

  const createShopMutation = useMutation({
    mutationFn: async (data: InsertQuiltShop) => {
      return apiRequest("POST", "/api/shops", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      toast({
        title: "Shop Added",
        description: "Thank you for contributing to our shop directory!",
      });
      navigate("/community/shops");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add shop. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.shopType) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a business name and type.",
        variant: "destructive",
      });
      return;
    }

    createShopMutation.mutate({
      ...formData,
      submittedById: user?.id || "",
      submittedByName: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="Add a Quilt Shop" description="Submit a quilt shop to our directory." path="/community/shops/new" noindex />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                You need to be signed in to add a quilt shop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/login">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/community/shops" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-foreground">Add a Quilt Shop</span>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Add a Quilt Shop
              </CardTitle>
              <CardDescription>
                Help fellow quilters find great shops. Share a local store or online retailer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Business Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Quilter's Corner"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      data-testid="input-shop-name"
                    />
                  </div>

                  {/* Shop Type */}
                  <div className="space-y-2">
                    <Label htmlFor="shopType">Shop Type *</Label>
                    <Select 
                      value={formData.shopType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, shopType: value }))}
                    >
                      <SelectTrigger data-testid="select-shop-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {shopTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address Fields */}
                  {formData.shopType !== "online" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Street Address
                        </Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          data-testid="input-shop-address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Portland"
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            data-testid="input-shop-city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            placeholder="Oregon"
                            value={formData.state}
                            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                            data-testid="input-shop-state"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            placeholder="United States"
                            value={formData.country}
                            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                            data-testid="input-shop-country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            placeholder="97201"
                            value={formData.postalCode}
                            onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                            data-testid="input-shop-postal-code"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      data-testid="input-shop-phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@quiltersshop.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      data-testid="input-shop-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      placeholder="www.quiltersshop.com"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      data-testid="input-shop-website"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about this shop..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      data-testid="input-shop-description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hours
                    </Label>
                    <Input
                      id="hours"
                      placeholder="Mon-Sat 10am-6pm, Sun 12pm-5pm"
                      value={formData.hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                      data-testid="input-shop-hours"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/community/shops")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createShopMutation.isPending}
                    className="flex-1"
                    data-testid="button-submit-shop"
                  >
                    {createShopMutation.isPending ? "Adding..." : "Add Shop"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
