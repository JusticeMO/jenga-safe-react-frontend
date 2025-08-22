
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegistrationPending from "./pages/RegistrationPending";
import TenantDashboard from "./pages/tenant/Dashboard";
import LandlordDashboard from "./pages/landlord/Dashboard";
import PaymentHistory from "./pages/tenant/PaymentHistory";
import Payments from "./pages/tenant/Payments";
import Properties from "./pages/landlord/Properties";
import PropertyDetails from "./pages/landlord/PropertyDetails";
import PropertyUnits from "./pages/landlord/PropertyUnits";
import TenantMessages from "./pages/tenant/Messages";
import LandlordMessages from "./pages/landlord/Messages";
import TenantMaintenance from "./pages/tenant/Maintenance";
import LandlordMaintenance from "./pages/landlord/Maintenance";
import Tenants from "./pages/landlord/Tenants";
import TenantInvitations from "./pages/landlord/TenantInvitations";
import TenantInvitation from "./pages/TenantInvitation";
import Reports from "./pages/landlord/Reports";
import Documents from "./pages/tenant/Documents";
import TenantSettings from "./pages/tenant/Settings";
import LandlordSettings from "./pages/landlord/Settings";
import TenantHelp from "./pages/tenant/Help";
import LandlordHelp from "./pages/landlord/Help";
import PropertyExplorer from "./pages/tenant/PropertyExplorer";
import TenantChat from "./pages/tenant/TenantChat";
import WaterUsage from "./pages/tenant/WaterUsage";
import GarbageServices from "./pages/tenant/GarbageServices";
import EmergencyServices from "./pages/tenant/EmergencyServices";
import FileComplaint from "./pages/tenant/FileComplaint";
import WaterUsageMonitoring from "./pages/landlord/WaterUsageMonitoring";
import GarbageManagement from "./pages/landlord/GarbageManagement";
import EmergencyManagement from "./pages/landlord/EmergencyManagement";
import ComplaintManagement from "./pages/landlord/ComplaintManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registration-pending" element={<RegistrationPending />} />
            <Route path="/invitation/:inviteCode" element={<TenantInvitation />} />
            
            {/* Tenant Routes */}
            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/history" element={<PaymentHistory />} />
            <Route path="/tenant/payments" element={<Payments />} />
            <Route path="/tenant/messages" element={<TenantMessages />} />
            <Route path="/tenant/chat" element={<TenantChat />} />
            <Route path="/tenant/water-usage" element={<WaterUsage />} />
            <Route path="/tenant/garbage-services" element={<GarbageServices />} />
            <Route path="/tenant/emergency-services" element={<EmergencyServices />} />
            <Route path="/tenant/file-complaint" element={<FileComplaint />} />
            <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
            <Route path="/tenant/documents" element={<Documents />} />
            <Route path="/tenant/settings" element={<TenantSettings />} />
            <Route path="/tenant/help" element={<TenantHelp />} />
            <Route path="/tenant/explore" element={<PropertyExplorer />} />
            
            {/* Landlord Routes */}
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/properties" element={<Properties />} />
            <Route path="/landlord/property/:id" element={<PropertyDetails />} />
            <Route path="/landlord/property/new" element={<PropertyDetails />} />
            <Route path="/landlord/property/:id/units" element={<PropertyUnits />} />
            <Route path="/landlord/messages" element={<LandlordMessages />} />
            <Route path="/landlord/water-monitoring" element={<WaterUsageMonitoring />} />
            <Route path="/landlord/garbage-management" element={<GarbageManagement />} />
            <Route path="/landlord/emergency-management" element={<EmergencyManagement />} />
            <Route path="/landlord/complaint-management" element={<ComplaintManagement />} />
            <Route path="/landlord/maintenance" element={<LandlordMaintenance />} />
            <Route path="/landlord/tenants" element={<Tenants />} />
            <Route path="/landlord/tenant-invitations" element={<TenantInvitations />} />
            <Route path="/landlord/reports" element={<Reports />} />
            <Route path="/landlord/settings" element={<LandlordSettings />} />
            <Route path="/landlord/help" element={<LandlordHelp />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
