import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  EyeIcon, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Video, 
  Image as ImageIcon, 
  Lock, 
  Unlock
} from "lucide-react";
import { Content } from "@shared/schema";

interface DashboardStatsProps {
  stats?: {
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
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  // Revenue is calculated for demo purposes
  const estimatedRevenue = stats ? stats.premiumMembers * 9.99 : 0;
  
  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <EyeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.totalViews.toLocaleString() : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${estimatedRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +10.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Premium Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.premiumMembers.toLocaleString() : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              +4.6% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.contentCount.total.toLocaleString() : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              +12 new uploads this week
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Content Breakdown */}
      <h2 className="text-xl font-semibold mb-4">Content Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.contentCount.videos.toLocaleString() : "-"}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ 
                  width: stats ? `${(stats.contentCount.videos / stats.contentCount.total) * 100}%` : "0%" 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Photos</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.contentCount.photos.toLocaleString() : "-"}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ 
                  width: stats ? `${(stats.contentCount.photos / stats.contentCount.total) * 100}%` : "0%" 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Premium Content</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.contentCount.premium.toLocaleString() : "-"}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ 
                  width: stats ? `${(stats.contentCount.premium / stats.contentCount.total) * 100}%` : "0%" 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Free Content</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.contentCount.free.toLocaleString() : "-"}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ 
                  width: stats ? `${(stats.contentCount.free / stats.contentCount.total) * 100}%` : "0%" 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Content */}
      <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Access</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Views</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Added</th>
              </tr>
            </thead>
            <tbody>
              {stats && stats.recentContent.length > 0 ? (
                stats.recentContent.map((content) => (
                  <tr key={content.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {content.title}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        content.type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {content.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        content.accessLevel === 'premium' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {content.accessLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{content.views || 0}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                    No recent content found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}