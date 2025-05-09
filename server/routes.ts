import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertContentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // PUBLIC API ROUTES
  
  // Get featured content (homepage)
  app.get("/api/content/featured", async (req, res) => {
    try {
      const featured = await storage.getFeaturedContent();
      res.json(featured);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured content" });
    }
  });

  // Get trending content
  app.get("/api/content/trending", async (req, res) => {
    try {
      const trending = await storage.getTrendingContent();
      res.json(trending);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending content" });
    }
  });

  // Get new content
  app.get("/api/content/new", async (req, res) => {
    try {
      const newContent = await storage.getNewContent();
      res.json(newContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new content" });
    }
  });

  // Get content by ID
  app.get("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }

      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Track content views
  app.post("/api/content/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }

      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      await storage.incrementContentViews(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track view" });
    }
  });

  // Get filtered content (browse page)
  app.get("/api/content", async (req, res) => {
    try {
      const { category, type, searchTerm, sortBy, contentType } = req.query as { 
        category?: string; 
        type?: string; 
        searchTerm?: string; 
        sortBy?: string;
        contentType?: string;
      };

      let allContent = await storage.getAllContent();
      
      // Filter by category if specified
      if (category === "trending") {
        allContent = await storage.getTrendingContent();
      } else if (category === "new") {
        allContent = await storage.getNewContent();
      } else if (category) {
        allContent = await storage.getContentByCategory(category);
      }

      // Filter by type (video/photo)
      if (type) {
        allContent = allContent.filter(item => item.type === type);
      }

      // Filter by access level (free/premium)
      if (contentType === "free") {
        allContent = allContent.filter(item => item.accessLevel === "free");
      } else if (contentType === "premium") {
        allContent = allContent.filter(item => item.accessLevel === "premium");
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        allContent = allContent.filter(
          item => 
            item.title.toLowerCase().includes(term) || 
            item.description.toLowerCase().includes(term)
        );
      }

      // Sort content
      if (sortBy === "newest") {
        allContent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === "oldest") {
        allContent.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else {
        // Default: sort by popularity (views)
        allContent.sort((a, b) => b.views - a.views);
      }

      res.json(allContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // ADMIN API ROUTES

  // Middleware to check if user is admin
  const isAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }
    next();
  };

  // Get admin dashboard stats
  app.get("/api/admin/stats", isAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Get all content for admin
  app.get("/api/admin/content", isAdmin, async (req, res) => {
    try {
      const allContent = await storage.getAllContent();
      res.json(allContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Create new content
  app.post("/api/admin/content", isAdmin, async (req, res) => {
    try {
      // Validate request body
      const contentData = insertContentSchema.parse(req.body);
      
      // Create new content
      const newContent = await storage.createContent(contentData);
      res.status(201).json(newContent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  // Update content
  app.put("/api/admin/content/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }

      // Partial validation of content data
      const contentData = insertContentSchema.partial().parse(req.body);
      
      // Update content
      const updatedContent = await storage.updateContent(id, contentData);
      if (!updatedContent) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(updatedContent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  // Delete content
  app.delete("/api/admin/content/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }

      const success = await storage.deleteContent(id);
      if (!success) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
