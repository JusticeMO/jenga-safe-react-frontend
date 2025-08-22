
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
  Trash2, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock garbage collection data
const mockGarbageData = [
  {
    id: "1",
    unitName: "Apartment 3B",
    tenantName: "John Doe",
    lastCollection: "2024-06-03",
    nextCollection: "2024-06-06",
    status: "scheduled",
    fee: 500,
    paid: true
  },
  {
    id: "2",
    unitName: "House 7", 
    tenantName: "Sarah Johnson",
    lastCollection: "2024-06-02",
    nextCollection: "2024-06-06",
    status: "pending",
    fee: 500,
    paid: false
  },
  {
    id: "3",
    unitName: "Unit 2A",
    tenantName: "Michael Smith", 
    lastCollection: "2024-06-03",
    nextCollection: "2024-06-06",
    status: "completed",
    fee: 500,
    paid: true
  }
];

const collectionSchedule = [
  { day: "Monday", time: "07:00 - 09:00", areas: ["Block A", "Block B"] },
  { day: "Wednesday", time: "07:00 - 09:00", areas: ["Block C", "Houses 1-10"] },
  { day: "Friday", time: "07:00 - 09:00", areas: ["Block D", "Houses 11-20"] }
];

export function GarbageManagement() {
  const { toast } = useToast();
  const [garbageData, setGarbageData] = useState(mockGarbageData);
  const [newScheduleDay, setNewScheduleDay] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("");

  const handleMarkCollected = (unitId: string) => {
    setGarbageData(prev => prev.map(unit => 
      unit.id === unitId ? {
        ...unit,
        status: "completed",
        lastCollection: new Date().toISOString().split('T')[0]
      } : unit
    ));

    toast({
      title: "Collection Updated",
      description: "Garbage collection has been marked as completed"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "scheduled": return "secondary";
      case "pending": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "scheduled": return Clock;
      case "pending": return AlertCircle;
      default: return Clock;
    }
  };

  const totalRevenue = garbageData.reduce((sum, unit) => sum + (unit.paid ? unit.fee : 0), 0);
  const pendingPayments = garbageData.filter(unit => !unit.paid).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Garbage Collection Management</h1>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Collection
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Collection Schedule</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{garbageData.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{garbageData.filter(u => u.status === 'completed').length}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingPayments}</div>
                <p className="text-xs text-muted-foreground">Units</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Collection Status by Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {garbageData.map((unit) => {
                  const StatusIcon = getStatusIcon(unit.status);
                  return (
                    <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <StatusIcon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{unit.unitName}</p>
                          <p className="text-sm text-muted-foreground">{unit.tenantName}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={getStatusColor(unit.status)}>
                          {unit.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Next: {unit.nextCollection}
                        </p>
                      </div>
                      {unit.status !== "completed" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkCollected(unit.id)}
                        >
                          Mark Collected
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Collection Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collectionSchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{schedule.day}</p>
                        <p className="text-sm text-muted-foreground">{schedule.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Areas: {schedule.areas.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Collection Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newScheduleDay}
                    onChange={(e) => setNewScheduleDay(e.target.value)}
                  >
                    <option value="">Select day...</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <Input
                    placeholder="e.g. 07:00 - 09:00"
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    Add Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Garbage Collection Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {garbageData.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{unit.unitName}</p>
                      <p className="text-sm text-muted-foreground">{unit.tenantName}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">KES {unit.fee.toLocaleString()}</p>
                      <Badge variant={unit.paid ? "default" : "destructive"}>
                        {unit.paid ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
