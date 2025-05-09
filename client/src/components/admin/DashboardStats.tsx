import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Content } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

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
  // If stats are not loaded yet, show loading skeleton
  if (!stats) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
          
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Format data for charts
  const contentTypeData = [
    { name: 'Videos', value: stats.contentCount.videos, fill: '#3b82f6' },
    { name: 'Photos', value: stats.contentCount.photos, fill: '#8b5cf6' },
  ];
  
  const accessLevelData = [
    { name: 'Free', value: stats.contentCount.free, fill: '#10b981' },
    { name: 'Premium', value: stats.contentCount.premium, fill: '#6d28d9' },
  ];
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#6d28d9', '#10b981'];
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Content Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime views across all content</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Premium Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.premiumMembers}</div>
            <p className="text-xs text-gray-500 mt-1">Active premium subscribers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.contentCount.total}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.contentCount.videos} videos, {stats.contentCount.photos} photos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Premium Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.contentCount.premium}</div>
            <p className="text-xs text-gray-500 mt-1">
              {(stats.contentCount.premium / stats.contentCount.total * 100).toFixed(1)}% of total content
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Access Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={accessLevelData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" name="Content Count">
                    {accessLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent content table */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Added Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-gray-500">Content</th>
                  <th className="text-left py-3 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 font-medium text-gray-500">Access</th>
                  <th className="text-left py-3 font-medium text-gray-500">Views</th>
                  <th className="text-left py-3 font-medium text-gray-500">Added</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentContent.map((content) => (
                  <tr key={content.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="h-10 w-16 rounded overflow-hidden mr-3">
                          <img 
                            src={content.thumbnailUrl} 
                            alt={content.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="truncate max-w-[250px]">{content.title}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant={content.type === "video" ? "default" : "outline"}>
                        {content.type}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={content.accessLevel === "premium" ? "premium" : "free"}>
                        {content.accessLevel}
                      </Badge>
                    </td>
                    <td className="py-3">{content.views.toLocaleString()}</td>
                    <td className="py-3">{formatTimeAgo(new Date(content.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
