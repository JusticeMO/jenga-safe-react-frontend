import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { MaintenanceRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MaintenanceView() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    priority: "Medium"
  });

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getLandlordMaintenanceRequests();
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
        setRequests(prev => [response.data, ...prev]);
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
              New Work Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Work Order</DialogTitle>
              <DialogDescription>
                Create a new work order for a property.
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
              <Button onClick={handleSubmitRequest}>Create Work Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center">
            <Clock className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Pending</p>
              <p className="text-2xl font-bold">{requests.filter(r => r.status === 'Pending').length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50">
          <CardContent className="p-4 flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600 mr-4" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold">{requests.filter(r => r.status === 'In Progress').length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold">{requests.filter(r => r.status === 'Completed').length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Total Requests</div>
            <p className="text-2xl font-bold">{requests.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search maintenance requests..." 
              className="w-full pl-8"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Pending</Button>
          <Button variant="outline" size="sm">In Progress</Button>
          <Button variant="outline" size="sm">Completed</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map(request => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-base">{request.title}</CardTitle>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  request.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status}
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">{request.property?.name} - {request.unit?.unitNumber}</p>
                <Badge variant="outline" className={`text-xs ${
                  request.priority === 'High' 
                    ? 'border-red-300 text-red-700'
                    : request.priority === 'Medium'
                      ? 'border-orange-300 text-orange-700' 
                      : 'border-blue-300 text-blue-700'
                }`}>
                  {request.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-2">{request.description}</p>
              <p className="text-xs text-gray-500 mb-4">Reported by: {request.tenant?.name} on {new Date(request.date).toLocaleDateString()}</p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
