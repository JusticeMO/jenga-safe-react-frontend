
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const TenantInvitation = () => {
  const { inviteCode } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock property data - in a real app, this would be fetched based on the invite code
  const [propertyData, setPropertyData] = useState({
    propertyName: "Riverside Villas",
    unitNumber: "A102",
    rentAmount: 28000,
    isValid: true  // This would be determined by API validation
  });
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
  });
  
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'front') {
        setIdCardFront(e.target.files[0]);
      } else {
        setIdCardBack(e.target.files[0]);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, this would send the data to your backend
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
      });
      
      navigate("/login");
      setIsSubmitting(false);
    }, 2000);
  };
  
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  // If the invite code is invalid
  if (!propertyData.isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>This invitation code is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/login">Return to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#1A1F2C] py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="text-[#9b87f5]">Jenga</span>{" "}
            <span className="text-[#33C3F0]">Safe</span>
          </Link>
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Accept Tenant Invitation</CardTitle>
            <CardDescription>
              You've been invited to join {propertyData.propertyName}, Unit {propertyData.unitNumber}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
              <h3 className="font-medium text-blue-800">Property Details:</h3>
              <p className="text-sm text-blue-700">Property: {propertyData.propertyName}</p>
              <p className="text-sm text-blue-700">Unit: {propertyData.unitNumber}</p>
              <p className="text-sm text-blue-700">Monthly Rent: KES {propertyData.rentAmount.toLocaleString()}</p>
            </div>
            
            <Tabs value={`step-${currentStep}`} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="step-0" disabled={currentStep !== 0}>Personal Details</TabsTrigger>
                <TabsTrigger value="step-1" disabled={currentStep !== 1}>Identity Verification</TabsTrigger>
                <TabsTrigger value="step-2" disabled={currentStep !== 2}>Set Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="step-0" className="mt-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      placeholder="+254 XXX XXX XXX"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">National ID Number</Label>
                    <Input 
                      id="idNumber" 
                      name="idNumber" 
                      placeholder="Enter your ID number"
                      value={formData.idNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full mt-4 bg-[#9b87f5] hover:bg-[#7E69AB]"
                    onClick={nextStep}
                  >
                    Continue
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="step-1" className="mt-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="idFront">National ID (Front)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {idCardFront ? (
                        <div className="space-y-2">
                          <p className="text-green-600">✓ {idCardFront.name} uploaded</p>
                          <Button 
                            variant="outline"
                            onClick={() => setIdCardFront(null)}
                            size="sm"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <label htmlFor="idFront" className="cursor-pointer">
                            <div className="py-4 flex flex-col items-center space-y-2">
                              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                            </div>
                          </label>
                          <Input 
                            id="idFront" 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={e => handleFileChange(e, 'front')}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idBack">National ID (Back)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {idCardBack ? (
                        <div className="space-y-2">
                          <p className="text-green-600">✓ {idCardBack.name} uploaded</p>
                          <Button 
                            variant="outline"
                            onClick={() => setIdCardBack(null)}
                            size="sm"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <label htmlFor="idBack" className="cursor-pointer">
                            <div className="py-4 flex flex-col items-center space-y-2">
                              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                            </div>
                          </label>
                          <Input 
                            id="idBack" 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={e => handleFileChange(e, 'back')}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                      onClick={nextStep}
                      disabled={!idCardFront || !idCardBack}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="step-2" className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>By completing registration, you agree to our Terms of Service and Privacy Policy.</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Complete Registration"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantInvitation;
