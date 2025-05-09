import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentCard from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BrowsePage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [contentType, setContentType] = useState("all");

  // Parse query params
  const params = new URLSearchParams(location.split("?")[1]);
  const category = params.get("category");
  const type = params.get("type");
  
  // Create query key with filters
  const queryKey = ['/api/content', { category, type, searchTerm, sortBy, contentType }];
  
  const { data: content, isLoading } = useQuery<Content[]>({
    queryKey,
  });

  let heading = "Browse All Content";
  if (category === "trending") heading = "Trending Content";
  if (category === "new") heading = "New Content";
  if (type === "video") heading = "Video Content";
  if (type === "photo") heading = "Photo Content";

  return (
    <>
      <Helmet>
        <title>{heading} | MediaPremium</title>
        <meta name="description" content={`Browse our ${heading.toLowerCase()}. Discover premium videos and photos for professionals and enthusiasts.`} />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">{heading}</h1>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search content..."
                  className="pl-10 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="flex gap-2">
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="free">Free Only</SelectItem>
                    <SelectItem value="premium">Premium Only</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={`skeleton-${i}`} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <Skeleton className="w-full aspect-video" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : content && content.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {content.map((item) => (
                <ContentCard key={item.id} content={item} variant="large" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gray-300 mx-auto mb-4">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No content found</h2>
              <p className="text-gray-500 mb-6">Try changing your filters or search term.</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSortBy("popular");
                  setContentType("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
          
          {content && content.length > 0 && (
            <div className="mt-10 flex justify-center">
              <Button variant="outline" className="mr-2" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                  <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                </svg>
                Previous
              </Button>
              <Button variant="outline">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                  <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
