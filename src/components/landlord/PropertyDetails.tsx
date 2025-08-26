import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, DollarSign, Users, Home, Save, Percent } from "lucide-react";
import { apiClient } from "@/lib/api";

// Google Maps API key – configure in .env as VITE_GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ?? "";

/**
 * Dynamically load Google Maps JS (Places library).  Returns a promise that
 * resolves when the script is ready or immediately if already loaded.
 */
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if ((window as any).google?.maps?.places) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("gmaps-script") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "gmaps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.body.appendChild(script);
  });
}

// Define form state interface
interface PropertyFormState {
  name: string;
  address: string;
  description: string;
  units: number | string;
  rent: number | string;
  tax_rate: number | string;
  latitude: string;
  longitude: string;
  amenities: string;
}

export function PropertyDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // ref for Google Maps Autocomplete input
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  
  // Initialize form with empty values
  const [form, setForm] = useState<PropertyFormState>({
    name: '',
    address: '',
    description: '',
    units: '',
    rent: '',
    tax_rate: '',
    latitude: '',
    longitude: '',
    amenities: '',
  });

  // Load existing property data when editing
  useEffect(() => {
    if (id && id !== "new") {
      const fetchProperty = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.getProperty(id);
          if (response.success) {
            const property = response.data;
            
            // Map backend fields to form state
            setForm({
              name: property.name || '',
              address: property.address || '',
              description: property.description || '',
              units: property.total_units || '',
              rent: property.rent_amount || '',
              tax_rate: property.tax_rate || '',
              latitude: property.latitude || '',
              longitude: property.longitude || '',
              amenities: Array.isArray(property.amenities) 
                ? property.amenities.join(', ') 
                : property.amenities || '',
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch property details",
              variant: "destructive",
            });
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Failed to fetch property details";
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, toast]);

  // ---- Google Places Autocomplete ----
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return; // skip if no API key

    const initAutocomplete = () => {
      if (!locationInputRef.current || !(window as any).google?.maps?.places) return;
      const autocomplete = new (window as any).google.maps.places.Autocomplete(
        locationInputRef.current,
        { fields: ["formatted_address", "geometry", "name"], types: ["geocode"] }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const address =
          place.formatted_address || place.name || locationInputRef.current!.value;
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        setForm((prev) => ({
          ...prev,
          address,
          latitude: lat !== undefined ? String(lat) : prev.latitude,
          longitude: lng !== undefined ? String(lng) : prev.longitude,
        }));
      });
    };

    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then(initAutocomplete)
      .catch((err) => console.error("Google Maps load error:", err));
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id && id !== "new") {
        await apiClient.updateProperty(id, form as any);
      } else {
        await apiClient.createProperty(form as any);
      }
      toast({
        title: "Success",
        description: `Property ${id && id !== "new" ? "updated" : "created"} successfully`,
      });
      navigate("/landlord/properties");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save property";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {id && id !== "new" ? `Edit Property: ${form.name}` : "Add New Property"}
        </h1>
        <Button onClick={() => navigate("/landlord/properties")}>
          Back to Properties
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Property Address</Label>
                <div className="relative">
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    required
                    className="pl-9"
                  />
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rent">Rent Amount (KES)</Label>
                <div className="relative">
                  <Input
                    id="rent"
                    name="rent"
                    type="number"
                    value={form.rent}
                    onChange={handleInputChange}
                    required
                    className="pl-9"
                  />
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Number of Units</Label>
                <div className="relative">
                  <Input
                    id="units"
                    name="units"
                    type="number"
                    value={form.units}
                    onChange={handleInputChange}
                    required
                    className="pl-9"
                  />
                  <Home className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <div className="relative">
                  <Input
                    id="tax_rate"
                    name="tax_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.tax_rate}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                  <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Property Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (Comma separated)</Label>
              <Textarea
                id="amenities"
                name="amenities"
                value={form.amenities}
                onChange={handleInputChange}
                rows={2}
                placeholder="Swimming pool, Gym, Security, Parking"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Property Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="text"
                  value={form.latitude}
                  onChange={handleInputChange}
                  placeholder="-1.2921"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="text"
                  value={form.longitude}
                  onChange={handleInputChange}
                  placeholder="36.8219"
                />
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Tip: You can search for coordinates using Google Maps or another mapping service.</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" className="px-8" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading 
              ? (id && id !== "new" ? "Updating..." : "Creating...") 
              : (id && id !== "new" ? "Update Property" : "Create Property")}
          </Button>
        </div>
      </form>
    </div>
  );
}
