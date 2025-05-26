import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GamePhase, TownLocation, GameSaveData } from "../types";

interface GameState {
  gamePhase: GamePhase;
  currentLocation: TownLocation;
  unlockedLocations: TownLocation[];
  completedBattles: number;
  totalBattles: number;
  showInventory: boolean;
  showDialog: boolean;
  showShop: boolean;
  dialogContent: {
    title: string;
    message: string;
    onClose?: () => void;
  };
  
  // Game actions
  setGamePhase: (phase: GamePhase) => void;
  setLocation: (location: TownLocation) => void;
  unlockLocation: (location: TownLocation) => void;
  incrementCompletedBattles: () => void;
  setTotalBattles: (count: number) => void;
  toggleInventory: () => void;
  
  // Dialog actions
  showDialogMessage: (title: string, message: string, onClose?: () => void) => void;
  closeDialog: () => void;
  
  // Shop actions
  openShop: () => void;
  closeShop: () => void;
  
  // Game save/load
  saveGame: () => GameSaveData;
  loadGame: (data: GameSaveData) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gamePhase: GamePhase.welcome,
      currentLocation: TownLocation.center,
      unlockedLocations: [TownLocation.center, TownLocation.home, TownLocation.shop],
      completedBattles: 0,
      totalBattles: 10,
      showInventory: false,
      showDialog: false,
      showShop: false,
      dialogContent: {
        title: "",
        message: "",
      },
      
      // Game phase management
      setGamePhase: (phase) => set({ gamePhase: phase }),
      
      // Location management
      setLocation: (location) => set({ currentLocation: location }),
      unlockLocation: (location) => {
        const { unlockedLocations } = get();
        if (!unlockedLocations.includes(location)) {
          set({ unlockedLocations: [...unlockedLocations, location] });
        }
      },
      
      // Battle tracking
      incrementCompletedBattles: () => {
        const { completedBattles } = get();
        set({ completedBattles: completedBattles + 1 });
      },
      setTotalBattles: (count) => set({ totalBattles: count }),
      
      // Inventory management
      toggleInventory: () => {
        const { showInventory } = get();
        set({ showInventory: !showInventory });
      },
      
      // Dialog management
      showDialogMessage: (title, message, onClose) => {
        set({
          showDialog: true,
          dialogContent: {
            title,
            message,
            onClose,
          },
        });
      },
      closeDialog: () => {
        const { dialogContent } = get();
        set({ showDialog: false });
        if (dialogContent.onClose) {
          dialogContent.onClose();
        }
      },
      
      // Shop management
      openShop: () => set({ showShop: true }),
      closeShop: () => set({ showShop: false }),
      
      // Game save/load
      saveGame: () => {
        const { unlockedLocations, completedBattles } = get();
        // Import data from other stores when needed
        return {
          player: { /* player data from player store */ },
          pet: { /* pet data from pet store */ },
          gameProgress: {
            unlockedLocations,
            completedBattles,
          },
          settings: {
            musicVolume: 0.5,
            soundVolume: 0.5,
          },
        } as GameSaveData;
      },
      loadGame: (data) => {
        // Set game progress data
        set({
          unlockedLocations: data.gameProgress.unlockedLocations,
          completedBattles: data.gameProgress.completedBattles,
          gamePhase: GamePhase.town,
        });
        // Other stores should load their data from here as well
      },
      resetGame: () => {
        set({
          gamePhase: GamePhase.welcome,
          currentLocation: TownLocation.center,
          unlockedLocations: [TownLocation.center, TownLocation.home, TownLocation.shop],
          completedBattles: 0,
          totalBattles: 10,
          showInventory: false,
          showDialog: false,
          showShop: false,
          dialogContent: { title: "", message: "" },
        });
      },
    }),
    {
      name: "pet-adventure-game",
      partialize: (state) => ({
        unlockedLocations: state.unlockedLocations,
        completedBattles: state.completedBattles,
        totalBattles: state.totalBattles,
      }),
    },
  ),
);
