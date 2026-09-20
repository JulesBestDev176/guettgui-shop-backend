"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark",
        outline: "border-2 border-brand bg-transparent text-brand hover:bg-brand-soft",
        ghost: "text-ink hover:bg-page",
        white: "bg-white text-brand shadow-sm hover:bg-gray-50",
        soft: "bg-brand-soft text-brand-dark hover:bg-green-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
