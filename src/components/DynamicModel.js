import { useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'

export function DynamicModel({ url, type }) {
  const modelRef = useRef()
  
  // Load models based on type
  const gltf = (type === 'glb' || type === 'gltf') ? useGLTF(url) : null
  const fbx = type === 'fbx' ? useLoader(FBXLoader, url) : null
  const obj = type === 'obj' ? useLoader(OBJLoader, url) : null

  useEffect(() => {
    if (fbx) {
      fbx.position.set(0, -2, 0)
      fbx.scale.set(0.001, 0.001, 0.001) // Adjust scaling as needed
      
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.needsUpdate = true
        }
      })

      const box = new THREE.Box3().setFromObject(fbx)
      const size = new THREE.Vector3()
      box.getSize(size)
      console.log('Model size:', size)
      console.log('Model position:', fbx.position)
    }
  }, [fbx])

  // Return appropriate JSX based on type
  if (type === 'glb' || type === 'gltf') {
    return (
      <group ref={modelRef} dispose={null}>
        <primitive object={gltf.scene} position={[0, 0, 0]} scale={[2, 2, 2]} />
      </group>
    )
  }

  if (type === 'fbx') {
    return (
      <group ref={modelRef}>
        <primitive object={fbx} dispose={null} />
      </group>
    )
  }

  if (type === 'obj') {
    return <primitive object={obj} ref={modelRef} />
  }

  return null
}