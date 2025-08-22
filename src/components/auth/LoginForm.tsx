import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { toast } from "@/components/ui/toast";
import { LoginHeader } from "./login/LoginHeader";
import { CredentialsForm } from "./login/CredentialsForm";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, role);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in",
        });
        
        if (role === "tenant") {
          navigate("/tenant/dashboard");
        } else {
          navigate("/landlord/dashboard");
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <LoginHeader message="Sign in with your credentials below to access your tenant portal or property management dashboard." />

      <CredentialsForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        role={role}
        setRole={setRole}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
