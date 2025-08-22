import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, MessageSquare, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TenantInviteDialog } from "./TenantInviteDialog";

export function TenantsView() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock tenants data
  const allTenants = [
    {
      id: "t1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+254 712 345 678",
      property: "Riverside Apartments",
      unit: "Unit 2B",
      moveInDate: "2023-01-15",
      leaseEnd: "2024-01-14", 
      status: "Active",
      rentStatus: "Paid",
      avatar: "/placeholder.svg"
    },
    {
      id: "t2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+254 723 456 789",
      property: "Riverside Apartments",
      unit: "Unit 5A",
      moveInDate: "2022-08-10",
      leaseEnd: "2023-08-09",
      status: "Active",
      rentStatus: "Overdue",
      avatar: "/placeholder.svg"
    },
    {
      id: "t3",
      name: "Michael Smith",
      email: "michael.smith@example.com",
      phone: "+254 734 567 890",
      property: "Green Gardens Estate",
      unit: "House 7",
      moveInDate: "2023-03-22",
      leaseEnd: "2024-03-21",
      status: "Active",
      rentStatus: "Paid",
      avatar: "/placeholder.svg"
    },
    {
      id: "t4",
      name: "Emma Wilson",
      email: "emma.w@example.com",
      phone: "+254 745 678 901",
      property: "Green Gardens Estate",
      unit: "House 3",
      moveInDate: "2022-11-05",
      leaseEnd: "2023-11-04",
      status: "Active",
      rentStatus: "Partial",
      avatar: "/placeholder.svg"
    },
    {
      id: "t5",
      name: "David Brown",
      email: "david.b@example.com",
      phone: "+254 756 789 012",
      property: "Riverside Apartments",
      unit: "Unit 1C",
      moveInDate: "2023-02-18",
      leaseEnd: "2024-02-17",
      status: "Active",
      rentStatus: "Paid",
      avatar: "/placeholder.svg"
    },
    {
      id: "t6",
      name: "Lisa Chen",
      email: "lisa.c@example.com",
      phone: "+254 767 890 123",
      property: "Mountain View Residences",
      unit: "Unit 3D",
      moveInDate: "2023-04-05",
      leaseEnd: "2023-07-04",
      status: "Active",
      rentStatus: "Paid",
      avatar: "/placeholder.svg"
    }
  ];
  
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [tenants, setTenants] = useState(allTenants);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const filterTenants = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === "All") {
      setTenants(allTenants);
    } else if (filter === "Active") {
      setTenants(allTenants.filter(tenant => tenant.status === "Active"));
    } else if (filter === "Overdue") {
      setTenants(allTenants.filter(tenant => tenant.rentStatus === "Overdue"));
    } else if (filter === "Expiring Soon") {
      // For demo purposes, we'll consider tenant 6 as expiring soon
      setTenants(allTenants.filter(tenant => tenant.id === "t6"));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value) {
      const filtered = allTenants.filter(tenant => 
        tenant.name.toLowerCase().includes(value.toLowerCase()) ||
        tenant.email.toLowerCase().includes(value.toLowerCase()) ||
        tenant.property.toLowerCase().includes(value.toLowerCase()) ||
        tenant.unit.toLowerCase().includes(value.toLowerCase())
      );
      setTenants(filtered);
    } else {
      filterTenants(activeFilter);
    }
  };

  const handleViewTenant = (tenantId: string) => {
    // In a real app, this would navigate to the tenant details page
    toast({
      title: "Coming Soon",
      description: "Tenant details view is coming soon"
    });
  };

  const handleMessageTenant = (tenantId: string) => {
    navigate("/landlord/messages");
  };

  const handleAddTenant = () => {
    setIsInviteDialogOpen(true);
  };

  const handleInviteSent = (email: string, propertyId: string, unitId: string) => {
    toast({
      title: "Invitation Sent",
      description: `Invitation code has been sent to ${email} for ${unitId}`
    });
    setIsInviteDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <Button onClick={handleAddTenant}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Total Tenants</div>
            <p className="text-2xl font-bold">17</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Active Leases</div>
            <p className="text-2xl font-bold">15</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Expiring This Month</div>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Overdue Payments</div>
            <p className="text-2xl font-bold text-red-600">3</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search tenants..." 
              className="w-full pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeFilter === "All" ? "default" : "outline"} 
            size="sm"
            onClick={() => filterTenants("All")}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "Active" ? "default" : "outline"} 
            size="sm"
            onClick={() => filterTenants("Active")}
          >
            Active
          </Button>
          <Button 
            variant={activeFilter === "Overdue" ? "default" : "outline"} 
            size="sm"
            onClick={() => filterTenants("Overdue")}
          >
            Overdue
          </Button>
          <Button 
            variant={activeFilter === "Expiring Soon" ? "default" : "outline"} 
            size="sm"
            onClick={() => filterTenants("Expiring Soon")}
          >
            Expiring Soon
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property & Unit</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Period</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Avatar>
                        <img src={tenant.avatar} alt={tenant.name} />
                      </Avatar>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-xs text-gray-500">{tenant.email}</div>
                      <div className="text-xs text-gray-500">{tenant.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{tenant.property}</div>
                  <div className="text-sm text-gray-500">{tenant.unit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(tenant.moveInDate).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    className={`${
                      tenant.rentStatus === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : tenant.rentStatus === "Partial" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tenant.rentStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewTenant(tenant.id)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMessageTenant(tenant.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <TenantInviteDialog 
        open={isInviteDialogOpen} 
        onOpenChange={setIsInviteDialogOpen}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
}
