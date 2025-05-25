import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useGameStore } from "../stores/useGameStore";
import { usePetStore } from "../stores/usePetStore";
import { useAudio } from "../../lib/stores/useAudio";
import { PetType, GamePhase } from "../types";
import { PET_OPTIONS } from "../constants";
import Pet from "./models/Pet";

const AnimatedText = animated(Text);

const PetAssignment = () => {
  const { setGamePhase } = useGameStore();
  const { assignRandomPet, setPetName, pet } = usePetStore();
  const { playSuccess } = useAudio();
  
  const [assignmentComplete, setAssignmentComplete] = useState(false);
  const [customName, setCustomName] = useState("");
  const [nameError, setNameError] = useState("");
  const petRef = useRef<THREE.Group>(null);
  
  // Load textures
  const skyTexture = useTexture("/textures/sky.png");
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.repeat.set(10, 10);
  grassTexture.wrapS = 1000;
  grassTexture.wrapT = 1000;
  
  // Animation for the reveal text
  const revealTextSpring = useSpring({
    from: { position: [0, 3, 0], scale: 0.5, opacity: 0 },
    to: { 
      position: [0, 3, 0], 
      scale: assignmentComplete ? 1 : 0.5, 
      opacity: assignmentComplete ? 1 : 0 
    },
    config: { mass: 1, tension: 170, friction: 26 },
    delay: 300,
  });
  
  // Rotate pet for display
  useFrame((_, delta) => {
    if (petRef.current) {
      petRef.current.rotation.y += delta * 0.5;
    }
  });
  
  // Assign random pet on component mount
  useEffect(() => {
    // Only assign a pet if one doesn't exist
    if (!pet) {
      setTimeout(() => {
        assignRandomPet();
        playSuccess();
        setAssignmentComplete(true);
      }, 2000);
    } else {
      setAssignmentComplete(true);
      setCustomName(pet.name);
    }
  }, [assignRandomPet, pet, playSuccess]);
  
  // Handle name submission
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customName.trim()) {
      setNameError("Please enter a name for your pet");
      return;
    }
    
    if (customName.length > 20) {
      setNameError("Name must be 20 characters or less");
      return;
    }
    
    // Update pet name
    setPetName(customName);
    
    // Proceed to the town
    setGamePhase(GamePhase.town);
  };
  
  // Handle the "Keep Default Name" button
  const keepDefaultName = () => {
    // Just proceed to the town
    setGamePhase(GamePhase.town);
  };
  
  return (
    <>
      {/* Sky backdrop */}
      <mesh position={[0, 0, -20]} scale={[40, 20, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={skyTexture} />
      </mesh>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} scale={[20, 20, 1]}>
        <planeGeometry />
        <meshStandardMaterial map={grassTexture} />
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
        {assignmentComplete ? "Meet Your New Friend!" : "Finding Your Perfect Pet..."}
      </Text>
      
      {/* Pet reveal text */}
      {pet && (
        <AnimatedText
          font="/fonts/inter.json"
          position={revealTextSpring.position}
          scale={revealTextSpring.scale}
          color="#424242"
          fontSize={0.7}
          maxWidth={10}
          lineHeight={1.2}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={revealTextSpring.opacity}
        >
          {`You got a ${pet.type}!`}
        </AnimatedText>
      )}
      
      {/* Pet model */}
      {pet && (
        <group ref={petRef} position={[0, 0, -2]}>
          <Pet type={pet.type} color={pet.color} />
        </group>
      )}
      
      {/* Pet naming form (only shown after assignment) */}
      {assignmentComplete && pet && (
        <Html position={[0, -2, 0]} center transform>
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 border-4 border-primary">
            <h3 className="font-fredoka text-xl text-center mb-4">
              {`Your ${pet.type} is called ${pet.name}!`}
            </h3>
            
            <form onSubmit={handleNameSubmit}>
              <div className="mb-4">
                <label 
                  htmlFor="petName" 
                  className="block font-fredoka text-lg text-foreground mb-2"
                >
                  Want to give your pet a different name?
                </label>
                <input
                  id="petName"
                  type="text"
                  value={customName}
                  onChange={(e) => {
                    setCustomName(e.target.value);
                    setNameError("");
                  }}
                  className="w-full p-3 border-2 border-primary rounded-full text-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={pet.name}
                />
                {nameError && (
                  <p className="text-red-500 mt-1 text-sm font-fredoka">{nameError}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="bubble-button w-full"
                >
                  Save Name
                </button>
                <button
                  type="button"
                  onClick={keepDefaultName}
                  className="bubble-button-secondary w-full"
                >
                  Keep Default Name
                </button>
              </div>
            </form>
          </div>
        </Html>
      )}
      
      {/* Loading spinner (shown before assignment) */}
      {!assignmentComplete && (
        <Html position={[0, 0, 0]} center>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </Html>
      )}
    </>
  );
};

export default PetAssignment;
