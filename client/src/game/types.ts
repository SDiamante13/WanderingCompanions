// Game enums
export enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
  interact = "interact",
  inventory = "inventory",
}

export enum GamePhase {
  welcome = "welcome",
  age_verification = "age_verification",
  character_creation = "character_creation",
  pet_assignment = "pet_assignment",
  town = "town",
  battle = "battle",
}

export enum TownLocation {
  center = "center",
  home = "home",
  shop = "shop",
  school = "school",
  park = "park",
  adventure = "adventure",
}

export enum PetType {
  dog = "dog",
  cat = "cat",
  rabbit = "rabbit",
  bird = "bird",
  frog = "frog",
  turtle = "turtle",
  fish = "fish",
  hamster = "hamster",
}

export enum BattleState {
  start = "start",
  playerTurn = "playerTurn",
  petTurn = "petTurn",
  enemyTurn = "enemyTurn",
  win = "win",
  lose = "lose",
}

// Game interfaces
export interface PlayerCharacter {
  name: string;
  age: number;
  color: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  inventory: InventoryItem[];
  coins: number;
}

export interface Pet {
  type: PetType;
  name: string;
  color: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  happiness: number;
  specialAbility: SpecialAbility;
}

export interface Enemy {
  id: string;
  name: string;
  type: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  coins: number;
  experience: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: "food" | "toy" | "medicine" | "accessory";
  effect: {
    target: "player" | "pet";
    property: string;
    value: number;
  };
  price: number;
  quantity: number;
}

export interface SpecialAbility {
  name: string;
  description: string;
  effect: {
    target: "enemy" | "self" | "player";
    property: string;
    value: number;
  };
  cooldown: number;
  currentCooldown: number;
}

export interface BattleAction {
  name: string;
  description: string;
  damageMultiplier: number;
  effect?: {
    target: "enemy" | "self" | "player" | "pet";
    property: string;
    value: number;
  };
}

export interface GameSaveData {
  player: PlayerCharacter;
  pet: Pet;
  gameProgress: {
    unlockedLocations: TownLocation[];
    completedBattles: number;
  };
  settings: {
    musicVolume: number;
    soundVolume: number;
  };
}
