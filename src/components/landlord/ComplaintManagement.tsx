
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  User,
  Calendar,
  Filter
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Mock complaints data
const mockComplaints = [
  {
    id: "1",
    type: "Noise Complaint",
    title: "Loud music from neighboring unit",
    description: "Tenant in Unit 4C has been playing loud music every night past 11 PM. This has been going on for a week now.",
    priority: "medium",
    status: "pending",
    tenantName: "John Doe",
    unitName: "Apartment 3B", 
    category: "Noise",
    submittedAt: "2024-06-05 22:30",
    lastUpdated: "2024-06-05 22:30",
    responses: []
  },
  {
    id: "2",
    type: "Maintenance Issue",
    title: "Broken elevator in Block A",
    description: "The elevator has been out of order for 3 days. This is causing major inconvenience for elderly residents.",
    priority: "high",
    status: "in-progress", 
    tenantName: "Sarah Johnson",
    unitName: "House 7",
    category: "Building Maintenance",
    submittedAt: "2024-06-03 09:15",
    lastUpdated: "2024-06-04 14:20",
    responses: [
      {
        id: "1",
        author: "Property Manager",
        message: "We have contacted the elevator service company. Technician will arrive tomorrow morning.",
        timestamp: "2024-06-04 14:20"
      }
    ]
  },
  {
    id: "3",
    type: "Security Concern",
    title: "Broken gate lock at main entrance",
    description: "The electronic lock on the main gate is not working properly, allowing unauthorized access.",
    priority: "high",
    status: "resolved",
    tenantName: "Michael Smith",
    unitName: "Unit 2A",
    category: "Security",
    submittedAt: "2024-06-01 16:45",
    lastUpdated: "2024-06-02 10:30",
    responses: [
      {
        id: "1",
        author: "Property Manager",
        message: "Lock has been repaired and tested. Security has been enhanced with additional measures.",
        timestamp: "2024-06-02 10:30"
      }
    ]
  }
];

export function ComplaintManagement() {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const handleUpdateStatus = (complaintId: string, newStatus: string) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId ? {
        ...complaint,
        status: newStatus,
        lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
      } : complaint
    ));

    toast({
      title: "Status Updated",
      description: `Complaint status updated to ${newStatus}`
    });
  };

  const handleAddResponse = () => {
    if (!responseText.trim() || !selectedComplaint) {
      toast({
        title: "Empty Response",
        description: "Please enter a response message",
        variant: "destructive"
      });
      return;
    }

    const newResponse = {
      id: Date.now().toString(),
      author: "Property Manager",
      message: responseText.trim(),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setComplaints(prev => prev.map(complaint => 
      complaint.id === selectedComplaint.id ? {
        ...complaint,
        responses: [...complaint.responses, newResponse],
        lastUpdated: newResponse.timestamp
      } : complaint
    ));

    setResponseText("");
    setSelectedComplaint(prev => ({
      ...prev,
      responses: [...prev.responses, newResponse]
    }));

    toast({
      title: "Response Added",
      description: "Your response has been added to the complaint"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "default";
      case "in-progress": return "secondary";
      case "pending": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return CheckCircle;
      case "in-progress": return Clock;
      case "pending": return AlertTriangle;
      default: return Clock;
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = filterStatus === "all" || complaint.status === filterStatus;
    const priorityMatch = filterPriority === "all" || complaint.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const statsData = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    high: complaints.filter(c => c.priority === "high").length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Complaint Management</h1>
        <div className="flex space-x-2">
          <select 
            className="p-2 border rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select 
            className="p-2 border rounded-md"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="complaints">All Complaints</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-secondary-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.inProgress}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.resolved}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.high}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Complaints</h3>
            {filteredComplaints.slice(0, 3).map((complaint) => {
              const StatusIcon = getStatusIcon(complaint.status);
              return (
                <Card key={complaint.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedComplaint(complaint)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <StatusIcon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{complaint.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {complaint.tenantName} - {complaint.unitName}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={getPriorityColor(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                        <Badge variant={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Complaints List</h3>
              {filteredComplaints.map((complaint) => {
                const StatusIcon = getStatusIcon(complaint.status);
                return (
                  <Card 
                    key={complaint.id} 
                    className={`cursor-pointer hover:bg-gray-50 ${selectedComplaint?.id === complaint.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <span className="font-medium">{complaint.title}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Badge variant={getPriorityColor(complaint.priority)} className="text-xs">
                            {complaint.priority}
                          </Badge>
                          <Badge variant={getStatusColor(complaint.status)} className="text-xs">
                            {complaint.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {complaint.tenantName} - {complaint.unitName}
                      </p>
                      <p className="text-sm">{complaint.description.substring(0, 100)}...</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {complaint.submittedAt}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedComplaint && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedComplaint.title}</CardTitle>
                      <div className="flex space-x-2">
                        <Badge variant={getPriorityColor(selectedComplaint.priority)}>
                          {selectedComplaint.priority}
                        </Badge>
                        <Badge variant={getStatusColor(selectedComplaint.status)}>
                          {selectedComplaint.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted by:</p>
                      <p className="font-medium">{selectedComplaint.tenantName} - {selectedComplaint.unitName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category:</p>
                      <p>{selectedComplaint.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description:</p>
                      <p>{selectedComplaint.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted:</p>
                      <p>{selectedComplaint.submittedAt}</p>
                    </div>

                    {selectedComplaint.status !== "resolved" && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(selectedComplaint.id, "in-progress")}
                          disabled={selectedComplaint.status === "in-progress"}
                        >
                          Mark In Progress
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateStatus(selectedComplaint.id, "resolved")}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Responses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedComplaint.responses.map((response) => (
                      <div key={response.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{response.author}</span>
                          <span className="text-xs text-muted-foreground">{response.timestamp}</span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your response..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleAddResponse} size="sm">
                        Add Response
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Noise</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Building Maintenance</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Security</span>
                    <span className="font-medium">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 hours</div>
                <p className="text-sm text-muted-foreground">Average response time this month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
