import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Upload, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Complaint } from "@/types";

const complaintGuidelines = [
  "Provide clear and specific details about the issue",
  "Upload photos or videos as evidence when possible",
  "Use appropriate urgency levels to ensure proper response times",
  "For emergencies like gas leaks or flooding, call the emergency hotline"
];

export function FileComplaint() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    complaintType: "",
    subject: "",
    description: "",
    urgencyLevel: "",
    contactMethod: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const fetchRecentComplaints = async () => {
      // In a real app, you would fetch recent complaints from the API
      // For now, we'll just use an empty array
      setRecentComplaints([]);
    };
    fetchRecentComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.complaintType || !formData.subject || !formData.description || !formData.urgencyLevel || !formData.contactMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.fileComplaint(formData);
      if (response.success) {
        toast({
          title: "Complaint Submitted",
          description: "Your complaint has been received and will be reviewed within 48 hours",
        });
        setRecentComplaints(prev => [response.data, ...prev]);
        // Reset form
        setFormData({
          complaintType: "",
          subject: "",
          description: "",
          urgencyLevel: "",
          contactMethod: ""
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit complaint",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit complaint";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">File a Complaint</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Complaint Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="complaintType">Complaint Type *</Label>
                  <Select value={formData.complaintType} onValueChange={(value) => handleInputChange("complaintType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complaint type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance Issue</SelectItem>
                      <SelectItem value="noise">Noise Complaint</SelectItem>
                      <SelectItem value="utilities">Utilities Problem</SelectItem>
                      <SelectItem value="security">Security Concern</SelectItem>
                      <SelectItem value="property-damage">Property Damage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of the issue"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your complaint..."
                    className="min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Evidence (optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click or drag files to upload</p>
                    <p className="text-xs text-gray-500">Supports: JPG, PNG and PDF up to 5MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                  <Select value={formData.urgencyLevel} onValueChange={(value) => handleInputChange("urgencyLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Not urgent</SelectItem>
                      <SelectItem value="medium">Medium - Within a week</SelectItem>
                      <SelectItem value="high">High - Within 24 hours</SelectItem>
                      <SelectItem value="emergency">Emergency - Immediate attention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactMethod">Preferred Contact Method *</Label>
                  <Select value={formData.contactMethod} onValueChange={(value) => handleInputChange("contactMethod", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How should we contact you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="app">In-App Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#ea384c] hover:bg-[#d32f41] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Complaints */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Complaints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-md p-3">
                  <h4 className="font-medium text-sm">{complaint.subject}</h4>
                  <p className="text-xs text-gray-500 mb-2">Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                  <Badge>
                    {complaint.status}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                View All Complaints
              </Button>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Complaint Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {complaintGuidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{guideline}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Emergency Hotline</span>
                </div>
                <p className="text-sm text-red-600 mt-1">+254 700 123 456</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
