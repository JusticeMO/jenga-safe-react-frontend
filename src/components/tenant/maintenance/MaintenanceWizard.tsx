
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Camera, Check, ChevronRight, Clock, Home, Send } from "lucide-react";

type MaintenanceCategory = "plumbing" | "electrical" | "appliance" | "structural" | "general" | "other";

interface MaintenanceIssue {
  category: MaintenanceCategory;
  title: string;
  description: string;
  urgency: "low" | "medium" | "high";
  preferredDate?: string;
  preferredTime?: string;
  photos: FileList | null;
}

export function MaintenanceWizard() {
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [issue, setIssue] = useState<MaintenanceIssue>({
    category: "general",
    title: "",
    description: "",
    urgency: "medium",
    photos: null,
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    const canProceed = validateStep();
    if (canProceed) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!issue.category) {
          toast({
            title: "Required field",
            description: "Please select a maintenance category",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!issue.title) {
          toast({
            title: "Required field",
            description: "Please enter a title for your request",
            variant: "destructive",
          });
          return false;
        }
        if (!issue.description || issue.description.length < 10) {
          toast({
            title: "Required field",
            description: "Please provide more details about your issue",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: MaintenanceCategory) => {
    setIssue((prev) => ({ ...prev, category: value }));
  };

  const handleUrgencyChange = (value: "low" | "medium" | "high") => {
    setIssue((prev) => ({ ...prev, urgency: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIssue((prev) => ({ ...prev, photos: e.target.files }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // In a real app, you would send the data to an API
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Request submitted",
        description: "Your maintenance request has been sent to your landlord",
      });
      
      // Reset form and go to success step
      setStep(4);
    }, 1500);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  s === step
                    ? "border-[#9b87f5] bg-[#9b87f5] text-white"
                    : s < step
                    ? "border-[#9b87f5] bg-white text-[#9b87f5]"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 ${
                    s < step ? "bg-[#9b87f5]" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>What type of issue are you experiencing?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={issue.category}
                onValueChange={(value) => handleCategoryChange(value as MaintenanceCategory)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value="plumbing" id="plumbing" />
                  <Label htmlFor="plumbing" className="flex-1 cursor-pointer">
                    <div className="font-medium">Plumbing Issue</div>
                    <div className="text-sm text-gray-500">Leaks, clogs, water pressure, etc.</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value="electrical" id="electrical" />
                  <Label htmlFor="electrical" className="flex-1 cursor-pointer">
                    <div className="font-medium">Electrical Problem</div>
                    <div className="text-sm text-gray-500">
                      Outlets, lights, circuit breakers, etc.
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value="appliance" id="appliance" />
                  <Label htmlFor="appliance" className="flex-1 cursor-pointer">
                    <div className="font-medium">Appliance Issue</div>
                    <div className="text-sm text-gray-500">
                      Refrigerator, stove, dishwasher, etc.
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value="structural" id="structural" />
                  <Label htmlFor="structural" className="flex-1 cursor-pointer">
                    <div className="font-medium">Structural Issue</div>
                    <div className="text-sm text-gray-500">
                      Walls, floors, ceiling, doors, windows, etc.
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general" className="flex-1 cursor-pointer">
                    <div className="font-medium">General Maintenance</div>
                    <div className="text-sm text-gray-500">
                      Painting, cleaning, pest control, etc.
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex-1 cursor-pointer">
                    <div className="font-medium">Other</div>
                    <div className="text-sm text-gray-500">
                      Any other maintenance issue not listed above
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Describe the issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Brief title for your request</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Bathroom sink is leaking"
                  value={issue.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please provide as much detail as possible about the issue..."
                  rows={5}
                  value={issue.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>How urgent is this issue?</Label>
                <RadioGroup
                  value={issue.urgency}
                  onValueChange={(value) =>
                    handleUrgencyChange(value as "low" | "medium" | "high")
                  }
                  className="flex space-x-4"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`p-3 rounded-full mb-2 ${
                        issue.urgency === "low"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="cursor-pointer">
                        Low
                      </Label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`p-3 rounded-full mb-2 ${
                        issue.urgency === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="cursor-pointer">
                        Medium
                      </Label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`p-3 rounded-full mb-2 ${
                        issue.urgency === "high"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="cursor-pointer">
                        High
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred date for maintenance (optional)</Label>
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={issue.preferredDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred time (optional)</Label>
                <Input
                  id="preferredTime"
                  name="preferredTime"
                  type="time"
                  value={issue.preferredTime}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photos">Photos of the issue (optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-[#9b87f5] transition-colors">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer rounded-md font-medium text-[#9b87f5] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#9b87f5] focus-within:ring-offset-2 hover:text-[#7E69AB]"
                    >
                      <span>Upload photos</span>
                      <Input
                        id="file-upload"
                        name="photos"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                      />
                    </Label>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {issue.photos && issue.photos.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {issue.photos.length} file(s) selected
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        );
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle>Maintenance Request Submitted</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">
                Your maintenance request has been submitted successfully.
              </p>
              <div className="bg-gray-50 p-4 rounded-md border text-left mb-4">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <Home className="h-5 w-5 text-[#9b87f5]" />
                  </div>
                  <div>
                    <p className="font-medium">Ticket #MNT-{Math.floor(Math.random() * 10000)}</p>
                    <p className="text-sm text-gray-600">{issue.title}</p>
                    <div className="mt-2 flex items-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          issue.urgency === "high"
                            ? "bg-red-500"
                            : issue.urgency === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                      <span className="text-sm capitalize">{issue.urgency} priority</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You'll receive updates on the status of your request via email or in the app.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset form
                  setIssue({
                    category: "general",
                    title: "",
                    description: "",
                    urgency: "medium",
                    photos: null,
                  });
                  setStep(1);
                }}
              >
                Submit Another Request
              </Button>
            </CardFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {step < 4 && renderStepIndicator()}
      <Card className="shadow-md">
        {renderStepContent()}
      </Card>
    </div>
  );
}
