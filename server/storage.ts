import { users, type User, type InsertUser, content, type Content, type InsertContent, categories, type Category, type InsertCategory, subscriptionPlans, type SubscriptionPlan, type InsertSubscriptionPlan, favorites, type Favorite, type InsertFavorite } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Content methods
  getContent(id: number): Promise<Content | undefined>;
  getAllContent(): Promise<Content[]>;
  getContentByType(type: string): Promise<Content[]>;
  getContentByAccessLevel(accessLevel: string): Promise<Content[]>;
  getContentByCategory(category: string): Promise<Content[]>;
  getFeaturedContent(): Promise<Content[]>;
  getTrendingContent(): Promise<Content[]>;
  getNewContent(): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, data: Partial<Content>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
  incrementContentViews(id: number): Promise<void>;
  
  // Category methods
  getCategory(id: number): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, data: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Subscription plan methods
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | undefined>;
  deleteSubscriptionPlan(id: number): Promise<boolean>;
  
  // Favorite methods
  getFavoritesByUser(userId: number): Promise<Content[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, contentId: number): Promise<boolean>;
  
  // Admin methods
  getAdminStats(): Promise<{
    totalViews: number;
    premiumMembers: number;
    contentCount: {
      total: number;
      videos: number;
      photos: number;
      premium: number;
      free: number;
    };
    recentContent: Content[];
  }>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contents: Map<number, Content>;
  private categories: Map<number, Category>;
  private subscriptionPlans: Map<number, SubscriptionPlan>;
  private favorites: Map<number, Favorite>;
  sessionStore: session.SessionStore;
  
  currentUserId: number;
  currentContentId: number;
  currentCategoryId: number;
  currentPlanId: number;
  currentFavoriteId: number;
  
  constructor() {
    this.users = new Map();
    this.contents = new Map();
    this.categories = new Map();
    this.subscriptionPlans = new Map();
    this.favorites = new Map();
    
    this.currentUserId = 1;
    this.currentContentId = 1;
    this.currentCategoryId = 1;
    this.currentPlanId = 1;
    this.currentFavoriteId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Seed data for testing
    this.seedData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Content methods
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }
  
  async getAllContent(): Promise<Content[]> {
    return Array.from(this.contents.values());
  }
  
  async getContentByType(type: string): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(
      content => content.type === type && content.isPublished
    );
  }
  
  async getContentByAccessLevel(accessLevel: string): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(
      content => content.accessLevel === accessLevel && content.isPublished
    );
  }
  
  async getContentByCategory(category: string): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(
      content => content.categories.includes(category) && content.isPublished
    );
  }
  
  async getFeaturedContent(): Promise<Content[]> {
    // Return a sample of content with high views
    return Array.from(this.contents.values())
      .filter(content => content.isPublished)
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
  }
  
  async getTrendingContent(): Promise<Content[]> {
    // Return content with highest views
    return Array.from(this.contents.values())
      .filter(content => content.isPublished)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }
  
  async getNewContent(): Promise<Content[]> {
    // Return newest content based on creation date
    return Array.from(this.contents.values())
      .filter(content => content.isPublished)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }
  
  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.currentContentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const views = 0;
    
    const content: Content = { 
      ...insertContent, 
      id, 
      createdAt, 
      updatedAt, 
      views 
    };
    
    this.contents.set(id, content);
    return content;
  }
  
  async updateContent(id: number, data: Partial<Content>): Promise<Content | undefined> {
    const content = this.contents.get(id);
    if (!content) return undefined;
    
    const updatedContent = { 
      ...content, 
      ...data, 
      updatedAt: new Date() 
    };
    
    this.contents.set(id, updatedContent);
    return updatedContent;
  }
  
  async deleteContent(id: number): Promise<boolean> {
    return this.contents.delete(id);
  }
  
  async incrementContentViews(id: number): Promise<void> {
    const content = this.contents.get(id);
    if (content) {
      content.views++;
      this.contents.set(id, content);
    }
  }
  
  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, data: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...data };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Subscription plan methods
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }
  
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values()).filter(plan => plan.isActive);
  }
  
  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = this.currentPlanId++;
    const plan: SubscriptionPlan = { ...insertPlan, id };
    this.subscriptionPlans.set(id, plan);
    return plan;
  }
  
  async updateSubscriptionPlan(id: number, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const plan = this.subscriptionPlans.get(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...data };
    this.subscriptionPlans.set(id, updatedPlan);
    return updatedPlan;
  }
  
  async deleteSubscriptionPlan(id: number): Promise<boolean> {
    return this.subscriptionPlans.delete(id);
  }
  
  // Favorite methods
  async getFavoritesByUser(userId: number): Promise<Content[]> {
    const userFavorites = Array.from(this.favorites.values()).filter(
      favorite => favorite.userId === userId
    );
    
    return userFavorites.map(favorite => {
      const content = this.contents.get(favorite.contentId);
      return content!;
    }).filter(content => content !== undefined && content.isPublished);
  }
  
  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const createdAt = new Date();
    const favorite: Favorite = { ...insertFavorite, id, createdAt };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, contentId: number): Promise<boolean> {
    const favoriteToRemove = Array.from(this.favorites.values()).find(
      favorite => favorite.userId === userId && favorite.contentId === contentId
    );
    
    if (favoriteToRemove) {
      return this.favorites.delete(favoriteToRemove.id);
    }
    return false;
  }
  
  // Admin methods
  async getAdminStats(): Promise<{
    totalViews: number;
    premiumMembers: number;
    contentCount: {
      total: number;
      videos: number;
      photos: number;
      premium: number;
      free: number;
    };
    recentContent: Content[];
  }> {
    const contentArray = Array.from(this.contents.values());
    const totalViews = contentArray.reduce((sum, content) => sum + content.views, 0);
    const premiumMembers = Array.from(this.users.values()).filter(user => user.isPremium).length;
    
    const videos = contentArray.filter(content => content.type === 'video').length;
    const photos = contentArray.filter(content => content.type === 'photo').length;
    const premium = contentArray.filter(content => content.accessLevel === 'premium').length;
    const free = contentArray.filter(content => content.accessLevel === 'free').length;
    
    const recentContent = contentArray
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return {
      totalViews,
      premiumMembers,
      contentCount: {
        total: contentArray.length,
        videos,
        photos,
        premium,
        free
      },
      recentContent
    };
  }
  
  // Seed data for testing
  private seedData() {
    // Create admin user
    const adminUser: InsertUser = {
      username: 'admin',
      password: '$2b$10$6KxERgL9JS3O.F0D/EwHouD1i3I88gRfh0VOtdceMFsfrXi9a45Ge', // "password" hashed
      isAdmin: true,
      isPremium: true,
    };
    this.createUser(adminUser);
    
    // Create regular user
    const regularUser: InsertUser = {
      username: 'user',
      password: '$2b$10$6KxERgL9JS3O.F0D/EwHouD1i3I88gRfh0VOtdceMFsfrXi9a45Ge', // "password" hashed
      isAdmin: false,
      isPremium: false,
    };
    this.createUser(regularUser);
    
    // Create categories
    const categories = [
      { name: 'Photography', slug: 'photography', description: 'Photography tutorials and tips' },
      { name: 'Videography', slug: 'videography', description: 'Video production tutorials' },
      { name: 'Editing', slug: 'editing', description: 'Photo and video editing tutorials' },
      { name: 'Lighting', slug: 'lighting', description: 'Lighting techniques and setups' },
      { name: 'Equipment', slug: 'equipment', description: 'Camera equipment reviews and guides' }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Create subscription plans
    const subscriptionPlans = [
      {
        name: 'Monthly',
        description: 'Access all premium content with monthly billing',
        price: 999, // $9.99
        interval: 'monthly',
        features: ['Unlimited premium content access', 'HD video quality', 'New premium content weekly'],
        isActive: true
      },
      {
        name: 'Annual',
        description: 'Save 33% with annual billing',
        price: 7999, // $79.99
        interval: 'annually',
        features: ['Unlimited premium content access', '4K video quality', 'New premium content weekly', 'Priority support'],
        isActive: true
      },
      {
        name: 'Lifetime',
        description: 'One-time payment for lifetime access',
        price: 24999, // $249.99
        interval: 'lifetime',
        features: ['Unlimited premium content access', '4K video quality', 'All future premium content', 'Priority support'],
        isActive: true
      }
    ];
    
    subscriptionPlans.forEach(plan => {
      this.createSubscriptionPlan(plan);
    });
    
    // Create content
    const contentItems = [
      {
        title: 'Professional Photography Techniques',
        description: 'Learn the basics of professional outdoor photography',
        type: 'video',
        accessLevel: 'free',
        thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=340',
        contentUrl: 'https://example.com/videos/photography-techniques.mp4',
        duration: '12:45',
        categories: ['photography'],
        isPublished: true
      },
      {
        title: 'Advanced Aerial Cinematography',
        description: 'Master drone techniques for cinematic shots',
        type: 'video',
        accessLevel: 'premium',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=340',
        contentUrl: 'https://example.com/videos/aerial-cinematography.mp4',
        duration: '18:22',
        categories: ['videography', 'equipment'],
        isPublished: true
      },
      {
        title: 'Intro to Video Editing',
        description: 'Basic techniques for beginners',
        type: 'video',
        accessLevel: 'free',
        thumbnailUrl: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=340',
        contentUrl: 'https://example.com/videos/intro-video-editing.mp4',
        duration: '8:12',
        categories: ['editing', 'videography'],
        isPublished: true
      },
      {
        title: 'Studio Lighting Masterclass',
        description: 'Professional lighting techniques',
        type: 'video',
        accessLevel: 'premium',
        thumbnailUrl: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=340',
        contentUrl: 'https://example.com/videos/studio-lighting.mp4',
        duration: '22:18',
        categories: ['lighting', 'photography'],
        isPublished: true
      },
      {
        title: 'Camera Lens Guide',
        description: 'Understanding different lenses for photography',
        type: 'video',
        accessLevel: 'free',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225',
        contentUrl: 'https://example.com/videos/camera-lens-guide.mp4',
        duration: '15:33',
        categories: ['equipment', 'photography'],
        isPublished: true
      },
      {
        title: 'Advanced Photo Editing',
        description: 'Professional photo editing workflows',
        type: 'video',
        accessLevel: 'premium',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225',
        contentUrl: 'https://example.com/videos/advanced-photo-editing.mp4',
        duration: '27:42',
        categories: ['editing', 'photography'],
        isPublished: true
      },
      {
        title: 'Mobile Photography Tips',
        description: 'Take amazing photos with your smartphone',
        type: 'video',
        accessLevel: 'free',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225',
        contentUrl: 'https://example.com/videos/mobile-photography.mp4',
        duration: '10:15',
        categories: ['photography', 'equipment'],
        isPublished: true
      },
      {
        title: 'Cinematic Color Grading',
        description: 'Create cinematic looks with color grading',
        type: 'video',
        accessLevel: 'premium',
        thumbnailUrl: 'https://images.unsplash.com/photo-1601933470096-0e34634ffcde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225',
        contentUrl: 'https://example.com/videos/color-grading.mp4',
        duration: '19:27',
        categories: ['editing', 'videography'],
        isPublished: true
      },
      {
        title: 'Composition Basics',
        description: 'Learn the fundamentals of visual composition',
        type: 'video',
        accessLevel: 'free',
        thumbnailUrl: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225',
        contentUrl: 'https://example.com/videos/composition-basics.mp4',
        duration: '14:22',
        categories: ['photography', 'videography'],
        isPublished: true
      },
      {
        title: 'Studio Interview Lighting',
        description: 'Professional setup for perfect interviews',
        type: 'video',
        accessLevel: 'premium',
        thumbnailUrl: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=340',
        contentUrl: 'https://example.com/videos/interview-lighting.mp4',
        duration: '23:16',
        categories: ['lighting', 'videography'],
        isPublished: true
      },
      {
        title: 'Camera Setup Basics',
        description: 'Essential tips for beginners',
        type: 'video',
        accessLevel: 'free',
        thumbnailUrl: 'https://images.unsplash.com/photo-1610220941077-1ec123e7c043?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=340',
        contentUrl: 'https://example.com/videos/camera-setup.mp4',
        duration: '5:23',
        categories: ['equipment', 'photography', 'videography'],
        isPublished: true
      },
      {
        title: 'Advanced Video Editing Techniques',
        description: 'Professional editing workflow',
        type: 'video',
        accessLevel: 'premium',
        thumbnailUrl: 'https://pixabay.com/get/g5f04719ddfd75ec209c905c68222f4c90b742ef0df068d47c3b21744137796ac8ff52af14c75240743118bf9ab3824df0c693503abac434c910727a59e33eb3a_1280.jpg',
        contentUrl: 'https://example.com/videos/advanced-editing.mp4',
        duration: '31:49',
        categories: ['editing', 'videography'],
        isPublished: true
      }
    ];
    
    contentItems.forEach((item, index) => {
      const content = this.createContent(item);
      
      // Add some views to make the trending items realistic
      const randomViews = Math.floor(Math.random() * 10000) + 500;
      this.updateContent(content.id, { views: randomViews });
    });
  }
}

// Export the storage instance
// Database storage implementation
import { db } from "./db";
import { eq, desc, sql, and, exists, inArray, like } from "drizzle-orm";
import { QueryResult } from "drizzle-orm/pg-core";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Content methods
  async getContent(id: number): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(eq(content.id, id));
    return contentItem || undefined;
  }

  async getAllContent(): Promise<Content[]> {
    return await db.select().from(content);
  }

  async getContentByType(type: string): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(and(eq(content.type, type), eq(content.isPublished, true)));
  }

  async getContentByAccessLevel(accessLevel: string): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(and(eq(content.accessLevel, accessLevel), eq(content.isPublished, true)));
  }

  async getContentByCategory(category: string): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(
        and(
          sql`${content.categories} @> ARRAY[${category}]::text[]`,
          eq(content.isPublished, true)
        )
      );
  }

  async getFeaturedContent(): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.isPublished, true))
      .orderBy(desc(content.views))
      .limit(8);
  }

  async getTrendingContent(): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.isPublished, true))
      .orderBy(desc(content.views))
      .limit(10);
  }

  async getNewContent(): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.isPublished, true))
      .orderBy(desc(content.createdAt))
      .limit(6);
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [newContent] = await db
      .insert(content)
      .values(insertContent)
      .returning();
    return newContent;
  }

  async updateContent(id: number, data: Partial<Content>): Promise<Content | undefined> {
    const [updatedContent] = await db
      .update(content)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(content.id, id))
      .returning();
    return updatedContent || undefined;
  }

  async deleteContent(id: number): Promise<boolean> {
    const result = await db.delete(content).where(eq(content.id, id));
    return result.count > 0;
  }

  async incrementContentViews(id: number): Promise<void> {
    await db
      .update(content)
      .set({
        views: sql`${content.views} + 1`
      })
      .where(eq(content.id, id));
  }

  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.count > 0;
  }

  // Subscription plan methods
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan || undefined;
  }

  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, true));
  }

  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [plan] = await db
      .insert(subscriptionPlans)
      .values(insertPlan)
      .returning();
    return plan;
  }

  async updateSubscriptionPlan(id: number, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db
      .update(subscriptionPlans)
      .set(data)
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return plan || undefined;
  }

  async deleteSubscriptionPlan(id: number): Promise<boolean> {
    const result = await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return result.count > 0;
  }

  // Favorite methods
  async getFavoritesByUser(userId: number): Promise<Content[]> {
    const userFavorites = await db
      .select({
        content: content
      })
      .from(content)
      .innerJoin(
        favorites,
        and(
          eq(favorites.contentId, content.id),
          eq(favorites.userId, userId)
        )
      )
      .where(eq(content.isPublished, true));
    
    return userFavorites.map(item => item.content);
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(insertFavorite)
      .returning();
    return favorite;
  }

  async removeFavorite(userId: number, contentId: number): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.contentId, contentId)
        )
      );
    return result.count > 0;
  }

  // Admin methods
  async getAdminStats(): Promise<{
    totalViews: number;
    premiumMembers: number;
    contentCount: {
      total: number;
      videos: number;
      photos: number;
      premium: number;
      free: number;
    };
    recentContent: Content[];
  }> {
    // Get total views
    const [viewsResult] = await db
      .select({
        totalViews: sql`sum(${content.views})`
      })
      .from(content);
    
    // Get premium members count
    const [premiumResult] = await db
      .select({
        count: sql`count(*)::int`
      })
      .from(users)
      .where(eq(users.isPremium, true));
    
    // Get content counts
    const [totalResult] = await db
      .select({
        count: sql`count(*)::int`
      })
      .from(content);
    
    const [videosResult] = await db
      .select({
        count: sql`count(*)::int`
      })
      .from(content)
      .where(eq(content.type, 'video'));
    
    const [photosResult] = await db
      .select({
        count: sql`count(*)::int`
      })
      .from(content)
      .where(eq(content.type, 'photo'));
    
    const [premiumContentResult] = await db
      .select({
        count: sql`count(*)::int`
      })
      .from(content)
      .where(eq(content.accessLevel, 'premium'));
    
    const [freeContentResult] = await db
      .select({
        count: sql`count(*)::int`
      })
      .from(content)
      .where(eq(content.accessLevel, 'free'));
    
    // Get recent content
    const recentContent = await db
      .select()
      .from(content)
      .orderBy(desc(content.createdAt))
      .limit(5);
    
    return {
      totalViews: Number(viewsResult.totalViews) || 0,
      premiumMembers: premiumResult.count || 0,
      contentCount: {
        total: totalResult.count || 0,
        videos: videosResult.count || 0,
        photos: photosResult.count || 0,
        premium: premiumContentResult.count || 0,
        free: freeContentResult.count || 0
      },
      recentContent
    };
  }
}

// Setup session store for express-session
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';

export function getSessionStore() {
  const PgStore = connectPgSimple(session);
  
  return new PgStore({
    conObject: {
      connectionString: process.env.DATABASE_URL
    },
    tableName: 'session',
    createTableIfMissing: true
  });
}

// Use database storage
export const storage = new DatabaseStorage();
