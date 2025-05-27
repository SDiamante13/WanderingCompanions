import { useState } from "react";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import MathGame from "./MathGame";

const School = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showMathGame, setShowMathGame] = useState(false);
  const { closeSchool } = useGameStore();
  const { player } = usePlayerStore();

  const activities = [
    {
      id: "math",
      name: "Math Practice",
      description: "Practice addition and subtraction to earn coins!",
      icon: "🔢",
      color: "bg-blue-500",
      minAge: 7
    },
    {
      id: "reading",
      name: "Reading Corner",
      description: "Read stories about pets and adventures!",
      icon: "📚",
      color: "bg-green-500",
      minAge: 7
    },
    {
      id: "science",
      name: "Pet Science",
      description: "Learn about animal care and habitats!",
      icon: "🔬",
      color: "bg-purple-500",
      minAge: 8
    }
  ];

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId);
    
    if (activityId === "math") {
      setShowMathGame(true);
    } else {
      alert(`${activities.find(a => a.id === activityId)?.name} coming soon!`);
    }
  };

  if (showMathGame) {
    return <MathGame onClose={() => {
      console.log('MathGame closed');
      setShowMathGame(false);
    }} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-lg border-4 border-green-500 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-green-500 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">🏫 Welcome to School!</h1>
          <p className="text-lg">Choose a learning activity to get started</p>
        </div>

        {/* Player Info */}
        <div className="p-4 bg-green-100 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-green-500"
                style={{ backgroundColor: player?.color || "#4FC3F7" }}
              ></div>
              <div>
                <p className="font-bold text-gray-800">{player?.name || "Student"}</p>
                <p className="text-sm text-gray-600">Age: {player?.age || 7}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">💰</span>
              <span className="font-bold text-gray-700">{player?.coins || 0} coins</span>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => {
              const isAvailable = !player?.age || player.age >= activity.minAge;
              
              return (
                <div
                  key={activity.id}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isAvailable
                      ? `${activity.color} text-white hover:scale-105 hover:shadow-lg`
                      : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => isAvailable && handleActivitySelect(activity.id)}
                >
                  {!isAvailable && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                        Age {activity.minAge}+
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-4xl mb-2">{activity.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{activity.name}</h3>
                    <p className={`text-sm ${isAvailable ? "text-white/90" : "text-gray-500"}`}>
                      {activity.description}
                    </p>
                  </div>
                  
                  {isAvailable && selectedActivity === activity.id && (
                    <div className="absolute inset-0 bg-white/20 rounded-xl flex items-center justify-center">
                      <div className="bg-white text-gray-800 px-3 py-1 rounded-full font-bold">
                        Selected!
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-xl">💡</span>
              <div>
                <h4 className="font-bold text-blue-800 mb-1">Learning Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Complete activities to earn coins for the pet shop</li>
                  <li>• Math practice helps with everyday pet care calculations</li>
                  <li>• Take your time and don't worry about mistakes - learning is fun!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            🎯 Choose an activity to start learning!
          </div>
          <button
            onClick={() => {
              console.log('Leave School clicked');
              closeSchool();
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition-colors"
          >
            Leave School
          </button>
        </div>
      </div>
    </div>
  );
};

export default School;