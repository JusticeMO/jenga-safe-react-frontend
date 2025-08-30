import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/useAuth";
import AccountInfoForm from "./register/AccountInfoForm";
import PersonalInfoForm from "./register/PersonalInfoForm";
import TenantHousingForm from "./register/TenantHousingForm";
import LandlordFinalForm from "./register/LandlordFinalForm";
import RegisterFooter from "./register/RegisterFooter";

const RegisterForm = () => {
  const { toast } = useToast();
  // React Router navigation helper – allows us to redirect after successful registration
  const navigate = useNavigate();
  const { register } = useAuth();
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

  console.log("RegisterForm state:", { formStep, role, housingStatus, isLoading, formData });

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
    console.log("Submitting registration form...");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: role,
      };
      console.log("Calling context register with:", registrationData);
      const registeredUser = await register(registrationData);

      if (registeredUser) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created and you have been logged in.",
        });
        /* ------------------------------------------------------------------
         * Post-registration routing
         * ------------------------------------------------------------------
         * • Landlord → /landlord/dashboard
         * • Tenant:
         *     • looking      → /tenant/explore
         *     • invited       → /invitation/{CODE}  (if code present)
         *     • moving_in     → flag property in localStorage then /tenant/dashboard
         *     • fallback      → /tenant/dashboard
         * ------------------------------------------------------------------ */
        if (registeredUser.role === "landlord") {
          navigate("/landlord/dashboard");
        } else {
          // tenant
          if (housingStatus === "looking") {
            navigate("/tenant/explore");
          } else if (housingStatus === "invited" && formData.inviteCode.trim()) {
            const code = formData.inviteCode.trim().toUpperCase();
            navigate(`/invitation/${code}`);
          } else if (housingStatus === "moving_in") {
            /* Pre-fill basic property context so the dashboard shows correct state */
            const propertyNameLookup: Record<string, string> = {
              prop1: "Sunshine Apartments",
              prop2: "Riverside Villas",
              prop3: "Mountain View Residences",
            };

            const propertyName = propertyNameLookup[formData.propertyId] || "My Property";
            const details = {
              propertyName,
              propertyId: formData.propertyId,
              unitNumber: formData.unitNumber,
              rentAmount: 0,
              depositAmount: 0,
              nextDueDate: new Date().toISOString(),
              firstPaymentDue: true,
            };
            localStorage.setItem("tenantHasProperty", "true");
            localStorage.setItem("propertyDetails", JSON.stringify(details));

            navigate("/tenant/dashboard");
          } else {
            // default fallback
            navigate("/tenant/dashboard");
          }
        }
      } else {
        toast({
          title: "Registration Failed",
          description: "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during registration.";
      console.error("Error during registration:", error);
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
