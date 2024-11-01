import { useEffect, useMemo, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { AsciiEffect } from 'three-stdlib'
import * as THREE from 'three'

export function AsciiRenderer({
  bgColor = '#000000',
  fgColor = '#ffffff',
  characters = '@%#*+=-:. ',
  invert = true,
  color = false,
  resolution = 0.15,
  isAscii = true,
  fontSize = '16px',
  lineHeight = '0.8'
}) {
  const { gl, scene, camera, size } = useThree()

  // Create ASCII effect
  const effect = useMemo(() => {
    const asciiEffect = new AsciiEffect(gl, characters, {
      invert,
      color,
      resolution
    })

    // Set initial size
    asciiEffect.setSize(size.width, size.height)
    
    // Style the ASCII canvas
    Object.assign(asciiEffect.domElement.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: bgColor,
      color: fgColor,
      fontFamily: 'monospace',
      whiteSpace: 'pre',
      margin: '0',
      fontSize: fontSize,       // Updated
      lineHeight: lineHeight    // Updated
    })

    return asciiEffect
  }, [gl, characters, invert, color, resolution, bgColor, fgColor, size, fontSize, lineHeight])

  // Handle mounting/unmounting
  useEffect(() => {
    const parent = gl.domElement.parentElement
    if (parent && isAscii) {
      parent.appendChild(effect.domElement)
      gl.domElement.style.display = 'none'
    }
    
    return () => {
      if (parent && isAscii) {
        parent.removeChild(effect.domElement)
        gl.domElement.style.display = 'block'
      }
    }
  }, [gl, effect, isAscii])

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      const newResolution = window.innerWidth < 600 ? 0.2 : resolution
      effect.setSize(size.width, size.height)
      effect.resolution = newResolution
      gl.setSize(size.width, size.height)
      
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = size.width / size.height
        camera.updateProjectionMatrix()
      }

      // Adjust font size and line height based on window size
      effect.domElement.style.fontSize = window.innerWidth < 600 ? '12px' : fontSize
      effect.domElement.style.lineHeight = window.innerWidth < 600 ? '0.6' : lineHeight
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [gl, effect, camera, size, resolution, fontSize, lineHeight])

  // Render loop
  useEffect(() => {
    const render = () => {
      if (isAscii) {
        effect.render(scene, camera)
      } else {
        gl.render(scene, camera)
      }
    }
    gl.setAnimationLoop(render)
    return () => {
      gl.setAnimationLoop(null)
    }
  }, [gl, scene, camera, effect, isAscii])

  return null // No JSX to render inside Canvas
}