import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useSearch } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import type { Pattern } from "@shared/schema";
import { SEO } from "@/components/seo";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  patternId: z.string().optional(),
  patternName: z.string().optional(),
  status: z.enum(["planned", "in_progress", "finished"]),
  quiltSize: z.string().optional(),
  notes: z.string().optional(),
  isPublic: z.boolean().default(true),
  photos: z.array(z.string()).default([]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const patternIdFromUrl = params.get("patternId");
  const [photos, setPhotos] = useState<string[]>([]);

  const { data: pattern } = useQuery<Pattern>({
    queryKey: ["/api/patterns", patternIdFromUrl],
    enabled: !!patternIdFromUrl,
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      patternId: patternIdFromUrl || undefined,
      patternName: "",
      status: "planned",
      quiltSize: "",
      notes: "",
      isPublic: true,
      photos: [],
    },
  });

  if (pattern && !form.getValues("patternName")) {
    form.setValue("patternName", pattern.name);
    form.setValue("patternId", pattern.id);
  }

  const createProject = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      return apiRequest("POST", "/api/projects", {
        ...data,
        photos,
        userId: user?.id,
        userName: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : undefined,
        userImage: user?.profileImageUrl,
      });
    },
    onSuccess: () => {
      toast({ title: "Project created!" });
      queryClient.invalidateQueries({ queryKey: ["/api/notebook/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      navigate("/notebook");
    },
    onError: () => {
      toast({ title: "Failed to create project", variant: "destructive" });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    createProject.mutate(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEO title="New Project" description="Start a new quilting project." path="/notebook/projects/new" noindex />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-2">Sign in to create a project</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to track your quilting projects.
          </p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/notebook" className="hover:text-foreground transition-colors">
                {t('nav.notebook')}
              </Link>
              <span>/</span>
              <Link href="/notebook" className="hover:text-foreground transition-colors">
                {t('nav.myProjects')}
              </Link>
              <span>/</span>
              <span className="text-foreground">{t('home.newProject')}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/notebook">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.back')}
                </Link>
              </Button>
              <h1 className="font-serif text-3xl font-semibold">{t('newProject.title')}</h1>
              <p className="text-muted-foreground mt-2">
                Start tracking a new quilting project.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('newProject.projectTitle')} *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('newProject.projectTitlePlaceholder')} 
                              {...field} 
                              data-testid="input-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patternName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('newProject.pattern')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('newProject.patternPlaceholder')} 
                              {...field} 
                              data-testid="input-pattern-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('newProject.status')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-status">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="planned">{t('newProject.planned')}</SelectItem>
                                <SelectItem value="in_progress">{t('newProject.inProgress')}</SelectItem>
                                <SelectItem value="finished">{t('newProject.finished')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quiltSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('newProject.quiltSize')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-size">
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="baby">Baby</SelectItem>
                                <SelectItem value="throw">Throw</SelectItem>
                                <SelectItem value="twin">Twin</SelectItem>
                                <SelectItem value="double_full">Double/Full</SelectItem>
                                <SelectItem value="queen">Queen</SelectItem>
                                <SelectItem value="king">King</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('newProject.notes')}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t('newProject.notesPlaceholder')}
                              className="min-h-[120px]"
                              {...field}
                              data-testid="input-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <PhotoUpload
                      photos={photos}
                      onPhotosChange={setPhotos}
                      maxPhotos={10}
                    />

                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">{t('newProject.makePublic')}</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              {t('newProject.makePublicDesc')}
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-public"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={createProject.isPending}
                        className="flex-1"
                        data-testid="button-create-project"
                      >
                        {createProject.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {t('newProject.createProject')}
                      </Button>
                      <Button type="button" variant="outline" asChild>
                        <Link href="/notebook">{t('common.cancel')}</Link>
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
