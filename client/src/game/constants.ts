import { PetType, BattleAction, TownLocation } from "./types";

// Game constants
export const MIN_AGE = 7; // Minimum age to play the game
export const MAX_AGE = 99;

// Pet options
export const PET_OPTIONS = [
  {
    type: PetType.dog,
    name: "Doggy",
    description: "Loyal and friendly, dogs are great companions for adventures!",
    baseStats: { health: 50, attack: 15, defense: 10, happiness: 90 },
    specialAbility: {
      name: "Loyal Bark",
      description: "Increases your defense for 3 turns",
      effect: { target: "player", property: "defense", value: 5 },
      cooldown: 3,
      currentCooldown: 0,
    },
    colors: ["#A87C5F", "#E0C097", "#333333", "#F5F5DC"],
  },
  {
    type: PetType.cat,
    name: "Kitty",
    description: "Clever and agile, cats can find hidden treasures!",
    baseStats: { health: 40, attack: 20, defense: 5, happiness: 80 },
    specialAbility: {
      name: "Sharp Claws",
      description: "A powerful attack that deals extra damage",
      effect: { target: "enemy", property: "health", value: -15 },
      cooldown: 2,
      currentCooldown: 0,
    },
    colors: ["#F6AD7B", "#5E5E5E", "#E0D8BB", "#FFFFFF"],
  },
  {
    type: PetType.rabbit,
    name: "Bunny",
    description: "Fast and cute, rabbits can help you escape danger!",
    baseStats: { health: 30, attack: 10, defense: 5, happiness: 95 },
    specialAbility: {
      name: "Quick Hop",
      description: "Avoids the next enemy attack",
      effect: { target: "self", property: "evasion", value: 100 },
      cooldown: 4,
      currentCooldown: 0,
    },
    colors: ["#FFFFFF", "#E0C097", "#A87C5F", "#888888"],
  },
  {
    type: PetType.bird,
    name: "Birdie",
    description: "Colorful and musical, birds bring joy to everyone!",
    baseStats: { health: 25, attack: 15, defense: 5, happiness: 90 },
    specialAbility: {
      name: "Melodic Song",
      description: "Heals both you and your pet",
      effect: { target: "player", property: "health", value: 10 },
      cooldown: 3,
      currentCooldown: 0,
    },
    colors: ["#F74371", "#4A8FE7", "#FFD166", "#06D6A0"],
  },
  {
    type: PetType.frog,
    name: "Froggy",
    description: "Jumpy and fun, frogs can find water sources!",
    baseStats: { health: 30, attack: 12, defense: 8, happiness: 85 },
    specialAbility: {
      name: "Sticky Tongue",
      description: "Steals an item from the enemy",
      effect: { target: "enemy", property: "stun", value: 1 },
      cooldown: 4,
      currentCooldown: 0,
    },
    colors: ["#76C043", "#4CAF50", "#8BC34A", "#33691E"],
  },
  {
    type: PetType.turtle,
    name: "Shelly",
    description: "Slow but steady, turtles have great defense!",
    baseStats: { health: 60, attack: 8, defense: 20, happiness: 75 },
    specialAbility: {
      name: "Shell Shield",
      description: "Greatly reduces damage for one turn",
      effect: { target: "self", property: "defense", value: 15 },
      cooldown: 4,
      currentCooldown: 0,
    },
    colors: ["#4CAF50", "#8D6E63", "#9E9D24", "#33691E"],
  },
  {
    type: PetType.fish,
    name: "Bubbles",
    description: "Shiny and peaceful, fish can swim through any water!",
    baseStats: { health: 20, attack: 10, defense: 5, happiness: 80 },
    specialAbility: {
      name: "Water Splash",
      description: "Confuses the enemy, reducing their accuracy",
      effect: { target: "enemy", property: "accuracy", value: -30 },
      cooldown: 3,
      currentCooldown: 0,
    },
    colors: ["#42A5F5", "#29B6F6", "#FF9800", "#E91E63"],
  },
  {
    type: PetType.hamster,
    name: "Hammy",
    description: "Tiny and energetic, hamsters can store items for you!",
    baseStats: { health: 25, attack: 12, defense: 6, happiness: 95 },
    specialAbility: {
      name: "Cheek Pouch",
      description: "Finds a random helpful item",
      effect: { target: "player", property: "itemFind", value: 1 },
      cooldown: 5,
      currentCooldown: 0,
    },
    colors: ["#D7B49E", "#B38867", "#FFCC80", "#BCAAA4"],
  },
];

// Battle actions
export const BATTLE_ACTIONS: BattleAction[] = [
  {
    name: "Attack",
    description: "A basic attack that deals normal damage",
    damageMultiplier: 1,
  },
  {
    name: "Defend",
    description: "Increase defense for one turn",
    damageMultiplier: 0,
    effect: {
      target: "self",
      property: "defense",
      value: 5,
    },
  },
  {
    name: "Special Attack",
    description: "A powerful attack that deals more damage",
    damageMultiplier: 1.5,
  },
  {
    name: "Heal",
    description: "Recover some health points",
    damageMultiplier: 0,
    effect: {
      target: "self",
      property: "health",
      value: 10,
    },
  },
];

// Enemy types
export const ENEMY_TYPES = [
  {
    name: "Wild Cat",
    baseStats: { health: 30, attack: 10, defense: 5 },
    levels: {
      1: { multiplier: 1, coins: 5, experience: 10 },
      2: { multiplier: 1.2, coins: 8, experience: 15 },
      3: { multiplier: 1.5, coins: 12, experience: 20 },
    },
  },
  {
    name: "Angry Bird",
    baseStats: { health: 25, attack: 12, defense: 3 },
    levels: {
      1: { multiplier: 1, coins: 4, experience: 8 },
      2: { multiplier: 1.2, coins: 7, experience: 12 },
      3: { multiplier: 1.5, coins: 10, experience: 18 },
    },
  },
  {
    name: "Mischievous Monkey",
    baseStats: { health: 35, attack: 8, defense: 8 },
    levels: {
      1: { multiplier: 1, coins: 6, experience: 12 },
      2: { multiplier: 1.2, coins: 10, experience: 18 },
      3: { multiplier: 1.5, coins: 15, experience: 25 },
    },
  },
  {
    name: "Sneaky Snake",
    baseStats: { health: 20, attack: 15, defense: 4 },
    levels: {
      1: { multiplier: 1, coins: 7, experience: 14 },
      2: { multiplier: 1.2, coins: 12, experience: 20 },
      3: { multiplier: 1.5, coins: 18, experience: 30 },
    },
  },
];

// Town locations
export const TOWN_LOCATIONS = [
  {
    id: TownLocation.center,
    name: "Town Center",
    description: "The central area of the town where everyone gathers.",
    coordinates: [0, 0, 0] as [number, number, number],
    unlocked: true,
  },
  {
    id: TownLocation.home,
    name: "Home",
    description: "Your cozy home where you can rest and play with your pet.",
    coordinates: [10, 0, 5] as [number, number, number],
    unlocked: true,
  },
  {
    id: TownLocation.shop,
    name: "Pet Shop",
    description: "A shop that sells pet food, toys, and other items.",
    coordinates: [-10, 0, 5] as [number, number, number],
    unlocked: true,
  },
  {
    id: TownLocation.school,
    name: "School",
    description: "Learn new skills and tricks for you and your pet.",
    coordinates: [0, 0, -15],
    unlocked: true,
  },
  {
    id: TownLocation.park,
    name: "Park",
    description: "A fun place to play and encounter wild animals.",
    coordinates: [15, 0, -10],
    unlocked: true,
  },
];

// Shop items
export const SHOP_ITEMS: Record<string, InventoryItem[]> = {
  food: [
    {
      id: "food_1",
      name: "Basic Pet Food",
      description: "Standard food that slightly restores your pet's health.",
      type: "food",
      effect: { target: "pet", property: "health", value: 10 },
      price: 5,
      quantity: 1,
    },
    {
      id: "food_2",
      name: "Premium Pet Food",
      description: "High quality food that restores more of your pet's health.",
      type: "food",
      effect: { target: "pet", property: "health", value: 25 },
      price: 15,
      quantity: 1,
    },
    {
      id: "food_3",
      name: "Tasty Treat",
      description: "A delicious treat that makes your pet happier.",
      type: "food",
      effect: { target: "pet", property: "happiness", value: 10 },
      price: 8,
      quantity: 1,
    },
  ],
  toys: [
    {
      id: "toy_1",
      name: "Bouncy Ball",
      description: "A fun ball that increases your pet's happiness.",
      type: "toy",
      effect: { target: "pet", property: "happiness", value: 15 },
      price: 10,
      quantity: 1,
    },
    {
      id: "toy_2",
      name: "Plush Toy",
      description: "A soft toy that greatly increases your pet's happiness.",
      type: "toy",
      effect: { target: "pet", property: "happiness", value: 25 },
      price: 20,
      quantity: 1,
    },
  ],
  medicine: [
    {
      id: "med_1",
      name: "Basic Medicine",
      description: "Medicine that restores some health.",
      type: "medicine",
      effect: { target: "player", property: "health", value: 15 },
      price: 12,
      quantity: 1,
    },
    {
      id: "med_2",
      name: "Advanced Medicine",
      description: "Strong medicine that restores a lot of health.",
      type: "medicine",
      effect: { target: "player", property: "health", value: 30 },
      price: 25,
      quantity: 1,
    },
  ],
  accessories: [
    {
      id: "acc_1",
      name: "Pet Collar",
      description: "A stylish collar that increases your pet's defense.",
      type: "accessory",
      effect: { target: "pet", property: "defense", value: 5 },
      price: 30,
      quantity: 1,
    },
    {
      id: "acc_2",
      name: "Friendship Bracelet",
      description: "A bracelet that increases your attack power.",
      type: "accessory",
      effect: { target: "player", property: "attack", value: 5 },
      price: 35,
      quantity: 1,
    },
  ],
};
