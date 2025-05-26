import { useState, useEffect, useRef } from "react";
import { Text, useTexture, Html } from "@react-three/drei";
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
      
      {/* Fallback HTML overlay for better visibility */}
      <Html fullscreen>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '30px 50px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              color: '#4FC3F7', 
              margin: '0 0 10px 0',
              fontFamily: 'Fredoka, sans-serif'
            }}>
              Adventure Pets
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#424242',
              marginBottom: '30px',
              fontFamily: 'Fredoka, sans-serif'
            }}>
              Begin your journey with a new animal friend!
            </p>
            <button
              style={{
                background: '#4FC3F7',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                fontSize: '1.2rem',
                borderRadius: '50px',
                cursor: 'pointer',
                pointerEvents: 'all',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                fontFamily: 'Fredoka, sans-serif'
              }}
              onClick={() => setGamePhase(GamePhase.age_verification)}
            >
              START
            </button>
          </div>
        </div>
      </Html>
      
      {/* Title - Keep 3D elements as backup */}
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
        Adventure Pets
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
