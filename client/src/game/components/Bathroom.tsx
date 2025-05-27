import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";

interface BathroomProps {
  onClose: () => void;
}

const Bathroom = ({ onClose }: BathroomProps) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [washingGame, setWashingGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(10);
  const { player, spendCoins } = usePlayerStore();
  const { pet, updatePetHappiness, updatePetHealth } = usePetStore();

  const activities = [
    {
      id: "wash",
      name: "Give a Bath",
      description: "Clean your pet to restore 15 happiness and 5 health",
      icon: "🛁",
      cost: 3,
      happiness: 15,
      health: 5,
      time: 2000
    },
    {
      id: "brush",
      name: "Brush Teeth",
      description: "Keep those teeth sparkly clean! +10 happiness",
      icon: "🪥",
      cost: 2,
      happiness: 10,
      health: 0,
      time: 1500
    },
    {
      id: "groom",
      name: "Full Grooming",
      description: "Complete spa treatment! +25 happiness, +10 health",
      icon: "✨",
      cost: 8,
      happiness: 25,
      health: 10,
      time: 3000
    }
  ];

  const startWashingGame = () => {
    setWashingGame(true);
    setGameScore(0);
    setGameTime(10);
    
    const timer = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setWashingGame(false);
          const bonus = Math.floor(gameScore / 10);
          updatePetHappiness(bonus);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBubbleClick = () => {
    setGameScore(prev => prev + 1);
  };

  const handleActivity = async (activity: any) => {
    if (!player || !pet || player.coins < activity.cost) return;

    if (activity.id === "wash") {
      startWashingGame();
      return;
    }

    setSelectedActivity(activity.id);
    setCleaning(true);

    setTimeout(() => {
      spendCoins(activity.cost);
      updatePetHappiness(activity.happiness);
      if (activity.health > 0) {
        updatePetHealth(activity.health);
      }
      setCleaning(false);
      setSelectedActivity(null);
    }, activity.time);
  };

  const canAfford = (cost: number) => {
    return player && player.coins >= cost;
  };

  if (washingGame) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-500 max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Bubble Washing Game!</h2>
          <p className="text-gray-700 mb-4">Pop the bubbles to clean {pet?.name}!</p>
          
          <div className="mb-4">
            <div className="text-lg font-bold">Time: {gameTime}s</div>
            <div className="text-lg font-bold">Score: {gameScore}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Array.from({ length: 9 }, (_, i) => (
              <button
                key={i}
                className="w-16 h-16 bg-blue-200 rounded-full border-2 border-blue-400 hover:bg-blue-300 transition-colors"
                onClick={handleBubbleClick}
              >
                🫧
              </button>
            ))}
          </div>
          
          <p className="text-sm text-gray-600">
            Happiness bonus: +{Math.floor(gameScore / 10)}
          </p>
        </div>
      </div>
    );
  }

  if (cleaning) {
    const activity = activities.find(a => a.id === selectedActivity);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-500 max-w-md w-full text-center p-8">
          <div className="text-6xl mb-4 animate-pulse">{activity?.icon}</div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Cleaning...</h2>
          <p className="text-gray-700 mb-4">{activity?.name} for {pet?.name}!</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-500 h-4 rounded-full animate-pulse" style={{ width: "70%" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-500 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 bg-blue-500 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🛁 Bathroom</h1>
          <p className="text-lg">Keep your pet clean and healthy!</p>
        </div>

        <div className="p-4 bg-blue-100 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-blue-500"
                style={{ backgroundColor: player?.color || "#4FC3F7" }}
              ></div>
              <div>
                <p className="font-bold text-gray-800">{player?.name || "Caretaker"}</p>
                <p className="text-sm text-gray-600">💰 {player?.coins || 0} coins</p>
              </div>
            </div>
            {pet && (
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                  style={{ backgroundColor: pet.color || "#AED581" }}
                ></div>
                <div>
                  <p className="font-bold text-gray-800">{pet.name}</p>
                  <p className="text-sm text-gray-600">❤️ {pet.health}/{pet.maxHealth}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hygiene Activities</h2>
          <div className="grid grid-cols-1 gap-4">
            {activities.map((activity) => {
              const affordable = canAfford(activity.cost);
              
              return (
                <div
                  key={activity.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    affordable
                      ? "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
                      : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => affordable && handleActivity(activity)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{activity.name}</h3>
                      <p className={`text-sm ${affordable ? "text-white/90" : "text-gray-500"}`}>
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`text-sm font-bold ${affordable ? "text-white" : "text-gray-600"}`}>
                          💰 {activity.cost} coins
                        </span>
                        <span className={`text-sm ${affordable ? "text-white/90" : "text-gray-500"}`}>
                          😊 +{activity.happiness} happiness
                        </span>
                        {activity.health > 0 && (
                          <span className={`text-sm ${affordable ? "text-white/90" : "text-gray-500"}`}>
                            ❤️ +{activity.health} health
                          </span>
                        )}
                      </div>
                    </div>
                    {!affordable && (
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Not enough coins
                      </div>
                    )}
                    {activity.id === "wash" && affordable && (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Mini-game!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xl">🧼</span>
              <div>
                <h4 className="font-bold text-green-800 mb-1">Hygiene Tips:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Regular baths keep your pet happy and healthy</li>
                  <li>• Try the bubble washing mini-game for bonus happiness</li>
                  <li>• Clean pets are more resistant to illness</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            🧽 A clean pet is a happy pet!
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

export default Bathroom;