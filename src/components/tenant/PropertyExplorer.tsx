import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, Bed, Bath, Bell, Video, Image, GalleryHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { apiClient } from "@/lib/api";
import { Property } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function PropertyExplorerView() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    propertyType: "",
    availabilityFilter: "all", // "all", "available", "vacating"
  });
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getAvailableProperties();
        if (response.success) {
          setProperties(response.data);
          setFilteredProperties(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch properties",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch properties";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [toast]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = properties;

    if (filters.location) {
      filtered = filtered.filter(property => 
        property.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => 
        property.price >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => 
        property.price <= Number(filters.maxPrice)
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => 
        property.bedrooms === Number(filters.bedrooms)
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    if (filters.availabilityFilter === "available") {
      filtered = filtered.filter(property => property.available);
    } else if (filters.availabilityFilter === "vacating") {
      filtered = filtered.filter(property => property.vacating);
    }

    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      propertyType: "",
      availabilityFilter: "all",
    });
    setFilteredProperties(properties);
  };

  const viewPropertyDetails = (property: Property) => {
    setSelectedProperty(property);
    setActiveTab("overview");
  };

  const closePropertyDetails = () => {
    setSelectedProperty(null);
  };

  const getAvailabilityBadge = (property: Property) => {
    if (property.available) {
      return <Badge className="bg-[#F2FCE2] text-green-800 hover:bg-green-100">Vacant</Badge>;
    } else if (property.vacating) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 flex gap-1 items-center">
                <Bell className="h-3 w-3" />
                Vacating Soon
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current tenant vacating by {property.vacatingDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return <Badge className="bg-red-100 text-[#ea384c] hover:bg-red-200">Occupied</Badge>;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Explore Properties</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="City or area"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range (KES)</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select 
                value={filters.bedrooms} 
                onValueChange={(value) => handleSelectChange("bedrooms", value)}
              >
                <SelectTrigger id="bedrooms">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select 
                value={filters.propertyType} 
                onValueChange={(value) => handleSelectChange("propertyType", value)}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <Label htmlFor="availability" className="mb-2 block">Availability</Label>
              <Select
                value={filters.availabilityFilter}
                onValueChange={(value) => handleSelectChange("availabilityFilter", value)}
              >
                <SelectTrigger id="availability" className="w-[200px]">
                  <SelectValue placeholder="Show all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Show all</SelectItem>
                  <SelectItem value="available">Vacant only</SelectItem>
                  <SelectItem value="vacating">Vacating soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={resetFilters} className="flex-1 sm:flex-none">Reset</Button>
              <Button onClick={applyFilters} className="flex-1 sm:flex-none">Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#F2FCE2]"></span>
          <span>Vacant</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-100"></span>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-100"></span>
          <span>Vacating Soon</span>
        </div>
      </div>

      {selectedProperty ? (
        <Card className="mb-6">
          <CardHeader className="pb-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={closePropertyDetails}
              className="mb-2"
            >
              ← Back to results
            </Button>
            <CardTitle className="text-xl flex items-center gap-3">
              {selectedProperty.name}
              {getAvailabilityBadge(selectedProperty)}
            </CardTitle>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {selectedProperty.address}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="vr-tour" className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">VR Tour</span>
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Location</span>
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-1">
                  <GalleryHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Media</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="aspect-video w-full overflow-hidden rounded-md mb-6">
                  <img 
                    src={selectedProperty.imageUrl} 
                    alt={selectedProperty.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted rounded-md p-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Price</p>
                    <p className="font-semibold mt-1">KES {selectedProperty.price.toLocaleString()}/mo</p>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold mt-1">{selectedProperty.bedrooms}</p>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold mt-1">{selectedProperty.bathrooms}</p>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Size</p>
                    <p className="font-semibold mt-1">{selectedProperty.size} m²</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground text-sm">
                      A beautiful {selectedProperty.type.toLowerCase()} with {selectedProperty.bedrooms} bedroom(s) and {selectedProperty.bathrooms} bathroom(s). 
                      This property is located in a prime area with easy access to amenities.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Parking</Badge>
                      <Badge variant="outline">Security</Badge>
                      <Badge variant="outline">Water Storage</Badge>
                      <Badge variant="outline">24/7 Electricity</Badge>
                    </div>
                  </div>
                  
                  {selectedProperty.vacating && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Vacancy Notice
                      </h3>
                      <p className="text-sm">
                        The current tenant has given notice and will be vacating by {selectedProperty.vacatingDate}.
                        You can apply now to be considered for occupancy after this date.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="vr-tour" className="mt-0">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Virtual Reality Tour</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Explore this property in immersive 3D with our virtual reality tour.
                  </p>
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                  <iframe 
                    src={selectedProperty.vrTourUrl}
                    title="Virtual Tour"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Navigate using your mouse or trackpad. Click and drag to look around, and use the scrollwheel to zoom in and out.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="mt-0">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Property Location</h3>
                  <p className="text-muted-foreground text-sm">
                    Located at {selectedProperty.address}. Use the map below to get directions.
                  </p>
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedProperty.location.lat},${selectedProperty.location.lng}&zoom=15`}
                  ></iframe>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">*Map shows approximate location</p>
                  <Button variant="outline" size="sm" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedProperty.location.lat},${selectedProperty.location.lng}`, '_blank')}>
                    Get Directions
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="media" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Tour
                    </h3>
                    <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                      <iframe
                        width="100%"
                        height="100%"
                        src={selectedProperty.videoTourUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <GalleryHorizontal className="h-4 w-4" />
                      Property Images
                    </h3>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedProperty.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <AspectRatio ratio={16 / 9}>
                                <img
                                  src={image}
                                  alt={`${selectedProperty.name} - Image ${index + 1}`}
                                  className="rounded-md object-cover w-full h-full"
                                />
                              </AspectRatio>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex items-center justify-center mt-2">
                        <CarouselPrevious className="relative inset-auto mr-2" />
                        <CarouselNext className="relative inset-auto ml-2" />
                      </div>
                    </Carousel>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              disabled={!selectedProperty.available && !selectedProperty.vacating}
            >
              {selectedProperty.available 
                ? "Apply for Tenancy" 
                : selectedProperty.vacating 
                  ? "Apply for Future Tenancy" 
                  : "Not Available"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={property.imageUrl} 
                    alt={property.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    {getAvailabilityBadge(property)}
                  </div>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {property.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold">KES {property.price.toLocaleString()}/mo</p>
                  </div>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="h-3.5 w-3.5 mr-1" />
                      <span>{property.bedrooms} BD</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-3.5 w-3.5 mr-1" />
                      <span>{property.bathrooms} BA</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="h-3.5 w-3.5 mr-1" />
                      <span>{property.size} m²</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => viewPropertyDetails(property)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium">No properties found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search filters</p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Import Label component at the top
const Label = ({ children, htmlFor, className = "" }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);
