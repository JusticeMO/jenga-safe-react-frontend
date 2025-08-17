
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Toggle } from "@/components/ui/toggle";
import { Eye, EyeOff } from "lucide-react";

interface OTPVerificationFormProps {
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
}

export function OTPVerificationForm({
  otp,
  setOtp,
  isLoading,
  onSubmit,
  onBack
}: OTPVerificationFormProps) {
  const [showOTP, setShowOTP] = useState(true);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the verification code sent to your email
        </p>
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="w-full">
          <div className="flex justify-end mb-2">
            <Toggle 
              pressed={showOTP} 
              onPressedChange={setShowOTP}
              aria-label="Toggle OTP visibility"
              className="h-8 w-8 p-0"
            >
              {showOTP ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Toggle>
          </div>
          {showOTP ? (
            <div className="text-center mb-4 bg-gray-100 p-4 rounded-md">
              <p className="text-3xl tracking-widest font-mono">{otp || "------"}</p>
            </div>
          ) : (
            <InputOTP 
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} className="text-lg font-medium" />
                  ))}
                </InputOTPGroup>
              )}
              disabled={isLoading}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
            />
          )}
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((digit, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              className={`h-12 ${digit === null ? "opacity-0 cursor-default" : "font-medium"} ${digit === "del" ? "text-xs" : "text-lg"}`}
              onClick={() => {
                if (digit === "del") {
                  setOtp(otp.slice(0, -1));
                } else if (digit !== null && otp.length < 6) {
                  setOtp(otp + digit);
                }
              }}
              disabled={isLoading || (digit !== "del" && digit !== null && otp.length >= 6)}
            >
              {digit === "del" ? "Delete" : digit}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-2 mb-4">
        For demo: Enter any 6 digits
      </p>

      <div className="text-center">
        <Button 
          variant="link" 
          className="text-[#9b87f5]"
          type="button"
          onClick={onBack}
        >
          Back to login
        </Button>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]" 
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? "Verifying..." : "Verify & Login"}
      </Button>
    </form>
  );
}
