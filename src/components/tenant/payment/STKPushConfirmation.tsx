
import { Button } from "@/components/ui/button";
import { Phone, Receipt } from "lucide-react";

interface STKPushConfirmationProps {
  phoneNumber: string;
  totalAmount: number;
  onGenerateReceipt: () => void;
}

export function STKPushConfirmation({ phoneNumber, totalAmount, onGenerateReceipt }: STKPushConfirmationProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto bg-[#ea384c]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center">
        <Phone className="h-8 w-8 text-[#ea384c]" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium">STK Push Sent</h3>
        <p className="text-sm text-gray-500 mt-1">
          Check your phone ({phoneNumber}) for the M-Pesa prompt
        </p>
      </div>
      
      <div className="bg-[#1A1F2C]/5 p-3 rounded-md border border-[#1A1F2C]/10">
        <p className="text-sm">
          Enter your M-Pesa PIN on your phone to authorize the payment of 
          <span className="font-bold"> KES {totalAmount.toLocaleString()}</span> to Jenga Safe Ltd.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={onGenerateReceipt}
        className="w-full mt-4"
      >
        <Receipt className="mr-2 h-4 w-4" />
        Generate Receipt
      </Button>
    </div>
  );
}
