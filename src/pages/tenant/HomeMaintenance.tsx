import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft, Wrench, Zap, Tool, Bug, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaintenanceService {
  id: string;
  name: string;
  provider: string;
  phone: string;
  description: string;
  icon: React.ReactNode;
  requestText: string;
}

export default function HomeMaintenance() {
  const navigate = useNavigate();
  
  // Sample maintenance services with providers and phone numbers
  const [maintenanceServices] = useState<MaintenanceService[]>([
    {
      id: "plumbing",
      name: "Plumbing & Drainage Services",
      provider: "Quick Plumb Solutions",
      phone: "+254700123456",
      description: "Professional plumbing services including pipe repairs, drain unclogging, and water system maintenance.",
      icon: <Wrench className="h-6 w-6 text-blue-500" />,
      requestText: "Request Plumber"
    },
    {
      id: "electrical",
      name: "Electrical Repairs & Installations",
      provider: "Power Fix Kenya",
      phone: "+254711234567",
      description: "Licensed electricians for repairs, installations, and electrical system troubleshooting.",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      requestText: "Request Electrician"
    },
    {
      id: "carpentry",
      name: "Carpentry & Furniture Fixes",
      provider: "Woodcraft Masters",
      phone: "+254722345678",
      description: "Expert carpentry services for furniture repairs, door/window fixes, and custom woodwork.",
      icon: <Tool className="h-6 w-6 text-amber-700" />,
      requestText: "Request Carpenter"
    },
    {
      id: "appliance",
      name: "Appliance Repairs",
      provider: "AppliancePro Kenya",
      phone: "+254733456789",
      description: "Repairs for refrigerators, cookers, washing machines, and other household appliances.",
      icon: <Settings className="h-6 w-6 text-gray-600" />,
      requestText: "Request Technician"
    },
    {
      id: "pest",
      name: "Pest Control Services",
      provider: "PestGuard Solutions",
      phone: "+254744567890",
      description: "Effective pest control treatments for cockroaches, rodents, bedbugs, and other household pests.",
      icon: <Bug className="h-6 w-6 text-green-700" />,
      requestText: "Request Pest Control"
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
          <h1 className="text-xl md:text-2xl font-bold">Home Maintenance</h1>
          <p className="text-sm text-gray-600 mt-1">Professional services for all your home maintenance needs</p>
        </div>
      </div>

      {/* Maintenance Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {maintenanceServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              {service.icon}
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">{service.provider}</p>
                <p className="text-sm text-gray-600">{service.description}</p>
                <p className="font-mono font-bold">{service.phone}</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  className="w-full md:w-auto h-11 px-5 bg-[#ea384c] hover:bg-[#d32f41] text-white"
                  onClick={() => navigate("/tenant/maintenance")}
                >
                  {service.requestText}
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto h-11 px-5"
                  onClick={() => handleCallNow(service.phone)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-l-4 border-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">About Home Maintenance Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-sm text-blue-800">
              These service providers are vetted and recommended by your property management. 
              For emergency maintenance issues affecting multiple units, please contact your 
              property manager directly. Standard service charges apply based on the scope of work.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
