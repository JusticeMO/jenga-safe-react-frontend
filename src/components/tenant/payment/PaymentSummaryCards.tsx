
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function PaymentSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-t-2 border-[#ea384c]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Upcoming Due</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">KES 40,000</div>
          <p className="text-xs text-muted-foreground mt-1">Next payment: May 1, 2025</p>
        </CardContent>
      </Card>
      <Card className="border-t-2 border-[#1A1F2C]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Paid This Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">KES 160,000</div>
          <p className="text-xs text-muted-foreground mt-1">4 monthly payments</p>
        </CardContent>
      </Card>
      <Card className="border-t-2 border-[#ea384c]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm flex items-center">
            <Phone className="mr-2 h-4 w-4 text-[#ea384c]" />
            <span className="font-medium">M-Pesa ****1234</span>
          </div>
          <Button 
            variant="link" 
            className="text-xs p-0 mt-1 text-[#ea384c]" 
            onClick={() => document.getElementById('payment-methods-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Manage payment methods
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
