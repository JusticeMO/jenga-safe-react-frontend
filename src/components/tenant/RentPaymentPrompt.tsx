
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Home, Calendar, DollarSign, Info, Phone } from "lucide-react";
import { PaymentMethodSelector } from "./payment/PaymentMethodSelector";
import { STKPushDialog } from "./payment/STKPushDialog";

interface RentPaymentPromptProps {
  unitName: string;
  rentAmount: number;
  depositAmount?: number;
  dueDate: string;
  firstPayment?: boolean;
}

export function RentPaymentPrompt({ 
  unitName, 
  rentAmount, 
  depositAmount = 0, 
  dueDate, 
  firstPayment = false 
}: RentPaymentPromptProps) {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStkDialogOpen, setIsStkDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  
  // Calculate if rent is overdue
  const isOverdue = new Date(dueDate) < new Date();
  
  // Additional utility costs
  const waterBillAmount = 2500;
  const garbageCollectionAmount = 500;
  
  // Calculate total amount including deposit if it's the first payment
  const totalAmount = rentAmount + waterBillAmount + garbageCollectionAmount + depositAmount;
  
  const handlePayRent = () => {
    if (paymentMethod === "mpesa") {
      if (showPhoneInput && phoneNumber) {
        setIsStkDialogOpen(true);
      } else {
        setShowPhoneInput(true);
      }
    } else {
      setIsProcessing(true);
      // Simulate payment processing for non-M-Pesa methods
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Payment Initiated",
          description: "Your payment is being processed. You will receive a confirmation shortly.",
        });
        
        if (firstPayment) {
          // Update localStorage to indicate first payment has been made
          const propertyDetails = localStorage.getItem('propertyDetails');
          if (propertyDetails) {
            try {
              const parsedDetails = JSON.parse(propertyDetails);
              parsedDetails.firstPaymentDue = false;
              // Set the next payment due date to a month from now
              const nextMonth = new Date();
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              parsedDetails.nextDueDate = nextMonth.toISOString();
              localStorage.setItem('propertyDetails', JSON.stringify(parsedDetails));
            } catch (e) {
              console.error("Error updating property details in localStorage:", e);
            }
          }
        }
      }, 2000);
    }
  };

  const handleCloseDialog = () => {
    setIsStkDialogOpen(false);
  };

  const formatPhoneNumber = (value: string) => {
    // Format the phone number as it's being entered
    return value.replace(/[^0-9+]/g, "");
  };
  
  return (
    <Card className="border-t-4 border-[#ea384c]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              {firstPayment ? "Initial Payment Due" : "Rent Payment Due"}
            </CardTitle>
            <CardDescription>Your assigned housing unit: {unitName}</CardDescription>
          </div>
          <div className="p-2 rounded-full bg-[#ea384c]/10">
            <Home className="h-6 w-6 text-[#ea384c]" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Amount Due</p>
            <p className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</p>
            <div className="mt-1 text-xs text-gray-500">
              <p>Rent: KES {rentAmount.toLocaleString()}</p>
              {depositAmount > 0 && (
                <p className="font-medium text-[#ea384c]">
                  Security Deposit: KES {depositAmount.toLocaleString()}
                </p>
              )}
              <p>Water: KES {waterBillAmount.toLocaleString()}</p>
              <p>Garbage: KES {garbageCollectionAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <Calendar className="h-4 w-4 mr-1 text-[#ea384c]" />
              <p className="text-sm font-medium text-gray-500">Due Date</p>
            </div>
            <p className={`text-sm font-medium ${isOverdue ? 'text-[#ea384c]' : 'text-gray-900'}`}>
              {new Date(dueDate).toLocaleDateString()} 
              {isOverdue && <span className="ml-2 inline-block px-2 py-0.5 bg-[#ea384c]/10 text-[#ea384c] text-xs rounded-full">Overdue</span>}
            </p>
            
            {firstPayment && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center">
                  <Info className="h-4 w-4 text-amber-500 mr-1" />
                  <p className="text-xs font-medium text-amber-700">First Payment</p>
                </div>
                <p className="text-xs text-amber-600 mt-1">
                  Includes security deposit and first month's rent
                </p>
              </div>
            )}
          </div>
        </div>
        
        <PaymentMethodSelector 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          formatPhoneNumber={formatPhoneNumber}
        />
        
        {/* Show phone input when M-Pesa is selected and user clicks pay */}
        {showPhoneInput && paymentMethod === "mpesa" && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-md border">
            <Label htmlFor="mpesa-phone">Enter M-Pesa Phone Number</Label>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-[#ea384c]" />
              <Input
                id="mpesa-phone"
                placeholder="e.g. 07XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                maxLength={13}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Enter the phone number registered with M-Pesa
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePayRent} 
          className="w-full bg-[#ea384c] hover:bg-[#d32f41] text-white"
          disabled={isProcessing || (showPhoneInput && paymentMethod === "mpesa" && !phoneNumber)}
        >
          {isProcessing ? 'Processing...' : 
           showPhoneInput && paymentMethod === "mpesa" ? 'Send STK Push' :
           firstPayment ? 'Pay Initial Amount' : 'Pay All Bills Now'}
        </Button>
      </CardFooter>

      <STKPushDialog 
        isOpen={isStkDialogOpen}
        onOpenChange={setIsStkDialogOpen}
        rentAmount={totalAmount}
        unitName={unitName}
        phoneNumber={phoneNumber}
        onClose={handleCloseDialog}
      />
    </Card>
  );
}
