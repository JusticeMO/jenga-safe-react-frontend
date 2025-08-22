
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types";
import { FileText, UserRound, Home, Calendar } from "lucide-react";

interface TenantProfileProps {
  user: User;
  propertyInfo: {
    propertyName: string;
    propertyId: string;
    unitNumber: string;
    rentAmount: number;
    depositAmount?: number;
    nextDueDate?: string;
    firstPaymentDue?: boolean;
    leaseStartDate?: string;
    leaseEndDate?: string;
  } | null;
}

export function TenantProfile({ user, propertyInfo }: TenantProfileProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-[#9b87f5]">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback className="text-2xl bg-[#9b87f5]/20">
              <UserRound className="h-12 w-12 text-[#9b87f5]" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-[#9b87f5]" />
                <span>ID: {user.id}</span>
              </div>
              
              {propertyInfo && (
                <div className="flex items-center gap-1">
                  <Home className="h-4 w-4 text-[#ea384c]" />
                  <span className="font-medium">{propertyInfo.unitNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {propertyInfo ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase">Property</h3>
              <p className="font-medium">{propertyInfo.propertyName}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase">Property ID</h3>
              <p className="font-medium">{propertyInfo.propertyId}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase">Unit Number</h3>
              <p className="font-medium">{propertyInfo.unitNumber}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase">Monthly Rent</h3>
              <p className="font-medium">KES {propertyInfo.rentAmount.toLocaleString()}</p>
            </div>
            
            {propertyInfo.firstPaymentDue && propertyInfo.depositAmount && (
              <>
                <div className="col-span-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase">Security Deposit</h3>
                  <p className="font-medium">KES {propertyInfo.depositAmount.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#ea384c]" />
                      <span>First Payment Due</span>
                    </div>
                  </h3>
                  <p className="font-medium">
                    {propertyInfo.nextDueDate ? new Date(propertyInfo.nextDueDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-gray-500">No property assigned yet</p>
            <p className="text-sm text-gray-400">Contact your landlord for an invitation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
