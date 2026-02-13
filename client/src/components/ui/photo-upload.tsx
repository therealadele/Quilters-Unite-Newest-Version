import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 10 }: PhotoUploadProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addPhoto = useCallback((url: string) => {
    if (photos.length >= maxPhotos) {
      toast({
        title: `Maximum ${maxPhotos} photos allowed`,
        variant: "destructive",
      });
      return;
    }
    if (url && !photos.includes(url)) {
      onPhotosChange([...photos, url]);
    }
  }, [photos, onPhotosChange, maxPhotos, toast]);

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      addPhoto(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxPhotos - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addPhoto(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }

    if (files.length > remainingSlots) {
      toast({
        title: `Only ${remainingSlots} more photo(s) can be added`,
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    const remainingSlots = maxPhotos - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addPhoto(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }

    if (files.length > remainingSlots) {
      toast({
        title: `Only ${remainingSlots} more photo(s) can be added`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Photos</h3>
        <span className="text-sm text-muted-foreground">
          {photos.length}/{maxPhotos}
        </span>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="font-medium text-muted-foreground">Drag & drop images here</p>
        <p className="text-sm text-muted-foreground">or use the options below</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Files
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Upload from URL</label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUrlSubmit();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Link Google Photos Album</label>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              toast({
                title: "Coming soon",
                description: "Google Photos integration will be available soon",
              });
            }}
          >
            <ImageIcon className="h-4 w-4" />
            Connect Google Photos
          </Button>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={photo}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
