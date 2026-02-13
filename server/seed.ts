import { db } from "./db";
import { patterns, fabrics, projects, forumCategories, groups } from "@shared/schema";

const samplePatterns = [
  {
    name: "Modern Log Cabin",
    description: "A contemporary take on the classic log cabin block. This pattern features bold, asymmetrical strips in a fresh color palette. Perfect for beginners looking to try something modern.",
    designerId: "designer-1",
    designerName: "Sarah Mitchell",
    difficulty: "beginner",
    quiltType: "Throw",
    techniques: ["piecing"],
    sizes: ["baby", "throw", "twin"],
    fabricRequirements: { background: "2 yards", accent: "1.5 yards", binding: "0.5 yards" },
    isFree: true,
    projectCount: 24,
    favoriteCount: 156,
  },
  {
    name: "Starlight Sampler",
    description: "A stunning sampler quilt featuring 12 different star blocks. Each block teaches a different technique while creating a cohesive, beautiful finished quilt.",
    designerId: "designer-2",
    designerName: "Emily Chen",
    difficulty: "intermediate",
    quiltType: "Bed Quilt",
    techniques: ["piecing", "foundation paper piecing"],
    sizes: ["queen", "king"],
    fabricRequirements: { background: "5 yards", stars: "3 yards total", binding: "0.75 yards" },
    isFree: false,
    price: 1295,
    projectCount: 87,
    favoriteCount: 342,
  },
  {
    name: "Garden Path",
    description: "Curved piecing creates a beautiful meandering path through your fabric garden. This intermediate pattern is a great introduction to sewing curves.",
    designerId: "designer-3",
    designerName: "Maria Garcia",
    difficulty: "intermediate",
    quiltType: "Wall Quilt",
    techniques: ["curved piecing"],
    sizes: ["wall"],
    fabricRequirements: { background: "1.5 yards", prints: "2 yards assorted", binding: "0.25 yards" },
    isFree: false,
    price: 895,
    projectCount: 45,
    favoriteCount: 198,
  },
  {
    name: "Simple Squares",
    description: "The perfect first quilt! Simple squares come together quickly for a satisfying finish. Great for using fat quarters or charm packs.",
    designerId: "designer-1",
    designerName: "Sarah Mitchell",
    difficulty: "beginner",
    quiltType: "Baby Quilt",
    techniques: ["piecing"],
    sizes: ["baby", "throw"],
    fabricRequirements: { squares: "1 charm pack", background: "1 yard", binding: "0.25 yards" },
    isFree: true,
    projectCount: 156,
    favoriteCount: 423,
  },
  {
    name: "Kaleidoscope Dreams",
    description: "Advanced foundation paper piecing creates mesmerizing kaleidoscope effects. This challenging pattern rewards skilled quilters with a show-stopping result.",
    designerId: "designer-4",
    designerName: "Jennifer Woods",
    difficulty: "advanced",
    quiltType: "Wall Quilt",
    techniques: ["foundation paper piecing"],
    sizes: ["wall", "throw"],
    fabricRequirements: { prints: "3 yards assorted", background: "2 yards", binding: "0.5 yards" },
    isFree: false,
    price: 1595,
    projectCount: 23,
    favoriteCount: 287,
  },
  {
    name: "Hexie Garden",
    description: "English paper pieced hexagons create a beautiful flower garden. A relaxing hand-stitching project perfect for on-the-go quilting.",
    designerId: "designer-5",
    designerName: "Amanda Lee",
    difficulty: "intermediate",
    quiltType: "Throw",
    techniques: ["english paper piecing", "appliqué"],
    sizes: ["throw", "queen"],
    fabricRequirements: { florals: "4 yards assorted", background: "3 yards", binding: "0.5 yards" },
    isFree: false,
    price: 1195,
    projectCount: 67,
    favoriteCount: 289,
  },
];

const sampleFabrics = [
  {
    name: "Kona Cotton - White",
    designerName: "Robert Kaufman",
    brandName: "Robert Kaufman",
    fabricType: "Cotton",
    printStyle: "Solid",
    colors: ["White"],
    projectCount: 234,
    favoriteCount: 567,
  },
  {
    name: "Ruby Star Society Speckled",
    designerName: "Rashida Coleman-Hale",
    brandName: "Moda",
    collection: "Speckled",
    fabricType: "Cotton",
    printStyle: "Solid",
    colors: ["Multiple"],
    projectCount: 189,
    favoriteCount: 445,
  },
  {
    name: "Liberty Tana Lawn - Betsy",
    designerName: "Liberty",
    brandName: "Liberty of London",
    collection: "Tana Lawn Classics",
    fabricType: "Lawn",
    printStyle: "Floral",
    colors: ["Blue", "Pink", "Green"],
    projectCount: 78,
    favoriteCount: 234,
  },
  {
    name: "Cotton+Steel Basics - Add It Up",
    designerName: "Alexia Abegg",
    brandName: "Cotton+Steel",
    collection: "Basics",
    fabricType: "Cotton",
    printStyle: "Geometric",
    colors: ["Multiple"],
    projectCount: 112,
    favoriteCount: 298,
  },
  {
    name: "Art Gallery Pure Solids",
    designerName: "Art Gallery Fabrics",
    brandName: "Art Gallery",
    collection: "Pure Solids",
    fabricType: "Cotton",
    printStyle: "Solid",
    colors: ["Multiple"],
    projectCount: 156,
    favoriteCount: 389,
  },
  {
    name: "Rifle Paper Co. Wildwood",
    designerName: "Rifle Paper Co.",
    brandName: "Cotton+Steel",
    collection: "Wildwood",
    fabricType: "Cotton",
    printStyle: "Floral",
    colors: ["Cream", "Pink", "Green"],
    projectCount: 89,
    favoriteCount: 312,
  },
];

const sampleForumCategories = [
  {
    name: "General Discussion",
    description: "Chat about anything quilting-related! Share your latest finds, ask questions, or just say hello.",
    icon: "MessageCircle",
    sortOrder: 1,
  },
  {
    name: "Pattern Help",
    description: "Stuck on a pattern? Need clarification on instructions? Get help from fellow quilters here.",
    icon: "HelpCircle",
    sortOrder: 2,
  },
  {
    name: "Fabric & Notions",
    description: "Discuss your favorite fabrics, threads, batting, and other quilting supplies.",
    icon: "Scissors",
    sortOrder: 3,
  },
  {
    name: "Show & Tell",
    description: "Share your finished quilts and works in progress. We love seeing what you're making!",
    icon: "Camera",
    sortOrder: 4,
  },
  {
    name: "Techniques & Tips",
    description: "Learn and share quilting techniques, from piecing to quilting to binding.",
    icon: "Lightbulb",
    sortOrder: 5,
  },
  {
    name: "Machine Talk",
    description: "Discuss sewing machines, long arm quilters, and other equipment.",
    icon: "Settings",
    sortOrder: 6,
  },
];

const sampleGroups = [
  {
    name: "Modern Quilters Guild",
    description: "For quilters who love modern aesthetics, minimalist designs, and bold colors. Share your modern quilts and get inspired!",
    creatorId: "sample-user-1",
    creatorName: "QuiltLover123",
    isPublic: true,
    memberCount: 234,
  },
  {
    name: "Beginner Quilters Support",
    description: "A friendly space for those just starting their quilting journey. No question is too basic here!",
    creatorId: "sample-user-2",
    creatorName: "SewHappy",
    isPublic: true,
    memberCount: 567,
  },
  {
    name: "English Paper Piecing Lovers",
    description: "Hand stitching enthusiasts unite! Share your hexies, clamshells, and all things EPP.",
    creatorId: "sample-user-3",
    creatorName: "ModernQuilter",
    isPublic: true,
    memberCount: 189,
  },
  {
    name: "Quilt-Along Central",
    description: "Join our monthly quilt-alongs and stitch together with quilters from around the world.",
    creatorId: "sample-user-4",
    creatorName: "FabricAddict",
    isPublic: true,
    memberCount: 412,
  },
  {
    name: "Scrappy Quilters",
    description: "Love using your scraps? This is your tribe! Share scrap-busting projects and tips.",
    creatorId: "sample-user-5",
    creatorName: "PiecingPro",
    isPublic: true,
    memberCount: 298,
  },
];

const sampleProjects = [
  {
    userId: "sample-user-1",
    userName: "QuiltLover123",
    title: "My First Log Cabin",
    patternName: "Modern Log Cabin",
    status: "finished",
    notes: "This was such a fun project! I used a jelly roll from my stash and it came together so quickly. The pattern was easy to follow and I love how it turned out.",
    quiltSize: "throw",
    isPublic: true,
    likeCount: 45,
    commentCount: 12,
  },
  {
    userId: "sample-user-2",
    userName: "SewHappy",
    title: "Starlight for My Daughter",
    patternName: "Starlight Sampler",
    status: "in_progress",
    notes: "Making this as a graduation gift. Currently on block 8 of 12. The paper piecing blocks are challenging but so satisfying!",
    quiltSize: "queen",
    isPublic: true,
    likeCount: 67,
    commentCount: 23,
  },
  {
    userId: "sample-user-3",
    userName: "ModernQuilter",
    title: "Garden Path Wall Hanging",
    patternName: "Garden Path",
    status: "finished",
    notes: "My first curved piecing project! It was definitely a learning experience but I'm so proud of how it turned out.",
    quiltSize: "wall",
    isPublic: true,
    likeCount: 89,
    commentCount: 34,
  },
  {
    userId: "sample-user-4",
    userName: "FabricAddict",
    title: "Baby Quilt for Nephew",
    patternName: "Simple Squares",
    status: "finished",
    notes: "Made this in a weekend using charm packs from Ruby Star Society. Quick and cute!",
    quiltSize: "baby",
    isPublic: true,
    likeCount: 34,
    commentCount: 8,
  },
  {
    userId: "sample-user-5",
    userName: "PiecingPro",
    title: "Kaleidoscope Challenge",
    patternName: "Kaleidoscope Dreams",
    status: "planned",
    notes: "This is my dream project! Gathering fabrics now. Planning to start in the new year.",
    quiltSize: "wall",
    isPublic: true,
    likeCount: 23,
    commentCount: 5,
  },
];

export async function seedDatabase() {
  console.log("Starting database seed...");
  
  try {
    // Check if data already exists
    const existingPatterns = await db.select().from(patterns).limit(1);
    if (existingPatterns.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Insert patterns
    console.log("Inserting patterns...");
    await db.insert(patterns).values(samplePatterns);

    // Insert fabrics
    console.log("Inserting fabrics...");
    await db.insert(fabrics).values(sampleFabrics);

    // Insert projects
    console.log("Inserting projects...");
    await db.insert(projects).values(sampleProjects);

    // Insert forum categories
    console.log("Inserting forum categories...");
    await db.insert(forumCategories).values(sampleForumCategories);

    // Insert groups
    console.log("Inserting groups...");
    await db.insert(groups).values(sampleGroups);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
