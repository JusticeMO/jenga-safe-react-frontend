
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building, CreditCard, Phone, Plus } from "lucide-react";

interface AddPaymentMethodDialogProps {
  onAddMethod: (method: {
    type: "mobile-money" | "credit-card" | "bank";
    name: string;
    details: string;
  }) => void;
}

export function AddPaymentMethodDialog({ onAddMethod }: AddPaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [newMethod, setNewMethod] = useState<{
    type: "mobile-money" | "credit-card" | "bank";
    name: string;
    details: string;
  }>({
    type: "mobile-money",
    name: "",
    details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMethod((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMethod = () => {
    onAddMethod(newMethod);
    setNewMethod({
      type: "mobile-money",
      name: "",
      details: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Payment Type</Label>
            <RadioGroup
              value={newMethod.type}
              onValueChange={(value) =>
                setNewMethod((prev) => ({
                  ...prev,
                  type: value as "mobile-money" | "credit-card" | "bank",
                }))
              }
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile-money" id="mobile-money" />
                <Label htmlFor="mobile-money" className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Mobile Money
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Bank Account
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">
              {newMethod.type === "mobile-money"
                ? "Provider Name"
                : newMethod.type === "credit-card"
                ? "Card Name"
                : "Bank Name"}
            </Label>
            <Input
              id="name"
              name="name"
              value={newMethod.name}
              onChange={handleChange}
              placeholder={
                newMethod.type === "mobile-money"
                  ? "e.g. M-Pesa, Airtel Money"
                  : newMethod.type === "credit-card"
                  ? "e.g. Visa, Mastercard"
                  : "e.g. KCB, Equity"
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="details">
              {newMethod.type === "mobile-money"
                ? "Phone Number"
                : newMethod.type === "credit-card"
                ? "Card Number"
                : "Account Number"}
            </Label>
            <Input
              id="details"
              name="details"
              value={newMethod.details}
              onChange={handleChange}
              placeholder={
                newMethod.type === "mobile-money"
                  ? "e.g. 07XXXXXXXX"
                  : newMethod.type === "credit-card"
                  ? "e.g. XXXX XXXX XXXX XXXX"
                  : "e.g. XXXXXXXXXXX"
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMethod}>Add Method</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
