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
      
      {/* Age verification screen */}
      {gamePhase === "age_verification" && (
        <div className="fixed inset-0 bg-blue-100 flex flex-col items-center justify-center z-10">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center w-96 max-w-full">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Before We Begin</h1>
            <p className="text-gray-700 mb-6">To give you the best experience, please tell us your age</p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const ageInput = document.getElementById('age-input') as HTMLInputElement;
                const age = parseInt(ageInput.value, 10);
                
                if (isNaN(age)) {
                  alert('Please enter a valid age');
                } else if (age < 7) {
                  alert('Sorry, you must be at least 7 years old to play');
                } else if (age > 99) {
                  alert('Please enter a valid age (up to 99)');
                } else {
                  // Set the player's age in the player store
                  useGameStore.getState().setGamePhase("character_creation");
                }
              }}
              className="flex flex-col items-center"
            >
              <input
                id="age-input"
                type="number"
                min="7"
                max="99"
                placeholder="Your age"
                className="w-full p-3 border-2 border-blue-300 rounded-full text-xl text-center mb-6"
                required
              />
              
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold text-lg shadow-md hover:bg-blue-600 transition"
              >
                Continue
              </button>
            </form>
            
            <div className="mt-8 flex justify-center space-x-6">
              <div className="w-12 h-12 bg-orange-300 rounded-lg shadow-md"></div>
              <div className="w-12 h-12 bg-green-300 rounded-lg shadow-md"></div>
              <div className="w-12 h-12 bg-blue-300 rounded-lg shadow-md"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Character Creation screen */}
      {gamePhase === "character_creation" && (
        <div className="fixed inset-0 bg-blue-100 flex flex-col items-center justify-center z-10">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center w-[450px] max-w-full">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Create Your Character</h1>
            <p className="text-gray-700 mb-6">Customize your character for your pet adventure!</p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const nameInput = document.getElementById('character-name') as HTMLInputElement;
                const colorInput = document.getElementById('character-color') as HTMLInputElement;
                const name = nameInput.value.trim();
                const color = colorInput.value;
                
                if (!name) {
                  alert('Please enter a name for your character');
                } else {
                  // Set player name and color, then proceed to pet assignment
                  useGameStore.getState().setGamePhase("pet_assignment");
                }
              }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 w-full">
                <label htmlFor="character-name" className="block text-left text-gray-700 mb-2">Your Name:</label>
                <input
                  id="character-name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 border-2 border-blue-300 rounded-full text-xl mb-4"
                  required
                />
                
                <label htmlFor="character-color" className="block text-left text-gray-700 mb-2">Choose your favorite color:</label>
                <div className="flex justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-transparent hover:border-gray-400 cursor-pointer" 
                       onClick={() => (document.getElementById('character-color') as HTMLInputElement).value = '#4FC3F7'}></div>
                  <div className="w-12 h-12 rounded-full bg-green-500 border-2 border-transparent hover:border-gray-400 cursor-pointer"
                       onClick={() => (document.getElementById('character-color') as HTMLInputElement).value = '#AED581'}></div>
                  <div className="w-12 h-12 rounded-full bg-red-500 border-2 border-transparent hover:border-gray-400 cursor-pointer"
                       onClick={() => (document.getElementById('character-color') as HTMLInputElement).value = '#FF8A65'}></div>
                  <div className="w-12 h-12 rounded-full bg-purple-500 border-2 border-transparent hover:border-gray-400 cursor-pointer"
                       onClick={() => (document.getElementById('character-color') as HTMLInputElement).value = '#B39DDB'}></div>
                  <div className="w-12 h-12 rounded-full bg-yellow-500 border-2 border-transparent hover:border-gray-400 cursor-pointer"
                       onClick={() => (document.getElementById('character-color') as HTMLInputElement).value = '#FFD54F'}></div>
                </div>
                <input
                  id="character-color"
                  type="hidden"
                  defaultValue="#4FC3F7"
                />
              </div>
              
              <div className="mt-4 mb-6 bg-gray-100 p-4 rounded-lg">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-500" id="character-preview"></div>
                <p className="mt-2 text-gray-500 text-sm">Your Character</p>
              </div>
              
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold text-lg shadow-md hover:bg-blue-600 transition"
              >
                Next: Choose Your Pet
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Pet Assignment Screen */}
      {gamePhase === "pet_assignment" && (
        <div className="fixed inset-0 bg-blue-100 flex flex-col items-center justify-center z-10">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center w-[550px] max-w-full">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Choose Your Pet</h1>
            <p className="text-gray-700 mb-6">Select a pet companion for your adventure!</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div 
                className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition" 
                onClick={() => {
                  document.getElementById('pet-type')!.value = 'dog';
                  document.getElementById('pet-preview')!.style.backgroundColor = '#AED581';
                  document.getElementById('pet-label')!.innerText = 'Dog';
                }}
              >
                <div className="w-16 h-16 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="font-medium">Dog</p>
              </div>
              
              <div 
                className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition" 
                onClick={() => {
                  document.getElementById('pet-type')!.value = 'cat';
                  document.getElementById('pet-preview')!.style.backgroundColor = '#FFD54F';
                  document.getElementById('pet-label')!.innerText = 'Cat';
                }}
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                <p className="font-medium">Cat</p>
              </div>
              
              <div 
                className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition" 
                onClick={() => {
                  document.getElementById('pet-type')!.value = 'rabbit';
                  document.getElementById('pet-preview')!.style.backgroundColor = '#FFAB91';
                  document.getElementById('pet-label')!.innerText = 'Rabbit';
                }}
              >
                <div className="w-16 h-16 bg-orange-300 rounded-full mx-auto mb-2"></div>
                <p className="font-medium">Rabbit</p>
              </div>
              
              <div 
                className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition" 
                onClick={() => {
                  document.getElementById('pet-type')!.value = 'bird';
                  document.getElementById('pet-preview')!.style.backgroundColor = '#81D4FA';
                  document.getElementById('pet-label')!.innerText = 'Bird';
                }}
              >
                <div className="w-16 h-16 bg-blue-300 rounded-full mx-auto mb-2"></div>
                <p className="font-medium">Bird</p>
              </div>
              
              <div 
                className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition" 
                onClick={() => {
                  document.getElementById('pet-type')!.value = 'turtle';
                  document.getElementById('pet-preview')!.style.backgroundColor = '#A5D6A7';
                  document.getElementById('pet-label')!.innerText = 'Turtle';
                }}
              >
                <div className="w-16 h-16 bg-green-300 rounded-full mx-auto mb-2"></div>
                <p className="font-medium">Turtle</p>
              </div>
              
              <div 
                className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition" 
                onClick={() => {
                  document.getElementById('pet-type')!.value = 'hamster';
                  document.getElementById('pet-preview')!.style.backgroundColor = '#CE93D8';
                  document.getElementById('pet-label')!.innerText = 'Hamster';
                }}
              >
                <div className="w-16 h-16 bg-purple-300 rounded-full mx-auto mb-2"></div>
                <p className="font-medium">Hamster</p>
              </div>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const nameInput = document.getElementById('pet-name') as HTMLInputElement;
                const typeInput = document.getElementById('pet-type') as HTMLInputElement;
                const name = nameInput.value.trim();
                const type = typeInput.value;
                
                if (!name) {
                  alert('Please enter a name for your pet');
                } else if (!type) {
                  alert('Please select a pet type');
                } else {
                  // Save pet information and start the game
                  useGameStore.getState().setGamePhase("town");
                }
              }}
              className="flex flex-col items-center"
            >
              <div className="mt-4 mb-6 bg-gray-100 p-4 rounded-lg flex items-center">
                <div className="w-20 h-20 rounded-full bg-green-400" id="pet-preview"></div>
                <div className="ml-4 text-left">
                  <p className="text-gray-500 text-sm">Your Pet:</p>
                  <p className="font-bold text-lg" id="pet-label">Dog</p>
                  <input
                    id="pet-name"
                    type="text"
                    placeholder="Pet's name"
                    className="mt-1 p-2 border-2 border-blue-300 rounded-full text-sm"
                    required
                  />
                </div>
              </div>
              
              <input
                id="pet-type"
                type="hidden"
                defaultValue="dog"
              />
              
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold text-lg shadow-md hover:bg-blue-600 transition"
              >
                Start Adventure
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Town Screen */}
      {gamePhase === "town" && (
        <div className="fixed inset-0 bg-blue-100 flex flex-col items-center justify-center z-10">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center w-[550px] max-w-full">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Welcome to Pet Town!</h1>
            <p className="text-gray-700 mb-6">Explore the town with your pet companion!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <div className="w-16 h-16 bg-orange-300 rounded-lg mx-auto mb-2"></div>
                <p className="font-medium">Home</p>
                <p className="text-xs text-gray-500">Rest and play with your pet</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <div className="w-16 h-16 bg-blue-300 rounded-lg mx-auto mb-2"></div>
                <p className="font-medium">Pet Shop</p>
                <p className="text-xs text-gray-500">Buy food and toys</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <div className="w-16 h-16 bg-green-300 rounded-lg mx-auto mb-2"></div>
                <p className="font-medium">Park</p>
                <p className="text-xs text-gray-500">Meet other pets and play</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <div className="w-16 h-16 bg-red-300 rounded-lg mx-auto mb-2"></div>
                <p className="font-medium">Adventure</p>
                <p className="text-xs text-gray-500">Go on an adventure with your pet</p>
              </div>
            </div>
            
            <div className="mt-4 mb-6 bg-gray-100 p-4 rounded-lg flex items-center">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
                <div className="w-16 h-16 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-4 text-left">
                <p className="font-bold">You and your pet are ready for adventures!</p>
                <p className="text-sm text-gray-500">Click on a location to explore</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              This is a simple demo of a pet adventure game. In a complete game, you would be able to interact with these locations, play with your pet, go on adventures, and more!
            </p>
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
