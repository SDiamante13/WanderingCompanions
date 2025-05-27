import React, { useState, useCallback } from "react";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";

const Park = () => {
  const closePark = useGameStore((state) => state.closePark);
  const currentSubLocation = useGameStore((state) => state.currentSubLocation);
  const setSubLocation = useGameStore((state) => state.setSubLocation);
  const player = usePlayerStore((state) => state.player);
  const updateCoins = usePlayerStore((state) => state.updateCoins);
  const pet = usePetStore((state) => state.pet);
  const updatePetHealth = usePetStore((state) => state.updatePetHealth);
  const updatePetHappiness = usePetStore((state) => state.updatePetHappiness);

  const subLocations = [
    {
      id: "slide",
      name: "🛝 Slide",
      description: "Fun sliding activities and agility training",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      id: "swings",
      name: "🌊 Swings", 
      description: "Peaceful swinging and bonding time",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      id: "sandpit",
      name: "🏖️ Sandpit",
      description: "Digging games and treasure hunting",
      color: "bg-yellow-500", 
      hoverColor: "hover:bg-yellow-600"
    }
  ];

  const handleSubLocationClick = useCallback((subLocationId: string) => {
    setSubLocation(subLocationId);
  }, [setSubLocation]);

  const handleBackToPark = useCallback(() => {
    setSubLocation(null);
  }, [setSubLocation]);

  const Slide = () => {
    const [playing, setPlaying] = useState(false);

    const slideDown = () => {
      if (pet) {
        updatePetHappiness(25);
        alert(`${pet.name} loved sliding down! +25 happiness`);
      }
    };

    const agilityTraining = () => {
      setPlaying(true);
      setTimeout(() => {
        setPlaying(false);
        if (pet) {
          updatePetHappiness(20);
          updatePetHealth(10);
          alert(`${pet.name} completed agility training! +20 happiness, +10 health`);
        }
      }, 3000);
    };

    const playTogether = () => {
      setPlaying(true);
      setTimeout(() => {
        setPlaying(false);
        if (pet && player) {
          updatePetHappiness(30);
          updateCoins(5);
          alert(`Great fun playing together! Pet +30 happiness, +5 coins`);
        }
      }, 4000);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛝 Playground Slide</h2>
        <p className="text-gray-600 mb-6">Have fun and improve your pet's agility with exciting slide activities.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={slideDown}
            className="p-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
          >
            Quick Slide
            <div className="text-sm mt-1">+25 happiness</div>
          </button>
          
          <button
            onClick={agilityTraining}
            disabled={playing}
            className="p-4 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition disabled:bg-gray-400"
          >
            {playing ? "Training... (3s)" : "Agility Training"}
            <div className="text-sm mt-1">+20 happiness, +10 health</div>
          </button>

          <button
            onClick={playTogether}
            disabled={playing}
            className="p-4 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition disabled:bg-gray-400"
          >
            {playing ? "Playing... (4s)" : "Play Together"}
            <div className="text-sm mt-1">+30 happiness, +5 coins</div>
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">Slide Benefits:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sliding improves pet confidence and joy</li>
            <li>• Agility training builds physical fitness</li>
            <li>• Playing together strengthens your bond</li>
          </ul>
        </div>
      </div>
    );
  };

  const Swings = () => {
    const [swinging, setSwinging] = useState(false);

    const gentleSwing = () => {
      if (pet) {
        updatePetHappiness(15);
        alert(`${pet.name} enjoyed the gentle swinging! +15 happiness`);
      }
    };

    const relaxationTime = () => {
      setSwinging(true);
      setTimeout(() => {
        setSwinging(false);
        if (pet) {
          updatePetHappiness(25);
          updatePetHealth(15);
          alert(`${pet.name} is completely relaxed! +25 happiness, +15 health`);
        }
      }, 5000);
    };

    const bondingSession = () => {
      setSwinging(true);
      setTimeout(() => {
        setSwinging(false);
        if (pet && player) {
          updatePetHappiness(30);
          updateCoins(3);
          alert(`Beautiful bonding time! Pet +30 happiness, +3 coins`);
        }
      }, 6000);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌊 Peaceful Swings</h2>
        <p className="text-gray-600 mb-6">Enjoy calm, peaceful moments swinging with your pet under the sky.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={gentleSwing}
            className="p-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
          >
            Gentle Swing
            <div className="text-sm mt-1">+15 happiness</div>
          </button>
          
          <button
            onClick={relaxationTime}
            disabled={swinging}
            className="p-4 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 transition disabled:bg-gray-400"
          >
            {swinging ? "Relaxing... (5s)" : "Relaxation Time"}
            <div className="text-sm mt-1">+25 happiness, +15 health</div>
          </button>

          <button
            onClick={bondingSession}
            disabled={swinging}
            className="p-4 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition disabled:bg-gray-400"
          >
            {swinging ? "Bonding... (6s)" : "Bonding Session"}
            <div className="text-sm mt-1">+30 happiness, +3 coins</div>
          </button>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">Swing Benefits:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Swinging reduces stress and anxiety</li>
            <li>• Peaceful environment promotes healing</li>
            <li>• Quality time strengthens your relationship</li>
          </ul>
        </div>
      </div>
    );
  };

  const Sandpit = () => {
    const [digging, setDigging] = useState(false);

    const quickDig = () => {
      if (pet) {
        updatePetHappiness(20);
        const foundCoins = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0;
        if (foundCoins > 0 && player) {
          updateCoins(foundCoins);
          alert(`${pet.name} dug in the sand and found ${foundCoins} coins! +20 happiness`);
        } else {
          alert(`${pet.name} had fun digging! +20 happiness`);
        }
      }
    };

    const treasureHunt = () => {
      setDigging(true);
      setTimeout(() => {
        setDigging(false);
        if (pet && player) {
          const foundCoins = Math.floor(Math.random() * 8) + 3;
          updatePetHappiness(25);
          updateCoins(foundCoins);
          alert(`Treasure hunt success! Found ${foundCoins} coins, Pet +25 happiness`);
        }
      }, 4000);
    };

    const buildSandcastle = () => {
      setDigging(true);
      setTimeout(() => {
        setDigging(false);
        if (pet) {
          updatePetHappiness(35);
          updatePetHealth(10);
          alert(`${pet.name} helped build an amazing sandcastle! +35 happiness, +10 health`);
        }
      }, 5000);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🏖️ Sandy Sandpit</h2>
        <p className="text-gray-600 mb-6">Dig, explore and create in the magical sandpit where treasures await.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={quickDig}
            className="p-4 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition"
          >
            Quick Dig
            <div className="text-sm mt-1">+20 happiness, maybe coins!</div>
          </button>
          
          <button
            onClick={treasureHunt}
            disabled={digging}
            className="p-4 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition disabled:bg-gray-400"
          >
            {digging ? "Hunting... (4s)" : "Treasure Hunt"}
            <div className="text-sm mt-1">+25 happiness, 3-10 coins</div>
          </button>

          <button
            onClick={buildSandcastle}
            disabled={digging}
            className="p-4 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition disabled:bg-gray-400"
          >
            {digging ? "Building... (5s)" : "Build Sandcastle"}
            <div className="text-sm mt-1">+35 happiness, +10 health</div>
          </button>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2">Sandpit Magic:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Digging satisfies natural pet instincts</li>
            <li>• Treasure hunting can yield surprise rewards</li>
            <li>• Creative building activities boost joy and health</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderSubLocation = () => {
    switch (currentSubLocation) {
      case "slide":
        return <Slide />;
      case "swings":
        return <Swings />;
      case "sandpit":
        return <Sandpit />;
      default:
        return null;
    }
  };

  if (currentSubLocation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-green-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {renderSubLocation()}
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleBackToPark}
                className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition"
              >
                ← Back to Park
              </button>
              <button
                onClick={closePark}
                className="px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition"
              >
                Leave Park
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-green-500 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-green-500 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🌳 Welcome to the Park!</h1>
          <p className="text-lg">A wonderful outdoor space for fun and physical activities</p>
        </div>

        {/* Player and Pet Info */}
        <div className="p-4 bg-green-100 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-green-500"
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
                  className="w-10 h-10 rounded-full border-2 border-green-500"
                  style={{ backgroundColor: pet.color }}
                ></div>
                <div>
                  <p className="font-bold text-gray-800">{pet.name}</p>
                  <p className="text-sm text-gray-600">Happiness: {pet.happiness}%</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Selection */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Your Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subLocations.map((activity) => (
              <button
                key={activity.id}
                onClick={() => handleSubLocationClick(activity.id)}
                className={`p-4 ${activity.color} text-white rounded-xl font-bold ${activity.hoverColor} transition-all transform hover:scale-105`}
              >
                <div className="text-2xl mb-2">{activity.name.split(' ')[0]}</div>
                <div className="text-sm font-normal">{activity.description}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xl">🌳</span>
              <div>
                <h4 className="font-bold text-green-800 mb-1">Park Activities:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Build your pet's physical fitness and confidence</li>
                  <li>• Enjoy peaceful bonding time in nature</li>
                  <li>• Discover hidden treasures and earn rewards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={closePark}
            className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition-colors"
          >
            Leave Park
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Park);