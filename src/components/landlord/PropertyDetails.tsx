import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, DollarSign, Users, Home, Save, Percent, Droplets, Zap, CreditCard, Building, AlertCircle } from "lucide-react";
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
  // Landlord expansion fields
  location_city: string;
  water_rate: number | string;
  electricity_rate: number | string;
  payment_method: 'till' | 'paybill' | 'bank' | '';
  payment_account: string;
  bank_name: string;
  penalty_type: 'rent_percentage' | 'balance_percentage' | '';
  penalty_value: number | string;
  garbage_fee: number | string;
  management_fee_type: 'percent_of_rent' | 'flat_amount' | '';
  management_fee_value: number | string;
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
    // Initialize landlord expansion fields
    location_city: '',
    water_rate: '',
    electricity_rate: '',
    payment_method: '',
    payment_account: '',
    bank_name: '',
    penalty_type: '',
    penalty_value: '',
    garbage_fee: '',
    management_fee_type: '',
    management_fee_value: '',
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
              // Map landlord expansion fields
              location_city: property.location_city || '',
              water_rate: property.water_rate || '',
              electricity_rate: property.electricity_rate || '',
              payment_method: property.payment_method || '',
              payment_account: property.payment_account || '',
              bank_name: property.bank_name || '',
              penalty_type: property.penalty_type || '',
              penalty_value: property.penalty_value || '',
              garbage_fee: property.garbage_fee || '',
              management_fee_type: property.management_fee_type || '',
              management_fee_value: property.management_fee_value || '',
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

  // Handle radio input changes
  const handleRadioChange = (name: string, value: string) => {
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

  // Check if latitude and longitude are valid for map display
  const hasValidCoordinates = () => {
    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
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
                    ref={locationInputRef}
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
        
        {/* Billing & Utilities Card */}
        <Card>
          <CardHeader>
            <CardTitle>Billing & Utilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_city">City</Label>
                <Input
                  id="location_city"
                  name="location_city"
                  value={form.location_city}
                  onChange={handleInputChange}
                  placeholder="e.g. Nairobi"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="water_rate">Water Rate (KES/unit)</Label>
                <div className="relative">
                  <Input
                    id="water_rate"
                    name="water_rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.water_rate}
                    onChange={handleInputChange}
                    required
                    className="pl-9"
                  />
                  <Droplets className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="electricity_rate">Electricity Rate (KES/unit)</Label>
                <div className="relative">
                  <Input
                    id="electricity_rate"
                    name="electricity_rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.electricity_rate}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                  <Zap className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup 
                value={form.payment_method} 
                onValueChange={(value) => handleRadioChange('payment_method', value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="till" id="payment_method_till" />
                  <Label htmlFor="payment_method_till">Till Number</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paybill" id="payment_method_paybill" />
                  <Label htmlFor="payment_method_paybill">Paybill</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="payment_method_bank" />
                  <Label htmlFor="payment_method_bank">Bank Transfer</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment_account">Payment Account</Label>
              <div className="relative">
                <Input
                  id="payment_account"
                  name="payment_account"
                  value={form.payment_account}
                  onChange={handleInputChange}
                  placeholder={form.payment_method === 'bank' ? "Account Number" : form.payment_method === 'paybill' ? "Paybill Number" : "Till Number"}
                  className="pl-9"
                />
                <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {form.payment_method === 'bank' && (
              <div className="space-y-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <div className="relative">
                  <Input
                    id="bank_name"
                    name="bank_name"
                    value={form.bank_name}
                    onChange={handleInputChange}
                    placeholder="e.g. KCB, Equity, Co-operative"
                    className="pl-9"
                  />
                  <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Policies & Fees Card */}
        <Card>
          <CardHeader>
            <CardTitle>Policies & Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Penalty Type</Label>
              <RadioGroup 
                value={form.penalty_type} 
                onValueChange={(value) => handleRadioChange('penalty_type', value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent_percentage" id="penalty_type_rent" />
                  <Label htmlFor="penalty_type_rent">Percentage of Rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balance_percentage" id="penalty_type_balance" />
                  <Label htmlFor="penalty_type_balance">Percentage of Outstanding Balance</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="penalty_value">Penalty Value (%)</Label>
                <div className="relative">
                  <Input
                    id="penalty_value"
                    name="penalty_value"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.penalty_value}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                  <AlertCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="garbage_fee">Garbage Fee (KES)</Label>
                <div className="relative">
                  <Input
                    id="garbage_fee"
                    name="garbage_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.garbage_fee}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Management Fee Type</Label>
              <RadioGroup 
                value={form.management_fee_type} 
                onValueChange={(value) => handleRadioChange('management_fee_type', value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percent_of_rent" id="management_fee_type_percent" />
                  <Label htmlFor="management_fee_type_percent">Percentage of Rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flat_amount" id="management_fee_type_flat" />
                  <Label htmlFor="management_fee_type_flat">Flat Amount</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="management_fee_value">
                Management Fee {form.management_fee_type === 'percent_of_rent' ? '(%)' : '(KES)'}
              </Label>
              <div className="relative">
                <Input
                  id="management_fee_value"
                  name="management_fee_value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.management_fee_value}
                  onChange={handleInputChange}
                  className="pl-9"
                />
                {form.management_fee_type === 'percent_of_rent' ? (
                  <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                ) : (
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                )}
              </div>
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
            
            {hasValidCoordinates() && (
              <div className="mt-4">
                <Label>Map Preview</Label>
                <div className="mt-2 border rounded-md overflow-hidden h-[300px]">
                  <iframe
                    title="Property Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps?q=${form.latitude},${form.longitude}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            
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
