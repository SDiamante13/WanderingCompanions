import React, { useState, useCallback } from "react";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";
import MathGame from "./MathGame";

const School = () => {
  const closeSchool = useGameStore((state) => state.closeSchool);
  const showSchool = useGameStore((state) => state.showSchool);
  const currentSubLocation = useGameStore((state) => state.currentSubLocation);
  const setSubLocation = useGameStore((state) => state.setSubLocation);
  const player = usePlayerStore((state) => state.player);
  const updateCoins = usePlayerStore((state) => state.updateCoins);
  const updatePlayerStats = usePlayerStore((state) => state.updatePlayerStats);
  const pet = usePetStore((state) => state.pet);
  const updatePetHappiness = usePetStore((state) => state.updatePetHappiness);

  const subLocations = [
    {
      id: "library",
      name: "📚 Library",
      description: "Read stories and unlock knowledge",
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600"
    },
    {
      id: "classroom",
      name: "🏫 Classroom",
      description: "Structured learning and courses",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      id: "studyroom",
      name: "📖 Study Room",
      description: "Focus activities and practice",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    }
  ];

  const handleSubLocationClick = useCallback((subLocationId: string) => {
    setSubLocation(subLocationId);
  }, [setSubLocation]);

  const handleBackToSchool = useCallback(() => {
    setSubLocation(null);
  }, [setSubLocation]);

  const Library = () => {
    const [reading, setReading] = useState(false);
    const [currentStory, setCurrentStory] = useState<string | null>(null);

    const stories = [
      { id: "pets", title: "Adventures of Fluffy", reward: 3, intelligence: 2 },
      { id: "science", title: "How Animals Live", reward: 4, intelligence: 3 },
      { id: "friendship", title: "Best Pet Friends", reward: 5, intelligence: 2 },
      { id: "nature", title: "Wild Animal Facts", reward: 6, intelligence: 4 }
    ];

    const readStory = (story: typeof stories[0]) => {
      setReading(true);
      setCurrentStory(story.title);
      setTimeout(() => {
        setReading(false);
        setCurrentStory(null);
        updateCoins(story.reward);
        updatePlayerStats("attack", story.intelligence);
        if (pet) {
          updatePetHappiness(10);
        }
        alert(`📖 You read "${story.title}"! +${story.reward} coins, +${story.intelligence} attack, pet +10 happiness`);
      }, 3000);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Library</h2>
        <p className="text-gray-600 mb-6">Discover stories and increase your knowledge through reading.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => readStory(story)}
              disabled={reading}
              className="p-4 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition disabled:bg-gray-400"
            >
              {reading && currentStory === story.title ? "Reading..." : story.title}
              <div className="text-sm mt-1">+{story.reward} coins, +{story.intelligence} attack</div>
            </button>
          ))}
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h3 className="font-bold text-indigo-800 mb-2">Library Benefits:</h3>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• Reading increases your intelligence and experience</li>
            <li>• Stories give coins and make your pet happy</li>
            <li>• Knowledge helps in battles and unlocks content</li>
          </ul>
        </div>
      </div>
    );
  };

  const Classroom = () => {
    const [showMathGame, setShowMathGame] = useState(false);
    const [studying, setStudying] = useState(false);

    const subjects = [
      { id: "math", name: "Math", icon: "🔢", difficulty: "Easy", reward: 4 },
      { id: "science", name: "Science", icon: "🔬", difficulty: "Medium", reward: 6 },
      { id: "language", name: "Language", icon: "📝", difficulty: "Easy", reward: 5 },
      { id: "history", name: "Pet History", icon: "📜", difficulty: "Hard", reward: 8 }
    ];

    const studySubject = (subject: typeof subjects[0]) => {
      if (subject.id === "math") {
        setShowMathGame(true);
        return;
      }

      setStudying(true);
      setTimeout(() => {
        setStudying(false);
        updateCoins(subject.reward);
        updatePlayerStats("defense", Math.floor(subject.reward / 2));
        if (pet) {
          updatePetHappiness(5);
        }
        alert(`🎓 Completed ${subject.name} lesson! +${subject.reward} coins, +${Math.floor(subject.reward / 2)} defense`);
      }, 4000);
    };

    if (showMathGame) {
      return <MathGame onClose={() => setShowMathGame(false)} />;
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🏫 Classroom</h2>
        <p className="text-gray-600 mb-6">Take structured lessons and build your knowledge systematically.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => studySubject(subject)}
              disabled={studying}
              className="p-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              <div className="text-2xl mb-2">{subject.icon}</div>
              {studying ? "Studying..." : subject.name}
              <div className="text-sm mt-1">{subject.difficulty} • +{subject.reward} coins, +{Math.floor(subject.reward / 2)} def</div>
            </button>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">Classroom Features:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Math includes interactive practice games</li>
            <li>• Structured learning builds knowledge systematically</li>
            <li>• Higher difficulty subjects give better rewards</li>
          </ul>
        </div>
      </div>
    );
  };

  const StudyRoom = () => {
    const [focusing, setFocusing] = useState(false);
    const [currentActivity, setCurrentActivity] = useState<string | null>(null);

    const activities = [
      { id: "focus", name: "Focus Training", duration: 3000, coins: 3, exp: 15 },
      { id: "memory", name: "Memory Game", duration: 4000, coins: 5, exp: 20 },
      { id: "homework", name: "Homework Help", duration: 5000, coins: 7, exp: 25 },
      { id: "review", name: "Subject Review", duration: 2000, coins: 2, exp: 10 }
    ];

    const startActivity = (activity: typeof activities[0]) => {
      setFocusing(true);
      setCurrentActivity(activity.name);
      setTimeout(() => {
        setFocusing(false);
        setCurrentActivity(null);
        updateCoins(activity.coins);
        updatePlayerStats("maxHealth", Math.floor(activity.exp / 5));
        if (pet) {
          updatePetHappiness(8);
        }
        alert(`✅ Completed ${activity.name}! +${activity.coins} coins, +${Math.floor(activity.exp / 5)} max health`);
      }, activity.duration);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 Study Room</h2>
        <p className="text-gray-600 mb-6">Practice focused learning and complete study activities.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => startActivity(activity)}
              disabled={focusing}
              className="p-4 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition disabled:bg-gray-400"
            >
              {focusing && currentActivity === activity.name ? "Working..." : activity.name}
              <div className="text-sm mt-1">+{activity.coins} coins, +{Math.floor(activity.exp / 5)} health</div>
            </button>
          ))}
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">Study Tips:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Regular practice improves focus and concentration</li>
            <li>• Memory games help retain information better</li>
            <li>• Consistent study habits lead to better results</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderSubLocation = () => {
    switch (currentSubLocation) {
      case "library":
        return <Library />;
      case "classroom":
        return <Classroom />;
      case "studyroom":
        return <StudyRoom />;
      default:
        return null;
    }
  };

  if (currentSubLocation) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70]">
        <div className="bg-white rounded-3xl shadow-lg border-4 border-green-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {renderSubLocation()}
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleBackToSchool}
                className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition"
              >
                ← Back to School
              </button>
              <button
                onClick={closeSchool}
                className="px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition"
              >
                Leave School
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
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

        {/* Sub-locations Grid */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Choose a Learning Area</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subLocations.map((area) => (
              <button
                key={area.id}
                onClick={() => handleSubLocationClick(area.id)}
                className={`p-4 ${area.color} text-white rounded-xl font-bold ${area.hoverColor} transition-all transform hover:scale-105`}
              >
                <div className="text-2xl mb-2">{area.name.split(' ')[0]}</div>
                <div className="text-sm font-normal">{area.description}</div>
              </button>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xl">🎓</span>
              <div>
                <h4 className="font-bold text-green-800 mb-1">Education Centers:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Library: Read stories to gain knowledge and intelligence</li>
                  <li>• Classroom: Take structured lessons with interactive games</li>
                  <li>• Study Room: Practice focus and memory skills</li>
                  <li>• All activities reward coins, experience, and pet happiness</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={closeSchool}
            className="px-6 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition-colors"
          >
            Leave School
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(School);