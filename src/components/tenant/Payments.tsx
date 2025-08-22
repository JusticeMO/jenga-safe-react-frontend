import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { PaymentMethodsView } from "./payment/PaymentMethodsView";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaymentSummaryCards } from "./payment/PaymentSummaryCards";
import { UpcomingPaymentsTable } from "./payment/UpcomingPaymentsTable";
import { PaymentDialog } from "./payment/PaymentDialog";
import { apiClient } from "@/lib/api";
import { Payment } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function PaymentsView() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getPayments();
        if (response.success) {
          setUpcomingPayments(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch payments",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch payments";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [toast]);

  const handleMakePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsPaymentDialogOpen(false);
    setSelectedPayment(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
