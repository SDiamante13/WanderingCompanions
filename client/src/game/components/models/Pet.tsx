import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PetType } from "../../types";

interface PetProps {
  type: PetType;
  color?: string;
  scale?: number;
}

const Pet: React.FC<PetProps> = ({ 
  type, 
  color = "#FFFFFF", 
  scale = 1 
}) => {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  // Animate pet with cute movements
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (group.current) {
      // Subtle bobbing
      group.current.position.y = Math.sin(t * 2) * 0.05;
    }
    
    if (bodyRef.current) {
      // Subtle breathing motion
      bodyRef.current.scale.x = 1 + Math.sin(t * 2) * 0.03;
      bodyRef.current.scale.z = 1 + Math.sin(t * 2) * 0.03;
    }
    
    if (headRef.current) {
      // Cute head movements
      headRef.current.rotation.y = Math.sin(t * 1) * 0.2;
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.05;
    }
  });
  
  // Render different pet types
  const renderPet = () => {
    switch (type) {
      case PetType.dog:
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.6, 0.4, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.5, 0.4]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.4, 0.5]} />
              <meshStandardMaterial color={color} />
              
              {/* Eyes */}
              <group position={[0, 0, 0.26]}>
                {/* Left eye */}
                <mesh position={[-0.12, 0.05, 0]}>
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.12, 0.05, 0]}>
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </group>
              
              {/* Nose */}
              <mesh position={[0, -0.05, 0.26]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
              
              {/* Ears */}
              <mesh position={[-0.2, 0.2, 0]} rotation={[0, 0, -0.3]} castShadow>
                <boxGeometry args={[0.1, 0.2, 0.1]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0.2, 0.2, 0]} rotation={[0, 0, 0.3]} castShadow>
                <boxGeometry args={[0.1, 0.2, 0.1]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </mesh>
            
            {/* Tail */}
            <mesh position={[0, 0.3, -0.5]} rotation={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[0.1, 0.1, 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.2, 0, 0.3]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.2, 0, 0.3]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.2, 0, -0.3]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.2, 0, -0.3]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
        
      case PetType.cat:
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.4, 0.7]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.5, 0.35]} castShadow receiveShadow>
              <boxGeometry args={[0.4, 0.35, 0.4]} />
              <meshStandardMaterial color={color} />
              
              {/* Eyes */}
              <group position={[0, 0, 0.21]}>
                {/* Left eye */}
                <mesh position={[-0.1, 0.05, 0]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color="green" />
                  
                  {/* Pupil */}
                  <mesh position={[0, 0, 0.03]}>
                    <sphereGeometry args={[0.02, 16, 16]} />
                    <meshBasicMaterial color="black" />
                  </mesh>
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.1, 0.05, 0]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color="green" />
                  
                  {/* Pupil */}
                  <mesh position={[0, 0, 0.03]}>
                    <sphereGeometry args={[0.02, 16, 16]} />
                    <meshBasicMaterial color="black" />
                  </mesh>
                </mesh>
              </group>
              
              {/* Nose */}
              <mesh position={[0, -0.05, 0.21]}>
                <boxGeometry args={[0.05, 0.05, 0.05]} />
                <meshStandardMaterial color="#FF9E80" />
              </mesh>
              
              {/* Ears - triangular for cats */}
              <mesh position={[-0.15, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <coneGeometry args={[0.1, 0.2, 4]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0.15, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                <coneGeometry args={[0.1, 0.2, 4]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </mesh>
            
            {/* Tail - curvy for cats */}
            <mesh position={[0, 0.3, -0.45]} rotation={[0.8, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.15, 0, 0.25]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 0, 0.25]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.15, 0, -0.25]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 0, -0.25]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
        
      case PetType.rabbit:
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.5, 0.3]} castShadow receiveShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color={color} />
              
              {/* Eyes */}
              <group position={[0, 0, 0.2]}>
                {/* Left eye */}
                <mesh position={[-0.1, 0.05, 0]}>
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshBasicMaterial color="#F44336" />
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.1, 0.05, 0]}>
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshBasicMaterial color="#F44336" />
                </mesh>
              </group>
              
              {/* Nose */}
              <mesh position={[0, -0.05, 0.24]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#FF9E80" />
              </mesh>
              
              {/* Ears - long for rabbits */}
              <mesh position={[-0.1, 0.25, 0]} rotation={[0, 0, -0.2]} castShadow>
                <boxGeometry args={[0.07, 0.4, 0.07]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0.1, 0.25, 0]} rotation={[0, 0, 0.2]} castShadow>
                <boxGeometry args={[0.07, 0.4, 0.07]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </mesh>
            
            {/* Tail - small and round for rabbits */}
            <mesh position={[0, 0.25, -0.35]} castShadow>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="white" />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.15, 0, 0.15]} castShadow>
              <boxGeometry args={[0.1, 0.2, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 0, 0.15]} castShadow>
              <boxGeometry args={[0.1, 0.2, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.15, 0, -0.15]} castShadow>
              <boxGeometry args={[0.1, 0.2, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 0, -0.15]} castShadow>
              <boxGeometry args={[0.1, 0.2, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
        
      case PetType.bird:
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.6, 0.15]} castShadow receiveShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} />
              
              {/* Eyes */}
              <group position={[0, 0, 0.15]}>
                {/* Left eye */}
                <mesh position={[-0.08, 0.02, 0]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.08, 0.02, 0]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </group>
              
              {/* Beak */}
              <mesh position={[0, -0.05, 0.2]} rotation={[0, 0, 0]} castShadow>
                <coneGeometry args={[0.05, 0.15, 4]} rotation={[0, 0, Math.PI / 4]} />
                <meshStandardMaterial color="#FF9800" />
              </mesh>
            </mesh>
            
            {/* Wings */}
            <mesh position={[-0.25, 0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
              <boxGeometry args={[0.25, 0.05, 0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.25, 0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
              <boxGeometry args={[0.25, 0.05, 0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Tail */}
            <mesh position={[0, 0.25, -0.25]} rotation={[0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.2, 0.05, 0.15]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.07, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.15, 0.03]} />
              <meshStandardMaterial color="#FF9800" />
            </mesh>
            <mesh position={[0.07, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.15, 0.03]} />
              <meshStandardMaterial color="#FF9800" />
            </mesh>
          </>
        );
        
      case PetType.frog:
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.15, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.25, 0.2]} castShadow receiveShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} />
              
              {/* Eyes - bulging for frogs */}
              <mesh position={[-0.1, 0.12, 0.05]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="white" />
                
                {/* Pupil */}
                <mesh position={[0, 0, 0.06]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </mesh>
              <mesh position={[0.1, 0.12, 0.05]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="white" />
                
                {/* Pupil */}
                <mesh position={[0, 0, 0.06]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </mesh>
              
              {/* Mouth */}
              <mesh position={[0, -0.05, 0.15]} castShadow>
                <boxGeometry args={[0.15, 0.02, 0.05]} />
                <meshStandardMaterial color="#E57373" />
              </mesh>
            </mesh>
            
            {/* Front legs */}
            <mesh position={[-0.2, 0, 0.1]} rotation={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.2]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.2, 0, 0.1]} rotation={[0, -0.3, 0]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.2]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Back legs - stronger for jumping */}
            <mesh position={[-0.15, 0, -0.2]} rotation={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 0, -0.2]} rotation={[0, -0.5, 0]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
        
      case PetType.turtle:
        return (
          <>
            {/* Shell */}
            <mesh ref={bodyRef} position={[0, 0.2, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#8D6E63" />
              
              {/* Shell pattern */}
              <mesh position={[0, 0.2, 0]} castShadow>
                <boxGeometry args={[0.2, 0.05, 0.2]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0, 0, 0.2]} castShadow>
                <boxGeometry args={[0.2, 0.05, 0.05]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0, 0, -0.2]} castShadow>
                <boxGeometry args={[0.2, 0.05, 0.05]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.05, 0.05, 0.2]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[-0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.05, 0.05, 0.2]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.2, 0.35]} castShadow receiveShadow>
              <boxGeometry args={[0.15, 0.15, 0.2]} />
              <meshStandardMaterial color="#8D6E63" />
              
              {/* Eyes */}
              <group position={[0, 0, 0.1]}>
                {/* Left eye */}
                <mesh position={[-0.05, 0.05, 0]}>
                  <sphereGeometry args={[0.02, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.05, 0.05, 0]}>
                  <sphereGeometry args={[0.02, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </group>
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.2, 0, 0.2]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.15]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
            <mesh position={[0.2, 0, 0.2]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.15]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
            <mesh position={[-0.2, 0, -0.2]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.15]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
            <mesh position={[0.2, 0, -0.2]} castShadow>
              <boxGeometry args={[0.1, 0.05, 0.15]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
            
            {/* Tail */}
            <mesh position={[0, 0.1, -0.35]} castShadow>
              <boxGeometry args={[0.05, 0.05, 0.1]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
          </>
        );
        
      case PetType.fish:
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.3, 0.2]} castShadow receiveShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} />
              
              {/* Eyes */}
              <group position={[0, 0, 0.15]}>
                {/* Left eye */}
                <mesh position={[-0.1, 0.05, 0]}>
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.1, 0.05, 0]}>
                  <sphereGeometry args={[0.05, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </group>
              
              {/* Mouth */}
              <mesh position={[0, -0.05, 0.18]} castShadow>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#EF5350" />
              </mesh>
            </mesh>
            
            {/* Tail */}
            <mesh position={[0, 0.3, -0.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <coneGeometry args={[0.2, 0.3, 2]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Fins */}
            <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]} castShadow>
              <coneGeometry args={[0.1, 0.2, 2]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.25, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <coneGeometry args={[0.1, 0.2, 2]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.25, 0.3, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
              <coneGeometry args={[0.1, 0.2, 2]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
        
      case PetType.hamster:
        return (
          <>
            {/* Body */}
            <mesh ref={bodyRef} position={[0, 0.2, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 0.3, 0.25]} castShadow receiveShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} />
              
              {/* Eyes */}
              <group position={[0, 0, 0.15]}>
                {/* Left eye */}
                <mesh position={[-0.08, 0.05, 0]}>
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
                
                {/* Right eye */}
                <mesh position={[0.08, 0.05, 0]}>
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </group>
              
              {/* Nose */}
              <mesh position={[0, 0, 0.19]} castShadow>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshStandardMaterial color="#FF9E80" />
              </mesh>
              
              {/* Cheeks - puffy for hamsters */}
              <mesh position={[-0.15, 0, 0.05]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0.15, 0, 0.05]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
              
              {/* Ears */}
              <mesh position={[-0.1, 0.15, 0]} rotation={[0, 0, -0.3]} castShadow>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0.1, 0.15, 0]} rotation={[0, 0, 0.3]} castShadow>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </mesh>
            
            {/* Tail - tiny for hamsters */}
            <mesh position={[0, 0.15, -0.25]} castShadow>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            
            {/* Legs */}
            <mesh position={[-0.15, 0, 0.15]} castShadow>
              <boxGeometry args={[0.08, 0.1, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 0, 0.15]} castShadow>
              <boxGeometry args={[0.08, 0.1, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.15, 0, -0.15]} castShadow>
              <boxGeometry args={[0.08, 0.1, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 0, -0.15]} castShadow>
              <boxGeometry args={[0.08, 0.1, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
        
      default:
        // Fallback to a simple pet shape
        return (
          <>
            <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh ref={headRef} position={[0, 0.5, 0.3]} castShadow receiveShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} />
              
              {/* Eyes */}
              <group position={[0, 0, 0.15]}>
                <mesh position={[-0.08, 0.05, 0]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
                <mesh position={[0.08, 0.05, 0]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshBasicMaterial color="black" />
                </mesh>
              </group>
            </mesh>
          </>
        );
    }
  };
  
  return (
    <group ref={group} scale={[scale, scale, scale]}>
      {renderPet()}
    </group>
  );
};

export default Pet;
