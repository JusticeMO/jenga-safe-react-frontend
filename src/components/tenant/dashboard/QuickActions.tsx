
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Upload, 
  MessageSquare, 
  FileText, 
  AlertTriangle,
  Home
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const { toast } = useToast();
  const [isMoveOutDialogOpen, setIsMoveOutDialogOpen] = useState(false);
  const [moveOutReason, setMoveOutReason] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  
  const handleSubmitMoveOutNotice = () => {
    if (!moveOutReason || !moveOutDate) {
      toast({
        title: "Missing Information",
        description: "Please provide both a reason and move-out date",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Notice Submitted",
      description: "Your move-out notice has been submitted successfully. The property manager will review it."
    });
    
    setIsMoveOutDialogOpen(false);
    setMoveOutReason("");
    setMoveOutDate("");
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-24 text-lg justify-start px-6 py-10 shadow-sm"
          onClick={() => onActionClick("pay-rent")}
        >
          <CreditCard className="w-6 h-6 mr-2" />
          Pay Rent
        </Button>
        <Button 
          variant="outline" 
          className="h-24 text-lg justify-start px-6 py-10 shadow-sm"
          onClick={() => onActionClick("upload-payment")}
        >
          <Upload className="w-6 h-6 mr-2" />
          Upload Payment
        </Button>
        <Button 
          variant="outline" 
          className="h-24 text-lg justify-start px-6 py-10 shadow-sm"
          onClick={() => onActionClick("new-message")}
        >
          <MessageSquare className="w-6 h-6 mr-2" />
          New Message
        </Button>
        <Button 
          variant="outline" 
          className="h-24 text-lg justify-start px-6 py-10 shadow-sm"
          onClick={() => onActionClick("view-receipt")}
        >
          <FileText className="w-6 h-6 mr-2" />
          View Receipt
        </Button>
        <Button 
          variant="outline" 
          className="h-24 text-lg justify-start px-6 py-10 shadow-sm"
          onClick={() => onActionClick("maintenance")}
        >
          <AlertTriangle className="w-6 h-6 mr-2" />
          Submit Maintenance Request
        </Button>
        
        <Dialog open={isMoveOutDialogOpen} onOpenChange={setIsMoveOutDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="h-24 text-lg justify-start px-6 py-10 shadow-sm"
            >
              <Home className="w-6 h-6 mr-2" />
              Notice of Moving Out
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit Move-Out Notice</DialogTitle>
              <DialogDescription>
                Please provide details about your planned move-out. A minimum of 30 days notice is required.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="move-out-date">Planned Move-Out Date</Label>
                <input
                  id="move-out-date"
                  type="date"
                  value={moveOutDate}
                  onChange={(e) => setMoveOutDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Moving Out</Label>
                <Textarea
                  id="reason"
                  value={moveOutReason}
                  onChange={(e) => setMoveOutReason(e.target.value)}
                  placeholder="Please provide a reason for moving out..."
                  rows={4}
                />
              </div>
              
              <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700 space-y-2">
                <p className="flex items-center"><AlertTriangle className="h-4 w-4 mr-2" /> Important Information</p>
                <ul className="list-disc pl-6 text-xs space-y-1">
                  <li>Your security deposit will be processed within 21 days after move-out.</li>
                  <li>A move-out inspection will be scheduled close to your departure.</li>
                  <li>All personal belongings must be removed and the unit cleaned upon departure.</li>
                  <li>Any unpaid rent or damages will be deducted from your security deposit.</li>
                </ul>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMoveOutDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSubmitMoveOutNotice}
                className="bg-[#ea384c] hover:bg-[#d32f41] text-white"
              >
                Submit Notice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
