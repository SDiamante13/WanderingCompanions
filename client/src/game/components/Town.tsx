import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture, useKeyboardControls } from "@react-three/drei";
import { Controls, TownLocation } from "../types";
import { TOWN_LOCATIONS } from "../constants";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useBattleStore } from "../stores/useBattleStore";
import Character from "./models/Character";
import Pet from "./models/Pet";
import Environment from "./models/Environment";
import LocationComponent from "./TownLocation";
import { usePetStore } from "../stores/usePetStore";
import Shop from "./Shop";

const Town = () => {
  const { camera } = useThree();
  const { player } = usePlayerStore();
  const { pet } = usePetStore();
  const { currentLocation, setLocation, unlockedLocations, openShop } = useGameStore();
  const { startBattle } = useBattleStore();
  
  // Player movement refs
  const playerRef = useRef<THREE.Group>(null);
  const petRef = useRef<THREE.Group>(null);
  const playerPosition = useRef(new THREE.Vector3(0, 0, 0));
  const playerRotation = useRef(new THREE.Euler(0, 0, 0));
  
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.repeat.set(50, 50);
  grassTexture.wrapS = 1000;
  grassTexture.wrapT = 1000;
  
  const skyTexture = useTexture("/textures/sky.png");
  
  // Setup camera
  useEffect(() => {
    camera.position.set(0, 10, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Get keyboard controls
  const [, getKeys] = useKeyboardControls<Controls>();
  
  // Handle player movement and camera follow
  useFrame((_, delta) => {
    if (!playerRef.current || !petRef.current) return;
    
    const { forward, backward, leftward, rightward, interact } = getKeys();
    
    // Movement speed
    const speed = 5 * delta;
    
    // Update player position based on keys
    if (forward) {
      playerPosition.current.z -= speed;
      playerRotation.current.y = Math.PI;
    }
    if (backward) {
      playerPosition.current.z += speed;
      playerRotation.current.y = 0;
    }
    if (leftward) {
      playerPosition.current.x -= speed;
      playerRotation.current.y = Math.PI / 2;
    }
    if (rightward) {
      playerPosition.current.x += speed;
      playerRotation.current.y = -Math.PI / 2;
    }
    
    // Clamp position to town boundaries
    playerPosition.current.x = Math.max(-25, Math.min(25, playerPosition.current.x));
    playerPosition.current.z = Math.max(-25, Math.min(25, playerPosition.current.z));
    
    // Update player model
    playerRef.current.position.copy(playerPosition.current);
    playerRef.current.rotation.y = playerRotation.current.y;
    
    // Make pet follow the player with a slight delay
    const petTargetPos = new THREE.Vector3()
      .copy(playerPosition.current)
      .add(new THREE.Vector3(-1, 0, 1));
      
    petRef.current.position.lerp(petTargetPos, 0.05);
    
    // Have pet look at player
    const lookPos = new THREE.Vector3()
      .copy(playerPosition.current)
      .sub(petRef.current.position)
      .normalize();
    if (lookPos.length() > 0.1) {
      petRef.current.rotation.y = Math.atan2(lookPos.x, lookPos.z);
    }
    
    // Check for location proximity and interactions
    TOWN_LOCATIONS.forEach((loc) => {
      const locationPos = new THREE.Vector3(...loc.coordinates);
      const distance = playerPosition.current.distanceTo(locationPos);
      
      // If player is close to a location and presses interact
      if (distance < 3 && interact && unlockedLocations.includes(loc.id)) {
        handleLocationInteraction(loc.id);
      }
    });
    
    // Camera follows player
    camera.position.x = playerPosition.current.x;
    camera.position.z = playerPosition.current.z + 15;
    camera.lookAt(playerPosition.current.x, 0, playerPosition.current.z);
  });
  
  // Handle location interactions
  const handleLocationInteraction = (location: TownLocation) => {
    // Set current location
    setLocation(location);
    
    // Handle location-specific logic
    switch (location) {
      case TownLocation.park:
        // Random chance to start a battle in the park
        if (Math.random() > 0.5) {
          startBattle();
        }
        break;
      case TownLocation.shop:
        // Show shop interface
        openShop();
        break;
      case TownLocation.home:
        // Restore pet happiness and player health
        break;
      case TownLocation.school:
        // Show learning minigames
        break;
      default:
        break;
    }
  };
  
  return (
    <>
      {/* Sky backdrop */}
      <mesh position={[0, 0, -100]} scale={[200, 100, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={skyTexture} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} scale={[50, 50, 1]}>
        <planeGeometry />
        <meshStandardMaterial map={grassTexture} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      {/* Player character */}
      <group ref={playerRef} position={[0, 0, 0]}>
        <Character color={player.color} />
      </group>
      
      {/* Pet */}
      {pet && (
        <group ref={petRef} position={[-1, 0, 1]}>
          <Pet type={pet.type} color={pet.color} />
        </group>
      )}
      
      {/* Town Locations */}
      {TOWN_LOCATIONS.map((loc) => (
        <LocationComponent
          key={loc.id}
          location={{
            id: loc.id,
            name: loc.name,
            description: loc.description,
            coordinates: loc.coordinates as [number, number, number]
          }}
          isUnlocked={unlockedLocations.includes(loc.id)}
          isActive={currentLocation === loc.id}
          onClick={handleLocationInteraction}
        />
      ))}
      
      {/* Environment */}
      <Environment />
    </>
  );
};

export default Town;
