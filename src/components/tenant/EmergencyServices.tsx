
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Heart, Flame, Shield, Building, AlertTriangle } from "lucide-react";

const emergencyContacts = [
  {
    id: 1,
    name: "Ambulance",
    description: "For medical emergencies requiring immediate transport",
    number: "911",
    icon: Heart,
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-600"
  },
  {
    id: 2,
    name: "Fire Brigade",
    description: "For fire emergencies and rescue operations",
    number: "999",
    icon: Flame,
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600"
  },
  {
    id: 3,
    name: "Police",
    description: "For crime reporting and emergency police assistance",
    number: "999",
    icon: Shield,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600"
  },
  {
    id: 4,
    name: "Hospital",
    description: "Nearest hospital for non-emergency medical care",
    number: "0712-345678",
    icon: Building,
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-600"
  },
  {
    id: 5,
    name: "First Aid",
    description: "For minor injuries and first aid assistance",
    number: "0787-654321",
    icon: Heart,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600"
  },
  {
    id: 6,
    name: "Security Company",
    description: "Property security company for safety concerns",
    number: "0723-111222",
    icon: Shield,
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600"
  }
];

export function EmergencyServices() {
  const handleCallNow = (number: string, name: string) => {
    // In a real app, this would initiate a phone call
    window.open(`tel:${number}`);
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Emergency Services</h1>
          <p className="text-sm text-gray-600 mt-1">Quick access to emergency contacts for urgent situations</p>
        </div>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {emergencyContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-full ${contact.bgColor}`}>
                  <contact.icon className={`h-6 w-6 ${contact.textColor}`} />
                </div>
                <Button 
                  size="sm" 
                  className="bg-[#ea384c] hover:bg-[#d32f41] text-white"
                  onClick={() => handleCallNow(contact.number, contact.name)}
                >
                  <Phone className="mr-1 h-4 w-4" />
                  Call Now
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.description}</p>
                <p className="font-mono text-lg font-bold">{contact.number}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important Information */}
      <Card className="border-l-4 border-yellow-500">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">Important Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <p className="text-sm text-yellow-800">
              In case of emergency, call the appropriate service immediately. For property-related emergencies, also notify your property manager through the messaging system after contacting emergency services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
