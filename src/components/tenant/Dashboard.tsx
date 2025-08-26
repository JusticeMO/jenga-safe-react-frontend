
import { mockBills, mockMessages } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { RentPaymentPrompt } from "./RentPaymentPrompt";
import { QuickActions } from "./dashboard/QuickActions";
import { RecentActivity } from "./dashboard/RecentActivity";
import { PropertyStats } from "./dashboard/PropertyStats";
import { TenantProfile } from "./dashboard/TenantProfile";
import { InviteCodeSection } from "./dashboard/InviteCodeSection";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";
import { PropertyInfo } from "@/types";

export function TenantDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const unreadMessages = mockMessages.filter(msg => !msg.read).length;
  
  // State for property assignment and details
  const [hasAssignedProperty, setHasAssignedProperty] = useState(false);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  
  // Check if tenant has been assigned a property from localStorage on component mount
  useEffect(() => {
    const storedHasProperty = localStorage.getItem('tenantHasProperty') === 'true';
    const storedPropertyDetails = localStorage.getItem('propertyDetails');
    
    setHasAssignedProperty(user?.has_assigned_property || storedHasProperty);
    
    if (storedPropertyDetails) {
      try {
        const parsedDetails = JSON.parse(storedPropertyDetails);
        setPropertyInfo(parsedDetails);
      } catch (e) {
        console.error("Error parsing property details from localStorage:", e);
      }
    } else if (user?.has_assigned_property) {
      // Fallback to mock data if user has property but no stored details
      setPropertyInfo({
        propertyName: "Westlands Heights",
        propertyId: "PROP-WH001",
        unitNumber: "Apartment 3B",
        rentAmount: 25000,
        depositAmount: 50000,
        nextDueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        firstPaymentDue: true,
      });
    }
  }, [user]);
  
  // Handle successful property registration
  const handleSuccessfulRegistration = (propertyDetails: PropertyInfo) => {
    setHasAssignedProperty(true);
    setPropertyInfo(propertyDetails);
  };
  
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "pay-rent":
        navigate("/tenant/payments");
        break;
      case "upload-payment":
        navigate("/tenant/payments");
        break;
      case "new-message":
        navigate("/tenant/messages");
        break;
      case "view-receipt":
        navigate("/tenant/history");
        break;
      case "maintenance":
        navigate("/tenant/maintenance");
        break;
      case "explore":
        navigate("/tenant/explore");
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Tenant Profile */}
      {user && (
        <TenantProfile 
          user={user} 
          propertyInfo={propertyInfo} 
        />
      )}
      
      {/* Property Invitation Code Section - only shown if tenant has no property */}
      {!hasAssignedProperty && (
        <div className="mb-6">
          <InviteCodeSection onSuccessfulRegistration={handleSuccessfulRegistration} />
        </div>
      )}
      
      {/* Rent Payment Prompt - only show if tenant has a property */}
      {hasAssignedProperty && propertyInfo && (
        <div className="mb-8">
          <RentPaymentPrompt 
            unitName={propertyInfo.unitNumber}
            rentAmount={propertyInfo.rentAmount}
            depositAmount={propertyInfo.firstPaymentDue ? propertyInfo.depositAmount : 0}
            dueDate={propertyInfo.nextDueDate}
            firstPayment={propertyInfo.firstPaymentDue}
          />
        </div>
      )}
      
      {/* Show different stats based on whether tenant has property or not */}
      <PropertyStats 
        hasAssignedProperty={hasAssignedProperty} 
        propertyInfo={propertyInfo}
        unreadMessages={unreadMessages}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions onActionClick={handleQuickAction} />
        <RecentActivity />
      </div>
    </div>
  );
}
