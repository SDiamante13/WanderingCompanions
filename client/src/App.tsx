import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { Controls } from "./game/types";
import { useGameStore } from "./game/stores/useGameStore";
import WelcomeScreen from "./game/components/WelcomeScreen";
import AgeVerification from "./game/components/AgeVerification";
import CharacterCreation from "./game/components/CharacterCreation";
import PetAssignment from "./game/components/PetAssignment";
import Town from "./game/components/Town";
import TreasureMap from "./game/components/TreasureMap";
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
  const navigationMode = useGameStore((state) => state.navigationMode);
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
      {/* Show TreasureMap in 2D mode */}
      {navigationMode === '2d' && <TreasureMap />}

      {/* Show Canvas in 3D mode only */}
      {navigationMode === '3d' && (
        <div className="fixed inset-0 z-10">
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
        </div>
      )}

      {/* UI elements outside of Canvas */}
      <GameInterface />
      <SoundManager />
    </KeyboardControls>
  );
}

export default App;
