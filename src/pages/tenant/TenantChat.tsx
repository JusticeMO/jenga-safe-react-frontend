
import { TenantChat } from "@/components/tenant/TenantChat";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/context/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TenantChatPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "tenant") {
      navigate("/landlord/dashboard");
    }
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated || user?.role !== "tenant") {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <TenantChat />
        </main>
      </div>
    </div>
  );
};

export default TenantChatPage;
