import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";
import { useBattleStore } from "../stores/useBattleStore";
import { GamePhase } from "../types";
import Character from "./models/Character";
import Pet from "./models/Pet";
import Enemy from "./models/Enemy";

interface EnemyData {
  id: string;
  name: string;
  level: number;
  position: THREE.Vector3;
  color: string;
  type: string;
}

const Adventure = () => {
  const closeAdventure = useGameStore((state) => state.closeAdventure);
  const setGamePhase = useGameStore((state) => state.setGamePhase);
  const player = usePlayerStore((state) => state.player);
  const updateCoins = usePlayerStore((state) => state.updateCoins);
  const pet = usePetStore((state) => state.pet);
  const startBattle = useBattleStore((state) => state.startBattle);
  
  // Movement controls
  const [, getKeys] = useKeyboardControls();
  const { camera } = useThree();
  const playerRef = useRef<THREE.Group>(null);
  const petRef = useRef<THREE.Group>(null);
  const playerPosition = useRef(new THREE.Vector3(0, 0, 10));
  const playerRotation = useRef(new THREE.Euler(0, 0, 0));
  
  // Enemy management
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(new Set());
  const [interactionMessage, setInteractionMessage] = useState("");
  
  // Initialize enemies
  useEffect(() => {
    const enemyData: EnemyData[] = [
      {
        id: "enemy1",
        name: "Wild Cat",
        level: 1,
        position: new THREE.Vector3(-8, 0, -5),
        color: "#FF9800",
        type: "wild_cat"
      },
      {
        id: "enemy2",
        name: "Forest Wolf",
        level: 2,
        position: new THREE.Vector3(10, 0, -8),
        color: "#868E96",
        type: "mischievous_monkey"
      },
      {
        id: "enemy3",
        name: "Angry Bird",
        level: 3,
        position: new THREE.Vector3(0, 0, -15),
        color: "#F44336",
        type: "angry_bird"
      },
      {
        id: "enemy4",
        name: "Sneaky Snake",
        level: 5,
        position: new THREE.Vector3(-15, 0, -20),
        color: "#9C27B0",
        type: "sneaky_snake"
      }
    ];
    setEnemies(enemyData);
  }, []);
  
  // Handle movement and interactions
  useFrame((_, delta) => {
    if (!playerRef.current) return;
    
    const { forward, backward, leftward, rightward, interact } = getKeys();
    const speed = 5 * delta;
    
    // Update player position based on movement keys
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
    
    // Boundary constraints
    playerPosition.current.x = Math.max(-20, Math.min(20, playerPosition.current.x));
    playerPosition.current.z = Math.max(-25, Math.min(15, playerPosition.current.z));
    
    // Update player model
    playerRef.current.position.copy(playerPosition.current);
    playerRef.current.rotation.y = playerRotation.current.y;
    
    // Update camera to follow player
    camera.position.lerp(
      new THREE.Vector3(
        playerPosition.current.x,
        playerPosition.current.y + 8,
        playerPosition.current.z + 10
      ),
      0.1
    );
    camera.lookAt(playerPosition.current);
    
    // Update pet position to follow player
    if (petRef.current && pet) {
      const petTargetPos = playerPosition.current.clone().add(new THREE.Vector3(-1, 0, 1));
      petRef.current.position.lerp(petTargetPos, 0.1);
      petRef.current.lookAt(playerRef.current.position);
    }
    
    // Check for enemy collisions
    enemies.forEach((enemy) => {
      const distance = playerPosition.current.distanceTo(enemy.position);
      if (distance < 2) {
        // Trigger battle
        startBattle(enemy.name, enemy.level);
        setGamePhase(GamePhase.battle);
        closeAdventure();
      }
    });
    
    // Check for interactions
    if (interact) {
      // Check for treasure chests
      const treasureDistance = playerPosition.current.distanceTo(new THREE.Vector3(12, 0, -12));
      if (treasureDistance < 3 && !collectedCoins.has("treasure1")) {
        const coins = Math.floor(Math.random() * 10) + 5;
        updateCoins(coins);
        setCollectedCoins(prev => {
          const newSet = new Set(prev);
          newSet.add("treasure1");
          return newSet;
        });
        setInteractionMessage(`Found ${coins} coins!`);
        setTimeout(() => setInteractionMessage(""), 3000);
      }
      
      // Exit portal
      const exitDistance = playerPosition.current.distanceTo(new THREE.Vector3(0, 0, 12));
      if (exitDistance < 3) {
        closeAdventure();
      }
    }
  });
  
  // Pass interaction message to global state
  useEffect(() => {
    if (interactionMessage) {
      const event = new CustomEvent('adventureMessage', { detail: interactionMessage });
      window.dispatchEvent(event);
    }
  }, [interactionMessage]);
  
  return (
    <>
      {/* Forest environment */}
      {/* Sky */}
      <mesh position={[0, 0, -50]} scale={[100, 50, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#1a3d2e" />
      </mesh>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} scale={[40, 50, 1]}>
        <planeGeometry />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      
      {/* Trees */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 50;
        // Avoid placing trees too close to paths
        if (Math.abs(x) < 3 || Math.abs(z) < 3) return null;
        
        return (
          <group key={`tree-${i}`} position={[x, 0, z]}>
            {/* Tree trunk */}
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 2]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Tree leaves */}
            <mesh position={[0, 2.5, 0]}>
              <coneGeometry args={[1.5, 2, 8]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
          </group>
        );
      }).filter(Boolean)}
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow 
        color="#FFF8DC"
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFD700" />
      
      {/* Player character */}
      <group ref={playerRef} position={[0, 0, 10]}>
        <Character color={player?.color || "#4FC3F7"} />
      </group>
      
      {/* Pet */}
      {pet && (
        <group ref={petRef} position={[-1, 0, 11]}>
          <Pet type={pet.type} color={pet.color} />
        </group>
      )}
      
      {/* Enemies */}
      {enemies.map((enemy) => (
        <group key={enemy.id} position={enemy.position.toArray()}>
          <Enemy type={enemy.type} level={enemy.level} />
          {/* Enemy name label */}
          <mesh position={[0, 2.5, 0]}>
            <planeGeometry args={[2, 0.5]} />
            <meshBasicMaterial color="red" opacity={0.8} transparent />
          </mesh>
        </group>
      ))}
      
      {/* Treasure chest */}
      {!collectedCoins.has("treasure1") && (
        <group position={[12, 0, -12]}>
          <mesh>
            <boxGeometry args={[1, 0.8, 0.8]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.6]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        </group>
      )}
      
      {/* Exit portal */}
      <group position={[0, 0, 12]}>
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[1.5, 2, 8]} />
          <meshBasicMaterial color="#00FFFF" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="white" opacity={0.8} transparent />
        </mesh>
      </group>
    </>
  );
};

export default React.memo(Adventure);