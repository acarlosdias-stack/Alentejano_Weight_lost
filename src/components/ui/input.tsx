import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, suffix, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="text-label-sm text-on-surface/70 block mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl bg-surface-container-lowest ghost-border text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-label-sm text-on-surface/50">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
