import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pet, PetType, SpecialAbility } from "../types";
import { PET_OPTIONS } from "../constants";

interface PetState {
  // Pet data
  pet: Pet | null;
  
  // Pet actions
  assignRandomPet: () => void;
  setPet: (petType: PetType, name: string, color: string) => void;
  setPetName: (name: string) => void;
  updatePetHealth: (amount: number) => void;
  updatePetHappiness: (amount: number) => void;
  updatePetStats: (stat: string, amount: number) => void;
  useSpecialAbility: () => void;
  decreaseCooldowns: () => void;
  
  // Save/load
  resetPet: () => void;
  loadPet: (data: Pet) => void;
}

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pet: null,
      
      // Generate and assign a random pet
      assignRandomPet: () => {
        const randomIndex = Math.floor(Math.random() * PET_OPTIONS.length);
        const petTemplate = PET_OPTIONS[randomIndex];
        const randomColorIndex = Math.floor(Math.random() * petTemplate.colors.length);
        
        const newPet: Pet = {
          type: petTemplate.type,
          name: petTemplate.name,
          color: petTemplate.colors[randomColorIndex],
          health: petTemplate.baseStats.health,
          maxHealth: petTemplate.baseStats.health,
          attack: petTemplate.baseStats.attack,
          defense: petTemplate.baseStats.defense,
          happiness: petTemplate.baseStats.happiness,
          specialAbility: { ...petTemplate.specialAbility },
        };
        
        set({ pet: newPet });
      },
      
      // Set pet with specific parameters
      setPet: (petType, name, color) => {
        const petTemplate = PET_OPTIONS.find(p => p.type === petType);
        
        if (petTemplate) {
          const newPet: Pet = {
            type: petType,
            name: name || petTemplate.name,
            color: color || petTemplate.colors[0],
            health: petTemplate.baseStats.health,
            maxHealth: petTemplate.baseStats.health,
            attack: petTemplate.baseStats.attack,
            defense: petTemplate.baseStats.defense,
            happiness: petTemplate.baseStats.happiness,
            specialAbility: { ...petTemplate.specialAbility },
          };
          
          set({ pet: newPet });
        }
      },
      
      // Update pet name
      setPetName: (name) => set((state) => {
        if (!state.pet) return state;
        return { pet: { ...state.pet, name } };
      }),
      
      // Update pet health with bounds checking
      updatePetHealth: (amount) => set((state) => {
        if (!state.pet) return state;
        
        const newHealth = Math.min(
          state.pet.maxHealth,
          Math.max(0, state.pet.health + amount)
        );
        
        return { pet: { ...state.pet, health: newHealth } };
      }),
      
      // Update pet happiness with bounds checking
      updatePetHappiness: (amount) => set((state) => {
        if (!state.pet) return state;
        
        const newHappiness = Math.min(
          100,
          Math.max(0, state.pet.happiness + amount)
        );
        
        return { pet: { ...state.pet, happiness: newHappiness } };
      }),
      
      // Update any pet stat
      updatePetStats: (stat, amount) => set((state) => {
        if (!state.pet || !(stat in state.pet)) return state;
        
        return {
          pet: {
            ...state.pet,
            [stat]: (state.pet as any)[stat] + amount,
          }
        };
      }),
      
      // Use pet's special ability if not on cooldown
      useSpecialAbility: () => set((state) => {
        if (!state.pet) return state;
        
        const { specialAbility } = state.pet;
        
        if (specialAbility.currentCooldown === 0) {
          // Set the cooldown
          const updatedAbility: SpecialAbility = {
            ...specialAbility,
            currentCooldown: specialAbility.cooldown,
          };
          
          return { pet: { ...state.pet, specialAbility: updatedAbility } };
        }
        
        return state;
      }),
      
      // Decrease cooldowns for abilities
      decreaseCooldowns: () => set((state) => {
        if (!state.pet) return state;
        
        const { specialAbility } = state.pet;
        
        if (specialAbility.currentCooldown > 0) {
          const updatedAbility: SpecialAbility = {
            ...specialAbility,
            currentCooldown: specialAbility.currentCooldown - 1,
          };
          
          return { pet: { ...state.pet, specialAbility: updatedAbility } };
        }
        
        return state;
      }),
      
      // Reset pet to null
      resetPet: () => set({ pet: null }),
      
      // Load pet data
      loadPet: (data) => set({ pet: data }),
    }),
    {
      name: "pet-adventure-pet",
    }
  )
);
