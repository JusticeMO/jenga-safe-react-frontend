
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { PaymentMethodsView } from "./payment/PaymentMethodsView";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaymentSummaryCards } from "./payment/PaymentSummaryCards";
import { UpcomingPaymentsTable } from "./payment/UpcomingPaymentsTable";
import { PaymentDialog } from "./payment/PaymentDialog";

type PaymentMethod = {
  id: string;
  type: "mobile-money" | "credit-card" | "bank";
  name: string;
  details: string;
  isDefault: boolean;
};

type UpcomingPayment = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
};

export function PaymentsView() {
  const isMobile = useIsMobile();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<UpcomingPayment | null>(null);
  
  // Mock upcoming payments
  const upcomingPayments = [
    {
      id: "up1",
      description: "May 2025 Rent",
      amount: 35000,
      dueDate: "2025-05-01",
    },
    {
      id: "up2",
      description: "Utility Bill - May",
      amount: 5000,
      dueDate: "2025-05-10",
    },
  ];

  const handleMakePayment = (payment: UpcomingPayment) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsPaymentDialogOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className={`p-${isMobile ? '3' : '6'} space-y-${isMobile ? '4' : '6'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            size="sm"
            className="bg-[#ea384c] hover:bg-[#d32f41] text-white"
            onClick={() => handleMakePayment(upcomingPayments[0])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Make Payment
          </Button>
        </div>
      </div>

      <PaymentSummaryCards />

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingPaymentsTable 
            payments={upcomingPayments}
            onMakePayment={handleMakePayment}
          />
        </CardContent>
      </Card>
      
      <div id="payment-methods-section">
        <PaymentMethodsView />
      </div>

      <PaymentDialog 
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        selectedPayment={selectedPayment}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
