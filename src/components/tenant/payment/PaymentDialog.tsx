
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, FileText, Phone, Receipt } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Payment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  breakdown?: PaymentBreakdown[];
}

interface PaymentBreakdown {
  description: string;
  amount: number;
}

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayment: Payment | null;
  onClose: () => void;
}

export function PaymentDialog({ isOpen, onOpenChange, selectedPayment, onClose }: PaymentDialogProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkSent, setStkSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [appealText, setAppealText] = useState("");
  const [activeTab, setActiveTab] = useState<string>("payment");
  
  // Example breakdown data - in real app, this would come from the selectedPayment
  const paymentBreakdown = selectedPayment?.breakdown || [
    { description: "Monthly Rent", amount: selectedPayment?.amount ? selectedPayment.amount * 0.8 : 0 },
    { description: "Water Bill", amount: selectedPayment?.amount ? selectedPayment.amount * 0.15 : 0 },
    { description: "Garbage Collection", amount: selectedPayment?.amount ? selectedPayment.amount * 0.05 : 0 }
  ];
  
  const totalAmount = paymentBreakdown.reduce((sum, item) => sum + item.amount, 0);

  const handleSendSTK = () => {
    // Validate phone number format
    if (!phoneNumber || !(
        phoneNumber.startsWith("07") || 
        phoneNumber.startsWith("01") || 
        phoneNumber.startsWith("254") || 
        phoneNumber.startsWith("+254")
      ) || phoneNumber.replace(/[^0-9]/g, "").length < 9) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate STK push request
    setTimeout(() => {
      setIsProcessing(false);
      setStkSent(true);
      toast({
        title: "STK Push Sent",
        description: "Please check your phone and enter your M-Pesa PIN to complete the transaction",
      });
    }, 2000);
  };

  const handleSubmitAppeal = () => {
    if (!appealText.trim()) {
      toast({
        title: "Empty Appeal",
        description: "Please provide details about your appeal",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Appeal Submitted",
      description: "Your bill dispute has been received and will be reviewed within 48 hours",
    });
    
    setAppealText("");
    setActiveTab("payment");
  };

  const handleGenerateReceipt = () => {
    setShowReceipt(true);
    toast({
      title: "Receipt Generated",
      description: "Your payment receipt has been generated successfully",
    });
  };

  const handleCloseDialog = () => {
    onClose();
    setStkSent(false);
    setPhoneNumber("");
    setShowReceipt(false);
    setAppealText("");
    setActiveTab("payment");
  };

  const formatPhoneNumber = (value: string) => {
    // Format the phone number as it's being entered
    return value.replace(/[^0-9+]/g, "");
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="receipt">Receipt</TabsTrigger>
              <TabsTrigger value="appeal">Dispute Bill</TabsTrigger>
            </TabsList>

            <DialogTitle className="text-lg">
              {activeTab === "payment" && "M-Pesa Payment"}
              {activeTab === "receipt" && "Payment Receipt"}
              {activeTab === "appeal" && "Bill Dispute Form"}
            </DialogTitle>
            <DialogDescription>
              {selectedPayment && activeTab === "payment" && `Payment for ${selectedPayment.description}`}
              {activeTab === "receipt" && "View or download your payment receipt"}
              {activeTab === "appeal" && "Submit a dispute if you believe your bill is incorrect"}
            </DialogDescription>
          </Tabs>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4 mt-0">
              {!stkSent ? (
                <div className="space-y-4">
                  {/* Payment Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-md border">
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

                  <div className="space-y-2">
                    <Label htmlFor="phone">Enter M-Pesa Phone Number</Label>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-5 w-5 text-[#ea384c]" />
                      <Input
                        id="phone"
                        placeholder="e.g. 07XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        maxLength={13}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the phone number registered with M-Pesa
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
                      <p><span className="font-medium">Account:</span> {selectedPayment?.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
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
                    onClick={handleGenerateReceipt}
                    className="w-full mt-4"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Generate Receipt
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Receipt Tab */}
            <TabsContent value="receipt" className="mt-0">
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Payment Receipt</h3>
                    <p className="text-sm text-gray-500">Jenga Safe Ltd</p>
                  </div>
                  <div className="bg-[#ea384c]/10 p-2 rounded">
                    <FileText className="h-6 w-6 text-[#ea384c]" />
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Receipt No:</span>
                    <span>RCT-{Math.floor(Math.random() * 1000000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span>{formatDate()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>M-Pesa</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phone Number:</span>
                    <span>{phoneNumber || "N/A"}</span>
                  </div>
                  <Separator />
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Payment Details</h4>
                  <div className="space-y-2">
                    {paymentBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.description}</span>
                        <span>KES {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md mb-6">
                  <div className="flex justify-between font-medium">
                    <span>Total Amount Paid</span>
                    <span>KES {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-center text-xs text-gray-500">
                  <p>For any inquiries, please contact support@jengasafe.com</p>
                  <p>Thank you for your payment!</p>
                </div>
              </div>
            </TabsContent>

            {/* Appeal Tab */}
            <TabsContent value="appeal" className="space-y-4 mt-0">
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mb-4">
                <p className="text-sm text-amber-800">
                  If you believe there is an error in your bill, please provide details below. 
                  Our team will review your case within 48 hours.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billDisputeReason">Reason for dispute</Label>
                <Textarea
                  id="billDisputeReason"
                  placeholder="Please explain why you believe there is an error in your bill..."
                  className="min-h-[120px]"
                  value={appealText}
                  onChange={(e) => setAppealText(e.target.value)}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md border">
                <h4 className="text-sm font-medium mb-2">Disputed Bill</h4>
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

              <Button 
                onClick={handleSubmitAppeal} 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Submit Dispute
              </Button>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          {activeTab === "payment" && !stkSent ? (
            <>
              <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                className="bg-[#ea384c] hover:bg-[#d32f41] text-white"
                onClick={handleSendSTK}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Send STK Push"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleCloseDialog} className="w-full">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
