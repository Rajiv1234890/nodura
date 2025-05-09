import { Link } from "wouter";
import ContentCard from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewContent() {
  const { data: content, isLoading } = useQuery<Content[]>({
    queryKey: ['/api/content/new'],
  });

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline-block text-green-500 mr-1">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
            </svg>
            New Content
          </h2>
          <Link href="/browse?category=new" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
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
            content?.slice(0, 3).map((item) => (
              <ContentCard key={item.id} content={item} variant="large" />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
