
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  AlertTriangle, 
  MapPin, 
  Clock,
  CheckCircle,
  User,
  Plus,
  Edit
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Mock emergency data
const mockEmergencyContacts = [
  {
    id: "1",
    service: "Fire Department",
    phone: "999",
    description: "Fire emergencies and rescue operations",
    available24h: true,
    response: "5-10 minutes"
  },
  {
    id: "2",
    service: "Police",
    phone: "999",
    description: "Security emergencies and criminal activities", 
    available24h: true,
    response: "10-15 minutes"
  },
  {
    id: "3",
    service: "Medical Emergency",
    phone: "999",
    description: "Medical emergencies and ambulance services",
    available24h: true,
    response: "8-12 minutes"
  },
  {
    id: "4",
    service: "Property Manager",
    phone: "+254712345678",
    description: "Building maintenance and property issues",
    available24h: false,
    response: "30-60 minutes"
  }
];

const mockEmergencyReports = [
  {
    id: "1",
    type: "Water Leak",
    unitName: "Apartment 3B",
    tenantName: "John Doe",
    description: "Major water leak in the bathroom ceiling",
    priority: "high",
    status: "in-progress",
    reportedAt: "2024-06-06 14:30",
    respondedAt: "2024-06-06 14:45"
  },
  {
    id: "2", 
    type: "Power Outage",
    unitName: "House 7",
    tenantName: "Sarah Johnson",
    description: "Complete power outage in the entire house",
    priority: "medium",
    status: "resolved",
    reportedAt: "2024-06-05 20:15",
    respondedAt: "2024-06-05 20:30"
  }
];

export function EmergencyManagement() {
  const { toast } = useToast();
  const [emergencyContacts, setEmergencyContacts] = useState(mockEmergencyContacts);
  const [emergencyReports, setEmergencyReports] = useState(mockEmergencyReports);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    service: "",
    phone: "",
    description: "",
    available24h: false,
    response: ""
  });

  const handleAddContact = () => {
    if (!newContact.service || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in service name and phone number",
        variant: "destructive"
      });
      return;
    }

    const contact = {
      id: Date.now().toString(),
      ...newContact
    };

    setEmergencyContacts(prev => [...prev, contact]);
    setNewContact({
      service: "",
      phone: "",
      description: "",
      available24h: false,
      response: ""
    });
    setIsAddingContact(false);

    toast({
      title: "Contact Added",
      description: "Emergency contact has been added successfully"
    });
  };

  const handleUpdateReportStatus = (reportId: string, newStatus: string) => {
    setEmergencyReports(prev => prev.map(report => 
      report.id === reportId ? {
        ...report,
        status: newStatus,
        respondedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
      } : report
    ));

    toast({
      title: "Status Updated",
      description: `Emergency report status updated to ${newStatus}`
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Services Management</h1>
        <Button onClick={() => setIsAddingContact(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Emergency Contact
        </Button>
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="reports">Emergency Reports</TabsTrigger>
          <TabsTrigger value="procedures">Emergency Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          {isAddingContact && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Service Name</Label>
                    <Input
                      placeholder="e.g. Fire Department"
                      value={newContact.service}
                      onChange={(e) => setNewContact(prev => ({...prev, service: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="e.g. +254712345678"
                      value={newContact.phone}
                      onChange={(e) => setNewContact(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Response Time</Label>
                    <Input
                      placeholder="e.g. 5-10 minutes"
                      value={newContact.response}
                      onChange={(e) => setNewContact(prev => ({...prev, response: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newContact.available24h}
                        onChange={(e) => setNewContact(prev => ({...prev, available24h: e.target.checked}))}
                      />
                      <span>Available 24/7</span>
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Description of services provided..."
                    value={newContact.description}
                    onChange={(e) => setNewContact(prev => ({...prev, description: e.target.value}))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddContact}>Add Contact</Button>
                  <Button variant="outline" onClick={() => setIsAddingContact(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact) => (
              <Card key={contact.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{contact.service}</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="font-mono font-medium">{contact.phone}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={contact.available24h ? "default" : "secondary"}>
                      {contact.available24h ? "24/7 Available" : "Business Hours"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">~{contact.response}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emergencyReports.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emergencyReports.filter(r => r.status === 'resolved').length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emergencyReports.filter(r => r.priority === 'high').length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {emergencyReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <div>
                        <CardTitle className="text-lg">{report.type}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {report.unitName} - {report.tenantName}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={getPriorityColor(report.priority)}>
                        {report.priority} priority
                      </Badge>
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{report.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Reported: {report.reportedAt}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Responded: {report.respondedAt}</span>
                    </div>
                  </div>
                  {report.status !== "resolved" && (
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateReportStatus(report.id, "in-progress")}
                        disabled={report.status === "in-progress"}
                      >
                        Mark In Progress
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateReportStatus(report.id, "resolved")}
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Procedures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Fire Emergency</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Ensure all tenants evacuate immediately</li>
                  <li>Call Fire Department (999)</li>
                  <li>Alert property management team</li>
                  <li>Meet at designated assembly point</li>
                  <li>Conduct headcount of all residents</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Medical Emergency</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Call emergency services (999)</li>
                  <li>Provide first aid if qualified</li>
                  <li>Clear access routes for ambulance</li>
                  <li>Contact property manager</li>
                  <li>Document incident details</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Security Threat</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Call Police (999)</li>
                  <li>Secure the area if safe to do so</li>
                  <li>Alert security personnel</li>
                  <li>Guide authorities to location</li>
                  <li>Cooperate with investigation</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
