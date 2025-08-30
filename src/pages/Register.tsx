
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import RegisterHeader from "@/components/auth/register/RegisterHeader";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // wait for auth check

    if (isAuthenticated) {
      if (user?.role === "landlord") {
        navigate("/landlord/dashboard", { replace: true });
      } else {
        navigate("/tenant/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, loading]);

  // If already authenticated, component will navigate away; render nothing
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <RegisterHeader />
      <RegisterForm />
    </div>
  );
};

export default Register;
