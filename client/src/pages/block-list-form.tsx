import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Upload, 
  Link as LinkIcon, 
  Image, 
  X, 
  AlertTriangle,
  Eye,
  Send,
  Loader2,
  LogIn,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";

const blockTypes = ["Traditional", "Modern", "Foundation", "Paper Pieced", "Appliqué"];
const skillLevels = ["Beginner", "Intermediate", "Experienced"];

const sourceTypes = [
  { value: "digital", label: "Digital Pattern" },
  { value: "print", label: "Print Pattern" },
  { value: "blog", label: "Blog/Website" },
  { value: "book", label: "Book" },
];

const presetTags = [
  "Basic Piecing", "Scrap Friendly", "Straight Stitching", "Pre-cut Friendly",
  "Fat quarter-friendly", "Paper Pieced", "Appliqué", "Modern", "Patchwork",
  "Sampler", "Seasonal", "Holiday", "Geometric", "Traditional"
];

const languages = [
  "English", "French", "Danish", "Dutch", "German",
  "Japanese", "Portuguese", "Spanish", "Swedish", "Other"
];

interface PhotoEntry {
  id: string;
  url: string;
  caption: string;
  copyright: string;
  uploadType: "drag" | "url" | "google";
}

interface FormData {
  blockName: string;
  designerName: string;
  blockType: string;
  skillLevel: string;
  gridSize: string;
  sourceType: string;
  sourceLink: string;
  sourceCost: string;
  isDesigner: boolean;
  isNotDesigner: boolean;
  tags: string[];
  selectedLanguages: string[];
  description: string;
  photos: PhotoEntry[];
}

const initialFormData: FormData = {
  blockName: "",
  designerName: "",
  blockType: "",
  skillLevel: "",
  gridSize: "",
  sourceType: "",
  sourceLink: "",
  sourceCost: "",
  isDesigner: false,
  isNotDesigner: false,
  tags: [],
  selectedLanguages: [],
  description: "",
  photos: [],
};

export default function BlockListForm() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const createBlockMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/blocks", {
        name: data.blockName,
        designerName: data.designerName,
        designerId: "user-submitted",
        blockType: data.blockType,
        difficulty: data.skillLevel.toLowerCase(),
        gridSize: data.gridSize,
        sourceType: data.sourceType,
        sourceLink: data.sourceLink,
        price: data.sourceCost ? Math.round(parseFloat(data.sourceCost.replace(/[^0-9.]/g, '')) * 100) : 0,
        isFree: !data.sourceCost || parseFloat(data.sourceCost.replace(/[^0-9.]/g, '')) === 0,
        languages: data.selectedLanguages,
        tags: data.tags,
        description: data.description,
        photos: data.photos,
        techniques: data.tags,
        isDesigner: data.isDesigner,
        status: "pending",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocks"] });
      toast({
        title: "Block Submitted",
        description: "Your block has been submitted and is pending approval by an administrator.",
      });
      navigate("/blocks");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit block. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!formData.blockName.trim()) errors.push("Block Name is required");
    if (!formData.designerName.trim()) errors.push("Designer Name is required");
    if (!formData.blockType) errors.push("Block Type is required");
    if (!formData.skillLevel) errors.push("Skill Level is required");
    if (!formData.sourceType) errors.push("Source type is required");
    return errors;
  };

  const handlePreview = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowWarning(true);
    } else {
      setShowPreview(true);
    }
  };

  const handlePublish = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowWarning(true);
    } else {
      createBlockMutation.mutate(formData);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const togglePresetTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const toggleLanguage = (lang: string) => {
    if (formData.selectedLanguages.includes(lang)) {
      setFormData({
        ...formData,
        selectedLanguages: formData.selectedLanguages.filter((l) => l !== lang),
      });
    } else {
      setFormData({
        ...formData,
        selectedLanguages: [...formData.selectedLanguages, lang],
      });
    }
  };

  const addPhotoFromUrl = () => {
    if (photoUrlInput.trim()) {
      const newPhoto: PhotoEntry = {
        id: Date.now().toString(),
        url: photoUrlInput.trim(),
        caption: "",
        copyright: "",
        uploadType: "url",
      };
      setFormData({ ...formData, photos: [...formData.photos, newPhoto] });
      setPhotoUrlInput("");
    }
  };

  const updatePhotoField = (id: string, field: "caption" | "copyright", value: string) => {
    setFormData({
      ...formData,
      photos: formData.photos.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const removePhoto = (id: string) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((p) => p.id !== id),
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newPhoto: PhotoEntry = {
            id: Date.now().toString() + Math.random(),
            url: event.target?.result as string,
            caption: "",
            copyright: "",
            uploadType: "drag",
          };
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, newPhoto],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleCostChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setFormData({ ...formData, sourceCost: numericValue });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Submit a Block" description="Submit a quilt block to the Quilters Unite library." path="/blocks/new" noindex />
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/blocks">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-serif text-3xl font-semibold">{t('blocks.listBlock')}</h1>
                <p className="text-muted-foreground">
                  Share a quilt block with the community
                </p>
              </div>
            </div>
            <Link href="/patterns/publishing-rules">
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Publishing Rules
              </Button>
            </Link>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.basicInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="blockName">
                      Block Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="blockName"
                      placeholder="Enter block name"
                      value={formData.blockName}
                      onChange={(e) =>
                        setFormData({ ...formData, blockName: e.target.value })
                      }
                      data-testid="input-block-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designerName">
                      {t('patternForm.designer')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="designerName"
                      placeholder="Enter designer name"
                      value={formData.designerName}
                      onChange={(e) =>
                        setFormData({ ...formData, designerName: e.target.value })
                      }
                      data-testid="input-designer-name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="blockType">
                      {t('blocks.blockType')} <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.blockType}
                      onValueChange={(v) => setFormData({ ...formData, blockType: v })}
                    >
                      <SelectTrigger data-testid="select-block-type">
                        <SelectValue placeholder="Select block type" />
                      </SelectTrigger>
                      <SelectContent>
                        {blockTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel">
                      {t('patternForm.difficulty')} <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.skillLevel}
                      onValueChange={(v) => setFormData({ ...formData, skillLevel: v })}
                    >
                      <SelectTrigger data-testid="select-skill-level">
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gridSize">Grid Size</Label>
                    <Input
                      id="gridSize"
                      placeholder="e.g., 9-patch, 16-patch"
                      value={formData.gridSize}
                      onChange={(e) =>
                        setFormData({ ...formData, gridSize: e.target.value })
                      }
                      data-testid="input-grid-size"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sourceType">
                      Source Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.sourceType}
                      onValueChange={(v) =>
                        setFormData({ ...formData, sourceType: v })
                      }
                    >
                      <SelectTrigger data-testid="select-source-type">
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypes.map((src) => (
                          <SelectItem key={src.value} value={src.value}>
                            {src.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourceCost">Cost (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="sourceCost"
                        type="text"
                        placeholder="0.00 (free)"
                        value={formData.sourceCost}
                        onChange={(e) => handleCostChange(e.target.value)}
                        className="pl-7"
                        data-testid="input-source-cost"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourceLink">Website/Link/Book Name</Label>
                  <Input
                    id="sourceLink"
                    placeholder="https://... or book title"
                    value={formData.sourceLink}
                    onChange={(e) =>
                      setFormData({ ...formData, sourceLink: e.target.value })
                    }
                    data-testid="input-source-link"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDesigner"
                      checked={formData.isDesigner}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isDesigner: checked as boolean, isNotDesigner: false })
                      }
                    />
                    <Label htmlFor="isDesigner" className="text-sm font-normal cursor-pointer">
                      I designed this block and am adding it to the database for sale
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNotDesigner"
                      checked={formData.isNotDesigner}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isNotDesigner: checked as boolean, isDesigner: false })
                      }
                    />
                    <Label htmlFor="isNotDesigner" className="text-sm font-normal cursor-pointer">
                      I did not design this block and am adding it to the database
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('patternForm.tags')} & {t('patternForm.languages')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('patternForm.tags')}</Label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {presetTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={formData.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => togglePresetTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="max-w-xs"
                      data-testid="input-tag"
                    />
                    <Button type="button" onClick={addTag} variant="secondary" size="sm" data-testid="button-add-tag">
                      Add
                    </Button>
                  </div>
                  {formData.tags.filter(t => !presetTags.includes(t)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.filter(t => !presetTags.includes(t)).map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t('patternForm.languages')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <Badge
                        key={lang}
                        variant={
                          formData.selectedLanguages.includes(lang)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleLanguage(lang)}
                        data-testid={`badge-language-${lang}`}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('patternForm.description')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add a description about this block..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  data-testid="input-description"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('patternForm.photos')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  data-testid="photo-dropzone"
                >
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">Drag & drop images here</p>
                  <p className="text-sm text-muted-foreground">
                    or use the options below
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Upload from URL</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        data-testid="input-photo-url"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addPhotoFromUrl}
                        data-testid="button-add-photo-url"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Link Google Photos Album</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      data-testid="button-link-google-photos"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Connect Google Photos
                    </Button>
                  </div>
                </div>

                {formData.photos.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {formData.photos.map((photo) => (
                      <Card key={photo.id} className="overflow-hidden">
                        <div className="flex gap-4 p-4">
                          <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            <img
                              src={photo.url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Caption"
                              value={photo.caption}
                              onChange={(e) =>
                                updatePhotoField(photo.id, "caption", e.target.value)
                              }
                            />
                            <Input
                              placeholder="Copyright information"
                              value={photo.copyright}
                              onChange={(e) =>
                                updatePhotoField(photo.id, "copyright", e.target.value)
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePhoto(photo.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                data-testid="button-preview"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={createBlockMutation.isPending}
                data-testid="button-publish"
              >
                {createBlockMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {t('patternForm.submitPattern')}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Block Preview</DialogTitle>
            <DialogDescription>
              This is how the block will appear to others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg">{formData.blockName || "Block Name"}</h3>
              <p className="text-muted-foreground">{t('common.by')} {formData.designerName || "Designer"}</p>
              <div className="flex gap-2 mt-2">
                {formData.blockType && <Badge>{formData.blockType}</Badge>}
                {formData.skillLevel && <Badge variant="outline">{formData.skillLevel}</Badge>}
                {formData.gridSize && <Badge variant="secondary">{formData.gridSize}</Badge>}
              </div>
              {formData.description && (
                <p className="mt-3 text-sm">{formData.description}</p>
              )}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              {t('common.close')}
            </Button>
            <Button onClick={() => { setShowPreview(false); handlePublish(); }}>
              Submit Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Missing Required Fields
            </DialogTitle>
            <DialogDescription>
              Please fill in the following required fields:
            </DialogDescription>
          </DialogHeader>
          <ul className="list-disc pl-6 space-y-1">
            {validationErrors.map((error) => (
              <li key={error} className="text-sm text-destructive">
                {error}
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button onClick={() => setShowWarning(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign In Required
            </DialogTitle>
            <DialogDescription>
              You need to be signed in to publish a block.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
              {t('common.cancel')}
            </Button>
            <Button asChild>
              <a href="/login">{t('common.signIn')}</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
