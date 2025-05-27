import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useGameStore } from "../../stores/useGameStore";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { usePetStore } from "../../stores/usePetStore";
import { useAudio } from "../../../lib/stores/useAudio";
import { cn } from "../../../lib/utils";
import Inventory from "../Inventory";
import Shop from "../Shop";
import School from "../School";
import Home from "../Home";
import Park from "../Park";
import Adventure from "../Adventure";

export function GameInterface() {
  // Optimize store subscriptions - only subscribe to what we need
  const gamePhase = useGameStore((state) => state.gamePhase);
  const showDialog = useGameStore((state) => state.showDialog);
  const dialogContent = useGameStore((state) => state.dialogContent);
  const closeDialog = useGameStore((state) => state.closeDialog);
  const showInventory = useGameStore((state) => state.showInventory);
  const toggleInventory = useGameStore((state) => state.toggleInventory);
  const showShop = useGameStore((state) => state.showShop);
  const showSchool = useGameStore((state) => state.showSchool);
  const showHome = useGameStore((state) => state.showHome);
  const showPark = useGameStore((state) => state.showPark);
  const showAdventure = useGameStore((state) => state.showAdventure);
  const navigationMode = useGameStore((state) => state.navigationMode);
  const toggle2D3D = useGameStore((state) => state.toggle2D3D);
  
  const player = usePlayerStore((state) => state.player);
  const pet = usePetStore((state) => state.pet);
  const { isMuted, toggleMute } = useAudio();
  
  // Debug logging (commented out for performance)
  // console.log("🎮 GameInterface: Modal states -", {
  //   showShop, showSchool, showHome, showPark, showAdventure
  // });
  
  const [showStats, setShowStats] = useState(false);
  
  // Hide inventory when game phase changes
  useEffect(() => {
    if (showInventory) {
      toggleInventory();
    }
  }, [gamePhase, showInventory, toggleInventory]);
  
  // Don't show interface during initial game phases or if player not ready
  if (gamePhase === "welcome" || 
      gamePhase === "age_verification" || 
      gamePhase === "character_creation" || 
      gamePhase === "pet_assignment" ||
      !player) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top bar with player info */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-3 pointer-events-auto">
        <div className="bg-gray-800/80 text-white p-2 rounded-lg flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-500" style={{ backgroundColor: player?.color || "#4FC3F7" }}></div>
          <div className="ml-2">
            <div className="font-bold">{player?.name || "Player"}</div>
            <div className="text-xs">Age: {player?.age || 10}</div>
          </div>
          <div className="ml-4 flex flex-col">
            <div className="flex items-center">
              <span className="text-xs mr-1">HP:</span>
              <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500" 
                  style={{ 
                    width: `${player ? (player.health / player.maxHealth) * 100 : 0}%`,
                    backgroundColor: getHealthColor(player?.health, player?.maxHealth)
                  }}
                ></div>
              </div>
              <span className="text-xs ml-1">{player?.health}/{player?.maxHealth}</span>
            </div>
          </div>
        </div>
        
        {/* Pet info */}
        {pet && (
          <div className="bg-gray-800/80 text-white p-2 rounded-lg flex items-center">
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: pet.color }}></div>
            <div className="ml-2">
              <div className="font-bold">{pet.name}</div>
              <div className="text-xs">{capitalizeFirstLetter(pet.type)}</div>
            </div>
            <div className="ml-4 flex flex-col">
              <div className="flex items-center">
                <span className="text-xs mr-1">HP:</span>
                <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full" 
                    style={{ 
                      width: `${(pet.health / pet.maxHealth) * 100}%`,
                      backgroundColor: getHealthColor(pet.health, pet.maxHealth)
                    }}
                  ></div>
                </div>
                <span className="text-xs ml-1">{pet.health}/{pet.maxHealth}</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs mr-1">Happiness:</span>
                <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ width: `${pet.happiness}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-gray-800/80 text-white p-2 rounded-lg">
          Coins: {player?.coins || 0}
        </div>
      </div>
      
      {/* Bottom bar with actions */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center p-3 pointer-events-auto">
        <div className="bg-gray-800/80 text-white p-2 rounded-lg flex space-x-4">
          <button 
            className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600 transition"
            onClick={toggleInventory}
          >
            Inventory (I)
          </button>
          <button 
            className="px-3 py-1 bg-green-500 rounded-md hover:bg-green-600 transition"
            onClick={() => setShowStats(!showStats)}
          >
            Stats
          </button>
          <button 
            className={cn(
              "px-3 py-1 rounded-md transition",
              isMuted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            )}
            onClick={toggleMute}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button 
            className="px-3 py-1 bg-purple-500 rounded-md hover:bg-purple-600 transition"
            onClick={toggle2D3D}
          >
            Switch to {navigationMode === '2d' ? '3D' : '2D'}
          </button>
        </div>
      </div>
      
      {/* Stats panel */}
      {showStats && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/90 text-white p-4 rounded-lg pointer-events-auto w-80">
          <h2 className="text-lg font-bold mb-2">Player Stats</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>Attack: {player?.attack}</div>
            <div>Defense: {player?.defense}</div>
          </div>
          
          <h2 className="text-lg font-bold mb-2">Pet Stats</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>Attack: {pet?.attack}</div>
            <div>Defense: {pet?.defense}</div>
            <div>Special: {pet?.specialAbility.name}</div>
            <div>Cooldown: {pet?.specialAbility.currentCooldown}/{pet?.specialAbility.cooldown}</div>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600 transition"
              onClick={() => setShowStats(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Inventory */}
      {showInventory && <Inventory onClose={toggleInventory} />}
      
      {/* Shop */}
      {showShop && (
        <div 
          className="fixed inset-0 pointer-events-auto z-[100]"
          onClick={(e) => e.stopPropagation()}
        >
          <Shop />
        </div>
      )}
      
      {/* School */}
      {showSchool && (
        <div 
          className="fixed inset-0 pointer-events-auto z-[100]"
          onClick={(e) => e.stopPropagation()}
        >
          <School />
        </div>
      )}
      
      {/* Home */}
      {showHome && (
        <div 
          className="fixed inset-0 pointer-events-auto z-[100]"
          onClick={(e) => e.stopPropagation()}
        >
          <Home />
        </div>
      )}
      
      {/* Park */}
      {showPark && (
        <div 
          className="fixed inset-0 pointer-events-auto z-[100]"
          onClick={(e) => e.stopPropagation()}
        >
          <Park />
        </div>
      )}
      
      {/* Adventure */}
      {showAdventure && (
        <div 
          className="fixed inset-0 pointer-events-auto z-[100]"
          onClick={(e) => e.stopPropagation()}
        >
          <Adventure />
        </div>
      )}
      
      {/* Dialog */}
      {showDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto z-[70]">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">{dialogContent.title}</h2>
            <p className="mb-4">{dialogContent.message}</p>
            <div className="flex justify-end">
              <button 
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={closeDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getHealthColor(current?: number, max?: number) {
  if (!current || !max) return "#f87171"; // Default red
  
  const percentage = (current / max) * 100;
  if (percentage > 60) return "#4ade80"; // Green
  if (percentage > 30) return "#facc15"; // Yellow
  return "#f87171"; // Red
}

function capitalizeFirstLetter(string?: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}