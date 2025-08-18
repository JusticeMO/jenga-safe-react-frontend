
import { Calendar, DollarSign, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyInfo } from "@/types";

interface PropertyStatsProps {
  hasAssignedProperty?: boolean;
  propertyInfo?: PropertyInfo | null;
  unreadMessages?: number;
}

export function PropertyStats({ hasAssignedProperty = false, propertyInfo = null, unreadMessages = 0 }: PropertyStatsProps) {
  const navigate = useNavigate();

  if (!hasAssignedProperty) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-sm font-medium text-gray-500">Current Rent</h2>
          <p className="text-2xl font-bold mt-2">KES 0</p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">No property assigned</p>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">No Due Date</span>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-sm font-medium text-gray-500">Water Bill</h2>
          <p className="text-2xl font-bold mt-2">KES 0</p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">No usage recorded</p>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">No Bill</span>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-sm font-medium text-gray-500">Garbage Fee</h2>
          <p className="text-2xl font-bold mt-2">KES 0</p>
          <div className="flex items-center mt-4">
            <p className="text-sm text-gray-500">No monthly fee</p>
            <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">No Fee</span>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-sm font-medium text-gray-500">Unread Messages</h2>
          <p className="text-2xl font-bold mt-2">0</p>
          <div className="flex items-center mt-4">
            <p className="text-sm text-gray-500">No messages</p>
            <a href="/tenant/messages" className="ml-auto text-sm text-[#ea384c] hover:underline">View</a>
          </div>
        </div>
      </div>
    );
  }
  
  // For tenants with assigned properties
  const dueDate = propertyInfo?.nextDueDate ? new Date(propertyInfo.nextDueDate) : new Date();
  const isRentOverdue = dueDate < new Date();
  
  // Format lease dates if available
  const leaseStartDate = propertyInfo?.leaseStartDate 
    ? new Date(propertyInfo.leaseStartDate).toLocaleDateString() 
    : "Not available";
  
  const leaseEndDate = propertyInfo?.leaseEndDate 
    ? new Date(propertyInfo.leaseEndDate).toLocaleDateString() 
    : "Not available";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-l-4 border-l-[#ea384c]">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-[#ea384c]" />
            <h2 className="text-sm font-medium text-gray-500">Monthly Rent</h2>
          </div>
          <p className="text-2xl font-bold mt-2">KES {propertyInfo?.rentAmount?.toLocaleString() || "0"}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
              <p className="text-sm text-gray-500">
                Due: {dueDate.toLocaleDateString()}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              propertyInfo?.firstPaymentDue 
                ? "bg-amber-100 text-amber-800"
                : isRentOverdue 
                  ? "bg-red-100 text-red-800" 
                  : "bg-green-100 text-green-800"
            }`}>
              {propertyInfo?.firstPaymentDue 
                ? "Initial Payment" 
                : isRentOverdue 
                  ? "Overdue" 
                  : "Current"}
            </span>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-medium text-gray-500">Water Bill</h2>
          </div>
          <p className="text-2xl font-bold mt-2">KES 2,500</p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">Usage: 6 units</p>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Current Month</span>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <h2 className="text-sm font-medium text-gray-500">Garbage Fee</h2>
          </div>
          <p className="text-2xl font-bold mt-2">KES 500</p>
          <div className="flex items-center mt-4">
            <p className="text-sm text-gray-500">Monthly Fee</p>
            <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-sm font-medium text-gray-500">Unread Messages</h2>
          <p className="text-2xl font-bold mt-2">{unreadMessages}</p>
          <div className="flex items-center mt-4">
            <p className="text-sm text-gray-500">From: Property Manager</p>
            <button 
              onClick={() => navigate("/tenant/messages")}
              className="ml-auto text-sm text-[#ea384c] hover:underline"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* Lease information section */}
      {propertyInfo?.leaseStartDate && (
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-[#9b87f5]" />
            <h2 className="text-lg font-medium">Lease Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lease Start</h3>
              <p className="text-base font-medium mt-1">{leaseStartDate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lease End</h3>
              <p className="text-base font-medium mt-1">{leaseEndDate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Security Deposit</h3>
              <p className="text-base font-medium mt-1">
                KES {propertyInfo?.depositAmount?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
