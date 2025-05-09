import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import { Helmet } from "react-helmet";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentViewer from "@/components/viewer/ContentViewer";
import { Skeleton } from "@/components/ui/skeleton";
import AdBanner from "@/components/home/AdBanner";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ContentViewPage() {
  const { id } = useParams();
  
  const { data: content, isLoading, error } = useQuery<Content>({
    queryKey: [`/api/content/${id}`],
  });

  // Track view when content is loaded
  useEffect(() => {
    if (content) {
      fetch(`/api/content/${id}/view`, { 
        method: 'POST',
        credentials: 'include'
      });
    }
  }, [content, id]);

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-red-500 mx-auto mb-4">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p className="text-gray-600 mb-6">The content you are looking for doesn't exist or has been removed.</p>
            <Link href="/browse">
              <Button>Browse Content</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{content ? `${content.title} | MediaPremium` : 'Loading Content | MediaPremium'}</title>
        <meta name="description" content={content?.description || 'Loading premium content from MediaPremium'} />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gray-100">
        {isLoading ? (
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-[60vh] w-full rounded-xl mb-6" />
            <Skeleton className="h-8 w-2/3 mb-3" />
            <Skeleton className="h-4 w-full mb-8" />
          </div>
        ) : content ? (
          <div className="container mx-auto px-4 py-8">
            <ContentViewer content={content} />
            
            <div className="mt-8">
              <AdBanner />
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Related Content</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Related content would be loaded here from API */}
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <Footer />
    </>
  );
}
