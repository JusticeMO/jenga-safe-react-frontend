
import { HelpView } from "@/components/shared/Help";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/context/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HelpPage = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for initial auth check to complete before redirecting
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "tenant") {
      navigate("/landlord/dashboard");
    }
  }, [loading, isAuthenticated, navigate, user]);

  // Full-screen placeholders --------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "tenant") {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-sm text-gray-500">Redirecting...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <HelpView userRole="tenant" />
        </main>
      </div>
    </div>
  );
};

export default HelpPage;
