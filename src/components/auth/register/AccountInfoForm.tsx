
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface AccountInfoFormProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  role: "tenant" | "landlord";
  onRoleChange: (role: "tenant" | "landlord") => void;
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

const AccountInfoForm = ({
  formData,
  role,
  onRoleChange,
  onFormDataChange,
  onNext,
}: AccountInfoFormProps) => {
  const { toast } = useToast();

  const handleNext = () => {
    // Validate account info
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">I am a:</Label>
        <RadioGroup
          defaultValue={role}
          onValueChange={(value) => onRoleChange(value as "tenant" | "landlord")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tenant" id="tenant" />
            <Label htmlFor="tenant">Tenant</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="landlord" id="landlord" />
            <Label htmlFor="landlord">Landlord</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={onFormDataChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={onFormDataChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={onFormDataChange}
          required
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default AccountInfoForm;
