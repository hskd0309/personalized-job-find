import * as React from "react"
import { cn } from "@/lib/utils"

const ReactiveCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-zinc-900/50 backdrop-blur-sm text-zinc-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105",
      className
    )}
    {...props}
  />
))
ReactiveCard.displayName = "ReactiveCard"

const ReactiveCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
ReactiveCardHeader.displayName = "ReactiveCardHeader"

const ReactiveCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-zinc-100",
      className
    )}
    {...props}
  />
))
ReactiveCardTitle.displayName = "ReactiveCardTitle"

const ReactiveCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-zinc-300", className)}
    {...props}
  />
))
ReactiveCardDescription.displayName = "ReactiveCardDescription"

const ReactiveCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
ReactiveCardContent.displayName = "ReactiveCardContent"

const ReactiveCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
ReactiveCardFooter.displayName = "ReactiveCardFooter"

export { ReactiveCard, ReactiveCardHeader, ReactiveCardFooter, ReactiveCardTitle, ReactiveCardDescription, ReactiveCardContent }