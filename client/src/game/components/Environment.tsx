import { useTexture } from "@react-three/drei";

const Environment = () => {
  // Load ground texture
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.repeat.set(10, 10);
  grassTexture.wrapS = 1000;
  grassTexture.wrapT = 1000;
  
  return (
    <>
      {/* Sky */}
      <color attach="background" args={["#87CEEB"]} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          map={grassTexture} 
          color="#AED581"
        />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
      />
      
      {/* Simple decorative elements */}
      <group position={[-15, 0, -15]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#8D6E63" />
        </mesh>
      </group>
      
      <group position={[15, 0, -15]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0, 1.5, 2, 4]} />
          <meshStandardMaterial color="#7CB342" />
        </mesh>
      </group>
    </>
  );
};

export default Environment;