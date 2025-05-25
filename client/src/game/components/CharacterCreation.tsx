import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { GamePhase } from "../types";
import Character from "./models/Character";

const CharacterCreation = () => {
  const { setGamePhase } = useGameStore();
  const { setPlayerName, setPlayerAge, setPlayerColor } = usePlayerStore();
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [color, setColor] = useState<string>("#4FC3F7");
  const [error, setError] = useState<string>("");
  const characterRef = useRef<THREE.Group>(null);
  
  // Color options
  const colorOptions = [
    "#4FC3F7", // Primary blue
    "#FFAB91", // Secondary coral
    "#AED581", // Accent green
    "#FF80AB", // Pink
    "#FFD54F", // Yellow
    "#9575CD", // Purple
  ];
  
  // Load textures
  const skyTexture = useTexture("/textures/sky.png");
  
  // Rotate character slowly
  useFrame((_, delta) => {
    if (characterRef.current) {
      characterRef.current.rotation.y += delta * 0.5;
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (name.length > 20) {
      setError("Name must be 20 characters or less");
      return;
    }
    
    if (!age || isNaN(parseInt(age))) {
      setError("Please enter a valid age");
      return;
    }
    
    const numAge = parseInt(age);
    if (numAge < 7 || numAge > 99) {
      setError("Age must be between 7 and 99");
      return;
    }
    
    // Save character data
    setPlayerName(name);
    setPlayerAge(numAge);
    setPlayerColor(color);
    
    // Move to pet assignment
    setGamePhase(GamePhase.pet_assignment);
  };
  
  // Pre-fill age if available from the previous screen
  useEffect(() => {
    // This would typically come from your player state
    // For now, we'll leave it empty
  }, []);
  
  return (
    <>
      {/* Sky backdrop */}
      <mesh position={[0, 0, -20]} scale={[40, 20, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={skyTexture} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      {/* Title */}
      <Text
        font="/fonts/inter.json"
        position={[0, 4, 0]}
        color="#424242"
        fontSize={1.2}
        maxWidth={10}
        lineHeight={1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        Create Your Character
      </Text>
      
      {/* Character preview */}
      <group ref={characterRef} position={[0, 1, -2]}>
        <Character color={color} />
      </group>
      
      {/* Character creation form */}
      <Html position={[0, 0, 0]} center transform>
        <form 
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg w-80 border-4 border-primary"
        >
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block font-fredoka text-lg text-foreground mb-2"
            >
              What's your name?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-primary rounded-full text-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              placeholder="Enter your name"
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="age" 
              className="block font-fredoka text-lg text-foreground mb-2"
            >
              How old are you?
            </label>
            <input
              id="age"
              type="text"
              value={age}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d+$/.test(value)) {
                  setAge(value);
                }
              }}
              className="w-full p-3 border-2 border-primary rounded-full text-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your age"
            />
          </div>
          
          <div className="mb-6">
            <label 
              className="block font-fredoka text-lg text-foreground mb-2"
            >
              Choose your favorite color:
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-10 h-10 rounded-full border-2 ${
                    color === c ? "border-gray-800 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 mb-4 text-sm font-fredoka">{error}</p>
          )}
          
          <button
            type="submit"
            className="bubble-button w-full"
          >
            Create Character
          </button>
        </form>
      </Html>
    </>
  );
};

export default CharacterCreation;
