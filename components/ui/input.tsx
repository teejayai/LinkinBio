import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[hsl(25_10%_45%/0.12)] bg-[hsl(25_10%_45%/0.03)] px-4 py-2.5 text-sm text-[hsl(25_25%_10%)] outline-none transition-all placeholder:text-[hsl(25_10%_45%)] focus:border-[hsl(24_85%_50%)] focus:bg-white focus:ring-2 focus:ring-[hsl(24_85%_50%/0.15)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";
