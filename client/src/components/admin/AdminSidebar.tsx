import { Link } from "wouter";
import {
  BarChart3,
  Film,
  TagIcon,
  CreditCard,
  Users,
  MonitorSmartphone,
  BarChart,
  Shield,
  Mail,
  Settings,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const sidebarItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      key: "content",
      label: "Content Management",
      icon: <Film className="h-5 w-5 mr-2" />,
    },
    {
      key: "categories",
      label: "Categories & Tags",
      icon: <TagIcon className="h-5 w-5 mr-2" />,
    },
    {
      key: "subscriptions",
      label: "Subscription Plans",
      icon: <CreditCard className="h-5 w-5 mr-2" />,
    },
    {
      key: "users",
      label: "User Management",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      key: "ads",
      label: "Ad Management",
      icon: <MonitorSmartphone className="h-5 w-5 mr-2" />,
    },
    {
      key: "performance",
      label: "Content Performance",
      icon: <BarChart3 className="h-5 w-5 mr-2" />,
    },
    {
      key: "moderation",
      label: "Moderation Tools",
      icon: <Shield className="h-5 w-5 mr-2" />,
    },
    {
      key: "marketing",
      label: "Marketing & Notifications",
      icon: <Mail className="h-5 w-5 mr-2" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Quick Actions */}
      <div className="p-4">
        <Button className="w-full bg-red-500 hover:bg-red-600">
          <Plus className="h-4 w-4 mr-2" /> Add New Content
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`flex items-center text-left w-full rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? "bg-red-100 text-red-900"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onTabChange(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}