
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, TrendingUp, TrendingDown } from "lucide-react";

const monthlyData = [
  { month: "January", units: 5, amount: 1000, status: "Paid" },
  { month: "February", units: 5.5, amount: 1100, status: "Paid" },
  { month: "March", units: 4.8, amount: 960, status: "Paid" },
  { month: "April", units: 5.2, amount: 1040, status: "Paid" },
  { month: "May", units: 5.8, amount: 1160, status: "Paid" },
  { month: "June", units: 6, amount: 1200, status: "Due with July Rent" }
];

const chartData = [
  { month: "Jan", value: 5 },
  { month: "Feb", value: 5.5 },
  { month: "Mar", value: 4.8 },
  { month: "Apr", value: 5.2 },
  { month: "May", value: 5.8 },
  { month: "Jun", value: 6 }
];

export function WaterUsage() {
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const averageUsage = monthlyData.slice(0, -1).reduce((sum, data) => sum + data.units, 0) / (monthlyData.length - 1);
  
  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Water Usage</h1>
      
      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Month Usage</p>
                <p className="text-2xl md:text-3xl font-bold">{currentMonth.units} Units</p>
                <p className="text-xs text-gray-500">June 2023</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Bill Amount</p>
                <p className="text-2xl md:text-3xl font-bold">KES {currentMonth.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{currentMonth.status}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <span className="text-green-600 font-bold">KES</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Monthly Usage</p>
                <p className="text-2xl md:text-3xl font-bold">{averageUsage.toFixed(1)} Units</p>
                <p className="text-xs text-gray-500">Last 6 Months</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                {currentMonth.units > averageUsage ? (
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-purple-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Water Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {chartData.map((data, index) => (
                <div key={data.month} className="text-center">
                  <div className="mb-2">
                    <div 
                      className="bg-blue-500 rounded-t-md mx-auto"
                      style={{ 
                        height: `${(data.value / Math.max(...chartData.map(d => d.value))) * 120}px`,
                        width: '40px'
                      }}
                    />
                    <div className="bg-gray-200 h-2 w-10 mx-auto rounded-b-md" />
                  </div>
                  <p className="text-xs font-medium">{data.month}</p>
                  <p className="text-xs text-gray-500">{data.value} units</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle>Water Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Month</th>
                  <th className="text-left p-2 font-medium">Units Used</th>
                  <th className="text-left p-2 font-medium">Amount (KES)</th>
                  <th className="text-left p-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{data.month} 2023</td>
                    <td className="p-2">{data.units}</td>
                    <td className="p-2">{data.amount.toLocaleString()}</td>
                    <td className="p-2">
                      <Badge 
                        variant={data.status === "Paid" ? "default" : "secondary"}
                        className={data.status === "Paid" ? "bg-green-100 text-green-800" : ""}
                      >
                        {data.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
