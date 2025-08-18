import { cva } from "class-variance-authority";

export const sidebarVariants = cva(
  "h-full",
  {
    variants: {
      variant: {
        default: "bg-gray-800 text-white",
        light: "bg-gray-100 text-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
