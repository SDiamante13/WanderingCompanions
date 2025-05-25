import { useState, useEffect, useRef } from "react";
import { Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useGameStore } from "../stores/useGameStore";
import { GamePhase } from "../types";
import * as THREE from "three";

const WelcomeScreen = () => {
  const { setGamePhase } = useGameStore();
  const { camera } = useThree();
  const [showStartButton, setShowStartButton] = useState(false);
  
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.repeat.set(10, 10);
  grassTexture.wrapS = 1000;
  grassTexture.wrapT = 1000;
  
  const skyTexture = useTexture("/textures/sky.png");
  
  // Set camera position
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    
    // Show start button after a short delay
    const timer = setTimeout(() => {
      setShowStartButton(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [camera]);
  
  // Button animation
  const buttonRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (buttonRef.current) {
      buttonRef.current.position.y = 1 + Math.sin(t * 1.5) * 0.1;
    }
  });
  
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
        fontSize={1.5}
        maxWidth={10}
        lineHeight={1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        Pet Adventure
      </Text>
      
      {/* Subtitle */}
      <Text
        font="/fonts/inter.json"
        position={[0, 2.5, 0]}
        color="#424242"
        fontSize={0.6}
        maxWidth={8}
        lineHeight={1.2}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        Begin your journey with a new animal friend!
      </Text>
      
      {/* Start button */}
      {showStartButton && (
        <mesh 
          ref={buttonRef}
          position={[0, 1, 0]}
          onClick={() => setGamePhase(GamePhase.age_verification)}
        >
          <cylinderGeometry args={[1.2, 1.2, 0.4, 32]} />
          <meshStandardMaterial color="#4FC3F7" />
          <Text
            position={[0, 0, 0.21]}
            color="white"
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
          >
            START
          </Text>
        </mesh>
      )}
      
      {/* Decorative elements */}
      <group position={[-4, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FFAB91" />
        </mesh>
      </group>
      
      <group position={[4, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#AED581" />
        </mesh>
      </group>
    </>
  );
};

export default WelcomeScreen;
