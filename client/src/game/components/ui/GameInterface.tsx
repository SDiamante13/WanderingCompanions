import React, { useState, useEffect } from "react";
import { useGameStore } from "../../stores/useGameStore";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { usePetStore } from "../../stores/usePetStore";
import { useBattleStore } from "../../stores/useBattleStore";
import { GamePhase, BattleState } from "../../types";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../../types";
import Inventory from "../Inventory";
import GameDialog from "./GameDialog";
import { healthPercentage, healthColor } from "../../utils/helpers";

export const GameInterface: React.FC = () => {
  const { 
    gamePhase, 
    showInventory, 
    toggleInventory,
    showDialog,
    dialogContent,
    closeDialog
  } = useGameStore();
  
  const { player } = usePlayerStore();
  const { pet } = usePetStore();
  const { enemy, battleState, battleLog } = useBattleStore();
  
  const [showControls, setShowControls] = useState(false);
  
  // Listen for inventory key press
  const inventoryPressed = useKeyboardControls<Controls>(state => state.inventory);
  
  useEffect(() => {
    if (inventoryPressed && (gamePhase === GamePhase.town || gamePhase === GamePhase.battle)) {
      toggleInventory();
    }
  }, [inventoryPressed, gamePhase, toggleInventory]);
  
  // Show controls button handler
  const toggleControlsDisplay = () => {
    setShowControls(prev => !prev);
  };
  
  // Only show interface in active gameplay phases
  if (
    gamePhase === GamePhase.welcome || 
    gamePhase === GamePhase.age_verification || 
    gamePhase === GamePhase.character_creation || 
    gamePhase === GamePhase.pet_assignment
  ) {
    return null;
  }
  
  return (
    <>
      {/* HUD - Top bar */}
      <div className="fixed top-0 left-0 right-0 p-2 flex justify-between items-center z-40">
        {/* Player info */}
        <div className="bg-white/90 rounded-xl p-2 shadow-md flex items-center space-x-2">
          <div className="w-12 h-12 rounded-full" style={{ backgroundColor: player.color }} />
          <div>
            <div className="font-fredoka font-bold">{player.name}</div>
            {/* Health bar */}
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${healthPercentage(player.health, player.maxHealth)}%`,
                  backgroundColor: healthColor(healthPercentage(player.health, player.maxHealth))
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Pet info (if exists) */}
        {pet && (
          <div className="bg-white/90 rounded-xl p-2 shadow-md flex items-center space-x-2">
            <div>
              <div className="font-fredoka font-bold text-right">{pet.name}</div>
              {/* Health bar */}
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${healthPercentage(pet.health, pet.maxHealth)}%`,
                    backgroundColor: healthColor(healthPercentage(pet.health, pet.maxHealth))
                  }}
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: pet.color }} />
          </div>
        )}
      </div>
      
      {/* Controls help button */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={toggleControlsDisplay}
          className="bg-white/90 p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          aria-label="Show controls"
          title="Show controls"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 12h.01" />
            <path d="M10 12h.01" />
            <path d="M14 12h.01" />
            <path d="M18 12h.01" />
          </svg>
        </button>
        
        {/* Controls popup */}
        {showControls && (
          <div className="absolute bottom-14 left-0 bg-white/95 p-4 rounded-xl shadow-lg w-64">
            <h3 className="font-fredoka font-bold mb-2">Game Controls</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span>WASD / Arrows</span>
                <span className="text-gray-600">Move</span>
              </li>
              <li className="flex justify-between">
                <span>E / Space</span>
                <span className="text-gray-600">Interact</span>
              </li>
              <li className="flex justify-between">
                <span>I</span>
                <span className="text-gray-600">Inventory</span>
              </li>
              <li className="flex justify-between">
                <span>M</span>
                <span className="text-gray-600">Toggle Music</span>
              </li>
            </ul>
            <button 
              onClick={toggleControlsDisplay}
              className="mt-3 w-full py-1 px-2 bg-gray-200 rounded-md text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
      
      {/* Inventory button */}
      <div className="fixed bottom-4 right-16 z-40">
        <button
          onClick={toggleInventory}
          className="bg-white/90 p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          aria-label="Inventory"
          title="Inventory (I)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8V21H3V8"></path>
            <path d="M1 3h22v5H1z"></path>
            <path d="M10 12h4"></path>
          </svg>
        </button>
      </div>
      
      {/* Show inventory if enabled */}
      {showInventory && (
        <Inventory onClose={toggleInventory} />
      )}
      
      {/* Battle log (only in battle phase) */}
      {gamePhase === GamePhase.battle && (
        <div className="fixed bottom-16 left-4 right-4 z-30">
          <div className="bg-white/90 p-3 rounded-xl shadow-md max-h-32 overflow-y-auto">
            <h3 className="font-fredoka font-bold mb-1">Battle Log</h3>
            <div className="space-y-1">
              {battleLog.slice(-5).map((log, index) => (
                <div key={index} className="text-sm">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Enemy info in battle */}
      {gamePhase === GamePhase.battle && enemy && (
        <div className="fixed top-16 left-0 right-0 flex justify-center z-30">
          <div className="bg-white/90 p-2 rounded-xl shadow-md max-w-xs">
            <div className="flex justify-between items-center">
              <span className="font-fredoka font-bold">{`${enemy.name} Lv.${enemy.level}`}</span>
              <span className="text-sm">{`${enemy.health}/${enemy.maxHealth} HP`}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${healthPercentage(enemy.health, enemy.maxHealth)}%`,
                  backgroundColor: healthColor(healthPercentage(enemy.health, enemy.maxHealth))
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Dialog */}
      {showDialog && (
        <GameDialog
          title={dialogContent.title}
          message={dialogContent.message}
          onClose={closeDialog}
        />
      )}
    </>
  );
};
