
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProperties } from "@/lib/data";
import { Copy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TenantInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSent: (email: string, propertyId: string, unitId: string) => void;
}

interface Unit {
  id: string;
  unitNumber: string;
  rent: number;
  size: string;
  status: "available" | "occupied" | "maintenance";
}

export function TenantInviteDialog({ open, onOpenChange, onInviteSent }: TenantInviteDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loadingUnits, setLoadingUnits] = useState(false);
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setEmail("");
      setSelectedPropertyId("");
      setSelectedUnitId("");
      setInviteCode("");
    }
  }, [open]);
  
  // Load available units when property is selected
  useEffect(() => {
    if (selectedPropertyId) {
      setLoadingUnits(true);
      // Mock API call to get available units
      setTimeout(() => {
        // In a real app, this would be an API call to fetch units by property ID
        const mockUnits: Unit[] = [
          { id: "unit1", unitNumber: "A101", rent: 25000, size: "1 bedroom", status: "available" },
          { id: "unit2", unitNumber: "A102", rent: 28000, size: "2 bedroom", status: "available" },
          { id: "unit3", unitNumber: "B201", rent: 32000, size: "2 bedroom deluxe", status: "available" },
        ];
        setAvailableUnits(mockUnits);
        setLoadingUnits(false);
      }, 500);
    }
  }, [selectedPropertyId]);

  const generateInviteCode = () => {
    // In a real app, this would make an API call to generate a secure code
    // that would be stored in the database linked to the property and unit
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setInviteCode(randomCode);
    setStep(3);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Copied!",
      description: "Invitation code copied to clipboard"
    });
  };

  const handleSendInvite = () => {
    // In a real app, this would send an email with the invite code
    toast({
      title: "Sending invitation...",
      description: "Please wait while we send the invitation"
    });
    
    // Mock API call to send the invitation
    setTimeout(() => {
      onInviteSent(email, selectedPropertyId, selectedUnitId);
    }, 1000);
  };

  const getSelectedUnitDetails = () => {
    return availableUnits.find(unit => unit.id === selectedUnitId);
  };

  const renderStep1 = () => (
    <>
      <DialogHeader>
        <DialogTitle>Invite New Tenant</DialogTitle>
        <DialogDescription>
          Send an invitation code to a new tenant. They'll use this code when registering to be linked to the correct property and unit.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="email">Tenant Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tenant@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="property">Select Property</Label>
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {mockProperties.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button 
          onClick={() => setStep(2)}
          disabled={!email || !selectedPropertyId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
        >
          Next
        </Button>
      </DialogFooter>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <DialogHeader>
        <DialogTitle>Select Unit</DialogTitle>
        <DialogDescription>
          Choose the unit this tenant will occupy. The unit's rent and details will be associated with their account.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="unit">Select Unit</Label>
          {loadingUnits ? (
            <div className="text-center py-2">Loading available units...</div>
          ) : (
            <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map(unit => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.unitNumber} - {unit.size} (KES {unit.rent.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {selectedUnitId && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Unit Details</h4>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Unit:</span> {getSelectedUnitDetails()?.unitNumber}</p>
              <p><span className="font-medium">Size:</span> {getSelectedUnitDetails()?.size}</p>
              <p><span className="font-medium">Monthly Rent:</span> KES {getSelectedUnitDetails()?.rent.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
        <Button 
          onClick={generateInviteCode}
          disabled={!selectedUnitId}
        >
          Generate Invitation Code
        </Button>
      </DialogFooter>
    </>
  );
  
  const renderStep3 = () => (
    <>
      <DialogHeader>
        <DialogTitle>Send Invitation</DialogTitle>
        <DialogDescription>
          An invitation code has been generated for {email}. They will need this code to complete their registration.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-xs text-gray-500 mb-1">Invitation Code</div>
          <div className="font-mono text-2xl tracking-wider font-bold mb-2">{inviteCode}</div>
          <Button variant="outline" size="sm" onClick={copyInviteCode}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Code
          </Button>
        </div>
        
        <div className="bg-primary/5 p-4 rounded-md">
          <h4 className="font-medium mb-2">Unit Assignment</h4>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Property:</span> {mockProperties.find(p => p.id === selectedPropertyId)?.name}</p>
            <p><span className="font-medium">Unit:</span> {getSelectedUnitDetails()?.unitNumber}</p>
            <p><span className="font-medium">Monthly Rent:</span> KES {getSelectedUnitDetails()?.rent.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
        <Button onClick={handleSendInvite}>
          <Mail className="mr-2 h-4 w-4" />
          Send Invitation
        </Button>
      </DialogFooter>
    </>
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
}
