
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Phone } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  phoneNumber: string;
  setPhoneNumber: (number: string) => void;
  formatPhoneNumber: (value: string) => string;
}

export function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
  phoneNumber,
  setPhoneNumber,
  formatPhoneNumber
}: PaymentMethodSelectorProps) {
  return (
    <div className="pt-2 border-t">
      <p className="text-sm font-medium mb-2">Select Payment Method</p>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input 
            type="radio" 
            id="mpesa" 
            name="paymentMethod" 
            value="mpesa" 
            checked={paymentMethod === "mpesa"}
            onChange={() => setPaymentMethod("mpesa")}
            className="text-[#ea384c] focus:ring-[#ea384c]"
          />
          <Label htmlFor="mpesa" className="flex items-center cursor-pointer">
            <span className="bg-[#ea384c]/10 p-1 rounded mr-2">
              <Phone className="h-4 w-4 text-[#ea384c]" />
            </span>
            M-Pesa
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input 
            type="radio" 
            id="bank" 
            name="paymentMethod" 
            value="bank"
            checked={paymentMethod === "bank"}
            onChange={() => setPaymentMethod("bank")}
            className="text-[#ea384c] focus:ring-[#ea384c]"
          />
          <Label htmlFor="bank" className="flex items-center cursor-pointer">
            <span className="bg-[#1A1F2C]/10 p-1 rounded mr-2">
              <CreditCard className="h-4 w-4 text-[#1A1F2C]" />
            </span>
            Bank Transfer
          </Label>
        </div>
      </div>
      
      {paymentMethod === "mpesa" && (
        <div className="space-y-3 pt-2">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="Enter M-Pesa phone number" 
              className="mt-1"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            />
          </div>
        </div>
      )}
      
      {paymentMethod === "bank" && (
        <div className="space-y-1 pt-2">
          <div className="bg-gray-50 p-3 rounded-md border text-sm">
            <p className="font-medium">Bank Account Details:</p>
            <p>Bank Name: Equity Bank</p>
            <p>Account Name: Jenga Safe Ltd</p>
            <p>Account Number: 01234567890</p>
            <p>Reference: Unit-Rent</p>
          </div>
          <div className="mt-3">
            <Label htmlFor="receipt">Upload Payment Receipt</Label>
            <Input id="receipt" type="file" className="mt-1" />
          </div>
        </div>
      )}
    </div>
  );
}
