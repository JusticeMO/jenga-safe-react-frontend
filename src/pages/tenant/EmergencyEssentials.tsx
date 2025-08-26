import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EssentialService {
  id: string;
  name: string;
  provider: string;
  phone: string;
  description: string;
}

export default function EmergencyEssentials() {
  const navigate = useNavigate();
  
  // Sample essential services with providers and phone numbers
  const [essentialServices] = useState<EssentialService[]>([
    {
      id: "gas",
      name: "Cooking Gas Refills",
      provider: "GasExpress Kenya",
      phone: "+254700123456",
      description: "Fast delivery of cooking gas cylinders in various sizes (6kg, 13kg, etc.)"
    },
    {
      id: "water",
      name: "Drinking Water Delivery",
      provider: "Pure Water Solutions",
      phone: "+254711234567",
      description: "Clean drinking water in 20L dispensers and bottled options"
    },
    {
      id: "groceries",
      name: "Groceries & Vegetables",
      provider: "Fresh Basket Delivery",
      phone: "+254722345678",
      description: "Fresh produce and groceries delivered to your doorstep"
    },
    {
      id: "breakfast",
      name: "Milk, Bread & Breakfast Items",
      provider: "Morning Essentials",
      phone: "+254733456789",
      description: "Daily delivery of fresh milk, bread, eggs, and other breakfast necessities"
    },
    {
      id: "cleaning",
      name: "Cleaning & Hygiene Supplies",
      provider: "CleanHome Supplies",
      phone: "+254744567890",
      description: "Household cleaning products, detergents, and personal hygiene items"
    }
  ]);

  const handleCallNow = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/tenant/emergency-services")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Emergency Services
          </Button>
          <h1 className="text-xl md:text-2xl font-bold">Essential Services</h1>
          <p className="text-sm text-gray-600 mt-1">Quick access to everyday household necessities</p>
        </div>
      </div>

      {/* Essential Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {essentialServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">{service.provider}</p>
                <p className="text-sm text-gray-600">{service.description}</p>
                <p className="font-mono font-bold">{service.phone}</p>
              </div>
              
              <Button
                className="w-full bg-[#ea384c] hover:bg-[#d32f41] text-white"
                onClick={() => handleCallNow(service.phone)}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-l-4 border-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">About Essential Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-sm text-blue-800">
              These essential service providers are recommended by your property management. 
              Prices and availability may vary. For any issues with service quality, 
              please report through the complaint system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
