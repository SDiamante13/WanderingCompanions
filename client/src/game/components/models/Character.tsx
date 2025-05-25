import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CharacterProps {
  color?: string;
  scale?: number;
}

const Character: React.FC<CharacterProps> = ({ 
  color = "#4FC3F7",
  scale = 1 
}) => {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  
  // Animate character with subtle movements
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Subtle body movement
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
    
    // Subtle head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
      headRef.current.rotation.z = Math.sin(t * 0.4) * 0.05;
    }
    
    // Arm swinging
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 1.5) * 0.2;
      rightArmRef.current.rotation.x = Math.sin(t * 1.5 + Math.PI) * 0.2;
    }
    
    // Leg movement
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t * 1.5) * 0.1;
      rightLegRef.current.rotation.x = Math.sin(t * 1.5 + Math.PI) * 0.1;
    }
  });
  
  return (
    <group ref={group} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} />
        
        {/* Eyes */}
        <group position={[0, 0, 0.26]}>
          {/* Left eye */}
          <mesh position={[-0.12, 0.05, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="white" />
            
            {/* Pupil */}
            <mesh position={[0, 0, 0.05]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color="black" />
            </mesh>
          </mesh>
          
          {/* Right eye */}
          <mesh position={[0.12, 0.05, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="white" />
            
            {/* Pupil */}
            <mesh position={[0, 0, 0.05]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color="black" />
            </mesh>
          </mesh>
        </group>
        
        {/* Mouth */}
        <mesh position={[0, -0.12, 0.26]}>
          <boxGeometry args={[0.2, 0.05, 0.01]} />
          <meshBasicMaterial color="#FF6B6B" />
        </mesh>
      </mesh>
      
      {/* Left Arm */}
      <group position={[-0.4, 0.7, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group position={[0.4, 0.7, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      
      {/* Left Leg */}
      <group position={[-0.2, 0.2, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial color="#5D4037" /> {/* Brown color for pants */}
        </mesh>
      </group>
      
      {/* Right Leg */}
      <group position={[0.2, 0.2, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial color="#5D4037" /> {/* Brown color for pants */}
        </mesh>
      </group>
    </group>
  );
};

export default Character;
