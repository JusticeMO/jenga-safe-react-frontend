import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Heart, Flame, Shield, Building, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { EmergencyContact } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const iconMap = {
  Heart,
  Flame,
  Shield,
  Building,
  AlertTriangle,
};

export function EmergencyServices() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        // 1. Attempt to determine the tenant's property id via their unit
        let propertyId: string | number | undefined;
        try {
          const unitRes = await apiClient.getMyUnit();
          if (unitRes.success && unitRes.data?.property_id) {
            propertyId = unitRes.data.property_id;
          }
        } catch {
          // Ignore – if this fails we just fall back to global contacts
        }

        // 2. Fetch contacts – include propertyId if we have one
        const contactsRes = propertyId
          ? await apiClient.getEmergencyContacts({ propertyId })
          : await apiClient.getEmergencyContacts();

        if (contactsRes.success) {
          setContacts(contactsRes.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch essential contacts",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch essential contacts";
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
          <p className="text-sm text-gray-600 mt-1">Quick access to essential contacts for urgent situations</p>
        </div>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {contacts.map((contact) => {
          const Icon = iconMap[contact.icon as keyof typeof iconMap] || AlertTriangle;
          const bgCls = contact.bg_color || (contact as any).bgColor || "bg-red-100";
          const txtCls = contact.text_color || (contact as any).textColor || "text-red-600";
          return (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full ${bgCls}`}>
                    <Icon className={`h-6 w-6 ${txtCls}`} />
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

      {/* Value-add Household & Community Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* 1. Essentials */}
        <Card>
          <CardHeader>
            <CardTitle>Essentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button
                className="w-full md:w-auto h-11 px-5 bg-[#ea384c] hover:bg-[#d32f41] text-white"
                onClick={() => navigate("/tenant/emergency-services/essentials")}
              >
                View Contacts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. Home Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Home Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Plumbing &amp; Drainage Services</li>
              <li>Electrical Repairs &amp; Installations</li>
              <li>Carpentry &amp; Furniture Fixes</li>
              <li>Appliance Repairs (fridge, cooker, washing machine, etc.)</li>
              <li>Pest Control Services</li>
            </ul>

            {/* CTA buttons */}
            <div className="mt-4 flex flex-col md:flex-row justify-center gap-2">
              <Button
                className="w-full md:w-auto h-11 px-5 bg-[#ea384c] hover:bg-[#d32f41] text-white"
                onClick={() =>
                  navigate("/tenant/emergency-services/home-maintenance")
                }
              >
                Request Maintenance
              </Button>
              <Button
                variant="outline"
                className="w-full md:w-auto h-11 px-5"
                onClick={() => handleCallNow("+254700000001", "Estate Handyman")}
              >
                Call Estate Handyman
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3. Household Support */}
        <Card>
          <CardHeader>
            <CardTitle>Household Support</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>House Cleaning Services (on-demand or scheduled)</li>
              <li>Laundry &amp; Ironing (pickup &amp; delivery)</li>
              <li>Waste Collection &amp; Recycling (extra pickups beyond estate schedule)</li>
            </ul>

            {/* CTA button */}
            <div className="mt-4 flex justify-center">
              <Button
                className="w-full md:w-auto h-11 px-5 bg-[#ea384c] hover:bg-[#d32f41] text-white"
                onClick={() =>
                  navigate("/tenant/emergency-services/household-support")
                }
              >
                Book Household Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 4. Food & Lifestyle */}
        <Card>
          <CardHeader>
            <CardTitle>Food &amp; Lifestyle</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Fresh Butcher &amp; Meat Delivery</li>
              <li>Bakery &amp; Pastry Orders</li>
              <li>Prepared Meals / Tiffin Services (home-cooked meal delivery)</li>
              <li>Pharmacy &amp; Health Supplies</li>
              <li>Pet Food &amp; Supplies</li>
            </ul>

            {/* CTA buttons */}
            <div className="mt-4 flex flex-col md:flex-row justify-center gap-2">
              <Button
                className="w-full md:w-auto h-11 px-5 bg-[#ea384c] hover:bg-[#d32f41] text-white"
                onClick={() =>
                  navigate("/tenant/emergency-services/food-lifestyle")
                }
              >
                Order Now
              </Button>
              <Button
                variant="outline"
                className="w-full md:w-auto h-11 px-5"
                onClick={() =>
                  handleCallNow("+254700000002", "Nearest Food Vendor")
                }
              >
                Call Nearest Vendor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 5. Community & Value-Add */}
        <Card>
          <CardHeader>
            <CardTitle>Community &amp; Value-Add</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Local Farmer’s Produce Subscription (weekly fruit/veg baskets)</li>
              <li>Neighbourhood Marketplace (buy/sell household items)</li>
              <li>Wellness Services (fitness trainers, yoga instructors, massage)</li>
            </ul>

            {/* CTA buttons */}
            <div className="mt-4 flex flex-col md:flex-row justify-center gap-2">
              <Button
                className="w-full md:w-auto h-11 px-5 bg-[#ea384c] hover:bg-[#d32f41] text-white"
                onClick={() =>
                  navigate("/tenant/emergency-services/community-value-add")
                }
              >
                Explore Services
              </Button>
              <Button
                variant="outline"
                className="w-full md:w-auto h-11 px-5"
                onClick={() => navigate("/tenant/explore")}
              >
                Open Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
