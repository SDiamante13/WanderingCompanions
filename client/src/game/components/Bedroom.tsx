import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";
import { useGameStore } from "../stores/useGameStore";

interface BedroomProps {
  onClose: () => void;
}

const Bedroom = ({ onClose }: BedroomProps) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [resting, setResting] = useState(false);
  const [sleepTime, setSleepTime] = useState(8);
  const { player, updatePlayerHealth } = usePlayerStore();
  const { pet, updatePetHealth, updatePetHappiness } = usePetStore();
  const { saveGame } = useGameStore();

  const activities = [
    {
      id: "nap",
      name: "Take a Nap",
      description: "Quick 30 minute rest to restore 10 health",
      icon: "😴",
      duration: 2000,
      playerHealth: 10,
      petHealth: 5,
      petHappiness: 5,
      timeText: "30 minutes"
    },
    {
      id: "sleep",
      name: "Good Night's Sleep",
      description: "Full 8 hour sleep to restore significant health",
      icon: "🌙",
      duration: 4000,
      playerHealth: 30,
      petHealth: 20,
      petHappiness: 15,
      timeText: "8 hours"
    },
    {
      id: "dream",
      name: "Sweet Dreams",
      description: "Magical sleep that restores health and happiness",
      icon: "✨",
      duration: 3000,
      playerHealth: 25,
      petHealth: 25,
      petHappiness: 25,
      timeText: "Dream time"
    }
  ];

  const handleRest = async (activity: any) => {
    if (!player || !pet) return;

    setSelectedActivity(activity.id);
    setResting(true);

    setTimeout(() => {
      updatePlayerHealth(activity.playerHealth);
      updatePetHealth(activity.petHealth);
      updatePetHappiness(activity.petHappiness);
      
      if (activity.id === "sleep") {
        saveGame();
      }
      
      setResting(false);
      setSelectedActivity(null);
    }, activity.duration);
  };

  const handleCustomSleep = () => {
    if (!player || !pet || sleepTime < 1 || sleepTime > 12) return;

    setSelectedActivity("custom");
    setResting(true);

    const healthBonus = Math.floor(sleepTime * 3);
    const happinessBonus = Math.floor(sleepTime * 2);

    setTimeout(() => {
      updatePlayerHealth(healthBonus);
      updatePetHealth(healthBonus);
      updatePetHappiness(happinessBonus);
      saveGame();
      
      setResting(false);
      setSelectedActivity(null);
    }, sleepTime * 300);
  };

  if (resting) {
    const activity = activities.find(a => a.id === selectedActivity) || {
      name: `Sleep for ${sleepTime} hours`,
      icon: "😴",
      timeText: `${sleepTime} hours`
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-purple-500 max-w-md w-full text-center p-8">
          <div className="text-6xl mb-4 animate-pulse">{activity.icon}</div>
          <h2 className="text-2xl font-bold text-purple-600 mb-2">Sleeping...</h2>
          <p className="text-gray-700 mb-4">{pet?.name} is resting peacefully...</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-purple-500 h-4 rounded-full animate-pulse" style={{ width: "70%" }}></div>
          </div>
          <p className="text-sm text-gray-600">Time: {activity.timeText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-purple-500 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 bg-purple-500 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🛏️ Bedroom</h1>
          <p className="text-lg">Rest and recharge for new adventures!</p>
        </div>

        <div className="p-4 bg-purple-100 border-b border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-purple-500"
                style={{ backgroundColor: player?.color || "#4FC3F7" }}
              ></div>
              <div>
                <p className="font-bold text-gray-800">{player?.name || "Sleepy"}</p>
                <p className="text-sm text-gray-600">❤️ {player?.health}/{player?.maxHealth}</p>
              </div>
            </div>
            {pet && (
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                  style={{ backgroundColor: pet.color || "#AED581" }}
                ></div>
                <div>
                  <p className="font-bold text-gray-800">{pet.name}</p>
                  <div className="text-sm text-gray-600">
                    <span>❤️ {pet.health}/{pet.maxHealth}</span>
                    <span className="ml-2">😊 {pet.happiness}/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Rest Options</h2>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-xl border-2 transition-all cursor-pointer bg-purple-500 text-white hover:bg-purple-600 hover:scale-105"
                onClick={() => handleRest(activity)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{activity.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{activity.name}</h3>
                    <p className="text-sm text-white/90">{activity.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-white/90">
                        ❤️ +{activity.playerHealth} (You)
                      </span>
                      <span className="text-sm text-white/90">
                        ❤️ +{activity.petHealth} (Pet)
                      </span>
                      <span className="text-sm text-white/90">
                        😊 +{activity.petHappiness} happiness
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 mb-6">
            <h3 className="font-bold text-indigo-800 mb-3">Custom Sleep Duration</h3>
            <div className="flex items-center gap-4">
              <label className="text-indigo-700">Sleep for:</label>
              <input
                type="range"
                min="1"
                max="12"
                value={sleepTime}
                onChange={(e) => setSleepTime(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-indigo-800 font-bold">{sleepTime} hours</span>
            </div>
            <div className="mt-2 text-sm text-indigo-600">
              Health: +{Math.floor(sleepTime * 3)} | Happiness: +{Math.floor(sleepTime * 2)}
            </div>
            <button
              onClick={handleCustomSleep}
              className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              💤 Sleep for {sleepTime} hours
            </button>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <span className="text-yellow-500 text-xl">🌟</span>
              <div>
                <h4 className="font-bold text-yellow-800 mb-1">Sleep Benefits:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Restores health for both you and your pet</li>
                  <li>• Increases pet happiness and well-being</li>
                  <li>• Full sleep automatically saves your progress</li>
                  <li>• Sweet Dreams provides magical restoration bonuses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💤 Rest well to prepare for tomorrow's adventures!
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

export default Bedroom;