
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Search, Home, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const RegistrationPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState<string>("tenant");
  const [housingStatus, setHousingStatus] = useState<string | null>(null);
  
  // Extract user type and housing status from location state if available
  useEffect(() => {
    if (location.state) {
      if (location.state.role) {
        setUserType(location.state.role);
      }
      if (location.state.housingStatus) {
        setHousingStatus(location.state.housingStatus);
      }
    }
  }, [location.state]);

  const handleNextSteps = (destination: string) => {
    navigate(destination);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1A1F2C] py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <div 
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-[#9b87f5]">Jenga</span>{" "}
            <span className="text-[#33C3F0]">Safe</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-[#9b87f5]" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-3 text-[#1A1F2C]">Registration Successful</h1>
          <p className="text-gray-600 mb-6">
            Welcome to JengaSafe! Your account has been created and you've been sent a verification email.
            Please verify your email to access all features.
          </p>
          
          <div className="bg-[#f0f4f8] rounded-lg p-5 mb-6">
            <h2 className="font-medium mb-3 text-[#1A1F2C]">Next Steps:</h2>
            <ol className="text-left text-sm space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9b87f5]/20 text-[#9b87f5] flex items-center justify-center mr-2 font-medium">1</span>
                <span>Check your email for a verification link</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9b87f5]/20 text-[#9b87f5] flex items-center justify-center mr-2 font-medium">2</span>
                <span>Click the link to verify your email address</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9b87f5]/20 text-[#9b87f5] flex items-center justify-center mr-2 font-medium">3</span>
                <span>Login with your credentials and complete two-factor authentication</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9b87f5]/20 text-[#9b87f5] flex items-center justify-center mr-2 font-medium">4</span>
                <span>Start exploring properties or managing your units</span>
              </li>
            </ol>
          </div>
          
          {/* Personalized guidance based on user type */}
          {userType === "tenant" && (
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-[#1A1F2C]">What would you like to do next?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {(housingStatus === "looking" || !housingStatus) && (
                  <Button 
                    onClick={() => handleNextSteps("/tenant/explore")}
                    variant="outline"
                    className="flex flex-col h-auto py-4 gap-2 border-[#9b87f5]/30 hover:border-[#9b87f5] hover:bg-[#9b87f5]/5"
                  >
                    <Search className="h-6 w-6 text-[#9b87f5]" />
                    <span className="font-medium">Explore Available Properties</span>
                  </Button>
                )}
                
                {(housingStatus === "moving_in" || !housingStatus) && (
                  <Button 
                    onClick={() => handleNextSteps("/login")}
                    variant="outline"
                    className="flex flex-col h-auto py-4 gap-2 border-[#9b87f5]/30 hover:border-[#9b87f5] hover:bg-[#9b87f5]/5"
                  >
                    <Home className="h-6 w-6 text-[#9b87f5]" />
                    <span className="font-medium">Manage My Rental</span>
                  </Button>
                )}
                
                {(housingStatus === "invited" || !housingStatus) && (
                  <Button 
                    onClick={() => handleNextSteps("/login")}
                    variant="outline"
                    className="flex flex-col h-auto py-4 gap-2 border-[#9b87f5]/30 hover:border-[#9b87f5] hover:bg-[#9b87f5]/5"
                  >
                    <Mail className="h-6 w-6 text-[#9b87f5]" />
                    <span className="font-medium">Check My Invitation</span>
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Landlord guidance */}
          {userType === "landlord" && (
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-[#1A1F2C]">Ready to manage your properties?</h3>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <Button 
                  onClick={() => handleNextSteps("/login")}
                  variant="outline"
                  className="flex flex-col h-auto py-4 gap-2 border-[#9b87f5]/30 hover:border-[#9b87f5] hover:bg-[#9b87f5]/5"
                >
                  <Home className="h-6 w-6 text-[#9b87f5]" />
                  <span className="font-medium">Access My Landlord Dashboard</span>
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            onClick={() => navigate("/login")}
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            Proceed to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPending;
