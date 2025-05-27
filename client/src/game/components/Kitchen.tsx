import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";

interface KitchenProps {
  onClose: () => void;
}

const Kitchen = ({ onClose }: KitchenProps) => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [cooking, setCooking] = useState(false);
  const { player, spendCoins } = usePlayerStore();
  const { pet, updatePetHappiness, updatePetHealth } = usePetStore();

  const foods = [
    {
      id: "kibble",
      name: "Pet Kibble",
      description: "Basic food that restores 10 happiness",
      icon: "🥘",
      cost: 5,
      happiness: 10,
      health: 0,
      cookTime: 1000
    },
    {
      id: "treats",
      name: "Delicious Treats",
      description: "Tasty snacks that restore 20 happiness",
      icon: "🍪",
      cost: 10,
      happiness: 20,
      health: 0,
      cookTime: 2000
    },
    {
      id: "gourmet",
      name: "Gourmet Meal",
      description: "Premium food that restores 30 happiness and 10 health",
      icon: "🍗",
      cost: 20,
      happiness: 30,
      health: 10,
      cookTime: 3000
    }
  ];

  const handleCook = async (food: any) => {
    if (!player || !pet || player.coins < food.cost) return;

    setSelectedFood(food.id);
    setCooking(true);

    setTimeout(() => {
      spendCoins(food.cost);
      updatePetHappiness(food.happiness);
      if (food.health > 0) {
        updatePetHealth(food.health);
      }
      setCooking(false);
      setSelectedFood(null);
    }, food.cookTime);
  };

  const canAfford = (cost: number) => {
    return player && player.coins >= cost;
  };

  if (cooking) {
    const food = foods.find(f => f.id === selectedFood);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-yellow-500 max-w-md w-full text-center p-8">
          <div className="text-6xl mb-4 animate-pulse">{food?.icon}</div>
          <h2 className="text-2xl font-bold text-yellow-600 mb-2">Cooking...</h2>
          <p className="text-gray-700 mb-4">Preparing {food?.name} for {pet?.name}!</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-yellow-500 h-4 rounded-full animate-pulse" style={{ width: "70%" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-yellow-500 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 bg-yellow-500 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🍳 Kitchen</h1>
          <p className="text-lg">Cook delicious meals for your pet!</p>
        </div>

        <div className="p-4 bg-yellow-100 border-b border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-yellow-500"
                style={{ backgroundColor: player?.color || "#4FC3F7" }}
              ></div>
              <div>
                <p className="font-bold text-gray-800">{player?.name || "Chef"}</p>
                <p className="text-sm text-gray-600">💰 {player?.coins || 0} coins</p>
              </div>
            </div>
            {pet && (
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-yellow-500"
                  style={{ backgroundColor: pet.color || "#AED581" }}
                ></div>
                <div>
                  <p className="font-bold text-gray-800">{pet.name}</p>
                  <p className="text-sm text-gray-600">😊 {pet.happiness}/100</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">What would you like to cook?</h2>
          <div className="grid grid-cols-1 gap-4">
            {foods.map((food) => {
              const affordable = canAfford(food.cost);
              
              return (
                <div
                  key={food.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    affordable
                      ? "bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105"
                      : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => affordable && handleCook(food)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{food.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{food.name}</h3>
                      <p className={`text-sm ${affordable ? "text-white/90" : "text-gray-500"}`}>
                        {food.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`text-sm font-bold ${affordable ? "text-white" : "text-gray-600"}`}>
                          💰 {food.cost} coins
                        </span>
                        <span className={`text-sm ${affordable ? "text-white/90" : "text-gray-500"}`}>
                          😊 +{food.happiness} happiness
                        </span>
                        {food.health > 0 && (
                          <span className={`text-sm ${affordable ? "text-white/90" : "text-gray-500"}`}>
                            ❤️ +{food.health} health
                          </span>
                        )}
                      </div>
                    </div>
                    {!affordable && (
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Not enough coins
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-xl">💡</span>
              <div>
                <h4 className="font-bold text-blue-800 mb-1">Cooking Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Feed your pet regularly to keep happiness high</li>
                  <li>• Happy pets perform better in battles and activities</li>
                  <li>• Gourmet meals provide both happiness and health benefits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            🍽️ Keep your pet well-fed and happy!
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Kitchen;