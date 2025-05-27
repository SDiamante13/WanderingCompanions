import React, { useState, useCallback } from "react";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";
import { useBattleStore } from "../stores/useBattleStore";
import { GamePhase } from "../types";

const Adventure = () => {
  const closeAdventure = useGameStore((state) => state.closeAdventure);
  const currentSubLocation = useGameStore((state) => state.currentSubLocation);
  const setSubLocation = useGameStore((state) => state.setSubLocation);
  const setGamePhase = useGameStore((state) => state.setGamePhase);
  const player = usePlayerStore((state) => state.player);
  const updateCoins = usePlayerStore((state) => state.updateCoins);
  const updatePlayerHealth = usePlayerStore((state) => state.updatePlayerHealth);
  const pet = usePetStore((state) => state.pet);
  const updatePetHealth = usePetStore((state) => state.updatePetHealth);
  const updatePetHappiness = usePetStore((state) => state.updatePetHappiness);
  const startBattle = useBattleStore((state) => state.startBattle);

  const subLocations = [
    {
      id: "forest_edge",
      name: "🌲 Forest Edge",
      description: "Safe exploration for beginners",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      difficulty: "Easy"
    },
    {
      id: "deep_forest",
      name: "🌲🌲 Deep Forest", 
      description: "Challenging adventures await",
      color: "bg-emerald-700",
      hoverColor: "hover:bg-emerald-800",
      difficulty: "Medium"
    },
    {
      id: "ancient_grove",
      name: "🌳✨ Ancient Grove",
      description: "Mystical and dangerous territory",
      color: "bg-purple-700", 
      hoverColor: "hover:bg-purple-800",
      difficulty: "Hard"
    }
  ];

  const handleSubLocationClick = useCallback((subLocationId: string) => {
    setSubLocation(subLocationId);
  }, [setSubLocation]);

  const handleBackToAdventure = useCallback(() => {
    setSubLocation(null);
  }, [setSubLocation]);

  const ForestEdge = () => {
    const [exploring, setExploring] = useState(false);

    const quickExplore = () => {
      if (pet) {
        const reward = Math.floor(Math.random() * 3) + 1;
        updateCoins(reward);
        updatePetHappiness(15);
        alert(`${pet.name} found ${reward} coins while exploring! +15 happiness`);
      }
    };

    const lookForBerries = () => {
      setExploring(true);
      setTimeout(() => {
        setExploring(false);
        if (pet && player) {
          const berries = Math.floor(Math.random() * 2) + 1;
          updatePetHealth(berries * 5);
          updatePlayerHealth(berries * 3);
          updatePetHappiness(10);
          alert(`Found ${berries} healing berries! Pet +${berries * 5} health, Player +${berries * 3} health`);
        }
      }, 2000);
    };

    const encounterWildlife = () => {
      const encounter = Math.random();
      if (encounter > 0.7) {
        alert("A wild creature appears! Prepare for battle!");
        startBattle("Wild Cat", 1);
        setGamePhase(GamePhase.battle);
        closeAdventure();
      } else if (encounter > 0.4) {
        updateCoins(3);
        alert("You found a friendly squirrel who shared 3 coins with you!");
      } else {
        updatePetHappiness(20);
        alert(`${pet?.name} made friends with a butterfly! +20 happiness`);
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌲 Forest Edge</h2>
        <p className="text-gray-600 mb-6">A peaceful area perfect for beginning adventurers. Wildlife is friendly here.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={quickExplore}
            className="p-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
          >
            Quick Explore
            <div className="text-sm mt-1">Find 1-3 coins</div>
          </button>
          
          <button
            onClick={lookForBerries}
            disabled={exploring}
            className="p-4 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:bg-gray-400"
          >
            {exploring ? "Searching... (2s)" : "Look for Berries"}
            <div className="text-sm mt-1">Find healing berries</div>
          </button>

          <button
            onClick={encounterWildlife}
            className="p-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
          >
            Meet Wildlife
            <div className="text-sm mt-1">Random encounter</div>
          </button>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">Forest Edge Safety:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Low danger, perfect for new adventurers</li>
            <li>• Abundant berries and small treasures</li>
            <li>• Wildlife encounters are mostly friendly</li>
          </ul>
        </div>
      </div>
    );
  };

  const DeepForest = () => {
    const [exploring, setExploring] = useState(false);

    const searchForTreasure = () => {
      setExploring(true);
      setTimeout(() => {
        setExploring(false);
        const found = Math.random() > 0.3;
        if (found && player) {
          const treasure = Math.floor(Math.random() * 8) + 5;
          updateCoins(treasure);
          updatePetHappiness(25);
          alert(`Found a treasure chest with ${treasure} coins! +25 happiness`);
        } else {
          alert("No treasure found this time, but the adventure continues!");
        }
      }, 4000);
    };

    const huntForMushrooms = () => {
      setExploring(true);
      setTimeout(() => {
        setExploring(false);
        if (pet && player) {
          const mushrooms = Math.floor(Math.random() * 3) + 2;
          updatePetHealth(mushrooms * 8);
          updatePlayerHealth(mushrooms * 6);
          updateCoins(mushrooms * 2);
          alert(`Found ${mushrooms} magic mushrooms! Great healing and ${mushrooms * 2} coins`);
        }
      }, 3000);
    };

    const faceChallenge = () => {
      const challenge = Math.random();
      if (challenge > 0.6) {
        alert("A forest guardian blocks your path! Battle time!");
        startBattle("Angry Bird", 3);
        setGamePhase(GamePhase.battle);
        closeAdventure();
      } else if (challenge > 0.3) {
        const coins = Math.floor(Math.random() * 6) + 4;
        updateCoins(coins);
        updatePetHappiness(20);
        alert(`Overcame a forest puzzle! Earned ${coins} coins and +20 happiness`);
      } else {
        updatePlayerHealth(-5);
        alert("Got scratched by thorny bushes! -5 health");
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌲🌲 Deep Forest</h2>
        <p className="text-gray-600 mb-6">Venture deeper into the mysterious forest where greater rewards await the brave.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={searchForTreasure}
            disabled={exploring}
            className="p-4 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 transition disabled:bg-gray-400"
          >
            {exploring ? "Searching... (4s)" : "Search for Treasure"}
            <div className="text-sm mt-1">5-12 coins possible</div>
          </button>
          
          <button
            onClick={huntForMushrooms}
            disabled={exploring}
            className="p-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition disabled:bg-gray-400"
          >
            {exploring ? "Hunting... (3s)" : "Hunt Mushrooms"}
            <div className="text-sm mt-1">Magic healing mushrooms</div>
          </button>

          <button
            onClick={faceChallenge}
            className="p-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
          >
            Face Challenge
            <div className="text-sm mt-1">High risk, high reward</div>
          </button>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h3 className="font-bold text-emerald-800 mb-2">Deep Forest Dangers:</h3>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• Moderate danger with better rewards</li>
            <li>• Hidden treasures and magic mushrooms</li>
            <li>• Forest guardians may challenge you</li>
          </ul>
        </div>
      </div>
    );
  };

  const AncientGrove = () => {
    const [exploring, setExploring] = useState(false);

    const seekAncientArtifact = () => {
      setExploring(true);
      setTimeout(() => {
        setExploring(false);
        const success = Math.random() > 0.5;
        if (success && player && pet) {
          const coins = Math.floor(Math.random() * 15) + 10;
          updateCoins(coins);
          updatePetHealth(20);
          updatePetHappiness(30);
          alert(`Discovered an ancient artifact! ${coins} coins, +20 health, +30 happiness`);
        } else {
          updatePlayerHealth(-10);
          alert("The ancient magic was too powerful! -10 health");
        }
      }, 6000);
    };

    const communeWithSpirits = () => {
      setExploring(true);
      setTimeout(() => {
        setExploring(false);
        if (pet && player) {
          const blessing = Math.random() > 0.7;
          if (blessing) {
            updatePetHealth(30);
            updatePlayerHealth(25);
            updatePetHappiness(40);
            updateCoins(8);
            alert("Forest spirits blessed you! Major healing and happiness boost!");
          } else {
            updatePetHappiness(15);
            alert(`${pet.name} enjoyed the mystical atmosphere! +15 happiness`);
          }
        }
      }, 5000);
    };

    const faceAncientBeast = () => {
      alert("An ancient forest beast emerges from the shadows!");
      startBattle("Sneaky Snake", 5);
      setGamePhase(GamePhase.battle);
      closeAdventure();
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌳✨ Ancient Grove</h2>
        <p className="text-gray-600 mb-6">The most mystical and dangerous part of the forest. Ancient magic flows here.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={seekAncientArtifact}
            disabled={exploring}
            className="p-4 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition disabled:bg-gray-400"
          >
            {exploring ? "Seeking... (6s)" : "Seek Artifact"}
            <div className="text-sm mt-1">10-24 coins, risky</div>
          </button>
          
          <button
            onClick={communeWithSpirits}
            disabled={exploring}
            className="p-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {exploring ? "Communing... (5s)" : "Commune with Spirits"}
            <div className="text-sm mt-1">Possible spirit blessing</div>
          </button>

          <button
            onClick={faceAncientBeast}
            className="p-4 bg-rose-700 text-white rounded-lg font-bold hover:bg-rose-800 transition"
          >
            Face Ancient Beast
            <div className="text-sm mt-1">Challenging battle</div>
          </button>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 mb-2">Ancient Grove Mysteries:</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• High danger but legendary rewards</li>
            <li>• Ancient artifacts hold great power</li>
            <li>• Forest spirits may bless or curse</li>
            <li>• Ancient beasts guard the deepest secrets</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderSubLocation = () => {
    switch (currentSubLocation) {
      case "forest_edge":
        return <ForestEdge />;
      case "deep_forest":
        return <DeepForest />;
      case "ancient_grove":
        return <AncientGrove />;
      default:
        return null;
    }
  };

  if (currentSubLocation) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70]">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-emerald-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {renderSubLocation()}
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleBackToAdventure}
                className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition"
              >
                ← Back to Adventure
              </button>
              <button
                onClick={closeAdventure}
                className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition"
              >
                Leave Adventure
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-emerald-600 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-emerald-600 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🏞️ Adventure Awaits!</h1>
          <p className="text-lg">Explore the mystical forest and discover its secrets</p>
        </div>

        {/* Player and Pet Info */}
        <div className="p-4 bg-emerald-100 border-b border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-emerald-600"
                style={{ backgroundColor: player?.color || "#4FC3F7" }}
              ></div>
              <div>
                <p className="font-bold text-gray-800">{player?.name || "Player"}</p>
                <p className="text-sm text-gray-600">Health: {player?.health}/{player?.maxHealth}</p>
              </div>
            </div>
            {pet && (
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-emerald-600"
                  style={{ backgroundColor: pet.color }}
                ></div>
                <div>
                  <p className="font-bold text-gray-800">{pet.name}</p>
                  <p className="text-sm text-gray-600">Health: {pet.health}/{pet.maxHealth}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Area Selection */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Your Destination</h2>
          <div className="grid grid-cols-1 gap-4">
            {subLocations.map((area) => (
              <button
                key={area.id}
                onClick={() => handleSubLocationClick(area.id)}
                className={`p-4 ${area.color} text-white rounded-xl font-bold ${area.hoverColor} transition-all transform hover:scale-105 text-left`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl mb-1">{area.name}</div>
                    <div className="text-sm font-normal">{area.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {area.difficulty}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 text-xl">🏞️</span>
              <div>
                <h4 className="font-bold text-emerald-800 mb-1">Adventure Tips:</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Start with easier areas to build experience</li>
                  <li>• Keep your pet healthy for better exploration</li>
                  <li>• Some encounters may lead to battles</li>
                  <li>• Greater risks yield greater rewards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={closeAdventure}
            className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition-colors"
          >
            Return to Town
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Adventure);