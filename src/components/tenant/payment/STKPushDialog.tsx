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
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentBreakdown } from "./PaymentBreakdown";
import { PaymentInfoCard } from "./PaymentInfoCard";
import { STKPushConfirmation } from "./STKPushConfirmation";
import { PaymentReceipt } from "./PaymentReceipt";
import { apiClient } from "@/lib/api";

interface STKPushDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rentAmount: number;
  unitName: string;
  phoneNumber: string;
  onClose: () => void;
}

export function STKPushDialog({ isOpen, onOpenChange, rentAmount, unitName, phoneNumber, onClose }: STKPushDialogProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkSent, setStkSent] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("payment");

  // Payment breakdown calculation
  const waterBillAmount = 2500;
  const garbageCollectionAmount = 500;
  const totalAmount = rentAmount + waterBillAmount + garbageCollectionAmount;
  
  const paymentBreakdown = [
    { description: "Monthly Rent", amount: rentAmount },
    { description: "Water Bill", amount: waterBillAmount },
    { description: "Garbage Collection", amount: garbageCollectionAmount }
  ];

  const handleSendSTK = async () => {
    setIsProcessing(true);
    try {
      const response = await apiClient.initiateSTKPush({
        amount: totalAmount,
        phoneNumber,
      });
      if (response.success) {
        setStkSent(true);
        toast({
          title: "STK Push Sent",
          description: "Please check your phone and enter your M-Pesa PIN to complete the transaction",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send STK push",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send STK push";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateReceipt = () => {
    setShowReceipt(true);
    setActiveTab("receipt");
    toast({
      title: "Receipt Generated",
      description: "Your payment receipt has been generated successfully",
    });
  };

  const handleCloseDialog = () => {
    onClose();
    setStkSent(false);
    setShowReceipt(false);
    setActiveTab("payment");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className={`grid mb-4 w-full ${
                showReceipt ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              <TabsTrigger value="payment" className="text-xs">Payment</TabsTrigger>
              {showReceipt && (
                <TabsTrigger value="receipt" className="text-xs">Receipt</TabsTrigger>
              )}
            </TabsList>

            <DialogTitle className="text-base md:text-lg">
              {activeTab === "payment" && "M-Pesa Payment"}
              {activeTab === "receipt" && "Payment Receipt"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {activeTab === "payment" && `Rent Payment for ${unitName}`}
              {activeTab === "receipt" && "View or download your payment receipt"}
            </DialogDescription>
          </Tabs>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="payment" className="space-y-4 mt-0">
              {!stkSent ? (
                <div className="space-y-4">
                  <PaymentBreakdown
                    rentAmount={rentAmount}
                    waterBillAmount={waterBillAmount}
                    garbageCollectionAmount={garbageCollectionAmount}
                    totalAmount={totalAmount}
                    paymentBreakdown={paymentBreakdown}
                  />
                  <PaymentInfoCard
                    phoneNumber={phoneNumber}
                    totalAmount={totalAmount}
                    unitName={unitName}
                  />
                </div>
              ) : (
                <STKPushConfirmation
                  phoneNumber={phoneNumber}
                  totalAmount={totalAmount}
                  onGenerateReceipt={handleGenerateReceipt}
                />
              )}
            </TabsContent>

            {showReceipt && (
              <TabsContent value="receipt" className="mt-0">
              <PaymentReceipt
                phoneNumber={phoneNumber}
                totalAmount={totalAmount}
                paymentBreakdown={paymentBreakdown}
              />
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {activeTab === "payment" && !stkSent ? (
            <>
              <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">Cancel</Button>
              <Button 
                className="bg-[#ea384c] hover:bg-[#d32f41] text-white w-full sm:w-auto"
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
