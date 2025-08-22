
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
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Download,
  Search,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock water usage data
const mockWaterData = [
  {
    id: "1",
    unitName: "Apartment 3B",
    tenantName: "John Doe",
    currentReading: 2450,
    previousReading: 2380,
    usage: 70,
    amount: 2500,
    status: "normal",
    lastUpdated: "2024-06-05"
  },
  {
    id: "2", 
    unitName: "House 7",
    tenantName: "Sarah Johnson",
    currentReading: 1890,
    previousReading: 1790,
    usage: 100,
    amount: 3000,
    status: "high",
    lastUpdated: "2024-06-04"
  },
  {
    id: "3",
    unitName: "Unit 2A", 
    tenantName: "Michael Smith",
    currentReading: 1650,
    previousReading: 1600,
    usage: 50,
    amount: 2000,
    status: "normal",
    lastUpdated: "2024-06-05"
  }
];

export function WaterUsageMonitoring() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [waterData, setWaterData] = useState(mockWaterData);
  const [newReading, setNewReading] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const filteredData = waterData.filter(unit => 
    unit.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateReading = () => {
    if (!selectedUnit || !newReading) {
      toast({
        title: "Missing Information",
        description: "Please select a unit and enter a reading",
        variant: "destructive"
      });
      return;
    }

    setWaterData(prev => prev.map(unit => 
      unit.id === selectedUnit ? {
        ...unit,
        previousReading: unit.currentReading,
        currentReading: parseInt(newReading),
        usage: parseInt(newReading) - unit.currentReading,
        lastUpdated: new Date().toISOString().split('T')[0]
      } : unit
    ));

    toast({
      title: "Reading Updated",
      description: "Water meter reading has been updated successfully"
    });

    setNewReading("");
    setSelectedUnit("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "destructive";
      case "normal": return "secondary";
      default: return "secondary";
    }
  };

  const totalUsage = filteredData.reduce((sum, unit) => sum + unit.usage, 0);
  const totalAmount = filteredData.reduce((sum, unit) => sum + unit.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Water Usage Monitoring</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="readings">Meter Readings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{waterData.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsage}L</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Usage</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{waterData.filter(u => u.status === 'high').length}</div>
                <p className="text-xs text-muted-foreground">Units</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Water Usage by Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{unit.unitName}</p>
                      <p className="text-sm text-muted-foreground">{unit.tenantName}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">{unit.usage}L used</p>
                      <p className="text-sm text-muted-foreground">KES {unit.amount.toLocaleString()}</p>
                    </div>
                    <Badge variant={getStatusColor(unit.status)}>
                      {unit.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="readings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Update Meter Readings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Select Unit</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                  >
                    <option value="">Choose unit...</option>
                    {waterData.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unitName} - {unit.tenantName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>New Reading</Label>
                  <Input
                    type="number"
                    placeholder="Enter meter reading"
                    value={newReading}
                    onChange={(e) => setNewReading(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleUpdateReading} className="w-full">
                    Update Reading
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Readings</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search units..." 
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.map((unit) => (
                  <div key={unit.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{unit.unitName}</p>
                      <p className="text-sm text-muted-foreground">{unit.tenantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Previous</p>
                      <p className="font-medium">{unit.previousReading}L</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="font-medium">{unit.currentReading}L</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Usage</p>
                      <p className="font-medium text-blue-600">{unit.usage}L</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{unit.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Bills Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{unit.unitName}</p>
                      <p className="text-sm text-muted-foreground">{unit.tenantName}</p>
                      <p className="text-sm text-muted-foreground">{unit.usage}L used</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">KES {unit.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">June 2024</p>
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
