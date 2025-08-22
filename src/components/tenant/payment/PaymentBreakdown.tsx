
import { Separator } from "@/components/ui/separator";

interface PaymentBreakdownProps {
  rentAmount: number;
  waterBillAmount: number;
  garbageCollectionAmount: number;
  totalAmount: number;
  paymentBreakdown: Array<{ description: string; amount: number }>;
}

export function PaymentBreakdown({
  rentAmount,
  waterBillAmount,
  garbageCollectionAmount,
  totalAmount,
  paymentBreakdown
}: PaymentBreakdownProps) {
  return (
    <div className="bg-gray-50 p-3 md:p-4 rounded-md border">
      <h4 className="text-sm font-medium mb-2">Payment Breakdown</h4>
      <div className="space-y-2">
        {paymentBreakdown.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.description}</span>
            <span>KES {item.amount.toLocaleString()}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total Amount</span>
          <span>KES {totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
