import React, { useState, useCallback } from "react";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";
import LoadingSpinner from "./ui/LoadingSpinner";

const Home = () => {
  const { closeHome, currentSubLocation, setSubLocation } = useGameStore();
  const { player, updateCoins, updatePlayerHealth } = usePlayerStore();
  const { pet, updatePetHealth, updatePetHappiness } = usePetStore();

  const subLocations = [
    {
      id: "kitchen",
      name: "🍳 Kitchen",
      description: "Cook food and feed your pet",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600"
    },
    {
      id: "bathroom",
      name: "🛁 Bathroom", 
      description: "Clean and groom your pet",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      id: "bedroom",
      name: "🛏️ Bedroom",
      description: "Rest and restore health",
      color: "bg-purple-500", 
      hoverColor: "hover:bg-purple-600"
    }
  ];

  const handleSubLocationClick = (subLocationId: string) => {
    setSubLocation(subLocationId);
  };

  const handleBackToHome = () => {
    setSubLocation(null);
  };

  const Kitchen = () => {
    const [cooking, setCooking] = useState(false);

    const feedPet = () => {
      if (pet && player && player.coins >= 5) {
        updateCoins(-5);
        updatePetHealth(15);
        updatePetHappiness(20);
        alert(`${pet.name} enjoyed the meal! +15 health, +20 happiness`);
      } else if (player && player.coins < 5) {
        alert("You need 5 coins to feed your pet!");
      }
    };

    const cookMeal = () => {
      setCooking(true);
      setTimeout(() => {
        setCooking(false);
        if (player) {
          updatePlayerHealth(10);
          alert("You cooked a delicious meal! +10 health");
        }
      }, 2000);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🍳 Kitchen</h2>
        <p className="text-gray-600 mb-6">Prepare food and feed your pet to keep them healthy and happy.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={feedPet}
            disabled={!player || player.coins < 5}
            className="p-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Feed Pet (5 coins)
            <div className="text-sm mt-1">+15 health, +20 happiness</div>
          </button>
          
          <button
            onClick={cookMeal}
            disabled={cooking}
            className="p-4 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition disabled:bg-gray-400"
          >
            {cooking ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="small" type="spin" message="" />
                <span className="ml-2">Cooking...</span>
              </div>
            ) : (
              "Cook Meal"
            )}
            {!cooking && <div className="text-sm mt-1">+10 player health</div>}
          </button>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2">Kitchen Tips:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Regular feeding keeps your pet happy and healthy</li>
            <li>• Cooking meals restores your own energy</li>
            <li>• Happy pets perform better in battles</li>
          </ul>
        </div>
      </div>
    );
  };

  const Bathroom = () => {
    const [cleaning, setCleaning] = useState(false);

    const cleanPet = () => {
      setCleaning(true);
      setTimeout(() => {
        setCleaning(false);
        if (pet) {
          updatePetHappiness(15);
          updatePetHealth(5);
          alert(`${pet.name} is squeaky clean! +15 happiness, +5 health`);
        }
      }, 3000);
    };

    const quickWash = () => {
      if (pet) {
        updatePetHappiness(8);
        alert(`${pet.name} had a quick wash! +8 happiness`);
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛁 Bathroom</h2>
        <p className="text-gray-600 mb-6">Keep your pet clean and groomed for better health and happiness.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={cleanPet}
            disabled={cleaning}
            className="p-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {cleaning ? "Cleaning... (3s)" : "Full Bath"}
            <div className="text-sm mt-1">+15 happiness, +5 health</div>
          </button>
          
          <button
            onClick={quickWash}
            className="p-4 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition"
          >
            Quick Wash
            <div className="text-sm mt-1">+8 happiness</div>
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">Hygiene Benefits:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Clean pets are happier and healthier</li>
            <li>• Regular grooming prevents illness</li>
            <li>• Full baths give more benefits but take time</li>
          </ul>
        </div>
      </div>
    );
  };

  const Bedroom = () => {
    const [sleeping, setSleeping] = useState(false);

    const takeNap = () => {
      setSleeping(true);
      setTimeout(() => {
        setSleeping(false);
        if (player) {
          updatePlayerHealth(20);
        }
        if (pet) {
          updatePetHealth(15);
          updatePetHappiness(10);
        }
        alert("Refreshing nap! Player +20 health, Pet +15 health, +10 happiness");
      }, 4000);
    };

    const fullSleep = () => {
      setSleeping(true);
      setTimeout(() => {
        setSleeping(false);
        if (player) {
          updatePlayerHealth(50);
        }
        if (pet) {
          updatePetHealth(30);
          updatePetHappiness(25);
        }
        alert("Full night's rest! Player +50 health, Pet +30 health, +25 happiness");
      }, 6000);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛏️ Bedroom</h2>
        <p className="text-gray-600 mb-6">Rest and recover your energy along with your pet.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={takeNap}
            disabled={sleeping}
            className="p-4 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition disabled:bg-gray-400"
          >
            {sleeping ? "Napping... (4s)" : "Take Nap"}
            <div className="text-sm mt-1">Moderate recovery</div>
          </button>
          
          <button
            onClick={fullSleep}
            disabled={sleeping}
            className="p-4 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition disabled:bg-gray-400"
          >
            {sleeping ? "Sleeping... (6s)" : "Full Sleep"}
            <div className="text-sm mt-1">Maximum recovery</div>
          </button>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 mb-2">Rest Benefits:</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Sleep restores health for both you and your pet</li>
            <li>• Well-rested pets are more effective in battles</li>
            <li>• Longer rest provides better recovery</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderSubLocation = () => {
    switch (currentSubLocation) {
      case "kitchen":
        return <Kitchen />;
      case "bathroom":
        return <Bathroom />;
      case "bedroom":
        return <Bedroom />;
      default:
        return null;
    }
  };

  if (currentSubLocation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-orange-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {renderSubLocation()}
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleBackToHome}
                className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition"
              >
                ← Back to Home
              </button>
              <button
                onClick={closeHome}
                className="px-6 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
              >
                Leave Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-orange-500 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-orange-500 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🏠 Welcome Home!</h1>
          <p className="text-lg">Your cozy home with everything you and your pet need</p>
        </div>

        {/* Player and Pet Info */}
        <div className="p-4 bg-orange-100 border-b border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-orange-500"
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
                  className="w-10 h-10 rounded-full border-2 border-orange-500"
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

        {/* Room Selection */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Choose a Room</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subLocations.map((room) => (
              <button
                key={room.id}
                onClick={() => handleSubLocationClick(room.id)}
                className={`p-4 ${room.color} text-white rounded-xl font-bold ${room.hoverColor} transition-all transform hover:scale-105`}
              >
                <div className="text-2xl mb-2">{room.name.split(' ')[0]}</div>
                <div className="text-sm font-normal">{room.description}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-2">
              <span className="text-orange-500 text-xl">🏠</span>
              <div>
                <h4 className="font-bold text-orange-800 mb-1">Home Sweet Home:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Take care of your basic needs and your pet's</li>
                  <li>• Rest and recover between adventures</li>
                  <li>• Bond with your pet through daily activities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={closeHome}
            className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition-colors"
          >
            Leave Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);