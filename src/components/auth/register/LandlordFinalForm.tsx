
import { Button } from "@/components/ui/button";

interface LandlordFinalFormProps {
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LandlordFinalForm = ({ onBack, onSubmit, isLoading }: LandlordFinalFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Property Owner Information</h3>
        <div className="text-sm text-muted-foreground mb-4">
          <p>After registration, your account will be created immediately. You can start adding your properties to the platform once verified.</p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </div>
    </div>
  );
};

export default LandlordFinalForm;
