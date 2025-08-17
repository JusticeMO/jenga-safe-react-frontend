
import { Button } from "@/components/ui/button";
import { Check, X, Phone, CreditCard, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PaymentMethod = {
  id: string;
  type: "mobile-money" | "credit-card" | "bank";
  name: string;
  details: string;
  isDefault: boolean;
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PaymentMethodCard({ method, onSetDefault, onRemove }: PaymentMethodCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "mobile-money":
        return <Phone className="h-4 w-4" />;
      case "credit-card":
        return <CreditCard className="h-4 w-4" />;
      case "bank":
        return <Building className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded">
      <div className="flex items-center">
        <div className="mr-3">{getIcon(method.type)}</div>
        <div>
          <div className="font-medium flex items-center">
            {method.name}
            {method.isDefault && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Default
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {method.details}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {!method.isDefault && (
          <Button
            size="icon"
            variant="outline"
            onClick={() => onSetDefault(method.id)}
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="outline"
          onClick={() => onRemove(method.id)}
          className="h-8 w-8 text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
