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
    <div className="group bg-white border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <Link href={`/view/${content.id}`}>
        <div className="relative aspect-video bg-gray-100">
          {content.thumbnailUrl ? (
            <img 
              src={content.thumbnailUrl} 
              alt={content.title} 
              className={`w-full h-full object-cover ${isPremium ? "blur-[3px]" : ""}`} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </div>
          )}
          
          {/* Content type badge */}
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-gray-900 text-white text-xs px-2 py-1 uppercase font-medium">
              {content.type}
            </Badge>
          </div>
          
          {/* Premium badge */}
          {isPremium && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-pink-600 text-white text-xs px-2 py-1 uppercase font-semibold">
                Premium
              </Badge>
            </div>
          )}
          
          {/* Video duration */}
          {content.type === "video" && content.duration && (
            <div className="absolute bottom-2 right-2">
              <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {content.duration}
              </span>
            </div>
          )}
          
          {/* Premium overlay */}
          {isPremium && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-pink-600 mx-auto mb-2">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-1">
                  Unlock
                </Button>
              </div>
            </div>
          )}
          
          {/* Play button */}
          {content.type === "video" && !isPremium && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{content.title}</h3>
            <div className="flex text-xs text-gray-500">
              {content.categories && content.categories.length > 0 && (
                <span>{content.categories[0]}</span>
              )}
              {isPremium ? (
                <span className="ml-auto text-pink-600 font-medium">Premium</span>
              ) : (
                <span className="ml-auto">Free</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
