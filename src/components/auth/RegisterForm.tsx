
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would submit the form data to your API
    toast({
      title: "Registration Successful",
      description: "Your account has been created. You will receive a verification email shortly.",
    });
    
    // Navigate to confirmation page with user data
    setTimeout(() => {
      navigate("/registration-pending", { 
        state: { 
          role, 
          housingStatus: role === "tenant" ? housingStatus : null 
        } 
      });
    }, 2000);
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
            />
          )}

          {formStep === 1 && (
            <PersonalInfoForm 
              formData={formData} 
              onFormDataChange={handleChange} 
              onBack={handleBack} 
              onNext={handleNext}
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
            />
          )}

          {formStep === 2 && role === "landlord" && (
            <LandlordFinalForm 
              onBack={handleBack} 
              onSubmit={handleSubmit}
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
