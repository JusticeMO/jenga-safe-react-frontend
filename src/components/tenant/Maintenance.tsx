
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MaintenanceRequestView() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState([
    {
      id: "req1",
      title: "Bathroom Sink Leaking",
      description: "Water is leaking under the bathroom sink cabinet",
      priority: "Medium",
      status: "In Progress",
      createdAt: "2025-04-22T10:30:00",
      updatedAt: "2025-04-22T14:20:00",
    },
    {
      id: "req2",
      title: "Living Room Window Won't Close",
      description: "The window in the living room doesn't close properly and lets in a draft",
      priority: "Low",
      status: "Pending",
      createdAt: "2025-04-19T08:15:00",
      updatedAt: "2025-04-19T08:15:00",
    },
    {
      id: "req3",
      title: "Kitchen Light Fixture Broken",
      description: "The main light in the kitchen is not working. I've tried changing the bulbs.",
      priority: "Medium",
      status: "Completed",
      createdAt: "2025-04-15T13:45:00",
      updatedAt: "2025-04-17T11:30:00",
    }
  ]);
  
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    priority: "Medium"
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePriorityChange = (value) => {
    setNewRequest(prev => ({
      ...prev,
      priority: value
    }));
  };
  
  const handleSubmitRequest = () => {
    if (!newRequest.title || !newRequest.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date().toISOString();
    const newMaintenanceRequest = {
      id: `req${requests.length + 1}`,
      ...newRequest,
      status: "Pending",
      createdAt: now,
      updatedAt: now
    };
    
    setRequests(prev => [newMaintenanceRequest, ...prev]);
    setNewRequest({
      title: "",
      description: "",
      priority: "Medium"
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Request Submitted",
      description: "Your maintenance request has been submitted successfully",
    });
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "In Progress":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Maintenance Request</DialogTitle>
              <DialogDescription>
                Please provide details about the issue that needs to be fixed.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newRequest.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Kitchen Sink Leaking"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newRequest.description}
                  onChange={handleInputChange}
                  placeholder="Please provide detailed information about the issue..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  defaultValue={newRequest.priority}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitRequest}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{request.title}</CardTitle>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : request.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1">{request.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">{request.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(request.createdAt)}
                </div>
                <div className={`px-2 py-1 rounded-full ${
                  request.priority === 'High'
                    ? 'bg-red-50 text-red-700' 
                    : request.priority === 'Medium'
                      ? 'bg-orange-50 text-orange-700'
                      : 'bg-blue-50 text-blue-700'
                }`}>
                  {request.priority}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No maintenance requests yet.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsDialogOpen(true)}
          >
            Submit your first request
          </Button>
        </div>
      )}
    </div>
  );
}
