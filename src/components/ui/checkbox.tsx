import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Radix kullanmayan, native <input type="checkbox"> tabanlı checkbox.
 * (Form için native select tercihiyle aynı gerekçe: deterministik hydration
 * ve mobilde yerel davranış. Radix Checkbox HMR sonrası useId uyumsuzluğu
 * doğurabildiğinden burada native yaklaşımda kalınır.)
 */

type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"input">, "type">;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex items-center">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "peer size-5 shrink-0 cursor-pointer appearance-none rounded border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none",
          "checked:border-primary checked:bg-primary",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          className
        )}
        {...props}
      />
      {/* İşaretli durumdaki onay işareti */}
      <Check
        className="pointer-events-none absolute left-0.5 size-4 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
        aria-hidden="true"
      />
    </span>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
