import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, hover = true, className, ...props }, ref) => {
    // Filter out props that conflict with Framer Motion
    const { onAnimationStart, onDragStart, onDrag, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDrop, ...safeProps } = props;
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass-card rounded-2xl p-6 glass-glow",
          hover && "glass-card-hover glass-glow-hover",
          "noise-texture",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={hover ? {
          y: -4,
          transition: { duration: 0.2 }
        } : undefined}
        {...safeProps}
      >
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
