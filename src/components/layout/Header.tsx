
import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-[#1A1F2C]">
          {user?.role === 'tenant' ? 'Tenant Portal' : 'Landlord Portal'}
        </h1>
        <div className="hidden md:block px-2 py-1 bg-[#9b87f5]/10 text-[#9b87f5] text-xs font-medium rounded-full">
          {user?.role === 'tenant' ? 'Tenant' : 'Landlord'}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Link to={user?.role === 'tenant' ? "/tenant/messages" : "/landlord/messages"} className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">3</span>
          </Link>
        </div>
        
        <div className="flex items-center border-l pl-4 ml-2">
          <div className="mr-3 hidden md:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#9b87f5]/20 flex items-center justify-center text-[#9b87f5]">
              <User className="w-5 h-5" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
