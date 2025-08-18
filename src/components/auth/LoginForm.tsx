
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { LoginHeader } from "./login/LoginHeader";
import { CredentialsForm } from "./login/CredentialsForm";
import { OTPVerificationForm } from "./login/OTPVerificationForm";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const { login, requestOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await requestOTP(email, password, role);
      
      if (success) {
        setShowOTP(true);
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code",
        });
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, otp, role);
      
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
          title: "Verification Failed",
          description: "Invalid verification code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An error occurred during verification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <LoginHeader message="Sign in with your credentials below to access your tenant portal or property management dashboard." />

      {!showOTP ? (
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
      ) : (
        <OTPVerificationForm
          otp={otp}
          setOtp={setOtp}
          isLoading={isLoading}
          onSubmit={handleVerifyOTP}
          onBack={() => setShowOTP(false)}
        />
      )}
    </div>
  );
}
