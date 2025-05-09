import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTimeAgo, formatViews } from "@/lib/utils";
import { Content } from "@shared/schema";

interface ContentCardProps {
  content: Content;
  variant?: "large" | "medium" | "small";
}

export default function ContentCard({ content, variant = "medium" }: ContentCardProps) {
  const isPremium = content.accessLevel === "premium";
  const isNew = new Date(content.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  return (
    <div className={`content-card bg-white rounded-${variant === "small" ? "lg" : "xl"} shadow-${variant === "large" ? "md" : "sm"} overflow-hidden transition-all`}>
      <Link href={`/view/${content.id}`}>
        <div className="relative aspect-video">
          <img 
            src={content.thumbnailUrl} 
            alt={content.title} 
            className={`w-full h-full object-cover ${isPremium ? "blur-premium" : ""}`} 
          />
          <div className="absolute top-2 left-2 z-10">
            <Badge variant={isPremium ? "premium" : "free"}>
              {isPremium ? "PREMIUM" : "FREE"}
            </Badge>
          </div>
          
          {isNew && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="new">NEW</Badge>
            </div>
          )}
          
          {content.type === "video" && (
            <div className="absolute bottom-2 right-2">
              <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                {content.duration}
              </span>
            </div>
          )}
          
          {!isPremium && content.type === "video" && (
            <button className="absolute inset-0 m-auto w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {isPremium && (
            <div className="premium-overlay absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white mx-auto mb-2">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2">
                  Unlock Premium
                </Button>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {variant !== "small" && (
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1">{content.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{content.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{formatViews(content.views)} views • {formatTimeAgo(new Date(content.createdAt))}</span>
            <button className="text-gray-400 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {variant === "small" && (
        <div className="p-3">
          <h3 className="font-medium text-gray-800 text-sm">{content.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">{formatViews(content.views)} views</span>
          </div>
        </div>
      )}
    </div>
  );
}
