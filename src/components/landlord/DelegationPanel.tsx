import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Property } from "@/types";
import { AlertCircle, Check, UserPlus, X } from "lucide-react";

interface Delegate {
  id: number;
  manager: {
    id: number;
    name: string;
    email: string;
  };
  access_level: 'limited' | 'full';
  property: {
    id: number;
    name: string;
  };
}

export function DelegationPanel() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    manager_email: '',
    access_level: 'limited' as 'limited' | 'full',
  });

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getProperties();
        if (response.success) {
          setProperties(response.data);
          // Auto-select first property if available
          if (response.data.length > 0 && !selectedPropertyId) {
            setSelectedPropertyId(String(response.data[0].id));
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch properties",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching properties",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  // Fetch delegates when selected property changes
  useEffect(() => {
    if (!selectedPropertyId) return;
    
    const fetchDelegates = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getDelegates({ propertyId: selectedPropertyId });
        if (response.success) {
          setDelegates(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch delegates",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching delegates",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDelegates();
  }, [selectedPropertyId, toast]);

  const handlePropertyChange = (value: string) => {
    setSelectedPropertyId(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccessLevelChange = (value: 'limited' | 'full') => {
    setForm(prev => ({
      ...prev,
      access_level: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyId) {
      toast({
        title: "Error",
        description: "Please select a property",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.inviteDelegate({
        manager_email: form.manager_email,
        property_id: selectedPropertyId,
        access_level: form.access_level
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Delegate invitation sent successfully",
        });
        
        // Reset form
        setForm({
          manager_email: '',
          access_level: 'limited',
        });
        
        // Refresh delegates list
        const delegatesResponse = await apiClient.getDelegates({ propertyId: selectedPropertyId });
        if (delegatesResponse.success) {
          setDelegates(delegatesResponse.data);
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to invite delegate",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while inviting delegate",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAccessLevel = async (delegateId: number, accessLevel: 'limited' | 'full') => {
    setIsLoading(true);
    try {
      const response = await apiClient.updateDelegate(delegateId, { access_level: accessLevel });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Delegate access level updated successfully",
        });
        
        // Update local state
        setDelegates(prev => 
          prev.map(delegate => 
            delegate.id === delegateId 
              ? { ...delegate, access_level: accessLevel } 
              : delegate
          )
        );
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update delegate access",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating delegate access",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRevokeDelegate = (delegate: Delegate) => {
    const confirmed = window.confirm(
      `Are you sure you want to revoke ${delegate.manager.name}'s access to ${delegate.property.name}?`
    );
    if (confirmed) {
      handleRevokeDelegate(delegate);
    }
  };

  const handleRevokeDelegate = async (delegate: Delegate) => {
    
    setIsLoading(true);
    try {
      const response = await apiClient.revokeDelegate(delegate.id);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Delegate access revoked successfully",
        });
        
        // Remove from local state
        setDelegates(prev => prev.filter(d => d.id !== delegate.id));
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to revoke delegate access",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while revoking delegate access",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Manager Delegation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Selection */}
          <div className="space-y-2">
            <Label htmlFor="property">Select Property</Label>
            <Select
              value={selectedPropertyId}
              onValueChange={handlePropertyChange}
              disabled={isLoading || properties.length === 0}
            >
              <SelectTrigger id="property">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={String(property.id)}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {properties.length === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground">No properties found. Please add a property first.</p>
            )}
          </div>

          {/* Invite New Delegate Form */}
          {selectedPropertyId && (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Invite New Property Manager</h3>
              
              <div className="space-y-2">
                <Label htmlFor="manager_email">Manager Email</Label>
                <Input
                  id="manager_email"
                  name="manager_email"
                  type="email"
                  value={form.manager_email}
                  onChange={handleInputChange}
                  placeholder="manager@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Access Level</Label>
                <RadioGroup
                  value={form.access_level}
                  onValueChange={handleAccessLevelChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="limited" id="access_limited" />
                    <Label htmlFor="access_limited">Limited (View only)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="access_full" />
                    <Label htmlFor="access_full">Full (Can modify)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button type="submit" disabled={isSubmitting || !selectedPropertyId}>
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Inviting..." : "Invite Manager"}
              </Button>
            </form>
          )}

          {/* Current Delegates List */}
          {selectedPropertyId && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Current Property Managers</h3>
              
              {isLoading ? (
                <div className="text-center py-4">Loading delegates...</div>
              ) : delegates.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No property managers assigned to this property yet.
                </div>
              ) : (
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Level</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {delegates.map((delegate) => (
                        <tr key={delegate.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{delegate.manager.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{delegate.manager.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Select
                              value={delegate.access_level}
                              onValueChange={(value: 'limited' | 'full') => handleUpdateAccessLevel(delegate.id, value)}
                              disabled={isLoading}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="limited">Limited</SelectItem>
                                <SelectItem value="full">Full</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => confirmRevokeDelegate(delegate)}
                              disabled={isLoading}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
