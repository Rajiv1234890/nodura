import { useState, useEffect } from "react";
import { Link } from "wouter";
import ContentCard from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedContent() {
  const { data: content, isLoading } = useQuery<Content[]>({
    queryKey: ['/api/content/featured'],
  });

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Content</h2>
          <Link href="/browse" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
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
            ))
          ) : (
            content?.slice(0, 4).map((item) => (
              <ContentCard key={item.id} content={item} variant="large" />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
