import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { DynamicModel } from "./DynamicModel";
import { AsciiRenderer } from "./AsciiRenderer";

export function Scene({ modelUrl, modelType, theme, themes, isAscii }) {
  const { camera } = useThree();

  // Get current theme colors
  const currentTheme = themes[theme]

  useEffect(() => {
    // Ensure camera aspect ratio is set correctly on mount
    const container = camera.parent?.parent?.parent?.parent // Find the canvas container
    if (container) {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
    }
  }, [camera])

  return (
    <group>
      <color attach="background" args={[theme === 'dark' ? '#000000' : '#ffffff']} />
      
      <group position={[0, 0, 0]}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
        />
        <directionalLight 
          position={[-5, -5, -5]} 
          intensity={0.5} 
        />
      
        {/* Show default cube when no model is loaded */}
        {!modelUrl && (
          <mesh position={[0, 0, 0]} scale={1}>
            <boxGeometry args={[1, 1, 1, 32, 32, 32]} />
          </mesh>
        )}

        {/* Show uploaded model when available */}
        {modelUrl && (
          <DynamicModel 
            url={modelUrl} 
            type={modelType}
          />
        )}
      </group>

      <OrbitControls 
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        target={[0, 0, 0]}
        camera={camera}
      />
      
      <AsciiRenderer 
        fgColor={theme === 'dark' ? '#ffffff' : '#000000'}
        bgColor={theme === 'dark' ? '#000000' : '#ffffff'}
        resolution={0.2}
        characters=' .:-+*=%@#'
        invert={false}
        color={false}
        isAscii={isAscii}
        fontSize='16px'
        lineHeight='0.8'
      />
    </group>
  )
}