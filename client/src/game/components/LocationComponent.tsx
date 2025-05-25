import { useState } from "react";
import { Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { TownLocation } from "../types";
import { useGameStore } from "../stores/useGameStore";

interface LocationComponentProps {
  location: {
    id: TownLocation;
    name: string;
    description: string;
    coordinates: [number, number, number];
  };
  isUnlocked: boolean;
  isActive: boolean;
}

const LocationComponent = ({ location, isUnlocked, isActive }: LocationComponentProps) => {
  const { setLocation } = useGameStore();
  const [hovered, setHovered] = useState(false);
  
  // Create springs for animations
  const springProps = useSpring({
    scale: hovered && isUnlocked ? 1.1 : 1,
    color: isActive ? "#4FC3F7" : (isUnlocked ? (hovered ? "#FFAB91" : "#AED581") : "#9E9E9E"),
    opacity: isUnlocked ? 1 : 0.5,
  });
  
  // Create spring for floating animation (active locations float)
  const floatSpring = useSpring({
    position: isActive 
      ? [location.coordinates[0], location.coordinates[1] + 0.5, location.coordinates[2]] 
      : location.coordinates,
    config: { mass: 1, tension: 180, friction: 12 }
  });
  
  // Handle pointer events
  const handleClick = () => {
    if (isUnlocked) {
      setLocation(location.id);
    }
  };
  
  return (
    <animated.group
      position={floatSpring.position.to((x, y, z) => [x, y, z])}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Location marker (building) */}
      <animated.mesh
        scale={springProps.scale}
        castShadow
      >
        {/* Base building */}
        <boxGeometry args={[2, 2, 2]} />
        <animated.meshStandardMaterial color={springProps.color} opacity={springProps.opacity} transparent />
        
        {/* Roof */}
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[1.5, 1, 4]} />
          <animated.meshStandardMaterial color={springProps.color} opacity={springProps.opacity} transparent />
        </mesh>
      </animated.mesh>
      
      {/* Location name */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#424242"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#FFFFFF"
      >
        {location.name}
      </Text>
      
      {/* Show description on hover */}
      {hovered && isUnlocked && (
        <Text
          position={[0, -1, 0]}
          fontSize={0.3}
          color="#424242"
          anchorX="center"
          anchorY="middle"
          maxWidth={5}
          outlineWidth={0.01}
          outlineColor="#FFFFFF"
        >
          {location.description}
        </Text>
      )}
      
      {/* Locked indicator */}
      {!isUnlocked && (
        <mesh position={[0, 0, 1.1]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
          <meshStandardMaterial color="#F44336" />
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            🔒
          </Text>
        </mesh>
      )}
    </animated.group>
  );
};

export default LocationComponent;