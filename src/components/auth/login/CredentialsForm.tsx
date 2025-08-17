
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CredentialsFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: "tenant" | "landlord";
  setRole: (role: "tenant" | "landlord") => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function CredentialsForm({
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  isLoading,
  onSubmit
}: CredentialsFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid w-full items-center gap-4">
        <div className="space-y-1">
          <Label htmlFor="role">I am a:</Label>
          <RadioGroup
            defaultValue={role}
            onValueChange={(value) => setRole(value as "tenant" | "landlord")}
            className="flex space-x-4 mt-2"
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
        
        <div className="space-y-1">
          <Label htmlFor="email">Email/Phone Number</Label>
          <Input
            id="email"
            placeholder="you@example.com/phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            For demo: {role === "tenant" ? "tenant" : "landlord"}@example.com or 07123456789
          </p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            For demo: use "password" or "07123456789"
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300" />
          <Label htmlFor="remember" className="text-sm">Remember me</Label>
          <a href="#" className="ml-auto text-sm text-[#9b87f5] hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-6 bg-[#9b87f5] hover:bg-[#7E69AB]" 
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Continue"}
      </Button>
    </form>
  );
}
