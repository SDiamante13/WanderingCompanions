import { PetType } from "../types";

// Generate a random integer between min and max (inclusive)
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Pick a random element from an array
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Calculate level based on experience
export const calculateLevel = (experience: number): number => {
  return Math.floor(Math.sqrt(experience) / 5) + 1;
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Calculate health percentage
export const healthPercentage = (current: number, max: number): number => {
  return Math.max(0, Math.min(100, (current / max) * 100));
};

// Get color for health bar
export const healthColor = (percentage: number): string => {
  if (percentage > 60) return "#4CAF50"; // Green
  if (percentage > 30) return "#FFC107"; // Yellow
  return "#F44336"; // Red
};

// Convert pet type to friendly display name
export const petTypeToDisplayName = (type: PetType): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Get random pet color based on pet type
export const getRandomPetColor = (type: PetType): string => {
  const colorMap: Record<PetType, string[]> = {
    [PetType.dog]: ["#A87C5F", "#E0C097", "#333333", "#F5F5DC"],
    [PetType.cat]: ["#F6AD7B", "#5E5E5E", "#E0D8BB", "#FFFFFF"],
    [PetType.rabbit]: ["#FFFFFF", "#E0C097", "#A87C5F", "#888888"],
    [PetType.bird]: ["#F74371", "#4A8FE7", "#FFD166", "#06D6A0"],
    [PetType.frog]: ["#76C043", "#4CAF50", "#8BC34A", "#33691E"],
    [PetType.turtle]: ["#4CAF50", "#8D6E63", "#9E9D24", "#33691E"],
    [PetType.fish]: ["#42A5F5", "#29B6F6", "#FF9800", "#E91E63"],
    [PetType.hamster]: ["#D7B49E", "#B38867", "#FFCC80", "#BCAAA4"],
  };
  
  const colors = colorMap[type] || ["#4FC3F7"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Save game data to localStorage
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Load game data from localStorage
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
};

// Generate a human-readable ID
export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Calculate damage with randomness
export const calculateDamage = (
  attackerAttack: number,
  defenderDefense: number,
  multiplier: number = 1
): number => {
  // Base damage formula
  let baseDamage = Math.max(1, attackerAttack - defenderDefense / 2);
  
  // Apply multiplier
  baseDamage *= multiplier;
  
  // Add some randomness (±20%)
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  
  // Return final damage as integer
  return Math.floor(baseDamage * randomFactor);
};
