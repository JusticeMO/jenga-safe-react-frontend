
import { SettingsView } from "@/components/shared/Settings";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/context/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DelegationPanel } from "@/components/landlord/DelegationPanel";

const SettingsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "landlord") {
      navigate("/tenant/dashboard");
    }
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated || user?.role !== "landlord") {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <SettingsView userRole="landlord" />

          {/* ------------------------------------------------------------------
           * Team & Delegation – allow landlord to manage property managers
           * ------------------------------------------------------------------ */}
          <section className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Team &amp; Delegation</h2>
            <DelegationPanel />
          </section>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
