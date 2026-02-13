import { 
  patterns, blocks, fabrics, projects, projectFabrics, favorites, queue, library, comments, projectLikes,
  userProfiles, forumCategories, forumThreads, forumPosts, friendships, groups, groupMemberships,
  conversations, conversationParticipants, messages, events, quiltShops, shopFavorites,
  type Pattern, type InsertPattern,
  type Block, type InsertBlock,
  type Fabric, type InsertFabric,
  type Project, type InsertProject,
  type Favorite, type InsertFavorite,
  type QueueItem, type InsertQueue,
  type LibraryItem, type InsertLibrary,
  type Comment, type InsertComment,
  type UserProfile, type InsertUserProfile,
  type ForumCategory, type InsertForumCategory,
  type ForumThread, type InsertForumThread,
  type ForumPost, type InsertForumPost,
  type Friendship, type InsertFriendship,
  type Group, type InsertGroup,
  type GroupMembership, type InsertGroupMembership,
  type Conversation, type ConversationParticipant,
  type Message, type InsertMessage,
  type Event, type InsertEvent,
  type QuiltShop, type InsertQuiltShop,
  type ShopFavorite
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Patterns
  getPatterns(filters?: { search?: string; difficulty?: string; quiltType?: string; sort?: string }): Promise<Pattern[]>;
  getPattern(id: string): Promise<Pattern | undefined>;
  createPattern(pattern: InsertPattern): Promise<Pattern>;
  
  // Blocks
  getBlocks(filters?: { search?: string; difficulty?: string; blockType?: string; sort?: string }): Promise<Block[]>;
  getBlock(id: string): Promise<Block | undefined>;
  createBlock(block: InsertBlock): Promise<Block>;
  
  // Fabrics
  getFabrics(filters?: { search?: string; fabricType?: string; printStyle?: string; sort?: string }): Promise<Fabric[]>;
  getFabric(id: string): Promise<Fabric | undefined>;
  createFabric(fabric: InsertFabric): Promise<Fabric>;
  
  // Projects
  getProjects(filters?: { userId?: string; patternId?: string; publicOnly?: boolean; sort?: string }): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;
  likeProject(projectId: string, userId: string): Promise<void>;
  
  // Favorites
  getFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(id: string, userId: string): Promise<void>;
  
  // Queue
  getQueue(userId: string): Promise<QueueItem[]>;
  addToQueue(item: InsertQueue): Promise<QueueItem>;
  removeFromQueue(id: string, userId: string): Promise<void>;
  
  // Library
  getLibrary(userId: string): Promise<LibraryItem[]>;
  addToLibrary(item: InsertLibrary): Promise<LibraryItem>;
  removeFromLibrary(id: string, userId: string): Promise<void>;
  
  // Comments
  getComments(projectId: string): Promise<Comment[]>;
  addComment(comment: InsertComment): Promise<Comment>;
  
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  getPublicProfiles(search?: string): Promise<UserProfile[]>;
  
  // Forum Categories
  getForumCategories(): Promise<ForumCategory[]>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  
  // Forum Threads
  getForumThreads(categoryId: string): Promise<ForumThread[]>;
  getForumThread(id: string): Promise<ForumThread | undefined>;
  createForumThread(thread: InsertForumThread): Promise<ForumThread>;
  
  // Forum Posts
  getForumPosts(threadId: string): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  
  // Friendships
  getFriends(userId: string): Promise<Friendship[]>;
  getFriendRequests(userId: string): Promise<Friendship[]>;
  sendFriendRequest(friendship: InsertFriendship): Promise<Friendship>;
  respondToFriendRequest(id: string, status: string): Promise<Friendship | undefined>;
  removeFriend(id: string, userId: string): Promise<void>;
  
  // Groups
  getGroups(search?: string): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: string, data: Partial<InsertGroup>): Promise<Group | undefined>;
  
  // Group Memberships
  getGroupMembers(groupId: string): Promise<GroupMembership[]>;
  getUserGroups(userId: string): Promise<GroupMembership[]>;
  joinGroup(membership: InsertGroupMembership): Promise<GroupMembership>;
  leaveGroup(groupId: string, userId: string): Promise<void>;
  
  // Conversations
  getConversations(userId: string): Promise<{ conversation: Conversation; participants: ConversationParticipant[] }[]>;
  getConversation(id: string): Promise<{ conversation: Conversation; participants: ConversationParticipant[] } | undefined>;
  createConversation(participantUserIds: string[], participantData: { userId: string; userName?: string; userImage?: string }[]): Promise<Conversation>;
  
  // Messages
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  
  // Events
  getEvents(filters?: { search?: string; eventType?: string; region?: string }): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  markEventInterested(eventId: string, userId: string): Promise<void>;
  
  // Quilt Shops
  getQuiltShops(filters?: { search?: string; shopType?: string }): Promise<QuiltShop[]>;
  getQuiltShop(id: string): Promise<QuiltShop | undefined>;
  createQuiltShop(shop: InsertQuiltShop): Promise<QuiltShop>;
  deleteQuiltShop(id: string): Promise<void>;
  getShopFavorites(userId: string): Promise<ShopFavorite[]>;
  addShopFavorite(userId: string, shopId: string): Promise<ShopFavorite>;
  removeShopFavorite(userId: string, shopId: string): Promise<void>;
  isShopFavorited(userId: string, shopId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Patterns
  async getPatterns(filters?: { search?: string; difficulty?: string; quiltType?: string; sort?: string }): Promise<Pattern[]> {
    let query = db.select().from(patterns);
    
    // Simple select - filtering done in memory for simplicity
    const results = await query;
    
    let filtered = results;
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.designerName.toLowerCase().includes(search)
      );
    }
    
    if (filters?.difficulty && filters.difficulty !== "All") {
      filtered = filtered.filter(p => p.difficulty?.toLowerCase() === filters.difficulty?.toLowerCase());
    }
    
    if (filters?.quiltType && filters.quiltType !== "All") {
      filtered = filtered.filter(p => p.quiltType === filters.quiltType);
    }
    
    // Sort
    if (filters?.sort === "popular") {
      filtered.sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0));
    } else if (filters?.sort === "projects") {
      filtered.sort((a, b) => (b.projectCount || 0) - (a.projectCount || 0));
    } else {
      // Default: newest
      filtered.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }
    
    return filtered;
  }

  async getPattern(id: string): Promise<Pattern | undefined> {
    const [pattern] = await db.select().from(patterns).where(eq(patterns.id, id));
    return pattern;
  }

  async createPattern(pattern: InsertPattern): Promise<Pattern> {
    const [created] = await db.insert(patterns).values(pattern).returning();
    return created;
  }

  // Blocks
  async getBlocks(filters?: { search?: string; difficulty?: string; blockType?: string; sort?: string }): Promise<Block[]> {
    const results = await db.select().from(blocks);
    
    let filtered = results;
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(search) || 
        b.designerName.toLowerCase().includes(search)
      );
    }
    
    if (filters?.difficulty && filters.difficulty !== "All") {
      filtered = filtered.filter(b => b.difficulty?.toLowerCase() === filters.difficulty?.toLowerCase());
    }
    
    if (filters?.blockType && filters.blockType !== "All") {
      filtered = filtered.filter(b => b.blockType === filters.blockType);
    }
    
    return filtered;
  }

  async getBlock(id: string): Promise<Block | undefined> {
    const [block] = await db.select().from(blocks).where(eq(blocks.id, id));
    return block;
  }

  async createBlock(block: InsertBlock): Promise<Block> {
    const [created] = await db.insert(blocks).values(block).returning();
    return created;
  }

  // Fabrics
  async getFabrics(filters?: { search?: string; fabricType?: string; printStyle?: string; sort?: string }): Promise<Fabric[]> {
    const results = await db.select().from(fabrics);
    
    let filtered = results;
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(search) || 
        f.designerName.toLowerCase().includes(search) ||
        f.brandName.toLowerCase().includes(search)
      );
    }
    
    if (filters?.fabricType && filters.fabricType !== "All") {
      filtered = filtered.filter(f => f.fabricType === filters.fabricType);
    }
    
    if (filters?.printStyle && filters.printStyle !== "All") {
      filtered = filtered.filter(f => f.printStyle === filters.printStyle);
    }
    
    // Sort
    if (filters?.sort === "popular") {
      filtered.sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0));
    } else if (filters?.sort === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: newest
      filtered.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }
    
    return filtered;
  }

  async getFabric(id: string): Promise<Fabric | undefined> {
    const [fabric] = await db.select().from(fabrics).where(eq(fabrics.id, id));
    return fabric;
  }

  async createFabric(fabric: InsertFabric): Promise<Fabric> {
    const [created] = await db.insert(fabrics).values(fabric).returning();
    return created;
  }

  // Projects
  async getProjects(filters?: { userId?: string; patternId?: string; publicOnly?: boolean; sort?: string }): Promise<Project[]> {
    const results = await db.select().from(projects);
    
    let filtered = results;
    
    if (filters?.userId) {
      filtered = filtered.filter(p => p.userId === filters.userId);
    }
    
    if (filters?.patternId) {
      filtered = filtered.filter(p => p.patternId === filters.patternId);
    }
    
    if (filters?.publicOnly) {
      filtered = filtered.filter(p => p.isPublic);
    }
    
    // Sort
    if (filters?.sort === "liked") {
      filtered.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    } else if (filters?.sort === "commented") {
      filtered.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    } else {
      // Default: recent
      filtered.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }
    
    return filtered;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async likeProject(projectId: string, userId: string): Promise<void> {
    // Check if already liked
    const [existing] = await db.select().from(projectLikes)
      .where(and(eq(projectLikes.projectId, projectId), eq(projectLikes.userId, userId)));
    
    if (!existing) {
      await db.insert(projectLikes).values({ projectId, userId });
      await db.update(projects)
        .set({ likeCount: sql`${projects.likeCount} + 1` })
        .where(eq(projects.id, projectId));
    }
  }

  // Favorites
  async getFavorites(userId: string): Promise<Favorite[]> {
    return await db.select().from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [created] = await db.insert(favorites).values(favorite).returning();
    return created;
  }

  async removeFavorite(id: string, userId: string): Promise<void> {
    await db.delete(favorites).where(and(eq(favorites.id, id), eq(favorites.userId, userId)));
  }

  // Queue
  async getQueue(userId: string): Promise<QueueItem[]> {
    return await db.select().from(queue)
      .where(eq(queue.userId, userId))
      .orderBy(asc(queue.priority), desc(queue.createdAt));
  }

  async addToQueue(item: InsertQueue): Promise<QueueItem> {
    const [created] = await db.insert(queue).values(item).returning();
    return created;
  }

  async removeFromQueue(id: string, userId: string): Promise<void> {
    await db.delete(queue).where(and(eq(queue.id, id), eq(queue.userId, userId)));
  }

  // Library
  async getLibrary(userId: string): Promise<LibraryItem[]> {
    return await db.select().from(library)
      .where(eq(library.userId, userId))
      .orderBy(desc(library.createdAt));
  }

  async addToLibrary(item: InsertLibrary): Promise<LibraryItem> {
    const [created] = await db.insert(library).values(item).returning();
    return created;
  }

  async removeFromLibrary(id: string, userId: string): Promise<void> {
    await db.delete(library).where(and(eq(library.id, id), eq(library.userId, userId)));
  }

  // Comments
  async getComments(projectId: string): Promise<Comment[]> {
    return await db.select().from(comments)
      .where(eq(comments.projectId, projectId))
      .orderBy(desc(comments.createdAt));
  }

  async addComment(comment: InsertComment): Promise<Comment> {
    const [created] = await db.insert(comments).values(comment).returning();
    
    // Update comment count
    await db.update(projects)
      .set({ commentCount: sql`${projects.commentCount} + 1` })
      .where(eq(projects.id, comment.projectId));
    
    return created;
  }

  // User Profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }

  async updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updated] = await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId)).returning();
    return updated;
  }

  async getPublicProfiles(search?: string): Promise<UserProfile[]> {
    const results = await db.select().from(userProfiles).where(eq(userProfiles.isPublic, true));
    if (search) {
      const s = search.toLowerCase();
      return results.filter(p => p.displayName?.toLowerCase().includes(s) || p.location?.toLowerCase().includes(s));
    }
    return results;
  }

  // Forum Categories
  async getForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories).orderBy(asc(forumCategories.sortOrder));
  }

  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const [created] = await db.insert(forumCategories).values(category).returning();
    return created;
  }

  // Forum Threads
  async getForumThreads(categoryId: string): Promise<ForumThread[]> {
    return await db.select().from(forumThreads)
      .where(eq(forumThreads.categoryId, categoryId))
      .orderBy(desc(forumThreads.isPinned), desc(forumThreads.lastPostAt), desc(forumThreads.createdAt));
  }

  async getForumThread(id: string): Promise<ForumThread | undefined> {
    const [thread] = await db.select().from(forumThreads).where(eq(forumThreads.id, id));
    if (thread) {
      await db.update(forumThreads).set({ viewCount: sql`${forumThreads.viewCount} + 1` }).where(eq(forumThreads.id, id));
    }
    return thread;
  }

  async createForumThread(thread: InsertForumThread): Promise<ForumThread> {
    const [created] = await db.insert(forumThreads).values(thread).returning();
    await db.update(forumCategories)
      .set({ threadCount: sql`${forumCategories.threadCount} + 1` })
      .where(eq(forumCategories.id, thread.categoryId));
    return created;
  }

  // Forum Posts
  async getForumPosts(threadId: string): Promise<ForumPost[]> {
    return await db.select().from(forumPosts)
      .where(eq(forumPosts.threadId, threadId))
      .orderBy(asc(forumPosts.createdAt));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [created] = await db.insert(forumPosts).values(post).returning();
    const thread = await this.getForumThread(post.threadId);
    if (thread) {
      await db.update(forumThreads)
        .set({ 
          postCount: sql`${forumThreads.postCount} + 1`,
          lastPostAt: new Date(),
          lastPostUserId: post.userId,
          lastPostUserName: post.userName
        })
        .where(eq(forumThreads.id, post.threadId));
      await db.update(forumCategories)
        .set({ postCount: sql`${forumCategories.postCount} + 1` })
        .where(eq(forumCategories.id, thread.categoryId));
    }
    return created;
  }

  // Friendships
  async getFriends(userId: string): Promise<Friendship[]> {
    const results = await db.select().from(friendships)
      .where(and(
        eq(friendships.status, "accepted"),
        or(eq(friendships.requesterId, userId), eq(friendships.receiverId, userId))
      ));
    return results;
  }

  async getFriendRequests(userId: string): Promise<Friendship[]> {
    return await db.select().from(friendships)
      .where(and(eq(friendships.receiverId, userId), eq(friendships.status, "pending")));
  }

  async sendFriendRequest(friendship: InsertFriendship): Promise<Friendship> {
    const [created] = await db.insert(friendships).values(friendship).returning();
    return created;
  }

  async respondToFriendRequest(id: string, status: string): Promise<Friendship | undefined> {
    const [updated] = await db.update(friendships).set({ status }).where(eq(friendships.id, id)).returning();
    return updated;
  }

  async removeFriend(id: string, userId: string): Promise<void> {
    await db.delete(friendships).where(
      and(
        eq(friendships.id, id),
        or(eq(friendships.requesterId, userId), eq(friendships.receiverId, userId))
      )
    );
  }

  // Groups
  async getGroups(search?: string): Promise<Group[]> {
    const results = await db.select().from(groups).where(eq(groups.isPublic, true)).orderBy(desc(groups.memberCount));
    if (search) {
      const s = search.toLowerCase();
      return results.filter(g => g.name.toLowerCase().includes(s) || g.description?.toLowerCase().includes(s));
    }
    return results;
  }

  async getGroup(id: string): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group;
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const [created] = await db.insert(groups).values(group).returning();
    // Creator auto-joins as admin
    await db.insert(groupMemberships).values({
      groupId: created.id,
      userId: group.creatorId,
      userName: group.creatorName,
      role: "admin"
    });
    return created;
  }

  async updateGroup(id: string, data: Partial<InsertGroup>): Promise<Group | undefined> {
    const [updated] = await db.update(groups).set(data).where(eq(groups.id, id)).returning();
    return updated;
  }

  // Group Memberships
  async getGroupMembers(groupId: string): Promise<GroupMembership[]> {
    return await db.select().from(groupMemberships).where(eq(groupMemberships.groupId, groupId));
  }

  async getUserGroups(userId: string): Promise<GroupMembership[]> {
    return await db.select().from(groupMemberships).where(eq(groupMemberships.userId, userId));
  }

  async joinGroup(membership: InsertGroupMembership): Promise<GroupMembership> {
    const [created] = await db.insert(groupMemberships).values(membership).returning();
    await db.update(groups)
      .set({ memberCount: sql`${groups.memberCount} + 1` })
      .where(eq(groups.id, membership.groupId));
    return created;
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    await db.delete(groupMemberships).where(
      and(eq(groupMemberships.groupId, groupId), eq(groupMemberships.userId, userId))
    );
    await db.update(groups)
      .set({ memberCount: sql`${groups.memberCount} - 1` })
      .where(eq(groups.id, groupId));
  }

  // Conversations
  async getConversations(userId: string): Promise<{ conversation: Conversation; participants: ConversationParticipant[] }[]> {
    const userParticipations = await db.select().from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));
    
    const results: { conversation: Conversation; participants: ConversationParticipant[] }[] = [];
    for (const participation of userParticipations) {
      const [conversation] = await db.select().from(conversations).where(eq(conversations.id, participation.conversationId));
      const participants = await db.select().from(conversationParticipants).where(eq(conversationParticipants.conversationId, participation.conversationId));
      if (conversation) {
        results.push({ conversation, participants });
      }
    }
    return results.sort((a, b) => 
      new Date(b.conversation.lastMessageAt || b.conversation.createdAt || 0).getTime() - 
      new Date(a.conversation.lastMessageAt || a.conversation.createdAt || 0).getTime()
    );
  }

  async getConversation(id: string): Promise<{ conversation: Conversation; participants: ConversationParticipant[] } | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conversation) return undefined;
    const participants = await db.select().from(conversationParticipants).where(eq(conversationParticipants.conversationId, id));
    return { conversation, participants };
  }

  async createConversation(participantUserIds: string[], participantData: { userId: string; userName?: string; userImage?: string }[]): Promise<Conversation> {
    const [created] = await db.insert(conversations).values({}).returning();
    for (const data of participantData) {
      await db.insert(conversationParticipants).values({
        conversationId: created.id,
        ...data
      });
    }
    return created;
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    await db.update(conversations)
      .set({ 
        lastMessageAt: new Date(),
        lastMessagePreview: message.content.substring(0, 100)
      })
      .where(eq(conversations.id, message.conversationId));
    // Mark as unread for other participants
    await db.update(conversationParticipants)
      .set({ hasUnread: true })
      .where(and(
        eq(conversationParticipants.conversationId, message.conversationId),
        sql`${conversationParticipants.userId} != ${message.senderId}`
      ));
    return created;
  }

  // Events
  async getEvents(filters?: { search?: string; eventType?: string; region?: string }): Promise<Event[]> {
    const results = await db.select().from(events).orderBy(desc(events.createdAt));
    
    let filtered = results;
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(search) ||
        e.description?.toLowerCase().includes(search) ||
        e.location?.toLowerCase().includes(search)
      );
    }
    
    if (filters?.eventType && filters.eventType !== "all") {
      filtered = filtered.filter(e => e.eventType === filters.eventType);
    }
    
    if (filters?.region && filters.region !== "all") {
      filtered = filtered.filter(e => e.region === filters.region);
    }
    
    return filtered;
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async markEventInterested(eventId: string, userId: string): Promise<void> {
    await db.update(events)
      .set({ interestedCount: sql`${events.interestedCount} + 1` })
      .where(eq(events.id, eventId));
  }

  // Quilt Shops
  async getQuiltShops(filters?: { search?: string; shopType?: string }): Promise<QuiltShop[]> {
    const results = await db.select().from(quiltShops).orderBy(desc(quiltShops.favoriteCount), desc(quiltShops.createdAt));
    
    let filtered = results;
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.city?.toLowerCase().includes(search) ||
        s.state?.toLowerCase().includes(search) ||
        s.country?.toLowerCase().includes(search)
      );
    }
    
    if (filters?.shopType && filters.shopType !== "all") {
      filtered = filtered.filter(s => s.shopType === filters.shopType);
    }
    
    return filtered;
  }

  async getQuiltShop(id: string): Promise<QuiltShop | undefined> {
    const [shop] = await db.select().from(quiltShops).where(eq(quiltShops.id, id));
    return shop;
  }

  async createQuiltShop(shop: InsertQuiltShop): Promise<QuiltShop> {
    const [created] = await db.insert(quiltShops).values(shop).returning();
    return created;
  }

  async deleteQuiltShop(id: string): Promise<void> {
    await db.delete(shopFavorites).where(eq(shopFavorites.shopId, id));
    await db.delete(quiltShops).where(eq(quiltShops.id, id));
  }

  async getShopFavorites(userId: string): Promise<ShopFavorite[]> {
    return await db.select().from(shopFavorites).where(eq(shopFavorites.userId, userId));
  }

  async addShopFavorite(userId: string, shopId: string): Promise<ShopFavorite> {
    const [created] = await db.insert(shopFavorites).values({ userId, shopId }).returning();
    await db.update(quiltShops)
      .set({ favoriteCount: sql`${quiltShops.favoriteCount} + 1` })
      .where(eq(quiltShops.id, shopId));
    return created;
  }

  async removeShopFavorite(userId: string, shopId: string): Promise<void> {
    await db.delete(shopFavorites).where(
      and(eq(shopFavorites.userId, userId), eq(shopFavorites.shopId, shopId))
    );
    await db.update(quiltShops)
      .set({ favoriteCount: sql`${quiltShops.favoriteCount} - 1` })
      .where(eq(quiltShops.id, shopId));
  }

  async isShopFavorited(userId: string, shopId: string): Promise<boolean> {
    const [result] = await db.select().from(shopFavorites).where(
      and(eq(shopFavorites.userId, userId), eq(shopFavorites.shopId, shopId))
    );
    return !!result;
  }
}

export const storage = new DatabaseStorage();
