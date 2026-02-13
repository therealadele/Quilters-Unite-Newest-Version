import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { authStorage } from "./replit_integrations/auth/storage";
import { translateContent, getTranslatedContent, getTranslatedContents } from "./translation-service";
import { 
  insertPatternSchema, insertBlockSchema, insertProjectSchema,
  insertFavoriteSchema, insertQueueSchema, insertLibrarySchema, insertCommentSchema,
  insertUserProfileSchema, insertForumCategorySchema, insertForumThreadSchema, 
  insertForumPostSchema, insertFriendshipSchema, insertGroupSchema, 
  insertGroupMembershipSchema, insertMessageSchema, insertEventSchema, insertQuiltShopSchema,
  users
} from "@shared/schema";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

const requireActiveSubscription: RequestHandler = async (req: any, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = req.user;
  if (user.subscriptionStatus === 'active') return next();
  if (user.subscriptionStatus === 'trial' && user.trialEndsAt) {
    if (new Date(user.trialEndsAt) > new Date()) return next();
  }
  return res.status(403).json({ 
    message: "Your free trial has expired. Please subscribe to continue using this feature.",
    code: "SUBSCRIPTION_REQUIRED"
  });
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // =====================
  // PATTERNS
  // =====================
  app.get("/api/patterns", async (req, res) => {
    try {
      const { search, difficulty, quiltType, sort } = req.query;
      const language = (req.query.language as string) || "en";
      const patterns = await storage.getPatterns({
        search: search as string,
        difficulty: difficulty as string,
        quiltType: quiltType as string,
        sort: sort as string,
      });

      if (language !== "en" && patterns.length > 0) {
        const ids = patterns.map((p: any) => p.id);
        const translationsMap = await getTranslatedContents("pattern", ids, language);
        for (const pattern of patterns as any[]) {
          const t = translationsMap.get(pattern.id);
          if (t) {
            if (t.name) pattern.name = t.name;
            if (t.description) pattern.description = t.description;
          }
        }
      }

      res.json(patterns);
    } catch (error) {
      console.error("Error fetching patterns:", error);
      res.status(500).json({ message: "Failed to fetch patterns" });
    }
  });

  app.get("/api/patterns/:id", async (req, res) => {
    try {
      const language = (req.query.language as string) || "en";
      const pattern = await storage.getPattern(req.params.id);
      if (!pattern) {
        return res.status(404).json({ message: "Pattern not found" });
      }

      if (language !== "en") {
        const t = await getTranslatedContent("pattern", req.params.id, language);
        if (t.name) (pattern as any).name = t.name;
        if (t.description) (pattern as any).description = t.description;
      }

      res.json(pattern);
    } catch (error) {
      console.error("Error fetching pattern:", error);
      res.status(500).json({ message: "Failed to fetch pattern" });
    }
  });

  app.post("/api/patterns", isAuthenticated, async (req, res) => {
    try {
      const validated = insertPatternSchema.parse(req.body);
      const pattern = await storage.createPattern(validated);

      const fieldsToTranslate: Record<string, string> = {};
      if (pattern.name) fieldsToTranslate.name = pattern.name;
      if (pattern.description) fieldsToTranslate.description = pattern.description;
      if (Object.keys(fieldsToTranslate).length > 0) {
        translateContent("pattern", pattern.id, fieldsToTranslate).catch((err) =>
          console.error("Background translation error:", err)
        );
      }

      res.status(201).json(pattern);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating pattern:", error);
      res.status(500).json({ message: "Failed to create pattern" });
    }
  });

  // =====================
  // BLOCKS
  // =====================
  app.get("/api/blocks", async (req, res) => {
    try {
      const { search, difficulty, blockType, sort } = req.query;
      const language = (req.query.language as string) || "en";
      const blocks = await storage.getBlocks({
        search: search as string,
        difficulty: difficulty as string,
        blockType: blockType as string,
        sort: sort as string,
      });

      if (language !== "en" && blocks.length > 0) {
        const ids = blocks.map((b: any) => b.id);
        const translationsMap = await getTranslatedContents("block", ids, language);
        for (const block of blocks as any[]) {
          const t = translationsMap.get(block.id);
          if (t) {
            if (t.name) block.name = t.name;
            if (t.description) block.description = t.description;
          }
        }
      }

      res.json(blocks);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      res.status(500).json({ message: "Failed to fetch blocks" });
    }
  });

  app.get("/api/blocks/:id", async (req, res) => {
    try {
      const language = (req.query.language as string) || "en";
      const block = await storage.getBlock(req.params.id);
      if (!block) {
        return res.status(404).json({ message: "Block not found" });
      }

      if (language !== "en") {
        const t = await getTranslatedContent("block", req.params.id, language);
        if (t.name) (block as any).name = t.name;
        if (t.description) (block as any).description = t.description;
      }

      res.json(block);
    } catch (error) {
      console.error("Error fetching block:", error);
      res.status(500).json({ message: "Failed to fetch block" });
    }
  });

  app.post("/api/blocks", isAuthenticated, async (req, res) => {
    try {
      const validated = insertBlockSchema.parse(req.body);
      const block = await storage.createBlock(validated);

      const fieldsToTranslate: Record<string, string> = {};
      if (block.name) fieldsToTranslate.name = block.name;
      if (block.description) fieldsToTranslate.description = block.description;
      if (Object.keys(fieldsToTranslate).length > 0) {
        translateContent("block", block.id, fieldsToTranslate).catch((err) =>
          console.error("Background translation error:", err)
        );
      }

      res.status(201).json(block);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating block:", error);
      res.status(500).json({ message: "Failed to create block" });
    }
  });

  // =====================
  // PROJECTS
  // =====================
  app.get("/api/projects", async (req, res) => {
    try {
      const { patternId, sort } = req.query;
      const projects = await storage.getProjects({
        patternId: patternId as string,
        publicOnly: true,
        sort: sort as string,
      });
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", isAuthenticated, requireActiveSubscription, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertProjectSchema.parse({ ...req.body, userId });
      const project = await storage.createProject(validated);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", isAuthenticated, requireActiveSubscription, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const project = await storage.getProject(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const updated = await storage.updateProject(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const project = await storage.getProject(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.post("/api/projects/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      await storage.likeProject(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking project:", error);
      res.status(500).json({ message: "Failed to like project" });
    }
  });

  // =====================
  // COMMENTS
  // =====================
  app.get("/api/projects/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/projects/:id/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertCommentSchema.parse({
        ...req.body,
        projectId: req.params.id,
        userId,
      });
      const comment = await storage.addComment(validated);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // =====================
  // NOTEBOOK - USER PROJECTS
  // =====================
  app.get("/api/notebook/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const projects = await storage.getProjects({ userId });
      res.json(projects);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // =====================
  // FAVORITES
  // =====================
  app.get("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", isAuthenticated, requireActiveSubscription, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertFavoriteSchema.parse({ ...req.body, userId });
      const favorite = await storage.addFavorite(validated);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      await storage.removeFavorite(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // =====================
  // QUEUE
  // =====================
  app.get("/api/queue", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const queue = await storage.getQueue(userId);
      res.json(queue);
    } catch (error) {
      console.error("Error fetching queue:", error);
      res.status(500).json({ message: "Failed to fetch queue" });
    }
  });

  app.post("/api/queue", isAuthenticated, requireActiveSubscription, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertQueueSchema.parse({ ...req.body, userId });
      const item = await storage.addToQueue(validated);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error adding to queue:", error);
      res.status(500).json({ message: "Failed to add to queue" });
    }
  });

  app.delete("/api/queue/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      await storage.removeFromQueue(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from queue:", error);
      res.status(500).json({ message: "Failed to remove from queue" });
    }
  });

  // =====================
  // LIBRARY
  // =====================
  app.get("/api/library", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const library = await storage.getLibrary(userId);
      res.json(library);
    } catch (error) {
      console.error("Error fetching library:", error);
      res.status(500).json({ message: "Failed to fetch library" });
    }
  });

  app.post("/api/library", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertLibrarySchema.parse({ ...req.body, userId });
      const item = await storage.addToLibrary(validated);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error adding to library:", error);
      res.status(500).json({ message: "Failed to add to library" });
    }
  });

  app.delete("/api/library/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      await storage.removeFromLibrary(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from library:", error);
      res.status(500).json({ message: "Failed to remove from library" });
    }
  });

  // =====================
  // USER PROFILES / PEOPLE
  // =====================
  app.get("/api/people", async (req, res) => {
    try {
      const { search } = req.query;
      const profiles = await storage.getPublicProfiles(search as string);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching people:", error);
      res.status(500).json({ message: "Failed to fetch people" });
    }
  });

  app.get("/api/people/:userId", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      if (!profile || !profile.isPublic) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      let profile = await storage.getUserProfile(userId);
      if (!profile) {
        profile = await storage.createUserProfile({
          userId,
          displayName: req.user?.firstName || "Quilter",
          isPublic: true
        });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      console.log("PATCH /api/profile - userId:", userId, "body:", JSON.stringify(req.body));
      
      // Ensure profile exists before updating
      let profile = await storage.getUserProfile(userId);
      if (!profile) {
        console.log("Creating new profile for user:", userId);
        profile = await storage.createUserProfile({
          userId,
          displayName: req.user?.firstName || "Quilter",
          isPublic: true
        });
      }
      
      const updated = await storage.updateUserProfile(userId, req.body);
      console.log("Profile updated successfully:", updated?.id);
      res.json(updated);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // =====================
  // FORUM CATEGORIES
  // =====================
  app.get("/api/forums", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      res.status(500).json({ message: "Failed to fetch forums" });
    }
  });

  app.post("/api/forums", isAuthenticated, async (req, res) => {
    try {
      const validated = insertForumCategorySchema.parse(req.body);
      const category = await storage.createForumCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating forum category:", error);
      res.status(500).json({ message: "Failed to create forum category" });
    }
  });

  // =====================
  // FORUM THREADS
  // =====================
  app.get("/api/forums/:categoryId/threads", async (req, res) => {
    try {
      const threads = await storage.getForumThreads(req.params.categoryId);
      res.json(threads);
    } catch (error) {
      console.error("Error fetching threads:", error);
      res.status(500).json({ message: "Failed to fetch threads" });
    }
  });

  app.get("/api/threads/:id", async (req, res) => {
    try {
      const thread = await storage.getForumThread(req.params.id);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }
      res.json(thread);
    } catch (error) {
      console.error("Error fetching thread:", error);
      res.status(500).json({ message: "Failed to fetch thread" });
    }
  });

  app.post("/api/forums/:categoryId/threads", isAuthenticated, requireActiveSubscription, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertForumThreadSchema.parse({
        ...req.body,
        categoryId: req.params.categoryId,
        userId,
        userName: req.user?.firstName,
        userImage: req.user?.profileImageUrl
      });
      const thread = await storage.createForumThread(validated);
      res.status(201).json(thread);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating thread:", error);
      res.status(500).json({ message: "Failed to create thread" });
    }
  });

  // =====================
  // FORUM POSTS
  // =====================
  app.get("/api/threads/:threadId/posts", async (req, res) => {
    try {
      const posts = await storage.getForumPosts(req.params.threadId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/threads/:threadId/posts", isAuthenticated, requireActiveSubscription, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertForumPostSchema.parse({
        ...req.body,
        threadId: req.params.threadId,
        userId,
        userName: req.user?.firstName,
        userImage: req.user?.profileImageUrl
      });
      const post = await storage.createForumPost(validated);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // =====================
  // FRIENDS
  // =====================
  app.get("/api/friends", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const friends = await storage.getFriends(userId);
      res.json(friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Failed to fetch friends" });
    }
  });

  app.get("/api/friends/requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const requests = await storage.getFriendRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Failed to fetch friend requests" });
    }
  });

  app.post("/api/friends/request", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertFriendshipSchema.parse({
        ...req.body,
        requesterId: userId,
        requesterName: req.user?.firstName,
        requesterImage: req.user?.profileImageUrl,
        status: "pending"
      });
      const friendship = await storage.sendFriendRequest(validated);
      res.status(201).json(friendship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Failed to send friend request" });
    }
  });

  app.patch("/api/friends/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.respondToFriendRequest(req.params.id, status);
      res.json(updated);
    } catch (error) {
      console.error("Error responding to friend request:", error);
      res.status(500).json({ message: "Failed to respond to friend request" });
    }
  });

  app.delete("/api/friends/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      await storage.removeFriend(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing friend:", error);
      res.status(500).json({ message: "Failed to remove friend" });
    }
  });

  // =====================
  // GROUPS
  // =====================
  app.get("/api/groups", async (req, res) => {
    try {
      const { search } = req.query;
      const groups = await storage.getGroups(search as string);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.get("/api/groups/:id", async (req, res) => {
    try {
      const group = await storage.getGroup(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.json(group);
    } catch (error) {
      console.error("Error fetching group:", error);
      res.status(500).json({ message: "Failed to fetch group" });
    }
  });

  app.post("/api/groups", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertGroupSchema.parse({
        ...req.body,
        creatorId: userId,
        creatorName: req.user?.firstName
      });
      const group = await storage.createGroup(validated);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating group:", error);
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  app.get("/api/groups/:id/members", async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.id);
      res.json(members);
    } catch (error) {
      console.error("Error fetching group members:", error);
      res.status(500).json({ message: "Failed to fetch group members" });
    }
  });

  app.get("/api/my-groups", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const memberships = await storage.getUserGroups(userId);
      res.json(memberships);
    } catch (error) {
      console.error("Error fetching user groups:", error);
      res.status(500).json({ message: "Failed to fetch user groups" });
    }
  });

  app.post("/api/groups/:id/join", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertGroupMembershipSchema.parse({
        groupId: req.params.id,
        userId,
        userName: req.user?.firstName,
        userImage: req.user?.profileImageUrl,
        role: "member"
      });
      const membership = await storage.joinGroup(validated);
      res.status(201).json(membership);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error joining group:", error);
      res.status(500).json({ message: "Failed to join group" });
    }
  });

  app.delete("/api/groups/:id/leave", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      await storage.leaveGroup(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error leaving group:", error);
      res.status(500).json({ message: "Failed to leave group" });
    }
  });

  // =====================
  // EVENTS
  // =====================
  app.get("/api/events", async (req, res) => {
    try {
      const { search, eventType, region } = req.query;
      const events = await storage.getEvents({
        search: search as string,
        eventType: eventType as string,
        region: region as string,
      });
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validatedData = insertEventSchema.parse({
        ...req.body,
        creatorId: userId,
        creatorName: req.user?.firstName || "Anonymous",
      });
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.post("/api/events/:id/interested", isAuthenticated, async (req: any, res) => {
    try {
      const eventId = req.params.id;
      const userId = req.user?.id;
      await storage.markEventInterested(eventId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking interest:", error);
      res.status(500).json({ message: "Failed to mark interest" });
    }
  });

  // =====================
  // CONVERSATIONS / MESSAGES
  // =====================
  app.get("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const { recipientId, recipientName, recipientImage } = req.body;
      const participantData = [
        { userId, userName: req.user?.firstName, userImage: req.user?.profileImageUrl },
        { userId: recipientId, userName: recipientName, userImage: recipientImage }
      ];
      const conversation = await storage.createConversation([userId, recipientId], participantData);
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:id/messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/conversations/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const validated = insertMessageSchema.parse({
        ...req.body,
        conversationId: req.params.id,
        senderId: userId,
        senderName: req.user?.firstName,
        senderImage: req.user?.profileImageUrl
      });
      const message = await storage.sendMessage(validated);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // =====================
  // QUILT SHOPS
  // =====================
  app.get("/api/shops", async (req, res) => {
    try {
      const { search, shopType } = req.query;
      const shops = await storage.getQuiltShops({
        search: search as string,
        shopType: shopType as string,
      });
      res.json(shops);
    } catch (error) {
      console.error("Error fetching shops:", error);
      res.status(500).json({ message: "Failed to fetch shops" });
    }
  });

  app.get("/api/shops/:id", async (req, res) => {
    try {
      const shop = await storage.getQuiltShop(req.params.id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      console.error("Error fetching shop:", error);
      res.status(500).json({ message: "Failed to fetch shop" });
    }
  });

  app.post("/api/shops", isAuthenticated, async (req, res) => {
    try {
      const validated = insertQuiltShopSchema.parse(req.body);
      const shop = await storage.createQuiltShop(validated);
      res.status(201).json(shop);
    } catch (error) {
      console.error("Error creating shop:", error);
      res.status(500).json({ message: "Failed to create shop" });
    }
  });

  app.get("/api/shops/favorites/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const favorites = await storage.getShopFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching shop favorites:", error);
      res.status(500).json({ message: "Failed to fetch shop favorites" });
    }
  });

  app.post("/api/shops/:id/favorite", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const shopId = req.params.id;
      const isFavorited = await storage.isShopFavorited(userId, shopId);
      
      if (isFavorited) {
        await storage.removeShopFavorite(userId, shopId);
        res.json({ favorited: false });
      } else {
        await storage.addShopFavorite(userId, shopId);
        res.json({ favorited: true });
      }
    } catch (error) {
      console.error("Error toggling shop favorite:", error);
      res.status(500).json({ message: "Failed to toggle favorite" });
    }
  });

  app.delete("/api/shops/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const shopId = req.params.id;
      
      const shop = await storage.getQuiltShop(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      if (shop.submittedById !== userId) {
        return res.status(403).json({ message: "You can only delete shops you created" });
      }
      
      await storage.deleteQuiltShop(shopId);
      res.json({ message: "Shop deleted successfully" });
    } catch (error) {
      console.error("Error deleting shop:", error);
      res.status(500).json({ message: "Failed to delete shop" });
    }
  });

  app.post("/api/user/language", async (req: any, res) => {
    try {
      const { language } = req.body;
      if (!language) {
        return res.status(400).json({ message: "Language is required" });
      }
      const supportedLanguages = ["en", "fr", "es", "de", "nl", "da", "ja"];
      if (!supportedLanguages.includes(language)) {
        return res.status(400).json({ message: "Unsupported language" });
      }
      const userId = req.user?.id;
      if (userId) {
        const existingProfile = await storage.getUserProfile(userId);
        if (existingProfile) {
          await storage.updateUserProfile(userId, { preferredLanguage: language });
        }
      }
      res.json({ message: "Language preference saved", language });
    } catch (error) {
      console.error("Error saving language preference:", error);
      res.status(500).json({ message: "Failed to save language preference" });
    }
  });

  app.get("/api/user/language", async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (userId) {
        const profile = await storage.getUserProfile(userId);
        if (profile?.preferredLanguage) {
          return res.json({ language: profile.preferredLanguage });
        }
      }
      res.json({ language: "en" });
    } catch (error) {
      res.json({ language: "en" });
    }
  });

  // =====================
  // CONTENT TRANSLATIONS
  // =====================
  app.get("/api/translations/:contentType/:contentId", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const language = (req.query.language as string) || "en";
      const translations = await getTranslatedContent(contentType, contentId, language);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  app.get("/api/translations/:contentType", async (req, res) => {
    try {
      const { contentType } = req.params;
      const language = (req.query.language as string) || "en";
      const ids = (req.query.ids as string)?.split(",") || [];
      if (ids.length === 0) {
        return res.json({});
      }
      const translationsMap = await getTranslatedContents(contentType, ids, language);
      const result: Record<string, Record<string, string>> = {};
      translationsMap.forEach((fields, id) => {
        result[id] = fields;
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  // =====================
  // STRIPE SUBSCRIPTION ROUTES
  // =====================
  app.get('/api/stripe/publishable-key', async (req, res) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (error) {
      console.error("Error fetching publishable key:", error);
      res.status(500).json({ message: "Failed to fetch publishable key" });
    }
  });

  app.post('/api/stripe/create-checkout-session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { priceId } = req.body;
      const stripe = await getUncachableStripeClient();

      const user = await authStorage.getUser(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: { userId },
        });
        customerId = customer.id;
        await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, userId));
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.get('host')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/subscription/cancel`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.get('/api/stripe/prices', async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT p.id as product_id, p.name as product_name, p.description as product_description,
               pr.id as price_id, pr.unit_amount, pr.currency, pr.recurring
        FROM stripe.products p
        JOIN stripe.prices pr ON pr.product = p.id
        WHERE p.active = true AND pr.active = true
        ORDER BY pr.unit_amount
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching prices:", error);
      res.status(500).json({ message: "Failed to fetch prices" });
    }
  });

  app.post('/api/stripe/customer-portal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await authStorage.getUser(userId);
      if (!user?.stripeCustomerId) return res.status(400).json({ message: 'No subscription found' });

      const stripe = await getUncachableStripeClient();
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${req.protocol}://${req.get('host')}/notebook`,
      });
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating customer portal:", error);
      res.status(500).json({ message: "Failed to create customer portal session" });
    }
  });

  app.get('/api/subscription/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await authStorage.getUser(userId);

      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.stripeSubscriptionId) {
        const result = await db.execute(sql`
          SELECT status FROM stripe.subscriptions WHERE id = ${user.stripeSubscriptionId}
        `);
        const sub = result.rows[0] as any;
        if (sub) {
          const isActive = sub.status === 'active' || sub.status === 'trialing';
          const newStatus = isActive ? 'active' : 'expired';
          if (user.subscriptionStatus !== newStatus) {
            await db.update(users).set({ subscriptionStatus: newStatus }).where(eq(users.id, userId));
          }
          return res.json({
            subscriptionStatus: newStatus,
            stripeStatus: sub.status,
            trialEndsAt: user.trialEndsAt,
          });
        }
      }

      const now = new Date();
      const trialActive = user.trialEndsAt && new Date(user.trialEndsAt) > now;

      res.json({
        subscriptionStatus: trialActive ? 'trial' : 'expired',
        trialEndsAt: user.trialEndsAt,
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  app.get("/robots.txt", (_req, res) => {
    const siteUrl = "https://quiltersunite.com";
    res.type("text/plain").send(
      `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    );
  });

  app.get("/sitemap.xml", (_req, res) => {
    const siteUrl = "https://quiltersunite.com";
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/patterns", priority: "0.9", changefreq: "daily" },
      { loc: "/blocks", priority: "0.9", changefreq: "daily" },
      { loc: "/projects", priority: "0.8", changefreq: "daily" },
      { loc: "/community", priority: "0.8", changefreq: "daily" },
      { loc: "/community/blog", priority: "0.8", changefreq: "weekly" },
      { loc: "/community/forums", priority: "0.7", changefreq: "daily" },
      { loc: "/community/people", priority: "0.5", changefreq: "weekly" },
      { loc: "/community/groups", priority: "0.6", changefreq: "weekly" },
      { loc: "/community/events", priority: "0.6", changefreq: "weekly" },
      { loc: "/community/shops", priority: "0.6", changefreq: "weekly" },
      { loc: "/subscription", priority: "0.7", changefreq: "monthly" },
      { loc: "/support", priority: "0.5", changefreq: "monthly" },
      { loc: "/about", priority: "0.5", changefreq: "monthly" },
      { loc: "/getting-started", priority: "0.6", changefreq: "monthly" },
      { loc: "/getting-started/create-account", priority: "0.5", changefreq: "monthly" },
      { loc: "/getting-started/explore-patterns", priority: "0.5", changefreq: "monthly" },
      { loc: "/getting-started/build-queue", priority: "0.5", changefreq: "monthly" },
      { loc: "/getting-started/start-project", priority: "0.5", changefreq: "monthly" },
      { loc: "/getting-started/manage-library", priority: "0.5", changefreq: "monthly" },
      { loc: "/getting-started/join-community", priority: "0.5", changefreq: "monthly" },
      { loc: "/contact", priority: "0.4", changefreq: "monthly" },
      { loc: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
      { loc: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
      { loc: "/community-guidelines", priority: "0.3", changefreq: "yearly" },
      { loc: "/login", priority: "0.4", changefreq: "monthly" },
      { loc: "/register", priority: "0.5", changefreq: "monthly" },
    ];

    const today = new Date().toISOString().split("T")[0];

    const urls = staticPages
      .map(
        (p) =>
          `  <url>\n    <loc>${siteUrl}${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    res.type("application/xml").send(xml);
  });

  return httpServer;
}
