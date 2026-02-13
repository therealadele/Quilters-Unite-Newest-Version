import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// =====================
// CONTENT TRANSLATIONS
// =====================
export const contentTranslations = pgTable("content_translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: text("content_type").notNull(),
  contentId: varchar("content_id").notNull(),
  field: text("field").notNull(),
  language: text("language").notNull(),
  translatedText: text("translated_text").notNull(),
  sourceLanguage: text("source_language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("content_translations_unique_idx").on(
    table.contentType, table.contentId, table.field, table.language
  ),
]);

export const insertContentTranslationSchema = createInsertSchema(contentTranslations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContentTranslation = z.infer<typeof insertContentTranslationSchema>;
export type ContentTranslation = typeof contentTranslations.$inferSelect;

// =====================
// PATTERNS
// =====================
export const patterns = pgTable("patterns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  designerId: varchar("designer_id").notNull(),
  designerName: text("designer_name").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  quiltType: text("quilt_type").notNull(), // bed quilt, wall quilt, table runner, etc.
  category: text("category"), // Quilt, Bag, Clothes, Decor, Other
  techniques: text("techniques").array(), // piecing, paper piecing, appliqué, etc.
  sizes: text("sizes").array(), // baby, throw, twin, queen, king
  fabricRequirements: jsonb("fabric_requirements"), // { background: "2 yards", accent: "1 yard" }
  imageUrl: text("image_url"),
  price: integer("price").default(0), // in cents, 0 = free
  isFree: boolean("is_free").default(true),
  downloadUrl: text("download_url"),
  sourceType: text("source_type"), // publish_year, print, blog
  sourceYear: text("source_year"),
  sourceLink: text("source_link"),
  tags: text("tags").array(),
  languages: text("languages").array(),
  photos: jsonb("photos"), // array of { url, caption, copyright }
  projectCount: integer("project_count").default(0),
  favoriteCount: integer("favorite_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patternsRelations = relations(patterns, ({ many }) => ({
  projects: many(projects),
  favorites: many(favorites),
  queue: many(queue),
  library: many(library),
}));

export const insertPatternSchema = createInsertSchema(patterns).omit({
  id: true,
  createdAt: true,
  projectCount: true,
  favoriteCount: true,
});

export type InsertPattern = z.infer<typeof insertPatternSchema>;
export type Pattern = typeof patterns.$inferSelect;

// =====================
// BLOCKS
// =====================
export const blocks = pgTable("blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  designerId: varchar("designer_id").notNull(),
  designerName: text("designer_name").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  blockType: text("block_type").notNull(), // traditional, modern, foundation, paper pieced, appliqué
  category: text("category"), // Traditional, Modern, Foundation, etc.
  techniques: text("techniques").array(), // piecing, paper piecing, appliqué, etc.
  sizes: text("sizes").array(), // 6", 12", 18", etc.
  finishedSize: text("finished_size"),
  imageUrl: text("image_url"),
  price: integer("price").default(0), // in cents, 0 = free
  isFree: boolean("is_free").default(true),
  downloadUrl: text("download_url"),
  sourceType: text("source_type"), // publish_year, print, blog
  sourceYear: text("source_year"),
  sourceLink: text("source_link"),
  tags: text("tags").array(),
  languages: text("languages").array(),
  photos: jsonb("photos"), // array of { url, caption, copyright }
  projectCount: integer("project_count").default(0),
  favoriteCount: integer("favorite_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blocksRelations = relations(blocks, ({ many }) => ({
  favorites: many(favorites),
}));

export const insertBlockSchema = createInsertSchema(blocks).omit({
  id: true,
  createdAt: true,
  projectCount: true,
  favoriteCount: true,
});

export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type Block = typeof blocks.$inferSelect;

// =====================
// FABRICS (kept for backwards compatibility)
// =====================
export const fabrics = pgTable("fabrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  designerName: text("designer_name").notNull(),
  brandName: text("brand_name").notNull(),
  collection: text("collection"),
  fabricType: text("fabric_type").notNull(), // cotton, linen, flannel, etc.
  printStyle: text("print_style"), // solid, floral, geometric, etc.
  colors: text("colors").array(),
  imageUrl: text("image_url"),
  swatches: jsonb("swatches"), // array of color swatches
  projectCount: integer("project_count").default(0),
  favoriteCount: integer("favorite_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fabricsRelations = relations(fabrics, ({ many }) => ({
  projects: many(projectFabrics),
  favorites: many(favorites),
}));

export const insertFabricSchema = createInsertSchema(fabrics).omit({
  id: true,
  createdAt: true,
  projectCount: true,
  favoriteCount: true,
});

export type InsertFabric = z.infer<typeof insertFabricSchema>;
export type Fabric = typeof fabrics.$inferSelect;

// =====================
// PROJECTS
// =====================
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userName: text("user_name"),
  userImage: text("user_image"),
  title: text("title").notNull(),
  patternId: varchar("pattern_id"),
  patternName: text("pattern_name"),
  status: text("status").notNull().default("planned"), // planned, in_progress, finished
  notes: text("notes"),
  photos: text("photos").array(),
  quiltSize: text("quilt_size"),
  isPublic: boolean("is_public").default(true),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  pattern: one(patterns, {
    fields: [projects.patternId],
    references: [patterns.id],
  }),
  fabrics: many(projectFabrics),
  comments: many(comments),
  likes: many(projectLikes),
}));

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  likeCount: true,
  commentCount: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// =====================
// PROJECT FABRICS (junction table)
// =====================
export const projectFabrics = pgTable("project_fabrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  fabricId: varchar("fabric_id").notNull(),
  usage: text("usage"), // background, accent, binding, etc.
});

export const projectFabricsRelations = relations(projectFabrics, ({ one }) => ({
  project: one(projects, {
    fields: [projectFabrics.projectId],
    references: [projects.id],
  }),
  fabric: one(fabrics, {
    fields: [projectFabrics.fabricId],
    references: [fabrics.id],
  }),
}));

// =====================
// FAVORITES
// =====================
export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  itemType: text("item_type").notNull(), // pattern, fabric, project, designer
  itemId: varchar("item_id").notNull(),
  itemName: text("item_name"),
  itemImage: text("item_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// =====================
// QUEUE (planned quilts)
// =====================
export const queue = pgTable("queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  patternId: varchar("pattern_id").notNull(),
  patternName: text("pattern_name"),
  patternImage: text("pattern_image"),
  priority: integer("priority").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const queueRelations = relations(queue, ({ one }) => ({
  pattern: one(patterns, {
    fields: [queue.patternId],
    references: [patterns.id],
  }),
}));

export const insertQueueSchema = createInsertSchema(queue).omit({
  id: true,
  createdAt: true,
});

export type InsertQueue = z.infer<typeof insertQueueSchema>;
export type QueueItem = typeof queue.$inferSelect;

// =====================
// LIBRARY (owned patterns)
// =====================
export const library = pgTable("library", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  patternId: varchar("pattern_id").notNull(),
  patternName: text("pattern_name"),
  patternImage: text("pattern_image"),
  format: text("format"), // pdf, printed, book, magazine
  source: text("source"), // where purchased/obtained
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const libraryRelations = relations(library, ({ one }) => ({
  pattern: one(patterns, {
    fields: [library.patternId],
    references: [patterns.id],
  }),
}));

export const insertLibrarySchema = createInsertSchema(library).omit({
  id: true,
  createdAt: true,
});

export type InsertLibrary = z.infer<typeof insertLibrarySchema>;
export type LibraryItem = typeof library.$inferSelect;

// =====================
// COMMENTS
// =====================
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name"),
  userImage: text("user_image"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  project: one(projects, {
    fields: [comments.projectId],
    references: [projects.id],
  }),
}));

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// =====================
// PROJECT LIKES
// =====================
export const projectLikes = pgTable("project_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectLikesRelations = relations(projectLikes, ({ one }) => ({
  project: one(projects, {
    fields: [projectLikes.projectId],
    references: [projects.id],
  }),
}));

// =====================
// USER PROFILES (community extension)
// =====================
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  
  // Basic info
  email: text("email"),
  nickname: text("nickname"),
  displayName: text("display_name"),
  firstName: text("first_name"),
  pronouns: text("pronouns"),
  website: text("website"),
  
  // Birthday
  birthdayMonth: integer("birthday_month"),
  birthdayDay: integer("birthday_day"),
  
  // Location
  country: text("country"),
  provinceState: text("province_state"),
  city: text("city"),
  
  // Quilting preferences
  yearsQuilting: text("years_quilting"),
  favoriteQuiltingForm: text("favorite_quilting_form"),
  favoriteDesigner: text("favorite_designer"),
  quiltingExperience: text("quilting_experience"), // beginner, intermediate, advanced, expert
  favoriteStyles: text("favorite_styles").array(),
  
  // Personal
  kidsPets: text("kids_pets"),
  favoriteColors: text("favorite_colors"),
  
  // Preferences
  measurementUnit: text("measurement_unit"), // 'yards' or 'metric'
  preferredLanguage: text("preferred_language").default("en"),
  
  // Privacy
  showOnline: boolean("show_online").default(true),
  acceptMessages: boolean("accept_messages").default(true),
  isPublic: boolean("is_public").default(true),
  
  // Custom fields
  customField1Label: text("custom_field1_label"),
  customField1Value: text("custom_field1_value"),
  customField2Label: text("custom_field2_label"),
  customField2Value: text("custom_field2_value"),
  customField3Label: text("custom_field3_label"),
  customField3Value: text("custom_field3_value"),
  
  // Social links - array of { site: string, handle: string }
  socialLinks: jsonb("social_links"),
  
  // About me
  bio: text("bio"),
  aboutMe: text("about_me"),
  
  // Designer-specific fields
  designerBackground: text("designer_background"),
  designerInspiration: text("designer_inspiration"),
  designerPatternLinks: jsonb("designer_pattern_links"),
  designerShopUrl: text("designer_shop_url"),
  
  // Legacy fields
  location: text("location"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// =====================
// FORUM CATEGORIES
// =====================
export const forumCategories = pgTable("forum_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  sortOrder: integer("sort_order").default(0),
  threadCount: integer("thread_count").default(0),
  postCount: integer("post_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  threads: many(forumThreads),
}));

export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
  createdAt: true,
  threadCount: true,
  postCount: true,
});

export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;

// =====================
// FORUM THREADS
// =====================
export const forumThreads = pgTable("forum_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name"),
  userImage: text("user_image"),
  title: text("title").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  postCount: integer("post_count").default(0),
  lastPostAt: timestamp("last_post_at"),
  lastPostUserId: varchar("last_post_user_id"),
  lastPostUserName: text("last_post_user_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumThreadsRelations = relations(forumThreads, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumThreads.categoryId],
    references: [forumCategories.id],
  }),
  posts: many(forumPosts),
}));

export const insertForumThreadSchema = createInsertSchema(forumThreads).omit({
  id: true,
  createdAt: true,
  viewCount: true,
  postCount: true,
  lastPostAt: true,
  lastPostUserId: true,
  lastPostUserName: true,
});

export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;
export type ForumThread = typeof forumThreads.$inferSelect;

// =====================
// FORUM POSTS
// =====================
export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name"),
  userImage: text("user_image"),
  content: text("content").notNull(),
  isEdited: boolean("is_edited").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumPostsRelations = relations(forumPosts, ({ one }) => ({
  thread: one(forumThreads, {
    fields: [forumPosts.threadId],
    references: [forumThreads.id],
  }),
}));

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  isEdited: true,
});

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

// =====================
// FRIENDSHIPS
// =====================
export const friendships = pgTable("friendships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull(),
  requesterName: text("requester_name"),
  requesterImage: text("requester_image"),
  receiverId: varchar("receiver_id").notNull(),
  receiverName: text("receiver_name"),
  receiverImage: text("receiver_image"),
  status: text("status").notNull().default("pending"), // pending, accepted, blocked
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFriendshipSchema = createInsertSchema(friendships).omit({
  id: true,
  createdAt: true,
});

export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
export type Friendship = typeof friendships.$inferSelect;

// =====================
// GROUPS
// =====================
export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  creatorId: varchar("creator_id").notNull(),
  creatorName: text("creator_name"),
  isPublic: boolean("is_public").default(true),
  memberCount: integer("member_count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(groupMemberships),
}));

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
  memberCount: true,
});

export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;

// =====================
// GROUP MEMBERSHIPS
// =====================
export const groupMemberships = pgTable("group_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name"),
  userImage: text("user_image"),
  role: text("role").notNull().default("member"), // admin, moderator, member
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupMembershipsRelations = relations(groupMemberships, ({ one }) => ({
  group: one(groups, {
    fields: [groupMemberships.groupId],
    references: [groups.id],
  }),
}));

export const insertGroupMembershipSchema = createInsertSchema(groupMemberships).omit({
  id: true,
  createdAt: true,
});

export type InsertGroupMembership = z.infer<typeof insertGroupMembershipSchema>;
export type GroupMembership = typeof groupMemberships.$inferSelect;

// =====================
// CONVERSATIONS (for private messaging)
// =====================
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lastMessageAt: timestamp("last_message_at"),
  lastMessagePreview: text("last_message_preview"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversationsRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(messages),
}));

export type Conversation = typeof conversations.$inferSelect;

// =====================
// CONVERSATION PARTICIPANTS
// =====================
export const conversationParticipants = pgTable("conversation_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name"),
  userImage: text("user_image"),
  hasUnread: boolean("has_unread").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversationParticipantsRelations = relations(conversationParticipants, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationParticipants.conversationId],
    references: [conversations.id],
  }),
}));

export type ConversationParticipant = typeof conversationParticipants.$inferSelect;

// =====================
// MESSAGES
// =====================
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  senderId: varchar("sender_id").notNull(),
  senderName: text("sender_name"),
  senderImage: text("sender_image"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// =====================
// EVENTS
// =====================
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(), // quilt_show, workshop, retreat, virtual
  region: text("region").notNull(), // north_america, south_america, europe, asia_pacific, middle_east, india, africa
  location: text("location"),
  eventDate: text("event_date"), // Date string like "March 15-17, 2026"
  eventTime: text("event_time"), // Time string like "10:00 AM - 5:00 PM"
  creatorId: varchar("creator_id").notNull(),
  creatorName: text("creator_name"),
  interestedCount: integer("interested_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  interestedCount: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Quilt Shops
export const quiltShops = pgTable("quilt_shops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  shopType: text("shop_type").notNull(), // online, physical, both
  description: text("description"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  postalCode: text("postal_code"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  googleMapsUrl: text("google_maps_url"),
  hours: text("hours"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  imageUrl: text("image_url"),
  favoriteCount: integer("favorite_count").default(0),
  submittedById: varchar("submitted_by_id").notNull(),
  submittedByName: text("submitted_by_name"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shopFavorites = pgTable("shop_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  shopId: varchar("shop_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuiltShopSchema = createInsertSchema(quiltShops).omit({
  id: true,
  createdAt: true,
  favoriteCount: true,
  isVerified: true,
});

export type InsertQuiltShop = z.infer<typeof insertQuiltShopSchema>;
export type QuiltShop = typeof quiltShops.$inferSelect;
export type ShopFavorite = typeof shopFavorites.$inferSelect;
