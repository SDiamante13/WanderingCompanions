import { create } from "zustand";
import { BattleState, Enemy, BattleAction } from "../types";
import { ENEMY_TYPES, BATTLE_ACTIONS } from "../constants";
import { usePlayerStore } from "./usePlayerStore";
import { usePetStore } from "./usePetStore";
import { useGameStore } from "./useGameStore";
import { useAudio } from "../../lib/stores/useAudio";

interface BattleStoreState {
  // Battle state
  battleState: BattleState;
  enemy: Enemy | null;
  availableActions: BattleAction[];
  battleLog: string[];
  turnCount: number;
  
  // Battle actions
  startBattle: (enemyType?: string, level?: number) => void;
  endBattle: (playerWon: boolean) => void;
  performPlayerAction: (actionIndex: number) => void;
  performPetAction: () => void;
  performEnemyAction: () => void;
  addToBattleLog: (message: string) => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleStoreState>((set, get) => ({
  battleState: BattleState.start,
  enemy: null,
  availableActions: BATTLE_ACTIONS,
  battleLog: [],
  turnCount: 0,
  
  startBattle: (enemyType, level = 1) => {
    // Determine which enemy type to use
    let enemyTemplate;
    if (enemyType) {
      enemyTemplate = ENEMY_TYPES.find(e => e.name === enemyType);
    } else {
      // Pick a random enemy type
      const randomIndex = Math.floor(Math.random() * ENEMY_TYPES.length);
      enemyTemplate = ENEMY_TYPES[randomIndex];
    }
    
    if (enemyTemplate) {
      const levelData = enemyTemplate.levels[level as keyof typeof enemyTemplate.levels] || enemyTemplate.levels[1];
      const multiplier = levelData.multiplier;
      
      // Create enemy
      const enemy: Enemy = {
        id: `enemy_${Date.now()}`,
        name: enemyTemplate.name,
        type: enemyTemplate.name.toLowerCase().replace(/\s+/g, '_'),
        level,
        health: Math.floor(enemyTemplate.baseStats.health * multiplier),
        maxHealth: Math.floor(enemyTemplate.baseStats.health * multiplier),
        attack: Math.floor(enemyTemplate.baseStats.attack * multiplier),
        defense: Math.floor(enemyTemplate.baseStats.defense * multiplier),
        coins: levelData.coins,
        experience: levelData.experience,
      };
      
      set({
        battleState: BattleState.playerTurn,
        enemy,
        turnCount: 1,
        battleLog: [`Battle started against ${enemy.name} (Level ${enemy.level})!`],
      });
      
      // Switch to battle phase
      useGameStore.getState().setGamePhase("battle");
    }
  },
  
  endBattle: (playerWon) => {
    const { enemy } = get();
    const { player } = usePlayerStore.getState();
    const { updateCoins } = usePlayerStore.getState();
    const { setGamePhase, incrementCompletedBattles } = useGameStore.getState();
    
    if (playerWon && enemy) {
      // Player won - give rewards
      updateCoins(enemy.coins);
      incrementCompletedBattles();
      
      // Play success sound
      useAudio.getState().playSuccess();
      
      // Add to battle log
      get().addToBattleLog(`You defeated ${enemy.name} and earned ${enemy.coins} coins!`);
      set({ battleState: BattleState.win });
    } else {
      // Player lost
      get().addToBattleLog(`${player.name} was defeated by ${enemy?.name || 'the enemy'}!`);
      set({ battleState: BattleState.lose });
    }
    
    // Return to town after a delay
    setTimeout(() => {
      setGamePhase("town");
      get().resetBattle();
    }, 3000);
  },
  
  performPlayerAction: (actionIndex) => {
    const { battleState, enemy, availableActions } = get();
    const { player } = usePlayerStore.getState();
    const { updatePlayerHealth } = usePlayerStore.getState();
    
    // Only perform action if it's player's turn and enemy exists
    if (battleState !== BattleState.playerTurn || !enemy) return;
    
    const action = availableActions[actionIndex];
    
    if (action.damageMultiplier > 0) {
      // Calculate damage
      const baseDamage = Math.max(0, player.attack - enemy.defense / 2);
      const damage = Math.floor(baseDamage * action.damageMultiplier);
      
      // Apply damage to enemy
      const newEnemyHealth = Math.max(0, enemy.health - damage);
      
      // Play hit sound
      useAudio.getState().playHit();
      
      // Update enemy health
      set({
        enemy: { ...enemy, health: newEnemyHealth },
        battleLog: [...get().battleLog, `${player.name} used ${action.name} and dealt ${damage} damage to ${enemy.name}!`],
      });
      
      // Check if enemy is defeated
      if (newEnemyHealth <= 0) {
        get().endBattle(true);
        return;
      }
    }
    
    // Handle special effects
    if (action.effect) {
      const { target, property, value } = action.effect;
      
      if (target === 'self') {
        // Apply effect to player
        updatePlayerHealth(property === 'health' ? value : 0);
        
        get().addToBattleLog(`${player.name} used ${action.name} and gained ${value} ${property}!`);
      }
    }
    
    // Move to pet's turn
    set({ battleState: BattleState.petTurn });
    
    // Automatically perform pet action after a short delay
    setTimeout(() => {
      get().performPetAction();
    }, 1000);
  },
  
  performPetAction: () => {
    const { battleState, enemy } = get();
    const { pet } = usePetStore.getState();
    const { decreaseCooldowns } = usePetStore.getState();
    
    // Only perform action if it's pet's turn and pet and enemy exist
    if (battleState !== BattleState.petTurn || !pet || !enemy) return;
    
    // Calculate damage
    const damage = Math.max(0, pet.attack - enemy.defense / 3);
    
    // Apply damage to enemy
    const newEnemyHealth = Math.max(0, enemy.health - damage);
    
    // Play hit sound
    useAudio.getState().playHit();
    
    // Update enemy health
    set({
      enemy: { ...enemy, health: newEnemyHealth },
      battleLog: [...get().battleLog, `${pet.name} attacked and dealt ${damage} damage to ${enemy.name}!`],
    });
    
    // Decrease cooldowns for pet abilities
    decreaseCooldowns();
    
    // Check if enemy is defeated
    if (newEnemyHealth <= 0) {
      get().endBattle(true);
      return;
    }
    
    // Move to enemy's turn
    set({ battleState: BattleState.enemyTurn });
    
    // Automatically perform enemy action after a short delay
    setTimeout(() => {
      get().performEnemyAction();
    }, 1000);
  },
  
  performEnemyAction: () => {
    const { battleState, enemy, turnCount } = get();
    const { player } = usePlayerStore.getState();
    const { updatePlayerHealth } = usePlayerStore.getState();
    const { pet } = usePetStore.getState();
    const { updatePetHealth } = usePetStore.getState();
    
    // Only perform action if it's enemy's turn and enemy exists
    if (battleState !== BattleState.enemyTurn || !enemy) return;
    
    // Decide whether to attack player or pet
    const attacksPlayer = Math.random() > 0.5;
    
    if (attacksPlayer) {
      // Attack player
      const damage = Math.max(1, enemy.attack - player.defense / 2);
      
      // Apply damage to player
      updatePlayerHealth(-damage);
      
      // Play hit sound
      useAudio.getState().playHit();
      
      // Add to battle log
      get().addToBattleLog(`${enemy.name} attacked ${player.name} and dealt ${damage} damage!`);
      
      // Check if player is defeated
      if (player.health <= 0) {
        get().endBattle(false);
        return;
      }
    } else if (pet) {
      // Attack pet
      const damage = Math.max(1, enemy.attack - pet.defense / 2);
      
      // Apply damage to pet
      updatePetHealth(-damage);
      
      // Play hit sound
      useAudio.getState().playHit();
      
      // Add to battle log
      get().addToBattleLog(`${enemy.name} attacked ${pet.name} and dealt ${damage} damage!`);
      
      // Check if pet is defeated (pet defeat doesn't end battle)
      if (pet.health <= 0) {
        get().addToBattleLog(`${pet.name} is too tired to continue fighting!`);
      }
    }
    
    // Move back to player's turn
    set({
      battleState: BattleState.playerTurn,
      turnCount: turnCount + 1,
    });
  },
  
  addToBattleLog: (message) => {
    set((state) => ({
      battleLog: [...state.battleLog, message],
    }));
  },
  
  resetBattle: () => {
    set({
      battleState: BattleState.start,
      enemy: null,
      battleLog: [],
      turnCount: 0,
    });
  },
}));
