import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[100px] w-full rounded-xl border border-[hsl(25_10%_45%/0.12)] bg-[hsl(25_10%_45%/0.03)] px-4 py-3 text-sm text-[hsl(25_25%_10%)] outline-none transition-all placeholder:text-[hsl(25_10%_45%)] focus:border-[hsl(24_85%_50%)] focus:bg-white focus:ring-2 focus:ring-[hsl(24_85%_50%/0.15)] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
