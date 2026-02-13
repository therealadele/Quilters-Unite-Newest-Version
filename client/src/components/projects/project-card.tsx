import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Heart, MessageCircle } from "lucide-react";
import type { Project } from "@shared/schema";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-project-${project.id}`}>
        <CardContent className="p-0">
          <div className="aspect-[4/3] bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/10 flex items-center justify-center relative">
            {project.photos && project.photos[0] ? (
              <img src={project.photos[0]} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="h-16 w-16 text-teal-300" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            <Badge 
              className="absolute top-3 right-3 capitalize"
              variant={project.status === "finished" ? "default" : "secondary"}
            >
              {project.status?.replace("_", " ")}
            </Badge>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              {project.patternName && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  Pattern: {project.patternName}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={project.userImage || undefined} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {project.userName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{project.userName || "Anonymous"}</span>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {project.likeCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {project.commentCount || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ProjectSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="aspect-[4/3]" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
