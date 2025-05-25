import React from "react";
import { cn } from "../../../lib/utils";

interface GameTextProps {
  children: React.ReactNode;
  variant?: "title" | "subtitle" | "heading" | "body" | "caption";
  color?: "primary" | "secondary" | "accent" | "foreground" | "muted";
  align?: "left" | "center" | "right";
  className?: string;
  comic?: boolean;
}

const GameText: React.FC<GameTextProps> = ({
  children,
  variant = "body",
  color = "foreground",
  align = "left",
  className,
  comic = false,
}) => {
  // Font family
  const fontFamily = comic ? "font-comic" : "font-fredoka";
  
  // Variant styles
  const variantStyles = {
    title: "text-4xl font-bold",
    subtitle: "text-2xl font-bold",
    heading: "text-xl font-bold",
    body: "text-base",
    caption: "text-sm",
  };
  
  // Color styles
  const colorStyles = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    foreground: "text-foreground",
    muted: "text-muted-foreground",
  };
  
  // Text alignment
  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  
  // Determine which element to render based on variant
  const Component = 
    variant === "title" ? "h1" :
    variant === "subtitle" ? "h2" :
    variant === "heading" ? "h3" :
    variant === "caption" ? "p" :
    "p";
  
  return React.createElement(
    Component,
    {
      className: cn(
        fontFamily,
        variantStyles[variant],
        colorStyles[color],
        alignStyles[align],
        className
      ),
    },
    children
  );
};

export default GameText;
