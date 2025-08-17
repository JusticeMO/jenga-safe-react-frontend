
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, DollarSign, Users, Home, Save } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";

// This would typically come from an environment variable
// For a production app, you'd want to use your own Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWFpIiwiYSI6ImNsdDhleGJyYzFwcngya3BpZW45bHR3Z3MifQ.a0iti-T4nX9u9w5dFAmLxg';
mapboxgl.accessToken = MAPBOX_TOKEN;

export function PropertyDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  // Mock property data - in a real app, you would fetch this from API
  const [property, setProperty] = useState({
    id: id || "new",
    name: id ? "Sunshine Apartments" : "",
    address: id ? "123 Main Street, Nairobi" : "",
    description: id ? "A beautiful apartment complex with modern amenities" : "",
    units: id ? 12 : 0,
    occupiedUnits: id ? 10 : 0,
    rent: id ? 25000 : 0,
    location: {
      latitude: -1.286389,
      longitude: 36.817223
    },
    amenities: id ? "Swimming pool, Gym, Security, Parking" : "",
    rules: id ? "No pets, No smoking" : ""
  });

  // Initialize map
  useEffect(() => {
    if (map.current) return; // Initialize map only once
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [property.location.longitude, property.location.latitude],
        zoom: 12
      });

      // Add marker
      new mapboxgl.Marker()
        .setLngLat([property.location.longitude, property.location.latitude])
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }
  }, [property.location.longitude, property.location.latitude]);

  // Update marker when location changes
  useEffect(() => {
    if (!map.current) return;
    map.current.setCenter([property.location.longitude, property.location.latitude]);
    
    // Remove existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while(markers[0]) {
      markers[0].parentNode.removeChild(markers[0]);
    }
    
    // Add new marker
    new mapboxgl.Marker()
      .setLngLat([property.location.longitude, property.location.latitude])
      .addTo(map.current);
  }, [property.location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rentValue = parseInt(e.target.value) || 0;
    setProperty(prev => ({
      ...prev,
      rent: rentValue
    }));
  };

  const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const units = parseInt(e.target.value) || 0;
    setProperty(prev => ({
      ...prev,
      units
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setProperty(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name === 'latitude' ? 'latitude' : 'longitude']: numValue
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the property to your database
    toast({
      title: "Success",
      description: `Property ${id ? "updated" : "created"} successfully`,
    });
    
    navigate("/landlord/properties");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {id ? `Edit Property: ${property.name}` : "Add New Property"}
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
                  value={property.name}
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
                    value={property.address}
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
                    value={property.rent}
                    onChange={handleRentChange}
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
                    value={property.units}
                    onChange={handleUnitsChange}
                    required
                    className="pl-9"
                  />
                  <Home className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                name="description"
                value={property.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Property Amenities & Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (Comma separated)</Label>
              <Textarea
                id="amenities"
                name="amenities"
                value={property.amenities}
                onChange={handleInputChange}
                rows={2}
                placeholder="Swimming pool, Gym, Security, Parking"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rules">Property Rules</Label>
              <Textarea
                id="rules"
                name="rules"
                value={property.rules}
                onChange={handleInputChange}
                rows={2}
                placeholder="No pets, No smoking"
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
                  type="number"
                  step="0.000001"
                  value={property.location.latitude}
                  onChange={handleLocationChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.000001"
                  value={property.location.longitude}
                  onChange={handleLocationChange}
                  required
                />
              </div>
            </div>
            
            <div className="h-[300px] bg-gray-100 rounded-md overflow-hidden" ref={mapContainer} />
            
            <div className="text-xs text-gray-500">
              <p>Tip: You can search for coordinates using Google Maps or another mapping service.</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" className="px-8">
            <Save className="mr-2 h-4 w-4" />
            {id ? "Update Property" : "Create Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
