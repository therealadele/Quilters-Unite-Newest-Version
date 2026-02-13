import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Plus, Trash2, Save, Globe, Lock, Palette } from "lucide-react";
import type { UserProfile } from "@shared/schema";
import { SEO } from "@/components/seo";

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "GR", name: "Greece" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
  { code: "VN", name: "Vietnam" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "IL", name: "Israel" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "TR", name: "Turkey" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
].sort((a, b) => a.name.localeCompare(b.name));

const REGIONS: Record<string, { code: string; name: string }[]> = {
  US: [
    { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" },
  ],
  CA: [
    { code: "AB", name: "Alberta" }, { code: "BC", name: "British Columbia" }, { code: "MB", name: "Manitoba" },
    { code: "NB", name: "New Brunswick" }, { code: "NL", name: "Newfoundland and Labrador" },
    { code: "NS", name: "Nova Scotia" }, { code: "NT", name: "Northwest Territories" },
    { code: "NU", name: "Nunavut" }, { code: "ON", name: "Ontario" }, { code: "PE", name: "Prince Edward Island" },
    { code: "QC", name: "Quebec" }, { code: "SK", name: "Saskatchewan" }, { code: "YT", name: "Yukon" },
  ],
  AU: [
    { code: "NSW", name: "New South Wales" }, { code: "VIC", name: "Victoria" }, { code: "QLD", name: "Queensland" },
    { code: "WA", name: "Western Australia" }, { code: "SA", name: "South Australia" }, { code: "TAS", name: "Tasmania" },
    { code: "ACT", name: "Australian Capital Territory" }, { code: "NT", name: "Northern Territory" },
  ],
  GB: [
    { code: "ENG", name: "England" }, { code: "SCT", name: "Scotland" }, { code: "WLS", name: "Wales" },
    { code: "NIR", name: "Northern Ireland" },
  ],
};

const SOCIAL_SITES = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "pinterest", label: "Pinterest" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "threads", label: "Threads" },
  { value: "etsy", label: "Etsy" },
  { value: "spoonflower", label: "Spoonflower" },
  { value: "flickr", label: "Flickr" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "bluesky", label: "Bluesky" },
  { value: "mastodon", label: "Mastodon" },
  { value: "other", label: "Other" },
];

interface SocialLink {
  site: string;
  handle: string;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    displayName: "",
    website: "",
    measurementUnit: "yards",
    showOnline: true,
    acceptMessages: true,
    isPublic: true,
    firstName: "",
    pronouns: "",
    birthdayMonth: "",
    birthdayDay: "",
    country: "",
    provinceState: "",
    city: "",
    yearsQuilting: "",
    favoriteQuiltingForm: "",
    favoriteDesigner: "",
    kidsPets: "",
    favoriteColors: "",
    quiltingExperience: "",
    bio: "",
    customField1Label: "",
    customField1Value: "",
    customField2Label: "",
    customField2Value: "",
    customField3Label: "",
    customField3Value: "",
    aboutMe: "",
    designerBackground: "",
    designerInspiration: "",
    designerShopUrl: "",
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [patternLinks, setPatternLinks] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || "",
        nickname: profile.nickname || "",
        displayName: profile.displayName || "",
        website: profile.website || "",
        measurementUnit: profile.measurementUnit || "yards",
        showOnline: profile.showOnline ?? true,
        acceptMessages: profile.acceptMessages ?? true,
        isPublic: profile.isPublic ?? true,
        firstName: profile.firstName || "",
        pronouns: profile.pronouns || "",
        birthdayMonth: profile.birthdayMonth?.toString() || "",
        birthdayDay: profile.birthdayDay?.toString() || "",
        country: profile.country || "",
        provinceState: profile.provinceState || "",
        city: profile.city || "",
        yearsQuilting: profile.yearsQuilting || "",
        favoriteQuiltingForm: profile.favoriteQuiltingForm || "",
        favoriteDesigner: profile.favoriteDesigner || "",
        kidsPets: profile.kidsPets || "",
        favoriteColors: profile.favoriteColors || "",
        quiltingExperience: profile.quiltingExperience || "",
        bio: profile.bio || "",
        customField1Label: profile.customField1Label || "",
        customField1Value: profile.customField1Value || "",
        customField2Label: profile.customField2Label || "",
        customField2Value: profile.customField2Value || "",
        customField3Label: profile.customField3Label || "",
        customField3Value: profile.customField3Value || "",
        aboutMe: profile.aboutMe || "",
        designerBackground: (profile as any).designerBackground || "",
        designerInspiration: (profile as any).designerInspiration || "",
        designerShopUrl: (profile as any).designerShopUrl || "",
      });
      setSocialLinks((profile.socialLinks as SocialLink[]) || []);
      setPatternLinks(((profile as any).designerPatternLinks as { name: string; url: string }[]) || []);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      birthdayMonth: formData.birthdayMonth ? parseInt(formData.birthdayMonth) : null,
      birthdayDay: formData.birthdayDay ? parseInt(formData.birthdayDay) : null,
      socialLinks: socialLinks.filter(link => link.site && link.handle),
      designerPatternLinks: patternLinks.filter(link => link.name && link.url),
    };

    updateMutation.mutate(data);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "country") {
      setFormData(prev => ({ ...prev, provinceState: "" }));
    }
  };

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, { site: "", handle: "" }]);
  };

  const updateSocialLink = (index: number, field: "site" | "handle", value: string) => {
    setSocialLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  const regions = formData.country ? REGIONS[formData.country] : null;

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SEO title="Profile" description="Manage your Quilters Unite profile." path="/profile" noindex />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to view and edit your profile.
              </p>
              <Button asChild data-testid="button-signin-profile">
                <a href="/login">{t('common.signIn')}</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold">{t('profile.title')}</h1>
          </div>

          {profileLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.basicInfo')}</CardTitle>
                  <CardDescription>Your public profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your@email.com"
                        data-testid="input-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name / Nickname</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => handleChange("displayName", e.target.value)}
                        placeholder="Name shown on your profile"
                        data-testid="input-displayname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="Your first name"
                        data-testid="input-firstname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pronouns">My Pronouns Are</Label>
                      <Input
                        id="pronouns"
                        value={formData.pronouns}
                        onChange={(e) => handleChange("pronouns", e.target.value)}
                        placeholder="e.g., she/her, he/him, they/them"
                        data-testid="input-pronouns"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website or Blog</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://yourblog.com"
                      data-testid="input-website"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Birthday</Label>
                    <div className="flex gap-3">
                      <Select
                        value={formData.birthdayMonth}
                        onValueChange={(value) => handleChange("birthdayMonth", value)}
                      >
                        <SelectTrigger className="w-[180px]" data-testid="select-birthday-month">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={formData.birthdayDay}
                        onValueChange={(value) => handleChange("birthdayDay", value)}
                      >
                        <SelectTrigger className="w-[120px]" data-testid="select-birthday-day">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>Where are you located?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleChange("country", value)}
                      >
                        <SelectTrigger data-testid="select-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provinceState">Province/State/Region</Label>
                      {regions ? (
                        <Select
                          value={formData.provinceState}
                          onValueChange={(value) => handleChange("provinceState", value)}
                        >
                          <SelectTrigger data-testid="select-region">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region.code} value={region.code}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="provinceState"
                          value={formData.provinceState}
                          onChange={(e) => handleChange("provinceState", e.target.value)}
                          placeholder="Your province/state/region"
                          data-testid="input-region"
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Town</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="Your city or town"
                      data-testid="input-city"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.quiltingInfo')}</CardTitle>
                  <CardDescription>Tell us about your quilting journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsQuilting">Years Quilting</Label>
                      <Input
                        id="yearsQuilting"
                        value={formData.yearsQuilting}
                        onChange={(e) => handleChange("yearsQuilting", e.target.value)}
                        placeholder="e.g., 5 years"
                        data-testid="input-years-quilting"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="favoriteQuiltingForm">Favorite Form of Quilting</Label>
                      <Input
                        id="favoriteQuiltingForm"
                        value={formData.favoriteQuiltingForm}
                        onChange={(e) => handleChange("favoriteQuiltingForm", e.target.value)}
                        placeholder="e.g., Modern, Traditional, Art Quilts"
                        data-testid="input-favorite-form"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favoriteDesigner">Favorite Designer</Label>
                    <Input
                      id="favoriteDesigner"
                      value={formData.favoriteDesigner}
                      onChange={(e) => handleChange("favoriteDesigner", e.target.value)}
                      placeholder="e.g., Tula Pink, Kaffe Fassett"
                      data-testid="input-favorite-designer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiltingExperience">Quilting Experience Level</Label>
                    <Select
                      value={formData.quiltingExperience}
                      onValueChange={(value) => handleChange("quiltingExperience", value)}
                    >
                      <SelectTrigger data-testid="select-quilting-experience">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Quilting Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Tell us about your quilting journey, favorite techniques, or any other details you'd like to share."
                      className="min-h-[100px]"
                      data-testid="textarea-bio"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>A bit more about you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kidsPets">Kids? Pets?</Label>
                      <Input
                        id="kidsPets"
                        value={formData.kidsPets}
                        onChange={(e) => handleChange("kidsPets", e.target.value)}
                        placeholder="e.g., 2 kids, 1 cat"
                        data-testid="input-kids-pets"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="favoriteColors">Favorite Colors</Label>
                      <Input
                        id="favoriteColors"
                        value={formData.favoriteColors}
                        onChange={(e) => handleChange("favoriteColors", e.target.value)}
                        placeholder="e.g., Jewel tones, Pastels"
                        data-testid="input-favorite-colors"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Other Items</CardTitle>
                  <CardDescription>Custom fields for anything else you'd like to share</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customField1Label">Field Name</Label>
                      <Input
                        id="customField1Label"
                        value={formData.customField1Label}
                        onChange={(e) => handleChange("customField1Label", e.target.value)}
                        placeholder="e.g., Favorite fabric store"
                        data-testid="input-custom1-label"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customField1Value">Value</Label>
                      <Input
                        id="customField1Value"
                        value={formData.customField1Value}
                        onChange={(e) => handleChange("customField1Value", e.target.value)}
                        placeholder="Your answer"
                        data-testid="input-custom1-value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customField2Label">Field Name</Label>
                      <Input
                        id="customField2Label"
                        value={formData.customField2Label}
                        onChange={(e) => handleChange("customField2Label", e.target.value)}
                        placeholder="e.g., Sewing machine brand"
                        data-testid="input-custom2-label"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customField2Value">Value</Label>
                      <Input
                        id="customField2Value"
                        value={formData.customField2Value}
                        onChange={(e) => handleChange("customField2Value", e.target.value)}
                        placeholder="Your answer"
                        data-testid="input-custom2-value"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customField3Label">Field Name</Label>
                      <Input
                        id="customField3Label"
                        value={formData.customField3Label}
                        onChange={(e) => handleChange("customField3Label", e.target.value)}
                        placeholder="e.g., Guild membership"
                        data-testid="input-custom3-label"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customField3Value">Value</Label>
                      <Input
                        id="customField3Value"
                        value={formData.customField3Value}
                        onChange={(e) => handleChange("customField3Value", e.target.value)}
                        placeholder="Your answer"
                        data-testid="input-custom3-value"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Social Sites
                  </CardTitle>
                  <CardDescription>Connect your social media profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Social Site</Label>
                        <Select
                          value={link.site}
                          onValueChange={(value) => updateSocialLink(index, "site", value)}
                        >
                          <SelectTrigger data-testid={`select-social-site-${index}`}>
                            <SelectValue placeholder="Select site" />
                          </SelectTrigger>
                          <SelectContent>
                            {SOCIAL_SITES.map((site) => (
                              <SelectItem key={site.value} value={site.value}>
                                {site.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Handle/Username</Label>
                        <Input
                          value={link.handle}
                          onChange={(e) => updateSocialLink(index, "handle", e.target.value)}
                          placeholder="@yourhandle"
                          data-testid={`input-social-handle-${index}`}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSocialLink(index)}
                        data-testid={`button-remove-social-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSocialLink}
                    className="w-full"
                    data-testid="button-add-social"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Site
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>I Measure Fabric In</Label>
                    <Select
                      value={formData.measurementUnit}
                      onValueChange={(value) => handleChange("measurementUnit", value)}
                    >
                      <SelectTrigger className="w-[250px]" data-testid="select-measurement">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yards">Yards & Inches</SelectItem>
                        <SelectItem value="metric">Metres & Centimeters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {t('profile.privacySettings')}
                  </CardTitle>
                  <CardDescription>Control your privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleChange("isPublic", !!checked)}
                      data-testid="checkbox-is-public"
                    />
                    <Label htmlFor="isPublic" className="cursor-pointer">
                      Make my profile visible to other members
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="showOnline"
                      checked={formData.showOnline}
                      onCheckedChange={(checked) => handleChange("showOnline", !!checked)}
                      data-testid="checkbox-show-online"
                    />
                    <Label htmlFor="showOnline" className="cursor-pointer">
                      Show when I'm online
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="acceptMessages"
                      checked={formData.acceptMessages}
                      onCheckedChange={(checked) => handleChange("acceptMessages", !!checked)}
                      data-testid="checkbox-accept-messages"
                    />
                    <Label htmlFor="acceptMessages" className="cursor-pointer">
                      Accept messages from community members
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                  <CardDescription>Tell the community about yourself</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.aboutMe}
                    onChange={(e) => handleChange("aboutMe", e.target.value)}
                    placeholder="Write a few words about yourself, what inspires you..."
                    className="min-h-[200px]"
                    maxLength={2000}
                    data-testid="textarea-about-me"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.aboutMe.length}/2000 characters
                  </p>
                </CardContent>
              </Card>

              {user?.status === 'designer' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Designer Profile
                    </CardTitle>
                    <CardDescription>Showcase your work as a pattern designer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="designerBackground">Designer Background</Label>
                      <Textarea
                        id="designerBackground"
                        value={formData.designerBackground}
                        onChange={(e) => handleChange("designerBackground", e.target.value)}
                        placeholder="Tell us about your journey as a pattern designer"
                        className="min-h-[100px]"
                        data-testid="textarea-designer-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designerInspiration">Design Inspiration</Label>
                      <Textarea
                        id="designerInspiration"
                        value={formData.designerInspiration}
                        onChange={(e) => handleChange("designerInspiration", e.target.value)}
                        placeholder="What inspires your quilting designs?"
                        className="min-h-[100px]"
                        data-testid="textarea-designer-inspiration"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designerShopUrl">Pattern Shop URL</Label>
                      <Input
                        id="designerShopUrl"
                        type="url"
                        value={formData.designerShopUrl}
                        onChange={(e) => handleChange("designerShopUrl", e.target.value)}
                        placeholder="https://www.etsy.com/shop/yourshop"
                        data-testid="input-designer-shop-url"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pattern Links</Label>
                      {patternLinks.map((link, index) => (
                        <div key={index} className="flex gap-3 items-end">
                          <div className="flex-1 space-y-2">
                            <Label>Pattern Name</Label>
                            <Input
                              value={link.name}
                              onChange={(e) => setPatternLinks(prev => prev.map((l, i) => i === index ? { ...l, name: e.target.value } : l))}
                              placeholder="Pattern name"
                              data-testid={`input-pattern-name-${index}`}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label>URL</Label>
                            <Input
                              value={link.url}
                              onChange={(e) => setPatternLinks(prev => prev.map((l, i) => i === index ? { ...l, url: e.target.value } : l))}
                              placeholder="https://..."
                              data-testid={`input-pattern-url-${index}`}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setPatternLinks(prev => prev.filter((_, i) => i !== index))}
                            data-testid={`button-remove-pattern-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPatternLinks(prev => [...prev, { name: "", url: "" }])}
                        className="w-full"
                        data-testid="button-add-pattern-link"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Pattern Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-save-profile"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? t('common.loading') : t('profile.saveChanges')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
