import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const Environment: React.FC = () => {
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.repeat.set(5, 5);
  grassTexture.wrapS = grassTexture.wrapT = 1000;
  
  const woodTexture = useTexture("/textures/wood.jpg");
  woodTexture.repeat.set(1, 1);
  woodTexture.wrapS = woodTexture.wrapT = 1000;
  
  // Generate clouds
  const clouds = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        5 + Math.random() * 5,
        (Math.random() - 0.5) * 40
      ],
      scale: 1 + Math.random() * 2,
      rotation: Math.random() * Math.PI
    }));
  }, []);
  
  // Generate trees
  const trees = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        0,
        (Math.random() - 0.5) * 40
      ],
      scale: 0.8 + Math.random() * 0.5,
      rotation: Math.random() * Math.PI * 2
    }));
  }, []);
  
  // Generate rocks
  const rocks = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        0,
        (Math.random() - 0.5) * 30
      ],
      scale: 0.5 + Math.random() * 0.5,
      rotation: Math.random() * Math.PI * 2
    }));
  }, []);
  
  // Generate flowers
  const flowers = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        0,
        (Math.random() - 0.5) * 30
      ],
      color: [
        "#FF5252", // Red
        "#FF4081", // Pink
        "#7C4DFF", // Purple
        "#FFEB3B", // Yellow
        "#FFFFFF"  // White
      ][Math.floor(Math.random() * 5)],
      rotation: Math.random() * Math.PI * 2
    }));
  }, []);
  
  return (
    <group>
      {/* Trees */}
      {trees.map((tree, index) => (
        <group 
          key={`tree-${index}`} 
          position={tree.position as [number, number, number]} 
          scale={[tree.scale, tree.scale, tree.scale]} 
          rotation={[0, tree.rotation, 0]}
        >
          {/* Tree trunk */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
            <meshStandardMaterial map={woodTexture} color="#8D6E63" />
          </mesh>
          
          {/* Tree leaves */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[1, 2, 8]} />
            <meshStandardMaterial color="#AED581" />
          </mesh>
        </group>
      ))}
      
      {/* Rocks */}
      {rocks.map((rock, index) => (
        <group
          key={`rock-${index}`}
          position={rock.position as [number, number, number]}
          scale={[rock.scale, rock.scale, rock.scale]}
          rotation={[0, rock.rotation, 0]}
        >
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.5, 6, 6]} />
            <meshStandardMaterial color="#9E9E9E" roughness={0.8} />
          </mesh>
        </group>
      ))}
      
      {/* Flowers */}
      {flowers.map((flower, index) => (
        <group
          key={`flower-${index}`}
          position={flower.position as [number, number, number]}
          rotation={[0, flower.rotation, 0]}
        >
          {/* Stem */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#7CB342" />
          </mesh>
          
          {/* Flower */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={flower.color} />
          </mesh>
        </group>
      ))}
      
      {/* Clouds */}
      {clouds.map((cloud, index) => (
        <group
          key={`cloud-${index}`}
          position={cloud.position as [number, number, number]}
          scale={[cloud.scale, cloud.scale, cloud.scale]}
          rotation={[0, cloud.rotation, 0]}
        >
          <mesh castShadow>
            <sphereGeometry args={[0.8, 8, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0.7, 0, 0]} castShadow>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[-0.7, 0, 0]} castShadow>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, 0.7]} castShadow>
            <sphereGeometry args={[0.7, 8, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.7, 8, 8]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Environment;
