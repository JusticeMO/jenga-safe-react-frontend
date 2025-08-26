import { useState, useEffect } from "react";
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
import { apiClient } from "@/lib/api";
import { MaintenanceRequest } from "@/types";

export function MaintenanceRequestView() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    priority: "Medium"
  });

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getMaintenanceRequests();
        if (response.success) {
          setRequests(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch maintenance requests",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch maintenance requests";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePriorityChange = (value: "Low" | "Medium" | "High") => {
    setNewRequest(prev => ({
      ...prev,
      priority: value
    }));
  };
  
  const handleSubmitRequest = async () => {
    if (!newRequest.title || !newRequest.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await apiClient.createMaintenanceRequest(newRequest);
      if (response.success) {
        setRequests(prev => [{ ...response.data, status: (response.data as any).status ?? 'Queued' } as any, ...prev]);
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
      } else {
        toast({
          title: "Error",
          description: "Failed to submit maintenance request",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit maintenance request";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };
  
  /**
   * Canonicalise various backend / legacy status strings to the new
   * vocabulary expected by the UI.
   */
  const normaliseStatus = (status: string): "Queued" | "In Progress" | "Resolved" => {
    const s = status.toLowerCase();
    if (["queued", "pending"].includes(s)) return "Queued";
    if (["in progress", "in-progress"].includes(s)) return "In Progress";
    return "Resolved"; // covers completed / resolved / done
  };

  const getStatusIcon = (rawStatus: MaintenanceRequest['status']) => {
    const status = normaliseStatus(String(rawStatus));
    switch (status) {
      case "Queued":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "In Progress":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                  normaliseStatus(request.status) === 'Resolved'
                    ? 'bg-green-100 text-green-800'
                    : normaliseStatus(request.status) === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1">{normaliseStatus(request.status)}</span>
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
