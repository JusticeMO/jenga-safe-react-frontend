
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Building, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  Settings, 
  BarChart,
  Users,
  Bell,
  HelpCircle,
  History,
  Search,
  Droplets,
  Trash2,
  Phone,
  AlertTriangle
} from "lucide-react";

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const tenantLinks = [
    {
      name: "Dashboard",
      path: "/tenant/dashboard",
      icon: Home
    },
    {
      name: "Payments",
      path: "/tenant/payments",
      icon: CreditCard
    },
    {
      name: "Payment History",
      path: "/tenant/history",
      icon: History
    },
    {
      name: "Messages",
      path: "/tenant/messages",
      icon: MessageSquare
    },
    {
      name: "Tenant Chat",
      path: "/tenant/chat",
      icon: MessageSquare
    },
    {
      name: "Water Usage",
      path: "/tenant/water-usage",
      icon: Droplets
    },
    {
      name: "Garbage Services",
      path: "/tenant/garbage-services",
      icon: Trash2
    },
    {
      name: "Emergency Services",
      path: "/tenant/emergency-services",
      icon: Phone
    },
    {
      name: "File Complaint",
      path: "/tenant/file-complaint",
      icon: AlertTriangle
    },
    {
      name: "Maintenance",
      path: "/tenant/maintenance",
      icon: Settings
    },
    {
      name: "Documents",
      path: "/tenant/documents",
      icon: FileText
    },
    {
      name: "Explore Properties",
      path: "/tenant/explore",
      icon: Search
    }
  ];
  
  const landlordLinks = [
    {
      name: "Dashboard",
      path: "/landlord/dashboard",
      icon: Home
    },
    {
      name: "Properties",
      path: "/landlord/properties",
      icon: Building
    },
    {
      name: "Tenants",
      path: "/landlord/tenants",
      icon: Users
    },
    {
      name: "Messages",
      path: "/landlord/messages",
      icon: MessageSquare
    },
    {
      name: "Water Monitoring",
      path: "/landlord/water-monitoring",
      icon: Droplets
    },
    {
      name: "Garbage Management",
      path: "/landlord/garbage-management",
      icon: Trash2
    },
    {
      name: "Emergency Management",
      path: "/landlord/emergency-management",
      icon: Phone
    },
    {
      name: "Complaint Management",
      path: "/landlord/complaint-management",
      icon: AlertTriangle
    },
    {
      name: "Reports",
      path: "/landlord/reports",
      icon: BarChart
    },
    {
      name: "Maintenance",
      path: "/landlord/maintenance",
      icon: Settings
    }
  ];
  
  const links = user?.role === 'tenant' ? tenantLinks : landlordLinks;

  return (
    <div className="h-screen w-64 bg-[#1A1F2C] text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          <span className="text-[#9b87f5]">Jenga</span>{" "}
          <span className="text-[#33C3F0]">Safe</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {links.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  isActive(link.path) 
                    ? 'bg-[#9b87f5]/30 text-white font-medium' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Link
          to={`/${user?.role}/settings`}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
            isActive(`/${user?.role}/settings`) 
              ? 'bg-[#9b87f5]/30 text-white font-medium' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <Link
          to={`/${user?.role}/help`}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
            isActive(`/${user?.role}/help`) 
              ? 'bg-[#9b87f5]/30 text-white font-medium' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </Link>
      </div>
    </div>
  );
}
