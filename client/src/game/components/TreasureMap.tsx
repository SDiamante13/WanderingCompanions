import React, { useCallback, useMemo } from "react";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";
import { TownLocation } from "../types";

const TreasureMap = () => {
  // Optimize store subscriptions
  const currentLocation = useGameStore((state) => state.currentLocation);
  const setLocation = useGameStore((state) => state.setLocation);
  const unlockedLocations = useGameStore((state) => state.unlockedLocations);
  const openShop = useGameStore((state) => state.openShop);
  const openSchool = useGameStore((state) => state.openSchool);
  const openHome = useGameStore((state) => state.openHome);
  const openPark = useGameStore((state) => state.openPark);
  const openAdventure = useGameStore((state) => state.openAdventure);
  const setNavigationMode = useGameStore((state) => state.setNavigationMode);
  
  const player = usePlayerStore((state) => state.player);
  const pet = usePetStore((state) => state.pet);

  // Memoize locations array to prevent unnecessary re-renders
  const locations = useMemo(() => [
    {
      id: TownLocation.home,
      name: "🏠 Home",
      description: "Kitchen, Bathroom, Bedroom",
      subAreas: ["Kitchen", "Bathroom", "Bedroom"],
      position: { top: "20%", left: "15%" },
      unlocked: true
    },
    {
      id: TownLocation.adventure,
      name: "🌲 Adventure", 
      description: "Explore the mysterious forest",
      subAreas: ["Forest"],
      position: { top: "15%", left: "75%" },
      unlocked: true
    },
    {
      id: TownLocation.park,
      name: "🌳 Park",
      description: "Slide, Swings, and Sandpit",
      subAreas: ["Slide", "Swings", "Sandpit"],
      position: { top: "35%", left: "80%" },
      unlocked: true
    },
    {
      id: TownLocation.shop,
      name: "🛒 Shop",
      description: "Pets, Vet, Groceries",
      subAreas: ["Pets", "Vet", "Groceries"],
      position: { top: "70%", left: "70%" },
      unlocked: true
    },
    {
      id: TownLocation.school,
      name: "🏫 School",
      description: "Library, Classroom, Study Room",
      subAreas: ["Library", "Classroom", "Study Room"],
      position: { top: "75%", left: "25%" },
      unlocked: true
    },
    {
      id: TownLocation.center,
      name: "⛲ Town Center",
      description: "Meet other pet owners",
      subAreas: ["Town Square"],
      position: { top: "45%", left: "50%" },
      unlocked: true
    }
  ], []);

  console.log("Locations array:", locations);
  console.log("Current location:", currentLocation);

  // Memoize click handler to prevent unnecessary re-renders
  const handleLocationClick = useCallback((locationId: TownLocation) => {
    setLocation(locationId);
    
    switch (locationId) {
      case TownLocation.shop:
        openShop();
        break;
      case TownLocation.school:
        openSchool();
        break;
      case TownLocation.park:
        openPark();
        break;
      case TownLocation.home:
        openHome();
        break;
      case TownLocation.adventure:
        openAdventure();
        break;
      case TownLocation.center:
        setNavigationMode('3d');
        break;
      default:
        break;
    }
  }, [setLocation, openShop, openSchool, openPark, openHome, openAdventure, setNavigationMode]);



  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 flex items-center justify-center z-50">
      {/* Treasure Map Background */}
      <div 
        className="relative w-[90vw] h-[85vh] max-w-6xl max-h-4xl rounded-2xl shadow-2xl bg-gradient-to-br from-amber-50 to-orange-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(160, 82, 45, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(210, 180, 140, 0.2) 0%, transparent 30%)
          `,
          border: "8px solid #8B4513",
          borderStyle: "double"
        }}
      >
        {/* Map Title */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-4xl font-bold text-amber-900 mb-2" style={{ fontFamily: "serif" }}>
            🗺️ Adventure Pets Map 🗺️
          </h1>
          <p className="text-lg text-amber-700">Choose your destination!</p>
        </div>

        {/* Player Info */}
        <div className="absolute top-4 left-4 bg-white/80 rounded-xl p-4 shadow-lg border-2 border-amber-600">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full border-3 border-amber-600"
              style={{ backgroundColor: player?.color || "#4FC3F7" }}
            ></div>
            <div>
              <h3 className="font-bold text-amber-900">{player?.name || "Adventurer"}</h3>
              <p className="text-sm text-amber-700">💰 {player?.coins || 0} coins</p>
            </div>
          </div>
          {pet && (
            <div className="mt-2 flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-amber-500"
                style={{ backgroundColor: pet.color || "#AED581" }}
              ></div>
              <span className="text-sm font-medium text-amber-800">{pet.name} the {pet.type}</span>
            </div>
          )}
          {(!player || !pet) && (
            <div className="mt-2">
              <button
                onClick={() => useGameStore.getState().setGamePhase("welcome")}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded"
              >
                Start New Game
              </button>
            </div>
          )}
        </div>

        {/* Compass Rose */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-amber-800">
          🧭
        </div>

        {/* Location Markers */}
        {locations.map((location, index) => (
          <div
            key={location.id}
            className="absolute cursor-pointer z-10"
            style={{
              top: location.position.top,
              left: location.position.left,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleLocationClick(location.id)}
          >
            {/* Simple Location Button */}
            <div 
              className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-red-700 hover:scale-110 transition-transform"
            >
              {location.name.split(" ")[0]}
            </div>
            
            {/* Location Label */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded px-2 py-1 text-sm font-bold text-gray-800 shadow-lg whitespace-nowrap">
              {location.name}
            </div>
          </div>
        ))}

        {/* Decorative Map Elements */}
        <div className="absolute bottom-6 left-6 text-6xl opacity-30 transform -rotate-12">
          🏴‍☠️
        </div>
        <div className="absolute top-1/4 right-1/4 text-4xl opacity-20 transform rotate-45">
          ⚓
        </div>
        <div className="absolute bottom-1/3 right-8 text-5xl opacity-25 transform -rotate-12">
          🏰
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-4 shadow-lg border-2 border-amber-600 max-w-xs">
          <h4 className="font-bold text-amber-900 mb-2">🗝️ Map Legend</h4>
          <div className="space-y-1 text-sm text-amber-800">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600"></div>
              <span>Current Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-full border border-amber-600"></div>
              <span>Available Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-500"></div>
              <span>Locked Location</span>
            </div>
          </div>
        </div>

        {/* Paths between locations (decorative) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <path
              id="path1"
              d="M 15% 20% Q 30% 35% 50% 45%"
              stroke="#8B4513"
              strokeWidth="3"
              strokeDasharray="10,5"
              fill="none"
              opacity="0.4"
            />
            <path
              id="path2"
              d="M 50% 45% Q 65% 50% 75% 30%"
              stroke="#8B4513"
              strokeWidth="3"
              strokeDasharray="10,5"
              fill="none"
              opacity="0.4"
            />
            <path
              id="path3"
              d="M 50% 45% Q 35% 55% 25% 60%"
              stroke="#8B4513"
              strokeWidth="3"
              strokeDasharray="10,5"
              fill="none"
              opacity="0.4"
            />
            <path
              id="path4"
              d="M 50% 45% Q 60% 55% 70% 70%"
              stroke="#8B4513"
              strokeWidth="3"
              strokeDasharray="10,5"
              fill="none"
              opacity="0.4"
            />
          </defs>
          <use href="#path1" />
          <use href="#path2" />
          <use href="#path3" />
          <use href="#path4" />
        </svg>
      </div>
    </div>
  );
};

export default React.memo(TreasureMap);