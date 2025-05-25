import React from "react";
import { cn } from "../../../lib/utils";

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const GameButton: React.FC<GameButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = "game-button font-fredoka font-bold rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 flex items-center justify-center";
  
  // Variant styles
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent/50",
    outline: "bg-transparent text-foreground border-2 border-primary hover:bg-primary/10 focus:ring-primary/30",
  };
  
  // Size styles
  const sizeStyles = {
    sm: "text-sm py-2 px-4",
    md: "text-base py-3 px-6",
    lg: "text-lg py-4 px-8",
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default GameButton;
