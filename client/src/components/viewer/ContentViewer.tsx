import { useState, useEffect } from "react";
import { Content } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { formatTimeAgo, formatViews } from "@/lib/utils";

interface ContentViewerProps {
  content: Content;
}

export default function ContentViewer({ content }: ContentViewerProps) {
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Determine if content should be locked (premium content and user not premium)
  const isLocked = content.accessLevel === "premium" && (!user || !user.isPremium);
  
  useEffect(() => {
    // If content is premium and user doesn't have access, show paywall after preview time
    if (isLocked && content.type === "video") {
      const timer = setTimeout(() => {
        setShowPaywall(true);
      }, 15000); // Show paywall after 15 seconds for video preview
      
      return () => clearTimeout(timer);
    }
  }, [isLocked, content.type]);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Content display area */}
      <div className="relative">
        {content.type === "video" ? (
          // Video content
          <div className="aspect-video bg-black relative">
            {/* Replace with actual video player implementation */}
            <video 
              src={content.contentUrl}
              poster={content.thumbnailUrl}
              controls
              className="w-full h-full object-contain"
            />
            
            {/* Paywall overlay for premium videos */}
            {showPaywall && isLocked && (
              <div className="absolute inset-0 backdrop-blur-md bg-black/70 flex flex-col items-center justify-center p-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-blue-500 mb-4">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                <h3 className="text-3xl font-bold mb-4">Premium Content</h3>
                <p className="text-xl mb-6 text-center max-w-lg">
                  Subscribe to MediaPremium to access the full video and all other premium content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing">
                    <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                      View Pricing Plans
                    </Button>
                  </Link>
                  {!user && (
                    <Link href="/auth">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Photo content
          <div className="relative">
            <img 
              src={content.contentUrl}
              alt={content.title}
              className="w-full max-h-[80vh] object-contain bg-black"
            />
            
            {/* Paywall overlay for premium photos */}
            {isLocked && (
              <div className="absolute inset-0 backdrop-blur-md bg-black/70 flex flex-col items-center justify-center p-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-blue-500 mb-4">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                <h3 className="text-3xl font-bold mb-4">Premium Content</h3>
                <p className="text-xl mb-6 text-center max-w-lg">
                  Subscribe to MediaPremium to access full resolution photos and all other premium content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing">
                    <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                      View Pricing Plans
                    </Button>
                  </Link>
                  {!user && (
                    <Link href="/auth">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Content info section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h1>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={content.accessLevel === "premium" ? "premium" : "free"}>
                {content.accessLevel === "premium" ? "PREMIUM" : "FREE"}
              </Badge>
              <Badge variant="outline">
                {content.type === "video" ? "Video" : "Photo"}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatViews(content.views)} views • {formatTimeAgo(new Date(content.createdAt))}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="border-t border-b py-4 my-4">
          <p className="text-gray-700">{content.description}</p>
          
          {content.categories && content.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {content.categories.map((category, index) => (
                <Badge key={index} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Creator info section (if implemented) */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-semibold mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-medium">MediaPremium</div>
              <div className="text-sm text-gray-500">Official Content</div>
            </div>
          </div>
          
          {isLocked && (
            <Link href="/pricing">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                Unlock Premium
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
