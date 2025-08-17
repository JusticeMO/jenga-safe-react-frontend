
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export function ReportsView() {
  const { toast } = useToast();
  
  // Mock financial data for charts
  const monthlyRevenue = [
    { month: "Jan", revenue: 235000, expenses: 182000 },
    { month: "Feb", revenue: 240000, expenses: 175000 },
    { month: "Mar", revenue: 245000, expenses: 190000 },
    { month: "Apr", revenue: 250000, expenses: 180000 },
    { month: "May", revenue: 260000, expenses: 185000 },
    { month: "Jun", revenue: 260000, expenses: 187000 },
  ];

  const expenseBreakdown = [
    { name: "Maintenance", value: 45000 },
    { name: "Utilities", value: 28000 },
    { name: "Insurance", value: 22000 },
    { name: "Property Management", value: 38000 },
    { name: "Taxes", value: 54000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Mock tenant payment data
  const tenantPayments = [
    {
      id: "t1",
      name: "John Doe",
      property: "Riverside Apartments",
      unit: "Unit 2B",
      currentRent: 25000,
      status: "paid",
      lastPaymentDate: "2025-04-01",
      dueDate: "2025-04-01"
    },
    {
      id: "t2",
      name: "Sarah Johnson",
      property: "Riverside Apartments",
      unit: "Unit 5A",
      currentRent: 25000,
      status: "overdue",
      lastPaymentDate: "2025-03-01",
      dueDate: "2025-04-01",
      overdueAmount: 25000,
      overdueMonths: 1
    },
    {
      id: "t3",
      name: "Michael Smith",
      property: "Green Gardens Estate",
      unit: "House 7",
      currentRent: 35000,
      status: "paid",
      lastPaymentDate: "2025-04-01",
      dueDate: "2025-04-01"
    },
    {
      id: "t4",
      name: "Emma Wilson",
      property: "Green Gardens Estate",
      unit: "House 3",
      currentRent: 35000,
      status: "partial",
      lastPaymentDate: "2025-04-01",
      dueDate: "2025-04-01",
      overdueAmount: 15000
    },
    {
      id: "t5",
      name: "David Brown",
      property: "Riverside Apartments",
      unit: "Unit 1C",
      currentRent: 25000,
      status: "paid",
      lastPaymentDate: "2025-04-01",
      dueDate: "2025-04-01"
    }
  ];
  
  const handleSendWarning = (tenantId: string, warningType: "yellow" | "red") => {
    const tenant = tenantPayments.find(t => t.id === tenantId);
    
    if (tenant) {
      toast({
        title: warningType === "yellow" ? "Warning Sent" : "Vacate Notice Sent",
        description: `A ${warningType === "yellow" ? "warning" : "vacate notice"} has been sent to ${tenant.name}`
      });
    }
  };

  const handleExportReport = (format: "pdf" | "csv") => {
    toast({
      title: "Export Started",
      description: `Exporting report as ${format.toUpperCase()}`
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Total Revenue</div>
            <p className="text-2xl font-bold">KES 1,490,000</p>
            <p className="text-xs text-green-600">+3.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Total Expenses</div>
            <p className="text-2xl font-bold">KES 1,099,000</p>
            <p className="text-xs text-red-600">+1.8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Net Income</div>
            <p className="text-2xl font-bold">KES 391,000</p>
            <p className="text-xs text-green-600">+7.4% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-1">Occupancy Rate</div>
            <p className="text-2xl font-bold">86%</p>
            <p className="text-xs text-green-600">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Revenue vs Expenses (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyRevenue}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `KES ${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4F46E5" name="Revenue" />
                  <Bar dataKey="expenses" fill="#F43F5E" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property & Unit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Rent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tenantPayments.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenant.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.property} - {tenant.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KES {tenant.currentRent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tenant.status === "paid" 
                          ? "bg-green-100 text-green-800" 
                          : tenant.status === "partial" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {tenant.status === "paid" ? "Paid" : 
                          tenant.status === "partial" ? "Partially Paid" : "Overdue"}
                      </span>
                      {tenant.status !== "paid" && (
                        <div className="mt-1 text-xs text-gray-500">
                          {tenant.status === "overdue" 
                            ? `${tenant.overdueMonths} ${tenant.overdueMonths === 1 ? 'month' : 'months'} overdue` 
                            : "Partial payment"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tenant.status !== "paid" && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center" 
                            onClick={() => handleSendWarning(tenant.id, "yellow")}
                          >
                            <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-500">Warning</span>
                          </Button>
                          {tenant.status === "overdue" && tenant.overdueMonths && tenant.overdueMonths > 1 && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center"
                              onClick={() => handleSendWarning(tenant.id, "red")}
                            >
                              <Bell className="mr-1 h-4 w-4 text-red-500" />
                              <span className="text-red-500">Vacate Notice</span>
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Financial Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-20</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rent Payment - Unit 2B</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Riverside Apartments</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Income</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+ KES 25,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-18</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Plumbing Repair - Unit 5A</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Riverside Apartments</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maintenance</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">- KES 5,800</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rent Payment - House 7</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Green Gardens Estate</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Income</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+ KES 35,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-12</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Property Insurance</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All Properties</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Insurance</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">- KES 22,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Landscaping Service</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Green Gardens Estate</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maintenance</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">- KES 8,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
