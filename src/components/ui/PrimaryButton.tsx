import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, variant = "primary", size = "md", className, ...props }, ref) => {
    // Filter out props that conflict with Framer Motion
    const { onAnimationStart, onDragStart, onDrag, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDrop, ...safeProps } = props;
    const baseClasses = "font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:ring-offset-0 relative overflow-hidden";
    
    const variants = {
      primary: "primary-button text-white px-6 py-3 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      outline: "glass-button text-white px-6 py-3 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      ghost: "bg-transparent text-white px-6 py-3 rounded-full hover:bg-white/5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: variant === "primary" ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...safeProps}
      >
        <span className="relative z-10 flex items-center justify-center">
          {children}
        </span>
      </motion.button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";
