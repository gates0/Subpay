// components/ui/button.tsx
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-body font-semibold",
    "transition-all duration-150 ease-out cursor-pointer select-none whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-[#6C36F5] focus-visible:outline-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      variant: {
        /* Primary — rich violet with glow */
        primary: [
          "bg-[#6C36F5] text-white rounded-xl",
          "shadow-[0_4px_12px_-2px_rgba(108,54,245,0.4)]",
          "hover:bg-[#5B28E8] hover:shadow-[0_6px_16px_-2px_rgba(108,54,245,0.5)]",
          "hover:-translate-y-[1px]",
        ],

        /* Secondary — soft violet tint */
        secondary: [
          "bg-[#F5F3FF] text-[#6C36F5] rounded-xl",
          "border border-[#DDD6FE]",
          "hover:bg-[#EDE9FE] hover:border-[#C4B5FD]",
        ],

        /* Outline — clean border */
        outline: [
          "bg-white text-[#0F0F14] rounded-xl",
          "border-[1.5px] border-[#E5E7EB]",
          "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
          "hover:border-[#D1D5DB] hover:bg-[#F9FAFB]",
          "hover:-translate-y-[0.5px] hover:shadow-[0_2px_6px_0_rgba(0,0,0,0.07)]",
        ],

        /* Ghost — for sidebar & nav items */
        ghost: [
          "bg-transparent text-[#6B7280] rounded-xl",
          "hover:bg-[#F5F3FF] hover:text-[#6C36F5]",
        ],

        /* Danger */
        danger: [
          "bg-[#EF4444] text-white rounded-xl",
          "shadow-[0_4px_12px_-2px_rgba(239,68,68,0.3)]",
          "hover:bg-[#DC2626] hover:-translate-y-[1px]",
        ],

        /* Gradient — for hero CTAs */
        gradient: [
          "text-white rounded-xl",
          "bg-gradient-to-r from-[#6C36F5] via-[#8B5CF6] to-[#A855F7]",
          "shadow-[0_4px_16px_-2px_rgba(108,54,245,0.45)]",
          "hover:shadow-[0_6px_20px_-2px_rgba(108,54,245,0.55)]",
          "hover:-translate-y-[1px]",
          "hover:brightness-105",
        ],

        /* Icon only */
        icon: [
          "bg-white text-[#6B7280] rounded-xl",
          "border border-[#E5E7EB]",
          "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
          "hover:bg-[#F5F3FF] hover:text-[#6C36F5] hover:border-[#DDD6FE]",
        ],
      },

      size: {
        xs:       "text-[11px] px-3 py-1.5 rounded-lg",
        sm:       "text-[13px] px-3.5 py-2 rounded-[10px]",
        md:       "text-[14px] px-4 py-2.5",
        lg:       "text-[15px] px-5 py-3",
        xl:       "text-[16px] px-6 py-3.5",
        icon:     "w-9 h-9 p-0",
        "icon-sm":"w-7 h-7 p-0 rounded-lg",
        "icon-lg":"w-11 h-11 p-0",
      },

      fullWidth: { true: "w-full" },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : leftIcon
      }
      {children}
      {!loading && rightIcon}
    </button>
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }