import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { PetType } from "../types";
import * as THREE from "three";

interface PetProps {
  type: PetType;
  color: string;
  size?: number;
  animated?: boolean;
}

const Pet = ({ type, color, size = 1, animated = true }: PetProps) => {
  const petRef = useRef<THREE.Group>(null);
  
  // Simple animation for pets
  useFrame(({ clock }) => {
    if (animated && petRef.current) {
      const t = clock.getElapsedTime();
      petRef.current.position.y = Math.sin(t * 2) * 0.1; // Gentle floating animation
      
      // Different animation based on pet type
      switch (type) {
        case PetType.dog:
          // Wagging tail effect
          if (petRef.current.children[1]) {
            petRef.current.children[1].rotation.y = Math.sin(t * 8) * 0.3;
          }
          break;
        case PetType.cat:
          // Ear twitching
          if (petRef.current.children[1] && petRef.current.children[2]) {
            petRef.current.children[1].rotation.z = Math.sin(t * 3) * 0.1;
            petRef.current.children[2].rotation.z = -Math.sin(t * 3) * 0.1;
          }
          break;
        case PetType.bird:
          // Wing flapping
          if (petRef.current.children[1] && petRef.current.children[2]) {
            petRef.current.children[1].rotation.y = Math.sin(t * 10) * 0.3;
            petRef.current.children[2].rotation.y = -Math.sin(t * 10) * 0.3;
          }
          break;
        // Other pets have a gentle bobbing motion (default)
      }
    }
  });
  
  return (
    <group ref={petRef} scale={[size, size, size]}>
      {/* Render different pet models based on type */}
      {renderPet(type, color)}
    </group>
  );
};

// Helper function to render different pet types
const renderPet = (type: PetType, color: string) => {
  switch (type) {
    case PetType.dog:
      return (
        <>
          {/* Body */}
          <mesh castShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 0.6, 1.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Tail */}
          <mesh castShadow position={[0, 0.5, 0.8]}>
            <boxGeometry args={[0.2, 0.2, 0.6]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Head */}
          <mesh castShadow position={[0, 0.7, -0.6]}>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Ears */}
          <mesh castShadow position={[0.3, 1, -0.6]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.3, 1, -0.6]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[0.2, 0.8, -1]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.2, 0.8, -1]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          {/* Legs */}
          <mesh castShadow position={[0.3, 0.15, -0.3]}>
            <boxGeometry args={[0.2, 0.3, 0.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.3, 0.15, -0.3]}>
            <boxGeometry args={[0.2, 0.3, 0.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[0.3, 0.15, 0.3]}>
            <boxGeometry args={[0.2, 0.3, 0.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.3, 0.15, 0.3]}>
            <boxGeometry args={[0.2, 0.3, 0.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      );
      
    case PetType.cat:
      return (
        <>
          {/* Body */}
          <mesh castShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.8, 0.5, 1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Tail */}
          <mesh castShadow position={[0, 0.5, 0.7]}>
            <cylinderGeometry args={[0.05, 0.1, 0.8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Head */}
          <mesh castShadow position={[0, 0.6, -0.5]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Ears */}
          <mesh castShadow position={[0.2, 0.9, -0.5]} rotation={[0, 0, Math.PI/4]}>
            <coneGeometry args={[0.1, 0.2, 4]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.2, 0.9, -0.5]} rotation={[0, 0, -Math.PI/4]}>
            <coneGeometry args={[0.1, 0.2, 4]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[0.15, 0.65, -0.8]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.15, 0.65, -0.8]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          {/* Legs */}
          <mesh castShadow position={[0.25, 0.15, -0.3]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.25, 0.15, -0.3]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[0.25, 0.15, 0.3]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.25, 0.15, 0.3]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      );
      
    case PetType.rabbit:
      return (
        <>
          {/* Body */}
          <mesh castShadow position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Head */}
          <mesh castShadow position={[0, 0.6, -0.4]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Ears */}
          <mesh castShadow position={[0.1, 1, -0.4]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.1, 0.5, 0.05]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.1, 1, -0.4]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.1, 0.5, 0.05]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[0.1, 0.65, -0.65]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.1, 0.65, -0.65]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          {/* Feet */}
          <mesh castShadow position={[0.2, 0.1, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.2, 0.1, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Tail */}
          <mesh castShadow position={[0, 0.3, 0.5]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </>
      );
      
    case PetType.bird:
      return (
        <>
          {/* Body */}
          <mesh castShadow position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Wings */}
          <mesh castShadow position={[0.3, 0.5, 0]} rotation={[0, 0, Math.PI/4]}>
            <boxGeometry args={[0.4, 0.1, 0.3]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[-0.3, 0.5, 0]} rotation={[0, 0, -Math.PI/4]}>
            <boxGeometry args={[0.4, 0.1, 0.3]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Head */}
          <mesh castShadow position={[0, 0.7, -0.25]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Beak */}
          <mesh castShadow position={[0, 0.7, -0.45]} rotation={[Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.05, 0.2, 4]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[0.1, 0.75, -0.35]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.1, 0.75, -0.35]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          {/* Feet */}
          <mesh castShadow position={[0.1, 0.2, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.05]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          <mesh castShadow position={[-0.1, 0.2, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.05]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        </>
      );
      
    // Handle other pet types with simple designs
    default:
      return (
        <>
          {/* Generic pet body */}
          <mesh castShadow position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[0.2, 0.7, -0.4]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.2, 0.7, -0.4]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </>
      );
  }
};

export default Pet;