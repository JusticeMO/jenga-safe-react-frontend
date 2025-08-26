import { useState, useEffect } from "react";
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
  Trash,
  MapPin, 
  Clock,
  CheckCircle,
  User,
  Plus,
  Edit
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api";
import { EmergencyContact, Property } from "@/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function EmergencyManagement() {
  const { toast } = useToast();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  // reports kept for now but hidden
  const [emergencyReports] = useState<any[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    description: "",
    icon: "",
    bg_color: "",
    text_color: "",
    sort_order: 0,
    property_id: undefined as string | number | undefined,
  });

  // Load contacts + landlord properties
  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContacts = async () => {
    try {
      const [contactsRes, propsRes] = await Promise.all([
        apiClient.getEmergencyContacts(),
        apiClient.getMyProperties(),
      ]);
      if (contactsRes.success) setEmergencyContacts(contactsRes.data);
      if (propsRes.success) setProperties(propsRes.data);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message ?? "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in service name and phone number",
        variant: "destructive"
      });
      return;
    }

    apiClient
      .createEmergencyContact({
        name: newContact.name,
        number: newContact.phone,
        description: newContact.description,
        icon: newContact.icon || undefined,
        bg_color: newContact.bg_color || undefined,
        text_color: newContact.text_color || undefined,
        sort_order: newContact.sort_order || undefined,
        property_id: newContact.property_id || undefined,
      })
      .then((res) => {
        if (res.success) {
          fetchContacts();
          toast({ title: "Contact Added", description: "Essential contact created" });
          setNewContact({
            name: "",
            phone: "",
            description: "",
            icon: "",
            bg_color: "",
            text_color: "",
            sort_order: 0,
            property_id: undefined,
          });
          setIsAddingContact(false);
        }
      })
      .catch((e: any) =>
        toast({
          title: "Error",
          description: e.message ?? "Failed to create contact",
          variant: "destructive",
        })
      );
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
          Add Essential Contact
        </Button>
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">Essential Contacts</TabsTrigger>
          <TabsTrigger value="reports">Emergency Reports</TabsTrigger>
          <TabsTrigger value="procedures">Emergency Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          {isAddingContact && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Essential Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Service Name</Label>
                    <Input
                      placeholder="e.g. Fire Department"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({...prev, name: e.target.value}))}
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
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={newContact.sort_order}
                    onChange={(e) =>
                      setNewContact((p) => ({ ...p, sort_order: Number(e.target.value) }))
                    }
                  />
                  </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={newContact.icon}
                    onValueChange={(val) => setNewContact((p) => ({ ...p, icon: val }))}
                  >
                    <SelectTrigger />
                    <SelectContent>
                      {["Heart", "Flame", "Shield", "Building", "AlertTriangle"].map((ic) => (
                        <SelectItem key={ic} value={ic}>
                          {ic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input
                    placeholder="e.g. bg-red-100"
                    value={newContact.bg_color}
                    onChange={(e) => setNewContact((p) => ({ ...p, bg_color: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <Input
                    placeholder="e.g. text-red-600"
                    value={newContact.text_color}
                    onChange={(e) => setNewContact((p) => ({ ...p, text_color: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Property</Label>
                  <Select
                    value={newContact.property_id ? String(newContact.property_id) : ""}
                    onValueChange={(val) =>
                      setNewContact((p) => ({ ...p, property_id: val || undefined }))
                    }
                  >
                    <SelectTrigger />
                    <SelectContent>
                      {/* default option */}
                      <SelectItem value="">All Properties</SelectItem>
                      {/* landlord's properties */}
                      {properties.map((prop) => (
                        <SelectItem key={prop.id} value={String(prop.id)}>
                          {prop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => {/* edit TBD */}}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          apiClient
                            .deleteEmergencyContact(contact.id)
                            .then(fetchContacts)
                            .catch((e: any) =>
                              toast({
                                title: "Error",
                                description: e.message ?? "Failed to delete",
                                variant: "destructive",
                              })
                            )
                        }
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="font-mono font-medium">{contact.number}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {contact.property_id
                        ? properties.find((p) => p.id === contact.property_id)?.name ??
                          `Property #${contact.property_id}`
                        : "All Properties"}
                    </Badge>
                    {contact.sort_order !== undefined && (
                      <Badge variant="outline">#{contact.sort_order}</Badge>
                    )}
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
