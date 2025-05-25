import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InventoryItem, PlayerCharacter } from "../types";

interface PlayerState {
  // Player data
  player: PlayerCharacter;
  
  // Player actions
  setPlayerName: (name: string) => void;
  setPlayerAge: (age: number) => void;
  setPlayerColor: (color: string) => void;
  updatePlayerHealth: (amount: number) => void;
  updatePlayerStats: (stat: string, amount: number) => void;
  
  // Inventory actions
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  updateCoins: (amount: number) => void;
  
  // Save/load
  resetPlayer: () => void;
  loadPlayer: (data: PlayerCharacter) => void;
}

const DEFAULT_PLAYER: PlayerCharacter = {
  name: "",
  age: 0,
  color: "#4FC3F7",
  health: 100,
  maxHealth: 100,
  attack: 10,
  defense: 5,
  inventory: [],
  coins: 20,
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial player data
      player: { ...DEFAULT_PLAYER },
      
      // Player data management
      setPlayerName: (name) => set((state) => ({
        player: { ...state.player, name }
      })),
      
      setPlayerAge: (age) => set((state) => ({
        player: { ...state.player, age }
      })),
      
      setPlayerColor: (color) => set((state) => ({
        player: { ...state.player, color }
      })),
      
      updatePlayerHealth: (amount) => set((state) => {
        const newHealth = Math.min(
          state.player.maxHealth,
          Math.max(0, state.player.health + amount)
        );
        return {
          player: { ...state.player, health: newHealth }
        };
      }),
      
      updatePlayerStats: (stat, amount) => set((state) => {
        if (stat in state.player) {
          return {
            player: {
              ...state.player,
              [stat]: (state.player as any)[stat] + amount,
            }
          };
        }
        return state;
      }),
      
      // Inventory management
      addItem: (item) => set((state) => {
        const existingItemIndex = state.player.inventory.findIndex(i => i.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          const updatedInventory = [...state.player.inventory];
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + item.quantity
          };
          
          return {
            player: { ...state.player, inventory: updatedInventory }
          };
        } else {
          // Add new item
          return {
            player: {
              ...state.player,
              inventory: [...state.player.inventory, item]
            }
          };
        }
      }),
      
      removeItem: (itemId) => set((state) => {
        const itemIndex = state.player.inventory.findIndex(i => i.id === itemId);
        
        if (itemIndex >= 0) {
          const item = state.player.inventory[itemIndex];
          
          if (item.quantity > 1) {
            // Decrease quantity
            const updatedInventory = [...state.player.inventory];
            updatedInventory[itemIndex] = {
              ...item,
              quantity: item.quantity - 1
            };
            
            return {
              player: { ...state.player, inventory: updatedInventory }
            };
          } else {
            // Remove item completely
            return {
              player: {
                ...state.player,
                inventory: state.player.inventory.filter(i => i.id !== itemId)
              }
            };
          }
        }
        
        return state;
      }),
      
      useItem: (itemId) => {
        const { player } = get();
        const item = player.inventory.find(i => i.id === itemId);
        
        if (item) {
          // Apply item effect based on target
          if (item.effect.target === "player") {
            get().updatePlayerStats(item.effect.property, item.effect.value);
          }
          // If target is pet, this would be handled by the pet store
          
          // Remove one of the item
          get().removeItem(itemId);
        }
      },
      
      updateCoins: (amount) => set((state) => ({
        player: { ...state.player, coins: Math.max(0, state.player.coins + amount) }
      })),
      
      // Save/load
      resetPlayer: () => set({ player: { ...DEFAULT_PLAYER } }),
      
      loadPlayer: (data) => set({ player: data }),
    }),
    {
      name: "pet-adventure-player",
    }
  )
);
