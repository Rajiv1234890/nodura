import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardStats from "@/components/admin/DashboardStats";
import ContentManagement from "@/components/admin/ContentManagement";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // No need to render if user is not an admin
  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You need admin permissions to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Fetch admin statistics
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("GET", "/api/admin/stats").then((res) => res.json()),
    enabled: activeTab === "dashboard",
  });

  // Render the appropriate component based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats stats={dashboardStats} />;
      case "content":
        return <ContentManagement />;
      case "categories":
        return <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Categories & Tags</h2>
          <p className="text-gray-500">Category management implementation in progress.</p>
        </div>;
      case "subscriptions":
        return <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
          <p className="text-gray-500">Subscription plan management implementation in progress.</p>
        </div>;
      case "users":
        return <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-500">User management implementation in progress.</p>
        </div>;
      case "ads":
        return <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Ad Management</h2>
          <p className="text-gray-500">Ad management implementation in progress.</p>
        </div>;
      case "performance":
        return <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Content Performance</h2>
          <p className="text-gray-500">Content performance analytics implementation in progress.</p>
        </div>;
      case "moderation":
        return <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Moderation Tools</h2>
          <p className="text-gray-500">Moderation tools implementation in progress.</p>
        </div>;
      case "marketing":
        return <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Marketing & Notifications</h2>
          <p className="text-gray-500">Marketing tools implementation in progress.</p>
        </div>;
      case "settings":
        return <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-gray-500">Settings panel implementation in progress.</p>
        </div>;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}