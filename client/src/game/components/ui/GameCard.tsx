import React from "react";
import { cn } from "../../../lib/utils";

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "accent";
  hoverable?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  children,
  className,
  variant = "default",
  hoverable = false,
}) => {
  // Base styles
  const baseStyles = "game-card rounded-2xl shadow-lg overflow-hidden";
  
  // Variant styles
  const variantStyles = {
    default: "bg-white border-4 border-primary",
    outline: "bg-white border-4 border-gray-200",
    secondary: "bg-white border-4 border-secondary",
    accent: "bg-white border-4 border-accent",
  };
  
  // Hover effect
  const hoverStyles = hoverable ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1" : "";
  
  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        className
      )}
    >
      {children}
    </div>
  );
};

// Card subcomponents
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "accent" | "default";
}

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  color = "default",
}) => {
  const colorStyles = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    accent: "bg-accent text-white",
    default: "bg-gray-100 text-foreground",
  };
  
  return (
    <div
      className={cn(
        "p-4 font-fredoka font-bold text-lg",
        colorStyles[color],
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("p-4 border-t border-gray-100", className)}>
      {children}
    </div>
  );
};

// Export the card and its parts
GameCard.Header = CardHeader;
GameCard.Content = CardContent;
GameCard.Footer = CardFooter;

export default GameCard;
