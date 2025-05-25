import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls, Text } from "@react-three/drei";
import { Controls, BattleState } from "../types";
import { useGameStore } from "../stores/useGameStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePetStore } from "../stores/usePetStore";
import { useBattleStore } from "../stores/useBattleStore";
import { useAudio } from "../../lib/stores/useAudio";
import Character from "./models/Character";
import Pet from "./models/Pet";
import Enemy from "./models/Enemy";
import { healthPercentage, healthColor } from "../utils/helpers";

const Battle = () => {
  const { camera } = useThree();
  const { player } = usePlayerStore();
  const { pet } = usePetStore();
  const { 
    battleState, 
    enemy, 
    availableActions, 
    performPlayerAction,
    resetBattle,
    turnCount
  } = useBattleStore();
  
  // References for animation
  const playerRef = useRef<THREE.Group>(null);
  const petRef = useRef<THREE.Group>(null);
  const enemyRef = useRef<THREE.Group>(null);
  const battleFieldRef = useRef<THREE.Group>(null);
  
  // Track active action
  const [, getKeys] = useKeyboardControls<Controls>();
  const selectedActionRef = useRef(0);
  
  // Set up battle scene
  useEffect(() => {
    // Position camera for battle view
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);
    
    return () => {
      // Reset battle state when component unmounts
      resetBattle();
    };
  }, [camera, resetBattle]);
  
  // Handle keyboard navigation for action selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (battleState !== BattleState.playerTurn) return;
      
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        selectedActionRef.current = Math.max(0, selectedActionRef.current - 1);
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        selectedActionRef.current = Math.min(availableActions.length - 1, selectedActionRef.current + 1);
      } else if (e.code === "Space" || e.code === "Enter") {
        performPlayerAction(selectedActionRef.current);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [availableActions, battleState, performPlayerAction]);
  
  // Animate characters during battle
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (playerRef.current) {
      // Gentle hovering for player
      playerRef.current.position.y = Math.sin(time * 1.5) * 0.1 + 0.5;
      
      // If it's player's turn, make it bounce a bit more
      if (battleState === BattleState.playerTurn) {
        playerRef.current.position.y += Math.sin(time * 3) * 0.05;
      }
    }
    
    if (petRef.current && pet) {
      // Gentle hovering for pet
      petRef.current.position.y = Math.sin(time * 1.8 + 1) * 0.1 + 0.5;
      
      // If it's pet's turn, make it bounce a bit more
      if (battleState === BattleState.petTurn) {
        petRef.current.position.y += Math.sin(time * 3) * 0.05;
      }
    }
    
    if (enemyRef.current && enemy) {
      // More aggressive movement for enemy
      enemyRef.current.position.y = Math.sin(time * 2) * 0.15 + 0.6;
      
      // If it's enemy's turn, make it move forward slightly
      if (battleState === BattleState.enemyTurn) {
        enemyRef.current.position.z = Math.sin(time * 3) * 0.3 - 5;
      } else {
        enemyRef.current.position.z = -5;
      }
    }
    
    // Rotate the entire battlefield gently
    if (battleFieldRef.current) {
      battleFieldRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
    }
  });
  
  // Render health bars
  const renderHealthBar = (
    current: number, 
    max: number, 
    position: [number, number, number],
    width = 2
  ) => {
    const healthPct = healthPercentage(current, max);
    
    return (
      <group position={position}>
        {/* Background */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[width, 0.2, 0.05]} />
          <meshStandardMaterial color="#E0E0E0" />
        </mesh>
        
        {/* Health fill */}
        <mesh position={[-(width - width * healthPct / 100) / 2, 0, 0.01]}>
          <boxGeometry args={[width * healthPct / 100, 0.2, 0.05]} />
          <meshStandardMaterial color={healthColor(healthPct)} />
        </mesh>
      </group>
    );
  };
  
  // Determine what to render based on battle state
  const renderBattleStateMessage = () => {
    switch (battleState) {
      case BattleState.start:
        return "Battle starting...";
      case BattleState.playerTurn:
        return "Your turn! Choose an action.";
      case BattleState.petTurn:
        return `${pet?.name}'s turn!`;
      case BattleState.enemyTurn:
        return `${enemy?.name}'s turn!`;
      case BattleState.win:
        return "You won the battle!";
      case BattleState.lose:
        return "You lost the battle...";
      default:
        return "";
    }
  };
  
  return (
    <group ref={battleFieldRef}>
      {/* Battle arena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#AED581" />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 2]} intensity={1} castShadow />
      
      {/* Battle state message */}
      <Text
        position={[0, 3, 0]}
        color="#424242"
        fontSize={0.7}
        font="/fonts/inter.json"
        anchorX="center"
        anchorY="middle"
      >
        {renderBattleStateMessage()}
      </Text>
      
      {/* Turn counter */}
      <Text
        position={[0, 2.5, 0]}
        color="#757575"
        fontSize={0.4}
        font="/fonts/inter.json"
        anchorX="center"
        anchorY="middle"
      >
        {`Turn: ${turnCount}`}
      </Text>
      
      {/* Player character */}
      <group ref={playerRef} position={[-3, 0.5, 0]}>
        <Character color={player.color} scale={1.2} />
        
        {/* Player name */}
        <Text
          position={[0, 1.8, 0]}
          color="#424242"
          fontSize={0.4}
          font="/fonts/inter.json"
          anchorX="center"
          anchorY="middle"
        >
          {player.name}
        </Text>
        
        {/* Player health bar */}
        {renderHealthBar(player.health, player.maxHealth, [0, 1.5, 0])}
      </group>
      
      {/* Pet character */}
      {pet && (
        <group ref={petRef} position={[-1.5, 0.5, 2]}>
          <Pet type={pet.type} color={pet.color} scale={1} />
          
          {/* Pet name */}
          <Text
            position={[0, 1.3, 0]}
            color="#424242"
            fontSize={0.3}
            font="/fonts/inter.json"
            anchorX="center"
            anchorY="middle"
          >
            {pet.name}
          </Text>
          
          {/* Pet health bar */}
          {renderHealthBar(pet.health, pet.maxHealth, [0, 1, 0], 1.5)}
        </group>
      )}
      
      {/* Enemy character */}
      {enemy && (
        <group ref={enemyRef} position={[3, 0.6, -5]}>
          <Enemy type={enemy.type} level={enemy.level} scale={1.5} />
          
          {/* Enemy name and level */}
          <Text
            position={[0, 2, 0]}
            color="#424242"
            fontSize={0.4}
            font="/fonts/inter.json"
            anchorX="center"
            anchorY="middle"
          >
            {`${enemy.name} Lv.${enemy.level}`}
          </Text>
          
          {/* Enemy health bar */}
          {renderHealthBar(enemy.health, enemy.maxHealth, [0, 1.7, 0], 2.5)}
        </group>
      )}
      
      {/* Battle actions (only shown during player turn) */}
      {battleState === BattleState.playerTurn && (
        <group position={[0, 0, 6]}>
          {availableActions.map((action, index) => {
            const isSelected = index === selectedActionRef.current;
            
            return (
              <group 
                key={action.name}
                position={[0, -index * 0.7, 0]}
                onClick={() => performPlayerAction(index)}
              >
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[3, 0.6, 0.1]} />
                  <meshStandardMaterial color={isSelected ? "#4FC3F7" : "#E0E0E0"} />
                </mesh>
                
                <Text
                  position={[0, 0, 0.06]}
                  color={isSelected ? "white" : "#424242"}
                  fontSize={0.3}
                  font="/fonts/inter.json"
                  anchorX="center"
                  anchorY="middle"
                >
                  {action.name}
                </Text>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};

export default Battle;
