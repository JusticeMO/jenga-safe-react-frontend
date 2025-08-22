
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface TenantHousingFormProps {
  housingStatus: "looking" | "moving_in" | "invited";
  formData: {
    propertyId: string;
    unitNumber: string;
    inviteCode: string;
  };
  isLoading: boolean;
  onHousingStatusChange: (value: "looking" | "moving_in" | "invited") => void;
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPropertyChange: (value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TenantHousingForm = ({
  housingStatus,
  formData,
  onHousingStatusChange,
  onFormDataChange,
  onPropertyChange,
  onBack,
  onSubmit,
  isLoading,
}: TenantHousingFormProps) => {
  const verifyInviteCode = () => {
    // For demo purposes, we'll just check if the code is not empty
    // In a real app, this would make an API call to verify the code and retrieve property/unit info
    return formData.inviteCode.length >= 6;
  };
  
  const isValidCode = housingStatus === "invited" && formData.inviteCode ? verifyInviteCode() : false;
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="housingStatus">Your Housing Status:</Label>
        <RadioGroup
          defaultValue={housingStatus}
          onValueChange={(value) => onHousingStatusChange(value as "looking" | "moving_in" | "invited")}
          className="space-y-3 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="looking" id="looking" />
            <Label htmlFor="looking">I'm looking for a property</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moving_in" id="moving_in" />
            <Label htmlFor="moving_in">I'm moving into a specific unit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="invited" id="invited" />
            <Label htmlFor="invited">I've been invited by a landlord</Label>
          </div>
        </RadioGroup>
      </div>

      {housingStatus === "moving_in" && (
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="propertyId">Property</Label>
            <Select
              value={formData.propertyId}
              onValueChange={onPropertyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prop1">Sunshine Apartments</SelectItem>
                <SelectItem value="prop2">Riverside Villas</SelectItem>
                <SelectItem value="prop3">Mountain View Residences</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitNumber">Unit Number</Label>
            <Input
              id="unitNumber"
              name="unitNumber"
              value={formData.unitNumber}
              onChange={onFormDataChange}
              placeholder="e.g. A1, 101"
            />
          </div>
        </div>
      )}

      {housingStatus === "invited" && (
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invitation Code</Label>
            <Input
              id="inviteCode"
              name="inviteCode"
              value={formData.inviteCode}
              onChange={onFormDataChange}
              placeholder="Enter the code provided by your landlord"
              className="font-mono tracking-wider text-center uppercase"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter the invitation code sent to you by your landlord
            </p>
          </div>
          
          {isValidCode && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-sm space-y-1">
                <p className="font-medium text-green-700">Invitation code verified!</p>
                <p className="text-gray-700">You will be connected to:</p>
                <p><span className="font-medium">Property:</span> Riverside Villas</p>
                <p><span className="font-medium">Unit:</span> A102</p>
                <p><span className="font-medium">Monthly Rent:</span> KES 28,000</p>
              </div>
            </Card>
          )}
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>After registration, you will receive a verification email with login instructions.</p>
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          onClick={onSubmit}
          disabled={(housingStatus === "invited" && !isValidCode) || isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </div>
    </div>
  );
};

export default TenantHousingForm;
