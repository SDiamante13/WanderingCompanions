import { useState, useRef } from "react";
import { Text, Html } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import { useGameStore } from "../stores/useGameStore";
import { MIN_AGE, MAX_AGE } from "../constants";
import { GamePhase } from "../types";

const AgeVerification = () => {
  const { setGamePhase } = useGameStore();
  const [age, setAge] = useState<string>("");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Load textures
  const skyTexture = useTexture("/textures/sky.png");
  
  // Handle age change
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setAge(value);
      setError("");
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate age
    const numAge = parseInt(age, 10);
    
    if (isNaN(numAge)) {
      setError("Please enter your age");
      return;
    }
    
    if (numAge < MIN_AGE) {
      setError(`Sorry, you must be at least ${MIN_AGE} years old to play`);
      return;
    }
    
    if (numAge > MAX_AGE) {
      setError(`Please enter a valid age (up to ${MAX_AGE})`);
      return;
    }
    
    // Store age and proceed to character creation
    // You'd typically store this in your player state
    setGamePhase(GamePhase.character_creation);
  };
  
  return (
    <>
      {/* Sky backdrop */}
      <mesh position={[0, 0, -20]} scale={[40, 20, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={skyTexture} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
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
        Before We Begin
      </Text>
      
      {/* Instruction text */}
      <Text
        font="/fonts/inter.json"
        position={[0, 2.5, 0]}
        color="#424242"
        fontSize={0.5}
        maxWidth={8}
        lineHeight={1.2}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {`To give you the best experience, please tell us your age (minimum ${MIN_AGE} years old)`}
      </Text>
      
      {/* Age input form */}
      <Html position={[0, 0.5, 0]} center transform>
        <form 
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg w-80 border-4 border-primary"
        >
          <div className="mb-4">
            <label 
              htmlFor="age" 
              className="block font-fredoka text-lg text-foreground mb-2"
            >
              How old are you?
            </label>
            <input
              ref={inputRef}
              id="age"
              type="text"
              value={age}
              onChange={handleAgeChange}
              className="w-full p-3 border-2 border-primary rounded-full text-xl text-center font-fredoka focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              placeholder="Enter your age"
            />
            {error && (
              <p className="text-red-500 mt-2 text-sm font-fredoka">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="bubble-button w-full"
          >
            Continue
          </button>
        </form>
      </Html>
      
      {/* Decorative elements */}
      <group position={[-4, 0, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FFAB91" />
        </mesh>
      </group>
      
      <group position={[4, 0, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#AED581" />
        </mesh>
      </group>
    </>
  );
};

export default AgeVerification;
