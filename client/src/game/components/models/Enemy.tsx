import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface EnemyProps {
  type: string;
  level?: number;
  scale?: number;
}

const Enemy: React.FC<EnemyProps> = ({ 
  type, 
  level = 1, 
  scale = 1 
}) => {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  // Generate a deterministic color based on enemy type
  const getEnemyColor = () => {
    switch (type) {
      case "wild_cat":
        return "#FF9800"; // Orange
      case "angry_bird":
        return "#F44336"; // Red
      case "mischievous_monkey":
        return "#795548"; // Brown
      case "sneaky_snake":
        return "#9C27B0"; // Purple
      default:
        // Generate a deterministic color based on type string
        const hash = type.split("").reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a;
        }, 0);
        return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
    }
  };
  
  // Animate enemy with menacing movements
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (bodyRef.current) {
      // Menacing body movement
      bodyRef.current.rotation.y = Math.sin(t * 1.5) * 0.2;
      bodyRef.current.position.y = Math.sin(t * 2) * 0.05 + 0.5;
    }
    
    if (headRef.current) {
      // Menacing head movement
      headRef.current.rotation.z = Math.sin(t * 2) * 0.1;
    }
    
    if (group.current) {
      // Subtle hovering and rotating
      group.current.position.y = Math.sin(t) * 0.05;
      group.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });
  
  // Make enemies more menacing based on level
  const levelScale = 1 + (level - 1) * 0.1;
  
  // Render different enemy types
  const renderEnemy = () => {
    const baseColor = getEnemyColor();
    
    switch (type) {
      case "wild_cat":
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.5, 1] as any} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.8, 0.5]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.5, 0.5] as any} />
              <meshStandardMaterial color={baseColor} />
              
              {/* Eyes - angry */}
              <group position={[0, 0, 0.26]}>
                {/* Left eye */}
                <mesh position={[-0.15, 0.1, 0]}>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshBasicMaterial color="yellow" />
                  
                  {/* Pupil */}
                  <mesh position={[0, 0, 0.05]}>
                    <sphereGeometry args={[0.03, 16, 16]} />
                    <meshBasicMaterial color="black" />
                  </mesh>
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.15, 0.1, 0]}>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshBasicMaterial color="yellow" />
                  
                  {/* Pupil */}
                  <mesh position={[0, 0, 0.05]}>
                    <sphereGeometry args={[0.03, 16, 16]} />
                    <meshBasicMaterial color="black" />
                  </mesh>
                </mesh>
              </group>
              
              {/* Mouth - angry */}
              <mesh position={[0, -0.1, 0.26]}>
                <boxGeometry args={[0.3, 0.05, 0.01]} />
                <meshBasicMaterial color="red" />
              </mesh>
              
              {/* Ears - pointy */}
              <mesh position={[-0.2, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
                <coneGeometry args={[0.1, 0.2, 4]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <coneGeometry args={[0.1, 0.2, 4]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
            </mesh>
            
            {/* Tail */}
            <mesh position={[0, 0.5, -0.6]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.25, 0.15, 0.3]}>
              <boxGeometry args={[0.15, 0.3, 0.15]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[0.25, 0.15, 0.3]}>
              <boxGeometry args={[0.15, 0.3, 0.15]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[-0.25, 0.15, -0.3]}>
              <boxGeometry args={[0.15, 0.3, 0.15]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[0.25, 0.15, -0.3]}>
              <boxGeometry args={[0.15, 0.3, 0.15]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </>
        );
        
      case "angry_bird":
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.5, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.9, 0.2]} castShadow receiveShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={baseColor} />
              
              {/* Eyes - angry */}
              <group position={[0, 0, 0.25]}>
                {/* Left eye */}
                <mesh position={[-0.12, 0.05, 0]}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshBasicMaterial color="white" />
                  
                  {/* Pupil */}
                  <mesh position={[0, 0, 0.05]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshBasicMaterial color="black" />
                  </mesh>
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.12, 0.05, 0]}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshBasicMaterial color="white" />
                  
                  {/* Pupil */}
                  <mesh position={[0, 0, 0.05]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshBasicMaterial color="black" />
                  </mesh>
                </mesh>
                
                {/* Eyebrows */}
                <mesh position={[-0.12, 0.15, 0.05]} rotation={[0, 0, Math.PI / 6]}>
                  <boxGeometry args={[0.15, 0.03, 0.02]} />
                  <meshBasicMaterial color="black" />
                </mesh>
                <mesh position={[0.12, 0.15, 0.05]} rotation={[0, 0, -Math.PI / 6]}>
                  <boxGeometry args={[0.15, 0.03, 0.02]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </group>
              
              {/* Beak */}
              <mesh position={[0, 0, 0.35]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.1, 0.3, 4]} rotation={[0, 0, Math.PI / 4]} />
                <meshStandardMaterial color="yellow" />
              </mesh>
            </mesh>
            
            {/* Wings */}
            <mesh position={[-0.4, 0.5, 0]} rotation={[0, 0, -0.4]}>
              <boxGeometry args={[0.4, 0.1, 0.5]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[0.4, 0.5, 0]} rotation={[0, 0, 0.4]}>
              <boxGeometry args={[0.4, 0.1, 0.5]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Tail */}
            <mesh position={[0, 0.5, -0.4]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.2]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.1, 0.1, 0]}>
              <boxGeometry args={[0.05, 0.2, 0.05]} />
              <meshStandardMaterial color="yellow" />
            </mesh>
            <mesh position={[0.1, 0.1, 0]}>
              <boxGeometry args={[0.05, 0.2, 0.05]} />
              <meshStandardMaterial color="yellow" />
            </mesh>
          </>
        );
        
      case "mischievous_monkey":
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.7, 0.4]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 1, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial color={baseColor} />
              
              {/* Face - lighter color */}
              <mesh position={[0, 0, 0.2]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#D7CCC8" />
              </mesh>
              
              {/* Eyes */}
              <group position={[0, 0.1, 0.3]}>
                {/* Left eye */}
                <mesh position={[-0.15, 0, 0]}>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshBasicMaterial color="white" />
                  
                  {/* Pupil */}
                  <mesh position={[0, 0, 0.05]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshBasicMaterial color="black" />
                  </mesh>
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.15, 0, 0]}>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshBasicMaterial color="white" />
                  
                  {/* Pupil */}
                  <mesh position={[0, 0, 0.05]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshBasicMaterial color="black" />
                  </mesh>
                </mesh>
              </group>
              
              {/* Nose */}
              <mesh position={[0, -0.05, 0.32]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#6D4C41" />
              </mesh>
              
              {/* Mouth */}
              <mesh position={[0, -0.15, 0.3]}>
                <boxGeometry args={[0.15, 0.03, 0.01]} />
                <meshBasicMaterial color="#6D4C41" />
              </mesh>
              
              {/* Ears */}
              <mesh position={[-0.25, 0.2, 0]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              <mesh position={[0.25, 0.2, 0]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
            </mesh>
            
            {/* Arms */}
            <mesh position={[-0.35, 0.5, 0]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.5, 0.15, 0.15]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[0.35, 0.5, 0]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.5, 0.15, 0.15]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.15, 0, 0]}>
              <boxGeometry args={[0.15, 0.3, 0.15]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[0.15, 0, 0]}>
              <boxGeometry args={[0.15, 0.3, 0.15]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Tail */}
            <mesh position={[0, 0.4, -0.4]} rotation={[1, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </>
        );
        
      case "sneaky_snake":
        return (
          <>
            {/* Body - snake-like */}
            <group ref={bodyRef}>
              {/* Main body segments */}
              <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.3, 0.6, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              <mesh position={[0, 0.3, -0.5]} castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.25, 0.5, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              <mesh position={[0, 0.3, -1]} castShadow receiveShadow>
                <cylinderGeometry args={[0.25, 0.15, 0.5, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              <mesh position={[0, 0.3, -1.5]} castShadow receiveShadow>
                <cylinderGeometry args={[0.15, 0.05, 0.5, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              
              {/* Patterns on the snake */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.4, 0.05, 0.4]} />
                <meshStandardMaterial color="black" />
              </mesh>
              <mesh position={[0, 0.5, -0.8]} castShadow>
                <boxGeometry args={[0.3, 0.05, 0.3]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </group>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.3, 0.4]} castShadow receiveShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color={baseColor} />
              
              {/* Eyes - snake-like */}
              <group position={[0, 0.1, 0.2]}>
                {/* Left eye */}
                <mesh position={[-0.1, 0, 0]}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshBasicMaterial color="yellow" />
                  
                  {/* Slit pupil */}
                  <mesh position={[0, 0, 0.04]} rotation={[0, 0, Math.PI / 2]}>
                    <planeGeometry args={[0.03, 0.09]} />
                    <meshBasicMaterial color="black" side={THREE.DoubleSide} />
                  </mesh>
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.1, 0, 0]}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshBasicMaterial color="yellow" />
                  
                  {/* Slit pupil */}
                  <mesh position={[0, 0, 0.04]} rotation={[0, 0, Math.PI / 2]}>
                    <planeGeometry args={[0.03, 0.09]} />
                    <meshBasicMaterial color="black" side={THREE.DoubleSide} />
                  </mesh>
                </mesh>
              </group>
              
              {/* Snake tongue */}
              <group position={[0, -0.05, 0.3]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.02, 0.02, 0.1]} />
                  <meshBasicMaterial color="red" />
                </mesh>
                <mesh position={[0.05, 0, 0.1]}>
                  <boxGeometry args={[0.1, 0.01, 0.01]} />
                  <meshBasicMaterial color="red" />
                </mesh>
                <mesh position={[-0.05, 0, 0.1]}>
                  <boxGeometry args={[0.1, 0.01, 0.01]} />
                  <meshBasicMaterial color="red" />
                </mesh>
              </group>
            </mesh>
          </>
        );
        
      default:
        // Generic enemy
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.7, 0.7]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 1, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color={baseColor} />
              
              {/* Eyes */}
              <group position={[0, 0, 0.3]}>
                {/* Left eye */}
                <mesh position={[-0.15, 0.1, 0]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshBasicMaterial color="red" />
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.15, 0.1, 0]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshBasicMaterial color="red" />
                </mesh>
              </group>
              
              {/* Mouth */}
              <mesh position={[0, -0.1, 0.3]}>
                <boxGeometry args={[0.3, 0.1, 0.05]} />
                <meshBasicMaterial color="black" />
              </mesh>
            </mesh>
            
            {/* Limbs */}
            <mesh position={[-0.5, 0.5, 0]}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[0.5, 0.5, 0]}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[-0.3, 0, 0]}>
              <boxGeometry args={[0.3, 0.5, 0.3]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            <mesh position={[0.3, 0, 0]}>
              <boxGeometry args={[0.3, 0.5, 0.3]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          </>
        );
    }
  };
  
  return (
    <group 
      ref={group} 
      scale={[scale * levelScale, scale * levelScale, scale * levelScale]}
    >
      {renderEnemy()}
      
      {/* Level indicator stars */}
      {Array.from({ length: level }).map((_, index) => (
        <mesh 
          key={index} 
          position={[
            0.3 * (index - (level - 1) / 2), 
            1.5, 
            0
          ]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

export default Enemy;
