
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import AccountInfoForm from "./register/AccountInfoForm";
import PersonalInfoForm from "./register/PersonalInfoForm";
import TenantHousingForm from "./register/TenantHousingForm";
import LandlordFinalForm from "./register/LandlordFinalForm";
import RegisterFooter from "./register/RegisterFooter";

const RegisterForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(0);
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [housingStatus, setHousingStatus] = useState<"looking" | "moving_in" | "invited">("looking");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    propertyId: "",
    unitNumber: "",
    inviteCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setFormStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setFormStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: role,
      });

      if (response.success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please log in.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during registration.";
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the card description based on the current form step and role
  const getCardDescription = () => {
    if (formStep === 0) return "Create your account";
    if (formStep === 1) return "Personal information";
    return role === "tenant" ? "Housing status" : "Property owner details";
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register {role === "tenant" ? "as Tenant" : "as Landlord"}</CardTitle>
        <CardDescription>{getCardDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {formStep === 0 && (
            <AccountInfoForm
              formData={formData}
              role={role}
              onRoleChange={setRole}
              onFormDataChange={handleChange}
              onNext={handleNext}
              isLoading={isLoading}
            />
          )}

          {formStep === 1 && (
            <PersonalInfoForm
              formData={formData}
              onFormDataChange={handleChange}
              onBack={handleBack}
              onNext={handleNext}
              isLoading={isLoading}
            />
          )}

          {formStep === 2 && role === "tenant" && (
            <TenantHousingForm
              housingStatus={housingStatus}
              formData={formData}
              onHousingStatusChange={setHousingStatus}
              onFormDataChange={handleChange}
              onPropertyChange={(value) => setFormData((prev) => ({ ...prev, propertyId: value }))}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}

          {formStep === 2 && role === "landlord" && (
            <LandlordFinalForm
              onBack={handleBack}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <RegisterFooter />
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
