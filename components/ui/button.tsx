"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[hsl(24_85%_42%)] text-[hsl(30_15%_97%)] hover:bg-[hsl(24_85%_35%)] active:scale-[0.98]",
        secondary: "bg-[hsl(35_20%_93%)] text-[hsl(25_25%_10%)] hover:bg-[hsl(35_20%_88%)]",
        outline: "border-2 border-[hsl(25_10%_45%/0.15)] bg-transparent hover:bg-[hsl(25_10%_45%/0.05)] hover:border-[hsl(24_85%_50%/0.4)]",
        ghost: "hover:bg-[hsl(25_10%_45%/0.08)]"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-6",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
