import "./styles.css";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";

import { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useCursor, Html, useProgress} from  '@react-three/drei'
import { AsciiEffect } from 'three-stdlib'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export default function App() {

   function AsciiRenderer({
  renderIndex = 1,
  bgColor = 'black',
  fgColor = 'white',  
  characters = ' hackerman',
  invert = true,
  color = false,
  resolution = 0.2
}) {
  // Reactive state
  const { size, gl, scene, camera } = useThree()
  const aspectRatio = size.width / size.height

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, { invert, color, resolution })
    effect.domElement.style.position = 'absolute'
    effect.domElement.style.top = '0px'
    effect.domElement.style.left = '0px'
    effect.domElement.style.pointerEvents = 'none'
    //effect.setSize(size.width, size.height / aspectRatio)
    return effect
  }, [characters, invert, color, aspectRatio, resolution])

  // Styling
  useLayoutEffect(() => {
    effect.domElement.style.color = fgColor
    effect.domElement.style.backgroundColor = bgColor
  }, [fgColor, bgColor])

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.style.opacity = '0'
    gl.domElement.parentNode.appendChild(effect.domElement)
    return () => {
      gl.domElement.style.opacity = '1'
      gl.domElement.parentNode.removeChild(effect.domElement)
    }
  }, [effect])

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height)
  }, [effect, size])

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera)
  }, renderIndex)

  // This component returns nothing, it is a purely logical
}
 
return (
      <Canvas camera={{ position: [0, 3, 0], rotation: [-Math.PI / 2, 0, 0], pixelRatio: window.devicePixelRatio }}>
      <color attach="background" args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Model />
          <OrbitControls target={[0, 0, 0]} />
          <AsciiRenderer fgColor="blue" bgColor="black" />
          </Suspense> 
      </Canvas>
  );
}
