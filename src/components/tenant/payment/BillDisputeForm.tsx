
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface BillDisputeFormProps {
  paymentBreakdown: Array<{ description: string; amount: number }>;
  totalAmount: number;
  onSubmit: () => void;
}

export function BillDisputeForm({ paymentBreakdown, totalAmount, onSubmit }: BillDisputeFormProps) {
  const { toast } = useToast();
  const [appealText, setAppealText] = useState("");

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
    onSubmit();
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}
