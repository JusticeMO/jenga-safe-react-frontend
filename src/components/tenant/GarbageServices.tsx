import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Clock, Recycle, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { GarbageServiceHistory } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function GarbageServices() {
  const { toast } = useToast();
  const [paymentHistory, setPaymentHistory] = useState<GarbageServiceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getGarbageServiceHistory();
        if (response.success) {
          setPaymentHistory(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch garbage service history",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch garbage service history";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Garbage Services</h1>
      
      {/* Service Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Fee</p>
                <p className="text-2xl md:text-3xl font-bold">KES 500</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Paid for June</Badge>
              </div>
              <div className="p-2 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Collection Schedule</p>
                <p className="text-lg md:text-xl font-bold">Tuesday, Friday</p>
                <p className="text-xs text-gray-500">Between 8 AM - 11 AM</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Next Collection</p>
                <p className="text-lg md:text-xl font-bold">July 4, 2023</p>
                <p className="text-xs text-gray-500">Tuesday</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-md">
            <Trash2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Regular Waste Collection</h4>
              <p className="text-sm text-gray-600">
                Household waste collected twice weekly. Please ensure trash is properly bagged and placed in the designated collection area by 8 AM on collection days.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-md">
            <Recycle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Recycling Program</h4>
              <p className="text-sm text-gray-600">
                Recycling materials (paper, plastic, glass) are collected every Friday. Please sort your recyclables according to the guidelines provided.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-md">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Special Waste Disposal</h4>
              <p className="text-sm text-gray-600">
                For large items or hazardous waste, please contact property management to arrange special disposal. Additional fees may apply.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Month</th>
                  <th className="text-left p-2 font-medium">Amount (KES)</th>
                  <th className="text-left p-2 font-medium">Payment Date</th>
                  <th className="text-left p-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{payment.month}</td>
                    <td className="p-2">{payment.amount}</td>
                    <td className="p-2">{payment.paymentDate}</td>
                    <td className="p-2">
                      <Badge className="bg-green-100 text-green-800">
                        {payment.status}
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
