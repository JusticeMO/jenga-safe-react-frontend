
import { mockProperties } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PropertiesView() {
  const navigate = useNavigate();
  
  const handleAddProperty = () => {
    navigate("/landlord/property/new");
  };
  
  const handleViewDetails = (propertyId: string) => {
    navigate(`/landlord/property/${propertyId}`);
  };
  
  const handleManageUnits = (propertyId: string) => {
    navigate(`/landlord/property/${propertyId}/units`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button onClick={handleAddProperty}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProperties.map((property) => {
          const occupancyRate = (property.occupiedUnits / property.units) * 100;
          
          return (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <Home className="w-12 h-12 opacity-50" />
                </div>
              </div>
              <CardHeader>
                <CardTitle>{property.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{property.address}</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Occupancy</span>
                      <span>{property.occupiedUnits} of {property.units} units</span>
                    </div>
                    <Progress value={occupancyRate} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleViewDetails(property.id)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleManageUnits(property.id)}
                    >
                      Manage Units
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
