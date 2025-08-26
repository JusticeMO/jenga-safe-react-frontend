
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Payment } from "@/types";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function PaymentSummaryCards() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.getPaymentHistory();
        if (res.success) {
          setPayments(res.data ?? []);
        } else {
          toast({
            title: "Error",
            description: "Failed to load payment history",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to load payment history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [toast]);

  // ----- Derived values ----------------------------------------------------
  const {
    upcomingAmount,
    upcomingDate,
    totalPaidYear,
    completedCount,
  } = useMemo(() => {
    if (!payments.length) {
      return {
        upcomingAmount: 0,
        upcomingDate: undefined,
        totalPaidYear: 0,
        completedCount: 0,
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();

    const completedThisYear = payments.filter(
      (p) =>
        p.status === "completed" &&
        new Date(p.date).getFullYear() === currentYear
    );

    const totalPaid = completedThisYear.reduce((sum, p) => sum + p.amount, 0);

    // upcoming – pick earliest pending/overdue based on date field
    const upcomingCandidates = payments
      .filter((p) => p.status !== "completed")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const upcoming = upcomingCandidates[0];

    return {
      upcomingAmount: upcoming?.amount ?? 0,
      upcomingDate: upcoming ? new Date(upcoming.date) : undefined,
      totalPaidYear: totalPaid,
      completedCount: completedThisYear.length,
    };
  }, [payments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-t-2 border-[#ea384c]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Upcoming Due</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            KES {upcomingAmount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {upcomingDate
              ? `Next payment: ${upcomingDate.toLocaleDateString()}`
              : "No upcoming payments"}
          </p>
        </CardContent>
      </Card>
      <Card className="border-t-2 border-[#1A1F2C]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Paid This Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            KES {totalPaidYear.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedCount} {completedCount === 1 ? "payment" : "payments"}
          </p>
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
