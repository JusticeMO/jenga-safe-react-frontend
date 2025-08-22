
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockProperties } from "@/lib/data";
import { Plus, Edit, Trash2, Check, ArrowLeft, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";

type Unit = {
  id: string;
  unitNumber: string;
  size: string;
  rent: number;
  status: "available" | "occupied" | "maintenance";
  tenantId?: string;
  tenantName?: string;
};

type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export function PropertyUnitsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const property = mockProperties.find(p => p.id === id);
  
  // Mock tenants data
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([
    {
      id: "t3",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "555-123-4567",
      avatar: "/placeholder.svg"
    },
    {
      id: "t4",
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "555-987-6543",
      avatar: "/placeholder.svg"
    },
    {
      id: "t5",
      name: "David Chen",
      email: "david@example.com",
      phone: "555-456-7890",
      avatar: "/placeholder.svg"
    }
  ]);
  
  const [units, setUnits] = useState<Unit[]>([
    {
      id: "u1",
      unitNumber: "A101",
      size: "1 bedroom",
      rent: 25000,
      status: "occupied",
      tenantId: "t1",
      tenantName: "John Doe"
    },
    {
      id: "u2",
      unitNumber: "A102",
      size: "1 bedroom",
      rent: 25000,
      status: "occupied",
      tenantId: "t2",
      tenantName: "Sarah Johnson"
    },
    {
      id: "u3",
      unitNumber: "B101",
      size: "2 bedroom",
      rent: 35000,
      status: "available"
    }
  ]);
  
  const [newUnit, setNewUnit] = useState<Omit<Unit, "id">>({
    unitNumber: "",
    size: "",
    rent: 0,
    status: "available"
  });
  
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [assignTenantUnitId, setAssignTenantUnitId] = useState<string | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter units based on status
  useEffect(() => {
    if (statusFilter) {
      setFilteredUnits(units.filter(unit => unit.status === statusFilter));
    } else {
      setFilteredUnits(units);
    }
  }, [units, statusFilter]);

  const handleUnitInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "rent") {
      setNewUnit(prev => ({
        ...prev,
        rent: parseInt(value) || 0
      }));
    } else {
      setNewUnit(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStatusChange = (value: "available" | "occupied" | "maintenance") => {
    setNewUnit(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleAddUnit = () => {
    if (!newUnit.unitNumber || !newUnit.size || newUnit.rent <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const unit = {
      ...newUnit,
      id: `u${units.length + 1}`
    };

    setUnits(prev => [...prev, unit]);
    setNewUnit({
      unitNumber: "",
      size: "",
      rent: 0,
      status: "available"
    });
    setIsAddingUnit(false);
    
    toast({
      title: "Unit Added",
      description: `Unit ${unit.unitNumber} has been added successfully`
    });
  };

  const handleAssignTenant = (unitId: string) => {
    setAssignTenantUnitId(unitId);
    setIsAssignDialogOpen(true);
  };
  
  const handleConfirmAssignTenant = () => {
    if (!selectedTenantId || !assignTenantUnitId) {
      toast({
        title: "Error",
        description: "Please select a tenant",
        variant: "destructive"
      });
      return;
    }
    
    const tenant = availableTenants.find(t => t.id === selectedTenantId);
    
    // Update the unit with tenant information
    setUnits(prev => prev.map(unit => 
      unit.id === assignTenantUnitId ? {
        ...unit,
        status: "occupied",
        tenantId: selectedTenantId,
        tenantName: tenant?.name
      } : unit
    ));
    
    // Remove assigned tenant from available tenants
    setAvailableTenants(prev => prev.filter(t => t.id !== selectedTenantId));
    
    setIsAssignDialogOpen(false);
    setSelectedTenantId(null);
    
    toast({
      title: "Tenant Assigned",
      description: `${tenant?.name} has been assigned to this unit.`
    });
  };

  const handleDeleteUnit = (unitId: string) => {
    // In a real app, you'd want a confirmation dialog
    setUnits(prev => prev.filter(unit => unit.id !== unitId));
    toast({
      title: "Unit Removed",
      description: "The unit has been removed successfully."
    });
  };
  
  const handleFilterChange = (status: string | null) => {
    setStatusFilter(status);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/landlord/properties")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {property?.name || "Property"} - Manage Units
          </h1>
        </div>
        
        <Button onClick={() => setIsAddingUnit(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </div>
      
      {isAddingUnit && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Unit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitNumber">Unit Number</Label>
                <Input
                  id="unitNumber"
                  name="unitNumber"
                  value={newUnit.unitNumber}
                  onChange={handleUnitInputChange}
                  placeholder="e.g. A101"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  name="size"
                  value={newUnit.size}
                  onChange={handleUnitInputChange}
                  placeholder="e.g. 1 bedroom"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rent">Rent (KES)</Label>
                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  value={newUnit.rent || ""}
                  onChange={handleUnitInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={newUnit.status}
                onValueChange={(value) => handleStatusChange(value as "available" | "occupied" | "maintenance")}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingUnit(false)}>Cancel</Button>
              <Button onClick={handleAddUnit}>Add Unit</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={statusFilter === null ? "default" : "outline"} 
          size="sm"
          onClick={() => handleFilterChange(null)}
        >
          All
        </Button>
        <Button 
          variant={statusFilter === "available" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleFilterChange("available")}
        >
          Available
        </Button>
        <Button 
          variant={statusFilter === "occupied" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleFilterChange("occupied")}
        >
          Occupied
        </Button>
        <Button 
          variant={statusFilter === "maintenance" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleFilterChange("maintenance")}
        >
          Maintenance
        </Button>
      </div>

      <div className="overflow-hidden border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUnits.map((unit) => (
              <tr key={unit.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{unit.unitNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit.size}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES {unit.rent.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    unit.status === "available" ? "bg-green-100 text-green-800" :
                    unit.status === "occupied" ? "bg-blue-100 text-blue-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {unit.tenantName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {unit.status !== "occupied" && (
                      <Button variant="ghost" size="sm" onClick={() => handleAssignTenant(unit.id)}>
                        <User className="h-4 w-4" />
                        <span className="sr-only">Assign Tenant</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteUnit(unit.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Tenant Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Tenant</DialogTitle>
            <DialogDescription>
              Select a tenant to assign to this unit.
            </DialogDescription>
          </DialogHeader>
          
          {availableTenants.length > 0 ? (
            <div className="py-4">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {availableTenants.map(tenant => (
                  <div 
                    key={tenant.id}
                    className={`p-3 rounded-md cursor-pointer flex items-center space-x-3 ${
                      selectedTenantId === tenant.id ? "bg-primary/10" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedTenantId(tenant.id)}
                  >
                    <Avatar>
                      <img 
                        src={tenant.avatar} 
                        alt={tenant.name} 
                        className="rounded-full"
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{tenant.name}</p>
                      <p className="text-xs text-gray-500">{tenant.email}</p>
                    </div>
                    {selectedTenantId === tenant.id && (
                      <Check className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              No available tenants. Please add new tenants first.
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmAssignTenant} disabled={!selectedTenantId || availableTenants.length === 0}>
              Assign Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
