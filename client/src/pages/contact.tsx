import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Mail, Clock, MessageCircle, Upload, X } from "lucide-react";
import { SEO } from "@/components/seo";

const subjectOptions = [
  { value: "password", label: "Password issue" },
  { value: "new-account", label: "Trouble setting up a new account" },
  { value: "account-recovery", label: "Account recovery / Account merge" },
  { value: "technical", label: "Technical problem with the site" },
  { value: "purchase", label: "Problem with pattern purchase / download" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxPhotos = 10;

  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));
    const remaining = maxPhotos - photos.length;
    const newFiles = fileArray.slice(0, remaining);

    if (newFiles.length === 0) return;

    setPhotos(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [photos.length]);

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Contact Us" description="Get in touch with the Quilters Unite team. We're here to help with questions, feedback, and support." path="/contact" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2" data-testid="heading-contact">{t('contact.title')}</h1>
              <p className="text-muted-foreground">
                {t('contact.description')}
              </p>
            </div>
            <Link href="/support">
              <Button data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Support
              </Button>
            </Link>

          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t('contact.email')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>hello@quiltersunite.com</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">{t('contact.responseTime')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('contact.responseTime')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t('contact.communityHelp')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <Link href="/community/forums" className="text-primary hover:underline">
                    {t('contact.visitForums')}
                  </Link>
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('contact.sendMessage')}</CardTitle>
              <CardDescription>
                {t('contact.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.name')}</Label>
                    <Input id="name" placeholder={t('contact.namePlaceholder')} data-testid="input-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.emailAddress')}</Label>
                    <Input id="email" type="email" placeholder={t('contact.emailPlaceholder')} data-testid="input-email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.subject')}</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue placeholder={t('contact.subjectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')}</Label>
                  <Textarea 
                    id="message" 
                    placeholder={t('contact.messagePlaceholder')} 
                    rows={5}
                    data-testid="input-message"
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Photos</Label>
                    <span className="text-sm text-muted-foreground">{photos.length}/{maxPhotos}</span>
                  </div>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    } ${photos.length >= maxPhotos ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Drag & drop images here
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      or use the options below
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          addFiles(e.target.files);
                        }
                        e.target.value = "";
                      }}
                    />
                  </div>

                  {/* Photo Previews */}
                  {previews.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 mt-3">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={preview}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" data-testid="button-submit">{t('contact.sendButton')}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
