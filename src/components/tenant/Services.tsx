import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Heart, Flame, Shield, Building, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { EmergencyContact } from "@/types";
import { useToast } from "@/hooks/use-toast";

const iconMap = {
  Heart,
  Flame,
  Shield,
  Building,
  AlertTriangle,
};

export function Services() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getEmergencyContacts();
        if (response.success) {
          setContacts(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch contacts",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch contacts";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, [toast]);

  const handleCallNow = (number: string, name: string) => {
    // In a real app, this would initiate a phone call
    window.open(`tel:${number}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Services</h1>
          <p className="text-sm text-gray-600 mt-1">Quick access to useful contacts for your tenancy</p>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {contacts.map((contact) => {
          const Icon = iconMap[contact.icon as keyof typeof iconMap] || AlertTriangle;
          return (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full ${contact.bgColor}`}>
                    <Icon className={`h-6 w-6 ${contact.textColor}`} />
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
          );
        })}
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
