
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function MaintenanceView() {
  // Mock maintenance requests for landlords
  const maintenanceRequests = [
    {
      id: "m1",
      property: "Riverside Apartments",
      unit: "Unit 2B",
      title: "Leaking Kitchen Sink",
      tenant: "John Doe",
      status: "In Progress",
      priority: "Medium",
      date: "2025-04-20",
      description: "The kitchen sink has a leak under the cabinet that needs to be fixed."
    },
    {
      id: "m2",
      property: "Riverside Apartments",
      unit: "Unit 5A",
      title: "Bathroom Light Not Working",
      tenant: "Sarah Johnson",
      status: "Pending",
      priority: "Low",
      date: "2025-04-22",
      description: "The light in the main bathroom isn't working, might need new bulbs or fixture repair."
    },
    {
      id: "m3",
      property: "Green Gardens Estate",
      unit: "House 7",
      title: "AC Unit Making Noise",
      tenant: "Michael Smith",
      status: "Completed",
      priority: "High",
      date: "2025-04-15",
      description: "The air conditioning unit was making a loud rattling noise. It has been repaired."
    },
    {
      id: "m4",
      property: "Green Gardens Estate",
      unit: "House 3",
      title: "Broken Window",
      tenant: "Emma Wilson",
      status: "Pending",
      priority: "High",
      date: "2025-04-23",
      description: "The living room window has a crack and needs replacement."
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center">
            <Clock className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Pending</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50">
          <CardContent className="p-4 flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600 mr-4" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Average Response Time</div>
            <p className="text-2xl font-bold">1.2 days</p>
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
        {maintenanceRequests.map(request => (
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
                <p className="text-xs text-gray-500">{request.property} - {request.unit}</p>
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
              <p className="text-xs text-gray-500 mb-4">Reported by: {request.tenant} on {new Date(request.date).toLocaleDateString()}</p>
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
