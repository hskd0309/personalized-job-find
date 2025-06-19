import * as React from "react"
import { cn } from "@/lib/utils"

export interface ReactiveInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const ReactiveInput = React.forwardRef<HTMLInputElement, ReactiveInputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-zinc-200">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-zinc-600 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
ReactiveInput.displayName = "ReactiveInput"

export { ReactiveInput }