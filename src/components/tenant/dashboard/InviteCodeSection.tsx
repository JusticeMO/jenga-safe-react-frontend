
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { PropertyInfo } from "@/types";

interface InviteCodeSectionProps {
  onSuccessfulRegistration: (propertyDetails: PropertyInfo) => void;
}

export function InviteCodeSection({ onSuccessfulRegistration }: InviteCodeSectionProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // In a real app, this would connect to your backend
  const handleSubmitInviteCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invitation code",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to validate invite code
    try {
      // In a real app, this would be an API call to validate the code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll simulate a successful invite code registration
      // unless they use "INVALID" as the code
      if (inviteCode.toUpperCase() === "INVALID") {
        throw new Error("Invalid invitation code");
      }
      
      // Create property details object
      const propertyDetails = {
        propertyName: "Westlands Heights",
        propertyId: "PROP-WH001",
        unitNumber: "Apartment 3B",
        rentAmount: 25000,
        depositAmount: 50000,
        nextDueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), // Due in 14 days
        firstPaymentDue: true,
        leaseStartDate: new Date().toISOString(),
        leaseEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // 1 year lease
      };
      
      // In a real app, we would update the user's assigned property status with the backend
      // For demo purposes, we'll simulate this by storing in localStorage
      localStorage.setItem('tenantHasProperty', 'true');
      localStorage.setItem('propertyDetails', JSON.stringify(propertyDetails));
      
      toast({
        title: "Success!",
        description: "You've successfully registered for the property.",
      });
      
      // Update parent component state instead of refreshing
      onSuccessfulRegistration(propertyDetails);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process invitation code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the tenant already has a property, don't show this section
  if (user?.hasAssignedProperty) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register for Your Property</CardTitle>
        <CardDescription>
          Enter the invitation code provided by your landlord to register for the property you're moving into.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitInviteCode} className="space-y-4">
          <div className="grid gap-2">
            <Input
              id="inviteCode"
              placeholder="Enter invitation code (e.g., ABC123)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="uppercase"
              disabled={isSubmitting}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register for Property"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            For demo: Use any code except "INVALID"
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
