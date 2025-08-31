import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { toast } from "@/components/ui/toast";
import { LoginHeader } from "./login/LoginHeader";
import { CredentialsForm } from "./login/CredentialsForm";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Infer role from the input for back-ends that still expect it
      const inferRole = (input: string): "tenant" | "landlord" | undefined => {
        const lower = input.toLowerCase();
        if (lower.includes("landlord")) return "landlord";
        if (lower.includes("tenant") || lower.startsWith("07")) return "tenant";
        return undefined; // let the API infer if we can’t
      };

      const role = inferRole(email);
      const loggedInUser = await login(email, password, role as any);

      if (loggedInUser) {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in",
        });

        // Redirect based on the role from the successful login response
        if (loggedInUser.role === "landlord") {
          navigate("/landlord/dashboard");
        } else {
          navigate("/tenant/dashboard");
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
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
