
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download } from "lucide-react";

interface PaymentReceiptProps {
  phoneNumber: string;
  totalAmount: number;
  paymentBreakdown: Array<{ description: string; amount: number }>;
}

export function PaymentReceipt({ phoneNumber, totalAmount, paymentBreakdown }: PaymentReceiptProps) {
  const { toast } = useToast();

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
JENGA SAFE LTD
Payment Receipt

Receipt No: RCT-${Math.floor(Math.random() * 1000000)}
Date: ${formatDate()}
Payment Method: M-Pesa
Phone Number: ${phoneNumber}

PAYMENT DETAILS:
${paymentBreakdown.map(item => `${item.description}: KES ${item.amount.toLocaleString()}`).join('\n')}

Total Amount Paid: KES ${totalAmount.toLocaleString()}

For any inquiries, please contact support@jengasafe.com
Thank you for your payment!
    `;

    const element = document.createElement("a");
    const file = new Blob([receiptContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `receipt-${Math.floor(Math.random() * 1000000)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded successfully",
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base md:text-lg font-bold">Payment Receipt</h3>
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
          <span>{phoneNumber}</span>
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
      
      <Button 
        onClick={handleDownloadReceipt}
        className="w-full mb-4 bg-[#9b87f5] hover:bg-[#7E69AB]"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Receipt
      </Button>
      
      <div className="text-center text-xs text-gray-500">
        <p>For any inquiries, please contact support@jengasafe.com</p>
        <p>Thank you for your payment!</p>
      </div>
    </div>
  );
}
