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
  showSchool: boolean;
  showHome: boolean;
  showPark: boolean;
  showAdventure: boolean;
  currentSubLocation: string | null;
  navigationMode: '2d' | '3d';
  dialogContent: {
    title: string;
    message: string;
    onClose?: () => void;
  };
  
  // Helper to close all locations
  closeAllLocations: () => void;
  
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
  
  // School actions
  openSchool: () => void;
  closeSchool: () => void;
  
  // Home actions
  openHome: () => void;
  closeHome: () => void;
  setSubLocation: (subLocation: string | null) => void;
  
  // Park actions
  openPark: () => void;
  closePark: () => void;
  
  // Adventure actions
  openAdventure: () => void;
  closeAdventure: () => void;
  
  // Navigation actions
  setNavigationMode: (mode: '2d' | '3d') => void;
  toggle2D3D: () => void;
  
  // Game save/load
  saveGame: () => GameSaveData;
  loadGame: (data: GameSaveData) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gamePhase: GamePhase.town,
      currentLocation: TownLocation.center,
      unlockedLocations: [TownLocation.center, TownLocation.home, TownLocation.shop, TownLocation.school, TownLocation.park, TownLocation.adventure],
      completedBattles: 0,
      totalBattles: 10,
      showInventory: false,
      showDialog: false,
      showShop: false,
      showSchool: false,
      showHome: false,
      showPark: false,
      showAdventure: false,
      currentSubLocation: null,
      navigationMode: '2d',
      dialogContent: {
        title: "",
        message: "",
      },
      
      // Helper to close all locations
      closeAllLocations: () => set({
        showShop: false,
        showSchool: false,
        showHome: false,
        showPark: false,
        showAdventure: false,
        currentSubLocation: null
      }),
      
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
      openShop: () => set({
        showShop: true,
        showSchool: false,
        showHome: false,
        showPark: false,
        showAdventure: false,
        currentSubLocation: null
      }),
      closeShop: () => set({ showShop: false }),
      
      // School management
      openSchool: () => set({
        showSchool: true,
        showShop: false,
        showHome: false,
        showPark: false,
        showAdventure: false,
        currentSubLocation: null
      }),
      closeSchool: () => set({ showSchool: false }),
      
      // Home management
      openHome: () => set({
        showHome: true,
        showShop: false,
        showSchool: false,
        showPark: false,
        showAdventure: false,
        currentSubLocation: null
      }),
      closeHome: () => set({ showHome: false, currentSubLocation: null }),
      setSubLocation: (subLocation) => set({ currentSubLocation: subLocation }),
      
      // Park management
      openPark: () => set({
        showPark: true,
        showShop: false,
        showSchool: false,
        showHome: false,
        showAdventure: false,
        currentSubLocation: null
      }),
      closePark: () => set({ showPark: false, currentSubLocation: null }),
      
      // Adventure management
      openAdventure: () => set({
        showAdventure: true,
        showShop: false,
        showSchool: false,
        showHome: false,
        showPark: false,
        currentSubLocation: null
      }),
      closeAdventure: () => set({ showAdventure: false, currentSubLocation: null }),
      
      // Navigation management
      setNavigationMode: (mode) => set({ navigationMode: mode }),
      toggle2D3D: () => set((state) => ({ 
        navigationMode: state.navigationMode === '2d' ? '3d' : '2d' 
      })),
      
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
        get().closeAllLocations();
        set({
          gamePhase: GamePhase.welcome,
          currentLocation: TownLocation.center,
          unlockedLocations: [TownLocation.center, TownLocation.home, TownLocation.shop, TownLocation.school, TownLocation.park, TownLocation.adventure],
          completedBattles: 0,
          totalBattles: 10,
          showInventory: false,
          showDialog: false,
          navigationMode: '2d',
          dialogContent: { title: "", message: "" },
        });
      },
    }),
    {
      name: "adventure-pets-game",
      partialize: (state) => ({
        unlockedLocations: state.unlockedLocations,
        completedBattles: state.completedBattles,
        totalBattles: state.totalBattles,
      }),
    },
  ),
);
