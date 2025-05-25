import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { Controls, GamePhase } from "./game/types";
import { useGameStore } from "./game/stores/useGameStore";
import WelcomeScreen from "./game/components/WelcomeScreen";
import AgeVerification from "./game/components/AgeVerification";
import CharacterCreation from "./game/components/CharacterCreation";
import PetAssignment from "./game/components/PetAssignment";
import Town from "./game/components/Town";
import Battle from "./game/components/Battle";
import SoundManager from "./game/components/SoundManager";
import { GameInterface } from "./game/components/ui/GameInterface";
import LoadingScreen from "./game/components/ui/LoadingScreen";

// Define keyboard controls for the game
const keyboardMap = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.interact, keys: ["KeyE", "Space"] },
  { name: Controls.inventory, keys: ["KeyI"] },
];

function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const gamePhase = useGameStore((state) => state.gamePhase);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Initialize audio elements
  useEffect(() => {
    // Create and set up audio elements
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.5;

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.5;

    // Set audio in the store
    setBackgroundMusic(bgMusic);
    setHitSound(hit);
    setSuccessSound(success);

    // Show canvas after a short delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setShowCanvas(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      bgMusic.pause();
      hit.pause();
      success.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // For debugging, log the current game phase
  console.log("Current game phase:", gamePhase);

  // Render appropriate component based on game phase
  const renderGameContent = () => {
    switch (gamePhase) {
      case "welcome":
        return <WelcomeScreen />;
      case "age_verification":
        return <AgeVerification />;
      case "character_creation":
        return <CharacterCreation />;
      case "pet_assignment":
        return <PetAssignment />;
      case "town":
        return <Town />;
      case "battle":
        return <Battle />;
      default:
        console.log("Using default case, rendering WelcomeScreen");
        return <WelcomeScreen />;
    }
  };

  if (!showCanvas) {
    return <LoadingScreen />;
  }

  return (
    <KeyboardControls map={keyboardMap}>
      {/* Simple welcome screen overlay if we're in welcome phase */}
      {gamePhase === "welcome" && (
        <div className="fixed inset-0 bg-blue-100 flex flex-col items-center justify-center z-10">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center w-96 max-w-full">
            <h1 className="text-4xl font-bold text-blue-500 mb-4">Pet Adventure</h1>
            <p className="text-gray-700 mb-6">Begin your journey with a new animal friend!</p>
            <button 
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold text-lg shadow-md hover:bg-blue-600 transition"
              onClick={() => useGameStore.getState().setGamePhase("age_verification")}
            >
              START
            </button>
            
            <div className="mt-8 flex justify-center space-x-6">
              <div className="w-12 h-12 bg-orange-300 rounded-lg shadow-md"></div>
              <div className="w-12 h-12 bg-green-300 rounded-lg shadow-md"></div>
              <div className="w-12 h-12 bg-blue-300 rounded-lg shadow-md"></div>
            </div>
          </div>
        </div>
      )}
      
      <Canvas
        shadows
        camera={{
          position: [0, 5, 10],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          powerPreference: "default",
        }}
      >
        <color attach="background" args={["#87CEEB"]} />
        
        {/* Game content based on current phase */}
        <Suspense fallback={null}>
          {renderGameContent()}
        </Suspense>
      </Canvas>

      {/* UI elements outside of Canvas */}
      <GameInterface />
      <SoundManager />
    </KeyboardControls>
  );
}

export default App;
