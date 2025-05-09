import { Link } from "wouter";
import ContentCard from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrendingContent() {
  const { data: content, isLoading } = useQuery<Content[]>({
    queryKey: ['/api/content/trending'],
  });

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline-block text-amber-500 mr-1">
              <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
            </svg>
            Trending Now
          </h2>
          <Link href="/browse?category=trending" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={`skeleton-${i}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="w-full aspect-video" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))
          ) : (
            content?.slice(0, 5).map((item) => (
              <ContentCard key={item.id} content={item} variant="small" />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
