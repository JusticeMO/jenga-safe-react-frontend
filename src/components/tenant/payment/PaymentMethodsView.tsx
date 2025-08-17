
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { AddPaymentMethodDialog } from "./AddPaymentMethodDialog";

type PaymentMethod = {
  id: string;
  type: "mobile-money" | "credit-card" | "bank";
  name: string;
  details: string;
  isDefault: boolean;
};

export function PaymentMethodsView() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm1",
      type: "mobile-money",
      name: "M-Pesa",
      details: "****1234",
      isDefault: true,
    },
  ]);

  const handleAddMethod = (newMethod: {
    type: "mobile-money" | "credit-card" | "bank";
    name: string;
    details: string;
  }) => {
    if (!newMethod.name || !newMethod.details) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    const newPaymentMethod: PaymentMethod = {
      id: `pm${Date.now()}`,
      type: newMethod.type,
      name: newMethod.name,
      details: newMethod.details,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods((prev) => [...prev, newPaymentMethod]);
    
    toast({
      title: "Success",
      description: "Payment method added successfully",
    });
  };

  const setAsDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    
    toast({
      title: "Default Payment Updated",
      description: "Your default payment method has been updated",
    });
  };

  const removeMethod = (id: string) => {
    const methodToRemove = paymentMethods.find((method) => method.id === id);
    
    // Don't allow removing the default payment method
    if (methodToRemove?.isDefault) {
      toast({
        variant: "destructive",
        title: "Cannot Remove Default Method",
        description: "Please set another payment method as default first.",
      });
      return;
    }
    
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment Methods</CardTitle>
        <AddPaymentMethodDialog onAddMethod={handleAddMethod} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No payment methods added yet.
            </div>
          ) : (
            paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onSetDefault={setAsDefault}
                onRemove={removeMethod}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
