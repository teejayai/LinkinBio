import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[hsl(35_20%_93%)] text-[hsl(25_25%_10%)]",
        primary: "bg-[hsl(24_85%_50%/0.15)] text-[hsl(24_85%_35%)]",
        outline: "border border-[hsl(25_10%_45%/0.2)] text-[hsl(25_10%_45%)]",
        success: "bg-[hsl(150_60%_45%/0.15)] text-[hsl(150_60%_35%)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
