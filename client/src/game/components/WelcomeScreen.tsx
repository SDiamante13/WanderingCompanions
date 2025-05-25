import { useState, useEffect } from "react";
import { Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useGameStore } from "../stores/useGameStore";
import { GamePhase } from "../types";

const AnimatedText = animated(Text);

const WelcomeScreen = () => {
  const { setGamePhase } = useGameStore();
  const { camera } = useThree();
  const [showStartButton, setShowStartButton] = useState(false);
  
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.repeat.set(10, 10);
  grassTexture.wrapS = 1000;
  grassTexture.wrapT = 1000;
  
  const skyTexture = useTexture("/textures/sky.png");
  
  // Set camera position
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    
    // Show start button after a short delay
    const timer = setTimeout(() => {
      setShowStartButton(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [camera]);
  
  // Animation for title text
  const titleSpring = useSpring({
    from: { position: [0, 4, 0], scale: 0.5, opacity: 0 },
    to: { position: [0, 4, 0], scale: 1, opacity: 1 },
    config: { mass: 2, tension: 170, friction: 30 },
    delay: 300,
  });
  
  // Animation for subtitle text
  const subtitleSpring = useSpring({
    from: { position: [0, 2.5, 0], opacity: 0 },
    to: { position: [0, 2.5, 0], opacity: 1 },
    config: { mass: 1, tension: 200, friction: 20 },
    delay: 800,
  });
  
  // Animation for start button
  const buttonSpring = useSpring({
    from: { position: [0, 1, 0], scale: 0.7, opacity: 0 },
    to: { 
      position: [0, 1, 0], 
      scale: showStartButton ? 1 : 0.7, 
      opacity: showStartButton ? 1 : 0 
    },
    config: { mass: 1, tension: 180, friction: 20 },
  });
  
  // Floating animation for button
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (buttonRef.current) {
      buttonRef.current.position.y = 1 + Math.sin(t * 1.5) * 0.1;
    }
  });
  
  // Create refs for objects
  const buttonRef = React.useRef<THREE.Mesh>(null);
  
  return (
    <>
      {/* Sky backdrop */}
      <mesh position={[0, 0, -20]} scale={[40, 20, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={skyTexture} />
      </mesh>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} scale={[20, 20, 1]}>
        <planeGeometry />
        <meshStandardMaterial map={grassTexture} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      {/* Title */}
      <AnimatedText
        font="/fonts/inter.json"
        position={titleSpring.position}
        scale={titleSpring.scale}
        color="#424242"
        fontSize={1.5}
        maxWidth={10}
        lineHeight={1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={titleSpring.opacity}
      >
        Pet Adventure
      </AnimatedText>
      
      {/* Subtitle */}
      <AnimatedText
        font="/fonts/inter.json"
        position={subtitleSpring.position}
        color="#424242"
        fontSize={0.6}
        maxWidth={8}
        lineHeight={1.2}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={subtitleSpring.opacity}
      >
        Begin your journey with a new animal friend!
      </AnimatedText>
      
      {/* Start button */}
      <animated.group
        ref={buttonRef}
        position={buttonSpring.position}
        scale={buttonSpring.scale}
        material-transparent
        material-opacity={buttonSpring.opacity}
        onClick={() => setGamePhase(GamePhase.age_verification)}
      >
        <mesh>
          <cylinderGeometry args={[1.2, 1.2, 0.4, 32]} />
          <meshStandardMaterial color="#4FC3F7" />
        </mesh>
        <Text
          position={[0, 0, 0.21]}
          color="white"
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
        >
          START
        </Text>
      </animated.group>
      
      {/* Decorative elements */}
      <group position={[-4, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FFAB91" />
        </mesh>
      </group>
      
      <group position={[4, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#AED581" />
        </mesh>
      </group>
    </>
  );
};

export default WelcomeScreen;
