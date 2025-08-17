
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "tenant") {
        navigate("/tenant/dashboard");
      } else {
        navigate("/landlord/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-[#1A1F2C] py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="text-[#9b87f5]">Jenga</span>{" "}
            <span className="text-[#33C3F0]">Safe</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1A1F2C]">Login to Your Account</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to access the platform</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <LoginForm />

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Don't have an account? <Link to="/register" className="text-[#9b87f5] hover:underline">Register here</Link></p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600 bg-[#f0f4f8] p-4 rounded-md border border-gray-200">
            <p className="font-medium mb-2">Demo accounts:</p>
            <p>Tenant: tenant@example.com / password</p>
            <p>Landlord: landlord@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
