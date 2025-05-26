import React from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";
import { useGameStore } from "../stores/useGameStore";
import { InventoryItem } from "../types";

interface InventoryProps {
  onClose: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ onClose }) => {
  const { player, useItem, removeItem } = usePlayerStore();
  const { pet } = usePetStore();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  
  // Early return if player not initialized
  if (!player || !player.inventory) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-500 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  // Group items by type
  const itemsByType = React.useMemo(() => {
    const types: Record<string, InventoryItem[]> = {
      all: [...(player.inventory || [])],
      food: [],
      toy: [],
      medicine: [],
      accessory: [],
    };
    
    (player.inventory || []).forEach(item => {
      if (types[item.type]) {
        types[item.type].push(item);
      }
    });
    
    return types;
  }, [player.inventory]);
  
  // Handle item use
  const handleUseItem = (itemId: string) => {
    if (!player || !player.inventory) return;
    
    const item = player.inventory.find(i => i.id === itemId);
    
    if (!item) return;
    
    // Check if item can be used based on target
    if (item.effect.target === "pet" && !pet) {
      alert("You need a pet to use this item!");
      return;
    }
    
    useItem(itemId);
    alert(`Used ${item.name}!`);
  };
  
  // Handle item discard
  const handleDiscardItem = (itemId: string) => {
    removeItem(itemId);
  };
  
  // Calculate total inventory slots
  const totalSlots = 20;
  const usedSlots = (player.inventory || []).reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-500 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">Inventory</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">
              {`Slots: ${usedSlots}/${totalSlots}`}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
          
        {/* Inventory tabs */}
        <div className="flex p-2 bg-gray-100 gap-2">
          {Object.keys(itemsByType).map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                activeTab === type 
                  ? "bg-blue-500 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {type !== "all" && ` (${itemsByType[type].length})`}
            </button>
          ))}
        </div>
          
        {/* Coins display */}
        <div className="p-3 bg-yellow-100 flex items-center gap-2 border-b border-yellow-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
            <circle cx="12" cy="12" r="8"></circle>
            <path d="M12 6v12"></path>
            <path d="M8 12h8"></path>
          </svg>
          <span className="font-bold text-gray-700">{`${player.coins} coins`}</span>
        </div>
          
        {/* Items list */}
        <div className="overflow-y-auto p-4 max-h-[50vh]">
          {itemsByType[activeTab].length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8V21H3V8"></path>
                <path d="M1 3h22v5H1z"></path>
                <path d="M10 12h4"></path>
              </svg>
              <p className="mt-2 font-bold">No items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {itemsByType[activeTab].map(item => (
                <div key={item.id} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <span className="bg-gray-200 px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                      x{item.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-bold mt-1">{item.description}</p>
                  <div className="mt-2 text-sm text-gray-500 font-bold">
                    {item.effect.target === "player" && (
                      <span>{`Affects: You (${item.effect.property} +${item.effect.value})`}</span>
                    )}
                    {item.effect.target === "pet" && (
                      <span>{`Affects: Pet (${item.effect.property} +${item.effect.value})`}</span>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleUseItem(item.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold hover:bg-blue-600 transition-colors"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => handleDiscardItem(item.id)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-300 transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
