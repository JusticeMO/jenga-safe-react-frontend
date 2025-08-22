import { cva } from "class-variance-authority";

export const sonnerVariants = cva(
  "toaster group",
  {
    variants: {
      variant: {
        default:
          "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        destructive:
          "group toast group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
