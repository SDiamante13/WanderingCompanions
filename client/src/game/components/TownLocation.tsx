import { useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";
import { TownLocation as LocationType } from "../types";

interface TownLocationProps {
  location: {
    id: LocationType;
    name: string;
    description: string;
    coordinates: [number, number, number];
  };
  isUnlocked: boolean;
  isActive: boolean;
  onClick?: (locationId: LocationType) => void;
}

const LocationComponent: React.FC<TownLocationProps> = ({ 
  location, 
  isUnlocked,
  isActive,
  onClick
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const floatRef = useRef<THREE.Group>(null);
  
  // Animation for floating effect
  useFrame((state) => {
    if (floatRef.current) {
      const t = state.clock.getElapsedTime();
      floatRef.current.position.y = Math.sin(t * 1.5) * 0.2 + 2;
    }
  });
  
  // Spring animation for highlighting active location
  const { scale } = useSpring({
    scale: isActive ? 1.2 : 1,
    config: { mass: 1, tension: 170, friction: 26 },
  });
  
  // Building colors based on location type
  const getBuildingColor = () => {
    switch (location.id) {
      case LocationType.home:
        return "#FFAB91"; // Secondary color
      case LocationType.shop:
        return "#4FC3F7"; // Primary color
      case LocationType.school:
        return "#AED581"; // Accent color
      case LocationType.park:
        return "#8BC34A"; // Green
      default:
        return "#F5F5F5"; // Neutral
    }
  };
  
  // Determine building shape based on location type
  const renderBuilding = () => {
    switch (location.id) {
      case LocationType.home:
        return (
          <>
            {/* House base */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[2, 1, 2]} />
              <meshStandardMaterial color={getBuildingColor()} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[1.5, 1, 4]} />
              <meshStandardMaterial color="#FF7043" />
            </mesh>
            {/* Door */}
            <mesh position={[0, 0.4, 1.01]}>
              <boxGeometry args={[0.5, 0.8, 0.05]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
            {/* Windows */}
            <mesh position={[-0.6, 0.6, 1.01]}>
              <boxGeometry args={[0.4, 0.4, 0.05]} />
              <meshStandardMaterial color="#BBDEFB" />
            </mesh>
            <mesh position={[0.6, 0.6, 1.01]}>
              <boxGeometry args={[0.4, 0.4, 0.05]} />
              <meshStandardMaterial color="#BBDEFB" />
            </mesh>
          </>
        );
        
      case LocationType.shop:
        return (
          <>
            {/* Shop base */}
            <mesh position={[0, 0.75, 0]}>
              <boxGeometry args={[3, 1.5, 2]} />
              <meshStandardMaterial color={getBuildingColor()} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 1.6, 0]}>
              <boxGeometry args={[3.5, 0.2, 2.5]} />
              <meshStandardMaterial color="#0288D1" />
            </mesh>
            {/* Door */}
            <mesh position={[0, 0.5, 1.01]}>
              <boxGeometry args={[1, 1, 0.05]} />
              <meshStandardMaterial color="#CFD8DC" />
            </mesh>
            {/* Shop sign */}
            <mesh position={[0, 1.4, 1.05]}>
              <boxGeometry args={[2, 0.5, 0.1]} />
              <meshStandardMaterial color="#FFEE58" />
            </mesh>
          </>
        );
        
      case LocationType.school:
        return (
          <>
            {/* School base */}
            <mesh position={[0, 0.75, 0]}>
              <boxGeometry args={[4, 1.5, 2.5]} />
              <meshStandardMaterial color={getBuildingColor()} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 1.6, 0]}>
              <boxGeometry args={[4.2, 0.2, 2.7]} />
              <meshStandardMaterial color="#689F38" />
            </mesh>
            {/* Door */}
            <mesh position={[0, 0.5, 1.26]}>
              <boxGeometry args={[1, 1, 0.05]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
            {/* Windows */}
            <mesh position={[-1.5, 0.75, 1.26]}>
              <boxGeometry args={[0.8, 0.8, 0.05]} />
              <meshStandardMaterial color="#BBDEFB" />
            </mesh>
            <mesh position={[1.5, 0.75, 1.26]}>
              <boxGeometry args={[0.8, 0.8, 0.05]} />
              <meshStandardMaterial color="#BBDEFB" />
            </mesh>
            {/* Flag */}
            <mesh position={[1.8, 2, 0]}>
              <boxGeometry args={[0.1, 1, 0.1]} />
              <meshStandardMaterial color="#795548" />
            </mesh>
            <mesh position={[2.1, 1.8, 0]}>
              <boxGeometry args={[0.7, 0.4, 0.05]} />
              <meshStandardMaterial color="#FF5252" />
            </mesh>
          </>
        );
        
      case LocationType.park:
        return (
          <>
            {/* Grass base */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[3, 32]} />
              <meshStandardMaterial color="#81C784" />
            </mesh>
            {/* Trees */}
            <group position={[-1.5, 0, -1]}>
              <mesh position={[0, 0.75, 0]}>
                <cylinderGeometry args={[0.2, 0.3, 1.5, 8]} />
                <meshStandardMaterial color="#795548" />
              </mesh>
              <mesh position={[0, 1.5, 0]}>
                <coneGeometry args={[1, 2, 8]} />
                <meshStandardMaterial color="#43A047" />
              </mesh>
            </group>
            <group position={[1.5, 0, -0.5]}>
              <mesh position={[0, 0.75, 0]}>
                <cylinderGeometry args={[0.2, 0.3, 1.5, 8]} />
                <meshStandardMaterial color="#795548" />
              </mesh>
              <mesh position={[0, 1.5, 0]}>
                <coneGeometry args={[0.8, 1.5, 8]} />
                <meshStandardMaterial color="#43A047" />
              </mesh>
            </group>
            {/* Bench */}
            <mesh position={[0, 0.3, 1]}>
              <boxGeometry args={[2, 0.1, 0.5]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
            <mesh position={[-0.8, 0.15, 1]}>
              <boxGeometry args={[0.1, 0.3, 0.5]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[0.8, 0.15, 1]}>
              <boxGeometry args={[0.1, 0.3, 0.5]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
          </>
        );
        
      case LocationType.center:
        return (
          <>
            {/* Center platform */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[3, 32]} />
              <meshStandardMaterial color="#CFD8DC" />
            </mesh>
            {/* Fountain base */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[1.5, 1.8, 0.4, 32]} />
              <meshStandardMaterial color="#B0BEC5" />
            </mesh>
            {/* Fountain water */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
              <meshStandardMaterial color="#29B6F6" />
            </mesh>
            {/* Fountain center */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
              <meshStandardMaterial color="#B0BEC5" />
            </mesh>
            {/* Benches */}
            <group rotation={[0, Math.PI / 4, 0]}>
              <mesh position={[2, 0.3, 0]}>
                <boxGeometry args={[1.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#8D6E63" />
              </mesh>
              <mesh position={[-2, 0.3, 0]}>
                <boxGeometry args={[1.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#8D6E63" />
              </mesh>
              <mesh position={[0, 0.3, 2]}>
                <boxGeometry args={[1.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#8D6E63" />
              </mesh>
              <mesh position={[0, 0.3, -2]}>
                <boxGeometry args={[1.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#8D6E63" />
              </mesh>
            </group>
          </>
        );
        
      default:
        return (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial color={getBuildingColor()} />
          </mesh>
        );
    }
  };
  
  const handleClick = (event: any) => {
    if (isUnlocked && onClick) {
      event.stopPropagation();
      onClick(location.id);
    }
  };

  return (
    <animated.group 
      ref={groupRef} 
      position={location.coordinates}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = isUnlocked ? 'pointer' : 'not-allowed'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      {/* Building or location */}
      {renderBuilding()}
      
      {/* Location name */}
      <group ref={floatRef} position={[0, 2, 0]}>
        <Text
          position={[0, 0, 0]}
          color={isActive ? "#FF5722" : isUnlocked ? "#424242" : "#BDBDBD"}
          fontSize={0.5}
          maxWidth={5}
          lineHeight={1}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          {location.name}
        </Text>
        
        {/* Locked indicator */}
        {!isUnlocked && (
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#F44336" />
          </mesh>
        )}
      </group>
      
      {/* Interaction hint */}
      {isActive && (
        <Text
          position={[0, 0, 3]}
          color="#424242"
          fontSize={0.3}
          maxWidth={5}
          lineHeight={1.2}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          Press 'E' or Space to interact
        </Text>
      )}
    </animated.group>
  );
};

export default LocationComponent;
