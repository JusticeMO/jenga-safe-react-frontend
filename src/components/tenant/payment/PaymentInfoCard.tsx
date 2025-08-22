
import { Label } from "@/components/ui/label";
import { CreditCard, Phone } from "lucide-react";

interface PaymentInfoCardProps {
  phoneNumber: string;
  totalAmount: number;
  unitName: string;
}

export function PaymentInfoCard({ phoneNumber, totalAmount, unitName }: PaymentInfoCardProps) {
  return (
    <>
      <div className="bg-[#ea384c]/5 p-3 rounded-md border border-[#ea384c]/20">
        <div className="flex items-center mb-2">
          <Phone className="h-4 w-4 mr-2 text-[#ea384c]" />
          <Label className="text-sm font-medium">M-Pesa Phone Number</Label>
        </div>
        <p className="text-sm font-mono bg-white px-3 py-2 rounded border">
          {phoneNumber}
        </p>
      </div>
      
      <div className="bg-[#ea384c]/5 p-3 rounded-md border border-[#ea384c]/20">
        <p className="text-sm flex items-center">
          <CreditCard className="h-4 w-4 mr-2 text-[#ea384c]" />
          <span className="font-medium">Payment Information:</span>
        </p>
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="font-medium">Amount:</span> KES {totalAmount.toLocaleString()}</p>
          <p><span className="font-medium">Business:</span> Jenga Safe Ltd</p>
          <p><span className="font-medium">Account:</span> {unitName}</p>
        </div>
      </div>
    </>
  );
}
